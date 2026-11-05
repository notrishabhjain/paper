/* Widgets for GPT-2 and GPT-3: sampling controls, model scale chart, few-shot prompt builder, zero-shot tricks. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  /* ---------------- Next-token sampling: temperature, top-k, top-p ---------------- */
  P.widget("sampling", function (root) {
    var prompt = "The best way to learn AI is to";
    var cands = [
      [" build", 3.2], [" read", 2.9], [" start", 2.5], [" practice", 2.3], [" take", 2.0], [" use", 1.8],
      [" just", 1.5], [" ask", 1.2], [" teach", 0.9], [" watch", 0.7], [" never", -0.4], [" banana", -1.6]
    ];
    var temp = 1, topk = 12, topp = 1, tally = null;
    function dist() {
      var probs = P.softmax(cands.map(function (c) { return c[1]; }), Math.max(0.05, temp));
      var order = probs.map(function (p, i) { return [p, i]; }).sort(function (a, b) { return b[0] - a[0]; });
      var keep = {}, cum = 0;
      order.forEach(function (o, rank) {
        if (rank < topk && (cum < topp || rank === 0)) { keep[o[1]] = true; cum += o[0]; }
      });
      var sum = 0;
      probs.forEach(function (p, i) { if (keep[i]) sum += p; });
      return cands.map(function (c, i) { return { tok: c[0], p: keep[i] ? probs[i] / sum : 0, cut: !keep[i], raw: probs[i] }; });
    }
    var bars = h("div", { class: "bars" });
    var out = h("div", { class: "gen-out", "aria-live": "polite" });
    var sTemp = P.slider({ id: "smp-temp", label: "Temperature", min: 0.1, max: 2, step: 0.05, value: temp, format: function (v) { return v.toFixed(2); }, onInput: function (v) { temp = v; tally = null; paint(); } });
    var sK = P.slider({ id: "smp-k", label: "Top-k", min: 1, max: 12, step: 1, value: topk, onInput: function (v) { topk = v; tally = null; paint(); } });
    var sP = P.slider({ id: "smp-p", label: "Top-p (nucleus)", min: 0.1, max: 1, step: 0.05, value: topp, format: function (v) { return v.toFixed(2); }, onInput: function (v) { topp = v; tally = null; paint(); } });
    var go = h("button", { type: "button", class: "btn primary", text: "Sample 20 times" });
    var greedy = h("button", { type: "button", class: "btn", text: "Greedy preset" });
    var creative = h("button", { type: "button", class: "btn", text: "Creative preset" });
    var reset = h("button", { type: "button", class: "btn", text: "Reset" });
    go.addEventListener("click", function () {
      var d = dist(), t = {};
      for (var n = 0; n < 20; n++) {
        var r = Math.random(), acc = 0;
        for (var i = 0; i < d.length; i++) { acc += d[i].p; if (r <= acc) { t[d[i].tok] = (t[d[i].tok] || 0) + 1; break; } }
      }
      tally = t; paint();
    });
    function preset(t, k, p) { temp = t; topk = k; topp = p; sTemp.set(t); sK.set(k); sP.set(p); tally = null; paint(); }
    greedy.addEventListener("click", function () { preset(0.1, 1, 1); });
    creative.addEventListener("click", function () { preset(1.3, 12, 0.95); });
    reset.addEventListener("click", function () { preset(1, 12, 1); });
    root.appendChild(h("div", { class: "prompt-preview", text: prompt + " ___" }));
    root.appendChild(h("div", { class: "controls" }, sTemp, sK, sP));
    root.appendChild(h("div", { class: "row" }, go, greedy, creative, reset));
    root.appendChild(bars);
    root.appendChild(out);
    root.appendChild(h("p", { class: "fig-note", text: "Real sampling math on a made-up list of next-token scores. Grey bars are tokens the current settings rule out." }));
    function paint() {
      var d = dist();
      var max = Math.max.apply(null, d.map(function (x) { return x.p; })) || 1;
      P.clear(bars);
      d.forEach(function (x) {
        bars.appendChild(h("div", { class: "bar-row" + (x.cut ? " cut" : "") },
          h("span", { class: "bl", text: x.tok.replace(" ", "␣") }),
          h("span", { class: "bar-track" }, h("span", { class: "bar-fill", style: { display: "block", width: (x.cut ? x.raw / max : x.p / Math.max(max, 0.0001)) * 100 + "%" } })),
          h("span", { class: "bv", text: x.cut ? "cut" : (x.p * 100).toFixed(1) + "%" })));
      });
      P.clear(out);
      if (!tally) {
        var kept = d.filter(function (x) { return !x.cut; }).length;
        out.appendChild(document.createTextNode(kept === 1 ? "Only one token can be picked: output will be the same every time (deterministic)." : kept + " tokens can be picked. Press \"Sample 20 times\" to see how varied the outputs are."));
      } else {
        Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).forEach(function (k) {
          out.appendChild(h("div", null, prompt, h("span", { class: "gen-new", text: k }), h("span", { class: "muted", text: "  × " + tally[k] })));
        });
      }
    }
    paint();
  });

  /* ---------------- Model scale chart (log scale) ---------------- */
  var MODELS = [
    { name: "Transformer (big)", year: 2017, params: 213e6, tokens: null, station: "transformer" },
    { name: "BERT-Large", year: 2018, params: 340e6, tokens: 131e9, station: "bert" },
    { name: "GPT-2", year: 2019, params: 1.5e9, tokens: null, station: "gpt2" },
    { name: "GPT-3", year: 2020, params: 175e9, tokens: 300e9, station: "gpt3" },
    { name: "Gopher", year: 2021, params: 280e9, tokens: 300e9, station: "chinchilla" },
    { name: "Chinchilla", year: 2022, params: 70e9, tokens: 1.4e12, station: "chinchilla" },
    { name: "InstructGPT (small)", year: 2022, params: 1.3e9, tokens: null, station: "instructgpt" },
    { name: "LLaMA-7B", year: 2023, params: 6.7e9, tokens: 1.0e12, station: "llama" },
    { name: "LLaMA-13B", year: 2023, params: 13e9, tokens: 1.0e12, station: "llama" },
    { name: "LLaMA-65B", year: 2023, params: 65.2e9, tokens: 1.4e12, station: "llama" }
  ];
  P.widget("scale", function (root, opts) {
    var mode = opts.mode || "params";
    var chart = h("div", { class: "chart" });
    var segEl = P.seg([
      { value: "params", label: "Parameters" },
      { value: "tokens", label: "Training tokens" },
      { value: "ratio", label: "Tokens per parameter" }
    ], mode, function (v) { mode = v; paint(); }, "Measure");
    var note = h("p", { class: "small", "aria-live": "polite" });
    root.appendChild(segEl);
    root.appendChild(chart);
    root.appendChild(note);
    root.appendChild(h("p", { class: "fig-note", text: "Numbers from each paper. Training tokens are shown only where the paper states them (BERT's is computed from its batch size and step count)." }));
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function paint() {
      var rows = MODELS.map(function (m) {
        var v = mode === "params" ? m.params : mode === "tokens" ? m.tokens : (m.tokens ? m.tokens / m.params : null);
        return { m: m, v: v };
      }).filter(function (r) { return r.v; });
      var min = mode === "ratio" ? 0.5 : mode === "tokens" ? 1e10 : 1e8;
      var max = mode === "ratio" ? 300 : mode === "tokens" ? 1e13 : 1e12;
      var labelW = Math.min(150, W * 0.36), barH = 22, gap = 10, top = 8, H = top + rows.length * (barH + gap) + 30;
      var x = P.scaleLog(min, max, labelW, W - 56);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Model comparison on a log scale" });
      var ticks = mode === "ratio" ? [1, 10, 100] : P.niceLogTicks(min, max);
      ticks.forEach(function (t) {
        svg.appendChild(s("line", { class: "chart-grid", x1: x(t), x2: x(t), y1: top, y2: H - 26 }));
        svg.appendChild(s("text", { class: "chart-muted", x: x(t), y: H - 10, "text-anchor": "middle", text: mode === "ratio" ? String(t) : P.fmt.compact(t, 0) }));
      });
      if (mode === "ratio") {
        svg.appendChild(s("line", { x1: x(20), x2: x(20), y1: top, y2: H - 26, stroke: "var(--c2)", "stroke-width": 2 }));
        svg.appendChild(s("text", { class: "chart-text-strong", x: x(20) + 4, y: H - 10, text: "20 (Chinchilla rule)" }));
      }
      rows.forEach(function (r, i) {
        var y = top + i * (barH + gap);
        svg.appendChild(s("text", { class: "chart-text", x: labelW - 8, y: y + barH / 2 + 4, "text-anchor": "end", text: r.m.name + " · " + r.m.year }));
        var wBar = Math.max(2, x(r.v) - labelW);
        var bar = s("path", { d: "M" + labelW + "," + y + "h" + (wBar - 4) + "a4,4 0 0 1 4,4v" + (barH - 8) + "a4,4 0 0 1 -4,4h" + (-(wBar - 4)) + "z", fill: "var(--c1)" });
        var val = mode === "ratio" ? r.v.toFixed(r.v < 10 ? 1 : 0) + " tokens/param" : P.fmt.compact(r.v, 1) + (mode === "params" ? " parameters" : " tokens");
        P.bindTip(bar, val, r.m.name + " (" + r.m.year + ")");
        svg.appendChild(bar);
        svg.appendChild(s("text", { class: "chart-text-strong", x: labelW + wBar + 6, y: y + barH / 2 + 4, text: mode === "ratio" ? r.v.toFixed(r.v < 10 ? 1 : 0) : P.fmt.compact(r.v, 1) }));
      });
      P.clear(chart).appendChild(svg);
      note.textContent = {
        params: "Each grid line is 10× the last. GPT-3 is about 800× the original Transformer, three years later.",
        tokens: "Chinchilla and LLaMA saw 4–5× more text than GPT-3 while being smaller. Data became the lever.",
        ratio: "GPT-3 and Gopher saw under 2 tokens per parameter. Chinchilla showed about 20 is compute-optimal. LLaMA-7B went far past it on purpose, trading training compute for a model that is cheap to run."
      }[mode];
    }
    paint();
  });

  /* ---------------- Few-shot prompt builder ---------------- */
  var TASKS = {
    translate: {
      name: "Translate (the paper's example)",
      desc: "Translate English to French:",
      examples: [["sea otter", "loutre de mer"], ["peppermint", "menthe poivrée"], ["plush giraffe", "girafe peluche"]],
      query: "cheese", answer: "fromage", sep: " => "
    },
    sentiment: {
      name: "Review sentiment",
      desc: "Label each app review as Positive or Negative.",
      examples: [["Setup took two minutes and it just works.", "Positive"], ["Crashes every time I upload a photo.", "Negative"], ["Support replied fast and fixed my billing issue.", "Positive"]],
      query: "The new update deleted all my saved filters.", answer: "Negative", sep: "\nLabel: ", pre: "Review: "
    },
    routing: {
      name: "Ticket routing",
      desc: "Route each support ticket to Billing, Bug, or Feature request.",
      examples: [["I was charged twice this month.", "Billing"], ["Export to CSV gives an empty file.", "Bug"], ["Please add dark mode to the dashboard.", "Feature request"]],
      query: "Can you let us schedule reports weekly?", answer: "Feature request", sep: "\nTeam: ", pre: "Ticket: "
    }
  };
  P.widget("fewshot", function (root) {
    var task = "translate", shots = 3, price = 3;
    var preview = h("div", { class: "prompt-preview", "aria-live": "polite" });
    var readout = P.readout([
      { key: "tok", label: "Prompt length" },
      { key: "cost", label: "Input cost per 1M requests" },
      { key: "learn", label: "Weights changed" }
    ]);
    var taskSeg = P.seg(Object.keys(TASKS).map(function (k) { return { value: k, label: TASKS[k].name }; }), task, function (v) { task = v; paint(); }, "Task");
    var shotSeg = P.seg([{ value: 0, label: "Zero-shot" }, { value: 1, label: "One-shot" }, { value: 3, label: "Few-shot (3)" }], shots, function (v) { shots = v; paint(); }, "Examples");
    var priceSlider = P.slider({ id: "fs-price", label: "Price per 1M input tokens", min: 0.1, max: 15, step: 0.1, value: price, format: function (v) { return "$" + v.toFixed(2); }, onInput: function (v) { price = v; paint(); } });
    root.appendChild(h("div", { class: "controls" },
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Task" }), h("div", { class: "scroll-x" }, taskSeg)),
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Examples in the prompt" }), shotSeg)));
    root.appendChild(preview);
    root.appendChild(h("div", { class: "controls" }, priceSlider));
    root.appendChild(readout);
    function paint() {
      var t = TASKS[task];
      P.clear(preview);
      preview.appendChild(h("div", { class: "ex", text: t.desc }));
      t.examples.slice(0, shots).forEach(function (e) {
        preview.appendChild(h("div", { class: "ex", text: (t.pre || "") + e[0] + t.sep + e[1] }));
      });
      preview.appendChild(h("div", { class: "qline" }, (t.pre || "") + t.query + t.sep, h("span", { class: "gen-new", text: t.answer })));
      var text = preview.textContent;
      var tokens = Math.round(text.length / 4);
      readout.update("tok", "≈ " + tokens + " tokens", "rough rule: 4 characters per token");
      readout.update("cost", P.fmt.money(tokens * price), "you pay for the examples on every call");
      readout.update("learn", "None", "the model infers the task from the prompt");
    }
    paint();
  });

  /* ---------------- Zero-shot task tricks (GPT-2) ---------------- */
  P.widget("zeroshot", function (root) {
    var TRICKS = {
      summary: { name: "Summarize", prompt: "[a long news article about a product recall…]\nTL;DR:", how: "On Reddit, people write \"TL;DR:\" before a summary. GPT-2 saw that pattern in WebText, so adding it invites a summary. The paper scored this on news summarization: weak, but non-trivial for a model never trained to summarize." },
      translate: { name: "Translate", prompt: "english sentence = french sentence\n…\nThe meeting moved to Tuesday. =", how: "Show a few \"english = french\" pairs and leave the last one open. GPT-2 picked up some French from the small amount that slipped into its English-only training data." },
      qa: { name: "Answer questions", prompt: "Q: Who wrote the novel Pride and Prejudice?\nA:", how: "The Q:/A: format appears all over the web. The 1.5B model answered about 4% of Natural Questions correctly, far below specialised systems, but up from almost nothing for small models." }
    };
    var cur = "summary";
    var segEl = P.seg(Object.keys(TRICKS).map(function (k) { return { value: k, label: TRICKS[k].name }; }), cur, function (v) { cur = v; paint(); }, "Task");
    var box = h("div", { class: "prompt-preview" });
    var how = h("p", { class: "small" });
    root.appendChild(segEl);
    root.appendChild(box);
    root.appendChild(how);
    function paint() { box.textContent = TRICKS[cur].prompt; how.textContent = TRICKS[cur].how; }
    paint();
  });
})();
