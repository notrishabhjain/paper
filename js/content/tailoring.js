/* Tailoring for AI project and program managers:
   - labSessions: how many ~45-minute sessions each lab step takes (daily study rhythm)
   - build: the Delivery Copilot feature (Node.js + Postgres + MongoDB + Ollama) built at this station,
            plus the project document drafted alongside it (templates live in portfolio.js)
   - delivery: rows to drop into a real AI project plan
   - interview: station-specific interview questions with what a strong answer covers
   - post: an angle for the station's public portfolio post */

/* ---------- Station 00 also gets the math primer ---------- */
(function () {
  var f = Portal.paper("foundations");
  f.figures.unshift(
    { w: "logscale", title: "Reading a log scale", text: "Most charts about AI use a log scale, because model sizes range from millions to hundreds of billions. Switch between the two axes and see what each one hides.", takeaway: "On a log scale, every grid line is 10× the previous one. When a chart's axis reads 1M, 10M, 100M, 1B, that is what you are looking at." },
    { w: "dotproduct", title: "The dot product: how models measure similarity", text: "Turn the two arrows. The dot product is large when they point the same way, zero when they are unrelated, and negative when they point in opposite directions.", takeaway: "Attention (Station 01) and semantic search (Station 02) are both built on this one calculation. You do not need to compute it, only to know what a high or low score means." }
  );
  f.concepts.unshift({
    name: "The math you need, in plain words",
    plain: "Four ideas cover every chart and formula on the route: log scales, scientific notation, dot products, and probabilities.",
    how: "A [[log-scale|log scale]] steps by multiplication (×10) instead of addition. [[scientific-notation|Scientific notation]] writes 300,000,000,000 as 3 × 10¹¹. A [[dot-product|dot product]] scores how much two lists of numbers point the same way. A [[probability|probability distribution]] spreads 100% across possible outcomes, like the model's guesses for the next word.",
    product: "That is the whole math kit for this route. When a formula appears later, the page explains it in words next to it, and the lab code does the arithmetic for you."
  });
  f.terms.unshift("log-scale", "scientific-notation", "dot-product", "probability");
})();

Portal.extendPaper("foundations", {
  labSessions: [1, 1, 1, 1],
  build: {
    feature: "Token and cost meter", sessions: 1, doc: "charter",
    what: "Start Delivery Copilot, the Node.js app you will grow at every station into your capstone. The first feature counts tokens in any document and estimates what sending it to a model would cost.",
    why: "Every AI estimate starts with tokens. You will reuse this module to size prompts, chunks, and budgets.",
    prompt: "Create a new Node.js 20+ project in a folder called delivery-copilot (ES modules, plain JavaScript). Add docker-compose.yml with Postgres 16 + pgvector (image pgvector/pgvector:pg16) and MongoDB 7 on default ports, with named volumes, plus a .env.example. Add src/tokens.js that counts tokens with the js-tiktoken package (cl100k_base encoding) and exports countTokens(text) and estimateCost(tokens, pricePerMillion). Add a CLI, `node src/cli/tokens.js <file-or-folder> --price 3`, that prints a table of files, characters, tokens, characters per token, and estimated cost per 1,000 calls. Add node:test tests for countTokens on three sample strings. Write a README with a project overview and a section 'Feature 0: token meter' explaining tokens in plain English.\nAcceptance criteria: `docker compose up -d` starts both databases; `npm test` passes; the CLI runs on a folder of Markdown files."
  },
  delivery: [
    ["Run an AI readiness check on the use case", "2–3 days", "PM + tech lead", "Starting before anyone agrees what “good” means"],
    ["Collect 50–100 real examples with expected outputs", "1 week", "Domain experts", "Examples that only cover the easy cases"],
    ["Agree a success metric and a non-AI baseline", "1–2 days", "PM + stakeholders + ML lead", "A metric nobody can measure offline"],
    ["Estimate token volume and cost per request", "1 day", "PM + engineer", "Forgetting output tokens and retries"]
  ],
  interview: [
    { q: "How is an AI project different from a normal software project?", a: ["Outcomes are uncertain because you are running experiments, so plan in phases with go/no-go gates instead of a fixed scope.", "Data is on the critical path: access, quality, labeling, and privacy.", "“Done” is a metric on held-out data agreed up front, not a feature checklist.", "Costs and monitoring continue after launch: drift, inference spend, feedback loops."] },
    { q: "A stakeholder asks how long it will take to “add AI”. How do you answer?", a: ["Clarify the task, the users, and what a wrong answer costs.", "Propose a time-boxed discovery of one to two weeks: collect examples, try a prompt baseline, measure.", "Give a range after discovery, tied to quality targets and data availability.", "Name the risks most likely to move the date."] },
    { q: "What is the difference between training and inference, and why does a project manager care?", a: ["Training builds the model once; inference runs it on every request.", "Training is a project cost; inference is an operating cost that grows with users.", "Most teams never train from scratch: they prompt, retrieve, or fine-tune.", "Budgets and capacity plans must cover inference for the product's whole life."] },
    { q: "Explain overfitting to a business stakeholder.", a: ["The model memorized its practice questions and fails the real exam.", "You catch it by testing on data held back from training.", "It is a common reason demo results drop in production.", "Always ask for the test-set score, and how that test set was built."] }
  ],
  post: "What I learned about tokens, loss, and overfitting before reading a single AI paper"
});

