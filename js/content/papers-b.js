/* Stations 03–05: GPT-2, GPT-3, Chinchilla. */
Portal.addPaper({
  id: "gpt2", num: 3, short: "GPT-2", year: 2019, stage: "pretrain", hours: 10,
  title: "Language Models are Unsupervised Multitask Learners",
  authors: "Radford, Wu, Child, Luan, Amodei, Sutskever", org: "OpenAI", arxiv: null,
  url: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
  oneLiner: "Train a large decoder-only Transformer to predict the next word on 40 GB of curated web text, and it starts doing tasks like translation, summarization, and question answering without being trained for any of them.",
  story: {
    problem: "Models were narrow experts: each task needed its own labeled dataset and fine-tuning run. That does not scale to the thousands of tasks people actually want done.",
    idea: "Treat every task as text continuation. A model that predicts the next token well on diverse, high-quality text ([[webtext|WebText]]) must implicitly learn the tasks that appear in that text. Scale the decoder to 1.5B parameters and test it [[zero-shot]].",
    result: "State of the art on 7 of 8 language-modeling benchmarks without any fine-tuning, plus non-trivial zero-shot reading comprehension, summarization, and translation. Every task improved steadily with model size."
  },
  analogy: "Someone who has read millions of web pages has seen countless “Q: … A: …” pairs, “TL;DR:” summaries, and side-by-side translations. Show them the start of a pattern and they continue it.",
  whyPM: "GPT-2 introduced the interface you use today: describe the task in text and the model continues it. It also raised the questions you will own as a PM: training data curation matters as much as model size, generation needs deliberate [[sampling]] settings, and releases carry misuse risk. OpenAI's [[staged-release|staged release]] started the open-versus-closed debate that still shapes vendor choices.",
  figures: [
    { w: "sampling", title: "Choosing the next word: temperature, top-k, top-p", text: "The model outputs a probability for every token. How you pick from that list changes the character of the text. Try the presets, then sample.", takeaway: "[[greedy|Greedy decoding]] is repetitive; unrestricted sampling can go off the rails. Products tune [[temperature]] and [[top-p]] per feature: low for support answers, higher for brainstorming." },
    { w: "zeroshot", title: "Tasks hiding in plain text", text: "GPT-2 was never trained on these tasks. The right prompt format, borrowed from how people write on the web, invites the behavior.", takeaway: "Prompt design starts here: the format of a prompt signals which kind of text the model should continue." }
  ],
  concepts: [
    { name: "Decoder-only language model", plain: "One stack that reads left to right and predicts the next token.", how: "GPT-2 is the Transformer's [[decoder]] without cross-attention, trained on [[next-token|next-token prediction]] at every position. Layer normalization moved to the start of each block, which helps deeper models train.", product: "Every chat model is this design plus more scale and alignment. Generation is [[autoregressive]]: one token at a time, which is why answers stream in and long answers take longer." },
    { name: "Data quality: WebText", plain: "Curate the web instead of scraping all of it.", how: "Common Crawl was too noisy. Instead, the team took outbound links from Reddit posts with at least 3 karma: 45 million links, cleaned and deduplicated to about 8 million documents (40 GB). Wikipedia was removed to avoid overlap with test sets.", product: "A human-voted quality filter beat raw volume. Data curation is a product decision: which sources, what quality bar, what exclusions." },
    { name: "Zero-shot task transfer", plain: "Doing tasks with no task-specific training, just by phrasing the input well.", how: "Tasks are induced by the prompt format: “TL;DR:” for summaries, “english sentence = french sentence” pairs for translation, Q/A pairs for questions. No weights change.", product: "The seed of prompting as a product interface. Zero-shot quality in 2019 was weak for most tasks, which is why GPT-3's few-shot jump mattered." },
    { name: "Byte-level BPE", plain: "A tokenizer that can represent any text without unknown words.", how: "[[bpe|BPE]] runs on raw bytes rather than Unicode characters, with rules that stop merges across character types. Vocabulary of 50,257 tokens; [[context-window|context window]] of 1,024 tokens.", product: "No input can break the tokenizer, but some languages and emoji cost many tokens each. Byte-level BPE is still widely used." },
    { name: "The scaling trend", plain: "Bigger models were better on every task and had not stopped improving.", how: "Four sizes: 117M, 345M, 762M, and 1,542M parameters. Even the largest still underfit WebText; [[perplexity]] kept falling with size.", product: "This observation, more than any benchmark, led OpenAI to bet on scale with GPT-3." },
    { name: "Sampling and staged release", plain: "How text gets generated, and how the model got released.", how: "Showcase samples used [[top-k]] sampling with k = 40. Concerned about spam and fake news, OpenAI released the small model in February 2019 and the full 1.5B model in November 2019.", product: "Two lasting PM questions: which decoding settings suit our use case, and what misuse could this enable? Responsible release is now a standard part of AI launches." }
  ],
  terms: ["decoder", "next-token", "language-modeling", "autoregressive", "causal-mask", "webtext", "zero-shot", "perplexity", "sampling", "temperature", "top-k", "top-p", "greedy", "logits", "context-window", "staged-release", "bpe"],
  code: {
    title: "Generating text one token at a time (shapes simplified)", lang: "Python (PyTorch)",
    lines: [
      ["ids = tokenizer.encode('The best way to learn AI is to')", "Turn the prompt into token IDs."],
      ["for _ in range(30):", "Generate 30 new tokens, one at a time ([[autoregressive]])."],
      ["    logits = model(ids)[-1]", "Run the model and keep the scores for the next position only: the [[logits]]."],
      ["    logits = logits / temperature", "[[temperature|Temperature]]: below 1 sharpens the distribution, above 1 flattens it."],
      ["    top = torch.topk(logits, k=40)", "[[top-k|Top-k]]: keep only the 40 highest-scoring tokens."],
      ["    probs = torch.softmax(top.values, dim=-1)", "Turn those scores into probabilities."],
      ["    choice = torch.multinomial(probs, 1)", "Roll a weighted die to pick one."],
      ["    next_id = top.indices[choice]", "Map the pick back to a real token ID."],
      ["    ids = torch.cat([ids, next_id])", "Append it and loop: each new token becomes context for the next."],
      ["print(tokenizer.decode(ids))", "Turn the IDs back into text."]
    ]
  },
  numbers: [
    { value: "1.5B", label: "[[parameter|Parameters]] in the largest GPT-2: 48 layers, hidden size 1,600" },
    { value: "40 GB", label: "of [[webtext|WebText]], about 8 million web pages" },
    { value: "7 of 8", label: "language-modeling benchmarks where it set a record without fine-tuning" },
    { value: "1,024", label: "tokens of [[context-window|context]], double the original GPT's" }
  ],
  lab: {
    summary: "Run the real GPT-2, measure it the way the paper did, and fine-tune it on your own text.",
    time: "8–10 hours", compute: "Free Colab T4 GPU", tools: "Hugging Face transformers and datasets",
    steps: [
      { name: "Reproduce", goal: "Measure GPT-2's perplexity on WikiText-2 and test the paper's zero-shot tricks.",
        do: ["Load GPT-2 small (124M) and compute [[perplexity]] on the WikiText-2 test set.", "Compare with the paper's Table 3. Your number will differ; find out why.", "Try “TL;DR:” on three news articles and the Q:/A: format on ten trivia questions."],
        prompt: "Load 'gpt2' (124M) with Hugging Face transformers. (1) Compute perplexity on the WikiText-2 raw test set using a sliding window with stride 512 and context 1024; explain the method in a markdown cell. Repeat with 'gpt2-medium' if time allows, and put both in a table next to the numbers reported in Table 3 of the GPT-2 paper. (2) Zero-shot summarization: for 3 articles I paste, append '\\nTL;DR:' and generate 60 tokens with top-k=2 sampling, as in the paper. (3) Zero-shot QA: for 10 trivia questions I provide, format each as 'Q: ... A:' and generate greedily up to 10 tokens. Report exact-match accuracy.\nAcceptance criteria: runs in under 20 minutes on a T4.",
        observe: ["Why your perplexity differs: the paper used its own detokenization and evaluation setup.", "How often zero-shot answers are confidently wrong."],
        done: "A perplexity table with your numbers next to the paper's, and an explanation of the gap." },
      { name: "Your own data", goal: "Fine-tune GPT-2 to write in the style of your own corpus.",
        ideas: ["Release notes, then generate notes for a new feature", "Your blog or LinkedIn posts", "Product descriptions from a public e-commerce dataset", "Answers from your help center"],
        do: ["Prepare 200 KB to 2 MB of text, with documents separated by an end-of-text marker.", "Fine-tune GPT-2 small for one to three epochs.", "Generate from the same prompts before and after fine-tuning."],
        prompt: "Fine-tune 'gpt2' on a text file I upload, where documents are separated by a line containing only '<|endoftext|>'. Use the Hugging Face Trainer, block size 512, batch size 4 with gradient accumulation 4, lr 5e-5, 2 epochs, fp16, and 10% held out for validation. Report validation perplexity before and after fine-tuning. Then generate 3 samples for each of 5 prompts I give you from both the original and the fine-tuned model (temperature 0.8, top-p 0.9), shown side by side.",
        observe: ["Validation perplexity before versus after.", "Outputs that copy training documents word for word."],
        done: "Side-by-side samples and a perplexity drop you can explain." },
      { name: "Baselines", goal: "Compare decoding strategies and model sizes on the same prompts.",
        table: [["Baseline", "What it tells you", "Expect"], ["Greedy decoding", "The model's single most likely continuation", "Repetition loops after a few sentences"], ["Top-k = 40, temperature 1.0", "The paper's showcase setting", "Varied, sometimes off-topic"], ["Top-p = 0.9, temperature 0.8", "A common modern default", "Fluent, with fewer derailments"], ["GPT-2 small vs. medium vs. your fine-tuned small", "Size versus domain data", "The fine-tuned small model often wins on your domain"]],
        prompt: "For 5 prompts, generate 150 tokens with greedy decoding, top-k=40 (temperature 1.0), and top-p=0.9 (temperature 0.8), using gpt2, gpt2-medium, and my fine-tuned model. Compute a repetition score (share of repeated 3-grams) and distinct-2 for every output. Show a summary table, then let me blind-rate a random sample of outputs from 1 to 5 in a simple input loop, and add my average ratings to the table.",
        done: "A table combining automatic scores with your own blind ratings, and a recommended default setting." },
      { name: "Failure log", goal: "Record how generation and fine-tuning went wrong.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Endless repetition", "Greedy or low-temperature decoding finds a loop", "Use top-p sampling; add a repetition penalty"], ["Fine-tuned model forgets general knowledge", "Catastrophic forgetting from too many epochs or too high a learning rate", "Fewer epochs, a lower learning rate, or mix in general text"], ["Outputs copy training text", "Memorization of a small dataset", "More data, fewer epochs; check with exact-match search"], ["Perplexity far from the paper's", "Different tokenization, detokenization, or no sliding window", "Match the evaluation method before comparing numbers"], ["Output drifts off the prompt topic", "The 124M model is small and the prompt short", "Longer, more specific prompts, or a larger model"]],
        done: "Failure entries, including one about mismatched evaluation methods." }
    ]
  },
  pm: [
    { q: "What should the model learn from?", a: "GPT-2's main innovation was data curation, not architecture. Ask what quality filter your training or fine-tuning data went through." },
    { q: "Which decoding settings should we ship?", a: "Temperature and top-p change tone, accuracy, and variety. Make them a deliberate, tested setting for each feature." },
    { q: "What could go wrong if we release this?", a: "GPT-2 made misuse analysis part of launches. Write down plausible misuse before launch, not after." },
    { q: "Is zero-shot good enough?", a: "Rarely on its own for production. Treat it as a quick feasibility test, then add examples (Station 04) or fine-tune (Station 07)." }
  ],
  reading: [
    "Read the abstract and Section 1: the case for general systems over narrow experts.",
    "Read Section 2.1 on WebText and Section 2.2 on byte-level BPE.",
    "Look at Figure 1: zero-shot performance rising with model size on four tasks.",
    "Skim Section 3; focus on Table 3 (language modeling) and the summarization results.",
    "Read Section 4 on memorization and overlap with test data: a model for honest evaluation.",
    "Read OpenAI's post <a href=\"https://openai.com/index/better-language-models/\" target=\"_blank\" rel=\"noopener\">Better Language Models and Their Implications</a> for the release discussion."
  ],
  quiz: [
    { q: "How does GPT-2 summarize text without being trained to?", options: ["A hidden summarization module", "The prompt format (like “TL;DR:”) makes a summary the likely continuation", "It was fine-tuned on news", "It searches the web"], answer: 1, why: "Everything is next-token prediction. The prompt sets up a pattern the model saw on the web." },
    { q: "Why build WebText from Reddit links?", options: ["Reddit text is shortest", "Upvoted links act as a cheap human quality filter", "It was the only free data", "To include Reddit comments"], answer: 1, why: "Three or more karma signaled that people found the page useful, which beat raw Common Crawl on quality." },
    { q: "Your support bot keeps repeating the same sentence. What is a likely cause?", options: ["Temperature too high", "Greedy or very low-temperature decoding", "Too many parameters", "Byte-level BPE"], answer: 1, why: "Greedy decoding falls into loops. Sampling with top-p and a repetition penalty helps." },
    { q: "What did the scaling results suggest?", options: ["1.5B was the useful limit", "Bigger models kept getting better, and even the largest underfit its data", "Smaller models were better at zero-shot", "Size did not matter"], answer: 1, why: "Every size underfit WebText and quality rose steadily with size: the bet behind GPT-3." }
  ],
  next: "GPT-2 hinted that scale unlocks general ability. OpenAI's next step was to make the model over 100 times bigger and ask a sharper question: can it learn a new task from a few examples in the prompt alone?"
});

