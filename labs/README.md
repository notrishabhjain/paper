# Labs

Every station ends with the same four steps:

1. **Reproduce** the paper's core result, even partially and at toy scale.
2. **Use your own dataset** from your work or domain.
3. **Compare 2–3 baselines** on the same data and metric.
4. **Document what failed and why** in a failure log.

The full instructions and copy-ready prompts live on each station's page in the portal. This folder holds what is useful to keep in the repository.

## How to run a lab with an AI coding assistant

You act as the PM; the assistant acts as the engineer.

1. Open the station's lab tab and copy the prompt. It starts with standing instructions (one Colab notebook, a plan before code, plain-English notes above every cell, short runs, fixed seeds).
2. Paste it into Claude, Claude Code, or a similar assistant. Review the plan and adjust it before approving.
3. Run the notebook in Google Colab (Runtime → Change runtime type → T4 GPU).
4. When something breaks, paste the error back and ask for a plain-English explanation before the fix. Log it with the failure-log template.
5. Fill in an experiment card for each run and save the notebook, card, and log in this folder, one subfolder per station.

## Suggested folder structure for your work

```
labs/
  01-transformer/
    tiny_transformer.py        reference implementation (provided)
    notebook.ipynb             your Colab notebook
    experiment-card.md         one per run
    failure-log.md
  02-bert/
  ...
  templates/
    experiment-card.md         copy one per run
    failure-log.md
```

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
| Colab Pro or a cloud L4/A100 | Faster runs; FlashAttention-2 kernels need Ampere or newer | About $10/month or $1–3/hour |
