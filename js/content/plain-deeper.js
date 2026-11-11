/* The plain-English layer for everything after Part 1, and for the shared pages.
   - Portal.sectionGuides / Portal.pageGuides: a "what this is" line and an everyday comparison for each section
   - per station: conceptLike (one comparison per key concept, in order), labPlain (one line per lab step),
     figurePlain (one line per figure, keyed by widget name) */

Portal.sectionGuides = {
  sixty: { what: "The same story you read in Part 1, now told with the paper's own words. Click any highlighted word for a one-line meaning.", like: "Like reading the official meeting minutes after a colleague has already given you the summary over coffee." },
  concepts: { what: "The paper's main ideas, one at a time. Each starts with a plain sentence; open it for an everyday comparison and the detail.", like: "Like an FAQ: skim the questions, open only the answers you care about." },
  code: { what: "A few lines of real code with a plain-English note beside each line. You never write this yourself; Claude Code does.", like: "Code is a recipe written for a computer. You can follow what a recipe does from its notes without being a chef." },
  numbers: { what: "The handful of figures people quote in meetings and articles about this paper.", like: "Like knowing a project's budget, team size, and deadline without reading the whole plan." },
  read: { what: "Optional. A guided tour of the original paper: which parts to read, which to skip, and what to look for.", like: "Like a colleague marking up a long report with a highlighter and writing “skip this” in the margins." },
  lab: { what: "Four small experiments, each with a ready prompt. Claude Code writes the code, you approve its plan, press Run on a free Google computer, and note what you see.", like: "Like a cooking class: follow the recipe in a small pot, cook it with your own ingredients, taste it against simpler dishes, and write down what burned." },
  build: { what: "One new feature for Delivery Copilot, the app you build across the route. Claude Code writes it in Node.js, the language you already know.", like: "Like adding one room to a house at each station. By the end you have a whole house to show people." },
  plan: { what: "Rows you can paste straight into a real project plan: the work, typical effort, who does it, and what tends to go wrong.", like: "Like a seasoned colleague's checklist from similar projects, so your estimate doesn't start from a blank page." },
  quiz: { what: "Four quick questions to check the ideas have stuck. Every answer comes with an explanation, so a wrong answer still teaches you something.", like: "Like the review questions at the end of a textbook chapter." },
  interview: { what: "Questions an interviewer might ask an AI project manager about this paper's ideas, with the points a strong answer covers.", like: "Like rehearsing a client presentation: say it out loud first, then compare with your notes." },
  publish: { what: "Turn what you did into something people can see: a short results page in your GitHub repository and a short public post.", like: "Like a project close-out report: what we tried, what we found, what we learned." },
  progress: { what: "This station's sessions as a checklist, plus a notes box that stays in this browser.", like: "Like your own small project tracker for this station." }
};

