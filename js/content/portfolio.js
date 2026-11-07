/* Portfolio, capstone, and interview content for AI project and program managers.
   scripts/export-templates.js turns the templates below into Markdown files in portfolio-template/. */
(function () {
  var P = window.Portal;

  /* Standing instructions for every Delivery Copilot prompt (Claude Code, in your portfolio repo). */
  P.APP_PREAMBLE =
    "You are my engineer, working in my portfolio repository through Claude Code. I am an IT project manager who knows Node.js, Postgres, and MongoDB well and is new to AI. We are building Delivery Copilot in the delivery-copilot/ folder, one feature per study station.\n" +
    "- Node.js 20+, ES modules, plain JavaScript, Express. Postgres 16 with pgvector and MongoDB 7 via docker compose.\n" +
    "- Free tools only: Ollama for local LLMs, Transformers.js for embeddings, js-tiktoken for token counts. No paid APIs or keys.\n" +
    "- Give me a short plan (5–8 bullets) first and wait for my OK. Then work in small steps, one commit each.\n" +
    "- Explain every AI concept you use in plain English in the README section for the feature.\n" +
    "- Add node:test tests for core logic and keep `npm test` passing.\n" +
    "- Use public or sample data only. Never commit secrets, personal data, or confidential documents.\n\n" +
    "FEATURE\n";

  /* ---------- Project documents (one drafted per station) ---------- */
  P.templates = {
    charter: { title: "AI project charter", station: "foundations", text:
      "AI PROJECT CHARTER\n\n" +
      "Project name:\nSponsor and owner:\n" +
      "Problem, in the user's words:\nWho is affected, and how often:\n" +
      "Why AI? What can rules or existing tools not do:\n" +
      "Business success metric and target:\nOffline quality metric and threshold:\n" +
      "Baseline today (people or rules) and its score:\n" +
      "In scope:\nOut of scope:\n" +
      "Data needed, source, owner, access status:\n" +
      "Approach to try first (prompt, retrieval, fine-tune) and why:\n" +
      "Phases and go/no-go gates:\n" +
      "  1. Discovery (2 weeks). Gate: baseline measured, data access confirmed.\n" +
      "  2. Proof of concept (4 weeks). Gate: quality threshold met on the held-out test set.\n" +
      "  3. Pilot (6 weeks). Gate: user outcome improved, risks accepted by owners.\n" +
      "Top risks (link to risk register):\nTeam and roles:\nBudget, one-time and monthly running:\n" },
    risks: { title: "AI risk register", station: "transformer", text:
      "AI RISK REGISTER\n\n" +
      "ID | Risk | Category | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner | Status\n" +
      "R1 | Model gives confident wrong answers | Quality | | | Retrieval with citations; evaluation set; human review for high-stakes cases | |\n" +
      "R2 | Personal or confidential data sent to a model or logged | Privacy | | | Redaction; access controls; vendor terms; retention policy | |\n" +
      "R3 | Inference cost exceeds budget at scale | Cost | | | Cost model; usage limits; alerts; smaller model | |\n" +
      "R4 | Required data unavailable or unusable | Data | | | Early data readiness check; legal review | |\n" +
      "R5 | Prompt injection or misuse | Security | | | Input handling; red-team tests; output filters | |\n" +
      "R6 | Quality drifts after launch | Operations | | | Monitoring; sampled reviews; re-evaluation cadence | |\n" +
      "R7 | Users over-trust the output | Adoption | | | Interface cues; training; show sources and confidence | |\n" +
      "R8 | Long context makes responses slow or costly | Performance | | | Chunking and retrieval; latency targets; load tests | |\n" },
    data: { title: "Data readiness assessment", station: "bert", text:
      "DATA READINESS ASSESSMENT\n\n" +
      "Use case:\n" +
      "Datasets (name, owner, location, size, refresh frequency):\n" +
      "Permission to use for this purpose? (yes/no, evidence):\n" +
      "Personal or confidential data present? Handling plan:\n" +
      "Quality check on a sample of 50 (completeness, duplicates, errors):\n" +
      "Representativeness (user groups, languages, edge cases):\n" +
      "Labels: exist? who created them? agreement measured (%)?\n" +
      "Held-out test set: size, owner, never used for tuning (yes/no):\n" +
      "Gaps and plan to close them (effort, owner, date):\n" +
      "Verdict: ready / ready with actions / not ready\n" },
    release: { title: "Release and misuse review", station: "gpt2", text:
      "RELEASE AND MISUSE REVIEW\n\n" +
      "Feature:\nWhat it generates, and for whom:\n" +
      "Plausible misuse (at least five):\n" +
      "Harmful failures (wrong, offensive, leaking data):\n" +
      "Red-team test set: size and results:\n" +
      "Generation settings (model, temperature, max length) and why:\n" +
      "Guardrails (filters, refusals, rate limits, human review):\n" +
      "Logging and retention:\n" +
      "Rollout stages and audience:\n" +
      "Who can pause the feature, and how quickly:\n" +
      "Sign-offs: product, security, legal, responsible AI\n" },
    eval: { title: "Evaluation plan", station: "gpt3", text:
      "EVALUATION PLAN\n\n" +
      "Feature and version:\nUser outcome we care about:\n" +
      "Evaluation set: size, source (real inputs?), date, owner:\n" +
      "Metrics and how each is measured:\n" +
      "  - Correctness and groundedness (answers supported by sources):\n" +
      "  - Format and instruction following:\n" +
      "  - Safety (harmful or out-of-policy output rate):\n" +
      "  - Latency (p50 / p95) and cost per request:\n" +
      "Human review: who, how many items, rubric, blinded (yes/no):\n" +
      "Baselines compared:\n" +
      "Launch thresholds, and who agreed them:\n" +
      "Regression tests that must not get worse:\n" +
      "Cadence after launch:\n" },
    cost: { title: "Cost and capacity model", station: "chinchilla", text:
      "COST AND CAPACITY MODEL\n\n" +
      "Requests per day (now / in 12 months):\n" +
      "Average input tokens / output tokens per request:\n" +
      "Option A, API: price per 1M input and output tokens → monthly cost:\n" +
      "Option B, self-hosted: model size, GPU type, tokens per second, GPUs at peak → monthly cost:\n" +
      "One-time costs: data preparation, labeling, fine-tuning (compute ≈ 6 × parameters × tokens), integration:\n" +
      "Running costs beyond inference: monitoring, human review, on-call:\n" +
      "Unit economics: cost per request and per business outcome:\n" +
      "Scenarios: low / expected / high:\n" +
      "Assumptions, and what would change them:\n" },
    labeling: { title: "Labeling guideline", station: "instructgpt", text:
      "LABELING GUIDELINE (version __)\n\n" +
      "Task in one sentence:\n" +
      "What reviewers see, and what they decide:\n" +
      "Definition of a good answer, in priority order:\n" +
      "  1. Correct and supported by the source\n" +
      "  2. Follows the requested format\n" +
      "  3. Clear and appropriately concise\n" +
      "  4. Safe and within policy\n" +
      "Worked examples: 3 good, 3 bad, 3 borderline, each with the reason:\n" +
      "When to choose “tie” or skip:\n" +
      "Escalation for harmful or confidential content:\n" +
      "Quality checks: gold items per batch, target agreement (%):\n" +
      "Expected throughput (items per hour):\n" +
      "Change log of guideline versions:\n" },
    changelog: { title: "Model change log and rollback plan", station: "lora", text:
      "MODEL CHANGE LOG AND ROLLBACK PLAN\n\n" +
      "Feature:\nChange type: prompt / model / adapter / settings\n" +
      "From version → to version:\nReason for the change:\n" +
      "Evaluation results, before vs. after, same evaluation set:\n" +
      "Regressions checked:\nApproved by, date:\n" +
      "Rollout: share of traffic, duration, signals monitored:\n" +
      "Rollback trigger (metric and threshold):\n" +
      "Rollback steps and owner:\n" },
    buildbuy: { title: "Build vs. buy decision memo", station: "llama", text:
      "BUILD VS. BUY DECISION MEMO\n\n" +
      "Decision needed by:\n" +
      "Options: (A) API model ___  (B) open-weights model ___, self-hosted  (C) ___\n" +
      "Evaluation results on our data (same evaluation set):\n" +
      "Latency (p50 / p95):\n" +
      "Cost at expected volume over 12 months, including hosting and operations:\n" +
      "Data privacy and residency:\n" +
      "Customization (fine-tuning, adapters):\n" +
      "License and legal terms:\n" +
      "Operational effort and team skills:\n" +
      "Vendor and lock-in risk; exit plan:\n" +
      "Recommendation and reasons:\nRevisit date:\n" },
    launch: { title: "Launch go/no-go checklist", station: "flashattention", text:
      "LAUNCH GO / NO-GO CHECKLIST\n\n" +
      "[ ] Evaluation thresholds met on the release candidate (results attached)\n" +
      "[ ] Known failure modes documented, with user-facing mitigations\n" +
      "[ ] Latency p50 / p95 verified at peak load with real prompt lengths\n" +
      "[ ] Cost per request and monthly budget confirmed; alerts configured\n" +
      "[ ] Security, privacy, legal, and responsible-AI reviews signed off\n" +
      "[ ] Monitoring live: sampled quality reviews, errors, latency, cost, user feedback\n" +
      "[ ] Rollback tested; named owner on call for launch week\n" +
      "[ ] Support team briefed; user guidance and feedback channel ready\n" +
      "[ ] Staged rollout plan: cohort, duration, success criteria\n\n" +
      "Decision: GO / NO-GO     Date:     Approved by:\n" }
  };

  /* ---------- Portfolio templates ---------- */
  P.portfolioTemplates = {
    repo:
      "ai-paper-trail/                 public GitHub repository\n" +
      "  README.md                     who you are, the route, a progress table, links\n" +
      "  stations/\n" +
      "    00-foundations/\n" +
      "      README.md                 results, what failed, what it means for AI projects\n" +
      "      lab.ipynb                 notebooks written by Claude Code, run on free Colab\n" +
      "      experiment-card.md\n" +
      "      failure-log.md\n" +
      "    01-transformer/\n" +
      "    ...\n" +
      "  delivery-copilot/             the capstone app (Node.js + Postgres + MongoDB + Ollama)\n" +
      "  project-docs/                 charter, risk register, evaluation plan, ... (sample project)\n",
    readme:
      "# Station NN · PAPER: one-line result\n\n" +
      "**Question I set out to answer:**\n\n" +
      "**What I built:** (notebook link with an “Open in Colab” badge)\n\n" +
      "## Results\n\n" +
      "| Variant | Metric | Run time | Cost |\n|---|---|---|---|\n| | | | |\n\n" +
      "## What failed, and why\n\n1.\n2.\n3.\n\n" +
      "## What this changes in how I would run an AI project\n\n-\n-\n-\n\n" +
      "## Files\n\n- lab.ipynb\n- experiment-card.md\n- failure-log.md\n",
    post:
      "HOOK: one surprising result in one line\n\n" +
      "This week I worked through “PAPER” (YEAR) as part of my move into AI project management.\n\n" +
      "What I built:\n" +
      "What I measured (one number):\n" +
      "What failed, and why:\n" +
      "What it changes in how I would run an AI project:\n\n" +
      "Notebook and write-up: GITHUB LINK\n" +
      "#AI #ProjectManagement #MachineLearning\n"
  };

  /* ---------- Capstone ---------- */
  P.capstone = {
    stack: [
      ["Node.js 20 + Express", "Runs the app and its web endpoints (the API)", "Free"],
      ["Postgres 16 + pgvector", "Stores documents and their meaning-numbers (embeddings); pgvector lets Postgres find text by meaning, not just keywords", "Free (Docker, or the Neon free tier)"],
      ["MongoDB 7", "Keeps a log of every question, answer, and piece of reviewer feedback", "Free (Docker, or the Atlas free tier)"],
      ["Ollama", "Runs free AI models, such as Llama 3.2 and Qwen 2.5, on your own laptop", "Free"],
      ["Transformers.js", "Turns text into meaning-numbers inside Node, with a small free model", "Free"],
      ["js-tiktoken", "Counts tokens, the pieces of text AI services charge by", "Free"],
      ["Claude Code", "Writes the code from the prompt at each station", "Your existing access"],
      ["Google Colab free tier", "Free borrowed computers with graphics chips, for the paper labs", "Free"]
    ],
    flow: ["Your project documents", "Cut into index cards (chunking)", "File each card by meaning (embeddings)", "Find the most relevant cards (retrieval)", "Pick the current instructions (registry)", "Write an answer (local AI model)", "Answer with sources cited", "Log questions and feedback", "Check quality and report (evaluation)"]
  };

  /* ---------- General interview bank: AI project and program manager ---------- */
  P.interviewGeneral = [
    { cat: "Planning", q: "Walk me through how you would run an AI project from idea to launch.", a: ["Discovery: problem, users, success metric, baseline, and a data check.", "A time-boxed proof of concept that ends in a go/no-go decision.", "A pilot with real users and an evaluation plan.", "Production: monitoring, a feedback loop, cost controls, and clear ownership."] },
    { cat: "Planning", q: "How do you plan when you don't know whether the model will work?", a: ["Phase the plan with explicit gates and decision criteria.", "Time-box experiments, agreeing in advance which result continues or stops the work.", "Keep a fallback such as rules or human review so value is not all-or-nothing.", "Communicate ranges and confidence instead of fixed dates."] },
    { cat: "Planning", q: "What roles does an AI project team need?", a: ["A product owner and a project or program manager.", "Applied AI or ML engineers, data engineers, software and platform engineers.", "Domain experts, and reviewers or labelers.", "Security, privacy, legal, and responsible-AI reviewers at defined checkpoints."] },
    { cat: "Data", q: "How do you assess whether the data is ready?", a: ["Access and rights, including consent and licensing.", "Volume, quality, freshness, and how well it represents real use.", "Labels: do they exist, and how consistent are they?", "Privacy and security handling, and a plan for a held-out test set."] },
    { cat: "Evaluation", q: "How do you define success for a generative AI feature?", a: ["A business outcome metric, such as handling time reduced.", "Quality metrics on an evaluation set: correctness, groundedness, format.", "Guardrail metrics: harmful output rate, latency, cost per request.", "Thresholds agreed with stakeholders before building."] },
    { cat: "Evaluation", q: "How do you know a new model version is better?", a: ["Same evaluation set and settings, plus a blind human comparison on a sample.", "Check every critical task for regressions, not just the one you targeted.", "Watch live metrics through a staged rollout.", "Keep the previous version ready for rollback."] },
    { cat: "Risk", q: "What are the top risks in an LLM project, and how do you mitigate them?", a: ["Wrong answers: retrieval with citations, evaluation, human review where stakes are high.", "Data leakage and privacy: access controls, redaction, vendor terms.", "Cost overruns: a cost model, usage limits, monitoring.", "Prompt injection and misuse: input handling, red-teaming, guardrails."] },
    { cat: "Risk", q: "How do you handle responsible AI requirements on a tight deadline?", a: ["Build reviews into the plan as gates, not afterthoughts.", "Start with a risk assessment of the use case.", "Use checklists and templates to keep reviews fast.", "Escalate trade-offs early, with clear options."] },
    { cat: "Stakeholders", q: "How do you explain model uncertainty to executives?", a: ["Use concrete examples of successes and failures.", "Report metrics with what they mean for users.", "Tie quality levels to business decisions: automate, assist, or keep a human in the loop.", "Be explicit about what is known, what is not, and how you will find out."] },
    { cat: "Stakeholders", q: "A sponsor demands 100% accuracy. What do you say?", a: ["No model is perfect: ask what a wrong answer costs and how often one is acceptable.", "Design for errors with human review, confidence thresholds, and easy correction.", "Compare with today's human error rate.", "Agree a measurable target and a review process."] },
    { cat: "Vendors and cost", q: "How do you evaluate an AI vendor?", a: ["Test on your own data with your evaluation set.", "Security, privacy, data retention, and whether they train on your data.", "Cost at your volume, rate limits, latency, and support.", "Lock-in risk and an exit plan."] },
    { cat: "Vendors and cost", q: "How do you keep AI running costs under control?", a: ["Unit economics: cost per request and per business outcome.", "Prompt length limits, caching, and smaller models where they are good enough.", "Budgets, alerts, and per-feature cost dashboards.", "Regular reviews of model choice as prices change."] },
    { cat: "Operations", q: "What does monitoring look like after launch?", a: ["Quality: sampled human review, user feedback, automated checks.", "Drift: changes in input data or topics.", "Operations: latency, errors, cost, usage.", "A process that turns failures into new evaluation cases."] },
    { cat: "Operations", q: "How do you manage dependencies between data, ML, and platform teams?", a: ["Map the critical path: data access and labeling often gate everything else.", "Shared milestones with clear hand-offs: datasets, evaluation sets, APIs.", "Regular cross-team syncs focused on blockers and decisions.", "One shared risk and decision log."] },
    { cat: "Scenario", q: "Two weeks before launch, the evaluation shows 78% against a 90% target. What do you do?", a: ["Break failures down by category to find the largest fixable group.", "Options: narrow the scope, add human review, delay, or launch to a smaller cohort.", "Quantify the impact of each option with stakeholders.", "Decide, document the decision, and set a re-evaluation date."] },
    { cat: "Scenario", q: "Your team proposes fine-tuning a model. How do you decide whether to approve it?", a: ["Has a strong prompt and retrieval baseline been measured?", "Is there enough high-quality training data?", "What are the cost, timeline, and maintenance implications?", "Which evaluation result would justify it, agreed beforehand?"] },
    { cat: "Behavioral", q: "Tell me about a project that did not go to plan.", a: ["Use STAR: situation, task, action, result.", "Show how you spotted the problem early and communicated it.", "Explain the trade-off you proposed, and why.", "Share what you changed afterwards. Your failure logs from this route are good material."] },
    { cat: "Behavioral", q: "Why are you moving into AI project management?", a: ["Connect your delivery experience to the specific challenges of AI work.", "Show evidence: your portfolio, labs, and capstone app.", "Mention a concrete lesson you learned hands-on, such as a failure you debugged.", "Say what kind of AI projects you want to lead."] }
  ];
})();
