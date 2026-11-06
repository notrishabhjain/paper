# Paper Trail

An interactive study route through nine AI papers, built for IT project and program managers moving into AI. Each paper gets a station with plain-language explanations, interactive figures, vocabulary, a four-step lab you run through Claude Code on a free GPU, one feature of a Node.js capstone app, project-plan rows, a project document, and interview questions.

The route is split into 122 sessions of about 45 minutes (roughly 87 hours, or 18 weeks at one session a day). It uses free tools only and keeps the math to intuition.

| # | Station | Paper | Year |
|---|---------|-------|------|
| 00 | Foundations | Tokens, embeddings, parameters, loss, gradient descent (primer) | — |
| 01 | Transformer | Attention Is All You Need | 2017 |
| 02 | BERT | Pre-training of Deep Bidirectional Transformers | 2018 |
| 03 | GPT-2 | Language Models are Unsupervised Multitask Learners | 2019 |
| 04 | GPT-3 | Language Models are Few-Shot Learners | 2020 |
| 05 | Chinchilla | Training Compute-Optimal Large Language Models | 2022 |
| 06 | InstructGPT | Training language models to follow instructions with human feedback | 2022 |
| 07 | LoRA | Low-Rank Adaptation of Large Language Models | 2021 |
| 08 | LLaMA | Open and Efficient Foundation Language Models | 2023 |
| 09 | FlashAttention | Fast and Memory-Efficient Exact Attention with IO-Awareness | 2022 |

## Open the portal

No build step and no install. Either:

- **Double-click `index.html`** to open it in your browser, or
- **Serve the folder** (`python3 -m http.server` in this directory, then visit http://localhost:8000), or
- **Publish with GitHub Pages**: repository Settings → Pages → Deploy from branch → `main` / root.

Progress, quiz answers, and notes are saved in your browser's local storage only.

## What each station contains

1. **The 60-second version**: the problem, the idea, the result, and why it matters for AI projects.
2. **See it work**: interactive figures. Most run real math (attention, positional encoding, BPE tokenization, sampling, the Chinchilla loss law, LoRA parameter counts, RoPE rotations, KV-cache memory). Figures that use made-up numbers to show a mechanism are labeled as teaching models.
3. **Key concepts**, **annotated code**, and **numbers worth remembering**.
4. **The four-step lab**: reproduce, use your own data, compare baselines, log failures. Each step has a Claude Code prompt that writes a Colab notebook into your portfolio repository.
5. **Build it in your stack**: one feature of *Delivery Copilot* (Node.js, Postgres + pgvector, MongoDB, Ollama), plus one AI project document to draft.
6. **Put it in your project plan**: work items with typical effort, owners, and risks, copyable into a spreadsheet.
7. **Reading guide**, **self-check quiz**, and **interview questions** with what a strong answer covers.
8. **Publish it**: a prompt to draft the station README and a post for your public portfolio.
9. **Sessions and notes**: the station's ~45-minute sessions as a checklist, plus notes with experiment-card and failure-log templates.

Shared pages: a **Today's session** card on the overview, a **study method** page with the Claude Code + Colab workflow and a schedule planner, an **AI project toolkit** (approach decision helper, training-cost and serving-memory calculators), a **portfolio and capstone** page, **interview practice** with a timer and 58 questions, a **glossary** of 133 terms, and an **About you** questionnaire.

## Repository layout

```
index.html                 entry point
css/styles.css             design tokens (light and dark) and components
js/core.js                 helpers: DOM, storage, formatting, chart scales, tooltips
js/app.js                  hash router and page renderers
js/content/glossary.js     glossary terms
js/content/papers-*.js     station content (stories, concepts, labs, quizzes)
js/widgets/*.js            interactive figures and calculators
js/content/tailoring.js    sessions, build steps, project-plan rows, interview questions
js/content/portfolio.js    project-document templates, capstone, general interview bank
labs/                      lab guide, templates, and reference code
portfolio-template/        starter files for your own public portfolio repository
scripts/export-templates.js  regenerates portfolio-template/ from js/content/portfolio.js
```

To edit content, change the objects in `js/content/`. Text can link glossary terms with `[[term-id]]` or `[[term-id|label]]`.

## Labs and capstone

See [`labs/README.md`](labs/README.md). Every lab runs on a free Google Colab GPU. `labs/01-transformer/tiny_transformer.py` is a fully commented reference implementation for Station 01.

To start your own portfolio, create a new public repository, copy the contents of [`portfolio-template/`](portfolio-template/) into it, and open Claude Code there. The capstone app, Delivery Copilot, is built in that repository from each station's build prompt.
