# Paper Trail

An interactive study route through nine AI papers, built for product and project managers moving into AI. Each paper gets a station with plain-language explanations, interactive figures, vocabulary, and a four-step lab you run with an AI coding assistant.

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

1. **The 60-second version**: the problem, the idea, the result, and why a PM should care.
2. **See it work**: interactive figures. Most run real math (attention, positional encoding, BPE tokenization, sampling, the Chinchilla loss law, LoRA parameter counts, RoPE rotations, KV-cache memory). Figures that use made-up numbers to show a mechanism are labeled as teaching models.
3. **Key concepts**: how each idea works and where you meet it in products.
4. **Read the code**: a short snippet with a plain-English note beside every line.
5. **Numbers worth remembering**: the figures people quote in meetings.
6. **The four-step lab**: reproduce, use your own data, compare baselines, log failures. Each step has a ready-to-paste prompt for Claude, Claude Code, or a similar assistant.
7. **System design takeaways**: the decisions the paper helps you make.
8. **Reading guide**: which sections of the paper to read and which to skip on a first pass.
9. **Self-check quiz**, **progress checklist**, and a **notes box** with experiment-card and failure-log templates.

Plus: a **study method** page with a schedule planner, a **PM toolkit** (approach decision helper, training-cost and serving-memory calculators, questions for your ML team), a **glossary** of 129 terms, and an **About you** questionnaire for tailoring the route.

## Repository layout

```
index.html                 entry point
css/styles.css             design tokens (light and dark) and components
js/core.js                 helpers: DOM, storage, formatting, chart scales, tooltips
js/app.js                  hash router and page renderers
js/content/glossary.js     glossary terms
js/content/papers-*.js     station content (stories, concepts, labs, quizzes)
js/widgets/*.js            interactive figures and calculators
labs/                      lab guide, templates, and reference code
```

To edit content, change the objects in `js/content/`. Text can link glossary terms with `[[term-id]]` or `[[term-id|label]]`.

## Labs

See [`labs/README.md`](labs/README.md). Every lab runs on a free Google Colab GPU. `labs/01-transformer/tiny_transformer.py` is a fully commented reference implementation for Station 01.
