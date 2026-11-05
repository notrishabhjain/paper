/* Stations 00–02: Foundations, Transformer, BERT. Strings may use [[term-id|label]] glossary links. */
Portal.addPaper({
  id: "foundations", num: 0, short: "Foundations", year: "Primer", stage: "foundations", hours: 8,
  title: "Foundations: how a model learns",
  authors: "Primer", org: "the six ideas every paper assumes", arxiv: null,
  oneLiner: "Tokens, embeddings, parameters, loss, gradient descent, and the difference between training and inference. Every paper on the route assumes you know these; this station makes sure you do.",
  story: {
    problem: "AI papers assume a shared vocabulary that nobody explains. Without it, every paper reads as jargon and every engineering estimate sounds like a guess.",
    idea: "Learn the training loop once: turn text into numbers, make a guess, measure the error, nudge the parameters to be a little less wrong, repeat millions of times.",
    result: "After this station you can follow the core loop in any paper and ask informed questions about data, model size, cost, and evaluation."
  },
  analogy: "Training a model is like tuning a huge mixing desk by ear. You play a song (data), listen to how far off it sounds (loss), nudge every dial slightly in the direction that sounds better (gradient descent), and repeat a few million times.",
  whyPM: "Every AI project conversation comes back to these ideas: how much data, how big a model, how long to train, how we measure error, and what each request costs to serve. Knowing them lets you estimate, push back on hand-waving, and write requirements an ML team can act on.",
  figures: [
    { w: "tokenizer", title: "How text becomes tokens", text: "Type anything. Switch between character, sub-word, and whole-word tokenizers, and slide the number of merges the sub-word tokenizer has learned.", takeaway: "Sub-word tokens are the compromise every LLM uses: short sequences without a giant vocabulary. Prices, context limits, and speed are all counted in tokens." },
    { w: "embeddings", title: "Words as points on a map", text: "Each token becomes a vector. Words used in similar ways land close together, and some relationships become directions.", takeaway: "Embeddings let a model generalize from words it knows to words it rarely saw. The same idea powers semantic search and RAG." },
    { w: "gradient", title: "Gradient descent, one step at a time", text: "A one-parameter model learns to fit a line. Press “Train 25 steps”, then try a learning rate above 2.3 and watch training fall apart.", takeaway: "A real model does exactly this for billions of parameters at once. The learning rate is the setting most likely to break a training run." },
    { w: "overfit", title: "Learning versus memorizing", text: "Drag through training. Training loss always falls; validation loss on held-out data tells you whether the model is actually learning.", takeaway: "Always ask for the validation or test score, never only the training score." }
  ],
  concepts: [
    { name: "Tokens and tokenizers", plain: "Models read numbers, so text is chopped into pieces and each piece gets an ID.", how: "A [[tokenizer]] splits text into [[token|tokens]] using a learned [[vocabulary]]. [[bpe|Byte-pair encoding]] builds that vocabulary by repeatedly merging the most frequent pair of symbols. Common words become one token; rare words split into several.", product: "API pricing, context limits, and latency are all counted in tokens. Non-English text and code often need more tokens per word, so they cost more and fit less into the context window." },
    { name: "Embeddings", plain: "Each token becomes a list of numbers that captures how it is used.", how: "The model keeps a table with one [[vector]] per token. Training moves the vectors so that tokens used in similar contexts end up close together.", product: "Semantic search, recommendations, duplicate detection, and [[rag|RAG]] all work by comparing [[embedding|embeddings]]." },
    { name: "Parameters", plain: "The adjustable numbers a model learns. Their count is the model's size.", how: "[[parameter|Parameters]] sit in [[matrix|matrices]] inside each [[layer]] of a [[neural-network|neural network]]. An input vector is multiplied through these matrices to produce the output. “7B” means seven billion of them.", product: "Size drives memory, cost per request, and latency. A 7B model in 16-bit needs about 14 GB just to load; a 175B model needs several GPUs." },
    { name: "Loss and gradient descent", plain: "Measure how wrong the model is, then nudge every parameter to be a little less wrong.", how: "The [[loss]] compares the model's prediction with the right answer. [[gradient-descent|Gradient descent]] computes which way each parameter should move and takes a step sized by the [[learning-rate|learning rate]]. Repeating this over [[batch|batches]] of data is [[training]].", product: "A “training run” is this loop running for hours or weeks. When engineers say “the loss spiked” or “it diverged”, this loop is misbehaving." },
    { name: "Generalization and overfitting", plain: "A model is only useful if it does well on data it has never seen.", how: "Data is split into training, validation, and test sets ([[data-split]]). If training loss keeps falling while validation loss rises, the model is [[overfitting]]: memorizing instead of learning.", product: "Ask whether reported scores come from a held-out test set. Test data leaking into training is the most common way demos overpromise." },
    { name: "Training versus inference", plain: "Training builds the model once; inference uses it on every request.", how: "[[training|Training]] updates parameters and needs enormous compute for a period of time. [[inference|Inference]] only runs the model forward, but happens millions of times on [[gpu|GPUs]].", product: "Training is closer to a capital cost; inference is an operating cost that grows with users. Many decisions on this route trade one against the other." }
  ],
  terms: ["machine-learning", "model", "parameter", "neural-network", "deep-learning", "token", "tokenizer", "vocabulary", "bpe", "embedding", "vector", "loss", "gradient-descent", "learning-rate", "batch", "epoch", "overfitting", "generalization", "data-split", "training", "inference", "gpu", "baseline"],
  code: {
    title: "A complete training loop", lang: "Python (PyTorch)",
    lines: [
      ["model = TinyModel()", "Create a model with randomly set [[parameter|parameters]]. It knows nothing yet."],
      ["optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)", "The optimizer does the nudging. <code>lr</code> is the [[learning-rate|learning rate]]: the size of each nudge."],
      ["", ""],
      ["for step in range(5000):", "Repeat the learning loop 5,000 times."],
      ["    x, y = get_batch('train')", "Grab a [[batch]] of examples: inputs <code>x</code> and the right answers <code>y</code>."],
      ["    prediction = model(x)", "The model makes its guess. This forward pass is also what happens at [[inference]]."],
      ["    loss = loss_fn(prediction, y)", "Score how wrong the guess was: a single number."],
      ["    optimizer.zero_grad()", "Clear the leftover gradients from the previous step."],
      ["    loss.backward()", "Work out, for every parameter, which direction would reduce the loss (the gradient)."],
      ["    optimizer.step()", "Move every parameter a small step in that direction: [[gradient-descent|gradient descent]]."],
      ["    if step % 500 == 0:", "Every 500 steps…"],
      ["        print(step, loss.item(), evaluate('val'))", "…report training and validation loss so you can spot [[overfitting]] early."]
    ]
  },
  numbers: [
    { value: "≈ 4 chars", label: "per [[token]] of English text, about ¾ of a word" },
    { value: "50,257", label: "tokens in GPT-2's [[vocabulary]]" },
    { value: "2 bytes", label: "per parameter in 16-bit precision, so a 7B model needs ≈ 14 GB just to load" },
    { value: "3e-4", label: "a common starting [[learning-rate|learning rate]] for small transformer experiments" }
  ],
  lab: {
    summary: "Set up your workbench and practice the loop before Station 01. These steps are lighter than later labs.",
    time: "4–6 hours", compute: "Free Google Colab (CPU is fine)", tools: "Colab, Hugging Face tokenizers, NumPy",
    steps: [
      { name: "Set up and reproduce", goal: "Get a notebook running and reproduce this page's tokenizer and gradient-descent figures in code.",
        do: ["Create a Google account for Colab and a free Hugging Face account.", "Paste the prompt below into your AI assistant, approve its plan, and run the notebook it writes in Colab.", "Compare GPT-2's token counts with the toy tokenizer on this page."],
        prompt: "Build a beginner notebook with three parts.\n1) Load the GPT-2 tokenizer from Hugging Face (transformers library). Tokenize 5 sentences I provide (one in a non-English language, one with code, one with numbers). Show tokens, token IDs, and characters per token for each.\n2) Implement gradient descent from scratch with NumPy to fit y = w*x to 20 noisy points generated with w = 2. Run it with learning rates 0.01, 0.5, and 3.0 and plot loss vs. step for each on one chart.\n3) Print a one-paragraph summary of what each learning rate did.\nAcceptance criteria: runs top to bottom on a CPU in under 2 minutes; three labeled charts; no external data files.",
        observe: ["Which sentence needs the most tokens per word, and what that means for API cost.", "The learning rate that diverges: what do the loss numbers actually do?"],
        done: "You have a notebook that runs top to bottom, and you can explain to a colleague what a token and a learning rate are." },
      { name: "Your own data", goal: "Measure how a real tokenizer treats text from your own work.",
        ideas: ["A page of a PRD or design doc", "Customer reviews or support tickets, with personal data removed", "Team chat messages with your usual mix of languages and jargon"],
        do: ["Collect one or two pages of text from your domain into a .txt file.", "Ask the assistant to count tokens with GPT-2's tokenizer and with a newer open tokenizer.", "Find the words that split into the most pieces."],
        prompt: "Extend the notebook: I will upload a text file. Count tokens with the GPT-2 tokenizer and with one modern open tokenizer (for example 'Qwen/Qwen2.5-0.5B'). Show total tokens for each, characters per token, and a table of the 20 words GPT-2 splits into the most tokens. Estimate the cost of sending this text 100,000 times at $3 per million input tokens for each tokenizer.",
        observe: ["Product names and jargon that tokenize badly.", "How much the newer tokenizer saves on your text."],
        done: "You can state what your domain's text costs per 100,000 requests, and why it differs by tokenizer." },
      { name: "Baselines", goal: "Compare three ways to cut text into tokens and understand the trade-off.",
        table: [["Baseline", "What it shows", "What to expect"], ["Character-level", "Smallest vocabulary, longest sequences", "About 4× more tokens than BPE"], ["Word-level (split on spaces)", "Short sequences, huge vocabulary, unknown words", "Every typo becomes an unknown word"], ["Sub-word BPE (GPT-2)", "The compromise every LLM uses", "Balanced length and vocabulary"]],
        prompt: "Add a section comparing character-level, whitespace word-level, and GPT-2 BPE tokenization on my text file: number of tokens, vocabulary size needed to cover the text, and the share of words in a held-out paragraph that the word-level vocabulary has never seen. Present a 3-row summary table.",
        done: "You can explain why every modern LLM uses sub-word tokens." },
      { name: "Failure log", goal: "Start your failure log now. It is a habit, not an afterthought.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Colab says a package is missing", "Colab images change; libraries need installing", "Ask the assistant to add a <code>pip install</code> cell at the top"], ["Loss becomes NaN", "Learning rate too high, so numbers overflow", "Lower the learning rate 10×"], ["Token counts differ from an online calculator", "Different models use different tokenizers", "Always name the tokenizer next to a token count"], ["Hugging Face download fails", "Some models require login or accepting a license", "Create an access token in your Hugging Face settings and log in from the notebook"]],
        done: "Your notes box below has at least one entry written with the failure-log template." }
    ]
  },
  pm: [
    { q: "How big a model do we need?", a: "Start from the task, not the hype. Smaller models are cheaper and faster; measure whether a bigger one actually moves your metric." },
    { q: "Do we have the right data?", a: "Ask where it came from, whether you may use it, how it is split, and whether the test set is truly unseen." },
    { q: "What will each request cost?", a: "Tokens in plus tokens out, times the price per token. Your tokenizer measurements make this concrete." },
    { q: "How will we know it works?", a: "Agree on a metric and a [[baseline]] before anyone trains anything. If nobody can name the baseline, the project is not ready." }
  ],
  reading: [
    "Watch the first lecture of Andrej Karpathy's <a href=\"https://karpathy.ai/zero-to-hero.html\" target=\"_blank\" rel=\"noopener\">Neural Networks: Zero to Hero</a> for gradient descent built from scratch. Skim the code; follow the ideas.",
    "Watch 3Blue1Brown's <a href=\"https://www.3blue1brown.com/topics/neural-networks\" target=\"_blank\" rel=\"noopener\">neural networks series</a> (chapters 1–3) for the visual intuition.",
    "Read Jay Alammar's <a href=\"https://jalammar.github.io/illustrated-word2vec/\" target=\"_blank\" rel=\"noopener\">The Illustrated Word2vec</a> for embeddings.",
    "Open the <a href=\"#glossary\">Glossary</a> and filter to “Basics”. Mark any term you could not explain to a colleague."
  ],
  quiz: [
    { q: "Roughly how many tokens is a 1,000-word English document for a GPT-style tokenizer?", options: ["About 250", "About 1,300", "About 4,000", "Exactly 1,000"], answer: 1, why: "One token is about ¾ of an English word, so 1,000 words ≈ 1,300 tokens. Pricing and context limits use this unit." },
    { q: "Training loss keeps falling, but validation loss has started rising. What is happening?", options: ["The learning rate is too low", "The model is overfitting", "The tokenizer is broken", "Training has converged perfectly"], answer: 1, why: "The model is memorizing the training data. Stop earlier, add data, or regularize." },
    { q: "What does a learning rate that is too high usually cause?", options: ["Slow but steady training", "Loss that bounces around or explodes to NaN", "Overfitting", "Smaller model files"], answer: 1, why: "Each step overshoots the minimum. The usual fix is to lower it." },
    { q: "Which cost grows with the number of users?", options: ["Training", "Inference", "Tokenizer training", "Hyperparameter search"], answer: 1, why: "Inference runs on every request. Over a product's life it often exceeds the training bill." }
  ],
  next: "With tokens, embeddings, and the training loop in hand, you are ready for the 2017 paper that introduced the architecture behind every model on this route."
});

