/* The plain-English layer. Every station opens with this before any jargon:
   - plainTitle / hook: what the paper did, in everyday words
   - bridge: how it connects to what you already know
   - explain: a short, gradual explanation with no unexplained terms
   - everyday: an everyday comparison
   - example: an example from IT project work
   - words: the few terms worth learning now, each with a one-line plain meaning
   - remember: three takeaways
   - labIntro: what the hands-on lab does, in plain words
   Plus Portal.startStory, the nine-step introduction on the Start page. */

Portal.startStory = [
  { title: "AI is a very good guesser",
    text: "The AI tools you hear about, like ChatGPT or Claude, do one thing at their core: they guess what comes next. Give one the start of a sentence and it predicts the most likely next word, then the next, then the next, until it has written a whole answer.",
    everyday: "Your phone keyboard does a tiny version of this when it suggests the next word. A large language model is the same idea, trained on vastly more text and far better at it.",
    widget: "nextword",
    words: [["model", "The guessing machine itself: a program that turns an input into an output."], ["next-token", "Guessing the next piece of text. Every chat AI works this way."]],
    later: ["foundations", "gpt2"] },
  { title: "It learns from examples, not rules",
    text: "Normal software follows rules a developer wrote: if the subject line contains “invoice”, send it to Finance. AI works differently. You show it thousands of examples with the right answers, and it works out the patterns itself.",
    everyday: "Think of how a new support agent learns. Nobody hands them a 10,000-rule manual. They read past tickets with the correct resolution, try some themselves, get corrected, and gradually get a feel for it.",
    example: "Training is that practice. The model guesses, compares its guess with the right answer, and adjusts itself slightly to be less wrong next time, millions of times over.",
    words: [["training", "The practice phase, where the model learns from examples."], ["loss", "A score for how wrong the guesses are. Training tries to lower it."], ["parameter", "One of the many small settings the model adjusts while it learns."]],
    later: ["foundations"] },
  { title: "Words become numbers",
    text: "Computers only work with numbers, so text is converted first. It is chopped into small pieces called tokens, about three quarters of a word each, and every piece becomes a list of numbers.",
    everyday: "Picture a map where every word has a location. “Invoice” and “bill” sit next to each other, “puppy” sits near “dog”, and “giraffe” is far from both. Those map coordinates are the numbers the model works with: similar meanings, similar coordinates.",
    widget: "embeddings",
    words: [["token", "A small piece of text, roughly ¾ of a word. AI services charge per token."], ["embedding", "The list of numbers (the “map location”) that represents a piece of text."]],
    later: ["foundations", "bert"] },
  { title: "Paying attention to the right words",
    text: "To understand a word you often need the other words around it. In “The animal didn't cross the street because it was too tired”, you know “it” means the animal. Change “tired” to “wide” and “it” now means the street.",
    everyday: "Reading a long email thread, you don't weigh every sentence equally. You scan for the lines that matter to your question. AI models do the same, and the mechanism is literally called attention.",
    widget: "attention", opts: { simple: true },
    words: [["attention", "How the model decides which other words matter for understanding each word."], ["transformer", "The design behind almost all modern AI models, built around attention. The T in GPT."]],
    later: ["transformer"] },
  { title: "Reading the whole library first",
    text: "Before a model can do anything useful, it reads an enormous amount of text: websites, books, articles, code. During this phase it just plays the guessing game, billions of times. Along the way it picks up grammar, facts, and a surprising amount of reasoning.",
    everyday: "It's like a general education before a first job. Someone who has read widely learns a new job quickly. This reading phase is called pre-training, and it is the expensive part.",
    example: "GPT-3 read about 300 billion tokens. Reading 300 words a minute, eight hours a day, a person would need more than 4,000 years to get through that much.",
    words: [["pre-training", "The big, expensive first phase where the model reads huge amounts of text."], ["foundation-model", "A model that has done this general reading and can be adapted to many tasks."]],
    later: ["bert", "gpt2"] },
  { title: "A bigger brain, more reading",
    text: "Model size is counted in parameters, the adjustable settings from step 2. Bigger models that read more generally do better, which is why sizes jumped from millions to hundreds of billions in a few years. But bigger also means slower and more expensive to run.",
    everyday: "Think of staffing: a senior expert does better work but costs more per hour. For many jobs, a capable junior who has been trained well is the smarter hire. AI teams make the same trade-off when they choose a model size.",
    example: "In 2022, researchers showed that many big models had not read enough for their size. A smaller model that read four times as much beat models up to seven times bigger.",
    words: [["scaling-laws", "Patterns that predict how much better a model gets as it grows or reads more."], ["open-weights", "Models you can download and run yourself, such as Meta's Llama."]],
    later: ["gpt3", "chinchilla", "llama"] },
  { title: "Teaching it manners",
    text: "A model that has only read the internet is like a brilliant new hire with no manners. Ask a question and it might ramble, make something up, or answer a different question. So it gets extra training on examples of good answers, and people rate its answers so it learns what “helpful” looks like.",
    everyday: "This is onboarding. First the new hire studies model answers from the best agents. Then a coach reviews their drafts side by side: “this one is better than that one”. Over time they learn the team's standards.",
    example: "This step is why ChatGPT felt so different from earlier models. Designing these reviews (what counts as good, who reviews, how consistent reviewers are) is often a project manager's job.",
    words: [["fine-tuning", "Extra training on a smaller, focused set of examples."], ["rlhf", "Training with human feedback: people rate answers and the model learns from the ratings."], ["hallucination", "When AI states something false with confidence."]],
    later: ["instructgpt"] },
  { title: "Making it yours: instructions, an open book, or a course",
    text: "When a company wants AI to do its own work, there are three main options, from cheapest to most involved. Instructions (prompting): explain the task clearly, with a few examples, every time you ask, like briefing a contractor. An open book (retrieval, often called RAG): the system looks up the relevant pages in your documents and hands them to the model with the question, like an open-book exam. A course (fine-tuning): train the model further on your own examples so the behavior sticks, like sending an employee on a training course.",
    everyday: "For a help-desk assistant you would start with good instructions, add the open book so it can quote your knowledge base, and consider a course only if the answers still don't sound like your team.",
    words: [["prompt", "The instructions and text you give the model."], ["rag", "Looking up relevant documents and adding them to the prompt: the open book."], ["lora", "A cheap way to fine-tune: train a small add-on instead of the whole model."]],
    later: ["gpt3", "lora"] },
  { title: "Running it for real users",
    text: "Training happens once. Every time a user asks something afterwards, the model runs again. This is called inference. It is an ongoing cost, charged per token by AI providers, or paid for in hardware if you run models yourself.",
    everyday: "Training is building the factory. Inference is the electricity bill for every product that comes off the line. A popular feature can cost far more to run over a year than it cost to build.",
    example: "Longer questions and longer documents make every answer slower and more expensive. That is why speed and cost targets belong in the project plan from day one.",
    words: [["inference", "Using a trained model to answer a request."], ["latency", "How long the user waits for an answer."], ["cost-per-token", "What each piece of text costs to process."]],
    later: ["flashattention"] }
];

