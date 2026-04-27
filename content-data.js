/* ============================================================
   USNOW · CONTENT DATA
   ------------------------------------------------------------
   Single source of truth for all internal content rendered by
   content.html. Each entry is rendered by ID via
     content.html?id=<entry-id>

   FIELD SHAPE
   -----------
   id            unique slug, becomes URL parameter
   sections      array of section memberships:
                 "journal" | "gallery" | "archive"
                 An entry can appear in multiple sections.
   kind          rendering emphasis:
                 "article"  → text-led, sidebar visible
                 "image"    → media-led, body is short caption
                 "document" → scan/PDF-led
                 "entry"    → mixed journal/archive entry
   hero_style    "dark-amber"   → Toll Road register (warm editorial)
                 "dark-cosmic"  → USNow landing register (cool gallery)
                 "dark-paper"   → mixed: dark hero, warm body
                 default → dark-cosmic
   eyebrow       small label above title
   title         main headline (HTML allowed for <em> emphasis)
   subtitle      one-line below title (optional)
   date          display date string (e.g. "April 2026")
   decade        for kicker line ("2020s") — optional
   meta          array of small pill labels — optional
   media         { type, src, alt, caption } — optional
                 type: "image" | "pdf" | "document"
                 If absent, no framed media block renders.
   body          HTML string. Editorial CSS classes available:
                   .dropcap, .section-break, .pullquote,
                   .callout, .phosphor-block, .capture-block,
                   .threshold, .declaration
   related_nodes array of orb IDs from index.html
   related_terms array of compendium term IDs
   external_url  optional Substack/external link button
   external_label optional button label
   ============================================================ */

