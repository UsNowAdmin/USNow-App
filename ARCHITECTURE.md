# UsNow — Modal Engine Architecture

This document describes the shared card-modal system that powers the **Tree** (`tree.html`)
and the **Scale** (`index.html`). Both pages render their cards through one engine — `modal.js`
styled by `modal.css` + `step2.css` — instead of the two separate modal renderers they had before.
The **Compendium** (`compendium.html`) is a separate system and is documented briefly at the end.

Written from the final code. If code and doc disagree, the code wins — but please update this file.

---

## 1. File map

**The shared modal engine (used by both Tree and Scale):**

- `modal.js` — the engine. Builds the card index + canonical-home paths, renders the modal,
  handles navigation (open / back / close), the breadcrumb, the journey, the peek, the pills,
  the footer, and the Thoughts panel. This is the one place card behavior lives.
- `modal.css` — base modal chrome: the `#modal` overlay, the `#modal-card` surface, the crumb,
  the colorbar, the title, the close/Thoughts buttons. Everything here is scoped under `#modal`
  so it overrides any same-id rules a host page might still carry.
- `step2.css` — the approved layout details: the peek pill + dash, the glowing no-wrap pill grid,
  ON-SITE / OFF-SITE labels, and the footer (journey · id · url). Scoped to `#modal-card`.
- `slugmap.js` — `var _idToSlug`, the sitemap-true id→slug map (~1,336 entries). Shared by both
  pages so the per-card copy-URL matches the real sitemap. Must load **before** `modal.js`.

**Shared data + content (used by Tree, Scale, and — for glories — the Compendium):**

- `layers.js` — `const LAYERS`, the 7-layer content tree. ~3 MB. The structural source of truth.
- `glories.js` — `const GLORIES` (lookup map used to highlight words in card descriptions) **and**
  `const glossary = GLORY_DATA` (the array the Compendium lists). One file, two consumers.
- `glory-highlights.js` — `applyGlories(root)` (wraps glossary words in clickable `.glory-word`
  spans) plus the definition pop-up. Applied to card descriptions by `modal.js`, and to the
  static `hero`/`about`/`thoughts` sections on load.

**The pages:**

- `index.html` — the **Scale**. Loads the engine; canvas + foundation moons are its own code.
- `tree.html` — the **Tree**. Loads the engine; the SVG tree navigator is its own code.
- `compendium.html` + `compendium.css` + `compendium.js` — the **List of Living Words**.
  Self-contained; see §9.

---

## 2. Load order (must hold on both pages)

```
index.css / page CSS         (host page styles)
modal.css                    (after page CSS, so #modal-scoped rules win)
step2.css                    (after modal.css)
...
layers.js                    (defines LAYERS)
glories.js                   (defines GLORIES + glossary)
glory-highlights.js          (defines applyGlories; needs GLORIES)
slugmap.js                   (defines _idToSlug; needed by modal.js)
modal.js                     (the engine; needs LAYERS, _idToSlug, applyGlories)
<script>buildCardIndex(); buildCardPath();</script>   (run once, after LAYERS is in memory)
```

Why this order: `modal.css`/`step2.css` come after the page's own CSS so the `#modal`-scoped
rules override any leftover same-id rules. `slugmap.js` precedes `modal.js` because the engine
reads `_idToSlug`. `buildCardIndex()` / `buildCardPath()` run once after `LAYERS` exists.

---

## 3. Data contract

A **card** (layer, orb, or pill) is an object with: `id`, `label`, `desc`, `color`, optionally
`sub`, `time`, `topPills[]`, `orbs[]`, `bottomPills[]`, `links[]`.

Structural rules baked into the engine:

- A layer's children are split across **`topPills`** (curated "forces" / field-theory) and
  **`orbs`** (the canvas "dramas"). Both are part of the **structural spine**.
- **`bottomPills`** are cross-links — pointers to a card that lives elsewhere. They are usually
  desc-less stubs. They are **not** part of the spine and never define a card's home.
- A canonical card lives in exactly one spine position and carries the description there. The same
  `id` may appear many times as desc-less `bottomPill` cross-links; that's expected and harmless.

Two derived structures, built once at load:

- **`_cardIndex[id]`** (`buildCardIndex`) — the richest-desc occurrence of each id. Resolving a
  pill/click by id always lands on the real, described card.
- **`_cardPath[id]`** (`buildCardPath`) — the canonical home string, e.g.
  `"HISTORY & CIVILIZATION › Law"`. Built by walking the spine (topPills + orbs, **not**
  bottomPills) and recording the path to the occurrence **with the longest description**
  (`_cardPathDesc` tracks this). See decision D-4.

---

## 4. Engine state (`modal.js`)