(function () {
  /* Foundations: start with the friendliest figures; the math corner comes last. */
  var f = Portal.paper("foundations");
  var order = ["nextword", "embeddings", "gradient", "overfit", "tokenizer", "logscale", "dotproduct"];
  f.figures.unshift({ w: "nextword", title: "Guess the next word", text: "Pick the word you think comes next, then see how a language model spreads its guesses.", takeaway: "That is the whole trick behind chat AI: guess the next word, add it, guess again. Everything else on this route is about doing that guessing better, cheaper, or more safely." });
  f.figures.sort(function (a, b) { return order.indexOf(a.w) - order.indexOf(b.w); });
  f.figures.forEach(function (x) {
    if (x.w === "logscale") x.title = "Math corner: reading a log scale";
    if (x.w === "dotproduct") x.title = "Math corner: how models measure similarity";
  });
})();

Portal.extendPaper("foundations", {
  plainTitle: "How a computer learns from examples",
  hook: "The handful of ideas every later station builds on, explained with everyday comparisons: guessing, practicing, getting corrected, and the difference between learning and doing.",
  bridge: "This is where the route begins. If you have read the nine steps on the Start page, you have already met every idea here; now you will see each one up close.",
  explain: [
    "A machine-learning model is a guessing machine with lots of adjustable settings. At first the settings are random, so its guesses are bad.",
    "Training fixes that. Show the model an example, let it guess, and score how wrong it was. Then nudge every setting a tiny bit in the direction that would have made the guess better. Repeat millions of times and the guesses get good.",
    "Two things can go wrong. If each nudge is too big, the model overshoots and never settles. If it practices on the same examples for too long, it memorizes them instead of learning the general pattern, and it does badly on anything new.",
    "Once trained, the model answers real requests. That part is called inference, and it is what users and budgets feel every day."
  ],
  everyday: { title: "Learning to throw darts", text: "Your first throws land all over the board. After each one you see how far off you were and adjust your arm a little. Small adjustments get you closer; big ones make you overshoot. And if you only ever practice from one spot, you get great from that spot and poor from anywhere else. Those are training, the learning rate, and overfitting." },
  example: { title: "Sorting support tickets", text: "To teach a system to sort tickets into Billing, Bug, or Feature request, you give it 2,000 past tickets with the right category. It guesses, gets corrected, and adjusts until it sorts well. Then you test it on 200 tickets it has never seen. That last score is the honest one to report to stakeholders." },
  words: [["model", "The guessing machine: settings plus a recipe for turning input into output."], ["parameter", "One adjustable setting inside the model. Big models have billions."], ["training", "Practice with an answer key, repeated millions of times."], ["loss", "One score for how wrong the guesses are. Lower is better."], ["overfitting", "Memorizing the practice examples instead of learning the pattern."], ["inference", "Using the trained model to answer real requests."]],
  remember: ["A model learns from examples by guessing, getting scored, and adjusting.", "Always judge a model on examples it has never seen.", "Training is a one-time cost; answering requests (inference) is an ongoing one."],
  labIntro: "You set up your free tools and watch learning happen: Claude Code writes a small notebook, you run it in Google Colab, and you see how text turns into tokens and how a model's error shrinks as it practices. No Python needed; read the notes beside the code, not the code itself."
});

