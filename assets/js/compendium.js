
// First-pass refactor: extracted compendium engine to a dedicated file.

// ─────────────────────────────────────────────
// THE WORLD COMPENDIUM — Engine
// Glossary data loaded from shared glories.js
// To add/edit words: edit glories.js (both pages update)
// ─────────────────────────────────────────────

const CATEGORIES = [
  "Myself & I",
  "Origins",
  "Community & Culture",
  "Knowledge & Learning",
  "Power & Politics",
  "History & Civilization",
  "Further",
  "Not Classified"
];

const CATEGORY_COLORS = {
  "Myself & I":           "#d4a855",
  "Origins":              "#c87850",
  "Community & Culture":  "#4a9a70",
  "Knowledge & Learning": "#5878b8",
  "Power & Politics":     "#b05050",
  "History & Civilization": "#7858b0",
  "Further":              "#4888c8",
  "Not Classified":       "#888888"
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

let activeCategory = null;
let activeLetter   = null;
let searchQuery    = '';

function init() {
  document.getElementById('entry-count').textContent =
    glossary.length + ' entries · growing';

  // Category buttons — ALL first
  const catRow = document.getElementById('cat-row');

  const allBtn = document.createElement('button');
  allBtn.className = 'cat-btn active';
  allBtn.id = 'cat-all';
  allBtn.textContent = 'ALL';
  allBtn.onclick = () => clearAll();
  catRow.appendChild(allBtn);

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = cat;
    const col = CATEGORY_COLORS[cat] || '#888888';
    btn.style.cssText = `border-color:${col}44;color:${col};`;
    btn.addEventListener('mouseenter', () => { if (!btn.classList.contains('active')) btn.style.cssText = `border-color:${col};color:${col};`; });
    btn.addEventListener('mouseleave', () => { if (!btn.classList.contains('active')) btn.style.cssText = `border-color:${col}44;color:${col};`; });
    btn.onclick = () => {
      toggleCategory(cat, btn);
      document.querySelectorAll('.cat-btn[data-cat]').forEach(b => {
        const c = CATEGORY_COLORS[b.dataset.cat] || '#888888';
        if (b.classList.contains('active')) {
          b.style.cssText = `border-color:${c};color:${c};background:${c}18;`;
        } else {
          b.style.cssText = `border-color:${c}44;color:${c};`;
        }
      });
    };
    btn.dataset.cat = cat;
    catRow.appendChild(btn);
  });

  // Alpha buttons
  const alphaRow = document.getElementById('alpha-row');
  const usedLetters = new Set(glossary.map(e => e.word[0].toUpperCase()));
  ALPHABET.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'alpha-btn ' + (usedLetters.has(letter) ? 'has-entries' : 'no-entries');
    btn.textContent = letter;
    btn.id = 'alpha-' + letter;
    if (usedLetters.has(letter)) btn.onclick = () => toggleLetter(letter, btn);
    alphaRow.appendChild(btn);
  });

  // Search
  document.getElementById('search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    activeLetter = null;
    activeCategory = null;
    document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    render();
  });

  render();
}

function toggleCategory(cat, btn) {
  activeCategory = activeCategory === cat ? null : cat;
  activeLetter = null;
  searchQuery = '';
  document.getElementById('search').value = '';
  document.querySelectorAll('.alpha-btn, .cat-btn').forEach(b => b.classList.remove('active'));
  if (activeCategory) {
    btn.classList.add('active');
  } else {
    document.getElementById('cat-all').classList.add('active');
  }
  render();
}

function toggleLetter(letter, btn) {
  activeLetter = activeLetter === letter ? null : letter;
  activeCategory = null;
  searchQuery = '';
  document.getElementById('search').value = '';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
  if (activeLetter) btn.classList.add('active');
  render();
}

function clearAll() {
  activeCategory = null;
  activeLetter   = null;
  searchQuery    = '';
  document.getElementById('search').value = '';
  document.querySelectorAll('.cat-btn, .alpha-btn').forEach(b => b.classList.remove('active'));
  const allBtn = document.getElementById('cat-all');
  if (allBtn) allBtn.classList.add('active');
  render();
}

function getFiltered() {
  return glossary.filter(entry => {
    if (searchQuery) {
      return entry.word.toLowerCase().includes(searchQuery) ||
             entry.definition.toLowerCase().includes(searchQuery);
    }
    if (activeCategory) return entry.category === activeCategory;
    if (activeLetter)   return entry.word[0].toUpperCase() === activeLetter;
    return true;
  });
}