Portal.extendPaper("transformer", {
  labSessions: [2, 2, 2, 1],
  build: {
    feature: "Document ingestion and chunking", sessions: 1, doc: "risks",
    what: "Load project documents (Markdown, text, or exported wiki pages) into Postgres and split them into chunks that fit a model's context window, with overlap. A short warm-up has you write attention itself in plain JavaScript.",
    why: "Context windows exist because attention cost grows with the square of length. Chunking is the everyday consequence, and chunk size is a quality lever in every retrieval system.",
    prompt: "In delivery-copilot, add an ingestion pipeline. Create Postgres tables documents(id, path, title, created_at) and chunks(id, document_id, position, text, token_count) with a migration script. Write src/ingest.js that reads all .md and .txt files in a folder, splits each into chunks of at most N tokens (default 400) with M tokens of overlap (default 50) using src/tokens.js, preferring paragraph and sentence boundaries, and stores them. Add `npm run ingest -- <folder> --size 400 --overlap 50` that prints documents, chunks, and average tokens per chunk. Add tests for the chunker: no chunk exceeds the limit, overlap is respected, no text is lost. Warm-up: src/learn/attention.js implements scaled dot-product attention for 3 tokens with 2-number vectors in plain JavaScript, heavily commented, with a test that each row of attention weights sums to 1.\nAcceptance criteria: tests pass; ingesting 20 sample documents works; the README explains why chunking exists, referencing the context window and attention cost."
  },
  delivery: [
    ["Decide the context length the use case needs", "1–2 days", "Tech lead + PM", "Assuming longer context is free: cost grows with length"],
    ["Prototype a document chunking strategy", "2–3 days", "Engineer", "One chunk size for every document type"],
    ["Confirm GPU or API capacity for expected load", "2–5 days", "Platform team", "Discovering GPU quota limits late"],
    ["Lock a held-out test set before model work starts", "2 days", "Engineer + domain expert", "Tuning on the test set by accident"]
  ],
  interview: [
    { q: "Why do long context windows cost more?", a: ["Attention compares every token with every other token, so work grows with the square of the length.", "Longer prompts also mean more billed tokens and slower responses.", "Mitigations: retrieve only relevant chunks, summarize, use efficient attention kernels.", "Plan budgets with real prompt lengths, not demo averages."] },
    { q: "Explain the Transformer to an executive in under a minute.", a: ["It reads all the words at once and lets each word focus on the other words that matter for its meaning.", "Because it works in parallel, it trains efficiently on huge amounts of data.", "That efficiency is what made today's large models possible.", "Almost every modern AI model, chat assistants included, is built on it."] },
    { q: "Your team wants to train a custom model from scratch. What do you ask?", a: ["What does an existing model with prompting, retrieval, or fine-tuning fail to do?", "How much data do we have, and do we have the rights to use it?", "What is the compute budget and timeline, including failed runs?", "Who maintains and evaluates it after launch?"] },
    { q: "What is an ablation study, and how could you use the idea in project reviews?", a: ["Remove or change one component and measure the effect.", "It shows which parts of a system actually matter.", "In reviews, ask “what happens to the metric without this step?” before approving extra complexity.", "It keeps scope tied to evidence."] }
  ],
  post: "I built a tiny Transformer and trained it on my own text. Here is what attention actually does"
});