Portal.extendPaper("transformer", {
  plainTitle: "How AI learned to read a whole sentence at once",
  hook: "In 2017, Google researchers found a way for AI to look at every word in a sentence at the same time and decide which words matter to each other. That idea, called attention, is inside almost every AI model today.",
  bridge: "At Station 00 you saw how a model learns from examples. This station is about the design of the model itself: how it reads text.",
  explain: [
    "Before 2017, language models read text one word at a time, left to right, as if through a keyhole. By the end of a long sentence they had partly forgotten the beginning, and they were slow to train because each word had to wait for the one before it.",
    "The Transformer reads the whole sentence at once. For every word it asks: which other words help me understand this one? In “the animal didn't cross the street because it was too tired”, the word “it” pays most attention to “animal”.",
    "Because every word is handled at the same time, the work can be spread across the thousands of small processors in a graphics chip (a GPU). Training became much faster, which made today's huge models possible.",
    "There is a catch. Every word looks at every other word, so doubling the length of the text roughly quadruples the work. That is why AI tools limit how much text you can send at once."
  ],
  everyday: { title: "A meeting where everyone hears everyone", text: "Older models worked like a game of telephone: the message passes from person to person and details get lost. A Transformer is like a meeting where everyone hears everything at once and each person focuses on the comments relevant to them. It's faster and loses less, but the bigger the meeting, the more cross-talk there is to process." },
  example: { title: "The 50-page contract", text: "When you paste a 50-page contract into an AI tool and it refuses or slows down, you have hit this limit, called the context window. On a project it becomes a design decision: send the whole document, or only the relevant sections? Station 04 and your app's chunking feature answer it." },
  words: [["transformer", "The model design behind almost all modern AI, built around attention."], ["attention", "How the model decides which other words matter for each word."], ["context-window", "The most text the model can consider at once."], ["gpu", "The chip that does many calculations side by side; the workhorse of AI."], ["positional-encoding", "A way of telling the model the order of the words, since attention alone ignores order."]],
  remember: ["Transformers read all the words at once and use attention to connect related words.", "That parallel design made training fast enough for today's big models.", "Longer text costs much more to process, which is why context windows have limits."],
  labIntro: "You build a tiny Transformer and train it on Shakespeare's plays, then on text from your own world. In about 15 minutes on a free GPU it goes from random letters to recognizable words. You'll see what it learns, what it memorizes, and what breaks when you remove parts of it."
});