Portal.pageGuides = {
  /* Study method */
  m_rhythm: { what: "How to use one 45-minute slot a day.", like: "Like a daily stand-up with yourself: pick one thing, do it, note what happened." },
  m_loop: { what: "The four steps every lab follows, at every station.", like: "Like learning to cook a new dish: small pot first, then your own ingredients, a taste test, and notes on what burned." },
  m_tools: { what: "How the three tools fit together. GitHub is your project folder online. Claude Code is the engineer who writes the code. Google Colab is a free borrowed computer that runs it.", like: "Like a small team: a shared drive, a developer, and a machine room you can use for free." },
  m_belt: { what: "Every tool on the route, what it is for, and what it costs. Everything is free.", like: "Like a starter toolkit: everything you need, nothing to buy." },
  m_read: { what: "How to read a research paper without getting stuck.", like: "Like reading a long report: skim the summary and headings, read the parts that matter, and leave the details for later." },
  m_plan: { what: "Estimate when you will finish at your own pace.", like: "Like a project timeline you can re-plan by changing one number: hours per week." },
  m_templates: { what: "Two fill-in forms to use after each experiment.", like: "Like a lab notebook page and an incident report." },
  /* Toolkit */
  t_decide: { what: "Answer three or four questions about your use case and get the cheapest approach likely to work.", like: "Like a triage nurse's questions: quick, in order, and pointing you to the right specialist." },
  t_train: { what: "A back-of-envelope estimate of what it costs to train a model.", like: "Like estimating a construction job: building size × materials gives labor hours, and labor hours × hourly rate gives the cost." },
  t_serve: { what: "How much computer memory it takes to run a model for users.", like: "Like sizing a warehouse: the model is permanent stock that always takes space, and every active customer needs working floor space that grows with the length of their conversation." },
  t_life: { what: "The stages every AI model goes through, from collecting text to serving users.", like: "Like the stages of building and running a factory: sourcing materials, designing, building, staffing, customizing, and running it." },
  t_questions: { what: "Questions to bring to design reviews and vendor calls, grouped by topic.", like: "Like a checklist for a site visit: you don't need to be the engineer to ask the right questions." },
  /* Portfolio */
  p_tracks: { what: "Two versions of the same work: a public one you can show anyone, and a private one for your real job.", like: "Like an architect's portfolio of sample designs, alongside the confidential client projects they talk about in interviews." },
  p_flow: { what: "How the app answers a question, one step at a time. Each box below is one step, with the station where you build it.", like: "Like a librarian for project documents: catalog the documents, cut them into index cards, file each card by meaning, pull the most relevant cards when someone asks, write an answer that cites them, and keep a log of every question and every piece of feedback." },
  p_milestones: { what: "Which feature and which project document you add at each station.", like: "Like a project roadmap with one small release per station." },
  p_stack: { what: "The free tools the app uses, and the one job each tool does.", like: "Like the trades on a building site: each does one job, and together they build the house." },
  p_brief: { what: "The standing brief you give Claude Code before every feature.", like: "Like the onboarding notes you give any contractor before their first task." },
  p_public: { what: "A public GitHub repository that shows your work station by station.", like: "Like a designer's portfolio: hiring managers skim it to see what you can actually do." },
  p_templates: { what: "Fill-in-the-blank documents an AI project manager owns, ready to copy.", like: "Like the standard templates a project management office hands to every new project." },
  /* Interviews */
  i_intro: { what: "Interviews for AI project and program manager roles usually mix three kinds of questions: delivery questions you already know from IT (planning, risks, stakeholders), AI-specific questions (data, quality checks, cost, safety), and stories about what you have done. The papers give you the concepts; the labs and your app give you the stories.", like: "Like a project manager interview you already know, plus a section on how AI projects are different." },
  i_mock: { what: "One random question at a time. Answer out loud, then compare with the guidance.", like: "Like a deck of flash cards you talk through." },
  i_how: { what: "Four habits that make answers sound experienced, even early in an AI career.", like: "Like a presentation structure you can reuse every time." },
  i_bank: { what: "Every question, grouped by topic and then by station.", like: "Like the index of a revision guide." },
  /* Glossary and About you */
  g_intro: { what: "Look up any word as you meet it. Each entry has a plain meaning, an everyday comparison, and the station or unit where the word first matters. New here? Choose “Start here” below to see only the words from the nine-step story.", like: "Like a phrasebook for a country you are visiting: you look words up as you need them; nobody reads it cover to cover." },
  t_ladder: { what: "A four-rung ladder from a single model call to a team of agents. Each rung up costs more tokens, is harder to test, and needs more safety machinery, so start at the bottom and climb only on evidence.", like: "Like choosing between a form letter, a checklist, a trusted assistant, and a whole project team: you would not hire a team to send a form letter." },
  t_golive: { what: "Twenty-four things to have in place before an AI agent runs without someone watching, grouped by the five layers plus production. Tick them as your team confirms each one; copy the list into Jira or Confluence for the go-live review.", like: "Like a pre-flight checklist: boring, short, and the reason nothing surprising happens in the air." },
  t_budget: { what: "A calculator for what fills an agent's context window and what a whole run costs, with and without prompt caching. Useful in design reviews and when a bill jumps.", like: "Like a packing calculator for a trip where you pay per kilo on every leg of the journey, not once." },
  t_threshold: { what: "A calculator for the confidence level at which an automated decision acts on its own. Change the cost of a wrong action and watch the cheapest threshold move.", like: "Like setting the refund limit a cashier can approve without calling the manager." },
  t_agentq: { what: "Three questions per layer to ask a team or vendor about an agent they are building or selling. Each links back to the unit that explains it.", like: "Like a building inspector's checklist: you do not need to lay bricks to ask whether the fire exits work." },
  l_intro: { what: "Two halves. Papers and reading: every paper, whitepaper, article, and book that Routes 2 to 4 draw on, in two plain sentences each. Tools and repositories: the ready-made Claude Code toolkit, apps, Obsidian plugins, and open-source projects. Each links to the unit where it matters most. Items marked “read with care” are recent preprints or new releases that have not been independently checked yet.", like: "Like the bibliography at the back of a textbook, except each entry tells you in plain words why it is there and which chapter to read it with." },
  a_intro: { what: "A few questions about your background and goals. Your answers stay in this browser; copy them into a chat with Claude to get suggestions tuned to you.", like: "Like the intake form a coach asks you to fill in before the first session." }
};

