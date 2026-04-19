// ─────────────────────────────────────────────────────────────
// THE WORLD COMPENDIUM — Shared Glory Data
// Single source of truth for index.html and compendium.html
// To add a word: add an entry below in alphabetical order.
// To edit a definition: edit it here — both pages will update.
// 100 entries · Last consolidated: April 19, 2026
// ─────────────────────────────────────────────────────────────

const GLORY_DATA = [
  { word: "Accident", category: "Not Classified",
    definition: "An event that appears to happen on its own — distinct from mistake, coincidence, and fate — yet cause or blame can always be traced to human action, the surrounding conditions, or the laws of physics" },

  { word: "American Dream", category: "Origins",
    definition: "The promise that effort equals outcome — more myth than mechanism, more powerful for being neither provably true nor provably false" },

  { word: "Belief", category: "Knowledge & Learning",
    definition: "Faith, opinion, or knowledge without proof — often used interchangeably" },

  { word: "Bias", category: "Knowledge & Learning",
    definition: "Everyone has it — only other people are accused of it" },

  { word: "Body", category: "Myself & I",
    definition: "Self, vessel, political terrain, or crime scene — context is everything" },

  { word: "Border", category: "History & Civilization",
    definition: "Line on a map, security concept, or human rights issue" },

  { word: "Capitalism", category: "Power & Politics",
    definition: "Freedom through markets or organized extraction — still being argued" },

  { word: "Censorship", category: "Knowledge & Learning",
    definition: "Suppression of truth or removal of harm — always contested" },

  { word: "Change", category: "Not Classified",
    definition: "Hope or threat depending entirely on what you have to lose" },

  { word: "Charity", category: "Community & Culture",
    definition: "Generosity, tax strategy, or substitute for justice" },

  { word: "Class", category: "Origins",
    definition: "Economic position, cultural identity, or something Americans pretend doesn't exist" },

  { word: "Community", category: "Origins",
    definition: "Neighborhood, identity group, or abstraction invoked to avoid specifics" },

  { word: "Constitution", category: "Power & Politics",
    definition: "Living document or fixed text — the entire legal debate in one word" },

  { word: "Crime", category: "History & Civilization",
    definition: "Defined by law, which is defined by power" },

  { word: "Crisis", category: "Not Classified",
    definition: "Emergency requiring action or excuse for overreach — both true simultaneously" },

  { word: "Culture", category: "Origins",
    definition: "Everything and therefore sometimes nothing" },

  { word: "Death", category: "Myself & I",
    definition: "End, transition, or the thing that makes everything else matter" },

  { word: "Debt", category: "Power & Politics",
    definition: "Investment, trap, or moral failing — all three framings in active use" },

  { word: "Defense", category: "History & Civilization",
    definition: "Protection or the budget line item for offense" },

  { word: "Democracy", category: "Power & Politics",
    definition: "Majority rule, representative republic, or failing experiment depending on who's asking" },

  { word: "Deserve", category: "Community & Culture",
    definition: "Merit-based, luck-based, or morally determined — not agreed upon" },

  { word: "Dignity", category: "Community & Culture",
    definition: "Inherent or earned — the oldest human argument" },

  { word: "Education", category: "Knowledge & Learning",
    definition: "Learning, credentialing, indoctrination, or liberation — depends on who controls it" },

  { word: "Elite", category: "Power & Politics",
    definition: "Meritocracy's winners or an unaccountable class — depends who's talking" },

  { word: "Evidence", category: "Knowledge & Learning",
    definition: "Proof to some, inconvenience to others" },

  { word: "Evil", category: "Community & Culture",
    definition: "Theological category, political label, or description of harm" },

  { word: "Expert", category: "Knowledge & Learning",
    definition: "Trusted authority or unelected elite, depending on whether you like the answer" },

  { word: "Fact", category: "Knowledge & Learning",
    definition: "Observed, agreed upon, or declared — the word claims more certainty than it delivers" },

  { word: "Fair", category: "Community & Culture",
    definition: "Equal, equitable, or whatever I think it is" },

  { word: "Faith", category: "Further",
    definition: "Trust, religion, or the decision to believe without proof" },

  { word: "Family", category: "Origins",
    definition: "Blood, choice, or the unit the state prefers you to be" },

  { word: "Freedom", category: "Power & Politics",
    definition: "Means liberation to one person, license to another, absence of government to a third" },

  { word: "Future", category: "Not Classified",
    definition: "Promise, threat, or abstraction used to defer present action" },

  { word: "Gender", category: "Origins",
    definition: "Biology, identity, performance, or spectrum — the conversation is ongoing" },

  { word: "God", category: "Further",
    definition: "Creator, metaphor, authority, or comfort — the most loaded word in any language" },

  { word: "Good", category: "Community & Culture",
    definition: "Moral, effective, or just pleasant — the word carries all three" },

  { word: "Government", category: "Power & Politics",
    definition: "Servant of the people or threat to liberty — same institution, opposite readings" },

  { word: "Growth", category: "Power & Politics",
    definition: "Economic progress or ecological destruction — depends on the time horizon" },

  { word: "Health", category: "Myself & I",
    definition: "Physical state, industry, or human right — not settled" },

  { word: "Heritage", category: "Origins",
    definition: "Pride, mythology, or unexamined inheritance" },

  { word: "History", category: "Not Classified",
    definition: "What happened, what was recorded, or what was decided mattered" },

  { word: "Home", category: "Myself & I",
    definition: "Place, feeling, nation, or the thing you can lose" },

  { word: "Immigrant", category: "Origins",
    definition: "Neighbor, threat, or economic category — depends on the decade" },

  { word: "Investment", category: "Power & Politics",
    definition: "Building something or extracting value — both use the same word" },

  { word: "Judgment", category: "Community & Culture",
    definition: "Divine reckoning, personal criticism, or legal ruling" },

  { word: "Justice", category: "Power & Politics",
    definition: "Punishment, restoration, or equity — three entirely different systems" },

  { word: "Law", category: "Power & Politics",
    definition: "Protection or weapon, depending entirely on where you're standing" },

  { word: "Legacy", category: "Not Classified",
    definition: "What you leave or what you're blamed for" },

  { word: "Liberty", category: "Power & Politics",
    definition: "Often used as freedom's more formal twin — with very different implications" },

  { word: "Life", category: "Myself & I",
    definition: "Biological, biographical, or the political category in 'pro-life'" },

  { word: "Memory", category: "Not Classified",
    definition: "Individual, collective, or politically managed" },

  { word: "Minority", category: "Origins",
    definition: "Numerical or structural — not the same thing" },

  { word: "Miracle", category: "Further",
    definition: "Divine intervention or improbable event — language reveals belief" },

  { word: "Misinformation", category: "Knowledge & Learning",
    definition: "False content — or content someone in power doesn't want believed" },

  { word: "Modern", category: "Not Classified",
    definition: "Current, Western, or superior — the assumptions are buried in the word" },

  { word: "Narrative", category: "Knowledge & Learning",
    definition: "Story, spin, or the frame around the facts" },

  { word: "Nation", category: "Origins",
    definition: "Geography, people, government, or myth — not always the same thing" },

  { word: "Native", category: "Origins",
    definition: "Indigenous or simply born here — two very different claims" },

  { word: "Natural", category: "Community & Culture",
    definition: "From nature or morally correct — the conflation is deliberate" },

  { word: "News", category: "Knowledge & Learning",
    definition: "Events reported, events selected, or events manufactured" },

  { word: "Normal", category: "Origins",
    definition: "Statistical average or social enforcement" },

  { word: "Opinion", category: "Knowledge & Learning",
    definition: "Personal view or the equal of established fact — being treated as the same is the problem" },

  { word: "Order", category: "Power & Politics",
    definition: "Peace or enforcement — whose order matters enormously" },

  { word: "Patriot", category: "Power & Politics",
    definition: "Lover of country or enforcer of conformity" },

  { word: "Populism", category: "Power & Politics",
    definition: "The people's voice or mob rule dressed up in a flag" },

  { word: "Poverty", category: "Power & Politics",
    definition: "Circumstance, system, or personal failure — the diagnosis determines the cure" },

  { word: "Power", category: "Power & Politics",
    definition: "Authority, force, or energy — and who has it changes everything" },

  { word: "Prayer", category: "Further",
    definition: "Communication with the divine or wishful thinking — depends entirely on belief" },

  { word: "Privilege", category: "Origins",
    definition: "Advantage, blessing, or grievance depending on the conversation" },

  { word: "Progress", category: "Not Classified",
    definition: "Forward movement or destruction of what works — both claims made sincerely" },

  { word: "Propaganda", category: "Knowledge & Learning",
    definition: "Enemy messaging — your side calls it communication" },

  { word: "Protest", category: "History & Civilization",
    definition: "Democratic expression or public disorder — same event, different headlines" },

  { word: "Race", category: "Origins",
    definition: "Biological fiction, social reality, and lived experience — all three at once" },

  { word: "Reform", category: "Power & Politics",
    definition: "Progress or erosion, depending on what you're attached to" },

  { word: "Religion", category: "Further",
    definition: "An organized system of belief, practice, and community — present in every layer of human history, still shaping the present." },

  { word: "Responsibility", category: "Community & Culture",
    definition: "Personal accountability or systemic obligation — the debate is which one applies" },

  { word: "Revolution", category: "History & Civilization",
    definition: "Heroic founding or dangerous chaos, depending on whose side won" },

  { word: "Rights", category: "Power & Politics",
    definition: "God-given, government-granted, or socially constructed — all three camps exist" },

  { word: "Riot", category: "History & Civilization",
    definition: "What they call a protest they disapprove of" },

  { word: "Sacred", category: "Further",
    definition: "Holy, protected, or beyond criticism" },

  { word: "Salvation", category: "Further",
    definition: "Religious rescue or political promise — used by both" },

  { word: "Science", category: "Knowledge & Learning",
    definition: "Method, institution, consensus, or authority — critics conflate them deliberately" },

  { word: "Security", category: "Power & Politics",
    definition: "Safety or control — both use the same infrastructure" },

  { word: "Shame", category: "Community & Culture",
    definition: "Moral corrective or social weapon" },

  { word: "Sin", category: "Further",
    definition: "Religious transgression or social failure — still very much in circulation" },

  { word: "Socialism", category: "Power & Politics",
    definition: "Collective care or government overreach — rarely defined before being invoked" },

  { word: "Soul", category: "Further",
    definition: "Theological reality, metaphor, or the part of a person that can't be quantified" },

  { word: "Sovereignty", category: "Power & Politics",
    definition: "National independence or the right of the powerful to do as they please" },

  { word: "Tax", category: "Power & Politics",
    definition: "Civic contribution or government theft — one of the oldest fights" },

  { word: "Terrorism", category: "History & Civilization",
    definition: "Political violence by enemies — rarely applied to ourselves" },

  { word: "The Market", category: "Power & Politics",
    definition: "The collective mechanism of economic exchange — spoken of as if it were a person with opinions, feelings, and the right to decide" },

  { word: "Theory", category: "Knowledge & Learning",
    definition: "In science: well-tested explanation. In common use: a guess. The gap is exploited constantly" },

  { word: "They", category: "Origins",
    definition: "The most dangerous three-letter word" },

  { word: "Tradition", category: "Not Classified",
    definition: "Wisdom passed down or refusal to change — context decides" },

  { word: "Truth", category: "Knowledge & Learning",
    definition: "Correspondence to fact, lived experience, or what power decides — rarely neutral" },

  { word: "Us", category: "Origins",
    definition: "The most loaded two-letter word in the language" },

  { word: "Violence", category: "History & Civilization",
    definition: "Physical harm, structural harm, or the word used to shut down protest" },

  { word: "War", category: "History & Civilization",
    definition: "Defense, aggression, or policy — same act, opposite framings" },

  { word: "Wealth", category: "Power & Politics",
    definition: "Earned, inherited, extracted, or accumulated — rarely just one" },

  { word: "Work", category: "Power & Politics",
    definition: "Dignity, exploitation, or identity — all three true simultaneously" },

];

// ── Derived lookup for index.html glory highlights ──
// GLORIES = { "Word": "definition", ... }
const GLORIES = {};
GLORY_DATA.forEach(e => { GLORIES[e.word] = e.definition; });

// ── Derived glossary array for compendium.html ──
// glossary = [ { word, category, definition }, ... ]
const glossary = GLORY_DATA;