Portal.extendPaper("bert", {
  plainTitle: "Teaching AI to understand text by filling in blanks",
  hook: "Google's BERT learned language by playing fill-in-the-blank on millions of sentences. It could then learn new jobs, like sorting tickets or finding answers in a document, from only a few thousand examples.",
  bridge: "Station 01 gave us the Transformer design. BERT asked: what if it first reads a huge amount of text, so it understands language before we give it any particular job?",
  explain: [
    "BERT reads billions of words from books and Wikipedia. Along the way, random words are hidden and BERT has to guess them from the words on both sides of the gap. No human labeling is needed: the hidden word is the answer.",
    "To get good at this game, BERT has to learn grammar, word meanings, and plenty of facts. That general understanding is the valuable part.",
    "Then comes the cheap part. To make BERT sort support tickets, you show it a few thousand labeled tickets. It reuses everything it already knows and only learns the new job. This two-step pattern, general reading first and a short specialization second, became the standard way to build AI.",
    "BERT understands text but does not write it. It is still widely used for search, sorting, and finding similar documents, because it is small, fast, and cheap."
  ],
  everyday: { title: "Hiring a well-read graduate", text: "Training a model from scratch for every task is like hiring someone who can't read and teaching them everything for one job. BERT is like hiring a graduate who has read the whole library: each new role needs only a short orientation." },
  example: { title: "Routing 2,000 tickets a day", text: "Your team wants to route 2,000 support tickets a day into eight queues. A BERT-style model trained on a few thousand past tickets can do this quickly and cheaply, and you can measure exactly how often it routes correctly. For jobs where the answer is a label, it is often a better fit than a big chat AI." },
  words: [["pre-training", "The big general reading phase, done once."], ["fine-tuning", "A short extra training phase that teaches one specific job."], ["mlm", "BERT's fill-in-the-blank game: hide words, then guess them."], ["embedding", "A list of numbers that captures the meaning of text; used for search."], ["encoder", "The part of a Transformer that reads and understands, without writing."]],
  remember: ["BERT learned language by filling in blanks, using the words on both sides.", "General reading first, short specialization second: this pattern is now everywhere.", "When the answer is a label or a search result, a small model like BERT is often enough."],
  labIntro: "You try the real BERT on fill-in-the-blank sentences, then teach it to sort movie reviews and some text from your own world. You compare it with simple keyword rules to see whether the AI is worth it, the most important question in any AI project."
});

