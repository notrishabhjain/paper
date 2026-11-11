/* Route 3: Build your second brain. Ten units adapted from the Second Brain OS guide
   (secondbrainos.dev, MIT license), rewritten for readers new to AI. The practice in every unit
   builds one "course vault": a public-safe knowledge base about what you learn on Paper Trail. */
(function () {
  "use strict";
  var P = window.Portal;
  var SRC = "https://secondbrainos.dev/#/n/sec:";

  P.trackMaps = P.trackMaps || {};
  P.trackMaps.brain = {
    w: "flow", k: "Route map", title: "A second brain in three jobs",
    plain: "You feed it, an AI agent files and connects what you fed it, and you ask it questions. The ten units teach each part, in the order you will need them.",
    intro: "Click each job to see which units teach it.",
    opts: { cycle: "Answers and finished work are fed back in, so the next question gets a better answer", steps: [
      { t: "Capture", s: "Units 3.02 and 3.03", d: "Everything you read, watch, and write lands in one folder of plain text files with almost no effort: web pages, videos, PDFs, chats, voice notes, newsletters.", like: "One inbox tray on your desk, instead of twelve." },
      { t: "Connect", s: "Units 3.04 to 3.06", d: "An AI agent turns each source into short pages, one idea each, and links them to what is already there. The links form a map (a graph). Scheduled agents keep it tidy.", like: "A librarian who files every new book and updates the catalog cards, every day, without being asked." },
      { t: "Answer", s: "Units 3.07 and 3.08", d: "You ask questions in plain language and get answers built from your own sources, with links you can open. Then you turn answers into drafts, reports, and study material.", like: "Asking the librarian, who has read everything you ever gave them." },
      { t: "Keep it healthy", s: "Units 3.09 and 3.10", d: "Weekly, monthly, and quarterly check-ups, backups, privacy rules, and fixes for the usual problems.", like: "Servicing a car so it keeps running for years." }
    ] }
  };

  /* ================= Unit 3.01 · What a second brain is ================= */
  P.addUnit({
    id: "brain-concepts", track: "brain", num: 1, short: "The idea", kicker: "Start of Route 3",
    plainTitle: "What a second brain is, and why this one works",
    hook: "You save articles, bookmark videos, and screenshot posts, and almost never go back. A second brain fixes the step you keep failing at: an AI agent files and connects what you save, so you can simply ask what you know.",
    source: "01 · Concepts", sourceUrl: SRC + "01-concepts",
    bridge: "This route needs no AI background. If you have done Route 2, you will recognise the agent that maintains the second brain: it is the same loop, harness, and evals, applied to your own notes.",
    explain: [
      "A [[second-brain]] here means something specific: one folder of plain text files on your own computer, which an AI agent reads and writes, holding what you have read and understood, that you can ask questions.",
      "Every note system you have tried probably failed for the same reason: linking new notes to old ones is boring, and people stop doing it after a few weeks. Unlinked notes are just a folder. The new part is that an agent now does the boring linking work, and it does not get tired in month three.",
      "The value does not come from any single page. It comes from density: at around fifty sources the vault starts connecting things you read months apart, and at five hundred it answers questions you could not answer yourself."
    ],
    everyday: { title: "A librarian for everything you read", text: "Imagine a librarian who reads every article you hand them, files it, updates the catalog, cross-references it with everything else, and answers your questions with page references. You still choose what to hand them. They do the filing." },
    example: { title: "Your AI learning journey", text: "As you work through Paper Trail, you feed the vault each station, paper, and lab result. Three months in, you ask: “What do I know about why agents fail in production?” It answers from your own notes on Route 2, your lab failure logs, and two articles you had forgotten saving, with links to each." },
    words: [["second-brain", "a folder of notes an AI agent keeps for you, that you can ask questions"], ["vault", "the folder that holds all the notes"], ["wikilink", "a link to another note, written [[like this]]"], ["llm-wiki", "the pattern: the AI maintains the wiki, you read it"]],
    remember: [
      "Three jobs: capture, connect, answer. The agent does the connecting.",
      "Plain text files you own, linked to each other, kept in version control.",
      "It feels underwhelming for the first weeks. The payoff comes from density."
    ],
    figures: [
      { w: "compare", title: "Wiki or RAG: two ways to ask your documents questions", plain: "Most advice says to put your documents in a search index (RAG, which you met in Route 1). This guide builds a wiki instead. The difference is when the work happens.",
        opts: { cols: [{ t: "RAG", s: "search the pile at question time" }, { t: "Wiki", s: "process once, reuse forever" }],
          rows: [["Where the work happens", "At every question, from scratch", "Once, when a source is added"],
            ["The tenth source on a topic", "Is just another chunk; nothing improves", "Improves the page the first nine built"],
            ["Two sources disagree", "Two chunks that may never be retrieved together", "The disagreement is written on the page, dated"],
            ["Checking an answer", "Fragments without the reasoning that linked them", "A page that cites sources you can open"],
            ["Infrastructure", "An index to build and keep in sync", "None: files and links"],
            ["Cost of adding a source", "Nearly free", "Model time to write and link pages"],
            ["Where it fails", "At question time, visibly", "At filing time, discovered later"],
            ["Finding an unlinked note", "Found by similarity anyway", "Unreachable until linked"]],
          verdict: "The wiki is right for a personal, curated collection of a few thousand pages, and wrong for a million documents nobody organized. Most RAG advice is written for the second case. Unit 3.07 shows when to add RAG on top." } },
      { w: "compound", title: "What it feels like over six months", plain: "The first weeks feel like a folder with extra steps. Click each milestone.",
        takeaway: "Most people quit in week one, right before it starts to pay off. Knowing the curve in advance is half the battle." }
    ],
    lessons: [
      { title: "What it is, and what it is not", plain: "One local folder of plain text that an agent reads and writes, holding what you have read and understood, that you can ask questions. Everything else in this route is detail about making that work.",
        points: ["<b>Not a prettier notes app.</b> You can organize notes beautifully and still never reopen them.",
          "<b>Not a chatbot with your PDFs attached.</b> That gets answers in one session; nothing accumulates, nothing connects, and next week you attach them again.",
          "<b>Not a memory feature.</b> Assistants that remember facts about you are useful, but different. This is a body of knowledge you own that outlives any tool."] },
      { title: "Three jobs, and where the value comes from", plain: "<b>Capture</b>: everything lands in one place with almost no effort. <b>Connect</b>: new material is linked into what is already there. <b>Answer</b>: you ask across everything and get answers grounded in your own sources.",
        like: "A puzzle: one piece tells you little. The picture appears only once enough pieces connect.",
        points: ["Connecting is the job humans stop doing after two weeks, and it is the entire value: unconnected notes are a folder.",
          "Value comes from density: about fifty sources to start connecting, about five hundred to answer beyond what you could recall.",
          "At thirty pages the system is not broken, just early."] },
      { title: "The save-for-later paradox", plain: "Saving feels like an action, so it uses up the urge that made you want to read. The queue grows, the reading does not, and finding the saved item later costs more than searching again.",
        like: "Buying a gym membership feels like exercise.",
        points: ["The pile itself becomes a deterrent: four hundred unread items is a debt you avoid looking at.",
          "Better tagging, a better read-later app, or more discipline do not fix it. Removing the step you keep failing at does: if filing and connecting happen without you, the material is already processed when you need it.",
          "<b>The honest limit:</b> it does not make you read. It makes saving worth doing. That is a smaller claim than most second-brain pitches, and it holds up after a month."] },
      { title: "The LLM wiki pattern", plain: "Published by Andrej Karpathy as a short note on 4 April 2026. The inversion: instead of you maintaining notes and occasionally asking an AI about them, the AI maintains the wiki and you read it.",
        points: ["<b>The wiki is primary.</b> Raw sources are an archive you rarely open. The wiki is written in plain language, one idea per page, densely linked.",
          "<b>Compilation, not summary.</b> Each new source is folded into existing pages rather than added beside them. A concept page improves as sources accumulate; it does not become a list of what each source said.",
          "<b>Three operations:</b> [[ingest]] brings material in, [[lint]] keeps the structure sound, query answers from the wiki.",
          "It needs no infrastructure: markdown files, links, and an agent that can read and write files.",
          "The note describes intent, not implementation, which is why every version differs. Units 3.04 to 3.06 give this guide's answers."] },
      { title: "Two layers: knowledge and projects", plain: "Most setups fail because one shape tries to do two jobs. The knowledge layer answers “what do I know about X?” and grows forever. The project layer answers “what am I doing this week?” and mostly goes cold when the project ships.",
        like: "A library and a workbench. You would not store your current project in the library stacks, or the library on your workbench.",
        fig: { w: "flow", title: "How the two layers feed each other", plain: "Projects use the knowledge layer, and finished work is fed back in.", opts: { cycle: "The second project in a domain is much faster than the first", steps: [
          { t: "Knowledge", s: "what you know", d: "Concepts, sources, people, tools. Organized by idea." },
          { t: "Project", s: "what you are doing", d: "Inputs, work in progress, outputs, feedback. Organized as a pipeline." },
          { t: "Output", s: "finished work", d: "A report, a plan, a post, a decision." },
          { t: "Ingest it back", s: "the step everyone skips", d: "Feed your own finished work into the knowledge layer, so the lessons are there next time." }
        ] } },
        points: ["Merged, they fail differently: a wiki full of dead task lists makes every search worse; a project folder full of concept notes buries the working files.",
          "Build the knowledge layer first if you read a lot and retain little; the project layer first if you re-explain your situation to a chat window every morning."] },
      { title: "Why plain text and markdown", plain: "The file format looks like a detail. It decides whether the system works for years.",
        points: ["<b>Agents handle files better than apps.</b> Reading and writing text is what they do best; mistakes show up in a readable diff.",
          "<b>Portability is real.</b> Notes apps shut down, change prices, or make export awkward. A folder of text files opens in any editor and works with any future agent.",
          "<b>Links are a graph.</b> <code>[[Page name]]</code> makes a real network of notes, readable as text, and in the worst case it is still just words.",
          "<b>Version control works.</b> Text has diffs, so every change the agent makes can be read, reverted, and traced to a run. That is what makes unattended agents safe.",
          "<b>The limits:</b> large structured queries (export to a database), rich media (attachments beside the text), and two agents editing one file at once (conflicts)."] },
      { title: "The methods that came before", plain: "None of this is new. The old methods were mostly right; they just required a human to do boring linking work forever.",
        table: [["Method", "Still right", "What it cost"],
          ["[[zettelkasten|Zettelkasten]] (Luhmann; Ahrens, <i>How to Take Smart Notes</i>)", "One idea per note, dense links, your own words", "Every link was manual. Most slip-boxes die in month three."],
          ["[[para|PARA]] (Forte, <i>Building a Second Brain</i>)", "Projects and reference want different structures (the two layers)", "Constant filing decisions, as notes change category over time"],
          ["[[evergreen-note|Evergreen notes]] (Matuschak)", "Notes written for your future self, improved over years: the bar for a good concept page", "His objection stands: the writing is the thinking, and delegating it means not doing the thinking"]],
        points: ["<b>What changed:</b> the maintenance can now be delegated.",
          "<b>What did not:</b> you still choose what to read and what matters. A vault fed indiscriminately is a well-organized pile.",
          "A good split: write the concept pages that matter most to you yourself, and let the agent handle sources, people, and linking. Decide it deliberately."] },
      { title: "Wiki versus RAG", plain: "[[rag]] searches a pile of document chunks every time you ask. A wiki does the work once, when a source arrives, and reuses it. The first figure above compares them row by row.",
        points: ["Understanding accumulates in a wiki; in RAG the corpus only gets larger.",
          "Contradictions become visible on a page instead of hiding in two chunks that are never retrieved together.",
          "The cost: filing is expensive, quality depends on the filing rules, and a page nobody linked cannot be reached."] },
      { title: "What good looks like", plain: "The test: ask it about something you half-remember reading months ago and cannot name precisely. If it returns the idea, the sources, and two related things you had forgotten, it works.",
        points: ["<b>Healthy:</b> you reach for it before searching the web; answers cite pages that say what the answer said; the graph has clusters you did not plan; new sources mostly update existing pages; it occasionally contradicts you.",
          "<b>Trouble:</b> the share of unlinked pages climbing; pages that read as summaries rather than explanations; concept pages untouched for months while sources pile up; you stopped opening it (usually capture broke, not the idea).",
          "The timeline: week one feels like a folder with extra steps; weeks two to four bring the first real connection; month three answers faster than rereading; month six knows things you do not remember learning."] }
    ],
    practice: {
      title: "Write your vault's charter", min: 30,
      intro: "Before installing anything, decide what this second brain is for. You count your save-for-later pile, choose the first twenty sources, and write five questions you want it to answer by month three. Claude Code turns your answers into a one-page charter.",
      steps: ["Count your unread saved items across bookmarks, “watch later”, screenshots, and read-later apps. Write the rough number down.", "Paste the prompt and answer its questions.", "Keep the charter; Unit 3.02 puts it into the vault."],
      prompt: "Interview me, one question at a time, to write course-vault/charter.md for a second brain about learning AI as a project manager (this Paper Trail course, my labs, and AI project work in general). Ask about: (1) roughly how many saved-but-unread items I have and where; (2) the 20 sources I want to feed in first (stations I have done, papers, articles, my lab READMEs and failure logs); (3) five questions I want the vault to answer well by month three; (4) which layer to build first, knowledge or projects, and why; (5) what must never go into this vault because it will be public (work data, client names, anything personal). Then write the charter in plain English, one page, with those five sections, and add a sixth section: “The test I will run in month three”.",
      observe: ["Are your five questions ones that need several sources joined together? Those are where a second brain shines.", "Did you name what must never go in? That rule goes into the vault's CLAUDE.md in the next unit."],
      done: "course-vault/charter.md exists with your first 20 sources, five target questions, and a privacy rule."
    },
    quiz: [
      { q: "Why did most earlier note systems fail?", options: ["The apps were bad", "People stopped doing the boring work of linking notes", "Notes were too long", "There were no search tools"], answer: 1, why: "Manual linking is tedious, and an unlinked note collection is just a folder. The agent now does the linking." },
      { q: "In the LLM wiki pattern, what happens when a new source about an existing topic arrives?", options: ["A new summary page is added beside the others", "It is folded into the existing pages, which improve", "It replaces the old page", "It stays in the raw archive only"], answer: 1, why: "Compilation, not summary: the concept page gets better with each source rather than becoming a list of summaries." },
      { q: "When is RAG the better choice than a wiki?", options: ["A personal collection of a few hundred notes", "A million documents nobody organized", "When you want contradictions to be visible", "When you want no infrastructure"], answer: 1, why: "The wiki suits a curated personal collection; RAG suits large, unorganized corpora where filing everything by hand (or by agent) would be too costly." },
      { q: "Your vault feels useless after one week. What is the most likely explanation?", options: ["The idea does not work", "It is early: value comes from density", "You need more plugins", "The model is too small"], answer: 1, why: "Week one feels like a folder with extra steps. Connections appear at around fifty sources; most people quit just before." }
    ],
    sources: [
      { t: "LLM wiki (Andrej Karpathy, GitHub gist, April 2026)", note: "the pattern this route implements; linked from the Library" },
      { t: "How to Take Smart Notes (Sönke Ahrens)", note: "the Zettelkasten method" },
      { t: "Building a Second Brain (Tiago Forte)", note: "PARA" },
      { t: "Evergreen notes (Andy Matuschak)", url: "https://notes.andymatuschak.org/Evergreen_notes", note: "and the objection worth keeping" }
    ],
    next: "Unit 3.02 sets the whole thing up: Obsidian, Claude Code, the instruction file, the folder layout, and backups."
  });

  /* ================= Unit 3.02 · Setup ================= */
  P.addUnit({
    id: "brain-setup", track: "brain", num: 2, short: "Setup", kicker: "Capture",
    plainTitle: "Set it up: Obsidian, Claude Code, and the folder layout",
    hook: "Two free-to-start pieces: Obsidian stores and shows your notes; Claude Code reads and writes them. Add one instruction file that tells the agent who you are and how the vault works, a simple folder layout, and version control so every change can be undone.",
    source: "02 · Setup", sourceUrl: SRC + "02-setup",
    bridge: "Unit 3.01 explained the idea. Now you build it. If you did Unit 2.04, you will recognise the instruction file and the “keys, not prompts” rule: they are the harness for this agent.",
    explain: [
      "[[obsidian|Obsidian]] is the storage half. It is free for personal use, keeps every note as a plain text file on your own computer, and draws the links between notes as a map. Claude Code is the half that reads and writes; it needs a paid Claude plan, which you already have.",
      "The most important file is [[claude-md|CLAUDE.md]] at the top of the vault. The agent reads it at the start of every session. A good one is the difference between an assistant that knows your situation and one you brief from scratch every time.",
      "The folder layout keeps the two layers apart: <code>raw/</code> for untouched sources, <code>wiki/</code> for the knowledge layer, <code>projects/</code> for current work, and <code>output/</code> for things you will share. Git records every change, so a bad agent run is one command to undo."
    ],
    everyday: { title: "Setting up a new office", text: "A filing cabinet (Obsidian and the folders), an assistant with a key to the office (Claude Code), an onboarding brief on their desk (CLAUDE.md), and a CCTV recorder that lets you rewind any day (git)." },
    example: { title: "Your course vault", text: "A folder called course-vault with a CLAUDE.md describing you as a project manager learning AI, wiki folders for concepts, sources, people, and tools, and one project folder for your capstone, Delivery Copilot. It lives in your portfolio repository, so it is versioned and public-safe." },
    words: [["obsidian", "a free app that shows a folder of text notes and their links"], ["claude-md", "the instruction file the agent reads first, every session"], ["markdown", "plain text with light formatting, like # for headings"], ["version-control", "a history of every change, so any change can be undone"]],
    remember: [
      "Start on the plain filesystem; add MCP only when you need it.",
      "Get interviewed to write CLAUDE.md, and fix it whenever the agent errs twice.",
      "Keys, not prompts: control what the agent can do with permissions, not instructions."
    ],
    figures: [
      { w: "flow", title: "Setup in six steps", plain: "About an hour, in this order. Click each step.",
        opts: { steps: [
          { t: "Install Obsidian", s: "free, local", d: "Download from obsidian.md. Create a vault: a folder with a short name and no spaces, somewhere your cloud sync client does not rewrite files." },
          { t: "One note by hand", s: "type [[goals]]", d: "Make a note, type a sentence, then type &#91;&#91;goals&#93;&#93;. The bracketed word becomes a link to a page called goals. Click it and Obsidian creates the page. That is the whole data model.", like: "Learning to drive in an empty car park first." },
          { t: "Open Claude Code", s: "in the vault folder", d: "Use the Code tab in the Claude desktop app, or run claude in a terminal from inside the vault folder. The agent reads and writes the files directly." },
          { t: "Get interviewed", s: "writes CLAUDE.md", d: "Paste the interview prompt. Answer one question at a time, as if briefing a co-founder on their first day." },
          { t: "Create the layout", s: "raw · wiki · projects · output", d: "Ask the agent to create the folders and one project folder per area you work on." },
          { t: "Start version control", s: "git", d: "Initialize git, add a .gitignore, and commit. From now on, commit before and after every big agent run." }
        ] },
        takeaway: "Make one note by hand before automating anything, so the mechanism is not abstract." },
      { w: "tree", title: "The vault layout", plain: "Two layers in one folder: the knowledge layer (wiki) and the project layer (projects). Click any folder.",
        opts: { items: [
          { p: "course-vault/", depth: 0, d: "The whole second brain. Everything the agent writes lands here as markdown files." },
          { p: "CLAUDE.md", depth: 1, s: "who you are, how the vault works", d: "Read by the agent at the start of every session: who you are, your goals, how to talk to you, and the vault's rules." },
          { p: "raw/", depth: 1, s: "sources, never edited", d: "The archive of what you saved: clipped articles, transcripts, PDFs. Never edit it. If a source is wrong, replace the file and re-ingest." },
          { p: "wiki/", depth: 1, s: "the knowledge layer", d: "What you have read and understood, organized by idea. It grows forever." },
          { p: "sources/", depth: 2, s: "one page per item", d: "One page per ingested source: what it says, in a few paragraphs, linked to the concepts it touches." },
          { p: "entities/", depth: 2, s: "people, organizations, tools", d: "A page for each person, company, product, or tool that comes up repeatedly." },
          { p: "concepts/", depth: 2, s: "ideas and methods", d: "The heart of the vault: one page per idea, improved as sources accumulate." },
          { p: "synthesis/", depth: 2, s: "comparisons, open questions", d: "Pages that join several concepts: comparisons, themes, unresolved questions." },
          { p: "index.md", depth: 2, s: "catalog of every page", d: "A list of every page with a one-line summary. The agent reads it first when answering." },
          { p: "log.md", depth: 2, s: "what the agent did", d: "A dated record of every agent run, so the vault can be audited." },
          { p: "projects/", depth: 1, s: "the project layer", d: "What you are working on now. Each project has its own CLAUDE.md and four folders." },
          { p: "delivery-copilot/", depth: 2, s: "your capstone", d: "One goal, stated in its own CLAUDE.md. Inputs/ (ideas, briefs), Process/ (work in progress), Outputs/ (finished work), Feedback/ (results, what happened)." },
          { p: "output/", depth: 1, s: "things you will share", d: "Generated reports and drafts. Anything for outside use goes here, never loose in the vault root." }
        ] },
        takeaway: "Do not nest deeply. Folders four levels down stop getting opened; the links are the navigation, not the tree." }
    ],
    lessons: [
      { title: "Obsidian and your first vault", plain: "Obsidian is free, stores everything as plain files on your own machine, and shows the links between notes as a graph. If you ever stop using the app, the files still open in any text editor.",
        points: ["Put the vault somewhere with a stable path you can type, with no spaces in the name.",
          "Avoid a folder your cloud sync client rewrites aggressively: an agent writing files while sync rewrites them produces painful conflict copies.",
          "Settings worth changing now: one consistent link format (mixed formats cause broken links after renames); “automatically update internal links” on; “show frontmatter” on, so you see the metadata the agent writes."] },
      { title: "Claude Code in the vault", plain: "Three ways to run it, and the choice only affects where you type.",
        points: ["<b>A: the desktop app's Code tab.</b> Claude Code without a terminal. Start here if you have never used a command line.",
          "<b>B: the terminal.</b> <code>cd</code> into the vault and run <code>claude</code>. The agent reads and writes the files directly. This simplest setup is enough for ingestion, structuring, and retrieval.",
          "<b>C: inside Obsidian.</b> Community plugins (Claudian, Copilot) put an agent in a side pane. Convenient, but it invites quick edits that never reach the log. A sensible split: the plugin for conversation and drafting, the terminal or a scheduled task for anything that writes wiki pages.",
          "Claude Code needs a paid Claude plan; the free Claude.ai plan does not include it.",
          "First run: “Read CLAUDE.md and wiki/index.md, then tell me what this vault contains and what is missing.” If it invents a structure you did not ask for, your CLAUDE.md is too vague.",
          "Grant write access to the vault and nothing else."] },
      { title: "Plain files or MCP?", plain: "Both work. Start with plain files. Move to [[mcp]] when you want the agent to reach the vault from sessions not running inside it, which mostly matters once you schedule tasks.",
        fig: { w: "compare", title: "Filesystem versus MCP", opts: { cols: [{ t: "Filesystem", s: "start here" }, { t: "MCP", s: "add later" }],
          rows: [["Setup", "None: open Claude Code in the vault folder", "A plugin plus one config command"],
            ["Obsidian must be open?", "No", "Yes: the plugin serves the connection"],
            ["Reach", "The folder you started in", "The whole vault, from any session"],
            ["What goes wrong", "Almost nothing", "Plugin off, app closed, wrong port"]] } },
        points: ["The MCP route uses Obsidian's Local REST API plugin. Its key is shown with the word “Bearer” in front: that word is not part of the key, and copying it is the most common first-try failure. The default port is 27124.",
          "That key grants full read and write access to your notes: keep it on your own machine (127.0.0.1), never expose the port, and treat it like a password."] },
      { title: "Write CLAUDE.md by being interviewed", plain: "An empty vault with a good CLAUDE.md is more useful than a full vault without one, because context about you shapes every page the agent writes. Writing it cold produces a thin version; answering questions produces a specific one.",
        code: { title: "The interview prompt", lang: "prompt", lines: [
          ["You are setting up my second brain. Interview me ONE question at a time to build my profile.", "One at a time gets better answers than a questionnaire."],
          ["Ask about: who I am and what I do, my goals for this year, how I want you to talk to me,", "Role, dated goals, and communication style."],
          ["my strengths and weaknesses, and my current projects.", "Weak spots tell the agent when to challenge you rather than agree."],
          ["Wait for each answer before the next question.", ""],
          ["When finished, write everything into CLAUDE.md at the vault root, structured with headers.", "The result is your agent's onboarding brief."]
        ] },
        points: ["<b>Belongs:</b> who you are; goals with a horizon (this year, this quarter); how to talk to you; strengths and weak spots; current projects, one line each; the vault's own rules.",
          "<b>Does not belong:</b> anything that changes weekly (that goes in project files), long explanations of things the model knows, credentials, and aspirations you will not act on (the agent takes them literally).",
          "<b>Two levels:</b> the root file is strategy; each project folder gets its own CLAUDE.md for that project only.",
          "When the agent does something wrong twice, that is a CLAUDE.md problem. Add the rule with its reason; re-read the file monthly."] },
      { title: "The vault layout", plain: "Two layers in one folder tree, kept apart: the knowledge layer in <code>wiki/</code> and the project layer in <code>projects/</code>. The second figure above walks through every folder.",
        points: ["They connect through links: a project page links to the concepts it uses, and concept pages collect references from the projects that used them.",
          "Create projects by asking: “Create a project folder called delivery-copilot with Inputs, Process, Outputs, and Feedback, and a CLAUDE.md stating its one goal and your role. Interview me if you need details.”",
          "One goal per project. Projects with three goals produce work that serves none of them.",
          "Rules: never edit <code>raw/</code>; do not nest deeply; anything for outside use goes to <code>output/</code> or a project's <code>Outputs/</code>."] },
      { title: "Scope the agent to one project", plain: "Pointed at the whole vault, every task competes with everything you ever saved, and answers get broader and shallower. Pointed at one project, the agent reads that project's instructions and does the job in front of it.",
        like: "Planning a holiday at the kitchen table with all your paperwork, versus packing with only the checklist and the suitcase in front of you.",
        points: ["Rule of thumb: <b>the full vault plans, a single project ships.</b>", "To scope, open the project folder as its own vault in Obsidian, or start Claude Code inside that folder.",
          "To bring knowledge in: ask the research question against the full vault first, save the answer into the project's <code>Inputs/</code>, then scope down and work. That keeps the decision about what matters with you."] },
      { title: "Live data, and “keys, not prompts”", plain: "Static notes are half a brain. Calendar, email, and chat connect through MCP the same way Obsidian does. Give every connector the narrowest access that does the job, and prefer read-only.",
        like: "A house-sitter gets a key to the front door, not to the safe, however trustworthy the note you left them.",
        points: ["<b>Keys, not prompts.</b> Telling an agent “do not delete this” is a suggestion, not a safety setting. If it technically can delete a file or send an email, one day, in some situation you did not predict, it will.",
          "Control what is possible with read-only tokens, scoped keys, and separate credentials per connector. Then the instruction in CLAUDE.md is a preference on top of a real boundary.",
          "Connect where decisions and commitments live (calendar first). Skip sources that produce volume without signal; they make every future answer worse."] },
      { title: "Plugins worth installing, later", plain: "Obsidian works fine with none. Add a plugin when you hit the problem it solves.",
        points: ["<b>Dataview:</b> queries over the metadata in your pages. One useful example lists concept pages nobody has touched in 90 days.",
          "<b>Templater:</b> templates for notes you write by hand (the agent does not need it).",
          "<b>Later:</b> Git (commit from inside Obsidian), Importer (bring in Notion, Evernote, Apple Notes), Find orphaned files and broken links, Omnisearch (full-text search, including PDFs).",
          "<b>Avoid</b> plugins that rewrite files in the background (auto-format, auto-sort, rename on a schedule): they fight the agent. And avoid fifteen plugins on an empty vault."] },
      { title: "Git, sync, and backups", plain: "A vault is a folder of text files, which makes it an ideal git repository, and git is what makes an agent safe to run unattended. Without it, a bad run is a mystery; with it, every change is a diff you can read and undo.",
        points: ["Commit before a big ingest and after it. Then a bad batch is one command to undo, not an afternoon of repairs.",
          "Never commit API keys (check the plugins folder before the first push). Keep the remote private if any part is private: a second brain is one of the most revealing documents about a person.",
          "Sync options: a git remote (free, versioned), Obsidian Sync (paid, encrypted, good on mobile), or a cloud drive (works, but keep agent work on one machine).",
          "<b>Sync is not backup:</b> sync copies a bad delete to every device. Keep one copy off the sync path, and test a restore once. The real risk is an automation that quietly rewrote two hundred pages three weeks ago."] }
    ],
    practice: {
      title: "Set up your course vault", min: 45,
      intro: "You install Obsidian, create the course vault inside your portfolio repository, get interviewed for its CLAUDE.md, create the layout with one project for Delivery Copilot, and commit. This vault is public-safe by design; keep any work or personal vault separate and private.",
      steps: ["Install Obsidian (free) and open your portfolio repository's course-vault folder as a vault (create it if needed).", "Make one note by hand with a &#91;&#91;goals&#93;&#93; link and click through to create the page.", "Open Claude Code in the course-vault folder and paste the prompt.", "Open the vault in Obsidian and look at the graph view: a few dots, which is normal."],
      prompt: "Set up this folder as my second brain about learning AI as a project manager.\n1. Interview me ONE question at a time for CLAUDE.md: who I am, my goals for this year and this quarter, how to talk to me, my strengths and weak spots, and current projects. Include the privacy rule from charter.md: this vault is public, so never write work data, client names, or personal details.\n2. Add a \"Vault rules\" section to CLAUDE.md: never edit raw/; one idea per page; link every new page to at least two existing pages; log every run in wiki/log.md; anything for sharing goes to output/.\n3. Create raw/, raw/assets/, wiki/sources/, wiki/entities/, wiki/concepts/, wiki/synthesis/, wiki/index.md, wiki/log.md, projects/, output/.\n4. Create projects/delivery-copilot/ with Inputs/, Process/, Outputs/, Feedback/, and a CLAUDE.md stating its one goal and your role. Interview me if needed.\n5. Move charter.md into the vault root and link it from CLAUDE.md.\n6. Add a .gitignore for .obsidian/workspace*.json and .trash/, then show me the git commands to commit. Do not push.\nFinally: read CLAUDE.md and wiki/index.md and tell me what the vault contains and what is missing.",
      observe: ["Did the agent's final summary match what you asked for? If it invented structure, tighten CLAUDE.md.", "Is your privacy rule stated clearly enough that a stranger could follow it?"],
      done: "The vault opens in Obsidian, CLAUDE.md is specific to you, the layout and Delivery Copilot project exist, and the first commit is made."
    },
    quiz: [
      { q: "When should you add the MCP connection to Obsidian?", options: ["Before anything else", "When you need the vault reachable from sessions not running inside it, such as scheduled tasks", "Never", "Only on Windows"], answer: 1, why: "Start on the plain filesystem. MCP earns its place when you need the vault from elsewhere, and it requires Obsidian to be open." },
      { q: "The agent keeps writing pages that are too long. What should you do?", options: ["Repeat the request more forcefully each time", "Add a rule with its reason to CLAUDE.md", "Switch to a different model", "Delete the vault"], answer: 1, why: "When the agent errs twice, it is a CLAUDE.md problem. A rule with its reason attached is applied sensibly in cases you did not foresee." },
      { q: "What does “keys, not prompts” mean?", options: ["Use keyboard shortcuts", "Control what the agent can do with permissions, not instructions", "Write shorter prompts", "Store API keys in the prompt"], answer: 1, why: "An instruction is a suggestion. A read-only token makes the dangerous action impossible." },
      { q: "Why is sync not a backup?", options: ["Sync is too slow", "Sync copies a bad delete or rewrite to every device", "Sync costs money", "Sync does not handle text files"], answer: 1, why: "Keep one copy off the sync path and test a restore. The real risk is an automation that quietly damaged many pages weeks ago." }
    ],
    sources: [
      { t: "Obsidian", url: "https://obsidian.md", note: "free for personal use" },
      { t: "Claude Code setup documentation (Anthropic)", url: "https://code.claude.com/docs", note: "plans and installation" },
      { t: "Second Brain OS vault template", url: "https://github.com/undefined-ui/second-brain-os/tree/main/vault-template", note: "a working CLAUDE.md and folder layout" }
    ],
    next: "Unit 3.03 starts feeding the vault: web pages, videos, PDFs, chat exports, voice notes, and newsletters."
  });

  /* ================= Unit 3.03 · Ingestion ================= */
  P.addUnit({
    id: "brain-ingest", track: "brain", num: 3, short: "Feeding it", kicker: "Capture",
    plainTitle: "Feed it: articles, videos, papers, chats, and meetings",
    hook: "Capture decides whether the vault survives: every extra step between seeing something and saving it is a step where you will stop. And what you feed it sets its ceiling: a hundred clipped listicles make a hundred thin pages and a graph that says nothing.",
    source: "03 · Ingestion", sourceUrl: SRC + "03-ingestion",
    bridge: "Your vault is set up (Unit 3.02). Now you fill it. Every source lands first in <code>raw/</code>, untouched; the agent turns it into wiki pages later, in batches. That separation is the same “filter first, then process” idea you saw in Route 2.",
    explain: [
      "Capturing and [[ingest|ingesting]] are two separate steps on purpose. Capture is one click or one command, always the same one, into <code>raw/</code>. Ingesting (turning sources into linked wiki pages) happens later in a batch, so the agent can notice that three things you saved this week are about the same idea.",
      "Each kind of source has its own trap. Web pages lose their comment threads. Video captions have no punctuation. PDFs scramble columns. Chat logs hold private details. Meeting recordings hold other people's words. Newsletters repeat the same story four times.",
      "Be choosy. Before saving, ask: can I name what I would ask this source later? If not, do not save it. Every low-value page costs twice: once to ingest, and again every time the agent reads past it."
    ],
    everyday: { title: "A kitchen pantry", text: "Groceries go into the pantry as they arrive (capture). Cooking happens later, in batches, when you can see what goes together (ingest). And a pantry full of snacks you bought out of guilt makes it harder to find the ingredients you need." },
    example: { title: "One week of AI learning", text: "Monday you clip an engineering blog post; Tuesday you save a conference talk's transcript; Wednesday you drop in the Lost in the Middle PDF; Friday you export one useful chat about agents. On Saturday one batch ingest turns them into a source page each, three concept pages, and links to what you already had." },
    words: [["ingest", "turning a saved source into linked wiki pages"], ["web-clipper", "a browser button that saves a page as a text file"], ["backfill", "importing years of old material in one careful run"]],
    remember: [
      "One-click capture into raw/; ingest later, in batches.",
      "Each source type has a trap: check the text before the agent builds on it.",
      "Backfill oldest first, ten at a time, and read every page of the first batch."
    ],
    figures: [
      { w: "layers", title: "Seven kinds of source, and the trap in each", plain: "Click a source type to see how to capture it and what goes wrong.",
        opts: { items: [
          { t: "Web articles", s: "Obsidian Web Clipper", tag: "most common", d: "The official browser extension saves the readable part of a page as markdown into raw/. Add frontmatter (title, URL, author, date). Empty fields are fine; a guessed date is not.", points: ["Paywalls: it saves what the browser shows, so check you did not save the paywall notice.", "Documentation sites: save the entry page and let the agent fetch the rest.", "Threads and comments: the clipper drops replies, where the value often is."] },
          { t: "Videos and podcasts", s: "transcripts", tag: "lowest retention", d: "Pull the captions (or transcribe locally with the free Whisper model), save with the title, channel, and URL, keep a timestamp every few minutes, and have the agent add punctuation before ingesting.", points: ["Split a three-hour podcast by topic before ingesting.", "Transcribe talks and interviews with specific claims, not tutorials you watched once."] },
          { t: "PDFs, papers, books", s: "check the text first", tag: "most likely garbage", d: "Two columns turn into interleaved lines and tables collapse. Read a paragraph from the middle of the extracted text before ingesting. Scans need OCR first, and numbers from OCR need checking.", points: ["Papers: record the question, method, results with real numbers, sample sizes, and the authors' own limitations.", "Books: ingest your highlights, one source page per book.", "Figures: screenshot them into raw/assets/ and reference them."] },
          { t: "Chat exports", s: "Claude and ChatGPT history", tag: "most sensitive", d: "Export as JSON, split into one file per conversation, and drop the short throwaway ones (often around 90% of history). Sort the rest: ingest, keep in raw/ only, or delete.", points: ["Extract the question you asked, what you had wrong at first, and what changed your mind.", "Delete anything that does not belong before ingesting; redacting later is unreliable."] },
          { t: "Voice notes and meetings", s: "local transcription", tag: "other people's words", d: "Record, transcribe locally, and correct names while you remember them. A voice note is a draft: extract the one idea. A meeting yields decisions, commitments with owners, and open questions.", points: ["Commitments go to the project's Inputs/, not the wiki: they are work, and stale in a week.", "Recording people has legal consent rules that vary by country."] },
          { t: "Newsletters and email", s: "a dedicated address", tag: "easiest to over-ingest", d: "Subscribe newsletters to an address that exists only for the vault. The same story in four digests is not four confirmations: deduplicate. Let the agent shortlist the primary sources worth clipping properly.", points: ["Most email is not knowledge. Forward only threads where a real decision was made or something was explained well.", "Never wire your whole inbox in on a schedule."] },
          { t: "Backfill", s: "years of old material", tag: "the run that goes wrong", d: "Oldest first, ten sources per batch, update the index and log and commit after each batch, and read every page the first batch produces.", points: ["Triage titles first: archives are half dead links and things never opened.", "After the run, lint: a big import always leaves orphans and near-duplicates."] }
        ] },
        takeaway: "Whatever the source, the honest test at capture time is: can I name what I would ask this later?" },
      { w: "flow", title: "Capture now, ingest later", plain: "Two steps, on purpose. Click each.",
        opts: { steps: [
          { t: "See it", s: "in the browser, a video, a meeting", d: "The decision to save happens where you are. Anything that needs switching windows loses." },
          { t: "Capture", s: "one click into raw/", d: "Always the same single action: the clipper button, a share sheet, a forwarding address. Raw files are never edited afterwards." },
          { t: "Wait", s: "let a batch build up", d: "During the day you only capture. No filing decisions." },
          { t: "Ingest", s: "one batch", d: "The agent reads the batch together, so it notices when several sources are about the same idea, and folds them into existing pages." },
          { t: "Check and commit", s: "index, log, git", d: "Update the index and the log, commit, and skim the new pages." }
        ] },
        takeaway: "Ingesting one source at a time gives the agent no chance to see that three of this week's saves are about the same thing." }
    ],
    lessons: [
      { title: "Capture decides whether the vault survives", plain: "The goal is one click or one command, always the same one. And quality in sets the ceiling: what you feed it is still your choice.",
        points: ["Clip what you would want to find again in a year: primary sources, engineering posts, papers, documentation, and arguments you disagree with.", "Skip news that will be stale in a week, listicles, and anything you are saving out of guilt.", "The test at capture time: can you name what you would ask this source later? If not, do not clip it."] },
      { title: "Web articles", plain: "The Obsidian Web Clipper (official, free, for all major browsers) saves the readable part of a page as markdown, using the same engine as Firefox Reader View. Set its destination to <code>raw/</code>.",
        code: { title: "A clipper template with frontmatter", lang: "markdown", lines: [
          ["---", "Frontmatter: facts about the file, so the agent need not reread it."],
          ["title: {{title}}", ""],
          ["source: {{url}}", "The URL is what turns a claim into a citation."],
          ["author: {{author}}", "Often empty. An empty field is better than a guessed one."],
          ["published: {{published}}", "Also often empty; the agent then says the source is undated rather than inventing a date."],
          ["clipped: {{date}}", ""],
          ["type: article", ""],
          ["---", ""],
          ["{{content}}", "The page body."]
        ] } },
      { title: "Videos and podcasts", plain: "An hour of a conference talk leaves almost nothing behind a week later. A transcript is just text, which is exactly what the vault wants.",
        points: ["Save the transcript with the video's title, channel, and URL. Without the URL it is an anonymous wall of text.", "Keep coarse timestamps every few minutes, so a claim “from minute 34” can be checked in ten seconds.", "Clean before ingest: auto-captions have no punctuation or speaker labels, and pages built from them come out noticeably worse.", "Podcasts: check the show notes for a transcript, or transcribe locally with Whisper (free; the audio never leaves your machine)."] },
      { title: "PDFs, papers, and books", plain: "PDFs are the source most likely to arrive as garbage. Check the extracted text before ingesting: it takes ten seconds and saves rewriting pages later.",
        points: ["Scanned documents are images: run OCR first (ocrmypdf, free), and verify names and numbers.",
          "For papers, instruct the agent: “Build the source page around the question, the method, the result with its actual numbers, and the limitations the authors state. Record sample sizes. Do not report a finding without the condition it holds under.” Findings stripped of their conditions become confident nonsense two years later.",
          "Books: ingest your highlights, not the book. Keep quotes short and cited; reproducing half a chapter is a copyright problem and a retrieval problem."] },
      { title: "Chat exports", plain: "Your chat history is the most underrated source you own and the most sensitive: years of problems worked through and explanations tailored to what you did not understand at the time.",
        points: ["Both Claude and ChatGPT export full history as JSON from account settings.",
          "Do not ingest it all. Sort into three piles: worth ingesting (you worked something out or got an explanation that landed), keep in raw/ only, and delete.",
          "A chat log is a record of you thinking. The useful extraction is the question you asked, what you had wrong at the start, and what changed your mind.",
          "Decide what does not belong in the vault at all and delete it from raw/ before ingesting. Once it spreads into concept pages, removing it is unreliable."] },
      { title: "Voice notes and meetings", plain: "Voice is the only capture that works while walking or driving. A voice note is a draft, not a source; a meeting is three useful things buried in a lot of talk.",
        like: "Minutes, not a recording: decisions, actions with owners, open questions.",
        points: ["Voice note instruction: “Extract the actual idea, drop the false starts, and write it as one short concept page in my words. Two unrelated ideas make two pages.”",
          "Meeting instruction: “Extract decisions, commitments with who owns each, and open questions. Link every person to their entity page. Skip discussion that led nowhere.”",
          "Route commitments to the project's <code>Inputs/</code>, not the wiki.",
          "Consent rules for recording vary by country. And keep other people's unguarded words out of any vault you might share."],
        pm: "This is the same discipline as good meeting minutes. A project vault fed only decisions, owners, and open questions is far more useful than one fed whole transcripts." },
      { title: "Newsletters and email", plain: "Newsletters are the easiest source to automate and the easiest to over-ingest. Automate capture, then be strict about what gets a page.",
        points: ["Use a dedicated address for the vault, so automation never touches your real mail.",
          "Deduplicate: the same launch in four digests is not four independent confirmations. A wiki that treats it as such overstates how settled something is.",
          "Let the agent read the digests and shortlist the two or three primary sources worth clipping properly. The newsletter did its job as a filter.",
          "Never wire your whole inbox in on a schedule: it ingests everything about everyone you write to, most of it not yours to keep."] },
      { title: "Backfilling years of material", plain: "Importing everything at once is the run that goes wrong: expensive, hours long, and done in the wrong order it produces a pile, not a structure. It is also the run that makes the vault useful in one sitting.",
        points: ["<b>Oldest first,</b> so later sources update pages earlier ones created, and the wiki records how your understanding developed. Newest first turns every old source into a contradiction to reconcile.",
          "<b>Ten per batch.</b> After each: update the index, append to the log, commit, report. Cost stays visible, quality stays checkable, and a crash costs one batch.",
          "<b>Read every page of the first batch.</b> A flaw in batch one is a flaw in four hundred pages by the end. Fix CLAUDE.md and re-run before continuing.",
          "Triage titles first, check for dead links (the Internet Archive often has a copy), record progress in the log so you can resume, and lint afterwards."] }
    ],
    practice: {
      title: "Ingest your first ten sources", min: 45,
      intro: "You capture ten sources about what you are learning, from at least four source types, then run one batch ingest with Claude Code, read every page it produces, and fix the instructions before going further.",
      steps: ["Install the Obsidian Web Clipper and set its folder to raw/. Clip three good articles about AI agents or AI project management.", "Add one talk transcript, the Lost in the Middle PDF (arxiv.org/abs/2307.03172), two of your own station or lab READMEs, and one useful AI chat conversation (copy it into a file).", "Paste the prompt and approve the plan.", "Read every page the batch produced. Note anything that reads like a summary rather than an explanation."],
      prompt: "In this vault, ingest everything in raw/ that is not yet in wiki/log.md, as one batch, oldest first.\n- Check each file's text quality first (for the PDF, read a paragraph from the middle; for transcripts, add punctuation). Tell me about any file that looks garbled before using it.\n- For each source: one page in wiki/sources/ with title, url, author, published (leave empty if unknown, never guess), and a few paragraphs of what it says. For the paper: question, method, results with numbers, sample sizes, and the authors' limitations.\n- Create or update concept pages (one idea each) and entity pages for recurring people and tools. Update existing pages rather than adding parallel ones. Link the first mention of every concept or entity.\n- Never include work data, client names, or personal details (see the privacy rule in CLAUDE.md).\n- Update wiki/index.md and append one line to wiki/log.md: date, files, pages created and updated, links added.\n- Then list every page you created or changed, so I can read them all, and suggest one change to CLAUDE.md that would have made the pages better.",
      observe: ["How many concept pages came out of ten sources? Ten to twenty is healthy; forty means over-splitting.", "Did any page restate a source instead of explaining an idea?", "Did the paper's page keep the conditions with the findings?"],
      done: "Ten sources are ingested, you have read every page, and you have added at least one rule to CLAUDE.md based on what you saw."
    },
    quiz: [
      { q: "Why are capturing and ingesting separate steps?", options: ["To save disk space", "So the agent can see that several saves are about the same idea and fold them together", "Because Obsidian requires it", "To slow you down"], answer: 1, why: "Batch ingest lets the agent connect related sources. One at a time, it cannot see the pattern." },
      { q: "In what order should a backfill run?", options: ["Newest first", "Oldest first", "Alphabetical", "Largest files first"], answer: 1, why: "Oldest first lets later sources update earlier pages, so the wiki records how your understanding changed." },
      { q: "Four newsletters report the same product launch. How should the vault treat this?", options: ["As four confirmations", "As one story; deduplicate and find the primary source", "Ignore all four", "Create four concept pages"], answer: 1, why: "Repeated coverage is not independent evidence. Treating it so makes the wiki overstate how settled something is." },
      { q: "Where should action items from a meeting go?", options: ["A concept page in the wiki", "The relevant project's Inputs folder", "The raw archive only", "Nowhere"], answer: 1, why: "Commitments are work, not knowledge, and they go stale within a week. They belong in the project layer." }
    ],
    sources: [
      { t: "Obsidian Web Clipper", url: "https://obsidian.md/clipper", note: "official, free" },
      { t: "Whisper (OpenAI, open source)", url: "https://github.com/openai/whisper", note: "local transcription" },
      { t: "OCRmyPDF", url: "https://github.com/ocrmypdf/OCRmyPDF", note: "free OCR for scanned PDFs" }
    ],
    next: "Unit 3.04 sets the rules that decide whether all these pages become a useful map or a landfill."
  });

  /* ================= Unit 3.04 · Structuring ================= */
  P.addUnit({
    id: "brain-structure", track: "brain", num: 4, short: "Structuring", kicker: "Connect",
    plainTitle: "Shape the pages: one idea, clear links, honest disagreements",
    hook: "Two vaults holding the same thousand sources can be a research partner or an unsearchable pile. The difference is entirely in a handful of rules: one idea per page, four page types, link the first mention, record disagreements instead of overwriting, and keep a catalog and a log.",
    source: "04 · Structuring", sourceUrl: SRC + "04-structuring",
    bridge: "In Unit 3.03 you fed the vault and probably saw pages you did not love. This unit is the fix. Every rule here belongs in your CLAUDE.md, because a rule mentioned once in a chat lasts one session, while a rule in CLAUDE.md applies to every page the agent ever writes.",
    explain: [
      "When the agent answers a question, it pulls in whole pages. A page covering four topics drags three irrelevant ones into view every time; a page covering one idea is found and linked precisely. So the first rule is [[atomic-note|one page, one idea]].",
      "Every page has one of four types: a source (what one item said), an entity (a person, company, or tool), a concept (an idea, improved as sources arrive), or a synthesis (something no single source said). The type, dates, and other names go in the page's [[frontmatter]].",
      "Links are the whole value. Link the first mention of every concept on every page, in both directions. And when a new source disagrees with a page, the page records both views, dated and attributed. It never silently overwrites."
    ],
    everyday: { title: "A well-run reference library", text: "One book per topic, not a binder of loose clippings. A catalog at the front. Cross-references inside each book. A logbook at the desk recording what was added, merged, or removed. And when two experts disagree, the book says so, rather than quietly printing whichever opinion arrived last." },
    example: { title: "The page on “context window”", text: "One concept page, in plain words. Frontmatter says it is a concept, updated last week, also known as “context length”. It links to Lost in the Middle and Prompt caching. A “Contested” section notes that one 2026 benchmark reports less degradation, explains why the two disagree, and marks it unresolved." },
    words: [["atomic-note", "a page with exactly one idea"], ["frontmatter", "a small block of facts at the top of a page: type, dates, aliases"], ["alias", "another name for the same page, so links still find it"], ["supersession", "marking an old claim as replaced, without deleting it"]],
    remember: [
      "One idea per page, four page types, frontmatter on every page.",
      "Link the first mention of everything, both ways. No decorative links.",
      "Record disagreements with dates and sources. Never overwrite silently."
    ],
    figures: [
      { w: "layers", title: "The four page types", plain: "Every page declares its type, so you can ask the vault questions about its shape. Click each.",
        opts: { items: [
          { t: "Source", s: "what one item said", tag: "the audit trail", d: "One page per ingested article, video, paper, or conversation. Records claims as claims (“this source says X”), with URL, author, and date. It does not evaluate or merge in other views.", like: "A filed copy of a letter, with the date stamp." },
          { t: "Entity", s: "people, organizations, products, tools", tag: "the join points", d: "What it is, why it appears in your vault, and everything that mentions it. Three unrelated sources mentioning the same company connect through its page, and that connection is often worth noticing. Not a biography.", like: "A contact card with notes on every meeting." },
          { t: "Concept", s: "ideas, methods, arguments", tag: "the pages that compound", d: "Explains the idea in plain language: where it came from, what supports it, what argues against it, what is unclear. The only type where the agent combines several sources.", like: "A chapter you keep rewriting as you learn more." },
          { t: "Synthesis", s: "comparisons, themes, open questions", tag: "only when earned", d: "Exists only when it says something no single source did: two sources disagree, three describe the same pattern, a question keeps recurring. Do not write one just to have one: an agent asked for synthesis will always produce something.", like: "A briefing note comparing three vendors." }
        ] },
        takeaway: "Checklists, recipes, and config snippets are none of these: they are reference material and belong in a project folder." },
      { w: "compare", title: "Splitting a source: too many, too few, about right", plain: "One article usually yields one source page plus one to three concept pages.",
        opts: { cols: [{ t: "Over-splitting", s: "the common agent failure", c: 8 }, { t: "About right", c: 3 }, { t: "Under-splitting", c: 4 }],
          rows: [["From one article", "Ten pages, each a restated paragraph", "One source page, one to three concepts", "One summary page, no concepts"],
            ["The graph", "Looks dense, says nothing", "New pages attach to existing ideas", "No concepts for other sources to attach to"],
            ["What you end up with", "A hundred fragments to untangle", "A map that improves with each source", "A searchable archive, which you already had"]],
          verdict: "When unsure, write fewer pages. Merging later is cheap; untangling fragments is not." } }
    ],
    lessons: [
      { title: "One page, one idea", plain: "A page holds one idea, explained well enough that someone who has never seen the source understands it. Atomic does not mean short: it means you can title it accurately without using “and”.",
        like: "One index card per idea, not one per book.",
        points: ["Test for whether an idea deserves its own page: can it be explained without referring back to this one source? If yes, it will recur, and other sources will attach to it.",
          "A concept page under about 80 words is usually a stub that failed. Over about 1,000 words it is usually two ideas that grew together: look for the seam."] },
      { title: "The four page types", plain: "Source, entity, concept, synthesis. Each has one job; the first figure above walks through them.",
        points: ["Some things are legitimately two types (a method named after its author). Pick one, usually the concept, and give the other an alias pointing at it.",
          "Concept pages are where the agent should combine sources. Everywhere else it records."] },
      { title: "Linking rules", plain: "Link the first mention of any concept or entity, on every page. Applied consistently, that produces the graph on its own, with no separate linking chore.",
        points: ["<b>Link, do not restate.</b> If an explanation exists on another page, link it. Knowledge lives in one place and improves once.",
          "<b>Both directions.</b> A new page links out; what it references links back. One-way links make pages the vault never reaches.",
          "<b>Gaps are useful.</b> Write a link to a page that does not exist yet, then create it in the same run or list it under Gaps in the index. A page three sources link to is exactly what to write or read next.",
          "<b>Shape over count.</b> A page with no outbound links is a dead end; one with forty is a list pretending to be a page. Below about two links per page across the vault, the graph cannot answer anything the pages could not alone.",
          "<b>Split hubs.</b> If forty pages link to one broad concept, they are linking to four different aspects of it.",
          "<b>No decorative links.</b> Test: would you follow this link while researching the topic? If not, delete it."] },
      { title: "Frontmatter", plain: "A small block of facts at the top of every page. It costs nothing to write and makes the vault searchable by shape, not just by words.",
        code: { title: "The schema", lang: "YAML", lines: [
          ["title: Canonical name", "The name you would use with someone in the field."],
          ["type: source | entity | concept | synthesis", "Drives every structural question and every lint check."],
          ["created: YYYY-MM-DD", ""],
          ["updated: YYYY-MM-DD", "What makes review possible: stale concept pages are how a vault rots."],
          ["aliases: [other names this is known by]", "Makes links resolve when one thing has three names."],
          ["tags: [two or three]", "From a small list you actually maintain."],
          ["url: https://…   (source pages)", "Separates a citation from a claim."],
          ["kind: person | org | product | tool   (entity pages)", ""]
        ] },
        points: ["Keep tags to a small controlled list in CLAUDE.md; fifty tags used once each are worse than none. Tags are for cross-cutting qualities like <code>unverified</code> or <code>disputed</code>.",
          "Leave a field out rather than guessing. A guessed date becomes a “fact” three weeks later.",
          "Decide the schema early, keep it small, and when you change it, update every page in one pass."] },
      { title: "Names and aliases", plain: "Links find pages by name, so the name is the key the whole graph is built on.",
        points: ["Singular, not plural (“Vector database”). Spell out acronyms in the title and put the acronym in aliases. No dates or versions in titles unless the thing really is a version.",
          "Add [[alias|aliases]] when the page is created. Without them, a source that says “RAG” creates one page and a source that spells it out creates a second.",
          "Two things with the same name: disambiguate in the title, such as “Mercury (planet)” and “Mercury (element)”.",
          "Renaming is the top cause of broken links when an agent renames files directly. Procedure: rename, update every inbound link, add the old name as an alias, and log it."] },
      { title: "Duplicates and merging", plain: "Duplicates are inevitable. The aim is to catch them before both copies collect links. The agent proposes merges; you decide, because merging is effectively irreversible.",
        points: ["Signals, most reliable first: similar titles, overlapping aliases, the same pages linking to both, similar content.",
          "Two pages that look identical in summary are often a general case and a specific one. Merging loses that distinction for good.",
          "Procedure: pick the survivor by its proper name; keep every distinct claim with its source; merge aliases; redirect links; log both names.",
          "Do not merge during an ingest. Run deduplication as its own pass, weekly or after a big import, on a clean git state."] },
      { title: "Contradictions and supersession", plain: "This rule separates a second brain from a search engine. When a new source disagrees with a page, the page records both positions, attributed and dated. It does not overwrite.",
        like: "Meeting minutes that record that the team changed its mind, and why, rather than rewriting last month's minutes.",
        code: { title: "A contested claim on a page", lang: "markdown", lines: [
          ["## Current position", ""],
          ["Retrieval quality degrades past roughly 50k tokens of context ([[Lost in the Middle]], 2023).", "The claim, its source, and its date."],
          ["## Contested", ""],
          ["[[Some 2026 benchmark]] reports no degradation up to 200k on the same task family.", "The other view, also attributed."],
          ["The two use different evaluation setups… Unresolved.", "Why they differ, and what would settle it."],
          ["~~Requires Node 18 or later~~ superseded 2026-05: the installer no longer requires Node.", "Old information is struck through and dated, not deleted."]
        ] },
        points: ["Overwriting is the worst failure because it is invisible: the page just says something different, with the same confidence, ranked by recency rather than evidence.",
          "Label confidence: <b>stated</b> by a trusted primary source, <b>reported</b> by secondary coverage, <b>self-reported</b> by the party it benefits, or <b>unverified</b>. A company's own claim must never lose its label.",
          "The CLAUDE.md rule: “Never resolve a contradiction by picking the more recent source.”"] },
      { title: "The catalog and the logbook", plain: "<code>index.md</code> lists every page with a one-line description, grouped by type and theme, with Gaps at the bottom. <code>log.md</code> records one line per agent operation.",
        code: { title: "Three log lines", lang: "text", lines: [
          ["2026-09-07 ingest raw/karpathy-gist.md -> 1 source, 2 concepts, 1 entity, 9 links", "What came in, and what it produced."],
          ["2026-09-07 merge [[RAG]] <- [[Retrieval-augmented generation]]", "A merge, traceable later."],
          ["2026-09-08 lint -> 3 broken links fixed, 2 orphans flagged", "A health check."]
        ] },
        points: ["The index saves the agent reading everything: it reads the catalog first and opens only the pages worth opening.",
          "The log makes the vault auditable: when a page says something you do not recognise, the log tells you which run wrote it.",
          "Past about 200 entries, group the index by theme and give big themes their own index pages. Compress old log entries monthly.",
          "Both update in the same run as the work. An index that lags is worse than none, because the agent trusts it."] }
    ],
    practice: {
      title: "Write the page rules and fix your first batch", min: 45,
      intro: "You add the structuring rules to your course vault's CLAUDE.md, have the agent re-check the pages from Unit 3.03 against them, and write one concept page entirely by hand, in your own words.",
      steps: ["Paste the prompt and approve the plan.", "Review the proposed fixes before saying yes; approve merges one by one.", "Write the concept page “Agent loop” yourself (150 to 400 words), then ask the agent only to add links and frontmatter.", "Commit."],
      prompt: "Add a \"Page rules\" section to CLAUDE.md in this vault with: one idea per page (title without \"and\"); the four page types and what each records; the frontmatter schema (title, type, created, updated, aliases, tags; url/author/published for sources; kind for entities; leave unknown fields empty); a controlled tag list of at most 8 tags (propose one); linking rules (link the first mention of every concept and entity, link both ways, no decorative links, record missing pages under Gaps in index.md); naming rules (singular, acronyms as aliases, renames update links and add the old name as an alias and a log line); contradictions (record both positions with source and date, mark superseded claims with strikethrough and a date, never resolve by recency; confidence labels stated/reported/self-reported/unverified).\nThen check every existing wiki page against these rules and give me a table: page, problem, proposed fix. Propose (do not perform) any merges. After I approve, apply the fixes, update index.md, and add a log line.",
      observe: ["Which rule did most pages break? That is the rule your first ingest prompt lacked.", "How did writing the “Agent loop” page yourself feel compared with reading the agent's pages? That is Matuschak's point."],
      done: "CLAUDE.md has the page rules, every existing page passes them, and one concept page is in your own words."
    },
    quiz: [
      { q: "A page is titled “Prompt caching and tool search”. What is wrong?", options: ["Nothing", "It holds two ideas and should be two pages", "It is too short", "Titles must be one word"], answer: 1, why: "If the title needs “and”, it is two pages. Each will be linked and found more precisely on its own." },
      { q: "A new source says the opposite of an existing concept page. What should the agent do?", options: ["Overwrite with the newer claim", "Ignore the new source", "Record both positions with sources and dates", "Delete the page"], answer: 2, why: "Recording both keeps the history and makes the disagreement visible. Overwriting silently ranks by recency, not evidence." },
      { q: "Why add aliases when a page is created?", options: ["For search engines", "So links using another name still find the same page, preventing duplicates", "To make titles shorter", "Obsidian requires them"], answer: 1, why: "Without an alias, “RAG” and “Retrieval augmented generation” become two pages that never know about each other." },
      { q: "Who should decide whether two pages are merged?", options: ["The agent, automatically", "You, after the agent proposes it", "Nobody: never merge", "The newest page"], answer: 1, why: "Merges are effectively irreversible, and “these are the same” is exactly the judgement that goes wrong. Reviewing takes seconds." }
    ],
    sources: [
      { t: "Second Brain OS vault template: CLAUDE.md", url: "https://github.com/undefined-ui/second-brain-os/blob/main/vault-template/CLAUDE.md", note: "a full page contract to copy" }
    ],
    next: "Unit 3.05 looks at the links themselves as a map: the shapes that go wrong, the numbers worth tracking, and when graph tools help."
  });

  /* ================= Unit 3.05 · Graphs ================= */
  P.addUnit({
    id: "brain-graphs", track: "brain", num: 5, short: "The graph", kicker: "Connect",
    plainTitle: "Your notes as a map: graphs",
    hook: "Your vault is a graph whether you plan it or not: pages are dots, links are lines. When you ask a question, the agent starts at matching pages and walks outward along the links, so the shape of that map decides whether answers are complete.",
    source: "05 · Graphs", sourceUrl: SRC + "05-graphs",
    bridge: "Unit 3.04 set the linking rules. This unit shows what those rules build: a [[knowledge-graph]]. You will learn four words to describe it, three shapes that go wrong, four numbers to track monthly, and when graph tools (like GraphRAG) are worth it.",
    explain: [
      "Think of each page as a town and each link as a road. To answer “what connects X and Y?”, the agent drives from X along the roads. If Y is eight towns away, or on an island with no bridge, the answer will never include it, and nothing will look wrong.",
      "So the shape matters more than the size. A healthy vault is dense within topics, sparsely but definitely connected between them, with a few bridge pages joining clusters. Those bridges are usually your most valuable pages.",
      "Plain links say two pages are related, not how. [[typed-link|Typed links]] add the how (supports, contradicts, extends, part of, applies), so you can ask questions like “what in my vault argues against this?”."
    ],
    everyday: { title: "A road map", text: "A town with no roads (an orphan page) cannot be visited. A country where every road goes through the capital (a star) tells you nothing about how towns relate. A string of towns along one road (a chain) means long trips. Separate islands with no ferries mean whole regions never meet." },
    example: { title: "Two islands in your vault", text: "Your notes on Route 1 (models) and Route 2 (agents) never link to each other, because one says “context window” and the other says “context length”. A missing alias split the vault into two islands, so “how does the context window affect agent cost?” gets half an answer." },
    words: [["knowledge-graph", "pages as dots and links as lines: a map of what you know"], ["orphan", "a page nothing links to"], ["hub", "a page so many others link to that it stops being informative"], ["typed-link", "a link that says how two pages relate"]],
    remember: [
      "Shape matters: dense within topics, a few bridges between them.",
      "Track four numbers monthly: orphans, links per page, the main connected part, stale pages.",
      "Type the links where the relationship is the point, about one in five."
    ],
    figures: [
      { w: "kgraph", opts: { mode: "shapes" }, title: "Graph shapes and the numbers that reveal them", plain: "The same twelve pages, linked four different ways. Pick a shape and read the health numbers. Click any page to see its links.",
        takeaway: "Only the well-linked shape hits all three targets. The star and chain look tidy but fail; the islands look fine page by page and fail as a whole." },
      { w: "kgraph", opts: { mode: "path", from: 7, to: 0 }, title: "What connects X and Y? Walk the typed links", plain: "A small vault where every link has a type. Pick any two pages: the path is computed by walking links, not guessed.",
        takeaway: "Similarity search finds passages that sound like your question. A graph walk finds how two ideas actually connect, even when they share no words." }
    ],
    lessons: [
      { title: "Four words to describe a graph", plain: "Pages are nodes and links are edges. Four terms are enough to reason about your vault.",
        points: ["<b>Degree:</b> how many links a page has. In-degree counts links pointing at it; a page with zero in-degree cannot be reached by following links, which is why [[orphan|orphans]] matter.",
          "<b>Path length:</b> how many hops separate two pages. An agent can only follow a few hops before its context budget runs out; two related ideas eight hops apart will never meet in an answer.",
          "<b>Clustering:</b> how much a page's neighbours link to each other. High means a real topic area. Low clustering with high degree usually means a page collecting unrelated things.",
          "<b>Components:</b> disconnected islands. A vault in five components is five vaults."] },
      { title: "Shapes that go wrong, and the healthy one", plain: "The first figure above shows all four shapes with their numbers.",
        points: ["<b>Star:</b> everything links to two or three broad hubs and nothing else. Caused by linking to broad concepts instead of specific ones.",
          "<b>Chain:</b> each source links to the concept it introduced and nothing links sideways. Common after a bulk import that never checked existing pages.",
          "<b>Islands:</b> clusters with no bridges. Sometimes legitimate (cooking and databases); often caused by different words for the same thing and missing aliases.",
          "<b>Healthy:</b> dense within topics, sparse but present between them, most pages within three or four hops of most others. Hubs exist but do not dominate. A few bridge pages connect clusters, and they are usually your most valuable pages."] },
      { title: "Why the shape decides your answers", plain: "When you ask the vault something, the agent starts at the pages that match and walks outward. The graph is the search space.",
        like: "A detective following leads: if two leads are never connected in the case file, nobody will connect them in the interview room either.",
        points: ["A well-shaped graph reaches the relevant material in a few hops; a badly shaped one reaches nothing, or everything.", "That is why the linking rules are not tidiness: they decide whether retrieval works."] },
      { title: "Reading Obsidian's graph view", plain: "The global graph is the screenshot everyone posts and the least useful view. At two hundred pages it is a hairball. The local graph, one page at depth two, does the real work.",
        points: ["<b>Local graph check:</b> one hop away should be obviously related; anything surprising is a decorative link or a connection worth reading. What is missing at two hops shows where the page is under-connected. Five seconds per page you write.",
          "<b>Filters for the global view:</b> hide source pages to see the concept graph; color page types differently; turn orphans on deliberately and fix them; lower link force to see bridges.",
          "<b>What to look for:</b> dots at the edge connected to one thing (failed ingests); one giant node (a hub to split); two clusters joined by one page (valuable and fragile); a cluster you do not recognise (often the most interesting thing on screen).",
          "The view shows that pages connect, never why. That is the case for typed links."] },
      { title: "Typed links", plain: "A plain link says two pages are related, not how. Five types are enough, and few enough to apply consistently.",
        table: [["Type", "Meaning"], ["supports", "This page is evidence for that one"], ["contradicts", "This page argues against it"], ["extends", "Builds on it, adds to it"], ["part-of", "A component of a larger thing"], ["applies", "A use of a method in practice"]],
        points: ["Write them inline next to the link (Dataview can query that) or in frontmatter for page-level relationships.",
          "Now you can ask: “everything in my vault that argues against this page”, which a plain graph cannot answer at all.",
          "<b>Do not type everything.</b> Most links are plain mentions. Type the ones where the relationship is the point: about one in five.",
          "Instruct the agent to type a link only when the source itself states the relationship. An agent guessing relationships builds a graph that looks rigorous and encodes its own assumptions."] },
      { title: "Graph or embeddings?", plain: "[[embedding|Embeddings]] (Route 1) find text that means something similar to your question, even in different words. A graph finds things that are explicitly connected, with a reason if the links are typed.",
        fig: { w: "compare", title: "What each is good at", opts: { cols: [{ t: "Embeddings", s: "similarity search" }, { t: "Graph", s: "following links" }],
          rows: [["Strength", "Recall: finds similar text in any wording, needs no structure", "Multi-hop questions, and saying why two things relate"],
            ["Weakness", "The answer often does not resemble the question; twenty half-answers crowd out one full answer", "Cannot reach a page nobody linked; cannot find what you half-remember but cannot name"],
            ["Best question", "“Something about pricing, maybe a podcast?”", "“What connects X and Y?” “What argues against Z?”"]],
          verdict: "A personal vault leans graph: it is small, already split into meaningful pages, and its questions are about relationships. Plain text search (ripgrep) covers the half-remembered case instantly at this size." } },
        points: ["When you outgrow it: use search or embeddings to find entry points, then the graph to expand from them. Unit 3.07 covers the threshold."] },
      { title: "GraphRAG, and whether you need it", plain: "[[graphrag|GraphRAG]] (Microsoft Research, 2024) builds a graph from a document collection, finds clusters, summarizes each cluster, and answers from those summaries. It targets questions about the whole collection, like “what are the main themes?”, which similarity search answers worst.",
        points: ["Your vault already has most of it: entity pages are the extracted entities, links are the relationships, and synthesis pages are community summaries written by a model that read the sources.",
          "At personal scale, probably do not run it. It earns its cost on collections too large to curate by hand.",
          "It is useful as a quarterly audit: run cluster detection on your exported graph and compare with your synthesis pages to find themes you have not noticed.",
          "HippoRAG applies personalized PageRank over a knowledge graph for multi-hop questions: the closest research analogue to an agent walking links outward from a page. Deep dive 1 goes further."] },
      { title: "Exporting and analyzing the graph", plain: "Obsidian's graph is a viewer. To compute anything, export the links as a list and analyze it with free tools.",
        points: ["A short script turns every link into a row in a CSV file (or GraphML for the free Gephi viewer). The markdown stays the source of truth; the export is rebuilt, never edited.",
          "<b>PageRank</b> once: the top pages are what your vault is actually about, reliably different from what you would say.",
          "<b>Betweenness</b> finds bridge pages that sit on the shortest paths between clusters. They hold connections no single source contained, and if one is wrong or deleted, two areas silently stop informing each other.",
          "Graph databases: Ladybug (embedded, reads CSV, the maintained continuation of Kuzu, which was archived in October 2025) is fun for an evening; Neo4j is overkill unless you build on top."] },
      { title: "Four numbers to track monthly", plain: "Their direction over time tells you whether the system is working, which is not obvious from daily use.",
        fig: { w: "bars", title: "The targets", plain: "From Second Brain OS's metrics guide.", opts: { sets: [
          { name: "Orphan rate", max: 20, caption: "Pages with no inbound links. The single most diagnostic number: rising means ingestion stopped linking.", items: [{ label: "Healthy", value: 5, display: "under 5%", c: 3 }, { label: "Something is broken in the ingest instructions", value: 15, display: "over 15%", c: 8 }] },
          { name: "Links per page", max: 12, caption: "Below 2, retrieval cannot beat search. Well above 10, check for decorative links. Watch it alongside page count: falling means new pages attach less than old ones did.", items: [{ label: "Barely connected", value: 2, display: "below 2", c: 8 }, { label: "Working range", value: 8, display: "3 to 8", c: 3 }, { label: "Check for decorative links", value: 10, display: "above 10", c: 4 }] },
          { name: "Main connected part", max: 100, caption: "Ideally one large component plus a few genuinely separate topics. Below about 80%, answers will be incomplete without anything looking wrong.", items: [{ label: "Target", value: 80, display: "at least 80%", c: 3 }] },
          { name: "Stale concept pages", max: 100, caption: "Concept pages not updated in 90 days. Some staleness is fine; most pages stale while sources keep arriving means new material lands in new pages, and you get four pages about one thing.", items: [{ label: "Threshold for stale", value: 90, display: "90 days", c: 4 }] }
        ] } },
        points: ["Do not track page count or word count: both rise whether or not the vault improves.", "Append the four numbers to a note monthly. The trend is the information."] }
    ],
    practice: {
      title: "Measure your vault's graph", min: 45,
      intro: "Claude Code writes a small export-and-metrics script (Python with the free NetworkX library) for your course vault, you record the first monthly numbers, check three pages' local graphs, and add typed links where a source states the relationship.",
      steps: ["Paste the prompt and approve the plan.", "Run the metrics and paste them into the metrics note.", "In Obsidian, open the local graph (depth 2) of your three newest pages and fix anything surprising.", "Commit."],
      prompt: "In this vault, create scripts/graph_metrics.py (Python, NetworkX, free) and wiki/metrics.md:\n1. Parse every [[wikilink]] in wiki/ into an edge list (resolve aliases from frontmatter; drop links to pages that do not exist and list them as gaps). Save graph/edges.csv.\n2. Print the four monthly numbers with targets: orphan rate (no inbound links; target under 5%), average links per page (target 3 to 8), share of pages in the largest connected part (target at least 80%), and stale concept pages (updated more than 90 days ago).\n3. Print the top 5 pages by PageRank and the top 5 by betweenness, and explain in one plain sentence each what they mean for this vault.\n4. List orphans and the largest islands, and propose (do not make) links that a source page actually supports.\n5. Append today's four numbers as a row to wiki/metrics.md.\nThen add typed links (supports, contradicts, extends, part-of, applies) to at most five places where a source explicitly states the relationship, using the inline format key:: [[Page]], and show me each one before writing.",
      observe: ["Which page has the highest PageRank? Is it what you thought the vault was about?", "Is there a bridge page between your Route 1 and Route 2 notes? If not, a missing alias may be splitting them.", "How many orphans did the first ingest leave?"],
      done: "wiki/metrics.md has its first row, orphans are fixed or listed, and you have added up to five typed links."
    },
    quiz: [
      { q: "Every page links only to one broad page called “AI”. What shape is this, and what is wrong?", options: ["Healthy: very connected", "A star: paths always go through the hub, so the graph says nothing about how pages relate", "A chain: too long", "Islands: disconnected"], answer: 1, why: "A star has short paths, but only through the hub. Link to specific concepts instead of broad ones." },
      { q: "Your orphan rate rose from 3% to 18% over two months. What is the likely cause?", options: ["You read more", "The ingest instructions stopped linking new pages", "Obsidian has a bug", "That is normal growth"], answer: 1, why: "Over 15% means something is broken in the ingest instructions, not in your habits." },
      { q: "When should a link be typed?", options: ["Always", "Never", "When the relationship is the point and the source states it, about one link in five", "Only for people"], answer: 2, why: "Typing everything makes the vocabulary meaningless; an agent guessing types encodes its own assumptions." },
      { q: "Why is a bridge page between two clusters both valuable and fragile?", options: ["It is long", "It holds connections no single source had; if it is wrong or deleted, both clusters silently stop informing each other", "It has many tags", "It is new"], answer: 1, why: "High-betweenness pages carry the cross-topic connections. Protect them during merges." }
    ],
    sources: [
      { t: "From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft Research, 2024)", url: "https://arxiv.org/abs/2404.16130", note: "GraphRAG" },
      { t: "HippoRAG: Neurobiologically Inspired Long-Term Memory for LLMs (2024)", url: "https://arxiv.org/abs/2405.14831", note: "personalized PageRank for multi-hop questions" },
      { t: "NetworkX", url: "https://networkx.org", note: "free graph analysis in Python" },
      { t: "Gephi", url: "https://gephi.org", note: "free graph viewer" }
    ],
    next: "Unit 3.06 hands the upkeep to agents: six roles, a schedule, hooks, skills, and the guardrails that make unattended runs safe."
  });

  /* ================= Unit 3.06 · Agents ================= */
  P.addUnit({
    id: "brain-agents", track: "brain", num: 6, short: "Agents at work", kicker: "Connect",
    plainTitle: "Let agents keep it tidy: roles, schedules, and guardrails",
    hook: "Everything so far you could do by hand, slowly. This unit is where the vault stops depending on your discipline, which is the only reason it will still be alive in six months. It is also where the risk lives: an agent writing to your notes while you sleep.",
    source: "06 · Agents", sourceUrl: SRC + "06-agents",
    bridge: "Route 2 explained agents in general: loops, harnesses, hooks, and evals. Here you apply them to your vault. If you skipped Route 2, Unit 2.04 (the harness) is worth reading first; this unit is its personal-scale version.",
    explain: [
      "One agent doing everything does every job badly: the instructions that make a good filer are not the ones that make a good reviewer. So the work is split into six roles, four of which are read-only. They pass work to each other through files, not conversations, so every run can be inspected afterwards.",
      "A schedule makes the vault feel alive: you wake up and it has filed what you clipped, noticed a contradiction, and left you three lines about what changed. Every run must leave a log line, a git commit, and a short report.",
      "The guardrails come first. “Keys, not prompts”: limit what the agent can technically do, keep git as the safety net, never delete without a record, and try big changes as a dry run first."
    ],
    everyday: { title: "A small office team", text: "A clerk files incoming mail; a cross-referencer adds notes between related files; an auditor reads everything and writes a weekly memo but cannot change files; a researcher answers questions; an analyst counts things monthly; and an archivist proposes what to throw out, while only you decide." },
    example: { title: "Your Monday morning", text: "Overnight, the ingestor filed the six articles you clipped last week. On Sunday the linker added eight links and the lint pass fixed two broken ones. The reviewer's note on Monday says: two new sources contradict your page on agent costs, and three linked pages are still missing. You read it in two minutes with coffee." },
    words: [["skill", "a reusable instruction file that teaches the agent how to do a job"], ["slash-command", "a shortcut like /ingest that runs a skill"], ["scheduled-task", "an agent run that starts on its own at a set time"], ["dry-run", "a practice run that reports what it would change without changing anything"]],
    remember: [
      "Six narrow roles, four of them read-only. Deleting is your decision, never a role.",
      "Every scheduled run leaves a log line, a commit, and a report with counts.",
      "Run each job by hand for a week before scheduling it; schedule the ingest last."
    ],
    figures: [
      { w: "layers", title: "Six roles, four of them read-only", plain: "Narrow instructions per role beat one agent doing everything. Click each role.",
        opts: { items: [
          { t: "Ingestor", s: "reads raw/, writes wiki pages", tag: "writes", c: 2, d: "Writes more than any role, so its quality decides everything downstream. It does not answer questions, restructure existing pages, or delete. Reorganizing while ingesting mixes content and structure changes in one diff nobody can review." },
          { t: "Linker", s: "adds missing links", tag: "writes links only", c: 2, d: "Finds connections the ingestor missed, after imports and weekly. Adds links, creates and rewrites nothing. Its rule: a link it adds must be one you would agree with reading both pages side by side." },
          { t: "Reviewer", s: "the weekly memo", tag: "read-only", c: 3, d: "What changed, where attention went, what contradicts what, what to read next. Read-only is what makes the report trustworthy: an editing reviewer fixes things as it goes and then describes a vault that no longer exists." },
          { t: "Researcher", s: "answers your questions", tag: "read-only", c: 3, d: "Answers from the vault, cites pages, names what is missing. The role you talk to most, and the one that most needs the rule against falling back on general knowledge." },
          { t: "Graph analyst", s: "monthly numbers", tag: "read-only", c: 3, d: "Runs the metrics, finds hubs, bridges, and clusters, and says what the numbers mean. Analysis should notice everything; repair should touch as little as possible, so they are separate." },
          { t: "Curator", s: "proposes what to prune", tag: "read-only", c: 3, d: "Quarterly proposals to archive, prune, or merge. Never actions: deletion is the one thing a diff cannot recover, so it stays your decision." }
        ] },
        takeaway: "Roles not worth creating: a deleter (deleting is your decision), a summarizer (summaries of summaries get read instead of the truth underneath), and a tagger (tags are best chosen during ingest, with full context)." },
      { w: "compare", title: "The maintenance calendar", plain: "Each job has a natural rhythm.",
        opts: { cols: [{ t: "Daily", c: 2 }, { t: "Weekly", c: 1 }, { t: "Monthly", c: 3 }, { t: "Quarterly", c: 7 }],
          rows: [["Job", "Ingest what you clipped", "Link, then lint, then review", "Metrics", "Curate; review every rule and skill"],
            ["Why this rhythm", "A batch lets the agent see related saves; hourly does not", "Links need a week of material; lint catches what linking broke; the review is the one output you read", "Trends need time to show", "Bets about what the model can do expire"],
            ["What you do", "Nothing; skim the one-line report", "Read the review on the morning you plan", "Glance at the four numbers", "Decide on proposed merges and deletions"]] } }
    ],
    lessons: [
      { title: "Six roles", plain: "Ingestor, linker, reviewer, researcher, graph analyst, curator. The first figure above describes each. Only the first two write.",
        points: ["Narrow instructions per role: the ingestor reads one source closely; the linker reads broadly across the vault. Different jobs.", "A linker optimizing for link count degrades the graph while looking productive."] },
      { title: "Handoffs through files", plain: "Roles never talk to each other directly. The ingestor writes gaps into <code>index.md</code>, and the linker reads them. The ingestor logs its run, and the reviewer reads the log.",
        like: "Shift workers handing over through a logbook, not by phone. Anyone can read what happened, and anyone can be replaced.",
        points: ["Files as the interface means any run can be inspected afterwards.", "A role can be rewritten or replaced without touching the others."] },
      { title: "Scheduling", plain: "Ingest daily, overnight. Link, lint, and review weekly, in that order. Metrics monthly. Curate quarterly.",
        points: ["Set one up in the Claude desktop app's Schedule tab, or just ask: “set up a daily task at 7am that ingests raw/ and summarizes what changed”.",
          "From a terminal, cron (Mac, Linux) or Task Scheduler (Windows) calling Claude Code in headless mode works the same way, and makes it easy to wrap each run in a git commit.",
          "<b>Start manual.</b> Run each job by hand for a week. You are checking that the output is good enough to accept without reading closely, because that is what scheduling means. Schedule the ingest last: it writes the most."] },
      { title: "What every run must produce", plain: "Three things, every time: a log entry (to audit what happened while you slept), a commit (so a bad run is one command to undo), and a report to you, even one line.",
        like: "A night shift that leaves a note, signs the logbook, and locks the door.",
        points: ["The real failure is not a crash. It is a run that completes and does nothing useful: an empty source, an API error halfway, instructions that matched no files.",
          "Make runs report counts (“ingested 0 sources” is visible) and check commit frequency monthly: a week with no commits from the daily task means it has been failing quietly."] },
      { title: "Subagents and parallel work", plain: "A [[subagent]] (Unit 2.01) has its own context, so reading thirty pages to answer a question fills its window, not yours. Useful for research across many pages, ingesting unrelated sources, and checking one agent's pages with another.",
        points: ["<b>Do not parallelize related sources:</b> three articles on one topic each create their own version of the concept page.",
          "<b>Never let parallel runs write <code>index.md</code> or <code>log.md</code>:</b> they conflict or silently lose entries. Subagents write to separate paths and report back; the parent updates shared files once.",
          "Parallel work saves waiting time, not tokens: four subagents cost about four times one. Worth it for a big backfill, pointless for a daily ingest of five articles.",
          "Commit before any parallel run."] },
      { title: "Hooks", plain: "[[hook|Hooks]] fire on events rather than on a schedule: the right tool for things that must happen every time, which is exactly what a prompt instruction eventually misses.",
        points: ["<b>Worth hooking:</b> validate frontmatter before a write; lint after a run; commit after a scheduled run; notify on any deletion.",
          "<b>Not worth hooking:</b> anything slow (a two-second hook turns a forty-page ingest into a long pause, and you will disable it) or anything needing judgement.",
          "Keep hooks fast (well under a second) and silent when they pass; noisy hooks train you to ignore hook output.",
          "Decide whether a failing hook blocks: validation should block; notifications should not. A blocking hook must be simple enough to fail only for the reason it exists."] },
      { title: "Skills and slash commands", plain: "A [[skill]] teaches repeatable behaviour and loads when relevant. A [[slash-command]] is a shortcut that points at a skill. Behaviour belongs in the skill, so ingesting works the same whether triggered by <code>/ingest</code>, a schedule, or you saying “add this”.",
        points: ["Second Brain OS ships 18 skills and 72 commands; install them in the vault's <code>.claude/skills/</code> and <code>.claude/commands/</code> so they are versioned with your notes.",
          "Write your own skill when you do something repeatedly, have opinions about how, and the opinions are not obvious.",
          "Explain the why. “Never overwrite a contradiction” is applied too literally; adding “because the history of what you believed is what this vault has that a search engine does not” generalizes to cases you never described. An all-caps NEVER with no reason is usually a missing explanation.",
          "Test a skill on three or four real cases before a scheduled task uses it."] },
      { title: "Guardrails", plain: "<b>Keys, not prompts.</b> An instruction is a preference, not a boundary. If the agent technically can delete or send, one day it will.",
        points: ["<b>Scope write access</b> to the vault only, not your home folder. Connectors read-only wherever possible.",
          "<b>Never delete without a record:</b> every deleted or merged page gets a log line naming it and why.",
          "<b>Git is the real safety net:</b> commit before any large run; scheduled runs commit their own work; read their diffs in the first weeks to learn what the agent actually does at 7 a.m.",
          "<b>Dry runs:</b> for anything touching many files, run it once in report-only mode first.",
          "<b>Scope creep:</b> asked to ingest, agents also tidy, reformat, and rename. Instruct: do the job asked, list anything else you noticed, change nothing else.",
          "<b>Keep out of the vault:</b> credentials, confidential material, other people's private information. Every sync, commit, and backup is another copy."] }
    ],
    practice: {
      title: "Hire two agents for your course vault", min: 45,
      intro: "You create an ingestor skill and a read-only reviewer skill with slash commands, add a fast frontmatter-validation hook, do a dry run, and run the weekly review by hand. You schedule nothing until you have run it manually for a week.",
      steps: ["Paste the prompt and approve the plan.", "Run /ingest --dry-run on two new clipped sources and read the report.", "Run /ingest for real, then /review.", "Put a weekly calendar slot to run /review by hand; after a week of good results, schedule it."],
      prompt: "In this vault, create agent roles as Claude Code skills and commands, versioned in the vault:\n1. .claude/skills/ingest/SKILL.md: the ingestor role. Reads unprocessed files in raw/, writes and links wiki pages following the page rules in CLAUDE.md, updates index.md and log.md in the same run, never restructures existing pages beyond adding links, never deletes. Supports a dry-run mode that only reports what it would create, change, and link. Explain the reason behind every rule in one sentence.\n2. .claude/skills/review/SKILL.md: the reviewer role, strictly read-only. Produces output/review-YYYY-MM-DD.md: what changed this week (from log.md), new contradictions, missing pages from Gaps, three things worth reading next, and counts.\n3. Commands /ingest, /ingest --dry-run, and /review pointing at those skills.\n4. A PreToolUse hook in .claude/settings.json that validates frontmatter (title, type, created, updated present; type is one of source, entity, concept, synthesis) on any Write to wiki/ and blocks with exit code 2 and a clear message if invalid. It must run in well under a second and print nothing on success.\n5. In .claude/settings.json, deny Bash(rm:*) and allow writes only inside this vault.\n6. Add a \"Scheduling plan\" section to CLAUDE.md: daily ingest, weekly link/lint/review, monthly metrics, quarterly curate; each run must log, commit, and report counts. Do not schedule anything yet.",
      observe: ["Did the dry run predict exactly what the real run did?", "Did the hook block a page with a missing field? Try one deliberately.", "Is the review something you would read on a Monday morning? If not, tighten the skill."],
      done: "Both skills and commands work, the hook blocks bad frontmatter, and you have one review in output/."
    },
    quiz: [
      { q: "Why is the reviewer read-only?", options: ["To save tokens", "So its report describes the vault as it is, not a vault it quietly changed", "Reviewers cannot write", "Obsidian requires it"], answer: 1, why: "A reviewer that edits fixes things as it goes, and then its report describes a vault that no longer exists." },
      { q: "Which role should NOT exist?", options: ["Linker", "Curator", "An automatic deleter", "Researcher"], answer: 2, why: "Deletion is the one action a diff cannot recover. The curator proposes; you decide." },
      { q: "Your daily scheduled ingest has made no commits for a week. What does that suggest?", options: ["Nothing was clipped", "It has probably been failing quietly", "Git is broken", "Either; the run should report counts so you can tell"], answer: 3, why: "Silent failure is the real risk. Runs must report counts (“ingested 0 sources”) so an empty week and a broken week look different." },
      { q: "Why must parallel subagents never write index.md directly?", options: ["It is read-only", "Parallel writes to one file conflict or silently lose entries", "Subagents cannot read it", "It slows them down"], answer: 1, why: "Subagents write to separate paths and report back; the parent updates shared files once." }
    ],
    sources: [
      { t: "Second Brain OS agents, skills, and commands", url: "https://github.com/undefined-ui/second-brain-os", note: "six role definitions, 18 skills, 72 commands" }
    ],
    next: "Unit 3.07 is about getting answers out: how to ask, how the agent should search, and when to add RAG on top."
  });

  /* ================= Unit 3.07 · Retrieval ================= */
  P.addUnit({
    id: "brain-retrieval", track: "brain", num: 7, short: "Asking it", kicker: "Answer",
    plainTitle: "Get answers out: asking, searching, and reading economically",
    hook: "You built the vault so answers come from what you actually read. An agent that quietly falls back on its own general knowledge destroys that, invisibly: the answer is fluent, plausible, and impossible to check. One rule fixes it: every claim names the page it came from.",
    source: "07 · Retrieval", sourceUrl: SRC + "07-retrieval",
    bridge: "Units 3.02 to 3.06 built and maintained the vault. Now you use it. You will recognise two ideas from Route 2: the context budget (Unit 2.01) and subagents for wide reading. Here they decide how the agent reads your notes.",
    explain: [
      "When you ask the vault a question, a good agent reads the catalog (<code>index.md</code>) first, opens the few pages that look relevant, and follows links outward one hop at a time, stopping when new pages stop adding anything. This step-by-step approach is called [[progressive-disclosure]].",
      "Every claim in the answer names its page. Anything the model knows that your vault does not is put under a separate heading, labelled as outside the vault. And if the vault has nothing on the topic, the honest answer is one sentence saying so.",
      "Some questions a vault answers far better than a search engine: what connects X and Y, what have I changed my mind about, what argues against this. Those are the habits worth building."
    ],
    everyday: { title: "Asking a well-organized colleague", text: "A good colleague checks the shared drive's index, opens the three relevant documents, follows a reference or two, and answers with “according to the March steering-committee deck…”. When they do not know, they say so, rather than improvising something that sounds right." },
    example: { title: "Before a vendor meeting", text: "“I am about to argue that we should build our own agent harness. What in my vault argues against it?” The vault returns your notes from Unit 2.04 on harness costs, a source showing a tenth-of-the-cost result for a tuned open model, and a contradiction you recorded, each with a page link, plus “Not covered: maintenance staffing costs”." },
    words: [["progressive-disclosure", "reading the index, then a few pages, then following links, only as needed"], ["ripgrep", "a very fast free tool for finding exact words across files"], ["dataview", "an Obsidian plugin that queries the facts at the top of pages"]],
    remember: [
      "Every claim names a page; outside knowledge goes under its own heading.",
      "Index first, then a few pages, then links one hop at a time.",
      "Before adding RAG, check aliases, the index, and orphans."
    ],
    figures: [
      { w: "flow", title: "How a good answer is assembled", plain: "Each step is cheap and informs the next. Click each.",
        opts: { steps: [
          { t: "Index", s: "what exists", d: "Read index.md: every page with a one-line description. Cheap, and it finds pages whose wording differs from your question." },
          { t: "Open 3 to 8 pages", s: "the ones that matter", d: "Open only the pages that look relevant. Loading everything plausibly related wastes the budget and pushes the useful pages into the weakly read middle." },
          { t: "Follow links", s: "one hop at a time", d: "Expand outward through links, stopping when new pages stop adding anything." },
          { t: "Answer", s: "every claim cited", d: "Each claim names its page. Model knowledge your vault lacks goes under a separate “outside the vault” heading." },
          { t: "Read / Not covered", s: "two closing lines", d: "End with the pages read and what the vault did not cover. The gap line is often the more useful half: a precise statement of what to read next." }
        ] },
        takeaway: "An answer citing five pages you can open beats a fluent answer built from four hundred you cannot." },
      { w: "layers", title: "Six questions a vault answers better than a search engine", plain: "Click each to see the prompt.",
        opts: { items: [
          { t: "What do I know about X?", s: "the basic one", d: "“What do I know about agent harnesses? Read the concept pages and the sources behind them. Say where my sources disagree.” The second sentence is what beats reading one page yourself." },
          { t: "What connects X and Y?", s: "impossible for a search index", d: "“What connects retrieval quality and context length in my vault? Show the path through pages, not just the endpoints.” The intermediate pages are the reasoning, and they are checkable." },
          { t: "What have I changed my mind about?", s: "quarterly", d: "“Find pages where a later source superseded an earlier claim. What did I believe, what changed it, and when?” The closest thing to watching your own thinking from outside." },
          { t: "What is missing?", s: "a reading list from your gaps", d: "“Look at my concept pages on evals. What questions do they raise that no source in my vault answers?”" },
          { t: "What did I say before?", s: "great with chat exports", d: "“Have I worked on this problem before? What did I conclude, and what did I get wrong?”" },
          { t: "What contradicts this?", s: "the most valuable, least used", d: "“I am about to argue that X. What in my vault argues against it?” A vault that only confirms you is a vault built badly." }
        ] },
        takeaway: "Ask elsewhere about the present state of the world (your vault knows what sources said the day you saved them) and about general topics the model already explains well." }
    ],
    lessons: [
      { title: "The rule: every claim names a page", plain: "Put this instruction in CLAUDE.md, not in each prompt, because a rule you have to remember lapses on the day it matters.",
        code: { title: "Two answering rules for CLAUDE.md", lang: "prompt", lines: [
          ["Answer from my vault only. Cite the page for each claim.", "Grounded and checkable."],
          ["If the vault does not cover part of the question, say which part rather than filling it in.", "Gaps stated, not papered over."],
          ["Anything you know that my vault does not contain, put under a separate heading marked outside the vault.", "Useful context, clearly separated."],
          ["End with two lines — Read: [[page]], [[page]] · Not covered: …", "Shows how much the answer rests on, and what to read next."]
        ] },
        points: ["Blended outside knowledge makes the whole answer unreliable, because you no longer know which parts you can trace.", "<b>Empty is a valid answer.</b> Watch for answers with no page references at all: that is the sign of padding."] },
      { title: "Start from the index", plain: "Reading the catalog first tells the agent what exists and which pages are worth opening. A full-text sweep is slower, spends context on near-misses, and misses pages worded differently from your question.",
        points: ["That is why the index must be updated in the same run as every ingest (Unit 3.04).", "Past a few hundred pages, add one level of topic indexes between the master index and the pages. Two levels is enough; three means a hierarchy nobody maintains."] },
      { title: "Six question patterns", plain: "The second figure above lists the questions a vault answers better than anything else, with prompts you can copy.",
        points: ["“What contradicts this?” is the most valuable and least used, because nobody volunteers to be contradicted.", "Run “what have I changed my mind about?” once a quarter: it usually surfaces a belief you updated without noticing."] },
      { title: "Search tools", plain: "Retrieval in a plain-text vault is mostly exact-word search, which sounds primitive and is almost always enough.",
        points: ["<b>[[ripgrep]]</b> is instant on tens of thousands of files and is what the agent uses by default. Its limit is exact wording; the index and the graph cover the rest.",
          "<b>Obsidian search</b> operators worth knowing: <code>path:</code>, <code>file:</code>, <code>tag:</code>, and <code>line:</code> (terms on the same line).",
          "<b>[[dataview|Dataview]]</b> answers “which pages have property P?”, such as concept pages tagged unverified, oldest first. Asking the agent to read every file for that is slower and less reliable.",
          "<b>Combine:</b> a query or search to get candidates, the graph to expand, the agent to read and synthesize. Mechanical filtering first, judgement second."] },
      { title: "Reading economically", plain: "Every page the agent reads costs context, and quality drops well before the window is full. Reading more is not reading better.",
        like: "Bringing three relevant folders to a meeting rather than the whole filing cabinet.",
        points: ["Why not paste the whole vault into a long-context model? Attention is uneven (Lost in the Middle, Unit 2.01), and an answer built from everything cannot be checked: you do not know which pages it used.",
          "Occasionally ask the agent to list every page it read for an answer. You will catch it reading thirty pages when six would do, or answering from three when twenty were relevant.",
          "For questions that genuinely need a lot of material, send a subagent: it reads in its own context and returns a summary."] },
      { title: "Adding RAG when you need it", plain: "This route argues against a vector database for a personal vault, up to a threshold. RAG starts to pay when three things are true together.",
        points: ["<b>1.</b> Scale past a few thousand pages, so the index plus links no longer fits the budget. <b>2.</b> You regularly ask in words your pages do not use and fail to find things you know are there. <b>3.</b> Much of the collection was never curated by a person. Most personal vaults never hit all three.",
          "If you add it, embed the wiki pages (title, aliases, and body), not raw sources: they are already meaningful units. Re-chunking them destroys structure you paid for.",
          "Keep the graph in charge: embeddings find entry points, links expand from them, the agent answers with citations.",
          "Re-embed changed pages in the same ingest run. A week-stale index produces plausible bad answers.",
          "<b>Try first:</b> missing aliases, a stale index, and a growing pile of orphans cause most “I cannot find it” problems, and no retrieval method can reach an orphan."],
        pm: "This is the same build-versus-not decision you will face at work with RAG projects: name the three conditions, and check the cheap fixes before approving new infrastructure." }
    ],
    practice: {
      title: "Ask your vault the six questions", min: 40,
      intro: "You add the answering rules to your course vault, then ask all six question patterns about what you have learned so far. The “Not covered” lines become your next reading list.",
      steps: ["Paste the prompt; it adds the rules and runs the six questions one at a time.", "For each answer, open two cited pages and check they say what the answer claims.", "Copy every “Not covered” line into output/reading-list.md.", "Commit."],
      prompt: "In this vault:\n1. Add an \"Answering rules\" section to CLAUDE.md: answer from the vault only and cite the page for each claim; say which parts are not covered instead of filling them in; put anything from outside the vault under a separate \"Outside the vault\" heading; start from index.md and open at most 8 pages, then follow links one hop at a time; end every answer with \"Read: …\" and \"Not covered: …\" lines.\n2. Then answer these six questions one at a time, waiting for me to say \"next\" between them, and for each one also list every page you opened:\n   a. What do I know about agent loops? Say where my sources disagree.\n   b. What connects context windows and agent cost in my vault? Show the path through pages.\n   c. Where did a later source supersede an earlier claim?\n   d. What questions do my concept pages on evals raise that no source answers?\n   e. Have I written about prompt caching before? What did I conclude?\n   f. I am about to argue that every AI project needs an agent. What in my vault argues against it?\n3. Collect all \"Not covered\" lines into output/reading-list.md.",
      observe: ["Did any answer have no page references? That is padding with general knowledge.", "How many pages did the agent open per question? More than eight means the index descriptions need work.", "Did the path question find a real chain of pages, or jump straight to the answer?"],
      done: "The rules are in CLAUDE.md, you have checked two citations per answer, and output/reading-list.md lists your gaps."
    },
    quiz: [
      { q: "The vault has nothing about a topic you asked. What is the best answer?", options: ["A helpful general explanation from the model", "One sentence saying the vault does not cover it", "A guess based on related pages", "An error"], answer: 1, why: "Empty is a valid answer. Padding with general knowledge feels helpful but cannot be traced." },
      { q: "Why should the agent read index.md first?", options: ["It is required by Obsidian", "It shows what exists cheaply, including pages worded differently from the question", "It is the longest file", "To update it"], answer: 1, why: "The catalog lets the agent open only what matters instead of sweeping every file." },
      { q: "You often cannot find notes you know exist. What should you check before adding RAG?", options: ["Buy a bigger model", "Missing aliases, a stale index, and orphan pages", "Delete old pages", "Nothing; add RAG"], answer: 1, why: "Those cheap fixes explain most recall problems. RAG is worth its upkeep only when scale, wording mismatch, and an uncurated collection come together." },
      { q: "Which question can a vault answer that a search engine cannot?", options: ["What is the capital of France?", "What connects two ideas across my notes, page by page?", "What is today's news?", "How do I install Python?"], answer: 1, why: "Relationships across your own notes are graph questions. Current events and general topics belong elsewhere." }
    ],
    sources: [
      { t: "ripgrep", url: "https://github.com/BurntSushi/ripgrep", note: "free, very fast text search" },
      { t: "Dataview for Obsidian", url: "https://blacksmithgu.github.io/obsidian-dataview/", note: "free plugin" }
    ],
    next: "Unit 3.08 turns answers into output: writing, research reports, publishing a public subset, and learning from your own pages."
  });

  /* ================= Unit 3.08 · Outputs ================= */
  P.addUnit({
    id: "brain-outputs", track: "brain", num: 8, short: "Outputs", kicker: "Answer",
    plainTitle: "Make things with it: writing, reports, publishing, learning",
    hook: "A knowledge base that only answers questions is a reference book you built yourself. It starts paying for the effort when articles, reports, decisions, and real understanding come out of it, and when your finished work goes back in.",
    source: "08 · Outputs", sourceUrl: SRC + "08-outputs",
    bridge: "Unit 3.07 got answers out. This unit turns answers into work products, including the public write-ups for your Paper Trail portfolio, and uses the vault to check what you have actually learned rather than merely saved.",
    explain: [
      "Writing from the vault means the research is already done, cited, and connected. Ask the agent to outline from your concept pages, not from a blank prompt: you get an argument grounded in what you read, with the disagreements marked, and the disagreements are where you have something new to say.",
      "Let the agent assemble structure and evidence; write the sentences yourself. Then feed the finished piece back in as a source, so six months later the vault knows what you argued.",
      "Publishing is opt-in, page by page. And the vault can test you: questions generated from your own pages, flashcards with no card-writing, and “explain it back” checks that reveal what you saved but never understood."
    ],
    everyday: { title: "A well-stocked workshop", text: "Raw materials sorted and labelled on the shelves (the vault) mean building something takes an afternoon, not a week. You still design and finish the piece yourself, and offcuts go back on the shelf for next time." },
    example: { title: "Your portfolio post", text: "For your Route 2 write-up, the agent outlines “What I learned about why AI agents fail in production” from your concept pages, marks two places where your sources disagree, and lists one claim with no source behind it. You write the sentences, publish the post, and ingest it back as a source." },
    words: [["digital-garden", "a public website built from selected notes, with working links"], ["spaced-repetition", "reviewing a fact just before you would forget it"]],
    remember: [
      "Outline from your concept pages; write the sentences yourself; ingest the result back.",
      "Publish only pages marked publish: true, from a copy, never the live vault.",
      "Measure learning, not collection: can you answer from memory?"
    ],
    figures: [
      { w: "flow", title: "From vault to finished work, and back", plain: "The loop that makes the second piece in a domain much faster than the first.",
        opts: { cycle: "Your finished work becomes a source for the next piece", steps: [
          { t: "Outline", s: "from concept pages", d: "“Outline an article on X from my concept pages. Mark where my sources disagree and where a claim has no source.” Not the consensus view of the internet, which is what everyone else writes." },
          { t: "Check the chain", s: "claim → concept → source → URL", d: "Every claim traces to a source page with a URL. A number in the draft with no source page behind it did not come from your research." },
          { t: "Write", s: "your own sentences", d: "The agent assembles structure and evidence; you write, or rewrite every paragraph. Publishing the assembly reads exactly like what it is." },
          { t: "Publish", s: "opt-in only", d: "Only pages with publish: true leave the vault, copied to a separate folder first." },
          { t: "Ingest it back", s: "the step everyone skips", d: "Your piece states your position at a date. Later material can contradict it explicitly." }
        ] },
        takeaway: "Ingesting your own finished work is what makes the second piece in a domain meaningfully faster than the first." },
      { w: "layers", title: "Four ways to learn from your own vault", plain: "Reading something is not learning it. Click each.",
        opts: { items: [
          { t: "Questions from your pages", s: "answer without looking", d: "“Generate ten questions from my concept pages on evals. Mix recall and application. Do not include the answers.” The ones you cannot answer are things you saved and never learned." },
          { t: "Flashcards, no card-writing", s: "spaced repetition", d: "The agent generates cards from concept pages; the free Spaced Repetition plugin reviews cards written inside your notes. Keep it to the pages that matter." },
          { t: "The copied-language check", s: "what you did not digest", d: "“Which of my concept pages use language copied from the source rather than explained in my own words?” Those are the ones you probably did not understand." },
          { t: "Explain it back", s: "the oldest test", d: "“Ask me to explain GraphRAG as if to someone who has not read about it. Then compare what I said to my page and tell me what I left out.”" }
        ] },
        takeaway: "Page count goes up whether or not you know more. Once a quarter, check whether you can answer from your own material without opening it." }
    ],
    lessons: [
      { title: "Outline from your pages, not from a prompt", plain: "Asking a model to outline a topic from scratch gives the consensus view of the internet. Outlining from your concept pages gives an argument grounded in what you read, with its weak points marked.",
        points: ["The disagreements between your sources are the most useful part: they are where you have something to say that is not the consensus.", "Every claim traces back through a concept page to a source page to a URL, which turns fact-checking into a five-minute job."] },
      { title: "Keep your voice", plain: "Drafting from the vault produces the model's phrasing over your material. Fine as a first pass, bad as a final one.",
        like: "A research assistant can prepare the briefing pack; you still give the presentation.",
        points: ["Practical split: the agent assembles structure and evidence; you write the sentences. Or draft with it and rewrite every paragraph.", "Watch for the specific failure of writing with a model: fluent sentences containing invented specifics."] },
      { title: "Research reports", plain: "A report is what you produce when a question needs more than the vault holds. The vault is the starting point.",
        code: { title: "A report structure worth rereading", lang: "outline", lines: [
          ["Question", ""],
          ["What I found (with page citations)", ""],
          ["Where sources disagree", ""],
          ["What I could not establish", "Shows the reader where the report is thin."],
          ["What would change the conclusion", "Shows where it is load-bearing."]
        ] },
        points: ["First ask: “What does my vault already cover on this, what is thin, and what is missing?” That answer is your research plan.",
          "Fill gaps through raw/ and a proper ingest, not by pasting articles into the draft; otherwise the vault learns nothing.",
          "Store the report in output/, then ingest it back as a dated source."],
        pm: "The same five headings work for any decision paper or vendor assessment at work." },
      { title: "Publishing a public subset", plain: "Some of your vault is worth showing. Use explicit opt-in: a <code>publish: true</code> field, and nothing without it ever leaves. Opt-out is a mistake, because one forgotten flag publishes something private, silently and permanently.",
        points: ["Tools: Obsidian Publish (official, paid), or free open-source [[digital-garden|digital gardens]] like Quartz, which understand links and backlinks.",
          "Never point a publishing tool at the live vault. A build step copies only opted-in pages to a separate folder and turns links to unpublished pages into plain text, not broken links.",
          "Publishing changes how you write: you hedge more and keep tentative thoughts out, yet tentative thoughts are what a personal vault is for. Keep the private vault primary.",
          "For a single report, pandoc turns markdown into PDF or HTML. Never export the whole vault to a format you cannot regenerate."] },
      { title: "Learning from your own vault", plain: "A vault full of pages you never revisit is a library, and libraries do not make anyone knowledgeable. The second figure above shows four ways to turn it into learning.",
        points: ["Questions generated from your own pages beat generic quizzes: they come from material you chose, at the depth you recorded it.", "[[spaced-repetition|Spaced repetition]] has low adoption because writing cards is tedious; the agent removes that step.", "Measure learning, not collection, once a quarter. The result reliably surprises people, in both directions."] }
    ],
    practice: {
      title: "Write and publish your Route 2 post from the vault", min: 45,
      intro: "You outline a short public post from your course vault, write it in your own words, publish a small opted-in subset of the vault as a free digital garden on Vercel or GitHub Pages, and ingest the post back. Then you take a ten-question quiz generated from your own pages.",
      steps: ["Mark three to five concept pages you are happy to share with publish: true.", "Paste the prompt; review the outline before writing.", "Write the post yourself (200 to 400 words) in output/.", "Deploy the garden (free) and link it from your portfolio README.", "Answer the ten quiz questions without looking."],
      prompt: "In this vault:\n1. Outline a 300-word post titled \"What I learned about why AI agents fail in production\" from my concept pages only. For each point, cite the page and source; mark where my sources disagree; list any claim with no source behind it. Do not write the post: I will.\n2. Set up a publishing build: scripts/publish.sh copies only pages with publish: true (and their attachments) into ../garden/content, rewrites links to unpublished pages as plain text, and builds a static site with Quartz (free, open source). Explain how to deploy it for free on Vercel or GitHub Pages. Never read from or publish anything without publish: true.\n3. After I save my post to output/, ingest it back as a source page dated today.\n4. Generate ten questions from my concept pages (recall and application mixed, no answers), save them to output/quiz-YYYY-MM-DD.md, then after I answer, mark which ones I got wrong and which pages to reread.",
      observe: ["Which claims in the outline had no source? Remove them or go find one.", "Did any unpublished page leak into the build folder? Check before deploying.", "Which quiz questions did you miss? Those pages were saved, not learned."],
      done: "The post is written in your words, a small opted-in garden is online, the post is ingested back, and you know which pages to revisit."
    },
    quiz: [
      { q: "Why outline from your concept pages rather than asking a model to outline the topic?", options: ["It is faster", "You get an argument grounded in your reading, with disagreements marked, instead of the internet's consensus", "Models cannot outline", "It uses fewer tokens"], answer: 1, why: "The disagreements in your sources are where you have something original to say." },
      { q: "Which publishing approach is safest?", options: ["Publish everything except pages marked private", "Publish only pages marked publish: true, from a copy", "Point the site builder at the live vault", "Email pages manually"], answer: 1, why: "Opt-in from a copy. Under opt-out, one forgotten flag publishes something private, permanently." },
      { q: "What should happen to a finished report?", options: ["Delete it", "Store it in output/ and ingest it back as a dated source", "Paste it into a concept page", "Keep it only in email"], answer: 1, why: "Ingested back, it records your position at a date, and later sources can contradict it explicitly." },
      { q: "Which check reveals pages you saved but did not understand?", options: ["Counting pages", "Finding pages written in language copied from the source", "Checking file sizes", "Counting tags"], answer: 1, why: "A page that repeats the source's phrasing is one nobody digested." }
    ],
    sources: [
      { t: "Quartz", url: "https://quartz.jzhao.xyz", note: "free, open-source digital garden builder" },
      { t: "Spaced Repetition plugin for Obsidian", url: "https://github.com/st3v3nmw/obsidian-spaced-repetition", note: "free" },
      { t: "pandoc", url: "https://pandoc.org", note: "free document converter" }
    ],
    next: "Unit 3.09 keeps all of it alive for years: health checks, a review rhythm, version history, backups, privacy, and growth."
  });

  /* ================= Unit 3.09 · Maintenance ================= */
  P.addUnit({
    id: "brain-maintain", track: "brain", num: 9, short: "Upkeep", kicker: "Keep it healthy",
    plainTitle: "Keep it alive for years: checks, reviews, backups, privacy",
    hook: "Structural rot is silent. Nothing errors; the vault just slowly stops answering well because a third of its pages became unreachable and nobody noticed. A small routine prevents it: a weekly check and review, monthly numbers, quarterly honesty, real backups, and clear privacy rules.",
    source: "09 · Maintenance", sourceUrl: SRC + "09-maintenance",
    bridge: "Unit 3.06 scheduled the agents and Unit 3.05 gave you the four health numbers. This unit is the owner's routine around them: what the checks look for, what you read, and how to make sure a bad week can always be undone.",
    explain: [
      "A [[lint]] pass checks the structure: broken links, orphan pages, stubs, missing frontmatter, near-duplicates, and an index that has drifted. Mechanical problems are fixed automatically; anything needing judgement (merges, deletions) is proposed and waits for you.",
      "The review is the only maintenance task that produces something you read: ten minutes weekly, a structural look monthly, and two honest questions quarterly. Keep it short: three recommendations, not ten.",
      "Backups and privacy are the long-term insurance. Sync is not backup. And a mature second brain is one of the most revealing documents about a person that exists, so decide what goes in before it arrives."
    ],
    everyday: { title: "Owning a car", text: "A quick weekly look at the tyres (lint), a short logbook entry (review), a proper service on schedule (monthly and quarterly), insurance that does not depend on the car itself (backups), and not leaving the house keys on the dashboard (privacy)." },
    example: { title: "The rename that broke forty links", text: "One Tuesday, an agent renamed “Context length” to “Context window” directly on disk. Obsidian did not update the links, and forty pages pointed nowhere. Sunday's lint reported 40 broken links instead of the usual 3, which pointed straight at Tuesday's run in the log, and one git revert fixed it." },
    words: [["lint", "an automatic check of the vault's structure: links, orphans, frontmatter"], ["archive-folder", "a folder for cold material: still searchable, out of the way"]],
    remember: [
      "Lint weekly: fix the mechanical, propose the rest, and read the counts.",
      "Three copies: a private git remote, sync, and an archive that does not follow sync. Test a restore once.",
      "Decide privacy at capture. Separate vaults beat careful filtering."
    ],
    figures: [
      { w: "layers", title: "What a lint pass checks", plain: "Six checks. Green tags are safe to fix automatically; amber ones need your judgement. Click each.",
        opts: { items: [
          { t: "Broken links", s: "links pointing nowhere", tag: "auto-fix typos", c: 3, d: "Two cases: a typo or rename (fix it) and a genuine gap (list it under Gaps in index.md). Never create an empty page to satisfy a link: it looks like coverage." },
          { t: "Orphans", s: "pages nothing links to", tag: "propose", c: 4, d: "Find where they belong and link them, or delete them. Common after bulk imports." },
          { t: "Stubs", s: "under about 40 words, no links", tag: "propose", c: 4, d: "Usually a failed ingest. Flag for re-ingest from the original in raw/." },
          { t: "Schema problems", s: "frontmatter missing or wrong", tag: "auto-fix", c: 3, d: "Missing fields, wrong type, tags outside your list." },
          { t: "Near-duplicates", s: "two pages, one idea", tag: "propose", c: 4, d: "Similar titles, overlapping aliases, the same pages linking to both. The agent proposes; you decide." },
          { t: "Index drift", s: "catalog out of date", tag: "auto-fix", c: 3, d: "Pages missing from index.md, or entries pointing nowhere." }
        ] },
        takeaway: "Three broken links after a week is normal. Forty means something in the ingest instructions changed. Track rates, not raw counts." },
      { w: "compare", title: "Sync, git, and an archive are three different things", plain: "Most people have only the first and believe they have a backup.",
        opts: { cols: [{ t: "Sync", s: "work across devices", c: 4 }, { t: "Private git remote", s: "pushed after every run", c: 1 }, { t: "Periodic archive", s: "monthly, disconnected", c: 3 }],
          rows: [["Protects against", "Losing a device", "A bad agent run, even weeks later", "Everything else going wrong at once"],
            ["When an automation damages 200 pages", "Copies the damage everywhere in seconds", "One command to go back to before the run", "Untouched"],
            ["Versioned?", "No", "Yes: every run is a commit", "One snapshot per month"],
            ["Effort", "None", "A push after each run", "Monthly, plus one test restore"]],
          verdict: "The real risk is not disk failure; it is an automation that quietly did something wrong three weeks ago. That needs history, which is why git carries most of the load." } }
    ],
    lessons: [
      { title: "Linting the vault", plain: "A lint pass finds the six kinds of structural rot in the first figure above. Report before repairing: a linter that merges on its own judgement destroys work; one that only reports produces a list nobody acts on.",
        points: ["Run it weekly, or after any import of more than about twenty sources, not after every small ingest.", "Run it on a clean git state, so a wrong repair is one command away from undone.", "Inside Obsidian, the “Find orphaned files and broken links” plugin covers two of the checks visually."] },
      { title: "The review rhythm", plain: "Weekly, ten minutes: the agent prepares, you read. Monthly: look at the vault's structure. Quarterly: two honest questions.",
        like: "A weekly team stand-up, a monthly report, and a quarterly retrospective.",
        points: ["<b>Weekly:</b> what was added, which concepts gained the most links, unresolved contradictions, open questions, and three things to read or write next. Where your links went is where your attention actually was.",
          "<b>Monthly:</b> append the four metrics; find concept pages untouched for 90 days while their topic kept getting sources; read the Gaps list (a reading list you generated without trying); spot-check one local graph.",
          "<b>Quarterly:</b> “What have I changed my mind about?” and “What am I keeping that I will never use?” Archive the second.",
          "<b>Prune:</b> archive sources for topics you no longer care about; question concept pages that never got a second source; never prune anything that others link to.",
          "Keep it short. If a week produced nothing worth reporting, one line saying so is the right output."],
        pm: "This is the same governance rhythm you would set for any long-running product: a weekly status, a monthly health review, and a quarterly retrospective." },
      { title: "Versioning with git", plain: "One commit per agent run, with the run named in the message. Not one per file (buries the history) and not one per week (cannot undo one bad run without losing good ones).",
        points: ["Read the diffs of generated pages in the first weeks. You are looking for pages that changed when they should not have, and rewrites where an append was expected.",
          "<code>git log --stat</code> after a week shows which pages your automation touches most.",
          "Use a branch for experiments that change structure: a new page contract, a schema change, a re-ingest. Read the result, then merge or delete the branch.",
          "Never commit workspace files, caches, or anything containing a key."] },
      { title: "Backups and portability", plain: "Sync propagates: if an automation rewrites two hundred pages badly, sync copies the damage to every device in seconds. A backup is a copy that does not follow.",
        points: ["A workable arrangement: a private git remote pushed after every run, sync for working across machines, and a monthly archive to separate storage. Three copies, one of them dumb and slow.",
          "<b>Test a restore once:</b> restore the archive somewhere else, open it in Obsidian, and check the links. The common failure is an archive that skipped a folder or caught the vault mid-sync.",
          "Portability checks: nothing important lives only in plugin data; links resolve without Obsidian; the agent's instructions (CLAUDE.md, skills, commands) live in the vault, not in a chat history."] },
      { title: "Privacy", plain: "Decide at capture, not later. Redacting after ingest does not work: by then the material has spread into concept pages, links, and summaries.",
        points: ["<b>Does not belong:</b> credentials of any kind; other people's private information (they did not consent to being ingested); material under confidentiality obligations, such as client work under NDA in a vault that syncs to a personal cloud.",
          "<b>Separate vaults beat careful filtering.</b> A private folder inside one vault relies on every query, export, and publish step respecting the boundary. Two vaults cannot leak into each other.",
          "<b>Local models for sensitive material:</b> a free local model (through Ollama) can ingest a vault that must never leave your machine. Quality is lower; worth it for medical, legal, financial, or work-confidential material.",
          "Before sharing any vault: search it for keys, check frontmatter for personal identifiers, and read the log for what came from where."],
        pm: "For your work notes, keep a separate private vault on your work machine, ingested with a local model if policy requires. Only the public course vault goes in your portfolio." },
      { title: "Growing past a thousand pages", plain: "Most personal vaults live at a few hundred to a few thousand pages for years. Past that, two things strain: the index becomes expensive to read, and you can no longer hold a mental map of it.",
        points: ["Not search (ripgrep stays instant) and not Obsidian (though the global graph stops being useful around a thousand nodes).",
          "<b>Summary layers:</b> one topic index per area between the master index and the pages. Two levels is enough.",
          "<b>Split by domain, never by date:</b> only when two areas genuinely do not inform each other. Splitting late and reluctantly keeps the cross-topic connections that are often the interesting ones.",
          "<b>Archive</b> cold material to an <code>archive/</code> folder outside wiki/: still searchable, out of the index and graph, and reversible.",
          "<b>Prune yearly:</b> concept pages with one source and no inbound links after a year were paragraphs, not concepts.",
          "The honest ceiling: past about ten thousand pages, a curated wiki stops suiting one person. Usually ingestion has been running without judgement; the fix is upstream, in what you feed it."] }
    ],
    practice: {
      title: "Set up the maintenance routine, and a private work vault", min: 45,
      intro: "You run the first lint and weekly review on your course vault, set up a three-copy backup and test a restore, and create a separate private vault for work notes that uses a free local model, so nothing confidential ever reaches the public one.",
      steps: ["Paste the prompt in your course vault and approve the plan.", "Run the lint and read the counts before approving any fix.", "Restore the archive into a temporary folder and open it in Obsidian.", "Create the private work vault outside your portfolio repository."],
      prompt: "For this vault:\n1. Create a lint skill and /lint command: check broken links (typo vs genuine gap), orphans, stubs under 40 words, frontmatter schema, near-duplicates, and index drift. Auto-fix only typos, schema, and index drift; propose everything else in a table and wait for me. Print counts first.\n2. Create output/review-template.md for the weekly review (added, most-linked concepts, open contradictions, open questions, three next actions; one line if nothing happened) and a monthly checklist (four metrics, 90-day stale concepts, Gaps list, one local-graph spot check).\n3. Write scripts/backup.sh that makes a dated zip archive of the vault (excluding .obsidian/workspace* and caches) to a folder I choose outside the vault, and explain how to test a restore.\n4. Add a .gitignore check: list anything in .obsidian/plugins/ that might contain a key.\n5. Separately, give me step-by-step instructions (do not do it yourself) to create a private vault at ~/work-vault, outside this repository, with its own CLAUDE.md saying: ingest with the local model llama3.2 through Ollama only; never sync to a personal cloud; never publish. Explain the trade-off in quality.",
      observe: ["How many broken links and orphans did the first lint find? Write the counts in wiki/metrics.md.", "Did the restored archive open with working links?", "Is anything in plugin data that should not be committed?"],
      done: "Lint and review run on demand, a restore has been tested, and your work notes have a separate private home."
    },
    quiz: [
      { q: "Which lint findings should be fixed automatically?", options: ["Merges and deletions", "Typos in links, schema errors, and index drift", "Everything", "Nothing"], answer: 1, why: "Mechanical problems are safe to fix. Merges and deletions need your judgement and are only proposed." },
      { q: "Why is sync not a backup?", options: ["It is slow", "It copies mistakes and deletions to every device", "It costs money", "It only works on phones"], answer: 1, why: "A backup is a copy that does not follow. Pair sync with a private git remote and a disconnected archive." },
      { q: "You have confidential client notes. What is the safest setup?", options: ["A private folder inside your main vault", "A separate vault, ideally with a local model for ingestion", "Tags marking pages as private", "Delete them after a month"], answer: 1, why: "Two vaults cannot leak into each other. A private folder relies on every query, export, and publish step respecting it." },
      { q: "When should you split a big vault into two?", options: ["Every year, by date", "When two domains genuinely do not inform each other, late and reluctantly", "At 500 pages", "Never"], answer: 1, why: "Split by domain, never by date, because old material connecting to new is the whole value." }
    ],
    sources: [
      { t: "Find orphaned files and broken links (Obsidian plugin)", url: "https://github.com/Vinzent03/find-unlinked-files", note: "free" }
    ],
    next: "Unit 3.10 is the troubleshooting guide: the failures everyone hits and how to fix each one."
  });

  /* ================= Unit 3.10 · Troubleshooting ================= */
  P.addUnit({
    id: "brain-fix", track: "brain", num: 10, short: "Fixing it", kicker: "Keep it healthy",
    plainTitle: "When it goes wrong: the common failures and their fixes",
    hook: "Every failure in this unit is common. If your vault is doing one of these things, you did not set it up wrong in some unrecoverable way, and starting over with a different tool is almost never the fix.",
    source: "10 · Troubleshooting", sourceUrl: SRC + "10-troubleshooting",
    bridge: "This is the last unit of Route 3, and a reference you can come back to. Most fixes use tools from earlier units: the page rules (3.04), the metrics (3.05), the agents and guardrails (3.06), and git (3.09).",
    explain: [
      "Most problems fall into a few families: nothing new arrives (capture broke), pages are bad (the input or the instructions are bad), links break (renames and fast imports), or the vault feels slow and vague (size or rot).",
      "The diagnosis order matters. For a bad page, look at the raw source before blaming the agent: half the time the PDF or transcript was mangled. Then look at the instructions. Then fix them, roll back, and re-run, rather than patching pages by hand.",
      "And the honest failure: you stopped opening it. That usually means capture broke months ago or the weekly review is too long to read. Both are fixable."
    ],
    everyday: { title: "A car that will not start", text: "You check the obvious things in order (fuel, battery, then the engine), rather than buying a new car. And you fix the cause, not just the symptom, or it will not start again tomorrow." },
    example: { title: "Pages that read like book reports", text: "Your concept pages read like summaries of summaries. The raw sources are clean, so you search CLAUDE.md and find the word “summarize” in the page contract. You replace it with “explain the idea in plain language, standing on its own”, paste one good page as an example, revert the run, and re-ingest." },
    words: [["maintained-by-human", "a frontmatter flag that tells the agent not to rewrite a page"]],
    remember: [
      "For a bad page: check the source, then the instructions, then add one good example.",
      "Fix the contract and re-run; never hand-patch pages from a bad run.",
      "Check metrics before blaming size: twenty percent orphans is a linking problem."
    ],
    figures: [
      { w: "layers", title: "The failures everyone hits", plain: "Symptom on the left, fix inside. Click each.",
        opts: { items: [
          { t: "It stalls after two weeks", s: "nothing new is being processed", c: 2, d: "Almost always capture, not the system: clipping takes three clicks instead of one, or your phone has no path in. Fix the capture path. Or you expected the payoff too early: at thirty pages there is nothing to connect yet." },
          { t: "Summaries of summaries", s: "each layer loses information", c: 2, d: "The page contract says “summarize” somewhere. Concept pages explain an idea in plain language, in your words, standing on their own. Rewrite the contract and re-ingest a few sources to check." },
          { t: "It rewrites your hand-written pages", s: "infuriating and preventable", c: 2, d: "Mark them in frontmatter with maintained_by: human, and add to CLAUDE.md: never rewrite such a page; only append links and flag issues for the owner." },
          { t: "Quality drops as it grows", s: "new pages instead of updates", c: 1, d: "The ingest is not reading index.md before writing, so it creates new pages instead of updating existing ones. That one step keeps quality flat as the vault grows." },
          { t: "Everything connects to everything", s: "the graph says nothing", c: 1, d: "A few hub pages swallowed every link. Split each hub into the specific ideas people actually link to." },
          { t: "The agent writes garbage", s: "on topic, useless to read", c: 8, d: "Check the raw source first, then the page contract, then add one good example page to CLAUDE.md, then ask the agent what it was working from. Fix, revert, re-run." },
          { t: "Broken links and orphans", s: "after renames and imports", c: 8, d: "Agent renames on disk do not update links: enforce the rename procedure. Fix typos in bulk; list genuine gaps; re-link or re-ingest orphans." },
          { t: "It got too big", s: "slow, vague answers", c: 7, d: "Check the metrics first: high orphans means rot, not size. Then summary layers, rebuilding the index, archiving, and only last, splitting by domain." },
          { t: "You stopped opening it", s: "the honest one", c: 7, d: "Usually capture broke months ago, or the review is too long to read. Fix those. Starting over with a different tool always costs another month." }
        ] },
        takeaway: "None of these is a reason to start over. Each has a specific, small fix." },
      { w: "flow", title: "Diagnosing a bad page, in order", plain: "Cheapest and most likely causes first.",
        opts: { steps: [
          { t: "Read the raw source", s: "is the input clean?", d: "Half of bad pages come from bad extraction: interleaved PDF columns, captions with no punctuation, a clipped cookie banner. The agent cannot write well from mangled text, and will not tell you it is struggling." },
          { t: "Check the contract", s: "CLAUDE.md", d: "Vague pages come from: no definition of each page type, the word “summarize”, no instruction to write for someone who has not seen the source, no requirement to link." },
          { t: "Add one example", s: "not another rule", d: "Paste one good concept page into CLAUDE.md as the target. One example communicates the goal more directly than another rule that interacts with the others." },
          { t: "Ask what it used", s: "“what were you working from?”", d: "Ask the agent which parts of the source it read and what it understood the source to claim. The answer usually names the problem: a fragment, confusion between claimed and reported, or a pull toward summarizing." },
          { t: "Revert and re-run", s: "never hand-patch", d: "Fix the contract, revert the run's pages with git, and re-ingest. If the contract was wrong, every page from that run has the flaw, not just the three you noticed." }
        ] },
        takeaway: "The highest-leverage fix, and the least used, is a single example page in CLAUDE.md." }
    ],
    lessons: [
      { title: "It stalls, or you stop opening it", plain: "Both usually trace to capture, not to the system. Material stopped arriving, so there was nothing to process.",
        points: ["Make capture one click again: the clipper button, a share sheet into raw/, a forwarding address.", "Check your expectations: at thirty pages there is nothing to connect. Unit 3.01's timeline is realistic.", "If you stopped reading the weekly review, it is too long. Three recommendations, not ten."] },
      { title: "Bad pages: summaries and rewrites", plain: "Two common page problems with precise causes.",
        points: ["<b>Summaries of summaries:</b> remove the word “summarize” from the contract. Concept pages explain; source pages record.", "<b>Rewritten hand-written pages:</b> mark them <code>maintained_by: human</code> and tell the agent to append links and flag issues only.", "This is also how you keep Matuschak's point (Unit 3.01): the pages you write yourself stay yours."] },
      { title: "Quality drops as it grows; everything connects", plain: "As the vault grows, the ingest must check what exists before writing. If it does not, it creates new pages instead of updating old ones, and you get four pages about one thing.",
        points: ["Confirm the ingest reads index.md before writing anything.", "If a few hubs have absorbed every link, split them into the specific ideas being linked to.", "Watch the metrics trend (Unit 3.05): falling links per page while pages grow is the early warning."] },
      { title: "The agent writes garbage", plain: "Follow the diagnosis order in the second figure above: source, contract, example, ask, revert and re-run.",
        points: ["Do not patch the bad pages by hand: if the contract was wrong, every page from that run has the same flaw.", "One good example page in CLAUDE.md usually beats three new rules."],
        pm: "This is root-cause analysis: fix the process (the contract), not just the defects (the pages), and verify with a re-run." },
      { title: "Broken links and orphans", plain: "Renaming a file on disk does not update links; renaming inside Obsidian does. That one difference causes most broken links in an agent-maintained vault.",
        points: ["Enforce the rename rule in CLAUDE.md: update every inbound link, add the old name as an alias, log it.",
          "Fix typos and renames in bulk, safely. Genuine gaps go under Gaps in the index; never create empty pages to satisfy links.",
          "Orphans are one of three things: should be linked (link it), genuinely standalone (it probably belongs in a project folder), or a failed ingest (re-ingest from raw/).",
          "Prevent both at ingest: nothing counts as ingested until it is linked both ways in the same run. Always lint after a big import."] },
      { title: "It got too big", plain: "Symptoms: slower, vaguer answers; the agent reads twenty pages and returns something general. It is rarely disk, search, or Obsidian. It is the cost of reading a long index.",
        points: ["Check it is size and not rot: a 20% orphan rate is a linking problem, and splitting will not help.", "Then, in order: topic-level summary indexes; rebuild the index (it often just drifted); archive cold material; split by domain only as a last resort."] },
      { title: "Quick answers to common questions", plain: "From the guide's FAQ.",
        table: [["Question", "Short answer"],
          ["Do I need MCP?", "No. Claude Code started in the vault folder reads and writes it directly. MCP matters mainly for scheduled tasks."],
          ["Does it work with other agents?", "Yes. It is markdown, and skills are SKILL.md files several agents read. Instruction file names may differ."],
          ["What does it cost to run?", "Depends on volume. A daily ingest of a few articles is small; a thousand-source backfill is not, hence batches."],
          ["Can I use a local model?", "Yes, for sensitive material, with lower quality on judgement calls like what deserves a page. A common split: local for private, frontier for the rest."],
          ["Do I need Obsidian?", "No. It is a good viewer and has the Web Clipper. Logseq, Foam, or a plain editor also work."],
          ["I have years of notes in Notion or Evernote", "Use the official Importer plugin, treat the result as raw material, and backfill oldest first. Fix messy exports before ingesting."],
          ["Will the agent make things up?", "It can. That is why every structuring rule is about attribution. Watch for a specific number with no source page behind it."],
          ["How long until it is worth it?", "Weeks two to four for the first real payoff; month six for the state people describe as the point."]] }
    ],
    practice: {
      title: "A fire drill, then your Route 3 write-up", min: 45,
      intro: "On a throwaway git branch, you break your course vault in three typical ways and fix each one with the diagnosis order from this unit. Then Claude Code helps you draft a README that presents the vault as a portfolio piece.",
      steps: ["Paste the prompt; it creates a branch called fire-drill and breaks three things.", "Diagnose each problem yourself first, then compare with the agent's diagnosis.", "Delete the branch when done.", "Review the README draft, rewrite it in your own words, and commit it on main."],
      prompt: "In this vault:\n1. Create a git branch fire-drill. On it: (a) rename one well-linked concept file directly on disk without updating links; (b) add a raw source with deliberately garbled text (interleaved columns) and ingest it; (c) add a stub concept page with no links.\n2. Do not tell me which is which. Ask me to diagnose each from the symptoms (run /lint and show me the new pages). After I answer, show the correct diagnosis and fix each one the right way: rename procedure with alias and log line; revert the garbled ingest, fix extraction, re-ingest; link or re-ingest the stub.\n3. Add one good example concept page (choose my best one) to CLAUDE.md as the target for all concept pages.\n4. Switch back to main and delete the fire-drill branch.\n5. Draft course-vault/README.md for my public portfolio: what this vault is, how it is structured (layers, page types, links), the agents and routine that maintain it, the metrics trend from wiki/metrics.md, three things that went wrong and how I fixed them, and what I would do differently. Keep it under 500 words; I will rewrite it in my own voice.",
      observe: ["Which failure was hardest to diagnose from symptoms alone?", "Did the example page change how the next ingested page looks?", "Does your README explain the system so a hiring manager would understand it?"],
      done: "All three drills were diagnosed and fixed, the example page is in CLAUDE.md, and your rewritten README is committed."
    },
    quiz: [
      { q: "Your vault stopped growing after two weeks. What should you check first?", options: ["The model version", "Whether capture is still one click", "The graph view", "The backup"], answer: 1, why: "Stalls are almost always capture. If saving takes several steps, material stops arriving." },
      { q: "A batch produced vague pages. What is the first thing to check?", options: ["Rewrite each page by hand", "The raw source files", "Switch tools", "Add ten new rules"], answer: 1, why: "Half of bad pages come from bad extraction. Check the input before blaming the agent or the instructions." },
      { q: "What is the highest-leverage fix for inconsistent concept pages?", options: ["More rules", "One good example page in CLAUDE.md", "A bigger model", "Fewer sources"], answer: 1, why: "One example communicates the target directly; each new rule interacts with the others." },
      { q: "The vault feels slow and vague, and the orphan rate is 22%. What is the problem?", options: ["It is too big: split it", "Linking rot: fix linking and ingest instructions", "Obsidian is slow", "Search is broken"], answer: 1, why: "High orphans means a linking problem. Splitting a rotten vault gives you two rotten vaults." }
    ],
    sources: [
      { t: "Obsidian Importer (official plugin)", url: "https://github.com/obsidianmd/obsidian-importer", note: "for Notion, Evernote, Roam, Bear, Apple Notes" }
    ],
    next: "That completes Route 3. The deep dives go further on knowledge graphs, cheap decisions, harnesses, loops, and evals, and the Library explains every paper behind these routes."
  });
})();