Portal.addPaper({
  id: "transformer", num: 1, short: "Transformer", year: 2017, stage: "architecture", hours: 14,
  title: "Attention Is All You Need",
  authors: "Vaswani et al.", org: "Google Brain & Google Research", arxiv: "1706.03762",
  oneLiner: "Replaced word-by-word recurrent networks with attention, letting every word look at every other word at once. Training became parallel, and the Transformer became the base of every model that followed.",
  story: {
    problem: "In 2017, translation models were [[rnn|recurrent networks]] that read one word at a time. Each step waited for the previous one, so training could not use GPUs fully, and information from early words faded over long sentences.",
    idea: "Drop recurrence entirely. Use [[self-attention]] so every word gathers information from every other word in one parallel step, add [[positional-encoding|positional encodings]] to keep word order, and stack the result six layers deep.",
    result: "New state of the art in English→German (28.4 [[bleu|BLEU]]) and English→French (41.8 BLEU) translation, trained in 3.5 days on 8 GPUs: a small fraction of the cost of the previous best models."
  },
  analogy: "An RNN reads a report through a keyhole, one word at a time. A Transformer spreads the whole report on the table and lets every sentence highlight the other sentences it relates to, all at once.",
  whyPM: "Every model you will evaluate, from BERT to today's chat assistants, is a Transformer. Its design explains three things you will deal with constantly: why context windows are limited (attention cost grows with the square of the length), why GPUs matter so much (it is built for parallel math), and why one architecture now works for text, code, images, and audio.",
  figures: [
    { w: "attention", title: "Self-attention: who is “it”?", text: "In “The animal didn't cross the street because it was too tired”, what does “it” refer to? Pick a word and an attention head, then change the last word.", takeaway: "Attention lets each word's meaning depend on its context. Different heads learn different relationships, and the [[causal-mask|causal mask]] is the one change that turns this into a text generator." },
    { w: "attnmath", title: "Inside one attention step", text: "Attention is a soft lookup. The query is compared with each key by a dot product, scaled by √d, and turned into weights by [[softmax]]. The output is the weighted mix of values. Rotate the query and watch the weights shift.", takeaway: "Multiply, scale, softmax, mix. Because it is all matrix multiplication, a GPU can do it for every word at once." },
    { w: "posenc", title: "How the model knows word order", text: "Attention by itself ignores order. The paper adds a pattern of sine and cosine waves to each word's embedding so every position has a unique fingerprint. Hover to read values.", takeaway: "Position is information the model has to be given. LLaMA later replaced this with [[rope|rotary embeddings]], but the problem is the same." },
    { w: "arch", title: "The architecture, block by block", text: "Click any block to see what it does. Switch to BERT or GPT to see which half each later model kept.", takeaway: "The paper's two halves split into two families: encoders for understanding (BERT) and decoders for generation (GPT, LLaMA)." }
  ],
  concepts: [
    { name: "Self-attention", plain: "Each word builds its meaning by looking at the other words in the sentence.", how: "Each token produces a [[qkv|query, key, and value]] vector. Attention weights are softmax(QKᵀ / √d), and each token's output is the weighted sum of the values. The √d scaling keeps scores from growing so large that softmax ignores all but one word.", product: "Attention cost grows with the square of the input length. Doubling a prompt roughly quadruples the attention work, which is why long context costs more." },
    { name: "Multi-head attention", plain: "Several attention operations run side by side, each free to track a different relationship.", how: "The model splits its 512-number vectors into 8 heads of 64, runs attention in each, and concatenates the results. Heads specialize: some follow grammar, some resolve references, some watch nearby words.", product: "When researchers show “what the model is looking at”, they are showing individual heads: one of the few interpretable windows into a model." },
    { name: "Positional encoding", plain: "Word order is added as a numeric fingerprint, since attention alone ignores it.", how: "Each position gets a vector of sines and cosines at different frequencies, added to the token embedding. The paper also tried learned position vectors and got nearly identical results.", product: "How a model encodes position affects how well it handles inputs longer than it was trained on, which matters for long-document products." },
    { name: "Encoder and decoder", plain: "One stack reads the input, the other writes the output.", how: "The [[encoder]] uses full self-attention over the source sentence. The [[decoder]] uses masked self-attention over what it has written so far, plus [[cross-attention]] to the encoder's output. Each stack has 6 identical layers.", product: "Encoder-only models (BERT) are cheap and strong for classification and search. Decoder-only models (GPT) generate. Encoder-decoder models suit translation and summarization." },
    { name: "Residuals, normalization, feed-forward", plain: "The plumbing that keeps a deep stack trainable.", how: "Each sub-layer is wrapped as LayerNorm(x + Sublayer(x)): a [[residual|residual connection]] followed by [[layer-norm|layer normalization]]. The [[feed-forward]] block (512 → 2,048 → 512) runs on each token independently and holds most of the parameters.", product: "These details explain why model size scales with depth (layers) and width ([[hidden-size|hidden size]]), the two numbers on every model card." },
    { name: "Parallel training", plain: "All positions are processed at once, so GPUs are fully used.", how: "An RNN needs n sequential steps for n words; self-attention connects any two words in one step. The paper's Table 1 compares this cost per layer against recurrent and convolutional layers.", product: "The Transformer's lasting impact is economic: it made scale affordable, which leads directly to GPT-3 at Station 04." }
  ],
  terms: ["transformer", "attention", "self-attention", "multi-head-attention", "qkv", "positional-encoding", "encoder", "decoder", "encoder-decoder", "cross-attention", "feed-forward", "residual", "layer-norm", "hidden-size", "softmax", "rnn", "bleu", "ablation", "adam", "warmup", "dropout"],
  code: {
    title: "Scaled dot-product attention", lang: "Python (PyTorch)",
    lines: [
      ["def attention(Q, K, V, mask=None):", "A function that takes queries, keys, and values: one row per token."],
      ["    d_k = Q.size(-1)", "The length of each query vector (64 per head in the paper)."],
      ["    scores = Q @ K.transpose(-2, -1)", "Compare every query with every key using a dot product. The result is an N × N grid of similarity scores."],
      ["    scores = scores / math.sqrt(d_k)", "Scale by √d so the scores stay moderate. Without it, softmax would put nearly all the weight on one word."],
      ["    if mask is not None:", "Optionally block some positions…"],
      ["        scores = scores.masked_fill(mask == 0, float('-inf'))", "…by setting their score to minus infinity. In a decoder this hides future words: the [[causal-mask|causal mask]]."],
      ["    weights = torch.softmax(scores, dim=-1)", "Turn each row of scores into weights that are positive and sum to 1."],
      ["    return weights @ V", "Each token's output is the weighted average of all the value vectors. That is the whole mechanism."]
    ]
  },
  numbers: [
    { value: "8 × P100", label: "GPUs used to train the big model, for 3.5 days" },
    { value: "28.4", label: "[[bleu|BLEU]] on English→German, more than 2 points above the previous best, ensembles included" },
    { value: "65M / 213M", label: "[[parameter|Parameters]] in the base and big models" },
    { value: "512 · 8 · 6", label: "[[hidden-size|Hidden size]], attention heads, and layers per stack in the base model" }
  ],
  lab: {
    summary: "Build and train a small decoder-only Transformer, the GPT-style half of the paper, on text. You will reuse this model at Stations 05 and 08.",
    time: "10–14 hours", compute: "Free Colab T4 GPU", tools: "PyTorch; Karpathy's nanoGPT as a reference",
    steps: [
      { name: "Reproduce", goal: "Train a character-level Transformer on Tiny Shakespeare and watch it go from noise to Shakespeare-like text.",
        do: ["Paste the prompt into your assistant and approve its plan.", "Train for about 10 minutes on a Colab T4.", "Save samples from the start, middle, and end of training into your notes."],
        prompt: "Implement a small decoder-only Transformer (GPT-style) from scratch in PyTorch, following 'Attention Is All You Need' (multi-head self-attention, feed-forward, residual connections, layer norm) but decoder-only with a causal mask. Use the Tiny Shakespeare dataset (character-level, from Karpathy's char-rnn repository). Config: 4 layers, 4 heads, embedding size 128, context length 128, dropout 0.1, AdamW lr 3e-4, batch 64, 3000 steps. Split 90/10 train/validation. Log train and validation loss every 250 steps and plot both. Print a 300-character sample at step 0, 1500, and 3000. Add comments mapping each class to the paper's sections (3.2 attention, 3.3 feed-forward, 3.5 positional encoding).\nAcceptance criteria: trains in under 15 minutes on a T4; validation loss below 1.8; the final sample contains recognizable words.",
        observe: ["How fast the loss drops in the first 500 steps compared with later.", "When samples start producing real words, then character names and line breaks.", "Whether validation loss tracks training loss or drifts away from it."],
        done: "You have a loss chart and three samples, and you can point to the attention function in the code." },
      { name: "Your own data", goal: "Retrain the same model on text from your world and see what it picks up.",
        ideas: ["Your company's public release notes or changelog", "A collection of user stories or PRDs with confidential details removed", "Song lyrics, poetry, or a public-domain book in your first language", "Product reviews from a public Kaggle dataset"],
        do: ["Gather at least 300 KB of plain text (about 50,000 words). Much less and the model will memorize.", "Swap the dataset and retrain with the same settings.", "Compare samples with your source: what style did it learn?"],
        prompt: "Modify the notebook to train on a text file I upload instead of Tiny Shakespeare. Clean the text (normalize whitespace, remove non-printable characters), report its size in characters and its number of unique characters, and keep the same model and training settings. After training, generate 5 samples of 400 characters from prompts I provide. Compare the final validation loss with the Shakespeare run in a small table.",
        observe: ["Long passages copied word for word: that is memorization, and your corpus is too small.", "Which structures it learns first: formatting, frequent phrases, or jargon."],
        done: "Samples from your own corpus and a short note on what the model learned versus memorized." },
      { name: "Baselines", goal: "Measure what attention and position information are actually worth.",
        table: [["Baseline", "What it tells you", "Expect"], ["Bigram model (predicts the next character from the current one only)", "How much any context helps", "Much higher loss, around 2.5"], ["Your Transformer without positional encoding", "Whether the model needs order information", "Worse loss and jumbled samples"], ["Your Transformer with 1 head instead of 4, same size", "Whether multiple heads help at this scale", "A small but visible gain for 4 heads"]],
        prompt: "Add an experiment section that trains three variants with identical data, steps, and seeds: (a) a bigram baseline, (b) the Transformer with positional embeddings removed, (c) the Transformer with 1 head instead of 4 (same embedding size). Plot every validation-loss curve, including the original model, on one chart, and add a table of final validation loss and training time.",
        done: "One chart with four curves and a two-sentence conclusion for each baseline." },
      { name: "Failure log", goal: "Record what broke and why. Small Transformers fail in instructive ways.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Loss stuck near 4.2 from the start", "That is −ln(1/65): uniform guessing over 65 characters. Often the targets are not shifted by one position", "Ask the assistant to print one input/target pair and check the shift"], ["Validation loss rises after a while", "Overfitting a small dataset", "Add dropout, shrink the model, or stop earlier"], ["Samples repeat one phrase", "Greedy decoding or an undertrained model", "Sample with temperature 0.8–1.0; train longer"], ["CUDA out of memory", "Batch size × context length too large", "Halve the batch size or the context length"], ["Training loss near zero but samples are gibberish", "The causal mask is missing, so the model sees the answer during training", "Check the mask"]],
        done: "At least three failure-log entries, each with a root cause in your own words." }
    ]
  },
  pm: [
    { q: "Why are long contexts expensive?", a: "Attention compares every token with every other token, so cost grows with the square of length. Ask vendors how price and latency change between 4k and 128k tokens." },
    { q: "Encoder, decoder, or both?", a: "For classification, search, and extraction, a small encoder can be far cheaper than a generative model. Ask whether the task needs generation at all." },
    { q: "Why does everyone talk about GPUs?", a: "The Transformer turned language modeling into large matrix multiplications. GPU supply and price now set the pace and cost of AI work." },
    { q: "What made this architecture win?", a: "Not only accuracy: it trained faster and parallelized better. Efficiency gains turn into capability gains, a pattern you will see again at Stations 05, 07, and 09." }
  ],
  reading: [
    "Read the abstract and Section 1 to see the problem with recurrence.",
    "Study Figure 1 (the architecture diagram) next to Figure 1.4 on this page.",
    "Read Section 3.2 on attention, including Figure 2. Skip the multi-head details on the first pass and return after the lab.",
    "Read Section 4 (Why Self-Attention) and its Table 1 comparing the cost of each layer type.",
    "Skim Section 6 and Table 3: the [[ablation]] study that varies heads, model size, and dropout.",
    "Companions: Jay Alammar's <a href=\"https://jalammar.github.io/illustrated-transformer/\" target=\"_blank\" rel=\"noopener\">The Illustrated Transformer</a> and Harvard NLP's <a href=\"https://nlp.seas.harvard.edu/annotated-transformer/\" target=\"_blank\" rel=\"noopener\">The Annotated Transformer</a>."
  ],
  quiz: [
    { q: "What problem with RNNs did the Transformer mainly solve?", options: ["They could not handle numbers", "They processed words one after another, so training could not be parallelized", "They needed labeled data", "They could only translate into English"], answer: 1, why: "Each RNN step waits for the previous one. Self-attention processes all positions in parallel." },
    { q: "Why are attention scores divided by √d?", options: ["To save memory", "To keep scores from growing so large that softmax puts almost all weight on one token", "To make the model smaller", "To encode word position"], answer: 1, why: "Dot products of long vectors get large. Scaling keeps softmax, and its gradients, healthy." },
    { q: "Doubling the input length does roughly what to the attention computation?", options: ["Halves it", "Doubles it", "Quadruples it", "Leaves it unchanged"], answer: 2, why: "Every token attends to every token: N × N comparisons. Twice the tokens means four times the pairs." },
    { q: "Which later model keeps only the decoder half?", options: ["BERT", "GPT-2", "Both", "Neither"], answer: 1, why: "GPT models are decoder-only, built to generate the next token. BERT keeps the encoder." },
    { q: "Without positional encoding, a Transformer treats “dog bites man” and “man bites dog” as…", options: ["Opposites", "Identical inputs", "Unrelated sentences", "Grammatically wrong"], answer: 1, why: "Self-attention is order-blind. Positional information is what tells the model the order." }
  ],
  next: "The Transformer was built for translation. Within a year, two teams asked a bigger question: what if you first pre-train it on huge amounts of unlabeled text? Google kept the encoder and built BERT. OpenAI kept the decoder and built GPT."
});

