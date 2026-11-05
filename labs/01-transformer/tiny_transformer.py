"""
A tiny decoder-only Transformer, written to be READ, not just run.

This is the GPT-style half of "Attention Is All You Need" (Vaswani et al., 2017),
trained at character level on any text file. Every block of code has a plain-English
comment, plus the paper section it comes from.

Run it in Google Colab (Runtime > Change runtime type > T4 GPU):

    !python tiny_transformer.py --data input.txt --steps 3000

Or on a laptop CPU with a smaller setting:

    python tiny_transformer.py --data input.txt --steps 500 --layers 2 --embed 64

Ablations used in Lab step 3 (Baselines):

    --no-pos      remove positional encoding (the model loses word order)
    --heads 1     one attention head instead of four
"""

import argparse
import math
import time

import torch
import torch.nn as nn
import torch.nn.functional as F


# ---------------------------------------------------------------------------
# Settings you can change from the command line
# ---------------------------------------------------------------------------
parser = argparse.ArgumentParser()
parser.add_argument("--data", default="input.txt", help="Path to a plain-text training file")
parser.add_argument("--steps", type=int, default=3000, help="How many training steps to run")
parser.add_argument("--layers", type=int, default=4, help="How many Transformer blocks to stack")
parser.add_argument("--heads", type=int, default=4, help="Attention heads per block")
parser.add_argument("--embed", type=int, default=128, help="Vector size per token (d_model)")
parser.add_argument("--context", type=int, default=128, help="How many characters the model sees at once")
parser.add_argument("--batch", type=int, default=64, help="Sequences per training step")
parser.add_argument("--lr", type=float, default=3e-4, help="Learning rate (size of each nudge)")
parser.add_argument("--dropout", type=float, default=0.1)
parser.add_argument("--no-pos", action="store_true", help="Ablation: remove positional encoding")
parser.add_argument("--eval-every", type=int, default=250)
parser.add_argument("--seed", type=int, default=1337)
args = parser.parse_args()

torch.manual_seed(args.seed)  # Same seed, same result: makes experiments comparable.
device = "cuda" if torch.cuda.is_available() else "cpu"


# ---------------------------------------------------------------------------
# 1. Data: turn text into numbers (character-level tokenizer)
# ---------------------------------------------------------------------------
text = open(args.data, encoding="utf-8").read()
chars = sorted(set(text))                      # Every distinct character is one token.
vocab_size = len(chars)
stoi = {ch: i for i, ch in enumerate(chars)}   # character -> token ID
itos = {i: ch for ch, i in stoi.items()}       # token ID -> character
encode = lambda s: [stoi[c] for c in s]
decode = lambda ids: "".join(itos[i] for i in ids)

data = torch.tensor(encode(text), dtype=torch.long)
split = int(0.9 * len(data))                   # 90% to learn from, 10% held out to check
train_data, val_data = data[:split], data[split:]
print(f"{len(text):,} characters, {vocab_size} unique, device={device}")


def get_batch(which):
    """Pick random chunks of text. The target is the same chunk shifted by one character."""
    source = train_data if which == "train" else val_data
    starts = torch.randint(len(source) - args.context - 1, (args.batch,))
    x = torch.stack([source[i : i + args.context] for i in starts])
    y = torch.stack([source[i + 1 : i + args.context + 1] for i in starts])  # next character
    return x.to(device), y.to(device)


# ---------------------------------------------------------------------------
# 2. The model
# ---------------------------------------------------------------------------
def sinusoidal_positions(length, dim):
    """Paper section 3.5: a fixed pattern of sine and cosine waves, one row per position."""
    pos = torch.arange(length).unsqueeze(1)
    freq = torch.exp(torch.arange(0, dim, 2) * (-math.log(10000.0) / dim))
    pe = torch.zeros(length, dim)
    pe[:, 0::2] = torch.sin(pos * freq)
    pe[:, 1::2] = torch.cos(pos * freq)
    return pe


