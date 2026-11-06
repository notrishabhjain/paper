#!/usr/bin/env node
/* Writes the portfolio and project-document templates from js/content/portfolio.js into
   portfolio-template/ as Markdown, so the portal and the repository never drift apart.
   Usage: node scripts/export-templates.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { console, document: { dispatchEvent() {} }, CustomEvent: function () {} };
ctx.window = ctx;
vm.createContext(ctx);
["js/core.js", "js/content/glossary.js", "js/content/papers-a.js", "js/content/papers-b.js",
 "js/content/papers-c.js", "js/content/tailoring.js", "js/content/portfolio.js"].forEach((f) => {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
});
const P = ctx.Portal;
const out = path.join(root, "portfolio-template");
fs.mkdirSync(path.join(out, "project-docs"), { recursive: true });
fs.mkdirSync(path.join(out, "stations"), { recursive: true });

const pad = (n) => (n < 10 ? "0" + n : String(n));
const papers = P.sortedPapers();
const block = (text) => "```\n" + text.trim() + "\n```\n";

// Top-level README for the user's own portfolio repository
const rows = papers.map((p) => `| ${pad(p.num)} | [${p.short}](stations/${pad(p.num)}-${p.id}/) | ${p.build ? p.build.feature : ""} | ${P.templates[p.build.doc].title} | Not started |`).join("\n");
fs.writeFileSync(path.join(out, "README.md"),
`# AI Paper Trail: my portfolio

I am an IT project manager moving into AI project and program management. This repository holds my hands-on work through ten stations, from *Attention Is All You Need* to *FlashAttention*, and **Delivery Copilot**, a Node.js assistant for project teams that I built one feature at a time.

Every notebook was written with Claude Code and run on the free Google Colab GPU. Everything here uses public or sample data.

## Progress

| # | Station | Delivery Copilot feature | Project document | Result |
|---|---------|--------------------------|------------------|--------|
${rows}

## Layout

${block(P.portfolioTemplates.repo)}
## What I learned about running AI projects

(Add one line per station as you go.)
`);

// Station README and post templates
fs.writeFileSync(path.join(out, "stations", "STATION-README-template.md"), P.portfolioTemplates.readme);
fs.writeFileSync(path.join(out, "post-template.md"), "# Post template\n\n" + block(P.portfolioTemplates.post));

// Project documents
const index = [];
Object.keys(P.templates).forEach((k) => {
  const t = P.templates[k];
  const p = P.paper(t.station);
  const file = `${pad(p.num)}-${k}.md`;
  index.push(`| ${pad(p.num)} · ${p.short} | [${t.title}](${file}) |`);
  fs.writeFileSync(path.join(out, "project-docs", file),
    `# ${t.title}\n\nDrafted at Station ${pad(p.num)} (${p.short}). Fill it in for Delivery Copilot here; keep the version for your real work project private.\n\n${block(t.text)}`);
});
fs.writeFileSync(path.join(out, "project-docs", "README.md"),
  "# The AI project manager's document kit\n\n| Station | Document |\n|---|---|\n" + index.join("\n") + "\n");

// Claude Code standing instructions
fs.writeFileSync(path.join(out, "CLAUDE-CODE-INSTRUCTIONS.md"),
  "# Standing instructions for Claude Code\n\nEvery Delivery Copilot prompt on the Paper Trail portal starts with these lines.\n\n" + block(P.APP_PREAMBLE.replace(/\nFEATURE\n$/, "")));

console.log("Wrote templates to", path.relative(process.cwd(), out) || ".");