Portal.extendPaper("bert", {
  labSessions: [2, 2, 2, 1],
  build: {
    feature: "Semantic search with embeddings", sessions: 2, doc: "data",
    what: "Embed every chunk with a small BERT-family model running locally in Node, store the vectors in Postgres with pgvector, and add a /search endpoint that finds chunks by meaning rather than keywords. Compare it with plain keyword search.",
    why: "This is BERT's legacy in production: encoder models turn text into vectors. It is the retrieval half of RAG and one of the most common AI features in enterprise software.",
    prompt: "In delivery-copilot, add semantic search. Use @huggingface/transformers (Transformers.js) with the feature-extraction pipeline and model 'Xenova/all-MiniLM-L6-v2' (mean pooling, normalized, 384 dimensions). Enable the pgvector extension, add an embedding vector(384) column to chunks, and create an HNSW index with cosine distance. Write `npm run embed` to embed all chunks that lack embeddings, in batches, with progress output. Add an Express server (src/server.js) with GET /search?q=...&k=5 returning the top chunks with similarity scores and document titles, and GET /search-keyword using Postgres full-text search as a baseline. Create eval/search.json with 20 questions and the document each should find, and `npm run eval:search` that reports hit rate at k=5 for both methods.\nAcceptance criteria: embedding 1,000 chunks completes on a laptop CPU; the eval prints a two-row comparison table; the README explains embeddings and cosine similarity in plain English."
  },
  delivery: [
    ["Write labeling guidelines and label 500–2,000 examples", "2–3 weeks", "Domain experts or a labeling vendor", "Inconsistent labels: measure agreement on a sample first"],
    ["Train and evaluate a TF-IDF baseline", "1–2 days", "Engineer", "Skipping it, then not knowing whether the model adds value"],
    ["Fine-tune an encoder and compare per-class F1", "3–5 days", "ML engineer", "Reporting accuracy on imbalanced classes"],
    ["Choose an embedding model using your own queries", "3–5 days", "ML engineer + PM", "Choosing by leaderboard instead of your own data"]
  ],
  interview: [
    { q: "When would you choose a small fine-tuned model over a large language model?", a: ["When the output is a label, a score, or an extracted span.", "At high volume, where cost per request and latency dominate.", "When you have a few thousand labeled examples and stable categories.", "When you need predictable, easy-to-evaluate behavior."] },
    { q: "How would you plan a data labeling effort?", a: ["Write guidelines with examples, pilot on about 100 items, and measure agreement between labelers.", "Estimate throughput (items per hour) to size the team or the vendor budget.", "Build in quality review: gold items, spot checks, a way to resolve disagreements.", "Version guidelines and data; keep a carefully labeled held-out test set."] },
    { q: "What is an embedding, and where would your product use one?", a: ["A list of numbers that represents meaning; similar texts get similar vectors.", "Used for semantic search, recommendations, deduplication, and clustering.", "The retrieval step in RAG uses embeddings to find relevant passages.", "Test embedding models on your own queries before choosing."] },
    { q: "Accuracy is 95% but users complain. What might be going on?", a: ["Class imbalance: the model may never predict a rare but important class.", "The test set may not match production data in time, source, or language.", "Look at per-class precision and recall, and read real failures.", "Agree on a metric that reflects the business cost of each kind of error."] }
  ],
  post: "Keyword search vs. semantic search on project documents: a side-by-side test"
});