Portal.extendPaper("foundations", {
  conceptLike: [
    "Like the few spreadsheet skills most people actually use: totals, averages, and reading a chart's axis. That is the level needed here.",
    "Like Lego bricks: common words are one brick, and rare words are built from several smaller bricks.",
    "Like GPS coordinates for meaning: words with similar meanings are neighbors on the map.",
    "Like the knobs on a sound-mixing desk, except a big model has billions of knobs.",
    "Like walking downhill in fog: you can't see the bottom, but you can feel which way the ground slopes and take a small step that way.",
    "Like a student who memorized last year's exam answers and fails when the questions change.",
    "Like building a factory once versus paying the electricity bill for every product it makes."
  ],
  labPlain: [
    "Set up free accounts and run your first notebook: a page where code and its explanations sit together, running on Google's free computers.",
    "Paste in some of your own work text and see how an AI service would chop it up, and what sending it would cost.",
    "Compare three ways of chopping text into pieces, and see why AI uses the middle option.",
    "Start a diary of what went wrong and why. It becomes your best interview material."
  ],
  figurePlain: {
    embeddings: "Each dot is a word, placed by meaning. Click one to see its closest neighbors.",
    gradient: "A tiny model learns one number. Watch the orange dot roll downhill toward the lowest error, and see what happens when the steps are too big.",
    overfit: "Two lines: how the model does on its practice examples, and on new ones. Find the point where it stops learning and starts memorizing.",
    tokenizer: "Type a sentence and watch it get chopped into the pieces AI actually reads. The slider sets how many common pieces the chopper knows.",
    logscale: "The same five numbers drawn two ways. One way hides the small ones; the other shows them all.",
    dotproduct: "Two arrows. The score is high when they point the same way, zero when unrelated, and negative when opposite."
  }
});

Portal.extendPaper("transformer", {
  conceptLike: [
    "Like scanning a long email thread for the lines that matter to your question.",
    "Like several reviewers reading the same draft: one checks grammar, one checks facts, one checks tone.",
    "Like numbering the pages of a document before shuffling them, so the order can be restored.",
    "Like a translator's two jobs: first read and understand the whole letter, then write the reply word by word.",
    "Like keeping the original draft beside every edit, so nothing important is lost over many rounds of changes.",
    "Like a whole team writing different pages of a report at once, instead of one person writing it page by page."
  ],
  labPlain: [
    "Train a tiny text-writing model on Shakespeare and watch it go from random letters to real words in about 15 minutes.",
    "Train the same model on text from your own world and see what style it picks up, and what it simply copies.",
    "Remove parts of the model one at a time to see which parts actually matter.",
    "Write down what broke, why, and how you fixed it."
  ],
  figurePlain: {
    attention: "Click a word to see which other words it pays attention to. Darker means more attention.",
    attnmath: "What happens behind the scenes: the question arrow is compared with each word's arrow, and the closest ones get the most weight.",
    posenc: "Each row is the unique pattern added to a word to say where it sits in the sentence.",
    arch: "A map of the model's building blocks. Click a block for a one-line explanation."
  }
});

Portal.extendPaper("bert", {
  conceptLike: [
    "Like guessing a blanked-out word when you can read the words both before and after the gap.",
    "Like a fill-in-the-blank worksheet done millions of times, where the answer key comes free with the text.",
    "Like asking whether page 2 really follows page 1, or was shuffled in from another document.",
    "Like a general degree followed by a short, job-specific induction.",
    "Like the header and divider lines on a form, which tell the reader where each part starts.",
    "Like a standard and a premium edition: the premium one is better but needs more to run."
  ],
  labPlain: [
    "Try the real BERT on fill-in-the-blank sentences, then teach it to tell positive movie reviews from negative ones.",
    "Teach it to sort text from your own work, such as tickets into categories, and measure how often it is right.",
    "Compare it with simple keyword rules and a basic statistical method. Is the AI worth the extra effort?",
    "Note where it went wrong and why. Often the cause is the data, not the code."
  ],
  figurePlain: {
    mlm: "Hide a word and see how much easier it is to guess when the model can also read the words after the gap.",
    maskrecipe: "Each click makes a new practice sentence the way BERT did: some words hidden, a few swapped, a few left alone.",
    finetune: "The same model doing four different jobs. Only the small final step changes."
  }
});

