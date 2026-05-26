// ─────────────────────────────────────────────────────────────
// USNow Words — index page filter
// Lightweight client-side filter for /word/.
// The page works without JS: this only adds live filtering.
// Individual word pages have NO JS dependency.
// ─────────────────────────────────────────────────────────────
(function () {
  const search = document.getElementById('word-search');
  const list   = document.getElementById('index-list');
  const empty  = document.getElementById('index-empty');
  if (!search || !list || !empty) return;

  const items = Array.from(list.querySelectorAll('.word-list-item'));
  const sections = Array.from(list.querySelectorAll('.letter-section'));

  // Index each item's searchable text once for speed.
  const indexed = items.map(li => {
    const word = (li.querySelector('.word-list-word')?.textContent || '').toLowerCase();
    const def  = (li.querySelector('.word-list-def')?.textContent  || '').toLowerCase();
    return { li, haystack: word + ' ' + def };
  });

  function applyFilter() {
    const q = search.value.trim().toLowerCase();
    let visibleCount = 0;

    if (!q) {
      indexed.forEach(({ li }) => { li.hidden = false; });
      sections.forEach(s => { s.hidden = false; });
      empty.hidden = true;
      return;
    }

    indexed.forEach(({ li, haystack }) => {
      const hit = haystack.includes(q);
      li.hidden = !hit;
      if (hit) visibleCount++;
    });

    // Hide sections that have no visible items.
    sections.forEach(section => {
      const hasVisible = section.querySelector('.word-list-item:not([hidden])');
      section.hidden = !hasVisible;
    });

    empty.hidden = visibleCount > 0;
  }

  search.addEventListener('input', applyFilter);

  // Allow Escape to clear.
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      search.value = '';
      applyFilter();
      search.blur();
    }
  });
})();