Portal.extendPaper("gpt2", {
  labSessions: [2, 2, 1, 1],
  build: {
    feature: "Local LLM generation endpoint", sessions: 1, doc: "release",
    what: "Run a small open model on your laptop with Ollama and add a /generate endpoint with temperature and top-p controls, streaming output, and request logging in MongoDB.",
    why: "Generation settings are product decisions, and logging every prompt and response is the foundation of evaluation, debugging, and audit.",
    prompt: "In delivery-copilot, add text generation. Assume Ollama is installed locally (ollama.com) with a small model pulled, for example `ollama pull llama3.2:1b` or `ollama pull qwen2.5:1.5b`. Write src/llm.js that calls Ollama's HTTP API (http://localhost:11434/api/chat) with options temperature, top_p, top_k, and num_predict, with streaming support. Add POST /generate to the Express server that streams tokens to the client as server-sent events. Log every request to a MongoDB collection llm_calls with prompt, settings, response, token counts, latency, and model name. Add `npm run sample -- \"<prompt>\"` that generates 3 completions each at temperature 0.2, 0.8, and 1.3 and prints them side by side with a simple repetition score.\nAcceptance criteria: streaming works with curl; logs appear in MongoDB; the README explains temperature and top-p in plain English and records which settings we chose and why."
  },
  delivery: [
    ["Define generation settings per feature", "1–2 days", "PM + engineer", "One global setting for very different features"],
    ["Set up prompt and response logging with retention rules", "2–3 days", "Engineer + security", "Logging personal data without a retention policy"],
    ["Run a misuse and abuse review before launch", "1–2 days", "PM + security + legal", "Doing it after an incident instead"],
    ["Assess the quality and sources of any training data", "3–5 days", "Data engineer", "Assuming more data beats better data"]
  ],
  interview: [
    { q: "What do temperature and top-p do, and who should decide them?", a: ["They control how random the choice of each next token is.", "Low values give consistent, conservative answers; higher values give variety.", "They are product decisions per feature, tested against an evaluation set.", "Document them like any other configuration that changes the user experience."] },
    { q: "How would you run a responsible release of a generative feature?", a: ["List plausible misuse and failure modes before launch.", "Test with red-team prompts; set up content filters and a way to report problems.", "Stage the rollout: internal, a small cohort, then wider, with monitoring at each stage.", "Decide who can pause or roll back, and how fast."] },
    { q: "Why did data curation matter so much in GPT-2?", a: ["A curated dataset (WebText) beat larger raw web data.", "Quality filters shape what a model learns, including its biases.", "On your projects, data sourcing and filtering deserve real time in the plan.", "Ask vendors what data quality controls they use."] },
    { q: "What should be logged for an LLM feature in production?", a: ["Prompt, settings, model version, response, latency, and token counts.", "User feedback and downstream outcomes.", "Retention and access rules for personal or confidential data.", "Enough to reproduce an incident and to build evaluation sets."] }
  ],
  post: "Same prompt, three temperatures: what sampling settings do to an LLM's answers"
});

Portal.extendPaper("gpt3", {
  labSessions: [2, 2, 1, 1],
  build: {
    feature: "RAG answers with an evaluation harness", sessions: 2, doc: "eval",
    what: "Combine search and generation: retrieve the top chunks, build a prompt with instructions and a few examples, and answer with citations. Add an evaluation harness that scores answers against a question set stored in Postgres.",
    why: "Prompting plus retrieval is the default architecture for enterprise LLM features. The evaluation harness lets you change prompts and models without guessing.",
    prompt: "In delivery-copilot, add question answering. POST /ask {question} should retrieve the top 5 chunks with semantic search; build a prompt with a system instruction (answer only from the provided context, cite chunk ids like [3], say 'I don't know' if the context does not contain the answer), 2 few-shot examples stored in prompts/ask.json, then the context and the question; call Ollama; and return the answer, cited chunks, latency, and prompt token count. Version prompts in prompts/ with name and version fields. Add an evaluation harness with tables eval_questions(id, question, expected_answer, expected_document), eval_runs(id, prompt_version, model, created_at), and eval_results. `npm run eval:ask -- --prompt ask@v1` runs every question and scores retrieval hit (expected document retrieved), citation present, and answer correctness by keyword match, and exports a CSV for manual review. Print a summary table that compares two prompt versions.\nAcceptance criteria: 20 evaluation questions; a comparison of a zero-shot and a 2-shot prompt version; the README explains in-context learning in plain English."
  },
  delivery: [
    ["Build an evaluation set of 50–200 real questions with answers", "1–2 weeks", "Domain experts + PM", "Writing questions that only test easy cases"],
    ["Iterate prompts against the evaluation set", "1–2 weeks", "Engineer + PM", "Changing prompts without re-running the evaluation"],
    ["Model per-request cost as prompts and examples grow", "1 day", "PM + engineer", "Ignoring cost growth from longer prompts"],
    ["Decide prompt vs. fine-tune with numbers", "2–3 days", "ML lead + PM", "Deciding on opinion rather than the evaluation table"]
  ],
  interview: [
    { q: "How do you evaluate an LLM feature before launch?", a: ["Build an evaluation set from real user inputs with expected outcomes.", "Combine automatic checks (format, citations, keywords) with human review of a sample.", "Track results per prompt and model version so changes are comparable.", "Agree launch thresholds with stakeholders before testing."] },
    { q: "What is in-context learning, and what does it cost?", a: ["The model picks up a task from instructions and examples in the prompt, with no retraining.", "It is fast to iterate, so it is the right first step.", "Examples are paid for on every request and add latency.", "At high volume, a fine-tuned smaller model can be cheaper."] },
    { q: "Your RAG assistant gives confident wrong answers. How do you triage?", a: ["Separate retrieval failures (right document not found) from generation failures (found but misused).", "Check chunking, the embedding model, and how many chunks are retrieved.", "Tighten instructions: answer only from context, cite sources, allow “I don't know”.", "Add the failing cases to the evaluation set before fixing anything."] },
    { q: "A vendor shows great benchmark scores. What do you ask?", a: ["How did you check for test-set contamination?", "How does it score on our data and our tasks?", "What are latency and cost at our volume?", "What happens to our data, and what are the contract terms?"] }
  ],
  post: "I built a small RAG assistant over project documents, and an eval harness to keep it honest"
});

