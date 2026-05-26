#!/usr/bin/env node
/* eslint-disable */
// ─────────────────────────────────────────────────────────────
// USNow WORDS — Static Page Generator
// Reads glories.js (GLORY_DATA array), writes:
//   /word/index.html                          ← directory page
//   /word/[slug]/index.html                   ← one per glory
//   /sitemap-words.xml                        ← all word URLs
//
// Usage:    node scripts/build-words.js
// Or:       npm run build:words   (after wiring in package.json)
// ─────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

// ── Config ───────────────────────────────────────────────────
const SITE_URL    = 'https://www.usnow.app';
const SITE_NAME   = 'UsNow.app';
const PROJECT_NAME = 'The Living Word Almanack';
const OG_IMAGE    = '/apple-touch-icon.png';  // swap for a dedicated 1200x630 og.png anytime
const REPO_ROOT  = path.resolve(__dirname, '..');
const OUT_DIR    = path.join(REPO_ROOT, 'word');
const ASSETS_DIR = path.join(REPO_ROOT, 'word-assets');
const GLORIES_JS = path.join(REPO_ROOT, 'glories.js');

const CATEGORY_COLORS = {
  "Myself & I":             "#d4a855",
  "Origins":                "#c87850",
  "Community & Culture":    "#4a9a70",
  "Knowledge & Learning":   "#5878b8",
  "Power & Politics":       "#b05050",
  "History & Civilization": "#7858b0",
  "Even Further Back":      "#4888c8",
  "Not Classified":         "#888888"
};

// ── Load glories.js ──────────────────────────────────────────
// The file uses `const GLORY_DATA = [...]` without module.exports,
// so we evaluate it in a sandbox to extract the array.
function loadGlories() {
  const src = fs.readFileSync(GLORIES_JS, 'utf8');
  const sandbox = {};
  // eslint-disable-next-line no-new-func
  const fn = new Function('sandbox', src + '\nsandbox.GLORY_DATA = GLORY_DATA;');
  fn(sandbox);
  if (!Array.isArray(sandbox.GLORY_DATA)) {
    throw new Error('GLORY_DATA not found in glories.js');
  }
  return sandbox.GLORY_DATA;
}

// ── Utilities ────────────────────────────────────────────────
const slugify = (word) =>
  word.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

const escapeHtml = (s = '') =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');

const stripTags = (s = '') => s.replace(/<[^>]+>/g, '');

// First ~155 chars of definition, for meta description.
const buildDescription = (definition) => {
  const clean = stripTags(definition).replace(/\s+/g, ' ').trim();
  if (clean.length <= 155) return clean;
  // Cut at last word boundary before 155 chars.
  const cut = clean.slice(0, 152);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut) + '…';
};

// ── Cross-reference linking ──────────────────────────────────
//
// On the new word pages we link in TWO ways:
//
// 1. Explicit `(see X)` / `(see also X)` / `(compare with X)` parentheticals
//    in the definition — these are the editorial cross-refs Jon already
//    placed in glories.js. Honored wherever they appear.
//
// 2. Auto-link every glory-word matched in:
//      - the definition
//      - the howUsed section
//    Rules:
//      • first occurrence per section only (subsequent stay plain text)
//      • never link the page's own headword to itself
//      • whole-word, case-insensitive match (matches glory-highlights.js)
//      • skip text already inside <em> tags (those are etymology/foreign
//        source words OR explicit see-also targets already handled)
//      • skip text already inside an <a> tag (don't double-link)
//
// Origin (etymology) and phonetic sections are NEVER auto-linked.

function buildGloryLookup(glories) {
  // Map of lowercased-word -> { canonicalWord, slug }
  const map = new Map();
  for (const g of glories) {
    map.set(g.word.toLowerCase(), { word: g.word, slug: slugify(g.word) });
  }
  return map;
}

// Match (see X), (see also X), (compare with X) parentheticals.
// Inside, transform <em>Word</em> into an internal link if the word
// is in the glories map; otherwise keep the italic styling.
function linkifySeeAlso(html, gloryMap, selfSlug) {
  return html.replace(
    /\(\s*(see also|see|compare with)\b([^)]*)\)/gi,
    (full, lead, body) => {
      const transformed = body.replace(
        /<em>([^<]+)<\/em>/g,
        (_, word) => {
          const entry = gloryMap.get(word.toLowerCase());
          if (!entry) return `<em>${word}</em>`;
          if (entry.slug === selfSlug) return `<em>${word}</em>`;
          return `<a class="glory-ref" href="/word/${entry.slug}/">${word}</a>`;
        }
      );
      return '(' + lead + transformed + ')';
    }
  );
}

