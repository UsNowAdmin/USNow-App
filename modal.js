/* ============================================================================
   UsNow — Shared Modal Engine  ·  modal.js   (STEP 2a: approved layout)
   ----------------------------------------------------------------------------
   Builds on the Step-1 extraction. Same resolver (id -> label-fallback) and
   _cardPath breadcrumb. New in 2a:
     - PEEK above the title: "Other Branches And Connections" (each word
       conditional; "and" only when both; hidden at zero), jumps to first
       populated section. Computed live from topPills/bottomPills.
     - Reading-first order: WHAT IT IS before the pills.
     - Glowing orb-dot pills in a grid; labels never fracture mid-word.
       GO FURTHER = card color; ON-SITE CONNECTIONS = destination color.
     - OFF-SITE RESOURCES (renamed from RESOURCES).
     - Footer: canonical home (from _cardPath) + readable id + copy-URL from
       _idToSlug (sitemap-true), falling back to a label slug if id is absent.
   Host still provides: LAYERS, the modal DOM (now incl. #modal-peek),
   applyGlories, applySearchHighlight, and Tree nav (history, renderTree,
   renderRoot, updateNav, currentItems, activeSearchQuery). slugmap.js provides
   _idToSlug and must load BEFORE this file.
   NOT in 2a (by design): Thoughts/Log (2b), unified nav stack (3).
   ============================================================================ */

const _cardIndex = {};
const _cardPath = {};
let _currentCard = null;   // set by openModal; read by the Thoughts panel
let _journey = [];         // the path of cards opened this session (header breadcrumb)
let _trail = [];           // silent in-memory log of every card opened (NOT tracking; for later opt-in)

var _cardPathDesc = {};   // tracks the desc length behind each recorded home
function buildCardPath() {
  _cardPathDesc = {};
  // A card's canonical home = the spine path to the occurrence that CARRIES ITS
  // DESCRIPTION (the real card), not a desc-less stub. Mirrors buildCardIndex's
  // richest-desc-wins rule, so home always points where the content actually lives.
  // This fixes nodes placed as a stub top-pill in one layer but authored as an orb
  // in another (e.g. Law, Religion) — no data surgery needed.
  function record(id, path, descLen) {
    if (_cardPath[id] === undefined || descLen > (_cardPathDesc[id] || 0)) {
      _cardPath[id] = path; _cardPathDesc[id] = descLen;
    }
  }
  LAYERS.forEach(layer => {
    record(layer.id, layer.label, (layer.desc || '').length);
    function walk(items, path) {
      (items || []).forEach(item => {
        if (!item || !item.id) return;
        const p = path
          ? path + ' \u203A ' + (item.label || '').replace(/\n/g, ' ')
          : (item.label || '').replace(/\n/g, ' ');
        record(item.id, p, (item.desc || '').length);
        walk(item.topPills, p);
        // NOTE: do NOT walk bottomPills — those are cross-links to cards that
        // live elsewhere; including them would assign a wrong canonical home.
      });
    }
    walk(layer.topPills, layer.label);
    walk(layer.orbs, layer.label);
  });
}

function buildCardIndex() {
  function walk(items) {
    items.forEach(item => {
      if (!item || !item.id) return;
      const existing = _cardIndex[item.id];
      const existingDesc = (existing && existing.desc) ? existing.desc.length : 0;
      const newDesc = item.desc ? item.desc.length : 0;
      if (!existing || newDesc > existingDesc) _cardIndex[item.id] = item;
      if (item.topPills) walk(item.topPills);
      if (item.bottomPills) walk(item.bottomPills);
      if (item.orbs) walk(item.orbs);
    });
  }
  LAYERS.forEach(layer => {
    _cardIndex[layer.id] = layer;
    walk(layer.topPills || []);
    walk(layer.orbs || []);
  });
}

