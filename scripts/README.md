# USNow Words — Static Page Generator

One HTML page per glory, crawlable, fast, no JS required to read.

## What this is

A small Node.js build script that reads your existing `glories.js` and
generates a full set of static HTML pages — one per entry — plus an
alphabetical directory at `/word/` and a sitemap.

Drops straight into the **USNow-App** repo. Doesn't touch any of your
existing files. Coexists with the compendium; doesn't replace it.

## What it produces

```
USNow-App/
├── word/
│   ├── index.html               ← the /word/ directory page (all 214)
│   ├── accident/index.html
│   ├── accountable/index.html
│   ├── addiction/index.html
│   └── … (one folder per glory)
├── word-assets/
│   ├── word.css                 ← shared stylesheet for all word pages
│   └── word-index.js            ← live-filter on the directory page
├── sitemap-words.xml            ← all word URLs for search engines
├── glories.js                   ← unchanged, your source of truth
├── apple-touch-icon.png         ← unchanged
├── package.json                 ← adds `npm run build:words`
└── scripts/
    └── build-words.js           ← the generator
```

## How to deploy

1. **Copy these into your USNow-App repo** at the root:
   - `scripts/build-words.js`
   - `word-assets/` (the folder with `word.css` and `word-index.js`)
   - `package.json` (or merge the `scripts` block into your existing one)

2. **Run the build**:
   ```bash
   npm run build:words
   ```
   This regenerates `/word/` from `glories.js`. Takes under a second.

3. **Commit and push**. Both `/word/` and `sitemap-words.xml` should be
   committed — they're the deployed site.

4. **Whenever you edit glories.js**, run `npm run build:words` again
   before committing. The script wipes `/word/` clean and rebuilds.

## Adding the WORDS pill to your other pages

The new pages already include the full site nav with a Words pill.
For the compendium, tree, and scale pages to match, add a `WORDS`
link to their existing nav. The styling is in `word.css` if you
want to mirror it; or paste this anchor wherever your existing
nav links live:

```html
<a class="nav-pill" href="/word/">WORDS</a>
```

(On the page that IS Words, the nav-pill renders with `class="nav-pill active"` —
the script handles this automatically.)

## What the script does — the rules

**Slug generation**
- Lowercase, hyphenated, URL-safe.
- `American Dream` → `/word/american-dream/`
- `AI` → `/word/ai/`
- `Don't` → `/word/dont/`

**Cross-linking inside body text**
- The page's **definition** and **how it's been used** sections get
  glory-words auto-linked: every word matching a glory entry becomes a
  clickable internal link.
- **First occurrence per section only.** "Power" appearing four times
  in one definition gets one link, not four.
- **Never self-references.** The Truth page does not link "truth" to
  itself anywhere on the page.
- **Origin (etymology)** and **phonetic** sections are NEVER auto-linked
  — those italics are Latin/Greek source words, not glory references.
- **Explicit `(see X)` / `(see also X)` / `(compare with X)`** parentheticals
  inside definitions are honored separately and styled in amber italic
  (the `glory-ref` style), matching the compendium.

**Each page contains**
- Proper `<title>` and `<meta name="description">`
- Canonical URL
- Open Graph and Twitter card tags
- Schema.org `DefinedTerm` structured data (JSON-LD)
- Apple touch icon + favicon
- Full site nav (ticker + USNOW.app wordmark + Tree/Scale/Compendium/Words pills)
- Headword, definition, three sections, category, prev/next neighbors,
  related words from the same category, footer

**Each page works without JavaScript.**
- Real `<a href>` tags everywhere — no JS-only navigation.
- Search engines and LLMs can crawl the full network from any page.
- The `/word/` directory's live filter is the only JS, and the page
  still works fine without it (the full list renders server-side).

## OG image

Currently uses `apple-touch-icon.png` as the social preview. When you
want a proper 1200×630 OG card, drop it in the repo as e.g. `og.png`
and update one line at the top of `scripts/build-words.js`:

```js
const OG_IMAGE = '/og.png';
```

Then `npm run build:words` again.

## File counts (after this build)

- 214 word pages
- 1 directory page (`/word/`)
- 215 URLs in the sitemap
- Total `/word/` directory size: ~2.6 MB

Lightweight. Static. Deploys on GitHub Pages or Vercel with zero config.
