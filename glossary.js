// USNow — The World Compendium
// glossary.js
// Definitions verbatim from working document.
// Three confirmed edits: ACCIDENT, DEMOCRACY, RIGHTS.
// To add a word: { word: "", category: "", definition: "" },

const glossary = [

  // A
  { word: "Accident", category: "Time & Change",
    definition: "An event that appears to happen on its own — distinct from mistake, coincidence, and fate — yet cause or blame can always be traced to human action, the surrounding conditions, or the laws of physics." },

  // B
  { word: "Belief", category: "Truth & Knowledge",
    definition: "Faith, opinion, or knowledge without proof — often used interchangeably." },

  { word: "Bias", category: "Truth & Knowledge",
    definition: "Everyone has it — only other people are accused of it." },

  { word: "Body", category: "The Body & Life",
    definition: "Self, vessel, political terrain, or crime scene — context is everything." },

  { word: "Border", category: "Violence & Conflict",
    definition: "Line on a map, security concept, or human rights issue." },

  // C
  { word: "Capitalism", category: "Money & Economy",
    definition: "Freedom through markets or organized extraction — still being argued." },

  { word: "Censorship", category: "Truth & Knowledge",
    definition: "Suppression of truth or removal of harm — always contested." },

  { word: "Change", category: "Time & Change",
    definition: "Hope or threat depending entirely on what you have to lose." },

  { word: "Charity", category: "Morality & Values",
    definition: "Generosity, tax strategy, or substitute for justice." },

  { word: "Class", category: "Identity & Belonging",
    definition: "Economic position, cultural identity, or something Americans pretend doesn't exist." },

  { word: "Community", category: "Identity & Belonging",
    definition: "Neighborhood, identity group, or abstraction invoked to avoid specifics." },

  { word: "Constitution", category: "Power & Governance",
    definition: "Living document or fixed text — the entire legal debate in one word." },

  { word: "Crime", category: "Violence & Conflict",
    definition: "Defined by law, which is defined by power." },

  { word: "Crisis", category: "Time & Change",
    definition: "Emergency requiring action or excuse for overreach — both true simultaneously." },

  { word: "Culture", category: "Identity & Belonging",
    definition: "Everything and therefore sometimes nothing." },

  // D
  { word: "Death", category: "The Body & Life",
    definition: "End, transition, or the thing that makes everything else matter." },

  { word: "Debt", category: "Money & Economy",
    definition: "Investment, trap, or moral failing — all three framings in active use." },

  { word: "Defense", category: "Violence & Conflict",
    definition: "Protection or the budget line item for offense." },

  { word: "Democracy", category: "Power & Governance",
    definition: "Majority rule, representative republic, or an untenable experiment — depending on who's asking." },

  { word: "Deserve", category: "Morality & Values",
    definition: "Merit-based, luck-based, or morally determined — not agreed upon." },

  { word: "Dignity", category: "Morality & Values",
    definition: "Inherent or earned — the oldest human argument." },

  // E
  { word: "Education", category: "Truth & Knowledge",
    definition: "Learning, credentialing, indoctrination, or liberation — depends on who controls it." },

  { word: "Elite", category: "Power & Governance",
    definition: "Meritocracy's winners or an unaccountable class — depends who's talking." },

  { word: "Evidence", category: "Truth & Knowledge",
    definition: "Proof to some, inconvenience to others." },

  { word: "Evil", category: "Morality & Values",
    definition: "Theological category, political label, or description of harm." },

  { word: "Expert", category: "Truth & Knowledge",
    definition: "Trusted authority or unelected elite, depending on whether you like the answer." },

  // F
  { word: "Fact", category: "Truth & Knowledge",
    definition: "Observed, agreed upon, or declared — the word claims more certainty than it delivers." },

  { word: "Fair", category: "Morality & Values",
    definition: "Equal, equitable, or whatever I think it is." },

  { word: "Faith", category: "Religion & Meaning",
    definition: "Trust, religion, or the decision to believe without proof." },

  { word: "Family", category: "Identity & Belonging",
    definition: "Blood, choice, or the unit the state prefers you to be." },

  { word: "Freedom", category: "Power & Governance",
    definition: "Means liberation to one person, license to another, absence of government to a third." },

  { word: "Future", category: "Time & Change",
    definition: "Promise, threat, or abstraction used to defer present action." },

  // G
  { word: "Gender", category: "Identity & Belonging",
    definition: "Biology, identity, performance, or spectrum — the conversation is ongoing." },

  { word: "God", category: "Religion & Meaning",
    definition: "Creator, metaphor, authority, or comfort — the most loaded word in any language." },

  { word: "Good", category: "Morality & Values",
    definition: "Moral, effective, or just pleasant — the word carries all three." },

  { word: "Government", category: "Power & Governance",
    definition: "Servant of the people or threat to liberty — same institution, opposite readings." },

  { word: "Growth", category: "Money & Economy",
    definition: "Economic progress or ecological destruction — depends on the time horizon." },

  // H
  { word: "Health", category: "The Body & Life",
    definition: "Physical state, industry, or human right — not settled." },

  { word: "Heritage", category: "Identity & Belonging",
    definition: "Pride, mythology, or unexamined inheritance." },

  { word: "History", category: "Time & Change",
    definition: "What happened, what was recorded, or what was decided mattered." },

  { word: "Home", category: "The Body & Life",
    definition: "Place, feeling, nation, or the thing you can lose." },

  // I
  { word: "Immigrant", category: "Identity & Belonging",
    definition: "Neighbor, threat, or economic category — depends on the decade." },

  { word: "Investment", category: "Money & Economy",
    definition: "Building something or extracting value — both use the same word." },

  // J
  { word: "Judgment", category: "Religion & Meaning",
    definition: "Divine reckoning, personal criticism, or legal ruling." },

  { word: "Justice", category: "Power & Governance",
    definition: "Punishment, restoration, or equity — three entirely different systems." },

  // L
  { word: "Law", category: "Power & Governance",
    definition: "Protection or weapon, depending entirely on where you're standing." },

  { word: "Legacy", category: "Time & Change",
    definition: "What you leave or what you're blamed for." },

  { word: "Liberty", category: "Power & Governance",
    definition: "Often used as freedom's more formal twin — with very different implications." },

  { word: "Life", category: "The Body & Life",
    definition: "Biological, biographical, or the political category in 'pro-life'." },

  // M
  { word: "Memory", category: "Time & Change",
    definition: "Individual, collective, or politically managed." },

  { word: "Minority", category: "Identity & Belonging",
    definition: "Numerical or structural — not the same thing." },

  { word: "Miracle", category: "Religion & Meaning",
    definition: "Divine intervention or improbable event — language reveals belief." },

  { word: "Misinformation", category: "Truth & Knowledge",
    definition: "False content — or content someone in power doesn't want believed." },

  { word: "Modern", category: "Time & Change",
    definition: "Current, Western, or superior — the assumptions are buried in the word." },

  // N
  { word: "Narrative", category: "Truth & Knowledge",
    definition: "Story, spin, or the frame around the facts." },

  { word: "Nation", category: "Identity & Belonging",
    definition: "Geography, people, government, or myth — not always the same thing." },

  { word: "Native", category: "Identity & Belonging",
    definition: "Indigenous or simply born here — two very different claims." },

  { word: "Natural", category: "Religion & Meaning",
    definition: "From nature or morally correct — the conflation is deliberate." },

  { word: "News", category: "Truth & Knowledge",
    definition: "Events reported, events selected, or events manufactured." },

  { word: "Normal", category: "Identity & Belonging",
    definition: "Statistical average or social enforcement." },

  // O
  { word: "Opinion", category: "Truth & Knowledge",
    definition: "Personal view or the equal of established fact — being treated as the same is the problem." },

  { word: "Order", category: "Violence & Conflict",
    definition: "Peace or enforcement — whose order matters enormously." },

  // P
  { word: "Patriot", category: "Power & Governance",
    definition: "Lover of country or enforcer of conformity." },

  { word: "Populism", category: "Power & Governance",
    definition: "The people's voice or mob rule dressed up in a flag." },

  { word: "Poverty", category: "Money & Economy",
    definition: "Circumstance, system, or personal failure — the diagnosis determines the cure." },

  { word: "Power", category: "Power & Governance",
    definition: "Authority, force, or energy — and who has it changes everything." },

  { word: "Prayer", category: "Religion & Meaning",
    definition: "Communication with the divine or wishful thinking — depends entirely on belief." },

  { word: "Privilege", category: "Morality & Values",
    definition: "Advantage, blessing, or grievance depending on the conversation." },

  { word: "Progress", category: "Time & Change",
    definition: "Forward movement or destruction of what works — both claims made sincerely." },

  { word: "Propaganda", category: "Truth & Knowledge",
    definition: "Enemy messaging — your side calls it communication." },

  { word: "Protest", category: "Violence & Conflict",
    definition: "Democratic expression or public disorder — same event, different headlines." },

  // R
  { word: "Race", category: "Identity & Belonging",
    definition: "Biological fiction, social reality, and lived experience — all three at once." },

  { word: "Reform", category: "Power & Governance",
    definition: "Progress or erosion, depending on what you're attached to." },

  { word: "Religion", category: "Religion & Meaning",
    definition: "Present in every layer of human history, still shaping the present." },

  { word: "Responsibility", category: "Morality & Values",
    definition: "Personal accountability or systemic obligation — the debate is which one applies." },

  { word: "Revolution", category: "Violence & Conflict",
    definition: "Heroic founding or dangerous chaos, depending on whose side won." },

  { word: "Rights", category: "Power & Governance",
    definition: "God-given, government-granted, or socially constructed — this is us." },

  { word: "Riot", category: "Violence & Conflict",
    definition: "What they call a protest they disapprove of." },

  // S
  { word: "Sacred", category: "Religion & Meaning",
    definition: "Holy, protected, or beyond criticism." },

  { word: "Salvation", category: "Religion & Meaning",
    definition: "Religious rescue or political promise — used by both." },

  { word: "Science", category: "Truth & Knowledge",
    definition: "Method, institution, consensus, or authority — critics conflate them deliberately." },

  { word: "Security", category: "Violence & Conflict",
    definition: "Safety or control — both use the same infrastructure." },

  { word: "Shame", category: "Morality & Values",
    definition: "Moral corrective or social weapon." },

  { word: "Sin", category: "Religion & Meaning",
    definition: "Religious transgression or social failure — still very much in circulation." },

  { word: "Socialism", category: "Money & Economy",
    definition: "Collective care or government overreach — rarely defined before being invoked." },

  { word: "Soul", category: "Religion & Meaning",
    definition: "Theological reality, metaphor, or the part of a person that can't be quantified." },

  { word: "Sovereignty", category: "Power & Governance",
    definition: "National independence or the right of the powerful to do as they please." },

  // T
  { word: "Tax", category: "Money & Economy",
    definition: "Civic contribution or government theft — one of the oldest fights." },

  { word: "Terrorism", category: "Violence & Conflict",
    definition: "Political violence by enemies — rarely applied to ourselves." },

  { word: "The Market", category: "Money & Economy",
    definition: "Spoken of as if it were a person with opinions." },

  { word: "Theory", category: "Truth & Knowledge",
    definition: "In science: well-tested explanation. In common use: a guess. The gap is exploited constantly." },

  { word: "They", category: "Identity & Belonging",
    definition: "The most dangerous three-letter word." },

  { word: "Tradition", category: "Time & Change",
    definition: "Wisdom passed down or refusal to change — context decides." },

  { word: "Truth", category: "Truth & Knowledge",
    definition: "Correspondence to fact, lived experience, or what power decides — rarely neutral." },

  // U
  { word: "Us", category: "Identity & Belonging",
    definition: "The most loaded two-letter word in the language." },

  // V
  { word: "Violence", category: "Violence & Conflict",
    definition: "Physical harm, structural harm, or the word used to shut down protest." },

  // W
  { word: "War", category: "Violence & Conflict",
    definition: "Defense, aggression, or policy — same act, opposite framings." },

  { word: "Wealth", category: "Money & Economy",
    definition: "Earned, inherited, extracted, or accumulated — rarely just one." },

  { word: "Work", category: "Money & Economy",
    definition: "Dignity, exploitation, or identity — all three true simultaneously." },

  // ── ADD NEW WORDS BELOW ──
  // { word: "", category: "", definition: "" },

];

if (typeof module !== 'undefined') module.exports = glossary;