Portal.extendPaper("chinchilla", {
  labSessions: [2, 1, 2, 1],
  build: {
    feature: "Cost and capacity planner", sessions: 1, doc: "cost",
    what: "Add a planning command that turns measured usage (tokens per request, requests per day, speed) into monthly inference cost and hardware needs, plus a training estimate in case you ever fine-tune or pre-train.",
    why: "Chinchilla turned model building into arithmetic. A project manager who can produce a defensible cost model earns a seat in architecture decisions.",
    prompt: "In delivery-copilot, add src/plan.js and `npm run plan`. Read inputs from plans/capstone.yml: requests per day, monthly growth, average prompt and output tokens (default: computed from the MongoDB llm_calls log), model size in parameters, an API price per million tokens for comparison, a GPU hourly price, and measured tokens per second from local runs. Output monthly token volume, API cost, self-hosted GPU hours and cost, training compute for a fine-tune or a from-scratch model using C = 6 × N × D and the Chinchilla rule D = 20 × N, and a 12-month projection table. Write the result to reports/plan.md with a plain-English summary for stakeholders.\nAcceptance criteria: unit tests for the formulas (for example, 6.7B parameters on 1T tokens ≈ 4.0e22 FLOPs); the report reads well as Markdown on GitHub."
  },
  delivery: [
    ["Build a cost and capacity model with growth scenarios", "2–3 days", "PM + finance + engineer", "Using demo traffic instead of realistic volumes"],
    ["Count available training data in tokens", "2–3 days", "Data engineer", "Planning a model size the data cannot support"],
    ["Run a small-scale experiment before any large training run", "1–2 weeks", "ML engineer", "Committing budget before the small run shows a trend"],
    ["Add contingency for failed runs and experiments", "Budget line", "PM", "Budgeting only for the final, successful run"]
  ],
  interview: [
    { q: "How would you estimate the cost of training or fine-tuning a model?", a: ["Compute ≈ 6 × parameters × tokens; convert to GPU-hours at a realistic utilization of 30–50%.", "Multiply by the hourly GPU price, then add 2–3× for experiments and failed runs.", "Include data preparation, evaluation, and staff time.", "Sanity-check against published numbers for similar models."] },
    { q: "What did Chinchilla change about how labs plan models?", a: ["It showed many large models were under-trained for their size.", "For a fixed budget, grow model size and data together, at about 20 tokens per parameter.", "It made data volume and quality a bottleneck.", "It highlighted the trade-off between training-optimal and serving-optimal models."] },
    { q: "How do you present an AI cost model to finance?", a: ["Separate one-time costs (data, training, integration) from running costs (inference, monitoring).", "Show low, expected, and high usage scenarios.", "Tie cost to a unit of value: cost per ticket resolved or per document processed.", "List the assumptions and what would change them."] },
    { q: "Leadership wants the biggest model available. How do you respond?", a: ["Ask what quality bar the use case needs, and test smaller options against it.", "Show the cost and latency difference at expected volume.", "Point out that a well-trained smaller model often matches a bigger one on narrow tasks.", "Recommend the smallest model that passes the evaluation."] }
  ],
  post: "Back-of-envelope AI budgeting: the one formula every AI project manager should know"
});