class SelfAttention(nn.Module):
    """Paper section 3.2: multi-head scaled dot-product attention, with a causal mask."""

    def __init__(self):
        super().__init__()
        assert args.embed % args.heads == 0
        self.qkv = nn.Linear(args.embed, 3 * args.embed)   # makes query, key, value for every token
        self.out = nn.Linear(args.embed, args.embed)       # mixes the heads back together
        self.drop = nn.Dropout(args.dropout)
        # Causal mask: position i may only look at positions 0..i (no peeking at the answer).
        mask = torch.tril(torch.ones(args.context, args.context)).view(1, 1, args.context, args.context)
        self.register_buffer("mask", mask)

    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv(x).split(C, dim=2)
        # Split each vector into `heads` smaller vectors so heads can specialize.
        q, k, v = (t.view(B, T, args.heads, C // args.heads).transpose(1, 2) for t in (q, k, v))
        scores = q @ k.transpose(-2, -1) / math.sqrt(k.size(-1))    # compare every query with every key
        scores = scores.masked_fill(self.mask[:, :, :T, :T] == 0, float("-inf"))
        weights = self.drop(F.softmax(scores, dim=-1))              # each row sums to 1
        y = weights @ v                                             # weighted mix of values
        y = y.transpose(1, 2).contiguous().view(B, T, C)            # glue the heads back together
        return self.out(y)


class Block(nn.Module):
    """One Transformer layer: attention, then a feed-forward network, each with a residual connection.

    The paper normalizes after each sub-layer (post-norm). GPT-2 and LLaMA normalize before
    (pre-norm), which trains more reliably; we follow them.
    """

    def __init__(self):
        super().__init__()
        self.norm1 = nn.LayerNorm(args.embed)
        self.attn = SelfAttention()
        self.norm2 = nn.LayerNorm(args.embed)
        self.ffn = nn.Sequential(                       # Paper section 3.3: expand 4x, then shrink back
            nn.Linear(args.embed, 4 * args.embed),
            nn.GELU(),
            nn.Linear(4 * args.embed, args.embed),
            nn.Dropout(args.dropout),
        )

    def forward(self, x):
        x = x + self.attn(self.norm1(x))   # residual: add the block's output to its input
        x = x + self.ffn(self.norm2(x))
        return x


class TinyGPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, args.embed)          # token ID -> vector
        self.register_buffer("pos", sinusoidal_positions(args.context, args.embed))
        self.drop = nn.Dropout(args.dropout)
        self.blocks = nn.Sequential(*[Block() for _ in range(args.layers)])
        self.norm = nn.LayerNorm(args.embed)
        self.head = nn.Linear(args.embed, vocab_size)              # vector -> score for every character

    def forward(self, idx, targets=None):
        T = idx.shape[1]
        x = self.embed(idx)
        if not args.no_pos:
            x = x + self.pos[:T]                                   # add the position fingerprint
        x = self.blocks(self.drop(x))
        logits = self.head(self.norm(x))
        loss = None
        if targets is not None:
            loss = F.cross_entropy(logits.view(-1, vocab_size), targets.view(-1))
        return logits, loss

    @torch.no_grad()
    def generate(self, idx, n_new, temperature=0.8):
        """Write text one character at a time, feeding each new character back in."""
        for _ in range(n_new):
            logits, _ = self(idx[:, -args.context :])
            probs = F.softmax(logits[:, -1, :] / temperature, dim=-1)
            idx = torch.cat([idx, torch.multinomial(probs, 1)], dim=1)
        return idx


model = TinyGPT().to(device)
n_params = sum(p.numel() for p in model.parameters())
print(f"{n_params / 1e6:.2f}M parameters | layers={args.layers} heads={args.heads} "
      f"embed={args.embed} positional_encoding={'off' if args.no_pos else 'on'}")


# ---------------------------------------------------------------------------
# 3. Training loop (the same loop as the Foundations station)
# ---------------------------------------------------------------------------
@torch.no_grad()
def estimate_loss(n=40):
    model.eval()
    out = {}
    for which in ("train", "val"):
        out[which] = sum(model(*get_batch(which))[1].item() for _ in range(n)) / n
    model.train()
    return out


def sample(n=300):
    start = torch.zeros((1, 1), dtype=torch.long, device=device)
    return decode(model.generate(start, n)[0].tolist())


optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)
history = []
t0 = time.time()
print("\n--- sample before training ---\n" + sample(200))

for step in range(args.steps + 1):
    if step % args.eval_every == 0 or step == args.steps:
        losses = estimate_loss()
        history.append((step, losses["train"], losses["val"]))
        print(f"step {step:5d} | train loss {losses['train']:.3f} | val loss {losses['val']:.3f} "
              f"| {time.time() - t0:.0f}s")
    if step == args.steps:
        break
    x, y = get_batch("train")
    _, loss = model(x, y)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

print("\n--- sample after training ---\n" + sample(400))
print("\nCopy this into your experiment card:")
print("step,train_loss,val_loss")
for s, tr, va in history:
    print(f"{s},{tr:.4f},{va:.4f}")