Portal.extendPaper("gpt2", {
  conceptLike: [
    "Like autocomplete that keeps going: each word it writes becomes the start of the next guess.",
    "Like learning to write from well-recommended books instead of every pamphlet ever printed.",
    "Like someone who has read so many Q&A pages that seeing “Q:” makes them reach for an answer.",
    "Like an alphabet that can spell any word in any language, even unfamiliar ones, by falling back to single letters.",
    "Like a student whose grades keep rising with every extra year of study, with no sign of leveling off.",
    "Like a new product rolled out to a small group first, watched closely, then released more widely."
  ],
  labPlain: [
    "Run the real GPT-2, score how well it predicts text, and try its “TL;DR” summary trick.",
    "Teach GPT-2 to write in the style of your own documents.",
    "Compare different ways of picking the next word, and rate the results yourself without knowing which is which.",
    "Record the odd behaviors you saw, such as repetition, and what caused them."
  ],
  figurePlain: {
    sampling: "The bars are the model's chances for each possible next word. The sliders set how adventurous the pick is.",
    zeroshot: "Three ways of phrasing a request so the model does a task it was never taught."
  }
});

Portal.extendPaper("gpt3", {
  conceptLike: [
    "Like showing a temp three completed forms and saying “do the rest like these”.",
    "Like briefing a contractor with no example, one example, or a handful of examples.",
    "Like a recipe that keeps working when you scale from dinner for four to a banquet, and tastes better at banquet size.",
    "Like a diet plan: extra helpings of the good food (books, Wikipedia) and a measured amount of the rest (the wider web).",
    "Like a child who suddenly reads whole sentences after months of only recognizing letters.",
    "Like an exam where some students saw the questions in advance: the scores look better than the real ability."
  ],
  labPlain: [
    "Test GPT-3's big idea on free models of three sizes: do examples in the request help, and do they help bigger models more?",
    "Try it on a task from your work, and see how much the answers change when you only reorder the examples.",
    "Line prompting up against the BERT model you trained, on accuracy, speed, and cost.",
    "Note where prompting was fragile, and what made it more reliable."
  ],
  figurePlain: {
    fewshot: "Build a request with zero, one, or three examples. Watch the request grow, and what that costs at scale.",
    scale: "Model sizes side by side. Each grid line is ten times the previous one."
  }
});

Portal.extendPaper("chinchilla", {
  conceptLike: [
    "Like a project budget in person-days: team size × days worked.",
    "Like balancing team size and training time: double the team, and double the training too.",
    "Like trying several team sizes with the same total budget and plotting which delivered the best result.",
    "Like a forecasting model fitted from past projects: useful, but an estimate, not a law of nature.",
    "Like a fast-growing company that can afford more staff but can't find enough qualified candidates.",
    "Like choosing between a car that is cheap to build but thirsty, and a pricier one that is cheap to run."
  ],
  labPlain: [
    "Train several tiny models on the same budget but with different sizes, and see which size wins.",
    "Count how much text you have and work out how big a model it could sensibly support.",
    "Compare three ways of spending the same budget, including what each costs to run afterwards.",
    "Write down what made the comparison misleading, such as a setting you forgot to adjust."
  ],
  figurePlain: {
    chinchilla: "Pick a budget, then a model size. The curve shows how good the model would get; its lowest point is the best use of the budget.",
    scale: "How much each model read for its size. The orange line marks the sweet spot of about 20."
  }
});

Portal.extendPaper("instructgpt", {
  conceptLike: [
    "Like the difference between an employee who is clever and one who is clever and does what the customer actually asked.",
    "Like a new hire studying a binder of model answers written by your best people.",
    "Like turning a team lead's judgment into an automatic scoring checklist.",
    "Like a salesperson practicing with a coach, under a rule to stay true to the company's style instead of saying whatever wins the deal.",
    "Like a course that improves someone's customer manners but leaves them a little rusty at a technical skill they used to have.",
    "Like a blind taste test: tasters compare two plates without knowing which kitchen made which."
  ],
  labPlain: [
    "Take a small model that can't follow instructions and teach it, first with good examples, then with rankings.",
    "Write a short guideline for good answers, rank answers with a colleague, and measure how often you agree.",
    "Compare each stage of the recipe by blind side-by-side judging.",
    "Note what went wrong in the guideline, the labels, or the training."
  ],
  figurePlain: {
    rlhf: "The three steps of teaching manners. Click each one to see what people do and what the model learns.",
    ranking: "You are the reviewer: put four answers in order, and see what an automatic grader learns from you.",
    klleash: "One slider: how strictly the model is held to its original style while it chases higher scores."
  }
});

