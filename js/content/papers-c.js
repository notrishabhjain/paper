/* Stations 06–09: InstructGPT, LoRA, LLaMA, FlashAttention. */
Portal.addPaper({
  id: "instructgpt", num: 6, short: "InstructGPT", year: 2022, stage: "align", hours: 12,
  title: "Training language models to follow instructions with human feedback",
  authors: "Ouyang et al.", org: "OpenAI", arxiv: "2203.02155",
  oneLiner: "Fine-tune GPT-3 on human-written demonstrations, train a reward model on human rankings, then optimize against it with reinforcement learning. Labelers preferred the 1.3B result over the original 175B model.",
  story: {
    problem: "GPT-3 was trained to continue internet text, not to help. Asked a question, it might reply with more questions, make things up, or produce toxic text. A bigger model did not fix this, because the training objective itself was not what users wanted.",
    idea: "Let people define “helpful”. Step 1: labelers write ideal answers, and the model is fine-tuned on them ([[sft|SFT]]). Step 2: labelers rank several model answers, and a [[reward-model|reward model]] learns their preferences. Step 3: the model is optimized against the reward model with [[ppo|PPO]], with a [[kl-penalty|penalty]] for drifting too far from the SFT model.",
    result: "Labelers preferred the 1.3B InstructGPT over the 175B GPT-3, despite 100× fewer parameters. The 175B InstructGPT was preferred over GPT-3 85% of the time, [[hallucination|made up facts]] about half as often on closed-domain tasks (21% vs. 41%), and was more truthful. Measured bias did not improve."
  },
  analogy: "GPT-3 is a brilliant intern who has read everything but never had a job. InstructGPT is the same intern after shadowing experts (SFT), getting feedback on drafts (the reward model), and practicing thousands of times with a coach (reinforcement learning).",
  whyPM: "This is the paper that most directly involves PMs. An aligned model's quality depends on labeling guidelines, labeler selection, definitions of “helpful” and “harmful”, and preference-based evaluation. ChatGPT was built with this recipe. Running a human-feedback program is product and operations work as much as ML work.",
  figures: [
    { w: "rlhf", title: "The three-step recipe", text: "Click each step to see its inputs, what the humans do, and what gets trained.", takeaway: "Human time goes into steps 1 and 2. Step 3 scales without people, which is both its power and its risk." },
    { w: "ranking", title: "Be the labeler", text: "Rank four answers to the same prompt. Your ranking turns into pairwise comparisons, and a reward model learns scores from them.", takeaway: "Ranking is faster and more consistent than writing ideal answers, and K answers yield K(K−1)/2 training pairs. But the reward model can only learn the preferences your labelers express." },
    { w: "klleash", title: "Why reinforcement learning needs a leash", text: "Slide the KL penalty. With none, the model learns to exploit the reward model; with too much, it barely changes.", takeaway: "[[reward-hacking|Reward hacking]] is Goodhart's law for AI. The KL penalty, and fresh human evaluation, keep the optimization honest." }
  ],
  concepts: [
    { name: "Alignment", plain: "Making a model do what its users intend, not just continue text.", how: "The paper frames the goal as helpful, honest, and harmless. Next-token prediction on internet text optimizes for plausible text, which is a different objective.", product: "“Aligned to whom?” is a product question. Here, preferences came from about 40 contractors following the researchers' guidelines, on prompts from API customers: a specific population, not everyone." },
    { name: "Supervised fine-tuning (SFT)", plain: "Imitate examples of ideal answers written by people.", how: "About 13,000 prompts with labeler-written demonstrations. GPT-3 was fine-tuned on them for 16 epochs; the model overfit on validation loss after one, yet extra epochs still improved human ratings.", product: "Demonstrations are slow and expensive to write, and quality beats quantity. Choose prompts that represent real usage." },
    { name: "Reward model", plain: "A model that predicts which answer people would prefer.", how: "Labelers ranked 4 to 9 answers per prompt for about 33,000 prompts. A 6B model was trained so the preferred answer in each pair scores higher, with loss −log σ(r_preferred − r_rejected).", product: "The reward model encodes your guidelines as labelers applied them. If the guideline says “be concise” but labelers reward long answers, the model learns the labelers' behavior." },
    { name: "PPO with a KL penalty", plain: "Practice against the reward model without drifting too far from the start.", how: "The policy answers about 31,000 prompts and is updated to increase reward minus β × KL divergence from the SFT model. Without the penalty, it finds outputs that score high but are not actually better.", product: "When an assistant turns sycophantic or verbose after an update, reward hacking is a prime suspect. Human evaluation, not reward scores, is the ground truth." },
    { name: "The alignment tax and PPO-ptx", plain: "Alignment can make a model worse at other tasks.", how: "RLHF caused drops on some public benchmarks (SQuAD, DROP, HellaSwag, translation). Mixing pre-training gradients into PPO updates (PPO-ptx) reduced the drops without hurting labeler preference.", product: "Re-run your core capability tests after any alignment or safety tuning. Regressions hide in tasks nobody re-checked." },
    { name: "Human evaluation as the metric", plain: "The headline result is people's preference, not a benchmark score.", how: "Held-out labelers, who produced no training data, compared outputs and rated them 1–7 and on attributes such as following instructions and making things up. Labelers agreed with each other about 73–77% of the time.", product: "Design preference tests with held-out raters, clear rubrics, and measured agreement. “It feels better” is not an evaluation." }
  ],
  terms: ["alignment", "instruction-following", "rlhf", "sft", "reward-model", "ppo", "kl-penalty", "reward-hacking", "alignment-tax", "preference-data", "human-eval", "llm-judge", "hallucination", "labeling", "dpo"],
  code: {
    title: "The reward model's training objective, and its use in PPO", lang: "Python (PyTorch)",
    lines: [
      ["r_good = reward_model(prompt, preferred_answer)", "Score the answer labelers preferred: one number."],
      ["r_bad = reward_model(prompt, rejected_answer)", "Score the answer they ranked lower."],
      ["loss = -torch.log(torch.sigmoid(r_good - r_bad))", "Small when the preferred answer scores clearly higher; large when the order is wrong. This is the paper's equation 1."],
      ["loss.backward(); optimizer.step()", "Nudge the reward model toward the labelers' preferences."],
      ["", ""],
      ["# Step 3, during PPO:", "The trained reward model now acts as the grader."],
      ["reward = reward_model(prompt, policy_answer)", "Grade the policy's new answer."],
      ["reward -= beta * kl(policy, sft_model, prompt, policy_answer)", "Subtract the [[kl-penalty|KL penalty]] for drifting away from the SFT model."],
      ["ppo_update(policy, reward)", "Make high-reward answers slightly more likely next time."]
    ]
  },
  numbers: [
    { value: "1.3B > 175B", label: "labelers preferred the small InstructGPT's answers to the original GPT-3's" },
    { value: "≈ 40", label: "contractors labeled the data, selected with a screening test" },
    { value: "85%", label: "of comparisons favored 175B InstructGPT over 175B GPT-3" },
    { value: "21% vs. 41%", label: "[[hallucination]] rate on closed-domain tasks, InstructGPT versus GPT-3" }
  ],
  lab: {
    summary: "Run the post-training pipeline at small scale: supervised fine-tuning, then preference tuning. You will use DPO, a simpler 2023 successor to the reward-model-plus-PPO steps, because it runs on a free GPU. Designing the labeling guideline is the part most like your future job.",
    time: "10–12 hours", compute: "Free Colab T4 GPU", tools: "Hugging Face TRL and PEFT; a small open model such as Qwen2.5-0.5B or SmolLM2-360M",
    steps: [
      { name: "Reproduce", goal: "Turn a small base model into an instruction follower with SFT, then improve it with preference tuning.",
        do: ["Test a small base model on 10 instructions. It will often ramble or continue the question.", "Run SFT on a public instruction dataset, then DPO on a public preference dataset.", "Compare base, SFT, and SFT + DPO answers on the same 10 instructions."],
        prompt: "Using Hugging Face TRL with LoRA (to fit a T4), run a minimal InstructGPT-style pipeline on a small base model ('Qwen/Qwen2.5-0.5B' or 'HuggingFaceTB/SmolLM2-360M'). Step A, SFT: train on 2,000 examples from a public instruction dataset (for example 'HuggingFaceH4/no_robots') for 1 epoch using the model's chat template. Step B, preference tuning: run DPO from the SFT model on 2,000 pairs from a public preference dataset (for example 'trl-lib/ultrafeedback_binarized') with beta 0.1. Save the base, SFT, and SFT+DPO checkpoints. Generate answers to 10 instructions I provide with each (temperature 0.7, max 200 tokens) and show them side by side. Explain in a markdown cell how DPO relates to the paper's reward model and PPO steps.\nAcceptance criteria: under 60 minutes on a T4; three checkpoints; a side-by-side table.",
        observe: ["How the base model fails at instructions.", "What SFT fixes, and what DPO changes on top: often tone, length, and refusals."],
        done: "A side-by-side table for 10 instructions and a paragraph on what each stage changed." },
      { name: "Your own data", goal: "Design and run a tiny human-feedback program for a task from your work.",
        ideas: ["Support replies in your company's tone", "Turning messy meeting notes into action items", "Writing release notes from a list of tickets", "Explaining a technical concept to a non-technical stakeholder"],
        do: ["Write a one-page labeling guideline: what makes an answer good, with good and bad examples.", "Write 50 prompts, generate two answers each with your SFT model, and pick the better one using your guideline.", "Measure agreement with a colleague on 20 pairs, then DPO-train on your pairs."],
        prompt: "Help me run a small preference-data project. (1) Generate two diverse answers (temperature 1.0, different seeds) from my SFT model for each of 50 prompts in a CSV I upload. (2) Build a simple labeling loop in the notebook that shows both answers in random order and records which I prefer, with an optional 'tie'; save to CSV. (3) Compute agreement between my labels and a second labeler's CSV. (4) DPO-train the SFT model on my preference pairs (beta 0.1, LoRA). (5) Run a blind side-by-side of SFT vs. DPO answers on 15 new prompts in random order and compute my win rate for the DPO model.",
        observe: ["Where you and your colleague disagree: those are gaps in the guideline.", "Whether 50 pairs move the model at all, and in which direction."],
        done: "A labeling guideline, an agreement percentage, and a blind win rate." },
      { name: "Baselines", goal: "Measure how far each stage gets you, by blind preference.",
        table: [["Baseline", "What it tells you", "Expect"], ["Base model with a good prompt", "How far prompting alone goes", "Weak instruction following at small sizes"], ["SFT only", "The value of demonstrations", "A big jump in following instructions"], ["SFT + DPO on public preferences", "Generic preference tuning", "Changes in tone and length; modest wins"], ["SFT + DPO on your preferences", "Task-specific alignment", "Best on your task, if labels are consistent"]],
        prompt: "For 20 held-out prompts from my task, generate answers from all four variants. Run (a) my blind pairwise ratings against the SFT baseline and (b) an LLM-as-judge comparison if I provide an API key, using a rubric based on my labeling guideline. Report win/tie/loss rates for each variant, average answer length, and where the LLM judge disagreed with me.",
        done: "A win-rate table, with a note on where an automated judge and your own judgment differ." },
      { name: "Failure log", goal: "Record what went wrong in the data, the training, and the evaluation.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Answers get longer and gushier", "Preference data or the judge rewards length: a form of reward hacking", "Add length guidance to the guideline; compare at equal length"], ["You and a colleague disagree on 40% of pairs", "The guideline is ambiguous", "Rewrite it with worked examples, then relabel"], ["DPO makes the model worse at everything", "Learning rate or beta too aggressive, or noisy labels", "Lower the learning rate, raise beta, clean the labels"], ["The model refuses harmless requests", "Preference data over-rewarded caution", "Add helpful answers to borderline prompts"], ["Garbled output after training", "Chat template mismatch between training and generation", "Use the model's own chat template everywhere"]],
        done: "Failure entries, including at least one about the guideline or labels rather than code." }
    ]
  },
  pm: [
    { q: "Who decides what “good” means?", a: "You do, through labeling guidelines. They are a product spec for model behavior: version them, test them for agreement, and review them with policy and legal." },
    { q: "How should we evaluate an assistant?", a: "Blind side-by-side preference tests with held-out raters and a rubric, plus your core capability tests to catch the alignment tax." },
    { q: "What does a feedback program cost?", a: "Labeler time, tooling, quality review, and iterations on guidelines. Plan it like an operations team, with throughput, quality metrics, and a budget." },
    { q: "Can we use an LLM as the judge?", a: "As a fast first pass, yes. Calibrate it against human ratings regularly: judges favor longer answers and their own style." }
  ],
  reading: [
    "Read the abstract and Figure 1: preference win rates by model size, including the 1.3B-beats-175B result.",
    "Study Figure 2, the three-step diagram, next to Figure 6.1 on this page.",
    "Read Section 3.4 on the labelers and Section 3.5 on the SFT, reward, and RL models.",
    "Read Section 4.1 (results on real API prompts) and Section 4.2 (public datasets and the alignment tax).",
    "Read Section 5.2, “Who are we aligning to?”: the most PM-relevant page on this route.",
    "Skim the appendix's labeling instructions to see what a real guideline looks like."
  ],
  quiz: [
    { q: "Why rank answers instead of only writing ideal ones?", options: ["Ranking is cheaper, faster, and more consistent, and one ranking yields many training pairs", "Rankings are more creative", "Writing is not allowed", "Rankings need no guidelines"], answer: 0, why: "Comparing is easier than authoring, and ranking K answers gives K(K−1)/2 pairs." },
    { q: "What does the KL penalty prevent?", options: ["Overfitting the tokenizer", "The policy drifting into strange outputs that fool the reward model", "Labelers disagreeing", "Long training times"], answer: 1, why: "It keeps the policy close to the SFT model so it cannot exploit flaws in the reward model." },
    { q: "After an RLHF update, reward scores rose but users say the assistant is wordy and flattering. Likely cause?", options: ["The tokenizer changed", "Reward hacking: the reward model over-scores length and flattery", "Too few parameters", "The KL penalty was too high"], answer: 1, why: "The policy found what the reward model likes, not what users want. Confirm with human evaluation, then fix the data or the penalty." },
    { q: "What is the alignment tax?", options: ["A licensing fee", "Performance lost on other tasks after alignment training", "The cost of labelers", "Extra latency"], answer: 1, why: "InstructGPT regressed on some public benchmarks; mixing in pre-training data (PPO-ptx) reduced the drop." }
  ],
  next: "InstructGPT showed that a small amount of targeted training on top of a big model changes its behavior dramatically. If fine-tuning is that valuable, can it be cheap enough for every team and every customer? A 2021 Microsoft paper had already shown how."
});