Portal.extendPaper("gpt2", {
  plainTitle: "Teaching AI to write by guessing the next word",
  hook: "OpenAI trained a model to do one thing, guess the next word, on 8 million web pages. It started doing tasks nobody trained it for, like summarizing and answering questions, because those patterns appear on the web.",
  bridge: "BERT learned to understand by filling in blanks. GPT-2 took the other path: learn to write, one word after another.",
  explain: [
    "GPT-2 plays a simpler game than BERT: read the start of some text and guess the next word. Then add that word and guess the next. Repeat, and you get whole paragraphs.",
    "The training text mattered. Instead of scraping the whole web, the team collected pages that people had found useful enough to share and upvote on Reddit. Better reading material produced a better writer.",
    "The surprise: end an article with “TL;DR:” (internet shorthand for “in short”) and GPT-2 writes a summary, because a summary is what usually follows “TL;DR:” online. It picked up tasks just by learning patterns in text.",
    "How the next word is picked matters too. Always taking the single most likely word gives dull, repetitive text. Allowing some randomness gives more varied text but more mistakes. The setting that controls this is called temperature."
  ],
  everyday: { title: "Autocomplete that read the internet", text: "Your phone suggests the next word based on what you've typed. GPT-2 is autocomplete that has read millions of web pages. Start a recipe and it continues with ingredients; start a line with “Q:” and it continues with an answer, because it has seen those patterns thousands of times." },
  example: { title: "Choosing how creative the AI should be", text: "When your team builds a feature that writes text, someone has to choose the temperature. A support reply should be consistent, so low; brainstorming product names can be more creative, so higher. It's a product decision worth writing down and testing." },
  words: [["next-token", "Guessing the next piece of text: the core of every chat AI."], ["decoder", "The part of a Transformer that writes text one piece at a time."], ["temperature", "A setting for how random or predictable the writing is."], ["zero-shot", "Asking a model to do a task with no examples, just the request."], ["staged-release", "Releasing a model gradually to watch for misuse."]],
  remember: ["GPT-2 writes by guessing the next word, over and over.", "Better reading material made a better model, so data quality is a project concern.", "Settings like temperature change what users see and should be chosen deliberately."],
  labIntro: "You run the real GPT-2, score how well it predicts text, try its “TL;DR” summary trick, and teach it to write in the style of your own documents. You compare different word-picking settings and rate the results yourself."
});

Portal.extendPaper("gpt3", {
  plainTitle: "Making it huge: AI that learns from a few examples",
  hook: "OpenAI made GPT-2's recipe more than 100 times bigger. The result could pick up a new task from a few examples written into the request, with no retraining. That is why “prompting” became a skill.",
  bridge: "GPT-2 showed that guessing the next word teaches a lot. GPT-3 asked: what happens if the model and its reading list get much, much bigger?",
  explain: [
    "GPT-3 has 175 billion adjustable settings (parameters), compared with GPT-2's 1.5 billion, and it read about 300 billion tokens of text.",
    "At that size, something new appeared. Show it three English words with their French translations, then a fourth English word, and it writes the French. Nobody retrained it; it picked up the pattern from the request itself.",
    "This is called few-shot learning, where each example is a “shot”. Zero-shot means no examples; one-shot means one. Bigger models got much better at using examples.",
    "It also changed the business. Instead of every company training its own model, one big model could be rented over the internet, and products were built by writing good instructions. Every example in a request is paid for every time, though."
  ],
  everyday: { title: "Showing a temp three filled-in forms", text: "You hand a temp three completed expense forms and say “do the rest like these”. A capable temp gets it at once; a less experienced one needs a training course. GPT-3 was the first model capable enough for the three-examples approach to work reliably." },
  example: { title: "Tagging customer emails", text: "You want AI to tag customer emails as Complaint, Question, or Praise. With GPT-3-style prompting, you write a short instruction and three example emails with their tags, then the new email. You can try this in an afternoon, before anyone writes training code, which makes it the right first experiment for most AI projects." },
  words: [["prompt", "The instructions, examples, and question you send to the model."], ["few-shot", "Including a few worked examples in the prompt."], ["icl", "The model picking up a task from examples in the prompt, without retraining."], ["parameter", "An adjustable setting in the model; GPT-3 has 175 billion."], ["api-model", "A model you rent over the internet and pay for per use."]],
  remember: ["Very large models can learn a task from a few examples in the request.", "Prompting is the fastest, cheapest first experiment on any AI project.", "Examples are paid for on every request, so at high volume other options can be cheaper."],
  labIntro: "GPT-3 can't be downloaded, so you test its big idea on free open models of three sizes: does adding examples to the request help, and does it help more for bigger models? Then you try it on a task of your own and compare it with your BERT model from Station 02."
});