Portal.addPaper({
  id: "gpt3", num: 4, short: "GPT-3", year: 2020, stage: "scale", hours: 8,
  title: "Language Models are Few-Shot Learners",
  authors: "Brown et al.", org: "OpenAI", arxiv: "2005.14165",
  oneLiner: "Scaled GPT-2's recipe to 175 billion parameters and showed that a large enough model can learn a new task from a few examples in its prompt, with no retraining. Prompting became a product interface.",
  story: {
    problem: "Even with pre-training, every new task needed thousands of labeled examples and a fine-tuning run. People learn new tasks from a short instruction and a couple of examples; models could not.",
    idea: "Keep the architecture and scale it: 175B parameters trained on 300B tokens. Then test [[icl|in-context learning]]: give the model a task description and zero, one, or a few examples inside the prompt, and let it continue. No weights change.",
    result: "[[few-shot|Few-shot]] GPT-3 matched or approached fine-tuned systems on several benchmarks (71.2% on TriviaQA), and the gap between zero-shot and few-shot widened as models grew. People could spot its generated news articles only about 52% of the time, close to chance."
  },
  analogy: "Fine-tuning is sending an employee on a week-long course. In-context learning is showing them three examples on a sticky note before they start. GPT-3 was the first model big enough for the sticky note to work.",
  whyPM: "GPT-3 created the API-first AI business: one [[foundation-model|foundation model]], many products built by writing prompts. You inherit its trade-offs every day: prompts are fast to iterate but cost tokens on every call, examples in the prompt help a lot, and quality depends heavily on model size, which drives cost and latency.",
  figures: [
    { w: "fewshot", title: "Build a few-shot prompt", text: "The paper's own example is translation: a task description, a few “English => French” pairs, then the word to translate. Add or remove examples and watch the prompt, and its cost, change.", takeaway: "Examples teach the format and the task, and they are paid for on every request. At high volume a fine-tuned smaller model can be cheaper (Station 07)." },
    { w: "scale", opts: { mode: "params" }, title: "The jump in scale", text: "Parameters for the models on this route; each grid line is 10× the last. Switch to training tokens and tokens per parameter for a preview of Station 05.", takeaway: "GPT-3 was more than 100× GPT-2. It was also trained on relatively few tokens for its size, which Chinchilla later showed was a costly choice." }
  ],
  concepts: [
    { name: "In-context learning", plain: "Learning a task from examples in the prompt, without changing any weights.", how: "Pre-training text is full of repeated patterns. Large models learn to recognize a pattern from its first few instances and continue it. The paper frames this as learning that happens inside a single forward pass.", product: "This is why prompts with examples work. It also means the “learning” vanishes with the prompt: nothing is stored, and every request pays for the examples again." },
    { name: "Zero-, one-, and few-shot", plain: "How many worked examples the prompt includes.", how: "Zero-shot: instruction only. One-shot: a single example. Few-shot: as many as fit in the 2,048-token [[context-window|context window]], typically 10 to 100. Every task was evaluated in all three settings.", product: "Few-shot prompting is the fastest experiment in AI product work. Measure all three settings on your own evaluation set before deciding on anything heavier." },
    { name: "Scale as a strategy", plain: "Same recipe, a much bigger model, much more data.", how: "Eight sizes from 125M to 175B parameters, all trained on 300B tokens. The largest has 96 layers, hidden size 12,288, and 96 heads. Loss fell smoothly with compute, following [[scaling-laws|scaling laws]].", product: "Scaling laws let labs forecast a big model's quality from small runs, which made capability something that can be planned and budgeted." },
    { name: "The training data mix", plain: "A weighted blend of filtered web, books, and Wikipedia.", how: "Filtered [[common-crawl|Common Crawl]] (410B tokens) made up 60% of training; WebText2 22%; two book corpora 8% each; Wikipedia 3%. Higher-quality sources were seen two to three times; Common Crawl less than once.", product: "The [[data-mix|data mix]] is a lever: sampling high-quality sources more often is cheaper than collecting more data." },
    { name: "Emergent behavior", plain: "Some abilities appear only at large sizes.", how: "Three-digit arithmetic, unscrambling words, and using made-up words in sentences were near zero for small models and jumped at the largest sizes. How sudden such jumps really are is still debated.", product: "Do not conclude a task is impossible because a small model fails, and do not assume a bigger model fixes everything. Test at the size you can afford to serve." },
    { name: "Limitations and contamination", plain: "The paper is unusually frank about what went wrong.", how: "A bug left some benchmark test data in the training set ([[contamination]]); the authors measured its effect. GPT-3 still struggled with some reasoning and comparison tasks, repeated itself in long text, and reflected biases from web data.", product: "Ask any vendor how they check for contamination. A model maker's own benchmarks deserve the scrutiny this paper applied to itself." }
  ],
  terms: ["icl", "few-shot", "zero-shot", "prompt", "scaling-laws", "emergent", "foundation-model", "api-model", "common-crawl", "data-mix", "contamination", "parameter", "context-window", "hallucination"],
  code: {
    title: "Few-shot prompting is string building", lang: "Python",
    lines: [
      ["examples = [('sea otter', 'loutre de mer'),", "The paper's own few-shot example: English to French pairs."],
      ["            ('peppermint', 'menthe poivrée'),", ""],
      ["            ('plush giraffe', 'girafe peluche')]", ""],
      ["prompt = 'Translate English to French:\\n'", "Start with a task description."],
      ["for en, fr in examples:", "Add each worked example…"],
      ["    prompt += f'{en} => {fr}\\n'", "…in a consistent format. The model picks up the pattern from these lines."],
      ["prompt += 'cheese =>'", "End with the new input and an open slot."],
      ["reply = llm.complete(prompt, max_tokens=5, temperature=0)", "Send it to any LLM. No training happens: the “learning” is inside this one call."],
      ["print(reply)  # ' fromage'", "The model continues the pattern."],
      ["cost = count_tokens(prompt) * price_per_token", "Every example is paid for again on every request. At scale this is a real budget line."]
    ]
  },
  numbers: [
    { value: "175B", label: "[[parameter|Parameters]]: 96 layers, hidden size 12,288, 96 attention heads" },
    { value: "300B", label: "training tokens, from a mix weighted 60% toward filtered Common Crawl" },
    { value: "3.14 × 10²³", label: "[[flops|FLOPs]] of training compute, about 3,640 petaflop/s-days" },
    { value: "2,048", label: "tokens of [[context-window|context]] for instructions, examples, and the answer" }
  ],
  lab: {
    summary: "GPT-3's weights are not public, so you will reproduce its central finding, in-context learning improving with model size, using open models of several sizes.",
    time: "6–8 hours", compute: "Free Colab T4 GPU", tools: "Hugging Face transformers; small open base models such as Qwen2.5 0.5B / 1.5B / 3B",
    steps: [
      { name: "Reproduce", goal: "Show that few-shot beats zero-shot, and that the gap grows with model size.",
        do: ["Pick a labeled task with clear answers, such as SST-2 sentiment.", "Evaluate three sizes of one open model family with 0, 1, and 5 examples on 200 test items.", "Plot accuracy against model size with one line per setting: a small version of the paper's Figure 1.2."],
        prompt: "Reproduce GPT-3's in-context learning result at small scale. Use three sizes of one open base (not instruct) model family on Hugging Face, for example Qwen/Qwen2.5-0.5B, Qwen2.5-1.5B, and Qwen2.5-3B, loaded in 16-bit or 4-bit to fit a T4. Task: SST-2 validation set, 200 examples with a fixed seed. For k in {0, 1, 5}, build prompts with a task description and k random training examples in the format 'Review: ...\\nSentiment: positive/negative'. Score by comparing the model's log-probability of ' positive' vs ' negative' (no free-form generation). Report accuracy for every (model, k) pair and plot accuracy vs. model size with one line per k. Fix seeds and reuse the same examples for every model.\nAcceptance criteria: under 40 minutes on a T4; one chart; one table.",
        observe: ["Whether the smallest model gains anything from examples.", "Whether the zero-shot to few-shot gap grows with size, as in the paper."],
        done: "One chart that looks like a miniature of the paper's figure, or a clear note on why it does not." },
      { name: "Your own data", goal: "Run the same experiment on a task from your work.",
        ideas: ["Your ticket-routing data from Station 02", "Classifying feature requests by product area", "Extracting a field (date, amount, product) from short texts", "Detecting whether a customer message is a complaint"],
        do: ["Write a task description a new colleague could follow.", "Pick 5 examples that cover every label, and 100 test items.", "Run 0-, 1-, and 5-shot with the largest model that fits, using two different example sets."],
        prompt: "Using the same scoring approach, run 0-, 1-, and 5-shot prompting on a CSV I upload (columns 'text', 'label') with the largest model from the previous step. Run the 5-shot setting with three different random example sets and two different example orders to measure sensitivity. Report the mean and spread of accuracy per setting, and show the confusion matrix for the best setting.",
        observe: ["How much accuracy changes when you only reorder the examples.", "Labels the model never predicts; these often need a clearer description rather than more examples."],
        done: "A table of accuracy and its variance across example choices, with one conclusion about prompt sensitivity." },
      { name: "Baselines", goal: "Decide between prompting and fine-tuning for your task.",
        table: [["Baseline", "What it tells you", "Expect"], ["Zero-shot with a good instruction", "The cheapest possible approach", "Often weak on custom labels"], ["5-shot prompt", "GPT-3's headline method", "A clear gain for larger models"], ["Your fine-tuned DistilBERT from Station 02", "A small trained specialist", "Often wins on narrow classification with enough labels"], ["A 7B open model in 4-bit, few-shot", "What extra model size buys on your task", "Better quality, slower, more memory"]],
        prompt: "Build a comparison table on my 100 test items: zero-shot and 5-shot with the open model, my fine-tuned DistilBERT from Station 02 (I will upload it or we retrain it), and 5-shot with the largest open model that fits on the free T4 in 4-bit (for example Qwen/Qwen2.5-7B). Columns: accuracy, macro F1, average latency per item, and estimated cost per 1M items, using GPU time for the local models plus a cost-only row for a paid API at a token price I enter (no API calls).",
        done: "A cost-quality table with a recommendation you could defend in a design review." },
      { name: "Failure log", goal: "Record where prompting was fragile.",
        table: [["Likely failure", "Why it happens", "What to try"], ["The model always predicts the same label", "Majority-label or recency bias from the examples", "Balance labels in the examples; shuffle their order"], ["Accuracy swings with example order", "Small models are very sensitive to prompt details", "Average over several orders; prefer larger models"], ["Free-form answers do not match label names", "Generation drifts (“Positive!”, “I think negative”)", "Score label probabilities or constrain the output format"], ["Prompt longer than the context window", "Too many or too long examples", "Fewer, shorter examples; truncate inputs"], ["Suspiciously high scores", "The benchmark may be in the model's training data", "Test on your own fresh data"]],
        done: "Failure entries, including one about prompt sensitivity, with numbers." }
    ]
  },
  pm: [
    { q: "Prompt or fine-tune?", a: "Prompting wins on speed to a first result. Fine-tuning wins on cost per request and consistency at high volume. Model both with your real traffic; the toolkit's decision helper walks through it." },
    { q: "Why does model size matter so much for prompting?", a: "In-context learning gets much stronger with scale. A prompt that works on a large API model may fail on the small model you plan to self-host. Test on the model you will ship." },
    { q: "What do examples in a prompt cost?", a: "Five 50-token examples add 250 tokens to every request, plus latency. At a million requests a day, that is a budget line." },
    { q: "Can we trust published benchmark scores?", a: "Ask how contamination was checked. The best evidence is a score on your own fresh, held-out data." }
  ],
  reading: [
    "Read the abstract and Section 1, especially Figure 1.2: accuracy against model size for zero-, one-, and few-shot.",
    "Look at Figure 2.1: the translation example the prompt builder above recreates.",
    "Read Section 2.1 (model sizes, Table 2.1) and Section 2.2 (training data, Table 2.2).",
    "Skim Section 3. Pick three tasks you care about and compare their zero- and few-shot numbers.",
    "Read Section 4 on contamination and Section 5 on limitations.",
    "Skim Section 6 on misuse, bias, and energy: still the core list of AI product risks."
  ],
  quiz: [
    { q: "What changes inside GPT-3 when you add examples to the prompt?", options: ["Its weights are updated", "Nothing in its weights; it infers the task during the forward pass", "It downloads a task module", "Its vocabulary grows"], answer: 1, why: "In-context learning involves no gradient updates. Remove the examples and the “learning” is gone." },
    { q: "As models got larger, the gap between zero-shot and few-shot accuracy…", options: ["Shrank", "Widened", "Stayed constant", "Reversed"], answer: 1, why: "Larger models used in-context examples far more effectively." },
    { q: "You must classify 50 million messages a month into fixed labels. Few-shot prompting works but is expensive. What should you evaluate next?", options: ["A larger API model", "A fine-tuned small model, compared on cost and quality", "Removing the examples", "Pre-training a model from scratch"], answer: 1, why: "At high volume, a fine-tuned specialist often matches quality at a fraction of the cost per call." },
    { q: "What is data contamination?", options: ["Toxic training data", "Benchmark test items appearing in training data, inflating scores", "Duplicate files", "Corrupted downloads"], answer: 1, why: "If the model saw the test, the score measures memory, not ability." }
  ],
  next: "GPT-3 proved scale works, but how should a fixed compute budget be split between a bigger model and more data? GPT-3's answer was “mostly a bigger model”. Two years later, DeepMind showed that answer was wrong."
});