Portal.extendPaper("instructgpt", {
  labSessions: [2, 2, 1, 1],
  build: {
    feature: "Feedback and preference capture", sessions: 2, doc: "labeling",
    what: "Add a review page that shows two answers to the same question side by side, records which one a reviewer prefers, and reports win rates and agreement. Export the pairs in the format preference tuning expects.",
    why: "Human feedback programs are run by project and program managers. Building a mini labeling tool teaches the operational questions: guidelines, throughput, agreement, and quality control.",
    prompt: "In delivery-copilot, add human feedback. Create a MongoDB collection comparisons {question, answer_a, answer_b, source_a, source_b (prompt or model versions), reviewer, choice: 'a' | 'b' | 'tie', reason, created_at}. Add a minimal server-rendered page GET /review (plain HTML, no framework) that picks an evaluation question, generates two answers with different prompt versions or models, shows them in random order without revealing which is which, and records the choice and an optional reason. Add `npm run feedback:report` that prints win/tie/loss per version, agreement between reviewers on items labeled by two people, answers reviewed per hour per reviewer, and the most common reasons. Add `npm run feedback:export` to write chosen/rejected pairs to data/preferences.jsonl in the prompt/chosen/rejected format used by Hugging Face TRL's DPO trainer.\nAcceptance criteria: two reviewers can label the same item; the report shows agreement; the export is valid JSONL."
  },
  delivery: [
    ["Write and pilot labeling guidelines", "1–2 weeks", "PM + domain experts + policy", "Ambiguous guidelines: measure agreement before scaling"],
    ["Recruit and train reviewers or a vendor", "2–4 weeks", "PM + procurement", "No screening test, so reviewer quality varies"],
    ["Run blind side-by-side evaluations each release", "2–3 days per cycle", "PM + reviewers", "Unblinded reviews biased toward the new version"],
    ["Re-run capability tests after alignment or safety tuning", "1–2 days", "ML engineer", "Missing regressions (the alignment tax)"]
  ],
  interview: [
    { q: "How would you set up and run a human feedback program?", a: ["Define what good looks like in written guidelines with examples.", "Screen and train reviewers; pilot and measure agreement.", "Plan throughput, cost, and quality checks such as gold items and audits.", "Close the loop: feed the data into training and evaluation, and revise the guidelines."] },
    { q: "Explain RLHF in one minute.", a: ["Show the model examples of good answers (supervised fine-tuning).", "Have people rank several answers and train a reward model to predict their preferences.", "Optimize the model to score well on the reward model, with a penalty that stops it gaming the score.", "Today DPO often replaces the reward model and reinforcement-learning steps."] },
    { q: "After an update, users say the assistant got wordy and flattering. What do you do?", a: ["Suspect reward hacking, or preference data and judges that favor length.", "Run a blind human comparison against the previous version.", "Check whether reviewers or an LLM judge prefer longer answers.", "Fix guidelines and data, add length checks to the evaluation, and consider rolling back."] },
    { q: "How do you handle disagreement between labelers?", a: ["Measure it: agreement rates by category.", "Treat high disagreement as a guideline problem first.", "Have a senior reviewer adjudicate disputed items.", "Track agreement over time as a quality metric."] }
  ],
  post: "We ran a mini human-feedback program on our assistant. Here is what reviewers disagreed about"
});