/* ---- helpers ------------------------------------------------------------- */
// peek label: presence only, no count; "and" only when both; null at zero
function _peekLabel(top, bottom) {
  const hasB = (top && top.length) > 0;
  const hasC = (bottom && bottom.length) > 0;
  if (!hasB && !hasC) return null;
  const parts = [];
  if (hasB) parts.push('Branches');
  if (hasC) parts.push('Connections');
  return 'Other ' + parts.join(' And ');
}
// sitemap-true slug: _idToSlug wins; fall back to a label slug
function _slugFor(item) {
  if (typeof _idToSlug !== 'undefined' && item.id && _idToSlug[item.id]) return _idToSlug[item.id];
  return (item.label || '').toString().toLowerCase()
    .replace(/'/g, '').replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function _pillHTML(label, color) {
  const long = (label || '').length > 14 ? ' long' : '';
  return `<span class="usn-pill${long}" style="--pc:${color}" data-pill-id="">` +
         `<span class="usn-dot" style="--pc:${color}"></span>${label}</span>`;
}
// open a card or layer by its label (used by footer canonical-home jumps)
function _openByLabel(label, nav) {
  const L = (label || '').replace(/&quot;/g,'"').trim().toUpperCase();
  const layer = (typeof LAYERS !== 'undefined') && LAYERS.find(l => (l.label||'').toUpperCase() === L);
  if (layer) { openModal(layer, null, nav); return; }
  const card = Object.values(_cardIndex).find(c => (c.label||'').replace(/\n/g,' ').toUpperCase() === L);
  if (card) openModal(card, null, nav);
}

// jump to the first section below the description (GO FURTHER / ON-SITE / OFF-SITE),
// or, on a bare card, to the end of the description. Always does *something* sensible.
function _peekJumpFirst() {
  const z = document.querySelector('#modal-body .usn-zone');
  const fallback = document.querySelector('#modal-body .desc-dash')
                || document.querySelector('#modal-body .modal-desc');
  const el = z || fallback;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- openModal ----------------------------------------------------------- */
function openModal(item, crumbLabels, nav) {
  nav = nav || 'reset';   // 'reset' (fresh journey) | 'continue' (push) | 'preserve'
  // resolve by id, then by label (auto-heals repoint stubs)
  if (item.id && _cardIndex[item.id]) {
    const canonical = _cardIndex[item.id];
    item = { ...canonical, color: canonical.color || item.color };
  }
  if (!item.desc || item.desc.length < 10) {
    const label = (item.label || '').replace(/\n/g, ' ').trim().toLowerCase();
    const byLabel = Object.values(_cardIndex).find(c =>
      c.desc && c.desc.length > 10 &&
      (c.label || '').replace(/\n/g, ' ').trim().toLowerCase() === label
    );
    if (byLabel) item = { ...byLabel, color: byLabel.color || item.color };
  }
  _currentCard = item;   // remember the active card for Thoughts/The Log
  _trail.push({ id: item.id || null, label: (item.label || '').replace(/\n/g, ' '), time: Date.now() });
  if (nav === 'continue') {
    if (!_journey.length || _journey[_journey.length - 1].id !== item.id) _journey.push(item);
  } else if (nav !== 'preserve') {
    _journey = [item];   // 'reset' — a fresh journey starts here
  }
  // top-left button: BACK when there's a trail to step back through, else CLOSE
  const _closeBtn = document.getElementById('modal-close');
  if (_closeBtn) _closeBtn.innerHTML = (_journey.length > 1) ? '\u2190 BACK' : '\u2715 CLOSE';

  const color = item.color || '#888';
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);

  const card = document.getElementById('modal-card');
  card.style.background = `linear-gradient(160deg, rgba(${r},${g},${b},0.12) 0%, #0c1020 100%)`;
  card.style.border = `1px solid rgba(${r},${g},${b},0.3)`;
  // expose card color to step2.css
  card.style.setProperty('--c', color);
  card.style.setProperty('--cg', `rgba(${r},${g},${b},0.5)`);

  document.getElementById('modal-colorbar').style.background = color;

  // ---- TOP breadcrumb = CANONICAL HOME (where the card lives); click any ancestor to jump ----
  const crumbEl = document.getElementById('modal-crumb');
  const homeStr = (item.id && _cardPath[item.id]) ? _cardPath[item.id] : (item.label || '');
  // ancestors only — drop the final segment (it's the current card, shown in the title below)
  const ancestors = homeStr.split(' \u203A ').slice(0, -1);
  if (ancestors.length) {
    crumbEl.style.display = 'block';
    crumbEl.style.marginBottom = '8px';
    crumbEl.innerHTML = ancestors.map(p => {
      const lbl = (p || '').replace(/\n/g, ' ');
      return `<span class="modal-crumb-part" data-home="${lbl.replace(/"/g,'&quot;')}" style="cursor:pointer">${lbl}</span>`;
    }).join('<span class="modal-crumb-sep"> \u203A </span>');
    crumbEl.querySelectorAll('.modal-crumb-part[data-home]').forEach(seg => {
      seg.addEventListener('click', () => _openByLabel(seg.dataset.home, 'reset'));
    });
  } else {
    crumbEl.innerHTML = '';
    crumbEl.style.display = 'none';   // top-level layer: no ancestors, nothing to show
  }

  // ---- PEEK (above title) — CONSTANT on every card: branches (Tree) + connections (Scale) ----
  const top = item.topPills || [];
  // layer cards merge their orbs into the bottom pills (auto "topics in this layer")
  const isLayer = (typeof LAYERS !== 'undefined') && LAYERS.some(l => l.id === item.id);
  let bottom = item.bottomPills ? item.bottomPills.slice() : [];
  if (isLayer && item.orbs && item.orbs.length) {
    const orbPills = item.orbs.map(o => ({ id: o.id, label: (o.label || '').replace(/\n/g, ' '), color: o.color }));
    bottom = [...orbPills, ...bottom];
  }
  document.getElementById('modal-card').classList.toggle('layer-card', !!isLayer);
  const peekEl = document.getElementById('modal-peek');
  peekEl.style.display = 'block';
  peekEl.innerHTML =
    `<div class="peek">` +
      `<span class="peek-label">Other Branches And Connections</span><span class="peek-arrow"></span>` +
    `</div><div class="peek-dash"></div>`;
  peekEl.querySelector('.peek').addEventListener('click', _peekJumpFirst);

  // ---- title + sub (sub carries the layer field line) ----
  document.getElementById('modal-title').textContent = item.label || '';
  const subEl = document.getElementById('modal-sub');
  subEl.textContent = item.sub || item.time || '';
  subEl.style.display = (item.sub || item.time) ? 'block' : 'none';

  // ---- body: READING FIRST, then pills, then footer ----
  let body = '';

  // Dash where "WHAT IT IS" used to be (between title and description), then the prose
  if (item.desc) {
    body += `<div class="desc-dash"></div>` +
            `<div class="modal-desc">${item.desc.split(/\n\n+/).map(p => '<p>' + p.trim() + '</p>').join('')}</div>` +
            `<div class="desc-dash"></div>`;
  }

  // GO FURTHER (card color)
  if (top.length) {
    body += `<div class="usn-zone" id="usn-gf"><div class="modal-section">GO FURTHER</div><div class="usn-grid">`;
    top.forEach(p => { body += _pillHTML(p.label, color).replace('data-pill-id=""', `data-pill-id="${p.id}"`); });
    body += `</div></div>`;
  }

  // ON-SITE CONNECTIONS (destination color resolved by id)
  if (bottom.length) {
    body += `<div class="usn-zone" id="usn-onsite"><div class="modal-section">${isLayer ? 'OTHER TOPICS IN THIS LAYER' : 'OTHER ON-SITE CONNECTIONS'}</div><div class="usn-grid">`;
    bottom.forEach(p => {
      const resolved = _cardIndex[p.id] || p;
      const pc = resolved.color || p.color || color;
      body += _pillHTML(resolved.label || p.label, pc).replace('data-pill-id=""', `data-pill-id="${p.id}"`);
    });
    body += `</div></div>`;
  }

  // OFF-SITE RESOURCES (quiet external)
  if (item.links && item.links.length) {
    body += `<div class="usn-zone"><div class="modal-section">OFF-SITE RESOURCES</div><div class="usn-res-row">`;
    item.links.forEach(link => {
      const em = link.emoji ? `<span>${link.emoji}</span>` : '';
      const tag = link.tag ? `<span class="tag">${link.tag}</span>` : '';
      body += `<a class="usn-res" href="${link.url}" target="_blank" rel="noopener">${em}<span>${link.label}</span>${tag}</a>`;
    });
    body += `</div></div>`;
  }

  // FOOTER: the JOURNEY (path taken this session; grows freely; click to go back) + id/url
  let journeyHTML = '';
  if (_journey.length > 1) {
    journeyHTML = `<div class="usn-journey">` + _journey.map((c, i) => {
      const lbl = (c.label || '').replace(/\n/g, ' ');
      return (i === _journey.length - 1)
        ? `<span class="journey-cur">${lbl}</span>`
        : `<span class="journey-seg" data-jidx="${i}" style="cursor:pointer">${lbl}</span>`;
    }).join('<span class="journey-sep"> \u203A </span>') + `</div>`;
  }
  const slug = _slugFor(item);
  body += `<div class="usn-foot">` +
            journeyHTML +
            `<div><span class="id">${item.id || ''}</span> \u00B7 ` +
            `<span class="url" data-url="https://usnow.app/#${slug}">usnow.app/#${slug}</span></div>` +
          `</div>`;

  const bodyEl = document.getElementById('modal-body');
  bodyEl.innerHTML = body;
  card.scrollTop = 0;

  // glossary highlight (Tree inline helper)
  // glossary scans the DESCRIPTION ONLY — never pills, footer, or labels
  const _descEl = bodyEl.querySelector('.modal-desc');
  if (typeof applyGlories === 'function' && _descEl) applyGlories(_descEl);
  if (typeof applySearchHighlight === 'function' &&
      typeof activeSearchQuery !== 'undefined' &&
      activeSearchQuery && activeSearchQuery.length >= 3) {
    applySearchHighlight(bodyEl, activeSearchQuery);
  }

  // pill clicks -> open that pill's card
  bodyEl.querySelectorAll('.usn-pill[data-pill-id]').forEach(p => {
    p.addEventListener('click', () => {
      const resolved = _cardIndex[p.dataset.pillId];
      if (resolved) openModal(resolved, null, 'continue');
    });
  });

  // footer journey segments -> step back to that card in the path
  bodyEl.querySelectorAll('.usn-foot .journey-seg').forEach(seg => {
    seg.addEventListener('click', () => {
      const i = +seg.dataset.jidx;
      const target = _journey[i];
      _journey = _journey.slice(0, i + 1);
      openModal(target, null, 'preserve');
    });
  });

  // footer URL -> copy
  const urlEl = bodyEl.querySelector('.usn-foot .url');
  if (urlEl) urlEl.addEventListener('click', () => {
    navigator.clipboard.writeText(urlEl.dataset.url).then(() => {
      const o = urlEl.textContent; urlEl.textContent = 'copied \u2713';
      setTimeout(() => urlEl.textContent = o, 1500);
    });
  });

  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  _journey = [];   // close returns to source — next open starts a fresh journey
  if (typeof activeSearchQuery !== 'undefined') activeSearchQuery = '';
}

// the top-left button: steps back one card when a trail exists, otherwise closes.
// (the backdrop and Escape always fully close, so there is always a quick way out.)
function _modalBackOrClose() {
  if (_journey.length > 1) {
    _journey.pop();                                   // drop the current card
    openModal(_journey[_journey.length - 1], null, 'preserve');  // reopen the previous one
  } else {
    closeModal();
  }
}
document.getElementById('modal-close').addEventListener('click', _modalBackOrClose);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ============================================================================
   2b — Thoughts / The Log  (ported from the Scale; reads _currentCard)
   ============================================================================ */
const LOG_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwgKSDLQT9c5L4sz4g791w4C_fT9M8zV9r3PlnzyFaAqhigD0Cg265fI17QLoEp-83Q/exec';

const _TP_HIDE = ['modal-crumb','modal-peek','modal-colorbar','modal-title','modal-sub','modal-body','thought-btn'];

function openThoughtPanel(){
  const panel = document.getElementById('thought-panel');
  const card  = document.getElementById('modal-card');
  const cur   = _currentCard || {};
  const nodeId = cur.id || '';
  const nodeLabel = (cur.label || '').replace(/\n/g,' ');
  const color = cur.color || '#c9a84c';
  card.style.setProperty('--c', color);
  const hx = color.replace('#',''); 
  const r=parseInt(hx.slice(0,2),16),g=parseInt(hx.slice(2,4),16),b=parseInt(hx.slice(4,6),16);
  card.style.setProperty('--cg', `rgba(${r},${g},${b},0.5)`);

  document.getElementById('tp-node-id').value = nodeId;
  document.getElementById('tp-node-label').value = nodeLabel;
  const ctx = document.getElementById('tp-context-tag');
  ctx.textContent = nodeLabel ? `THE LOG \u00B7 ${nodeLabel.toUpperCase()}` : 'THE LOG';

  // reset to the form state
  document.getElementById('tp-confirm').classList.remove('show');
  document.querySelector('.tp-actions').style.display = 'flex';
  document.querySelectorAll('.tp-field').forEach(f => f.style.display = 'flex');
  document.getElementById('tp-thought').value = '';
  document.getElementById('tp-name').value = '';

  _TP_HIDE.forEach(id => { const el=document.getElementById(id); if(el) el.style.visibility='hidden'; });
  panel.classList.add('open');
  card.scrollTop = 0;
}

function closeThoughtPanel(){
  document.getElementById('thought-panel').classList.remove('open');
  _TP_HIDE.forEach(id => { const el=document.getElementById(id); if(el) el.style.visibility=''; });
  const card = document.getElementById('modal-card'); if(card) card.scrollTop = 0;
}

function submitToLog(){
  const thought = document.getElementById('tp-thought').value.trim();
  if(!thought){
    const t=document.getElementById('tp-thought'); t.focus();
    t.style.borderBottomColor='rgba(212,98,26,0.8)'; return;
  }
  const payload = {
    name: document.getElementById('tp-name').value.trim() || 'Anonymous',
    topic: document.getElementById('tp-node-label').value || 'General',
    nodeId: document.getElementById('tp-node-id').value || '',
    why: thought,
    sources: 'The Log',
    submitted: new Date().toISOString()
  };
  fetch(LOG_ENDPOINT, {method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  document.querySelector('.tp-actions').style.display='none';
  document.querySelectorAll('.tp-field').forEach(f=>f.style.display='none');
  document.getElementById('tp-confirm-title').textContent='Received.';
  document.getElementById('tp-confirm').classList.add('show');
}

// close the panel first on Escape (then let the existing handler close the modal)
document.addEventListener('keydown', e => {
  if(e.key==='Escape'){
    const p=document.getElementById('thought-panel');
    if(p && p.classList.contains('open')){ e.stopImmediatePropagation(); closeThoughtPanel(); }
  }
}, true);