Portal.addPaper({
  id: "bert", num: 2, short: "BERT", year: 2018, stage: "pretrain", hours: 10,
  title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
  authors: "Devlin, Chang, Lee, Toutanova", org: "Google AI Language", arxiv: "1810.04805",
  oneLiner: "Pre-train a Transformer encoder to fill in masked words using context from both sides, then fine-tune it with one small extra layer. It set new records on 11 language tasks and made “pre-train, then fine-tune” the default.",
  story: {
    problem: "Each language task (sentiment, question answering, entity tagging) needed its own model and lots of labeled data. Earlier pre-trained models read text in one direction only, so a word's representation could not use the words after it.",
    idea: "Train the [[encoder]] on a fill-in-the-blank game: hide 15% of words and predict them from both sides ([[mlm|masked language modeling]]). Add a second task: did sentence B really follow sentence A? Then [[fine-tuning|fine-tune]] the same model on each task with one small output layer.",
    result: "State of the art on 11 tasks: a [[glue|GLUE]] score of 80.5 (+7.7 points), [[squad|SQuAD]] v1.1 F1 of 93.2, and SQuAD 2.0 F1 of 83.1. Most tasks fine-tuned in under an hour on one Cloud TPU."
  },
  analogy: "Before BERT, every new task meant hiring a fresh graduate and training them from scratch. BERT is hiring someone who has read the whole library, then giving them a one-day orientation for each specific job.",
  whyPM: "BERT-style encoders still power much of production AI: search ranking, ticket classification, spam and fraud detection, and the embeddings behind [[rag|RAG]]. They are small, fast, and cheap compared with generative models. Knowing when an encoder is enough can cut a project's serving cost by orders of magnitude.",
  figures: [
    { w: "mlm", title: "Fill in the blank: why both sides matter", text: "Mask a word, then compare what a model can guess reading both sides (BERT) with reading only the words to its left (GPT-style).", takeaway: "For understanding tasks, the words after a gap carry as much information as the words before it. That is BERT's advantage over left-to-right models for classification and extraction." },
    { w: "maskrecipe", title: "The masking recipe: 15%, then 80 / 10 / 10", text: "BERT picks 15% of tokens in each example. Of those, 80% become [MASK], 10% become a random word, and 10% stay unchanged. Generate a few examples to see the mix.", takeaway: "The random and unchanged cases stop the model from paying attention only when it sees [MASK], a token that never appears in real tasks." },
    { w: "finetune", title: "One body, many heads", text: "The same pre-trained BERT handles very different tasks. Only the input format and a tiny output layer change.", takeaway: "Pre-training is done once by someone with a big budget; fine-tuning is cheap enough for any team. That split is the business model of modern AI." }
  ],
  concepts: [
    { name: "Bidirectional context", plain: "Each word's meaning is built from the words before and after it.", how: "Because BERT's task is filling gaps, it can use full self-attention in every layer. A left-to-right model has to hide future words, or predicting the next word would be trivial.", product: "“Bank” in “river bank” versus “bank account” is resolved using both sides. That makes encoders strong at classification, entity extraction, and search." },
    { name: "Masked language modeling", plain: "Hide words, then predict them: a training task that needs no human labels.", how: "15% of tokens are selected: 80% are replaced with [MASK], 10% with a random token, and 10% stay unchanged. The model predicts the original token at each selected position.", product: "[[self-supervised|Self-supervised]] objectives let models learn from billions of words without a labeling budget. Labels are needed only for the cheap fine-tuning step." },
    { name: "Next sentence prediction", plain: "A second task: does sentence B follow sentence A?", how: "Half the time B is the true next sentence, half the time a random one. The vector at the [[cls-token|[CLS]]] position is used to predict which.", product: "A lesson in ablations: later work (RoBERTa, 2019) found NSP added little and removing it helped. Not every component of a famous paper earns its place." },
    { name: "Pre-train, then fine-tune", plain: "Learn language once, then specialize cheaply for each task.", how: "All parameters are fine-tuned on task data for 2–4 epochs with a small learning rate. One output layer is added: on [CLS] for classification, on every token for tagging, or start and end positions for answer spans.", product: "This is [[transfer-learning|transfer learning]]. It cut the labeled data needed per task from hundreds of thousands of examples to a few thousand." },
    { name: "Input format", plain: "Special tokens tell BERT where inputs start and how they split.", how: "Inputs start with [CLS], and sentences are separated by [SEP]. Segment embeddings mark sentence A versus B; learned position embeddings mark order up to 512 tokens. WordPiece tokenization uses a 30,000-token vocabulary.", product: "512 tokens is BERT's hard limit. Long documents must be chunked, a constraint you will meet again in RAG systems." },
    { name: "Model sizes", plain: "Two sizes: Base (110M parameters) and Large (340M).", how: "Base has 12 layers, hidden size 768, and 12 heads. Large has 24 layers, 1,024, and 16 heads. Large was better on every task, even small ones.", product: "Distilled versions such as DistilBERT (2019) keep most of the quality at a fraction of the size, which is why small encoders are everywhere in production." }
  ],
  terms: ["pre-training", "fine-tuning", "transfer-learning", "self-supervised", "mlm", "nsp", "cls-token", "encoder", "benchmark", "glue", "squad", "accuracy", "f1", "embedding", "rag", "context-window"],
  code: {
    title: "Masked-word prediction and fine-tuning setup", lang: "Python (Hugging Face)",
    lines: [
      ["from transformers import pipeline", "Load Hugging Face's helper that wraps a model and its tokenizer into one call."],
      ["fill = pipeline('fill-mask', model='bert-base-uncased')", "Download the original BERT-Base (110M parameters) and set it up for fill-in-the-blank."],
      ["results = fill('The delivery was [MASK] again.')", "Ask BERT to fill the gap. It reads both sides of [MASK]."],
      ["for r in results:", "Loop over its top five guesses…"],
      ["    print(r['token_str'], round(r['score'], 3))", "…and print each word with its probability."],
      ["", ""],
      ["from transformers import AutoModelForSequenceClassification", "For fine-tuning, load BERT with a classification layer on top."],
      ["model = AutoModelForSequenceClassification.from_pretrained(", ""],
      ["    'bert-base-uncased', num_labels=3)", "The body is pre-trained; the 3-way output layer starts random and is learned from your labeled examples."]
    ]
  },
  numbers: [
    { value: "3.3B words", label: "of training text: BooksCorpus (800M) plus English Wikipedia (2,500M)" },
    { value: "110M / 340M", label: "[[parameter|Parameters]] in BERT-Base and BERT-Large" },
    { value: "80.5", label: "[[glue|GLUE]] score, 7.7 points above the previous best" },
    { value: "15%", label: "of tokens selected for masking in each training example" }
  ],
  lab: {
    summary: "Use a real BERT, fine-tune it to classify text, and find out when a simple model is good enough.",
    time: "8–10 hours", compute: "Free Colab T4 GPU", tools: "Hugging Face transformers and datasets, scikit-learn",
    steps: [
      { name: "Reproduce", goal: "Fine-tune BERT on a sentiment benchmark from the paper and get close to its reported accuracy.",
        do: ["Run the fill-mask demo from the code section on ten sentences of your own.", "Fine-tune BERT-Base (or DistilBERT) on SST-2, the movie-review sentiment task in the paper's Table 1.", "Compare your accuracy with the paper's 93.5% for BERT-Base."],
        prompt: "Part 1: Use the Hugging Face fill-mask pipeline with bert-base-uncased on 10 sentences I give you; show the top 5 predictions and probabilities for each.\nPart 2: Fine-tune bert-base-uncased (fall back to distilbert-base-uncased if memory is tight) on the GLUE SST-2 dataset from the Hugging Face datasets library. Use max length 128, batch size 32, learning rate 2e-5, 2 epochs, fp16. Evaluate on the validation set and report accuracy and a confusion matrix. Print 10 misclassified examples.\nAcceptance criteria: runs in under 30 minutes on a T4; validation accuracy above 90%.",
        observe: ["How close you get to 93.5%, and how many minutes it took.", "The misclassified reviews: sarcasm, negation, or mixed feelings?"],
        done: "Accuracy reported, and ten error examples in your notes, each with a guess at why it failed." },
      { name: "Your own data", goal: "Fine-tune BERT on a classification task from your work.",
        ideas: ["Support tickets → category (billing, bug, feature request)", "App store reviews → sentiment or topic", "User stories → product area", "Meeting notes → contains a decision or not"],
        do: ["Build a CSV with two columns, text and label: at least 500 rows and 2–5 labels. Public datasets from Kaggle or Hugging Face are fine if work data is off-limits.", "Hold out 20% as a test set before anything else.", "Fine-tune and report accuracy plus [[f1|F1]] per class."],
        prompt: "Fine-tune distilbert-base-uncased on a CSV I upload with columns 'text' and 'label'. Use a stratified 70/15/15 train/validation/test split with a fixed seed. Train 3 epochs at lr 3e-5 and pick the best epoch by validation F1. Report test accuracy, macro F1, per-class precision/recall/F1, and a confusion matrix. Show the 15 test examples the model was most confident about but got wrong.",
        observe: ["Class imbalance: is accuracy hiding a class the model never predicts?", "Labels that even you find ambiguous. That ceiling applies to the model too."],
        done: "A per-class F1 table and a short note on whether you would ship it, and why." },
      { name: "Baselines", goal: "Find out whether BERT is worth it for your task.",
        table: [["Baseline", "What it tells you", "Expect"], ["Keyword rules written in 15 minutes", "The no-ML floor", "Surprisingly decent on easy classes"], ["TF-IDF + logistic regression", "The classic, nearly free model", "Within a few points of BERT on many tasks"], ["Frozen BERT embeddings + logistic regression", "Pre-training's value without fine-tuning", "Between TF-IDF and fine-tuned BERT"], ["Fine-tuned BERT", "Full transfer learning", "Best, especially on subtle classes"]],
        prompt: "On the same splits, add three baselines: (1) a keyword-rule classifier using rules I will describe, (2) TF-IDF + logistic regression, (3) mean-pooled frozen distilbert embeddings + logistic regression. Report test macro F1, training time, and inference time per 1,000 examples for all four approaches in one table.",
        done: "A four-row table with F1, training time, and inference time, plus your recommendation." },
      { name: "Failure log", goal: "Document where BERT broke down.",
        table: [["Likely failure", "Why it happens", "What to try"], ["High accuracy, but one class is never predicted", "Class imbalance: accuracy rewards guessing the majority", "Report macro F1; use class weights or rebalance"], ["Scores jump around between runs", "Small dataset and random seeds", "Run three seeds and report the average"], ["Long texts classified badly", "Truncated at 128 or 512 tokens, cutting the key sentence", "Check token lengths; keep the most informative part"], ["Great test score, poor results on new real data", "Test set leaked or unrepresentative (dates, sources)", "Split by time or source, not at random"], ["Out of memory", "Batch size or sequence length too large", "Halve the batch, enable fp16, or use DistilBERT"]],
        done: "Failure entries with root causes, including at least one about data rather than code." }
    ]
  },
  pm: [
    { q: "Do we need a generative model for this?", a: "If the output is a label, a score, or a span of the input, a fine-tuned encoder is usually faster, cheaper, and easier to evaluate than an LLM." },
    { q: "How much labeled data do we need?", a: "With pre-training, often hundreds to a few thousand examples per task. Budget for clear labeling guidelines more than for volume." },
    { q: "What is the 512-token limit costing us?", a: "Long documents get truncated or chunked. Ask how the system handles inputs longer than the model's [[context-window|context window]]." },
    { q: "Where do embeddings come in?", a: "BERT-style encoders turn text into vectors for semantic search and [[rag|RAG]]. Choosing and evaluating the embedding model is a core RAG design decision." }
  ],
  reading: [
    "Read the abstract and Figure 1: pre-training and fine-tuning side by side.",
    "Read Section 3.1 on the two pre-training tasks, including the 80/10/10 masking details.",
    "Look at Figure 4 in the appendix: the four input formats for different task types.",
    "Skim Section 4 and Table 1 (GLUE). Note what each task measures.",
    "Read Section 5.1, the ablation on next sentence prediction and bidirectionality.",
    "Companion: Jay Alammar's <a href=\"https://jalammar.github.io/illustrated-bert/\" target=\"_blank\" rel=\"noopener\">The Illustrated BERT</a>."
  ],
  quiz: [
    { q: "Why can BERT use context from both sides of a word?", options: ["It uses two separate models", "Its training task is filling masked gaps, so seeing later words is not cheating", "It reads the sentence twice", "It uses a larger vocabulary"], answer: 1, why: "Next-word prediction requires hiding the future. Masked-word prediction does not, so full bidirectional attention is allowed." },
    { q: "Of the 15% of tokens BERT selects, how many become [MASK]?", options: ["All of them", "80%", "50%", "10%"], answer: 1, why: "80% [MASK], 10% a random token, 10% unchanged, so the model does not rely on seeing [MASK]." },
    { q: "A team wants to route 2 million support tickets a day into 8 queues. What is a sensible first model to try?", options: ["Pre-train a new LLM", "A fine-tuned BERT-style encoder, compared against TF-IDF", "GPT-3 with 50 examples in every prompt", "No model; hire more agents"], answer: 1, why: "High-volume classification favors small, fast encoders. Always compare with a cheap baseline." },
    { q: "What did later work find about next sentence prediction?", options: ["It was essential", "It added little and could be removed", "It doubled accuracy", "It only helped translation"], answer: 1, why: "RoBERTa found that removing NSP did not hurt and often helped." }
  ],
  next: "BERT proved pre-training works for understanding. OpenAI was betting on the other half of the Transformer: that simply predicting the next word on enough text would teach a model to do tasks nobody trained it for."
});