// Auto-link first occurrence per section of each matching glory word.
// Skips text inside <em>, <a>, or anywhere that already has see-also
// markup. Skips the page's own headword.
function autoLinkGlories(html, gloryMap, selfSlug, selfWordLower) {
  // Build alternation regex from longest to shortest so multi-word
  // entries (e.g. "American Dream") match before single-word fragments.
  const words = Array.from(gloryMap.keys())
    .filter(w => w !== selfWordLower)
    .sort((a, b) => b.length - a.length);
  if (!words.length) return html;

  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');

  // Track which words have already been linked in this section.
  const linkedInSection = new Set();

  // We walk the html string, only transforming text segments that are
  // NOT inside <em>, <a>, or tag attributes. Simple state-machine
  // approach: track when we're inside one of those tags.
  let result = '';
  let i = 0;
  let skipDepth = 0; // >0 when inside <em>, <a>, etc.
  const skipTags = ['em', 'a'];

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      // Tail: a plain text segment.
      result += skipDepth > 0
        ? html.slice(i)
        : transformSegment(html.slice(i));
      break;
    }

    // Text segment before the next tag.
    const segment = html.slice(i, lt);
    result += skipDepth > 0 ? segment : transformSegment(segment);

    // Find end of this tag.
    const gt = html.indexOf('>', lt);
    if (gt === -1) { result += html.slice(lt); break; }

    const tag = html.slice(lt, gt + 1);
    result += tag;

    // Update skipDepth based on tag.
    const tagMatch = tag.match(/^<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)/);
    if (tagMatch) {
      const isClose = tagMatch[1] === '/';
      const tagName = tagMatch[2].toLowerCase();
      if (skipTags.includes(tagName)) {
        skipDepth += isClose ? -1 : 1;
        if (skipDepth < 0) skipDepth = 0;
      }
    }

    i = gt + 1;
  }

  return result;

  function transformSegment(text) {
    if (!text) return text;
    return text.replace(re, (match) => {
      const key = match.toLowerCase();
      if (linkedInSection.has(key)) return match;
      const entry = gloryMap.get(key);
      if (!entry) return match;
      linkedInSection.add(key);
      return `<a class="glory-link" href="/word/${entry.slug}/">${match}</a>`;
    });
  }
}

// ── Header (shared site nav) ─────────────────────────────────
// Matches the canonical USNow nav style from index.css:
// 30px ticker bar + 44px nav bar with US/NOW.app wordmark and pill links.
function renderHeader(active) {
  // active: 'words' | null — controls active-state styling.
  const pill = (label, href, isActive) =>
    `<a class="nav-pill${isActive ? ' active' : ''}" href="${href}">${label}</a>`;

  return `
<div id="ticker" aria-hidden="true">
  <div id="ticker-inner">
    <span class="ticker-item">◦ The question is the answer.</span>
    <span class="ticker-item">◦ Every word is a doorway.</span>
    <span class="ticker-item">◦ Start anywhere.</span>
    <span class="ticker-item">◦ The record is still open.</span>
    <span class="ticker-item">◦ The question is the answer.</span>
    <span class="ticker-item">◦ Every word is a doorway.</span>
    <span class="ticker-item">◦ Start anywhere.</span>
    <span class="ticker-item">◦ The record is still open.</span>
  </div>
</div>
<nav role="navigation" aria-label="USNow">
  <a class="nav-logo" href="/" aria-label="USNow home">
    <span class="us">US</span><span class="now">NOW</span><span class="app">.app</span>
  </a>
  <div class="nav-links">
    ${pill('TREE',       '/tree.html',         active === 'tree')}
    ${pill('SCALE',      '/index.html',        active === 'scale')}
    ${pill('COMPENDIUM', '/compendium.html',   active === 'compendium')}
    ${pill('WORDS',      '/word/',             active === 'words')}
  </div>
</nav>
`.trim();
}

const FOOTER_HTML = `
<footer class="page-footer">
  <div class="footer-text">The Living Word Almanack</div>
  <div class="footer-tagline">©2026 All rights reserved — UsNow.app</div>
</footer>`.trim();