Portal.addPaper({
  id: "lora", num: 7, short: "LoRA", year: 2021, stage: "adapt", hours: 10,
  title: "LoRA: Low-Rank Adaptation of Large Language Models",
  authors: "Hu et al.", org: "Microsoft", arxiv: "2106.09685",
  oneLiner: "Freeze the pre-trained model and train two tiny matrices beside each chosen weight matrix. For GPT-3, that cut trainable parameters by 10,000× and GPU memory by 3×, with no added latency and quality on par with full fine-tuning.",
  story: {
    problem: "[[full-fine-tuning|Full fine-tuning]] updates every parameter. For GPT-3 that means 175B trainable parameters, memory for all their gradients and optimizer state, and a 350 GB copy of the model for every task or customer. Earlier lightweight methods added latency (adapter layers) or used up context length (prefix tuning).",
    idea: "The change fine-tuning makes to a weight matrix has low intrinsic rank, so it can be approximated by the product of two thin matrices. Freeze W and learn ΔW = B × A, where B is d × r and A is r × d, with r as small as 1 to 8. After training, add B × A into W, so inference costs nothing extra.",
    result: "On RoBERTa, DeBERTa, GPT-2, and GPT-3, LoRA matched or beat full fine-tuning. For GPT-3 175B: 10,000× fewer trainable parameters, training memory down from 1.2 TB to 350 GB, a 35 MB checkpoint instead of 350 GB, and 25% faster training."
  },
  analogy: "Instead of reprinting a 1,000-page manual for every customer, you print one manual and give each customer a two-page addendum. Swapping addenda is instant, and the manual never changes.",
  whyPM: "LoRA is why fine-tuning is now an everyday option rather than a research project. It changes the economics of customization: experiments cost tens of dollars, one base model can serve hundreds of customer-specific [[adapter|adapters]], and rolling back means swapping a small file. Most fine-tuning services you will buy or build use LoRA or a variant such as QLoRA.",
  figures: [
    { w: "lora", title: "A big frozen matrix plus a thin update", text: "Choose a model, which matrices to adapt, and the rank r. The shapes are drawn to scale; the numbers show what you train and store.", takeaway: "The update has 2 × d × r numbers instead of d². At rank 4 on GPT-3's query and value matrices, that is about 0.01% of the model." },
    { w: "adapters", title: "One base model, many adapters", text: "Switch adapters on the same base model, then add customers and compare storage with keeping a full fine-tuned copy for each.", takeaway: "Multi-tenant serving becomes practical: one copy of the base model in GPU memory, with small adapters loaded per request or per customer." }
  ],
  concepts: [
    { name: "Low-rank update", plain: "Fine-tuning changes can be squeezed into two thin matrices.", how: "For a frozen weight W (d × k), LoRA learns B (d × r) and A (r × k) with r much smaller than d. The layer computes Wx + BAx. A starts random and B starts at zero, so training begins exactly at the pre-trained model.", product: "Trainable parameters drop from millions per matrix to thousands, which is what lets fine-tuning fit on a single GPU." },
    { name: "Rank r", plain: "The width of the thin matrices: how many directions of change the update can express.", how: "Very low ranks, even 1 or 2 on GPT-3's query and value matrices, were competitive with higher ones. The update is scaled by α / r so the learning rate need not be retuned when r changes.", product: "Rank is a quality-versus-size dial, but bigger rarely helps much. Ask the team to justify ranks above 16 with an experiment." },
    { name: "Which matrices to adapt", plain: "LoRA can wrap any weight matrix; the paper focused on attention.", how: "With a fixed budget of trainable parameters, adapting both the query and value projections (W_q, W_v) worked best. Later practice often adapts every linear layer, including the MLP.", product: "The choice changes adapter size and quality. Libraries such as Hugging Face PEFT make it a one-line setting, so test two or three options." },
    { name: "No extra inference latency", plain: "After training, the update merges into the original weights.", how: "W′ = W + BA has the same shape as W, so the merged model runs exactly as fast as the base model. Adapter layers, an earlier method, added sequential steps and measurable latency.", product: "Merge for the fastest single-task serving, or keep adapters separate to switch tasks per request." },
    { name: "Memory and storage savings", plain: "Far less GPU memory to train, and tiny files to store.", how: "Frozen weights need no gradients or optimizer state. For GPT-3 175B, training memory fell from 1.2 TB to 350 GB, and each task's checkpoint shrank from 350 GB to about 35 MB.", product: "Per-customer fine-tunes become affordable to train, store, and version. QLoRA (2023) went further by quantizing the frozen base to 4 bits." },
    { name: "When LoRA is not enough", plain: "Low rank suits adapting behavior, less so teaching lots of new knowledge.", how: "The paper's tasks were classification, natural-language-to-SQL, and dialogue summarization. Teaching a new language or a large body of facts can need higher ranks, full fine-tuning, or continued pre-training.", product: "Use LoRA for style, format, and task behavior. For “know our 50,000 documents”, start with retrieval ([[rag|RAG]])." }
  ],
  terms: ["lora", "peft", "rank", "adapter", "full-fine-tuning", "fine-tuning", "checkpoint", "parameter", "quantization", "inference", "latency", "matrix"],
  code: {
    title: "A LoRA layer", lang: "Python (PyTorch)",
    lines: [
      ["class LoRALinear(nn.Module):", "Wraps one existing weight matrix of the model."],
      ["    def __init__(self, base, r=8, alpha=16):", "Takes the frozen layer, the [[rank]] r, and a scaling factor."],
      ["        super().__init__()", ""],
      ["        self.base = base", "The original pre-trained layer…"],
      ["        self.base.weight.requires_grad = False", "…frozen: it will not change during training."],
      ["        d_out, d_in = base.weight.shape", "Read the matrix size, for example 4,096 × 4,096."],
      ["        self.A = nn.Parameter(torch.randn(r, d_in) * 0.01)", "Thin matrix A (r × d_in), started with small random numbers."],
      ["        self.B = nn.Parameter(torch.zeros(d_out, r))", "Thin matrix B (d_out × r), started at zero, so the model begins unchanged."],
      ["        self.scale = alpha / r", "Scaling so a new r does not need a new learning rate."],
      ["    def forward(self, x):", "When data flows through the layer:"],
      ["        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale", "The original output plus a small learned correction. Only A and B are trained."]
    ]
  },
  numbers: [
    { value: "10,000×", label: "fewer trainable [[parameter|parameters]] than full fine-tuning on GPT-3" },
    { value: "350 GB → 35 MB", label: "per-task [[checkpoint]] for GPT-3 (rank 4, query and value matrices)" },
    { value: "1.2 TB → 350 GB", label: "GPU memory needed to fine-tune GPT-3 175B" },
    { value: "0 ms", label: "added inference latency once the update is merged into the weights" }
  ],
  lab: {
    summary: "Fine-tune with LoRA on a free GPU, measure what it costs and gains, and compare it with full fine-tuning and prompting.",
    time: "8–10 hours", compute: "Free Colab T4 GPU", tools: "Hugging Face PEFT, TRL, bitsandbytes",
    steps: [
      { name: "Reproduce", goal: "Reproduce LoRA's core claim at small scale: near full fine-tuning quality with a tiny share of trainable parameters.",
        do: ["Fine-tune RoBERTa-base on a GLUE task (MRPC or SST-2) twice: full fine-tuning and LoRA (rank 8, query and value).", "Record trainable parameters, peak GPU memory, training time, checkpoint size, and accuracy.", "Compare with the paper's Table 2 numbers for RoBERTa-base."],
        prompt: "Reproduce LoRA's main result at small scale. Fine-tune 'roberta-base' on GLUE MRPC (or SST-2 if I say so) twice with the same seed and epochs: (1) full fine-tuning, lr 2e-5; (2) LoRA via Hugging Face PEFT with r=8, alpha=16, target modules query and value, lr 4e-4. For each run report trainable parameters (and % of total), peak GPU memory (torch.cuda.max_memory_allocated), training time, saved checkpoint size on disk, and validation accuracy/F1. Present a comparison table and put the RoBERTa-base values from Table 2 of the LoRA paper next to mine.\nAcceptance criteria: both runs finish within 40 minutes on a T4.",
        observe: ["How close LoRA's accuracy is to full fine-tuning.", "The checkpoint size difference: megabytes versus hundreds of megabytes."],
        done: "A five-column comparison table you could put on a slide." },
      { name: "Your own data", goal: "LoRA-tune a small generative model to do a task from your work, in your format.",
        ideas: ["Turn bug reports into structured JSON (title, severity, component, steps)", "Rewrite release notes in your brand voice", "Summarize customer calls into a fixed template", "Answer FAQ questions in your support style"],
        do: ["Create 300–1,000 input/output pairs in a JSONL file. You can draft them with a large model and fix them by hand.", "QLoRA-tune a small instruct model (0.5B–3B) for one to three epochs.", "Evaluate on 50 held-out examples with a task check, such as valid JSON and correct fields."],
        prompt: "QLoRA-fine-tune 'Qwen/Qwen2.5-1.5B-Instruct' (4-bit base via bitsandbytes) with TRL's SFTTrainer on a JSONL file I upload with 'input' and 'output' fields, formatted with the model's chat template. Use r=16, alpha=32, all linear layers, lr 2e-4, 2 epochs, max length 1024, and a 10% validation split. Then evaluate on my 50-example test file: for structured outputs, report the share of valid JSON and per-field exact match; otherwise show 10 side-by-side outputs of base vs. tuned. Save the adapter separately and print its size.",
        observe: ["Which errors disappear after tuning (format, tone) and which remain (facts).", "How the adapter's size compares with the base model."],
        done: "A before-and-after table on 50 test items, and the adapter's file size." },
      { name: "Baselines", goal: "Decide whether fine-tuning beats prompting for your task, and which rank to use.",
        table: [["Baseline", "What it tells you", "Expect"], ["Base instruct model, zero-shot", "The no-training floor", "Format drift and a generic tone"], ["Base model, 5-shot prompt", "GPT-3's approach", "Better format; longer, costlier prompts"], ["LoRA at r = 4, 16, 64", "The rank dial", "Small differences; r = 16 is often enough"], ["Full fine-tune of a tiny model (optional)", "LoRA versus full on equal footing", "Similar quality, much bigger checkpoint"]],
        prompt: "On my 50 test items, compare: the zero-shot base model, a 5-shot base model, and LoRA adapters trained with r = 4, 16, and 64 (same data and steps). Report the task metric, average prompt tokens per request, generation latency, trainable parameters, and adapter size in one table, plus a cost estimate per 1M requests at a GPU price I give you.",
        done: "A recommended approach and rank, with the table to back it up." },
      { name: "Failure log", goal: "Record the settings that broke training and the ones that fixed it.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Loss does not move", "Learning rate too low for LoRA (it needs higher rates than full fine-tuning) or wrong target modules", "Try 1e-4 to 3e-4; print which modules were wrapped"], ["Output ignores the trained format", "Chat template mismatch between training and inference", "Use the same template and special tokens in both"], ["Great on training examples, poor on test", "Overfitting a small dataset", "Fewer epochs, more diverse examples, lower rank"], ["Model forgets general skills", "Too many epochs or too high a rank on narrow data", "Fewer steps; mix in general instruction data"], ["Out of memory on a T4", "Full-precision base or long sequences", "4-bit QLoRA, shorter max length, gradient checkpointing"]],
        done: "Failure entries, each with the exact settings that fixed it." }
    ]
  },
  pm: [
    { q: "Should we fine-tune at all?", a: "Fine-tune for consistent format, tone, or task behavior at volume. For knowledge that changes, use retrieval. Compare against a strong prompt first; the toolkit's decision helper walks through it." },
    { q: "One model per customer?", a: "With LoRA, yes: one shared base and a small adapter each. Plan adapter versioning, per-adapter evaluation, and rollback." },
    { q: "What does an experiment cost?", a: "A small LoRA run on 1,000 examples takes minutes to an hour on one GPU. The real cost is building a good dataset and evaluation set." },
    { q: "Who owns the training data?", a: "Customer-specific adapters raise questions of consent, isolation between customers, and deletion. Settle them before the first run." }
  ],
  reading: [
    "Read the abstract, Section 1, and Figure 1 (the reparametrization diagram).",
    "Read Section 4.1 on the method, including initialization and the α/r scaling.",
    "Look at Table 2 (RoBERTa and DeBERTa) and Table 4 (GPT-3): LoRA versus full fine-tuning and other methods.",
    "Read Sections 7.1 and 7.2 (Tables 5 and 6) on which matrices to adapt and how low the rank can go.",
    "Skim Section 7.3 on why low-rank updates work.",
    "Follow-up: the QLoRA paper (Dettmers et al., 2023) for 4-bit fine-tuning on a single GPU."
  ],
  quiz: [
    { q: "What does LoRA train?", options: ["All weights at lower precision", "Two small matrices per adapted weight matrix, with the original weights frozen", "Only the output layer", "A new tokenizer"], answer: 1, why: "W stays frozen; the trainable update is B × A with a small rank r." },
    { q: "Why does LoRA add no inference latency?", options: ["It runs on a separate GPU", "B × A can be merged into W after training, giving a matrix of the same shape", "It skips layers", "It uses a smaller vocabulary"], answer: 1, why: "The merged weight W + BA is computed once, and the model then runs exactly like the original." },
    { q: "You serve 200 enterprise customers who each want their own tone and templates. What does LoRA enable?", options: ["Training 200 full models", "One base model with 200 small adapters swapped per request", "A single shared prompt", "Nothing new"], answer: 1, why: "Adapters are megabytes, not gigabytes, so many can share one base in production." },
    { q: "Why is B initialized to zero?", options: ["To save memory", "So training starts exactly at the pre-trained model's behavior", "To speed up inference", "Because A is zero too"], answer: 1, why: "With B = 0, the update BA is zero, so the model starts unchanged and moves away gradually." }
  ],
  next: "LoRA made adapting a model cheap, but you still needed a strong base model, and the best ones sat behind APIs. In early 2023 Meta released LLaMA: strong models trained only on public data, small enough for researchers to run, and the base for a wave of open fine-tunes."
});