Portal.extendPaper("lora", {
  labSessions: [2, 2, 2, 1],
  build: {
    feature: "Prompt, model, and adapter registry", sessions: 1, doc: "changelog",
    what: "Add a registry that versions prompts, model names, and LoRA adapters, links each version to its evaluation results, and lets you switch or roll back the active version without a deploy.",
    why: "Fine-tuning creates many versions. Knowing what is live, how it scored, and how to roll back is core delivery and governance work.",
    prompt: "In delivery-copilot, add a registry. Create Postgres tables versions(id, kind: 'prompt' | 'model' | 'adapter', name, version, uri, notes, created_by, created_at) and deployments(id, feature, version_id, activated_at, activated_by), and link eval_runs to version ids. Add CLI commands `npm run registry -- list | add | activate <feature> <version> | rollback <feature>`. Make /ask read its active prompt and model from the registry on each request. Add a page GET /registry showing each feature's active version, its latest evaluation scores, and its history. Optional stretch: document in the README how to merge the Station 07 LoRA adapter, convert it to GGUF in Colab with llama.cpp, load it into Ollama with a Modelfile, and register it as a model version.\nAcceptance criteria: activating another prompt version changes /ask behavior without a restart; rollback restores the previous version; tests cover activate and rollback."
  },
  delivery: [
    ["Prepare 300–1,000 high-quality training examples", "1–3 weeks", "Domain experts + engineer", "Training data that overlaps the evaluation set"],
    ["Run LoRA experiments (rank, target layers) against the eval set", "3–5 days", "ML engineer", "No comparison with a strong prompt baseline"],
    ["Set up versioning and rollback for prompts and adapters", "2–3 days", "Platform engineer", "Not knowing which version is live"],
    ["Agree data isolation rules for customer-specific adapters", "1 week", "PM + legal + security", "Mixing customers' data in one training run"]
  ],
  interview: [
    { q: "When would you fine-tune instead of prompting or using RAG?", a: ["For consistent format, tone, or task behavior at high volume.", "When a strong prompt still fails the evaluation set.", "When the cost or latency of long prompts is too high.", "Not for knowledge that changes often; that is RAG's job."] },
    { q: "What is LoRA, and why does it matter for delivery?", a: ["It trains a small add-on instead of the whole model.", "Experiments are cheap, files are small, and versions are fast to swap and roll back.", "One base model can serve many customer- or task-specific adapters.", "It turns fine-tuning into a routine, plannable activity."] },
    { q: "How would you manage versions of prompts, models, and adapters in production?", a: ["A registry recording version, owner, evaluation results, and approval status.", "Change control: evaluation thresholds before activation.", "Staged rollout and one-step rollback.", "An audit trail of what was live, and when."] },
    { q: "A customer wants a model fine-tuned on their data. What must be settled first?", a: ["Consent and contract terms for training on their data.", "Isolation: their data and adapter are used only for them.", "Deletion and retention commitments.", "How quality will be measured and accepted."] }
  ],
  post: "Fine-tuning on a free GPU: LoRA, and the day it beat my best prompt"
});

Portal.extendPaper("llama", {
  labSessions: [2, 1, 1, 1],
  build: {
    feature: "Model comparison for build vs. buy", sessions: 1, doc: "buildbuy",
    what: "Run your evaluation set across two or three open models and quantization levels in Ollama, and produce a comparison of quality, latency, memory, and estimated cost.",
    why: "Build-versus-buy and model selection decisions land on project and program managers. A repeatable comparison turns opinions into evidence.",
    prompt: "In delivery-copilot, add `npm run compare -- --models llama3.2:1b,llama3.2:3b,qwen2.5:3b` (models already pulled in Ollama; include a q4 and a q8 variant of one model if available). For each model, run the /ask evaluation set and record quality scores from the eval harness, mean and p95 latency, tokens per second, and memory reported by `ollama ps`. Register each model in the registry. Write reports/model-comparison.md with a results table, a chart saved as an SVG file, a cost-only column for a paid API where I enter the price per million tokens (no API calls), and a recommendation section with placeholders for business context.\nAcceptance criteria: the comparison runs end to end on a laptop; the report explains quantization in plain English."
  },
  delivery: [
    ["Shortlist open and API models against requirements", "2–3 days", "ML lead + PM", "Shortlisting by hype or leaderboards"],
    ["Run the same evaluation across the shortlist", "3–5 days", "Engineer", "Different prompts per model, so results are not comparable"],
    ["Legal review of model licenses and data terms", "1–2 weeks", "Legal + PM", "Assuming open weights means unrestricted use"],
    ["Estimate hosting and operations effort for self-hosting", "2–3 days", "Platform team", "Forgetting on-call, upgrades, and security patching"]
  ],
  interview: [
    { q: "Open-weights model or API: how do you decide?", a: ["Run the same evaluation on both.", "Compare total cost at expected volume, including hosting and operations.", "Weigh data privacy, latency, customization, and vendor risk.", "Check the license terms for commercial use."] },
    { q: "What does “open weights” mean, and what is the catch?", a: ["You can download the model and run it yourself.", "Licenses vary, with commercial limits and acceptable-use terms.", "You own serving, scaling, security, and safety testing.", "Updates and support depend on the provider and the community."] },
    { q: "Why might a smaller model be the right choice?", a: ["Lower cost and latency per request.", "Well-trained small models can match bigger ones on narrow tasks.", "Easier to self-host and fine-tune.", "Choose the smallest model that passes the evaluation."] },
    { q: "What is quantization, and what risk does it carry?", a: ["Storing weights with fewer bits to cut memory and cost.", "It lets models run on smaller GPUs or laptops.", "It can reduce quality, more so for small models.", "Always re-run the evaluation after quantizing."] }
  ],
  post: "Three open models, one evaluation set: choosing an LLM with evidence instead of hype"
});