Portal.extendPaper("chinchilla", {
  plainTitle: "Spending the budget wisely: model size versus reading time",
  hook: "DeepMind showed that most big models were the wrong shape: too big, and not trained on enough text. With the same budget, a model a quarter of the size that read four times as much beat them.",
  bridge: "GPT-3 showed that bigger is better. Chinchilla asked a project manager's question: with a fixed budget, what is the best way to spend it?",
  explain: [
    "Training costs computing power, roughly in proportion to the model's size times the amount of text it reads. With a fixed budget you choose: a bigger model that reads less, or a smaller model that reads more.",
    "Earlier advice said to put most of the budget into size, so companies built giant models that read relatively little.",
    "The Chinchilla team trained over 400 models of different sizes and reading amounts, and found the earlier advice was wrong. Size and reading should grow together: about 20 tokens of reading for every parameter.",
    "Their 70-billion-parameter model, Chinchilla, used the same budget as a 280-billion model and beat it. Being smaller, it was also cheaper to run for every user, every day."
  ],
  everyday: { title: "A training budget for a new team", text: "You have a budget for 1,000 training days. You could hire 1,000 people and train each for one day, or hire 250 people and train each for four days. The smaller, better-trained team usually does better work, and costs less to keep on payroll." },
  example: { title: "Sanity-checking a proposal", text: "This paper gives you a back-of-envelope formula: training cost ≈ 6 × model size × amount of text. If your team proposes training a custom model, you can check the budget in minutes with the toolkit's calculator, and ask whether there is even enough text to justify that size." },
  words: [["compute-optimal", "The best split between model size and reading for a given budget."], ["tokens-per-param", "How much text the model read per setting; about 20 is the sweet spot."], ["flops", "A count of calculations, used to measure training cost."], ["scaling-laws", "Patterns that predict how much a model improves with more size, data, or budget."]],
  remember: ["For a fixed budget, grow model size and training text together, at about 20 to 1.", "Many famous big models were too big for how much they had read.", "A smaller, well-trained model is cheaper to run, and running costs add up."],
  labIntro: "You run a miniature version of the study: train several small models on the same budget but with different sizes and see which wins. Then you check how big a model your own text could support, and compare three ways of spending the same budget."
});

Portal.extendPaper("instructgpt", {
  plainTitle: "Teaching AI manners with human feedback",
  hook: "OpenAI took GPT-3, showed it examples of good answers, and had people rank its responses so it learned what “helpful” means. People preferred a version 100 times smaller over the original. This is the recipe behind ChatGPT.",
  bridge: "By Station 05 we know how to build a capable model. But capable is not the same as helpful: GPT-3 often rambled, made things up, or ignored the question.",
  explain: [
    "A model trained only to continue internet text doesn't know it is meant to help. Ask it a question and it might continue with more questions, because that also happens on the internet.",
    "Step one: people write excellent answers to a few thousand real requests, and the model is trained to imitate them.",
    "Step two: the model writes several answers to the same request, and people rank them from best to worst. A second model learns to predict those rankings and becomes an automatic grader.",
    "Step three: the model practices on thousands of new requests, the grader scores each answer, and the model shifts toward higher scores. A safeguard stops it from gaming the grader, for example with long, flattering answers the grader happens to like."
  ],
  everyday: { title: "Onboarding a new support agent", text: "First the new agent studies replies written by your best agents. Then a team lead compares their drafts side by side and says which is better. Eventually the lead's judgment becomes a checklist the agent practices against. If the checklist rewards length, the agent learns to write long replies, so you keep checking with real customers." },
  example: { title: "Who defines a good answer?", text: "If your team builds an assistant, someone has to define what a good answer is, write review guidelines, choose and train reviewers, and check that reviewers agree with each other. That work runs like any operations program, and project and program managers often own it." },
  words: [["rlhf", "Training with human feedback: people rank answers and the model learns from the rankings."], ["sft", "Training on examples of excellent answers written by people."], ["reward-model", "An automatic grader that predicts which answer people would prefer."], ["reward-hacking", "When the model finds tricks to score well without actually being better."], ["hallucination", "When AI states something false with confidence."]],
  remember: ["Helpful behavior is taught after the reading phase, using human examples and rankings.", "Quality depends on clear guidelines and consistent reviewers: operations work.", "Watch for the model gaming its grader, and check with real people regularly."],
  labIntro: "You take a small free model that can't follow instructions and teach it, first with examples of good answers, then with rankings. Then you run your own mini feedback program: write a guideline, rank answers with a colleague, and measure how often you agree."
});