// ── Page template ────────────────────────────────────────────
function renderWordPage(entry, gloryMap, glories) {
  const slug      = slugify(entry.word);
  const selfLower = entry.word.toLowerCase();
  const url       = `${SITE_URL}/word/${slug}/`;
  const title     = `${entry.word} · ${PROJECT_NAME} · ${SITE_NAME}`;
  const ogTitle   = `${entry.word} · ${SITE_NAME}`;
  const desc      = buildDescription(entry.definition);
  const catColor  = CATEGORY_COLORS[entry.category] || '#888888';

  // Transform body fields.
  // Definition: explicit see-also linkified FIRST, then auto-link glories.
  let defHTML = linkifySeeAlso(entry.definition, gloryMap, slug);
  defHTML = autoLinkGlories(defHTML, gloryMap, slug, selfLower);

  // Origin: leave untouched. <em> in here is etymology source words.
  const originHTML = entry.origin || '';

  // How used: see-also pass, then auto-link.
  let howHTML = entry.howUsed
    ? linkifySeeAlso(entry.howUsed, gloryMap, slug)
    : '';
  if (howHTML) howHTML = autoLinkGlories(howHTML, gloryMap, slug, selfLower);

  // Prev / next alphabetical neighbors.
  const sorted = [...glories].sort((a, b) =>
    a.word.toLowerCase().localeCompare(b.word.toLowerCase())
  );
  const idx = sorted.findIndex(g => g.word === entry.word);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // Other words in same category — show up to 8, excluding self.
  const sameCat = glories
    .filter(g => g.category === entry.category && g.word !== entry.word)
    .slice(0, 8);

  // ── Structured data (Schema.org DefinedTerm) ───────────────
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": entry.word,
    "description": stripTags(entry.definition),
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": PROJECT_NAME,
      "url": `${SITE_URL}/word/`
    },
    "termCode": slug,
    "url": url,
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${url}">
<meta name="author" content="${SITE_NAME}">
<meta name="publisher" content="${SITE_NAME}">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${escapeHtml(ogTitle)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}${OG_IMAGE}">

<!-- Twitter -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escapeHtml(ogTitle)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE}">

<!-- Icons -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" href="/apple-touch-icon.png">

<!-- Fonts (same stack as compendium) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/word-assets/word.css">

<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>
</head>
<body class="word-page" data-category="${escapeHtml(entry.category)}" style="--cat-color:${catColor};">

${renderHeader('words')}

<main class="word-main">
  <article class="word-article">

    <div class="word-eyebrow">
      <a href="/word/" class="eyebrow-link">UsNow.app · The Living Word Almanack</a>
      <span class="eyebrow-sep">·</span>
      <span class="word-cat-eyebrow">${escapeHtml(entry.category)}</span>
    </div>

    <h1 class="word-title">${escapeHtml(entry.word)}</h1>

    <div class="word-definition">${defHTML}</div>

    ${entry.phonetic ? `
    <section class="word-section">
      <div class="section-label">
        <span class="section-dot" style="background:#d4a855;"></span>
        How We Say It
      </div>
      <div class="section-content phonetic-content">${entry.phonetic}</div>
    </section>` : ''}

    ${originHTML ? `
    <section class="word-section">
      <div class="section-label">
        <span class="section-dot" style="background:#c87850;"></span>
        Where It Comes From
      </div>
      <div class="section-content">${originHTML}</div>
    </section>` : ''}

    ${howHTML ? `
    <section class="word-section">
      <div class="section-label">
        <span class="section-dot" style="background:#7858b0;"></span>
        How It's Been Used
      </div>
      <div class="section-content">${howHTML}</div>
    </section>` : ''}

    <section class="word-meta">
      <div class="meta-label">Category</div>
      <div class="meta-cat" style="border-color:${catColor}66;color:${catColor};">
        ${escapeHtml(entry.category)}
      </div>
    </section>

  </article>

  <nav class="word-pagination" aria-label="Word navigation">
    ${prev ? `
    <a class="page-prev" href="/word/${slugify(prev.word)}/">
      <span class="page-arrow">←</span>
      <span class="page-direction">Previous</span>
      <span class="page-word">${escapeHtml(prev.word)}</span>
    </a>` : '<span class="page-spacer"></span>'}
    <a class="page-index" href="/word/">All Words</a>
    ${next ? `
    <a class="page-next" href="/word/${slugify(next.word)}/">
      <span class="page-direction">Next</span>
      <span class="page-word">${escapeHtml(next.word)}</span>
      <span class="page-arrow">→</span>
    </a>` : '<span class="page-spacer"></span>'}
  </nav>

  ${sameCat.length > 0 ? `
  <section class="related-section">
    <div class="related-label">More in ${escapeHtml(entry.category)}</div>
    <ul class="related-list">
      ${sameCat.map(g => `
        <li><a href="/word/${slugify(g.word)}/">${escapeHtml(g.word)}</a></li>
      `).join('')}
    </ul>
  </section>` : ''}

