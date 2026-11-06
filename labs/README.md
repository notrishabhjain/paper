# Labs

Every station ends with the same four steps:

1. **Reproduce** the paper's core result, even partially and at toy scale.
2. **Use your own dataset** from your work or domain.
3. **Compare 2–3 baselines** on the same data and metric.
4. **Document what failed and why** in a failure log.

The full instructions and copy-ready prompts live on each station's page in the portal. This folder holds what is useful to keep in the repository.

## How to run a lab with Claude Code and free Colab

You act as the project manager; Claude Code acts as the engineer.

1. Create a public portfolio repository (start from [`../portfolio-template/`](../portfolio-template/)), clone it, and open Claude Code in it.
2. Copy the station's lab prompt. It starts with standing instructions: write one notebook into `stations/NN-name/`, free tools only, a plan before code, plain-English notes above every cell, short runs, fixed seeds.
3. Review Claude Code's plan, adjust it, and approve. Commit and push the notebook.
4. In Google Colab, open the notebook from the GitHub tab, set Runtime → Change runtime type → T4 GPU, and run all cells.
5. When something breaks, paste the error back into Claude Code and ask for a plain-English explanation before the fix. Log it with the failure-log template.
6. Save outputs with File → Save a copy in GitHub, fill in an experiment card, and use the station's publish prompt to draft the README and post.

## Where your work goes

Your notebooks, experiment cards, and failure logs live in your own portfolio repository, one folder per station (`stations/00-foundations/` to `stations/09-flashattention/`), next to the `delivery-copilot/` app. The lab prompts tell Claude Code to use those paths. This folder keeps the shared templates (`templates/`) and the Station 01 reference implementation.

## Reference implementation

`01-transformer/tiny_transformer.py` is a character-level, decoder-only Transformer in about 200 lines, with a comment on every block mapping it to the paper's sections. It trains on any text file:

```bash
# Colab with a T4 GPU (about 10 minutes)
python tiny_transformer.py --data input.txt --steps 3000

# Laptop CPU, smaller model
python tiny_transformer.py --data input.txt --steps 500 --layers 2 --embed 64

# Ablations for the baselines step
python tiny_transformer.py --data input.txt --no-pos      # no positional encoding
python tiny_transformer.py --data input.txt --heads 1     # one attention head
```

Get Tiny Shakespeare with:

```bash
wget https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt
```

You will reuse this model at Station 05 (scaling study), Station 08 (LLaMA-style ablation), and Station 09 (attention benchmarks).

## Compute

| Option | Use it for | Cost |
|--------|-----------|------|
| Google Colab free tier (T4 GPU) | Every lab | Free, with session limits |
| Kaggle Notebooks (T4/P100) | Backup when Colab limits hit | Free, about 30 GPU-hours a week |
| Paid GPUs (L4/A100) | Not needed. Only the optional FlashAttention-2 kernel comparison benefits from Ampere or newer | Skip on the free route |