function render() {
  const filtered = getFiltered();
  const list = document.getElementById('glossary-list');
  const empty = document.getElementById('empty-state');
  const info  = document.getElementById('results-info');

  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'block';
    info.textContent = '';
    return;
  }
  empty.style.display = 'none';

  // Results info
  if (searchQuery || activeCategory || activeLetter) {
    info.textContent = filtered.length + ' word' + (filtered.length !== 1 ? 's' : '');
  } else {
    info.textContent = '';
  }

  // Group by letter
  const grouped = {};
  filtered.forEach(entry => {
    const letter = entry.word[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(entry);
  });

  Object.keys(grouped).sort().forEach(letter => {
    const group = document.createElement('div');
    group.className = 'letter-group';

    if (!searchQuery && !activeCategory) {
      const anchor = document.createElement('div');
      anchor.className = 'letter-anchor';
      anchor.id = 'letter-' + letter;
      anchor.textContent = '— ' + letter + ' —';
      group.appendChild(anchor);
    }

    grouped[letter].forEach(entry => {
      group.appendChild(buildEntry(entry));
    });

    list.appendChild(group);
  });

  // Scroll to letter anchor if letter filter active
  if (activeLetter) {
    const anchor = document.getElementById('letter-' + activeLetter);
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function buildEntry(entry) {
  const div = document.createElement('div');
  div.className = 'entry';

  if (window.location.hash === '#' + entry.word.toLowerCase().replace(/\s/g,'-')) {
    div.classList.add('open');
  }

  const pills = [
    { key: 'phonetic', label: 'How We Say It', color: '#d4a855', isPhonetic: true },
    { key: 'origin',   label: 'Where It Comes From', color: '#c87850' },
    { key: 'howUsed',  label: "How It's Been Used", color: '#7858b0' },
  ];

  const pillsHTML = pills.map(p => {
    if (!entry[p.key]) return '';
    return `<div class="pill-block" data-pill="${p.key}">
      <button class="pill-btn" onclick="event.stopPropagation();togglePill(this)" style="border-color:${p.color}55;color:${p.color};">
        <span class="pill-dot" style="background:${p.color};"></span>${p.label}
      </button>
      <div class="pill-content ${p.isPhonetic ? 'pill-phonetic' : ''}">${entry[p.key]}</div>
    </div>`;
  }).join('');

  div.innerHTML = `
    <div class="entry-main" onclick="toggleEntry(this)">
      <span class="entry-word"><span class="entry-toggle">&#x203A;</span>${entry.word}</span>
      <span class="entry-definition">${entry.definition}</span>
    </div>
    <div class="entry-detail">
      <div class="entry-pills">${pillsHTML}</div>
      <div class="entry-cat-label">Category</div>
      <div class="entry-tags">
        <span class="entry-tag" onclick="event.stopPropagation();filterByCat('${entry.category}')" style="border-color:${CATEGORY_COLORS[entry.category]||'#888'}66;color:${CATEGORY_COLORS[entry.category]||'#888'};">${entry.category}</span>
      </div>
    </div>
  `;
  return div;
}

function togglePill(btn) {
  const block = btn.parentElement;
  block.classList.toggle('open');
}

function toggleEntry(header) {
  const entry = header.parentElement;
  entry.classList.toggle('open');
}

function filterByCat(cat) {
  activeCategory = cat;
  activeLetter = null;
  searchQuery = '';
  document.getElementById('search').value = '';
  document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === cat);
  });
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle direct links: compendium.html#accident
function submitSuggestion() {
  const word = document.getElementById('sg-word').value.trim();
  const def  = document.getElementById('sg-def').value.trim();
  const conf = document.getElementById('sg-confirm');
  if (!word || !def) { conf.textContent = 'Please fill in both fields.'; return; }
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwgKSDLQT9c5L4sz4g791w4C_fT9M8zV9r3PlnzyFaAqhigD0Cg265fI17QLoEp-83Q/exec';
  fetch(ENDPOINT, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'compendium-suggestion', topic: word, why: def, sources: '', submitted: new Date().toISOString() })
  });
  document.getElementById('sg-word').value = '';
  document.getElementById('sg-def').value  = '';
  conf.textContent = '✓ Received — thank you.';
  setTimeout(() => { conf.textContent = ''; }, 4000);
}

window.addEventListener('load', () => {
  init();
  if (window.location.hash) {
    const target = window.location.hash.slice(1);
    const found = glossary.find(e =>
      e.word.toLowerCase().replace(/\s/g,'-') === target
    );
    if (found) {
      searchQuery = found.word.toLowerCase();
      render();
    }
  }
});