Portal.addPaper({
  id: "chinchilla", num: 5, short: "Chinchilla", year: 2022, stage: "scale", hours: 10,
  title: "Training Compute-Optimal Large Language Models",
  authors: "Hoffmann et al.", org: "DeepMind", arxiv: "2203.15556",
  oneLiner: "For a fixed compute budget, model size and training data should grow together, at about 20 training tokens per parameter. A 70B model trained on 4× more data beat models up to 7× its size.",
  story: {
    problem: "Earlier [[scaling-laws|scaling laws]] (Kaplan et al., 2020) suggested spending most extra compute on bigger models. So labs built huge models (GPT-3 175B, Gopher 280B, Megatron-Turing 530B) and trained each on roughly 300B tokens. Was that the best use of the compute?",
    idea: "Train over 400 models, from 70M to 16B parameters on 5B to 500B tokens, and fit how loss depends on both size and data. Three independent methods agree: double the model, double the data. Then test it by training Chinchilla (70B) with Gopher's compute budget but on 1.4T tokens.",
    result: "Chinchilla beat Gopher (280B), GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B) on a wide range of tasks. It scored 67.5% on [[mmlu|MMLU]], more than 7 points above Gopher, and being 4× smaller it was cheaper to fine-tune and serve."
  },
  analogy: "You have a fixed training budget. Earlier labs hired a huge team and gave everyone a one-day course. Chinchilla hired a quarter as many people and gave each of them four times the training. The smaller, better-trained team won.",
  whyPM: "This paper turns AI planning into arithmetic you can do: compute ≈ 6 × parameters × tokens, and about 20 tokens per parameter is compute-optimal. It also exposes a key trade-off: the cheapest model to train is not the cheapest to serve. And it made data, not just GPUs, the bottleneck, which makes data strategy a product concern.",
  figures: [
    { w: "chinchilla", title: "Spend a compute budget", text: "Pick a compute budget, then a model size; the rest of the budget goes to training tokens. The curve is the paper's predicted loss for every way of splitting that budget. Load real models to see where they sat.", takeaway: "Every budget has a best model size. GPT-3 and Gopher sat well to the right of it: too big, too little data. Training past the optimum, as LLaMA did, costs a little loss but buys a model that is much cheaper to run." },
    { w: "scale", opts: { mode: "ratio" }, title: "Tokens per parameter, then and now", text: "How much data each model saw for its size. The orange line marks Chinchilla's roughly 20:1.", takeaway: "Before 2022, big models were starved of data. After Chinchilla the ratio jumped, and LLaMA went far past it on purpose." }
  ],
  concepts: [
    { name: "Compute budget", plain: "The total arithmetic you can afford for training.", how: "Training compute C ≈ 6 × N × D [[flops|FLOPs]], where N is parameters and D is training tokens. The 6 covers a forward pass (about 2 FLOPs per parameter per token) and a backward pass (about 4).", product: "This one formula turns a model spec into GPU-hours and dollars. Try it in the toolkit's training-cost calculator." },
    { name: "Compute-optimal scaling", plain: "For a fixed budget, grow model size and data equally.", how: "All three methods found the optimal N and D each grow roughly as C^0.5, which works out to about 20 tokens per parameter. Kaplan et al. had found N ∝ C^0.73, putting most extra compute into size.", product: "If a model is huge but trained on little data, it probably costs more to run than its quality justifies." },
    { name: "IsoFLOP curves", plain: "Hold compute fixed, vary model size, and find the bottom of the curve.", how: "For nine compute budgets, the team trained many model sizes, each using the full budget. Loss traces a U-shape; its minimum is the optimal size for that budget. The minima fall on a straight line in log-log space.", product: "The method works at small scale for your own decisions: before a big run, train a few small models to locate the optimum." },
    { name: "Parametric loss fit", plain: "A formula that predicts loss from model size and data.", how: "L(N, D) = E + A/N^α + B/D^β, with E = 1.69 (the irreducible loss of natural text), A = 406.4, B = 410.7, α = 0.34, β = 0.28. It drives the curve in the figure above. A 2024 replication (Besiroglu et al.) found errors in this particular fit; corrected, it agrees with the 20:1 rule.", product: "Scaling laws are fitted estimates, not physics. Treat forecasts built on them as ranges, and ask how they were validated." },
    { name: "Data becomes the bottleneck", plain: "Compute-optimal training needs far more tokens than labs had been using.", how: "By the paper's Table 3, a compute-optimal 1-trillion-parameter model would need about 21 trillion tokens, more high-quality text than was readily available. The authors call for more attention to dataset size and quality.", product: "Data acquisition, licensing, and filtering became strategic. Synthetic data and multi-epoch training are responses to this squeeze." },
    { name: "Training-optimal vs. inference-optimal", plain: "The cheapest model to train is not the cheapest to run.", how: "Chinchilla minimizes training compute for a target loss. But a model is trained once and served millions of times. A smaller model trained on extra tokens costs more to train and less to serve, the trade LLaMA made deliberately.", product: "Ask which budget you are optimizing. For a high-traffic product, over-training a smaller model is usually worth it." }
  ],
  terms: ["scaling-laws", "compute-optimal", "tokens-per-param", "flops", "mfu", "mmlu", "parameter", "dataset", "training", "inference", "loss"],
  code: {
    title: "The compute-optimal calculation", lang: "Python",
    lines: [
      ["C = 5.76e23", "A compute budget in FLOPs: the budget Gopher and Chinchilla shared."],
      ["N_opt = (C / 120) ** 0.5", "From C = 6·N·D and D = 20·N we get C = 120·N², so N = √(C/120)."],
      ["D_opt = 20 * N_opt", "Training tokens: about 20 per parameter."],
      ["print(f'{N_opt/1e9:.0f}B params, {D_opt/1e12:.1f}T tokens')", "Prints “69B params, 1.4T tokens”: Chinchilla's actual configuration."],
      ["gpu_hours = C / (312e12 * 0.40 * 3600)", "An A100 peaks at 312 TFLOP/s; real runs reach about 40% of that ([[mfu|MFU]])."],
      ["print(f'{gpu_hours:,.0f} A100 GPU-hours')", "About 1.28 million GPU-hours, roughly $2.6M at $2 an hour, for the final run alone."]
    ]
  },
  numbers: [
    { value: "70B", label: "parameters in Chinchilla, trained on 1.4T tokens" },
    { value: "≈ 20", label: "[[tokens-per-param|training tokens per parameter]] for compute-optimal training" },
    { value: "400+", label: "models trained to fit the scaling laws, from 70M to 16B parameters" },
    { value: "67.5%", label: "on [[mmlu|MMLU]], more than 7 points above the 4× larger Gopher" }
  ],
  lab: {
    summary: "Run a miniature scaling-law study with the Transformer you built at Station 01, and plan a training budget the way a lab would.",
    time: "8–10 hours", compute: "Free Colab T4 GPU", tools: "PyTorch (your Station 01 model); Weights & Biases optional",
    steps: [
      { name: "Reproduce", goal: "Draw your own IsoFLOP curves at toy scale and find the optimal model size for two budgets.",
        do: ["Pick two small compute budgets the T4 can handle, roughly 10 and 30 minutes of training.", "For each budget, train 4–5 model sizes, each running until it has used the whole budget.", "Plot validation loss against model size for each budget and mark the minimum."],
        prompt: "Using my decoder-only Transformer from Station 01 (or a minimal nanoGPT-style model), run a small Chinchilla-style IsoFLOP study on a tokenized text dataset of at least 5M tokens (for example a TinyStories subset). Define compute as 6 * params * tokens_seen. Choose two budgets that take roughly 10 and 30 minutes on a T4. For each budget, train 5 model sizes (vary layers and width from about 0.2M to 10M non-embedding parameters), setting the number of training tokens so each run uses exactly the budget. Use a cosine learning-rate schedule matched to each run's length, which the Chinchilla paper found matters. Record final validation loss. Plot loss vs. params (log x-axis) for each budget, fit a parabola in log space to find the minimum, and report the optimal tokens-per-parameter ratio for each budget.\nAcceptance criteria: two U-shaped curves or a clear explanation of why not; a table of runs; total runtime under 2 hours.",
        observe: ["Whether the curves are U-shaped; at tiny scale they can be noisy.", "Whether the optimal size grows with the budget.", "Your tokens-per-parameter ratio. It will not be exactly 20 at this scale, and that is fine."],
        done: "Two IsoFLOP curves, the optimum for each, and an honest note on how noisy they are." },
      { name: "Your own data", goal: "Answer a planning question for your own corpus: how big a model can this data support?",
        ideas: ["The corpus you used at Station 01", "All the public text your company has published", "A domain dataset from Hugging Face (legal, medical, finance)"],
        do: ["Count your corpus in tokens with a real tokenizer.", "Use the 20:1 rule to compute the largest compute-optimal model it supports, and the compute that would take.", "Train the two best sizes from step 1 on your corpus and see whether limited data shifts the optimum."],
        prompt: "Count the tokens in my uploaded corpus with the GPT-2 tokenizer. Using the Chinchilla rule (D = 20N, C = 6ND), compute the compute-optimal model size for this many tokens, the compute in FLOPs, and the A100 GPU-hours at 40% utilization. Then train the two best model sizes from my IsoFLOP study on this corpus with the same budget, repeating data for multiple epochs if needed, and compare their validation losses. Explain what happens when the model needs more tokens than the corpus has.",
        observe: ["How quickly a real corpus runs out: most domain corpora support only small compute-optimal models.", "What repeating data for several epochs does to validation loss."],
        done: "A one-paragraph data-sufficiency memo: the model size your data supports, and what you would need to go bigger." },
      { name: "Baselines", goal: "Compare three ways to spend the same budget.",
        table: [["Allocation", "What it represents", "Expect"], ["Big model, few tokens (≈ 2 per parameter)", "The GPT-3 and Gopher era", "Worse loss than optimal"], ["≈ 20 tokens per parameter", "Chinchilla compute-optimal", "Best loss for the budget"], ["Small model, many tokens (100+ per parameter)", "LLaMA-style, inference-optimal", "Slightly worse loss, much cheaper to run"]],
        prompt: "At the larger budget, train three models that each use the full budget: one at about 2 tokens/parameter, one at about 20, and one at 100 or more. Report validation loss, parameter count, training time, and inference speed (tokens per second when generating 200 tokens). Then compute the total cost of training plus serving 1 billion generated tokens for each, using the measured speeds and a GPU price I provide.",
        done: "A table showing that the training-optimal and total-cost-optimal choices differ, with numbers." },
      { name: "Failure log", goal: "Record what made the scaling study misleading.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Flat or noisy curves with no clear U", "Too few sizes, too small a scale, run-to-run noise", "Widen the size range; average two seeds"], ["Bigger models lose at every budget", "Learning rate not adjusted for model size", "Use lower learning rates for bigger models; tune each briefly"], ["Results depend on when you stop", "Learning-rate schedule not matched to run length", "End the cosine schedule exactly at each run's last step"], ["Loss worsens with more epochs", "Repeating a small dataset leads to overfitting", "Record it as data-limited; more data beats more epochs"], ["Inconsistent parameter counts", "Embedding parameters dominate tiny models", "Report non-embedding parameters, as scaling-law papers do"]],
        done: "Failure entries, including one hidden variable (such as the learning-rate schedule) that changed your conclusion." }
    ]
  },
  pm: [
    { q: "How big should our model be?", a: "Start from your compute budget and your data: about 20 tokens per parameter for training efficiency, more if the model will serve heavy traffic." },
    { q: "Is our data enough?", a: "Count tokens. If the compute-optimal size for your data is small, a bigger model will not help; more or better data will." },
    { q: "What will training cost?", a: "Use C ≈ 6ND and a realistic GPU utilization, then add 2–3× for failed runs, evaluations, and experiments. Published numbers usually cover the final run only." },
    { q: "Optimize for training or serving?", a: "If the model will be used heavily, a smaller model trained longer usually wins on total cost. That is LLaMA's logic at Station 08." }
  ],
  reading: [
    "Read the abstract and Figure 1: the whole argument on one chart, with GPT-3 and Gopher far from the line.",
    "Read Section 3 for the three approaches; study Figure 3 (the IsoFLOP curves).",
    "Look at Table 3: compute-optimal token counts for model sizes up to 10 trillion parameters.",
    "Skim Section 4 for Chinchilla against Gopher on MMLU and other tasks.",
    "Read Section 5 on data quality and the limits of the analysis.",
    "Optional: Besiroglu et al., “Chinchilla Scaling: A replication attempt” (2024), an example of science correcting itself."
  ],
  quiz: [
    { q: "With a fixed compute budget, Chinchilla says model size and training tokens should…", options: ["Favor model size heavily", "Grow roughly equally", "Favor data heavily", "Not matter"], answer: 1, why: "Both grow roughly as the square root of compute: double one, double the other." },
    { q: "Chinchilla used the same compute as Gopher. How did it differ?", options: ["Same size, more layers", "4× smaller, trained on about 4× more data", "4× bigger, less data", "Same size and data, faster hardware"], answer: 1, why: "70B parameters on 1.4T tokens, versus 280B on 300B tokens." },
    { q: "Roughly how much compute does training a 7B model on 1T tokens take?", options: ["4 × 10¹⁸ FLOPs", "4 × 10²² FLOPs", "4 × 10²⁶ FLOPs", "It cannot be estimated"], answer: 1, why: "6 × 7×10⁹ × 10¹² ≈ 4.2 × 10²²." },
    { q: "Why might a team train well past 20 tokens per parameter?", options: ["To use more GPUs", "A smaller model costs less to serve, which matters more over millions of requests", "Because 20 is a hard limit", "To make the model bigger"], answer: 1, why: "Training is paid once; inference is paid on every request." }
  ],
  next: "Chinchilla showed how to build a capable base model efficiently. But capable is not the same as helpful: base models continue text, they do not follow instructions. InstructGPT closed that gap with human feedback."
});