- `_cardIndex`, `_cardPath`, `_cardPathDesc` — the derived maps above.
- `_currentCard` — the active card; read by the Thoughts panel / Log submit.
- `_journey[]` — the path of cards opened this session (drives the footer journey + the BACK button).
- `_trail[]` — a silent in-memory log of every open (`{id,label,time}`). Renders nothing today;
  it exists for a future opt-in "your path" feature. **Not** third-party tracking; never leaves the page.

### Navigation modes (`openModal(item, crumbLabels, nav)`)

- `'reset'` (default) — start a fresh journey at `item`. Used by canonical-home crumb clicks,
  `openLayer`/`openOrb`, deep-links.
- `'continue'` — push `item` onto the journey. Used by pill clicks (GO FURTHER + ON-SITE).
- `'preserve'` — journey already set; just render. Used when stepping back.

### Key functions

- `openModal` — resolve by id then by label (auto-heals desc-less stubs), set journey per `nav`,
  paint the card, build crumb / peek / title / body / footer, wire clicks, apply glories to the
  description, record `_trail`.
- `closeModal` — hide `#modal`, clear `_journey`. Backdrop click + Escape also call this.
- `_modalBackOrClose` — the top-left button. If `_journey.length > 1`, pop and reopen the previous
  card (`'preserve'`); otherwise close. The button label is set per-open: `← BACK` with a trail,
  `✕ CLOSE` without one.
- `_openByLabel(label, nav)` — resolve a label to its card and open it (used by crumb clicks).
- `_slugFor`, `_pillHTML`, `_peekJumpFirst` — helpers (URL slug, pill markup, peek scroll target).
- `openThoughtPanel` / `closeThoughtPanel` / `submitToLog` — the Thoughts panel (posts to `LOG_ENDPOINT`).

---

## 5. Modal anatomy (top → bottom) and who styles what

1. **CLOSE / Thoughts buttons** (`#modal-close`, `#thought-btn`) — absolute, top-right.
   `modal.css` (close) + `step2.css` (Thoughts at `top:78px`, kept clear of the close button).