Portal.addPaper({
  id: "llama", num: 8, short: "LLaMA", year: 2023, stage: "pretrain", hours: 10,
  title: "LLaMA: Open and Efficient Foundation Language Models",
  authors: "Touvron et al.", org: "Meta AI", arxiv: "2302.13971",
  oneLiner: "Models from 7B to 65B parameters, trained only on public data and far past the Chinchilla ratio. LLaMA-13B beat GPT-3 175B on most benchmarks, and its release to researchers started the open-weights era.",
  story: {
    problem: "The strongest models were closed, trained on undisclosed data, and too large to run outside a big lab. Chinchilla optimized training compute but ignored the cost of serving a model to millions of users.",
    idea: "Optimize for inference: train smaller models on far more tokens than compute-optimal (1T tokens for 7B, 1.4T for 65B), using only publicly available data. Combine proven architecture tweaks: pre-normalization with [[rmsnorm|RMSNorm]], [[swiglu|SwiGLU]] activations, and [[rope|rotary embeddings]].",
    result: "LLaMA-13B beat GPT-3 (175B) on most benchmarks while fitting on a single GPU, and LLaMA-65B was competitive with Chinchilla-70B and PaLM-540B. The 7B model was still improving after 1T tokens. Weights went to researchers under a non-commercial license and leaked publicly within about a week."
  },
  analogy: "Chinchilla asked: what is the best car this factory budget can build? LLaMA asked: what car is cheapest to drive every day for years? The answer was a smaller, very well-tuned engine, even if it takes longer to build.",
  whyPM: "LLaMA is why “should we self-host an open model?” is a real option in build-versus-buy decisions. It also models the inference-first mindset: you pay for training once and for serving forever. Open weights bring control, privacy, and customization, along with license terms, safety work, and infrastructure you must own.",
  figures: [
    { w: "llamadiff", title: "What LLaMA changed in the Transformer", text: "Click a row to see why the change helps. Every change was borrowed from an earlier model, then combined.", takeaway: "No single breakthrough: careful engineering that combines proven ideas. That is how most real progress looks." },
    { w: "datamix", title: "Trained only on public data", text: "The pre-training mix from the paper's Table 1. Hover a segment for its share and how many times it was seen.", takeaway: "Small, high-quality sources such as Wikipedia and books were seen more than twice; the web crawl about once. The data mix is a design decision, and here anyone could in principle rebuild it." },
    { w: "rope", title: "Rotary position embeddings", text: "Each position rotates the query and key vectors. Move the positions, then shift both by the same amount.", takeaway: "Attention scores depend on how far apart two tokens are, not where they sit. That makes position handling cleaner and easier to stretch to longer contexts." },
    { w: "scale", opts: { mode: "ratio" }, title: "Trained past the optimum, on purpose", text: "Tokens per parameter for each model. Compare the LLaMA models with Chinchilla's 20.", takeaway: "LLaMA-7B saw about 150 tokens per parameter: wasteful by training-compute standards, but a much better model for its size, and size is what you pay for at inference." }
  ],
  concepts: [
    { name: "Inference-optimal training", plain: "Train a smaller model for longer, because serving cost is what adds up.", how: "The Chinchilla rule would give a 7B model about 140B tokens. LLaMA trained it on 1T and found it still improving. The extra training compute buys a better model at the same serving cost.", product: "When a model will serve heavy traffic, ask for the smallest model that meets the quality bar, trained as long as data allows." },
    { name: "Public data only", plain: "Every training source was publicly available.", how: "CommonCrawl (67%, filtered with a classifier trained to recognize pages cited by Wikipedia), C4 (15%), GitHub (4.5%), Wikipedia in 20 languages (4.5%), books (4.5%), arXiv (2.5%), and StackExchange (2%): about 1.4T tokens after tokenization.", product: "Data provenance matters for compliance and trust. Even “public” data raises licensing and copyright questions, and some datasets used then have since been challenged." },
    { name: "Architecture tweaks", plain: "Three borrowed improvements to the standard Transformer.", how: "Pre-normalization with RMSNorm (the pre-norm idea from GPT-3), the SwiGLU activation (from PaLM), and rotary position embeddings (from GPT-Neo). Context length stayed at 2,048 tokens.", product: "On model cards, these names signal a “LLaMA-style” architecture, which most open models still use." },
    { name: "Efficient training", plain: "Engineering that made a 65B model trainable in about three weeks.", how: "A memory-efficient causal attention (from the xformers library) that avoids storing attention weights and skips masked work, saved activations to limit recomputation, and overlapped communication with computation: about 380 tokens per second per GPU on 2,048 A100s.", product: "Training-stack efficiency is a cost lever as big as model choice. The same budget buys more or less depending on it." },
    { name: "Open weights and their trade-offs", plain: "Download and run the model yourself.", how: "LLaMA went to researchers under a non-commercial license. The weights spread widely, fine-tunes such as Alpaca and Vicuna followed within weeks, and Llama 2 (mid-2023) came with a commercial license.", product: "[[open-weights|Open weights]] give control over data, latency, and customization. You take on serving infrastructure, safety testing, and license compliance." },
    { name: "Reporting cost and carbon", plain: "The paper reports the energy and emissions of training.", how: "Developing all the models took about five months on 2,048 A100-80GB GPUs, an estimated 2,638 MWh and 1,015 tonnes of CO₂-equivalent.", product: "Customers and regulators increasingly ask about energy use. Ask vendors for training and serving figures." }
  ],
  terms: ["open-weights", "rmsnorm", "swiglu", "rope", "data-mix", "deduplication", "tokens-per-param", "inference", "quantization", "foundation-model", "compute-optimal", "kv-cache"],
  code: {
    title: "The three LLaMA tweaks", lang: "Python (PyTorch)",
    lines: [
      ["def rms_norm(x, weight, eps=1e-6):", "[[rmsnorm|RMSNorm]]: rescale each token's vector…"],
      ["    return x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + eps) * weight", "…by its root-mean-square. Unlike LayerNorm there is no mean subtraction, so it is a little cheaper."],
      ["", ""],
      ["def swiglu_ffn(x, W_gate, W_up, W_down):", "[[swiglu|SwiGLU]] feed-forward block, with three matrices instead of two."],
      ["    gate = F.silu(x @ W_gate)", "One branch computes a smooth on/off gate for each hidden unit."],
      ["    return (gate * (x @ W_up)) @ W_down", "The gate scales the other branch; the result is projected back down."],
      ["", ""],
      ["def apply_rope(q, k, cos, sin):", "[[rope|Rotary embeddings]]: rotate queries and keys by angles set by their positions."],
      ["    q_rot = q * cos + rotate_half(q) * sin", "Rotate pairs of numbers in the query…"],
      ["    k_rot = k * cos + rotate_half(k) * sin", "…and in the key, using the same position-based angles."],
      ["    return q_rot, k_rot", "Their dot product now depends only on the distance between the two positions."]
    ]
  },
  numbers: [
    { value: "13B > 175B", label: "LLaMA-13B beat GPT-3 on most benchmarks" },
    { value: "1.4T", label: "training tokens for the 33B and 65B models (1T for 7B and 13B)" },
    { value: "2,048 A100s", label: "trained LLaMA-65B in about 21 days" },
    { value: "32,000", label: "tokens in its SentencePiece BPE [[vocabulary]]" }
  ],
  lab: {
    summary: "Run a LLaMA-family model, find its architecture choices in the code, and test those choices on the small Transformer you built at Station 01.",
    time: "8–10 hours", compute: "Free Colab T4 GPU; optionally a laptop with Ollama", tools: "Hugging Face transformers and bitsandbytes; optionally Ollama or llama.cpp",
    steps: [
      { name: "Reproduce", goal: "Find RMSNorm, SwiGLU, and RoPE in a real open model, and reproduce the architecture choices as a toy ablation.",
        do: ["Load a small Llama-architecture model (TinyLlama 1.1B is ungated) and print its configuration and modules.", "Add RMSNorm, SwiGLU, and RoPE to your Station 01 model, one at a time.", "Train each variant on the same budget and compare validation loss."],
        prompt: "Part 1: Load 'TinyLlama/TinyLlama-1.1B-Chat-v1.0' in 16-bit. Print its config (layers, hidden size, heads, vocab size, rope_theta) and the module names in one decoder layer, and point out where RMSNorm, the SwiGLU MLP (gate_proj, up_proj, down_proj), and rotary embeddings appear. Generate answers to 3 prompts I give.\nPart 2: Add switches to my Station 01 GPT-style model that replace (a) LayerNorm with RMSNorm, (b) the GELU MLP with SwiGLU (hidden size 8/3 × d to keep the parameter count similar), and (c) learned absolute positions with RoPE. Train 5 variants with the same data, steps, and seed: baseline, +RMSNorm, +SwiGLU, +RoPE, and all three. Plot validation loss curves on one chart and give a table of final loss, parameter count, and time per step.\nAcceptance criteria: Part 2 runs in under 60 minutes on a T4.",
        observe: ["Which change helps most at this small scale; it may differ from large models.", "Whether the combined LLaMA-style model beats the baseline."],
        done: "An ablation chart, a table, and a sentence on whether small-scale results match the paper's choices." },
      { name: "Your own data", goal: "Decide whether an open model could handle a task from your work without an API.",
        ideas: ["Answering questions over your public documentation, with the text in the prompt", "Classifying or summarizing support tickets", "Drafting replies in your team's tone (with your Station 07 adapter)", "Extracting fields from invoices or forms (text only)"],
        do: ["Pick 30 real examples with expected outputs.", "Run them through a small open model at 16-bit and 4-bit.", "Score outputs with a simple rubric and record speed and memory."],
        prompt: "Evaluate an open model on my task. Load 'Qwen/Qwen2.5-1.5B-Instruct' (or a Llama 3.2 1B/3B Instruct model I have access to), first in 16-bit and then in 4-bit with bitsandbytes. For 30 examples in a CSV I upload (columns 'input', 'expected'), generate outputs at temperature 0.2. Measure tokens per second, peak GPU memory, and load time for each precision. Show outputs next to the expected answers and let me score each 0–2 in a simple input loop. Summarize quality, speed, and memory per precision in a table.",
        observe: ["How much quality 4-bit quantization costs on your task, if any.", "Whether the speed and memory would meet a real product's needs."],
        done: "A table of quality, speed, and memory, and a one-line build-versus-buy recommendation for this task." },
      { name: "Baselines", goal: "Compare open and closed options on the same task.",
        table: [["Baseline", "What it tells you", "Expect"], ["Small open model (1–3B), 4-bit", "The cheapest self-hosted option", "Fine for narrow tasks, weaker reasoning"], ["Larger open model (7–8B), 4-bit, if it fits", "The open-weights sweet spot", "Noticeably better; needs a bigger GPU"], ["Small open model + your LoRA adapter", "Customization instead of size", "Can beat the bigger untuned model on your task"], ["A frontier API model (optional)", "The quality ceiling", "Best quality; per-token cost; data leaves your network"]],
        prompt: "Run my 30-example evaluation for each available option: the small open model in 4-bit, a 7–8B open model in 4-bit if it fits, the small model with my Station 07 LoRA adapter, and an API model if I provide a key. Produce one table with average rubric score, tokens per second, GPU memory, and estimated cost per 1M requests (GPU-hour price for self-hosted, token price for the API).",
        done: "A build-versus-buy table covering quality, speed, cost, and data control." },
      { name: "Failure log", goal: "Record the setup, licensing, and quality problems you hit.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Model download refused", "Llama models require accepting Meta's license on Hugging Face", "Accept the license, then log in with an access token"], ["Garbled or endless output", "Wrong chat template or a missing end-of-sequence token", "Use the tokenizer's chat template; set a max token limit"], ["RoPE variant trains worse than baseline", "A rotation bug (wrong pairing or position offset)", "Check that q·k depends only on relative position, as in the figure above"], ["4-bit model gives poor answers", "Quantization hurts small models more", "Try 8-bit, or a slightly larger model in 4-bit"], ["Out of memory with long prompts", "The KV cache grows with context length", "Shorter prompts; check the toolkit's serving-memory calculator"]],
        done: "Failure entries, including one about licensing or setup, a real cost of open models." }
    ]
  },
  pm: [
    { q: "Build, buy, or self-host?", a: "Open models give control over data, latency, customization, and cost at scale. APIs give top quality and no infrastructure. Run the same evaluation on both before deciding." },
    { q: "What does the license allow?", a: "Open weights are not automatically open source. Check commercial use, user thresholds, attribution, and acceptable-use terms with legal." },
    { q: "How small can we go?", a: "Well-trained small models punch above their size. Find the smallest model that passes your evaluation, then add LoRA if needed." },
    { q: "Where did the training data come from?", a: "Ask for a data card. Provenance affects legal risk, customer trust, and the biases the model carries." }
  ],
  reading: [
    "Read the abstract, Section 1 (the inference-budget argument), and Table 1 (the data mix).",
    "Read Section 2.2 on architecture: three short paragraphs on RMSNorm, SwiGLU, and RoPE.",
    "Read Section 2.4 on efficient implementation; note the link to FlashAttention.",
    "Look at Figure 1 (training loss over tokens for each size) and Table 3 (common-sense reasoning).",
    "Skim Section 5 on bias, toxicity, and truthfulness, and Section 6 on carbon footprint.",
    "Follow-up: the Llama 2 paper (2023) for the chat-tuned, commercially licensed successor and its RLHF pipeline."
  ],
  quiz: [
    { q: "What did LLaMA optimize for that Chinchilla did not?", options: ["Training speed", "Inference cost: the best model for a given serving budget", "Number of GPUs", "Vocabulary size"], answer: 1, why: "Smaller models trained on more tokens cost more to train and less to serve, on every request." },
    { q: "LLaMA-7B was trained on 1T tokens. Compared with Chinchilla's rule, that is…", options: ["About right", "Far below it", "Far beyond it, about 150 tokens per parameter", "Impossible"], answer: 2, why: "Compute-optimal would be about 140B tokens. LLaMA went 7× further and the model was still improving." },
    { q: "Which change encodes position by rotating vectors?", options: ["RMSNorm", "SwiGLU", "RoPE", "Pre-normalization"], answer: 2, why: "Rotary embeddings rotate queries and keys by position, so attention depends on relative distance." },
    { q: "Legal asks whether “open weights” means you can use a model commercially. The right answer is…", options: ["Always yes", "Always no", "It depends on the license, so check it", "Only for models under 7B"], answer: 2, why: "LLaMA 1 was research-only; later Llama releases allowed commercial use with conditions. Licenses vary." }
  ],
  next: "LLaMA's efficient training leaned on a memory-efficient attention implementation. The paper that made that idea rigorous, and fast enough to change how every model is trained and served, is the last stop: FlashAttention."
});