Portal.extendPaper("flashattention", {
  labSessions: [2, 1, 1, 1],
  build: {
    feature: "Latency and performance benchmark", sessions: 1, doc: "launch",
    what: "Measure time to first token, tokens per second, and total latency as prompts get longer and more users arrive at once. Add embedding caching and propose latency targets for each feature.",
    why: "Performance is where AI features often fail in production. A project manager who can read a latency report and set realistic targets prevents late surprises.",
    prompt: "In delivery-copilot, add `npm run bench`. Against the local Ollama model, measure time to first token, tokens per second, and total latency for prompts of about 500, 2,000, 4,000, and 8,000 tokens (padded with real chunks), and for 1, 2, 4, and 8 concurrent requests. Repeat each point 5 times and report the median and p95. Add an in-memory LRU cache for query embeddings and measure /search latency with and without it. Write reports/performance.md with tables, an SVG chart of latency against prompt length, and a section proposing p50/p95 latency targets for /search and /ask, with placeholders for product requirements.\nAcceptance criteria: the benchmark completes on a laptop; results repeat within about 10%; the README explains why longer prompts are slower, linking to attention and the KV cache."
  },
  delivery: [
    ["Set latency targets (p50 and p95) per feature", "1–2 days", "PM + UX + engineer", "Promising chat-speed answers with long contexts"],
    ["Load-test with realistic prompt lengths and concurrency", "3–5 days", "Engineer + platform", "Testing with short demo prompts only"],
    ["Plan GPU capacity and KV-cache memory for peak traffic", "2–3 days", "Platform team", "Sizing for average traffic instead of peak"],
    ["Prepare the launch checklist and rollback plan", "1–2 days", "PM", "No clear owner for pausing the feature"]
  ],
  interview: [
    { q: "How would you set and manage latency targets for an LLM feature?", a: ["Start from user expectations per feature: chat, search, and batch jobs differ.", "Measure p50 and p95, plus time to first token for streaming interfaces.", "Test with real prompt lengths and peak concurrency.", "Track latency in monitoring and alert on regressions."] },
    { q: "What drives the cost and speed of serving an LLM?", a: ["Model size and numeric precision.", "Prompt and output length: attention and the KV cache grow with context.", "Batching and concurrency.", "Kernel efficiency (FlashAttention, for example), caching, and hardware."] },
    { q: "What is on your go/no-go checklist for launching an AI feature?", a: ["Evaluation results meet agreed thresholds; known failure modes are documented.", "Latency, cost, and capacity verified under load.", "Safety, privacy, and legal reviews complete; monitoring and alerts live.", "A tested rollback plan, a named owner, and a support process."] },
    { q: "Engineering says the model is too slow. How do you help?", a: ["Ask for a profile: where does the time actually go?", "Options include shorter prompts, a smaller or quantized model, caching, streaming, and batching.", "Revisit requirements: does every feature need a real-time answer?", "Check each option's effect on quality with the evaluation set."] }
  ],
  post: "Why our AI got slower with longer prompts, and the numbers that explain it"
});