Portal.extendPaper("lora", {
  plainTitle: "Customizing AI cheaply with a small add-on",
  hook: "Instead of retraining a whole model to specialize it, Microsoft researchers froze the original and trained a tiny add-on beside it. For GPT-3 that meant training 10,000 times fewer settings, with equally good results.",
  bridge: "InstructGPT showed how valuable extra training on top of a big model is. LoRA made that extra training cheap enough for any team.",
  explain: [
    "Specializing a model usually means adjusting all of its settings. For a big model that needs powerful hardware, and it produces a full copy of the model, hundreds of gigabytes, for every task or customer.",
    "LoRA leaves the original model untouched and adds small extra pieces that learn the adjustment. The add-on can be just a few megabytes.",
    "It works because specializing for a task doesn't need to change everything; a small, focused adjustment captures most of it.",
    "Because the add-ons are tiny, one base model can serve many customers or tasks, each with its own add-on, and switching or rolling back is as simple as swapping a file."
  ],
  everyday: { title: "An addendum instead of a reprint", text: "Your company has a 1,000-page operations manual, and each client needs small changes. Instead of reprinting a custom manual for every client, you give each one a two-page addendum. The manual stays the same, addenda are cheap, and switching clients means switching addenda." },
  example: { title: "Fifty clients, one model", text: "Your company serves 50 enterprise clients who each want the AI to use their terminology and templates. With LoRA, the team trains 50 small add-ons on one shared model. You then plan versioning, testing per client, and rollback, much like managing configuration releases." },
  words: [["fine-tuning", "Extra training to specialize a model."], ["lora", "Training a small add-on instead of the whole model."], ["adapter", "The small add-on file that plugs into a base model."], ["full-fine-tuning", "Adjusting every setting in the model: powerful but expensive."], ["checkpoint", "A saved copy of a model's settings."]],
  remember: ["LoRA trains a small add-on and leaves the big model unchanged.", "Customization becomes cheap: experiments cost little and files are tiny.", "One base model can serve many clients, each with its own add-on."],
  labIntro: "You fine-tune a model two ways, fully and with LoRA, and compare quality, memory, time, and file size. Then you use LoRA to teach a small model a task from your work, such as turning bug reports into a fixed format, and compare it with simply writing a good prompt."
});

