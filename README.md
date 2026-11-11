# Paper Trail

Four interactive study routes for IT project and program managers moving into AI. Written for people with no AI background: every page starts in plain English with an everyday comparison and an example from project work, then brings in the real terms, then hands-on practice with free tools and ready prompts for Claude Code.

A **Start here** page explains how AI works in nine small steps. A **Library** explains every paper behind Routes 2 to 4 in two plain sentences each, and lists the tools, Obsidian plugins, open-source projects, and ready-made Claude Code toolkit they use. The **Toolkit** page adds agent tools for project managers: a build-or-not ladder, a go-live checklist, and run-cost and automation-threshold calculators. A **Glossary** of 200+ terms opens from any highlighted word.

| Route | What it covers | Size |
|-------|----------------|------|
| 1 · How AI models work | Ten stations, one landmark paper each, from the Transformer to FlashAttention, with labs on a free GPU and a Node.js capstone (Delivery Copilot) | 133 sessions, about 91 hours |
| 2 · How AI agents work | The map, context, the loop, the gate, the harness, evals, and production | 7 units, 41 sessions, about 25 hours |
| 3 · Build your second brain | A personal knowledge base an AI agent maintains: the idea, setup, ingestion, structuring, graphs, agents, retrieval, outputs, upkeep, and troubleshooting | 10 units, 57 sessions, about 35 hours |
| 4 · Deep dives | Knowledge graphs, System One models (Jev), agent harnesses, loop engineering, and evals | 5 handbooks, 30 sessions, about 18 hours |

Routes 2 to 4 are adapted from [Second Brain OS](https://secondbrainos.dev/) (MIT license), rewritten for readers new to AI, with new interactive figures (flows, layer stacks, rings, comparisons, a context-budget calculator, loop and gate simulators, a trace checker, and a knowledge graph you can walk), short lessons, quizzes, interview questions, and practice prompts.

### Route 1 stations

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

Pick a **daily route** on the overview page; the “Today's session” card follows it and moves on to the next route when it is done.

## Open the portal

No build step and no install. Either:

- **Double-click `index.html`** to open it in your browser, or
- **Serve the folder** (`python3 -m http.server` in this directory, then visit http://localhost:8000), or
- **Deploy it on Vercel** (steps below), or **GitHub Pages**: repository Settings → Pages → Deploy from branch → `main` / root.

Progress, quiz answers, and notes are saved in your browser's local storage only.

## Deploy on Vercel

The site is plain HTML, CSS, and JavaScript with no build step, so Vercel serves it as-is. `vercel.json` adds a few security headers and makes sure updated CSS and JavaScript are picked up after each deploy.

1. Merge the latest pull request into `main` on GitHub.
2. In Vercel, choose **Add New → Project** and import this GitHub repository.
3. Use these settings:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (the repository root)
   - **Build Command:** leave empty (or turn the override on and leave it blank)
   - **Output Directory:** `./` (the repository root)
   - **Install Command:** leave empty
4. Click **Deploy**. Vercel gives you a `*.vercel.app` address in under a minute.
5. Under **Settings → Git**, set the **Production Branch** to `main`, so every merge to `main` updates the live site and every pull request gets its own preview link.

Progress and notes are stored in each visitor's browser, so they are separate on the Vercel site and on the Claude preview link.

## What each unit contains (Routes 2 to 4)

1. **In plain English** (Part 1): where you are, a short explanation, an everyday comparison, an example from project work, a few key words, three things to remember, and interactive figures.
2. **Lessons** (Part 2): short lessons, one idea each, grouped into sessions of 25 to 45 minutes, with comparisons, annotated examples, and “for your project” notes.
3. **Practice** (Part 3): a Claude Code prompt that builds something small with free tools (Ollama, open-source libraries, the free Obsidian app), a self-check quiz, interview questions, and sources.

## What each station contains

1. **In plain English** (Part 1): where you are on the route, a short jargon-free explanation, an everyday comparison, an example from project work, the few words worth learning now, and three things to remember.
1. **The paper in 60 seconds** (Part 2): the problem, the idea, the result, and why it matters for AI projects.
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
js/content/plain.js        the plain-English layer and the nine-step Start story
js/content/plain-deeper.js plain guides for every later section and page, concept comparisons
vercel.json                Vercel settings (static site, no build step)
js/content/portfolio.js    project-document templates, capstone, general interview bank
js/content/units-*.js      Routes 2 to 4: agents, second brain, and deep-dive units
js/content/glossary-agents.js  glossary terms for Routes 2 to 4
js/content/library.js      the Library: every paper and reading behind Routes 2 to 4
js/content/library-tools.js  the Library: tools, plugins, repositories, and recent releases
js/widgets/diagrams.js     data-driven diagrams and simulators used by the units
labs/                      lab guide, templates, and reference code
portfolio-template/        starter files for your own public portfolio repository
scripts/export-templates.js  regenerates portfolio-template/ from js/content/portfolio.js
```

To edit content, change the objects in `js/content/`. Text can link glossary terms with `[[term-id]]` or `[[term-id|label]]`. A unit's figures name a widget (`flow`, `layers`, `rings`, `compare`, `bars`, `tree`, `funnel`, `kgraph`, and others) and pass its data in `opts`.

## Labs and capstone

See [`labs/README.md`](labs/README.md). Every lab runs on a free Google Colab GPU. `labs/01-transformer/tiny_transformer.py` is a fully commented reference implementation for Station 01.

To start your own portfolio, create a new public repository, copy the contents of [`portfolio-template/`](portfolio-template/) into it, and open Claude Code there. The capstone app, Delivery Copilot, is built in that repository from each station's build prompt.