2. **Top breadcrumb = CANONICAL HOME** (`#modal-crumb`) — ancestors only; the current card is
   dropped (it's the title). Each ancestor is clickable → `_openByLabel(…, 'reset')`. Hidden
   entirely on a top-level layer (no ancestors). `modal.css`.
3. **Colorbar** (`#modal-colorbar`) — short card-colored accent bar. `modal.css`; color set inline.
4. **Peek** (`#modal-peek`) — the constant "Other Branches And Connections" pill + fading dash;
   jumps to the first section below the description. `step2.css`.
5. **Title** (`#modal-title`, Cinzel) and optional **sub** (`#modal-sub`, hidden by default). `modal.css`.
6. **Body** (`#modal-body`) — description (`.modal-desc`, the only place glories are applied),
   GO FURTHER (topPills), OTHER ON-SITE CONNECTIONS (bottomPills; relabeled "OTHER TOPICS IN THIS
   LAYER" and merged with orbs on layer cards), OFF-SITE RESOURCES (links). `step2.css` + `modal.css`.
7. **Footer** (`.usn-foot`) — line 1 is the **journey** (`.usn-journey`, shown only when
   `_journey.length > 1`, grows freely, each prior step clickable to step back); then `id · copy-URL`
   (sitemap-true `#slug`). `step2.css`.

---

## 6. Behavior index (symptom → where to look)

- Wrong canonical home / wrong ancestor crumb → `buildCardPath` in `modal.js` (and the data: a
  stray spine placement). See D-4.
- A pill opens the wrong/blank card → `_cardIndex` resolution in `openModal`, or a bad `id`/`label`.
- Close button won't close, or doesn't say BACK → `_modalBackOrClose` + the label line in `openModal`.
- Journey wrong / doesn't grow → the `nav` mode passed to `openModal` (`continue` vs `reset`), §4.
- Buttons hidden or overlapping on a page → a host-page CSS rule on `#modal-close`/`#thought-btn`;
  `modal.css` forces `display:block` defensively and zeroes the close button's margin.
- Glossary word highlighted where it shouldn't be → `acceptNode` in `glory-highlights.js` (headings,
  wordmark, all-caps "US" are all rejected there).
- Copy-URL slug wrong → `slugmap.js` (`_idToSlug`) / `_slugFor`.

---

## 7. Interface contracts (do not break)

These are the seams other code depends on. Changing them means changing callers too.

- A function named **`openModal`** must exist and be reachable as called by the pages
  (`openLayer`/`openOrb`, deep-link handler).
- The modal markup must contain these ids: `#modal`, `#modal-backdrop`, `#modal-card`,
  `#modal-close`, `#thought-btn`, `#modal-crumb`, `#modal-colorbar`, `#modal-peek`, `#modal-title`,
  `#modal-sub`, `#modal-body`, plus the Thoughts panel ids.
- The description element must carry class **`.modal-desc`** — that is the only thing glories scan.
- Glories must stay exempt **outside** the description (no pills, footer, labels).
- The glory pop-up (`#glory-pop`, z-index 9000) must sit **above** the modal. `#modal` is z-index
  **700** (above the page ticker/nav, below the pop-up). Don't raise `#modal` past 9000.
- `slugmap.js` loads before `modal.js`; `modal.css`/`step2.css` load after the page's own CSS.
- Per-card URL is `usnow.app/#{slug}` using the sitemap-true slug.

---

## 8. Decisions log (the why)

- **D-1 — One engine, not two.** The Tree and Scale had separate mature modal renderers doing the
  same job differently. Consolidating onto `modal.js` means one place to fix behavior and one set
  of guarantees. Uniformity was the point.
- **D-2 — Top = canonical home, bottom = journey.** Home is short, stable, and the same every visit,
  so it anchors the top (clickable, no collapse logic, hidden when there are no ancestors). The
  journey is dynamic and only sometimes useful, so it lives at the bottom and grows freely. This
  ended the old redundancy (top and bottom looking identical during canonical navigation) and
  deleted the journey-collapse code entirely.
- **D-3 — Drop the current card from the top crumb.** It's already the title directly below;
  repeating it wasted header space. Ancestors only; hide the crumb when there are none.
- **D-4 — Home resolves by description, not first occurrence.** A node moved into an orb slot can
  still exist as a desc-less stub top-pill elsewhere (e.g. Law, Religion). First-occurrence-wins
  picked the wrong home. Preferring the occurrence that carries the description makes home point to
  where the real card lives — matching the principle "an orb in a layer has its home in that layer"
  — and self-corrects every such case without editing `layers.js`.
- **D-5 — BACK vs CLOSE.** With a trail, the top-left button steps back one card (`← BACK`); with
  no trail it closes (`✕ CLOSE`). Backdrop and Escape always fully close, so there's always a fast exit.
- **D-6 — Modal z-index 700.** The page added a ticker (z-index 600) above the old modal (500),
  which bled a hairline across the modal's top. Raising the modal to 700 makes it a true overlay
  over page chrome, while staying below the glory pop-up (9000) so definitions still pop above cards.
- **D-7 — Highlighter specificity.** Glossary highlighting skips headings and the `UsNow` wordmark,
  and treats all-caps `US` as the country (not the word "us"); lowercase `us` and title-case `Us`
  still highlight. Implemented in `acceptNode` + the match loop in `glory-highlights.js`.
- **D-8 — `index.css` dead-modal block removed.** The old `#modal-overlay` / `#modal-box` rules,
  the stale `display:none` button rules, and a leaked `margin-top:24px` caused three separate bugs
  (hidden buttons, button overlap, the ghost hairline). Removing them fixed the cause; `modal.css`
  keeps a small defensive `display:block` on the buttons so a stale host CSS can't hide them again.

---

## 9. The Compendium (separate system)

`compendium.html` is the **List of Living Words** — not a card surface. It loads `compendium.css`,
then `glories.js` (reads the `glossary` array), then `compendium.js` (its own filter/search/expand
engine). It does **not** use `modal.js`, `step2.css`, or `glory-highlights.js`. Its category filter
strings must match how `glories.js` tags entries (e.g. "Even Further Back", not "Further").

Note: an older `glossary.js` exists in some folders — a superseded ~110-entry set with different
categories. It is **not** loaded by `compendium.html` and should not be shipped. The live data is
`glories.js`.

---

## 10. Open threads / deferred

- **`index.html` dormant JS.** The old Scale modal's `renderCard` / `cardNavOpen` / `cardNavClose`
  / `_setIndex` / `_cardStack` / `_deepCards` and a duplicate `closeModal` remain in `index.html`.
  They are **inert** (reference `#modal-box`, which no longer exists; never called by the live path;
  the duplicate `closeModal` is overridden by `modal.js`, which loads after). They were left in
  deliberately: `_setIndex` writes into `window._cardIndex` during the scale-build loop, so removing
  it safely needs the canvas code traced first. Worth a dedicated, tested pass — not bundled with a push.
- **Data tidy for moved nodes.** Law and Religion (and possibly a couple others) still have a stray
  spine top-pill placement alongside their real orb. D-4 makes the home correct regardless, so this
  is cosmetic GO-FURTHER-list cleanup, done at leisure in `layers.js`.
- **`_trail`.** Captured silently; a render/save UI is a future opt-in.
- **Path-style consistency.** The compendium uses absolute paths (`/tree.html`); Tree/Scale use
  relative. Both work from root on Vercel; normalize eventually.