Portal.extendPaper("lora", {
  conceptLike: [
    "Like a two-page addendum to a 1,000-page manual instead of a full reprint.",
    "Like the number of adjustment knobs on an add-on: a few knobs are usually enough.",
    "Like deciding which chapters of the manual get an addendum. The paper found two chapters were enough.",
    "Like stapling the approved addendum into the manual: readers see one document and never have to flip back and forth.",
    "Like keeping one master manual plus a thin folder of addenda instead of a warehouse of custom copies.",
    "Like an addendum that can change procedures but can't teach the reader a new language."
  ],
  labPlain: [
    "Customize a model two ways, fully and with a small add-on, and compare quality, memory, time, and file size.",
    "Use the add-on approach to teach a small model a task from your work, such as turning bug reports into a fixed format.",
    "Check whether the add-on beats simply writing a good prompt, and how big the add-on needs to be.",
    "Record the settings that broke and the ones that fixed it."
  ],
  figurePlain: {
    lora: "The big square is the frozen part of the model; the thin bars are the add-on. The numbers show how much smaller the add-on is.",
    adapters: "One shared model with many small add-ons. Add customers and compare the storage needed."
  }
});

Portal.extendPaper("llama", {
  conceptLike: [
    "Like spending longer training a smaller team, because you will pay their salaries for years.",
    "Like publishing a recipe's full ingredient list so anyone could, in principle, cook it.",
    "Like upgrading a car with three proven parts from other manufacturers instead of designing a new engine.",
    "Like a well-run kitchen that serves more meals from the same equipment by improving its workflow.",
    "Like buying a building instead of renting an office: full control, but maintenance is now your job.",
    "Like a project report that includes its energy bill and carbon footprint, not just its results."
  ],
  labPlain: [
    "Run a small open model, find LLaMA's design choices inside it, and try them on your own tiny model.",
    "Check whether a free open model can handle a task from your work, how fast, and with how much memory.",
    "Compare a small model, a bigger one, and the small one with your add-on, alongside the price of a paid service.",
    "Note the setup and licensing hurdles you hit; they are a real cost of open models."
  ],
  figurePlain: {
    llamadiff: "Six differences between LLaMA and earlier GPT-style models. Click a row to see why each change helps.",
    datamix: "What LLaMA read, and in what proportions.",
    rope: "Two arrows that turn as the word position changes. Move both by the same amount and the score stays the same.",
    scale: "How much each model read for its size. LLaMA read far more than the usual sweet spot, on purpose."
  }
});

Portal.extendPaper("flashattention", {
  conceptLike: [
    "Like a fast cook who spends most of the time waiting for ingredients to arrive from the storeroom.",
    "Like doing a big jigsaw puzzle one section at a time on a small table.",
    "Like keeping a running total on a receipt instead of waiting for every item before adding up.",
    "Like redoing a quick sum in your head rather than walking to the archive to fetch the old answer.",
    "Like one trip to the shop for the whole list, instead of a separate trip for each item.",
    "Like a bigger workbench: suddenly you can lay out a whole contract at once instead of page by page."
  ],
  labPlain: [
    "Time two ways of doing the attention step as the text gets longer, and find where the slow way runs out of memory.",
    "See what the faster method does when you train your own model on longer text.",
    "Compare the exact fast method with shortcuts that save time by throwing away information.",
    "Note what tripped up your measurements. Timing things fairly is harder than it looks."
  ],
  figurePlain: {
    memhier: "Three kinds of memory in a computer, from tiny and fast to huge and slow.",
    tiling: "Press Play for each method and watch how often the slow memory is used.",
    flashmem: "Memory needed as the text gets longer. The flat line is one whole graphics chip."
  }
});

/* Attach the figure lines to each station's figures. */
Portal.papers.forEach(function (p) {
  if (!p.figurePlain) return;
  p.figures.forEach(function (f) { if (p.figurePlain[f.w] && !f.plain) f.plain = p.figurePlain[f.w]; });
});