Portal.addPaper({
  id: "flashattention", num: 9, short: "FlashAttention", year: 2022, stage: "efficiency", hours: 8,
  title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
  authors: "Dao, Fu, Ermon, Rudra, Ré", org: "Stanford University", arxiv: "2205.14135",
  oneLiner: "Attention was slow less because of the math than because of moving data between GPU memories. Computing it in tiles that stay in fast on-chip memory made training up to 3× faster and attention memory linear in sequence length, with exactly the same result.",
  story: {
    problem: "Attention's cost grows with the square of sequence length, which capped context windows. Many “efficient attention” methods approximated attention to save arithmetic, yet rarely ran faster in practice. The real bottleneck was [[memory-bound|memory traffic]]: standard attention writes the full N × N matrix to slow GPU memory ([[hbm|HBM]]) and reads it back several times.",
    idea: "Make attention [[io-aware|IO-aware]]. Split Q, K, and V into blocks that fit in fast on-chip [[sram|SRAM]], compute attention block by block ([[tiling]]), and combine the pieces with an online softmax that keeps running totals. Never write the N × N matrix; recompute it during the backward pass. Fuse every step into one GPU [[kernel]].",
    result: "Exact attention, not an approximation. BERT-large trained 15% faster than the MLPerf 1.1 record and GPT-2 3× faster than standard implementations, with attention memory linear in sequence length. It produced the first Transformers to beat chance on the Path-X (16K tokens) and Path-256 (64K) long-context tasks."
  },
  analogy: "Picture a huge spreadsheet job where your desk holds one page and the filing cabinet is down the hall. Standard attention walks every intermediate page to the cabinet and back. FlashAttention brings a few pages at a time, finishes everything it can at the desk, keeps a running tally, and files only the final answer.",
  whyPM: "FlashAttention is a big reason context windows grew from 2K to 100K+ tokens and serving costs keep falling. It teaches a lesson for any AI system: measure where time actually goes before optimizing. It is also a reminder that infrastructure work unlocks product features: long documents, faster responses, and a lower [[cost-per-token|cost per token]].",
  figures: [
    { w: "memhier", title: "The GPU memory hierarchy", text: "Compute is fast; moving data is slow. These are the A100 numbers the paper uses.", takeaway: "A GPU does math far faster than it can fetch data from HBM. Algorithms that keep data in SRAM win, even if they do extra arithmetic." },
    { w: "tiling", title: "Standard attention vs. FlashAttention", text: "Play both algorithms. Standard attention fills the whole N × N matrix in slow memory, then reads it back twice. FlashAttention works tile by tile and never stores it.", takeaway: "Same answer, a fraction of the slow-memory traffic. That is why it is faster despite recomputing some values." },
    { w: "flashmem", title: "Memory as sequences get longer", text: "Attention memory for one layer, standard versus FlashAttention. The horizontal line is one 80 GB GPU. Hover to compare.", takeaway: "Standard attention's memory grows with N²; at long contexts it alone outgrows a whole GPU. FlashAttention grows with N, which made long-context models practical." }
  ],
  concepts: [
    { name: "Memory-bound vs. compute-bound", plain: "Sometimes the GPU is waiting for data, not doing math.", how: "An operation is compute-bound when arithmetic dominates (large matrix multiplies) and [[memory-bound]] when reading and writing dominate (softmax, masking, dropout). Most of standard attention's time goes to memory traffic.", product: "When someone says a model is “slow”, ask where the time goes. Profiles often show data movement, not model size, is the bottleneck." },
    { name: "Tiling", plain: "Work on blocks small enough to fit in fast memory.", how: "Q, K, and V are split into blocks. Each block of K and V is loaded into SRAM once, and attention is computed for blocks of queries against it, with partial results kept in SRAM.", product: "The same principle drives batching, caching, and data pipelines: keep hot data close to where it is used." },
    { name: "Online softmax", plain: "Compute softmax in pieces by keeping a running maximum and sum.", how: "Softmax normally needs a whole row. FlashAttention keeps a running maximum and a running sum of exponentials per row, and rescales earlier partial outputs whenever a new block raises the maximum. The final result equals standard softmax exactly.", product: "Exactness matters: unlike approximate attention, there is no quality trade-off to evaluate." },
    { name: "Recomputation", plain: "Recompute rather than store, because recomputing is cheaper than reading slow memory.", how: "The backward pass needs the attention matrix. Instead of storing it (N² memory), FlashAttention keeps the output and the softmax statistics and recomputes attention blocks in SRAM. It does more arithmetic and still runs faster.", product: "Systems trade-offs are often counter-intuitive. Judge an optimization by measured speed and cost, not by operation counts." },
    { name: "Kernel fusion", plain: "Do every step in one GPU program.", how: "Matrix multiply, masking, softmax, dropout, and the second multiply run in a single [[kernel]], so intermediate results never leave SRAM. This took custom CUDA code rather than standard library calls.", product: "Specialized kernels are a competitive edge for model providers. Ask your platform or vendor which attention kernels they use." },
    { name: "Longer context, unlocked", plain: "Linear memory made much longer sequences practical.", how: "With memory linear in N, models could train on 16K–64K tokens on the same hardware. FlashAttention-2 (2023) and FlashAttention-3 (2024) raised GPU utilization further and are standard in PyTorch and inference servers.", product: "Long-context features (whole contracts, codebases, long chats) depend on this kind of work. Context length is an engineering budget, not only a model property." }
  ],
  terms: ["flashattention", "hbm", "sram", "tiling", "kernel", "memory-bound", "io-aware", "mixed-precision", "kv-cache", "latency", "throughput", "cost-per-token", "context-window"],
  code: {
    title: "Online softmax: attention one block at a time (one query row, simplified)", lang: "Python (NumPy-style)",
    lines: [
      ["m, l, out = -inf, 0.0, zeros(d)", "Running maximum score, running sum of weights, running output. These live in fast SRAM."],
      ["for K_blk, V_blk in blocks(K, V):", "Walk through keys and values one block at a time; the full N × N matrix never exists."],
      ["    s = q @ K_blk.T / sqrt(d)", "Attention scores for this block only."],
      ["    m_new = max(m, s.max())", "Update the running maximum, needed for a numerically safe softmax."],
      ["    scale = exp(m - m_new)", "If the maximum went up, earlier partial results must be scaled down to match."],
      ["    p = exp(s - m_new)", "Unnormalized softmax weights for this block."],
      ["    l = l * scale + p.sum()", "Update the running sum of weights."],
      ["    out = out * scale + p @ V_blk", "Rescale the old output and add this block's contribution."],
      ["    m = m_new", ""],
      ["return out / l", "Normalize once at the end. The result equals standard attention exactly."]
    ]
  },
  numbers: [
    { value: "3×", label: "faster GPT-2 training at sequence length 1K" },
    { value: "15%", label: "faster BERT-large training than the MLPerf 1.1 record" },
    { value: "N, not N²", label: "how attention memory grows with sequence length" },
    { value: "64K", label: "tokens in Path-256, where a Transformer first beat chance" }
  ],
  lab: {
    summary: "Benchmark exact attention implementations on a real GPU and see the memory wall for yourself. No CUDA programming needed: PyTorch ships FlashAttention-style kernels.",
    time: "6–8 hours", compute: "Free Colab T4 GPU (an L4 or A100 shows bigger gains)", tools: "PyTorch 2.x scaled_dot_product_attention",
    steps: [
      { name: "Reproduce", goal: "Reproduce the paper's core comparison: time and memory of standard versus fused attention as sequences grow.",
        do: ["Write naive attention (an explicit softmax of QKᵀ) and compare it with PyTorch's fused scaled_dot_product_attention.", "Sweep sequence length from 512 to 16K, recording time, peak memory, and where naive attention runs out of memory.", "Check that both give the same output within floating-point tolerance."],
        prompt: "Benchmark attention implementations in PyTorch on the GPU. Implement naive attention (Q @ K^T / sqrt(d), causal mask, softmax, @ V) and compare it with torch.nn.functional.scaled_dot_product_attention, forcing each backend in turn with torch.nn.attention.sdpa_kernel (FLASH_ATTENTION, EFFICIENT_ATTENTION, MATH). Skip backends the GPU does not support and say why (the T4 lacks FlashAttention-2 support; memory-efficient attention is the comparable tiled kernel there). Use fp16, batch 4, 16 heads, head dim 64, and sequence lengths 512, 1K, 2K, 4K, 8K, 16K. For each, measure forward+backward time (median of 10 runs after warmup) and peak memory (torch.cuda.max_memory_allocated, reset between runs); catch out-of-memory errors and record them as OOM. Verify outputs match naive attention within atol 1e-2 where both run. Plot time and memory vs. sequence length on log scales, one line per implementation.\nAcceptance criteria: under 20 minutes on a T4; two charts; one table.",
        observe: ["The sequence length where naive attention runs out of memory.", "How the slopes of the memory curves differ: one grows with N², the other with N."],
        done: "Two charts that echo the paper's benchmarks, and the out-of-memory point for naive attention on your GPU." },
      { name: "Your own data", goal: "Measure what efficient attention does for training on your own corpus with longer context.",
        ideas: ["Your Station 01 corpus with context raised from 128 to 1,024 tokens", "Long documents: contracts, transcripts, long-form articles", "Code files from an open-source repository"],
        do: ["Switch your Station 01 model's attention to scaled_dot_product_attention.", "Train with naive and fused attention at context lengths 256, 512, and 1,024.", "Record tokens per second, peak memory, and validation loss."],
        prompt: "Modify my Station 01 Transformer so attention can switch between my naive implementation and torch.nn.functional.scaled_dot_product_attention (is_causal=True). On my corpus, train for 500 steps at context lengths 256, 512, and 1024 (choose a batch size the naive version can fit, then use the same batch for the fused version), with fp16 mixed precision. Report tokens per second, peak memory, and final validation loss for each run in one table, and confirm the losses closely match between implementations at the same settings.",
        observe: ["Throughput gains growing with context length.", "Validation loss staying the same: the result is exact, only speed changes."],
        done: "A throughput and memory table with matching losses, and the longest context each version handled." },
      { name: "Baselines", goal: "Compare exact and approximate ways to make attention cheaper: the debate this paper settled.",
        table: [["Baseline", "What it tells you", "Expect"], ["Naive attention", "The speed and memory floor", "Out of memory at long sequences"], ["Fused exact attention (SDPA)", "FlashAttention's approach", "Same output, faster, linear memory"], ["Sliding-window attention (approximate)", "A typical approximation", "Cheap, but loses long-range information"], ["Shorter context (truncate inputs)", "The no-engineering option", "Fast, but the model never sees the rest"]],
        prompt: "On my corpus at context length 1024, compare: (1) naive attention, (2) fused SDPA, (3) sliding-window attention with a 128-token window implemented via an attention mask, and (4) training on sequences truncated to 256 tokens. Use the same steps and seed. Report tokens per second, peak memory, and validation loss evaluated at context length 1024 for all four, and explain which ones change model quality and why.",
        done: "A table showing that exact fused attention is the only option that is faster and loses nothing." },
      { name: "Failure log", goal: "Record what tripped up your benchmarks. Measuring speed is easy to get wrong.",
        table: [["Likely failure", "Why it happens", "What to try"], ["Flash backend reports “not supported”", "FlashAttention-2 kernels need Ampere or newer GPUs; the T4 is older", "Use the memory-efficient backend on a T4, or an L4 or A100"], ["Outputs differ slightly between versions", "fp16 rounding depends on the order of operations", "Compare with a tolerance (about 1e-2 in fp16), not exact equality"], ["No speedup at short sequences", "At small N, attention is a small share of total time", "Benchmark longer sequences; profile the whole model"], ["Timings jump around", "GPU warm-up and asynchronous execution", "Warm up, call torch.cuda.synchronize(), take medians"], ["Out of memory even with fused attention", "Weights, other activations, or the batch dominate", "Reduce the batch; enable gradient checkpointing"]],
        done: "Failure entries, including one about measurement method." }
    ]
  },
  pm: [
    { q: "Why is our long-context feature so expensive?", a: "Attention and the [[kv-cache|KV cache]] grow with context length. Ask which attention kernels your stack uses, and model cost per request at your real context lengths." },
    { q: "Where does latency actually go?", a: "Ask for a profile, not a guess. Data movement, batching, and queueing often matter more than model size." },
    { q: "Do efficiency gains change our roadmap?", a: "Yes. Cheaper attention made long documents and bigger batches affordable. Track infrastructure improvements as product enablers." },
    { q: "Build or rely on the platform?", a: "Most teams should rely on maintained kernels in PyTorch and inference servers such as vLLM. Custom kernels are for teams whose scale justifies a specialist." }
  ],
  reading: [
    "Read the abstract and Figure 1: the memory hierarchy and the speedup on one page.",
    "Read Section 2.1 on GPU memory and compute-bound versus memory-bound operations.",
    "Read Section 3.1 and Algorithm 1, using the online-softmax code on this page as your guide.",
    "Read Section 4 for speed and memory results and the long-context benchmarks (Path-X, Path-256).",
    "Skim Section 3.2 on IO complexity: why FlashAttention needs fewer slow-memory accesses.",
    "Follow-up: the FlashAttention-2 paper (2023), which improves parallelism and GPU utilization."
  ],
  quiz: [
    { q: "What was the main bottleneck in standard attention on GPUs?", options: ["Too few arithmetic units", "Reading and writing the N × N matrix to slow HBM", "The tokenizer", "Too many parameters"], answer: 1, why: "Much of attention is memory-bound. FlashAttention cuts slow-memory traffic." },
    { q: "Is FlashAttention an approximation of attention?", options: ["Yes, it trades accuracy for speed", "No, it computes exactly the same result", "Only during training", "Only for short sequences"], answer: 1, why: "Tiling plus the online softmax reproduces standard attention exactly, up to floating-point rounding." },
    { q: "Why recompute attention in the backward pass instead of storing it?", options: ["Storing is impossible", "Recomputing in fast SRAM is cheaper than storing and re-reading N² values from slow memory", "It improves accuracy", "It reduces parameters"], answer: 1, why: "Extra arithmetic is cheap; memory traffic is expensive. Measured runtime goes down." },
    { q: "How does FlashAttention's attention memory grow with sequence length N?", options: ["N²", "N", "N³", "It does not grow"], answer: 1, why: "It never stores the N × N matrix, only per-row statistics and the output." }
  ],
  next: "You have reached the end of the route. You now know how models are designed (Transformer), pre-trained (BERT, GPT-2), scaled (GPT-3, Chinchilla, LLaMA), aligned (InstructGPT), adapted (LoRA), and served efficiently (FlashAttention). Head to the <a href=\"#toolkit\">PM toolkit</a> to put it to work, and see “After the nine” on the <a href=\"#home\">overview</a> for what to read next."
});