</main>

${FOOTER_HTML}

</body>
</html>
`;
}

// ── /word/ index page ────────────────────────────────────────
function renderIndexPage(glories) {
  const sorted = [...glories].sort((a, b) =>
    a.word.toLowerCase().localeCompare(b.word.toLowerCase())
  );

  // Build the alphabetical list, grouped by letter.
  const grouped = {};
  for (const g of sorted) {
    const letter = g.word[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(g);
  }

  const letters = Object.keys(grouped).sort();

  const listHTML = letters.map(letter => `
    <section class="letter-section" id="letter-${letter}">
      <div class="letter-heading">— ${letter} —</div>
      <ul class="word-list">
        ${grouped[letter].map(g => `
          <li class="word-list-item">
            <a href="/word/${slugify(g.word)}/" class="word-list-link">
              <span class="word-list-word">${escapeHtml(g.word)}</span>
              <span class="word-list-def">${stripTags(g.definition)}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>
  `).join('');

  const desc = `${PROJECT_NAME} — ${glories.length} entries on the words that shape how we think about truth, power, identity, history, and ourselves. Each one with its phonetic, etymology, and contemporary usage. Plain, unflinching, never sanitized. ${SITE_NAME} · ©2026.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${PROJECT_NAME} · ${SITE_NAME}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${SITE_URL}/word/">
<meta name="author" content="${SITE_NAME}">
<meta name="publisher" content="${SITE_NAME}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${PROJECT_NAME} · ${SITE_NAME}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${SITE_URL}/word/">
<meta property="og:image" content="${SITE_URL}${OG_IMAGE}">

<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${PROJECT_NAME} · ${SITE_NAME}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE}">

<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" href="/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/word-assets/word.css">
</head>
<body class="words-index">

${renderHeader('words')}

<main class="index-main">

  <header class="index-header">
    <div class="index-eyebrow">UsNow.app</div>
    <h1 class="index-title">The Living Word <em>Almanack</em></h1>
    <div class="index-subtitle">${glories.length} entries · alphabetical · each its own page</div>
  </header>

  <div class="index-controls">
    <input type="search" id="word-search" placeholder="Filter words…" autocomplete="off" spellcheck="false" aria-label="Filter words">
    <div class="index-alpha" id="index-alpha">
      ${letters.map(l => `<a href="#letter-${l}" class="alpha-jump">${l}</a>`).join('')}
    </div>
  </div>

  <div class="index-list" id="index-list">
    ${listHTML}
  </div>

  <div class="index-empty" id="index-empty" hidden>No words match.</div>

</main>

${FOOTER_HTML}

<script src="/word-assets/word-index.js"></script>
</body>
</html>
`;
}

// ── sitemap-words.xml ────────────────────────────────────────
function renderSitemap(glories) {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    `<url><loc>${SITE_URL}/word/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...glories.map(g => {
      const slug = slugify(g.word);
      return `<url><loc>${SITE_URL}/word/${slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
    })
  ].join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">
${urls}
</urlset>
`;
}

// ── Build ────────────────────────────────────────────────────
function build() {
  console.log('USNow Words generator');
  console.log('─────────────────────');

  const glories = loadGlories();
  console.log(`Loaded ${glories.length} glories from glories.js`);

  const gloryMap = buildGloryLookup(glories);

  // Wipe and recreate /word/
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // One page per glory
  let count = 0;
  const slugsSeen = new Set();
  for (const g of glories) {
    const slug = slugify(g.word);
    if (slugsSeen.has(slug)) {
      console.warn(`  ⚠ duplicate slug "${slug}" for word "${g.word}" — skipping`);
      continue;
    }
    slugsSeen.add(slug);

    const dir = path.join(OUT_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderWordPage(g, gloryMap, glories));
    count++;
  }
  console.log(`Generated ${count} word pages → /word/[slug]/index.html`);

  // /word/ index
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), renderIndexPage(glories));
  console.log(`Generated /word/index.html`);

  // sitemap-words.xml
  const sitemapPath = path.join(REPO_ROOT, 'sitemap-words.xml');
  fs.writeFileSync(sitemapPath, renderSitemap(glories));
  console.log(`Generated sitemap-words.xml (${glories.length + 1} URLs)`);

  console.log('─────────────────────');
  console.log('Done.');
}

if (require.main === module) {
  try {
    build();
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

module.exports = { build, slugify };