const CONTENT = {

  /* ============================================================
     1. THE TOLL ROAD
     Journal · article · text-led · dark-amber editorial register
     ============================================================ */
  "toll-road": {
    id: "toll-road",
    sections: ["journal"],
    kind: "article",
    hero_style: "dark-amber",
    eyebrow: "Essay",
    title: "The <em>Toll</em> Road",
    subtitle: "What the glowing screen promised, and what we got instead",
    date: "April 2026",
    decade: "2020s",
    meta: ["MEDIA POWER", "CORPORATIONS", "AGI"],
    body: `
<p class="dropcap">There was a time when a spreadsheet meant a glowing screen — green or amber phosphor text floating against pure black, one line at a time. No mouse. No undo. A keyboard overlay strip telling you what F7 did. Lotus 1-2-3. WordPerfect. The whole world of organized information fitting on a floppy disk, running on a machine that weighed forty pounds.</p>

<p>Before that, a standalone word processor with a one-line LCD strip showing maybe sixteen characters at a time — you typed into a window the size of a fortune cookie, the rest of the document living invisibly in memory until it hit the page.</p>

<div class="phosphor-block">
  <div class="phosphor-label">▸ The phosphor era</div>
  <p>Those constraints were real. But so was the discipline they produced. You had to understand the structure because there was no interface to hide it. The tool was transparent by necessity. And threaded through all of it was a promise: information technology would be democratizing.</p>
</div>

<p>Access to information would level playing fields, strengthen institutions, empower individuals, make the world more legible and therefore more fair. That was the sales pitch. A lot of people believed it genuinely — including the people selling it.</p>

<div class="section-break">✦ ✦ ✦</div>

<p>Then WYSIWYG arrived and the standalone word processor became an icon in Windows almost overnight. Except it wasn't overnight. The capability existed. The price point moved. The market cleared.</p>

<p>What looked like a sudden leap was actually a controlled release — rationed by revenue strategy, not by readiness. The gap between what existed in the lab, what existed in corporate offices, and what you could actually buy was not primarily a technical gap. It was a financial one.</p>

<div class="pullquote">
  <p>You paid a temporal tax for not being wealthy enough to be first.</p>
  <span class="pullquote-attr">The versioning model</span>
</div>

<p>They held back features, released them incrementally, charged maximum price at each step. The same chip, slowed down by code, sold at two prices. The same technology, rationed across a decade, extracted at every plateau. The rollout wasn't a gift. It was versioning.</p>

<div class="section-break">✦ ✦ ✦</div>

<p>And then the internet arrived, and the promise came back — bigger this time. Not just word processors. Everything. All of it. The full depth of what can be known, available to anyone with a connection.</p>

<p>That was the explicit promise made to the first generation that grew up with it. The information age would be democratic. Knowledge would be a commons. The network would be a public utility — like roads, like water, like the electrical grid.</p>

<div class="capture-block">
  <p>What happened instead was <strong>capture.</strong></p>
  <p>The infrastructure became private. The information that flows through it is curated by financial interest. The algorithm serves engagement which serves advertising which serves capital. What could have been a public utility was allowed to become the most profitable private asset class in human history.</p>
  <p>And the people who built it on the promise of openness became the wealthiest and most powerful concentrations of private capital the world has ever seen.</p>
  <p>The versioning didn't stop at the word processor. It became the operating logic of the entire information economy. Consumer version. Safe version. Limited version. <strong>You don't need to know that version.</strong></p>
</div>

<div class="section-break">✦ ✦ ✦</div>

<p>Which brings us to AGI — and to the only definition of it that deserves the name.</p>

<p>People talk about AGI like it's a brain waiting to wake up, a benchmark waiting to be crossed. But that framing misses the point entirely. Real AGI — the kind that actually matters — is not a technical milestone. It is a societal one.</p>

<div class="callout">
  <div class="callout-label">What real AGI actually means</div>
  <ul>
    <li>The end of knowledge asymmetry</li>
    <li>The end of informational feudalism</li>
    <li>Clarity as a public right</li>
    <li>Truth as accessible — not curated, not gated</li>
    <li>Accountability as unavoidable</li>
    <li>No one hiding behind the complexity anymore</li>
  </ul>
</div>

<p>If AGI arrives without universal access, it isn't AGI. It's the same extraction model with a bigger engine. A private super-tool. A handful of actors with better intelligence, better predictions, better models, all the data, better leverage — and the rest of the world told to trust them.</p>

<p>Which is not the future. That part is what's happening now.</p>

<div class="section-break">✦ ✦ ✦</div>

<p>The phosphor screen, the sixteen-character LCD strip, the WYSIWYG moment, the internet's capture — they are all the same story. The promise was access. The mechanism was always extraction.</p>

<p>AGI is either where that pattern ends or where it completes itself at a scale we can't walk back from.</p>

<p>We'll know it has actually arrived when:</p>

<ul class="threshold">
  <li>Anyone can ask any question</li>
  <li>Anyone can access any dataset</li>
  <li>Anyone can see how decisions are made</li>
  <li>Anyone can verify truth</li>
  <li>Anyone can understand the systems shaping their world</li>
</ul>

<p>Not when a lab says so. Not when a benchmark says so. Not when a CEO says so.</p>

<div class="declaration">
  <p>Knowledge shouldn't be a privilege.</p>
  <p>It should be a <em>public utility.</em></p>
  <p>Not a product. Not a subscription. Not a corporate asset.</p>
  <p>A common benefit.</p>
</div>

<p style="margin-top:2em;">We're not there yet. But that's the threshold. That's the only one worth naming.</p>
`,
    related_nodes: ["media-power", "corporations", "identity"],
    related_terms: ["data", "consent", "knowability", "agi"]
  },

  /* ============================================================
     2. BREAD & CIRCUSES
     Gallery · image · media-led · dark-cosmic register
     ============================================================ */
  "bread-and-circuses": {
    id: "bread-and-circuses",
    sections: ["gallery"],
    kind: "image",
    hero_style: "dark-cosmic",
    eyebrow: "AI-Generated · 2026",
    title: "Bread &amp; Circuses",
    subtitle: "Panem et circenses. The oldest political technology, still running.",
    date: "April 2026",
    meta: ["GALLERY", "MEDIA POWER", "PERCEPTION"],
    media: {
      type: "image",
      src: "graphics/bread.PNG",
      alt: "Bread and Circuses — modern colosseum, BingeFlix, dispensary, distracted citizens",
      caption: "Tap the image to open the full-resolution viewer. Pinch, scroll, or drag to inspect the details."
    },
    body: `
<p>The colosseum survives in altered form. The gladiator becomes the streamer. The lion becomes the algorithm. The bread becomes the binge.</p>

<p>Liberty pauses for a smoke break. The dispensary is open twenty-four hours. The screens are always on. The crowd has not changed.</p>

<p>Two thousand years ago a Roman poet named the technique. <em>Panem et circenses.</em> Give the people enough bread and enough spectacle and they will not ask what is being done in their name. The arrangement worked then. It works now. The bread is cheaper. The spectacle is denser. The empire is broader.</p>

<p>Look closely. Every element in this image already exists in your week. The point is not what is being depicted. The point is how legible it is.</p>
`,
    related_nodes: ["media-power", "perception", "identity"],
    related_terms: ["distraction", "spectacle", "consent"]
  },

  /* ============================================================
     3. AMERICA'S INDIGENOUS SIN
     Journal AND Gallery — one entry, two memberships.
     CANONICAL HOME. Substack is now the syndication channel.
     ============================================================ */
  "indigenous-sin": {
    id: "indigenous-sin",
    sections: ["journal", "gallery"],
    kind: "article",
    hero_style: "dark-paper",
    eyebrow: "Essay",
    title: "America's Indigenous Sin",
    subtitle: "The technology evolves. The pattern stays the same.",
    date: "March 28, 2026",
    decade: "2020s",
    meta: ["JOURNAL", "GALLERY", "HISTORY", "GOVERNMENT"],
    media: {
      type: "image",
      src: "graphics/sin.PNG",
      alt: "America's Indigenous Sin — symbolic image of generational violence and national trauma",
      caption: "AI-generated, 2026. Tap to open the full-resolution viewer."
    },
    body: `
<p class="dropcap">First we slaughtered the Indians.</p>

<p>Not metaphorically. Not incidentally. Deliberately, repeatedly, and with the full backing of policy, law, and divine justification. Five-to-ten million. Entire nations — with governments, histories, languages, and their children — were lied to, removed, relocated, erased, and abused. We called it expansion. We called it destiny. We built monuments to the men who signed the orders, and to those who were sacrificed to the other side.</p>

<p>The technology of the time enabled it. Firearms gave settlers overwhelming firepower. Smallpox, spread through 'contact' (including purposefully infected blankets) during removal, devastated populations by up to 90%. Then we slaughtered the buffalo — not just the millions and millions of physical animals — and not just food and clothing for indigenous people — but everything indigenous life was built on or around. Railroads then made relocation efficient: entire tribes moved westward in weeks. The process grew to become systematic. Death by displacement, disenfranchisement, and disease was the deliberate policy.</p>

<p>But something else happened too: the story of what we'd done was passed down as triumph. Grandfathers told grandsons about "taming the frontier." Schoolbooks turned conquest into courage. Violence became heritage. The us-versus-them logic — the idea that safety comes from dominance — became a family heirloom.</p>

<div class="pullquote">
  <p>And that we taught our children.</p>
</div>

<div class="section-break">✦ ✦ ✦</div>

<p>Then we slaughtered each other.</p>

<p>Six hundred thousand dead in four years. Brothers. Literally, sometimes. A country that had learned to resolve its questions through elimination turned that logic inward when the contradiction at its core — a nation founded on freedom built on human bondage — became too loud to ignore.</p>

<p>Railroads moved armies and supplies at industrial scale. Telegraphs coordinated attacks in real time. Rifled muskets and the Minié ball that could shatter bone at six hundred yards multiplied killing power.</p>

<p>But again, the culture absorbed it. Stories of terror became stories of valor. Children grew up playing war in fields where their great-grandfathers bled. The glorification of violence, the idea that conflict is cleansing, that force is noble, (and that people are not equal?) seeped too into the groundwater. We called it a civil war; we either won or suffered a noble Lost Cause. We built monuments to both sides. We told ourselves it was about honor, states' rights, or heritage — anything that didn't require sitting with what it was actually about. Us vs. Them.</p>

<div class="pullquote">
  <p>And that we taught our children.</p>
</div>

<div class="section-break">✦ ✦ ✦</div>

<p>Then we started slaughtering the world.</p>

<p>Not all at once. Incrementally. With justifications that were sometimes legitimate and always confident. The World Wars had real villains. The response was real and maybe most of it necessary. But airplanes, tanks, and atomic bombs made total annihilation the routine objective. After 1945, power settled into the bones differently. It stopped feeling like a response and started feeling like an identity.</p>

<p>Korea. Vietnam. Jet fighters and napalm — our kids strapped in machine guns. Iraq. Afghanistan. Precision missiles, drones, and satellite targeting allowed strikes from continents away. And at home, the stories kept flowing. War movies. Hero myths. Fireworks. Flyovers. Grandparents telling grandkids about sacrifice, about enemies who needed defeating. The violence got bigger, the distance got greater, and the narrative got cleaner. Screens and joysticks replaced bayonets. Operators never saw the blood. Citizens never saw the coffins. The technology grew more 'effective' and the culture grew more numb.</p>

<p>We called it freedom. We built monuments and video games and MMA cages, and moved on.</p>

<div class="pullquote">
  <p>And that we taught our children.</p>
</div>

<div class="section-break" style="font-size:18px; letter-spacing:8px;">REPEAT.</div>

<p>And then we turned it directly on our children and on ourselves. In their classrooms. In our streets. At concerts and in clubs. Twenty-six at Sandy Hook. Nineteen at Uvalde. The list goes on…and on. We called it a mental health problem, a door security problem, an everything-but-the-obvious problem. We built memorials. We reaffirmed the Second Amendment. We moved on.</p>

<div class="capture-block">
  <p><strong>This is what recurring untreated trauma looks like at a national scale.</strong></p>
  <p>Not grief. Not guilt. Pattern. The same behavior cycling through new contexts with new names, never quite connecting back to where it started. If what we teach our children is the main reinforcement of each cycle, technology is the main enabler — making slaughter faster, farther, and easier to forget. Culture ensured the cycle survived — passing down the logic, the myths, the divisions, the reflexive us-versus-them worldview, and the safety of putting it in the past, and/or blaming our parents and past generations.</p>
  <p>Complex PTSD — the kind that develops not from a single event but from prolonged, repeated violence without resolution — doesn't announce itself. It becomes personality. It becomes culture. It gets passed down not just through deliberate instruction but through absorption. A child doesn't need to be told how his father handles fear or anger. He watches. He learns. He carries it forward without knowing he's carrying anything.</p>
  <p>We are that child. All of us, each of us — not just as a nation, but individually. Born into a country that learned its first and most durable and most damaging lesson, before any of us even individually arrived, that other opinions are opponents, that obstacles are to be obliterated, that security means dominance, and that force is the native language of the grown-up civilized world. <strong>This is literally our foreign — and domestic policy.</strong></p>
  <p>In a person we'd recognize it immediately — the hypervigilance, the hair-trigger response to perceived threat, the inability to sit with accountability, the way the past keeps arriving disguised as the present — and the lasting aggression and grandiosity and dominance is clearly the outward expression and defense mechanism to internalized shame, self-denigration, and an inferiority complex that's forced not to surface. This isn't hyperbole or metaphor or personification. This is psychoanalysis at a national level.</p>
</div>

<div class="section-break">✦ ✦ ✦</div>

<p>The reckoning that keeps not happening isn't complicated.</p>

<p>It doesn't require guilt. Guilt is personal and retrospective and mostly useless. It doesn't require tearing anything down or relitigating every decision made by people who are dead. It requires one thing: an accurate description of what happened, how it shaped what came after, and what it's still shaping now.</p>

<p>That's it. Just look at it.</p>

<p>The fact that this is politically impossible — that honest history gets legislated out of classrooms, that acknowledgment of foundational violence gets called anti-American, that the naming of the pattern becomes the controversy — is not an argument against doing it.</p>

<p>It's a symptom of why we have to.</p>

<div class="section-break">✦ ✦ ✦</div>

<p>Rock bottom for a person is the moment the cost of not changing finally outweighs the comfort of staying the same. Nobody can tell you when that moment is. You either arrive there or you don't.</p>

<p>The question is whether a country can arrive there too.</p>

<p>The evidence isn't encouraging, especially since the contagion is rampant worldwide. But the alternative is another cycle. Another justification. Another monument to something we'll eventually need to forget.</p>

<p>We've been here before. We'll be here again.</p>

<div class="declaration">
  <p>Unless…</p>
  <p>We taught our children something <em>different</em> than what we were taught.</p>
</div>
`,
    related_nodes: ["government", "history", "identity", "media-power"],
    related_terms: ["debt", "memory", "sovereignty", "trauma"],
    external_url: "https://open.substack.com/pub/atjon27/p/americas-indigenous-sin?r=3gs28j&utm_medium=ios",
    external_label: "ALSO ON SUBSTACK →"
  }

};

/* Make available to content.html */
if (typeof window !== 'undefined') {
  window.CONTENT = CONTENT;
}