Portal.extendPaper("llama", {
  plainTitle: "Smaller, open models anyone can run",
  hook: "Meta trained models from 7 to 65 billion parameters on public data only, and trained them far longer than usual. The 13-billion version beat the 175-billion GPT-3 on most tests and could run on a single graphics card.",
  bridge: "Chinchilla showed how to spend a training budget. LLaMA added the running cost: a model is built once but used millions of times, so make it small and train it longer.",
  explain: [
    "Chinchilla's rule finds the best model for a training budget. But after training, every user request costs money too, and over a product's life that running cost usually dominates.",
    "So Meta deliberately trained smaller models on much more text than the rule suggests. Training cost more, but the finished models were small, fast, and cheap to run.",
    "Meta used only publicly available text (web pages, Wikipedia, books, code) and shared the models with researchers. They spread quickly and started a wave of open models anyone can download and run.",
    "Open models give you control over your data, costs, and customization. In return, you run the servers, handle security, and follow the license terms."
  ],
  everyday: { title: "A car built for running costs", text: "One carmaker asks: what's the best car our factory budget can build? Another asks: what car will be cheapest to drive every day for ten years? The second spends longer tuning a smaller engine. LLaMA is the second carmaker." },
  example: { title: "Data that can't leave the building", text: "A client can't send data to an outside AI service for compliance reasons. An open model running on the client's own servers may be the answer. You would compare its quality, cost, and effort with a rented model on the same test set, then check the license with legal." },
  words: [["open-weights", "A model you can download and run on your own hardware."], ["inference", "Using a trained model to answer requests: the ongoing cost."], ["quantization", "Storing a model's numbers with less precision so it runs on smaller hardware."], ["data-mix", "The proportions of different sources in the training text."], ["foundation-model", "A general model that many products build on."]],
  remember: ["If a model will serve many users, train it smaller and longer: running costs dominate.", "Open models trade convenience for control over data, cost, and customization.", "“Open” still comes with a license, so check what it allows."],
  labIntro: "You run a small open model, find LLaMA's design choices inside it, and try those choices on your tiny model from Station 01. Then you check whether an open model could handle a task from your work, how fast it runs, and how it compares with the alternatives."
});

Portal.extendPaper("flashattention", {
  plainTitle: "Making AI faster by moving less data",
  hook: "Stanford researchers found that AI's attention step was slow mainly because data was shuttled back and forth inside the graphics chip. Reorganizing the work to keep data close made it several times faster and allowed much longer documents, with exactly the same results.",
  bridge: "Station 01 introduced attention and its cost with long text. This last station shows how engineering, rather than a new model, removed much of that cost.",
  explain: [
    "A graphics chip has a tiny amount of very fast memory right next to its processors, and a large amount of slower memory further away.",
    "The standard way of computing attention wrote a huge in-between table to the slow memory and read it back several times. The processors spent much of their time waiting for data.",
    "FlashAttention splits the work into small tiles that fit in the fast memory, finishes each tile there, keeps a running total, and never writes the huge table at all. It even recalculates some numbers instead of storing them, because recalculating is quicker than fetching.",
    "The answers are exactly the same, just faster and with far less memory. Work like this is a big reason AI tools now accept whole documents and keep getting cheaper."
  ],
  everyday: { title: "A small desk and a filing cabinet down the hall", text: "You're doing a big calculation. Your desk holds a few pages; the filing cabinet is down the hall. The old way walked every page to the cabinet and back. The new way brings a few pages at a time, finishes everything possible at the desk, keeps a running tally, and files only the final answer. Same result, far less walking." },
  example: { title: "“The AI feature is too slow”", text: "When engineers say an AI feature is too slow, the fix is often not a different model but better plumbing: shorter prompts, caching, batching requests, or faster software underneath. Ask for measurements of where the time goes before deciding anything." },
  words: [["latency", "How long a user waits for a response."], ["throughput", "How many requests the system handles per second."], ["memory-bound", "When the chip is waiting for data instead of calculating."], ["kv-cache", "Memory the model uses to remember earlier text while it writes; grows with length."], ["flashattention", "A faster, exact way of computing attention that keeps data in fast memory."]],
  remember: ["Much of AI's slowness is waiting for data, not calculating.", "Engineering can make AI faster and cheaper without changing its answers.", "Speed and cost targets belong in the project plan; measure before optimizing."],
  labIntro: "You time two ways of computing attention on a free GPU as the text gets longer, and find the length where the slow way runs out of memory. Then you see what faster attention does when training your own model on longer text."
});
