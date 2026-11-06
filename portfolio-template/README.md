# AI Paper Trail: my portfolio

I am an IT project manager moving into AI project and program management. This repository holds my hands-on work through ten stations, from *Attention Is All You Need* to *FlashAttention*, and **Delivery Copilot**, a Node.js assistant for project teams that I built one feature at a time.

Every notebook was written with Claude Code and run on the free Google Colab GPU. Everything here uses public or sample data.

## Progress

| # | Station | Delivery Copilot feature | Project document | Result |
|---|---------|--------------------------|------------------|--------|
| 00 | [Foundations](stations/00-foundations/) | Token and cost meter | AI project charter | Not started |
| 01 | [Transformer](stations/01-transformer/) | Document ingestion and chunking | AI risk register | Not started |
| 02 | [BERT](stations/02-bert/) | Semantic search with embeddings | Data readiness assessment | Not started |
| 03 | [GPT-2](stations/03-gpt2/) | Local LLM generation endpoint | Release and misuse review | Not started |
| 04 | [GPT-3](stations/04-gpt3/) | RAG answers with an evaluation harness | Evaluation plan | Not started |
| 05 | [Chinchilla](stations/05-chinchilla/) | Cost and capacity planner | Cost and capacity model | Not started |
| 06 | [InstructGPT](stations/06-instructgpt/) | Feedback and preference capture | Labeling guideline | Not started |
| 07 | [LoRA](stations/07-lora/) | Prompt, model, and adapter registry | Model change log and rollback plan | Not started |
| 08 | [LLaMA](stations/08-llama/) | Model comparison for build vs. buy | Build vs. buy decision memo | Not started |
| 09 | [FlashAttention](stations/09-flashattention/) | Latency and performance benchmark | Launch go/no-go checklist | Not started |

## Layout

```
ai-paper-trail/                 public GitHub repository
  README.md                     who you are, the route, a progress table, links
  stations/
    00-foundations/
      README.md                 results, what failed, what it means for AI projects
      lab.ipynb                 notebooks written by Claude Code, run on free Colab
      experiment-card.md
      failure-log.md
    01-transformer/
    ...
  delivery-copilot/             the capstone app (Node.js + Postgres + MongoDB + Ollama)
  project-docs/                 charter, risk register, evaluation plan, ... (sample project)
```

## What I learned about running AI projects

(Add one line per station as you go.)
