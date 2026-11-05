/* Widgets: lifecycle map, schedule planner, tokenizer, gradient descent, embeddings, overfitting. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  /* ---------------- Lifecycle map ---------------- */
  var LIFECYCLE = [
    { stage: "foundations", name: "Data & tokens", papers: ["foundations", "gpt2", "llama"],
      what: "Collect, clean, deduplicate, and filter text. Build a tokenizer that turns text into numbers.",
      decisions: ["Which data sources, and are we licensed to use them?", "How do we remove personal data and toxic content?", "Which languages and domains must be covered?"],
      who: "Data engineers, legal and privacy, data vendors", cost: "Weeks to months. Often the slowest stage." },
    { stage: "architecture", name: "Architecture", papers: ["transformer"],
      what: "Pick the model design: encoder, decoder, or both; how many layers; how long a context window.",
      decisions: ["How long must the context window be for our use case?", "What latency can users tolerate?", "Do we need generation or only understanding?"],
      who: "Research scientists, ML engineers", cost: "Small experiments, days to weeks." },
    { stage: "pretrain", name: "Pre-training", papers: ["bert", "gpt2", "llama"],
      what: "Train on trillions of tokens to predict missing or next words. The model learns language and world knowledge.",
      decisions: ["Build, buy an API, or start from open weights? (Almost always one of the last two.)", "What does an open-weights license allow us to do?"],
      who: "ML infrastructure and research teams", cost: "From thousands of dollars for small models to $100M+ for frontier models." },
    { stage: "scale", name: "Scaling", papers: ["gpt3", "chinchilla"],
      what: "Decide how big the model should be and how much data it should see, given a compute budget.",
      decisions: ["Optimize for training cost or for serving cost?", "Is more data available, or are we data-limited?", "Which capabilities only appear at larger sizes?"],
      who: "Research leads, finance, leadership", cost: "Sets the size of every other bill." },
    { stage: "align", name: "Alignment", papers: ["instructgpt"],
      what: "Teach the model to follow instructions and be helpful and safe, using demonstrations and human rankings.",
      decisions: ["What does a good answer look like? (Labeling guidelines.)", "Who are the labelers, and how do we measure agreement?", "Which behaviors must the model refuse?"],
      who: "PMs, labelers and vendors, policy, research", cost: "Labeling budgets from thousands to millions of dollars. Weeks." },
    { stage: "adapt", name: "Adaptation", papers: ["lora"],
      what: "Customize a model for your product: prompting, retrieval (RAG), or fine-tuning with methods like LoRA.",
      decisions: ["Prompting, RAG, or fine-tuning? (See the PM toolkit.)", "What evaluation set proves it works on our data?", "How do we version and roll back adapters?"],
      who: "Applied ML engineers, PMs, domain experts", cost: "Tens to thousands of dollars per fine-tune. Hours to days." },
    { stage: "efficiency", name: "Serving", papers: ["flashattention"],
      what: "Run the model for users quickly and cheaply: efficient attention kernels, quantization, batching, caching.",
      decisions: ["What latency do we promise (p50 and p95)?", "What is our cost per 1,000 requests?", "How long a context can we afford to offer?"],
      who: "ML platform and infrastructure", cost: "Ongoing. Over a product's life, serving often costs more than training." }
  ];

  P.widget("lifecycle", function (root) {
    var current = P.store.get("lifecycle-stage", 0);
    var steps = h("div", { class: "lifecycle-steps", role: "group", "aria-label": "Lifecycle stages" });
    var detail = h("div", { class: "lc-detail", "aria-live": "polite" });
    var buttons = LIFECYCLE.map(function (st, i) {
      var names = st.papers.map(function (id) { var p = P.paper(id); return p ? p.short : id; }).join(", ");
      var b = h("button", { type: "button", class: "lc-step", "aria-pressed": String(i === current), style: { "--stage": P.stages[st.stage].color } },
        h("span", { class: "lc-n", text: "Stage " + (i + 1) }),
        h("span", { class: "lc-name", text: st.name }),
        h("span", { class: "lc-papers", text: names })
      );
      b.addEventListener("click", function () { current = i; P.store.set("lifecycle-stage", i); paint(); });
      steps.appendChild(b);
      return b;
    });
    function paint() {
      buttons.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === current)); });
      var st = LIFECYCLE[current];
      P.clear(detail);
      detail.appendChild(h("div", null, h("span", { class: "k", text: "What happens" }), h("p", { text: st.what }),
        h("span", { class: "k", style: { marginTop: "0.5rem" }, text: "Who is involved" }), h("p", { text: st.who }),
        h("span", { class: "k", style: { marginTop: "0.5rem" }, text: "Cost and time" }), h("p", { text: st.cost })));
      detail.appendChild(h("div", null, h("span", { class: "k", text: "Decisions a PM owns" }), h("ul", null, st.decisions.map(function (d) { return h("li", { text: d }); }))));
      detail.appendChild(h("div", null, h("span", { class: "k", text: "Stations that explain it" }),
        h("ul", null, st.papers.map(function (id) {
          var p = P.paper(id);
          return p ? h("li", null, h("a", { href: "#" + p.id, text: "Station " + (p.num < 10 ? "0" : "") + p.num + " · " + p.short })) : null;
        }))));
    }
    root.appendChild(steps);
    root.appendChild(detail);
    paint();
  });

  /* ---------------- Schedule planner ---------------- */
  P.widget("schedule", function (root) {
    var hours = P.store.get("hours-per-week", 6);
    var list = h("div");
    var readout = P.readout([
      { key: "total", label: "Total study hours" },
      { key: "weeks", label: "Weeks at this pace" },
      { key: "finish", label: "Finish around" }
    ]);
    var slider = P.slider({ id: "sched-hours", label: "Hours per week", min: 2, max: 20, step: 1, value: hours,
      format: function (v) { return v + " h"; },
      onInput: function (v) { hours = v; P.store.set("hours-per-week", v); paint(); } });
    root.appendChild(h("div", { class: "controls" }, slider));
    root.appendChild(readout);
    root.appendChild(list);
    function paint() {
      var papers = P.sortedPapers();
      var total = papers.reduce(function (a, p) { return a + p.hours; }, 0);
      var weeks = Math.ceil(total / hours);
      var finish = new Date(Date.now() + weeks * 7 * 864e5);
      readout.update("total", total + " h");
      readout.update("weeks", String(weeks));
      readout.update("finish", finish.toLocaleDateString("en-US", { month: "short", year: "numeric" }));
      P.clear(list);
      var cum = 0;
      var rows = papers.map(function (p) {
        var start = Math.floor(cum / hours) + 1;
        cum += p.hours;
        var end = Math.max(start, Math.ceil(cum / hours));
        return h("tr", null,
          h("td", null, h("a", { href: "#" + p.id, text: (p.num < 10 ? "0" : "") + p.num + " · " + p.short })),
          h("td", { class: "tnum", text: p.hours + " h" }),
          h("td", { class: "tnum", text: start === end ? "Week " + start : "Weeks " + start + "–" + end })
        );
      });
      list.appendChild(h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
        h("thead", null, h("tr", null, h("th", { text: "Station" }), h("th", { text: "Hours" }), h("th", { text: "When" }))),
        h("tbody", null, rows))));
    }
    paint();
  });

  /* ---------------- Tokenizer (a real, tiny BPE trained in your browser) ---------------- */
  var CORPUS =
    "the product manager wrote the product requirements for the new feature. the team reviewed the requirements and " +
    "estimated the work. users reported that the new feature was slow, so the engineers profiled the system and found " +
    "the bottleneck. the model predicts the next word in a sentence. the model learns patterns from text. training the " +
    "model takes time and compute. we measured the accuracy of the model on the test set. the transformer uses attention " +
    "to relate every word to every other word. language models are trained on large datasets of text from the internet. " +
    "tokenization splits text into tokens. tokens are pieces of words. common words become single tokens, and rare words " +
    "are split into smaller pieces. the learning rate controls how big each training step is. the customer wanted a " +
    "faster and cheaper product. the manager planned the roadmap and the release. learning and training and testing " +
    "are part of the process. we are building, measuring, and learning. the users are happier when the product is faster.";

  function pretokenize(text) { return text.match(/ ?[a-z]+| ?[0-9]+| ?[^a-z0-9\s]+|\s+(?!\S)|\s+/gi) || []; }
  var MERGES = null;
  function trainBPE(maxMerges) {
    var freq = {};
    pretokenize(CORPUS).forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
    var words = Object.keys(freq).map(function (w) { return { syms: w.split(""), n: freq[w] }; });
    var merges = [];
    for (var m = 0; m < maxMerges; m++) {
      var counts = {};
      words.forEach(function (w) {
        for (var i = 0; i < w.syms.length - 1; i++) {
          var k = w.syms[i] + "\u0001" + w.syms[i + 1];
          counts[k] = (counts[k] || 0) + w.n;
        }
      });
      var best = null, bestN = 1;
      Object.keys(counts).sort().forEach(function (k) { if (counts[k] > bestN) { best = k; bestN = counts[k]; } });
      if (!best) break;
      var pair = best.split("\u0001");
      merges.push(pair);
      words.forEach(function (w) { w.syms = applyMerge(w.syms, pair); });
    }
    return merges;
  }
  function applyMerge(syms, pair) {
    var out = [];
    for (var i = 0; i < syms.length; i++) {
      if (i < syms.length - 1 && syms[i] === pair[0] && syms[i + 1] === pair[1]) { out.push(pair[0] + pair[1]); i++; }
      else out.push(syms[i]);
    }
    return out;
  }
  function encodeBPE(text, k) {
    var toks = [];
    pretokenize(text.toLowerCase()).forEach(function (w) {
      var syms = w.split("");
      for (var i = 0; i < k && i < MERGES.length; i++) {
        if (syms.length < 2) break;
        syms = applyMerge(syms, MERGES[i]);
      }
      Array.prototype.push.apply(toks, syms);
    });
    return toks;
  }
  function tokenId(tok) {
    if (tok.length === 1) return tok.charCodeAt(0);
    for (var i = 0; i < MERGES.length; i++) if (MERGES[i][0] + MERGES[i][1] === tok) return 256 + i;
    return 0;
  }

  P.widget("tokenizer", function (root) {
    if (!MERGES) MERGES = trainBPE(400);
    var mode = "bpe", merges = 150;
    var input = h("textarea", { id: "tok-input", rows: "2", "aria-label": "Text to tokenize" });
    input.value = "The product team is learning tokenization faster than expected!";
    var out = h("div", { class: "tok-out", "aria-live": "polite" });
    var readout = P.readout([
      { key: "tokens", label: "Tokens" },
      { key: "chars", label: "Characters" },
      { key: "ratio", label: "Characters per token" },
      { key: "vocab", label: "Vocabulary size" }
    ]);
    var mergeSlider = P.slider({ id: "tok-merges", label: "Merges learned", min: 0, max: MERGES.length, step: 1, value: merges,
      onInput: function (v) { merges = v; paint(); } });
    var segEl = P.seg([
      { value: "char", label: "Characters" },
      { value: "bpe", label: "Sub-words (BPE)" },
      { value: "word", label: "Whole words" }
    ], mode, function (v) { mode = v; mergeSlider.hidden = v !== "bpe"; paint(); }, "Tokenizer type");
    input.addEventListener("input", paint);
    root.appendChild(input);
    root.appendChild(h("div", { class: "controls" }, h("div", { class: "control" }, h("span", { class: "lbl", text: "Tokenizer" }), segEl), mergeSlider));
    root.appendChild(out);
    root.appendChild(readout);
    root.appendChild(h("p", { class: "fig-note", text: "This BPE tokenizer is real but tiny: it learns merges from a 200-word paragraph about product work, right in your browser. GPT-2 learned 50,000 merges from 40 GB of web text. The ␣ symbol marks a leading space, which is part of the token." }));
    function paint() {
      var text = input.value;
      var toks, vocab;
      if (mode === "char") { toks = text.split(""); vocab = "≈ 100"; }
      else if (mode === "word") { toks = text.split(/(\s+)/).filter(function (t) { return t && !/^\s+$/.test(t); }); vocab = "hundreds of thousands+"; }
      else { toks = encodeBPE(text, merges); vocab = String(new Set(CORPUS.split("")).size + merges); }
      P.clear(out);
      var colors = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)"];
      toks.forEach(function (t, i) {
        var label = t.replace(/ /g, "␣");
        out.appendChild(h("span", { class: "tok", style: { background: P.mix(colors[i % colors.length], 22, "var(--surface)") } },
          label, mode === "bpe" ? h("small", { text: String(tokenId(t)) }) : null));
      });
      readout.update("tokens", String(toks.length));
      readout.update("chars", String(text.length));
      readout.update("ratio", toks.length ? (text.length / toks.length).toFixed(2) : "0");
      readout.update("vocab", vocab, mode === "word" ? "every word form needs its own entry" : mode === "char" ? "but sequences get very long" : "base characters + merges");
    }
    paint();
  });

  /* ---------------- Gradient descent ---------------- */
  P.widget("gradient", function (root) {
    // Fit y = w·x to data generated with w = 2. Loss is mean squared error.
    var xs = [0.2, 0.35, 0.5, 0.6, 0.75, 0.9, 1.0];
    var noise = [0.08, -0.06, 0.05, -0.09, 0.04, 0.07, -0.05];
    var ys = xs.map(function (x, i) { return 2 * x + noise[i]; });
    function loss(w) { return xs.reduce(function (a, x, i) { return a + Math.pow(w * x - ys[i], 2); }, 0) / xs.length; }
    function grad(w) { return xs.reduce(function (a, x, i) { return a + 2 * x * (w * x - ys[i]); }, 0) / xs.length; }
    var w = -1, lr = 0.5, stepCount = 0, history = [w], timer = null;
    var readout = P.readout([
      { key: "w", label: "Parameter w" },
      { key: "loss", label: "Loss (error)" },
      { key: "steps", label: "Steps taken" }
    ]);
    var lrSlider = P.slider({ id: "gd-lr", label: "Learning rate", min: 0.05, max: 2.6, step: 0.05, value: lr,
      format: function (v) { return v.toFixed(2); }, onInput: function (v) { lr = v; } });
    var stepBtn = h("button", { type: "button", class: "btn", text: "Take one step" });
    var runBtn = h("button", { type: "button", class: "btn primary", text: "Train 25 steps" });
    var resetBtn = h("button", { type: "button", class: "btn", text: "Reset" });
    var status = h("p", { class: "small", "aria-live": "polite" });
    var charts = h("div", { class: "two-col" });
    var left = h("div", { class: "chart" }), right = h("div", { class: "chart" });
    charts.appendChild(left); charts.appendChild(right);
    function step() {
      w = w - lr * grad(w);
      if (!isFinite(w) || Math.abs(w) > 1e6) w = w > 0 ? 1e6 : -1e6;
      stepCount++;
      history.push(w);
      if (history.length > 60) history.shift();
      paint();
    }
    stepBtn.addEventListener("click", step);
    runBtn.addEventListener("click", function () {
      if (timer) return;
      var n = 0;
      timer = setInterval(function () { step(); n++; if (n >= 25) { clearInterval(timer); timer = null; } }, 90);
    });
    resetBtn.addEventListener("click", function () {
      if (timer) { clearInterval(timer); timer = null; }
      w = -1; stepCount = 0; history = [w]; paint();
    });
    root.appendChild(h("div", { class: "controls" }, lrSlider, h("div", { class: "row" }, stepBtn, runBtn, resetBtn)));
    root.appendChild(charts);
    root.appendChild(readout);
    root.appendChild(status);
    var LW = 300, RW = 300;
    P.responsive(left, function (wd) { LW = wd; paint(); });
    P.responsive(right, function (wd) { RW = wd; paint(); });

    function paint() {
      var L = loss(w);
      readout.update("w", Math.abs(w) >= 1e5 ? "exploded" : w.toFixed(3), "target ≈ 2.0");
      readout.update("loss", L > 1e4 ? "∞" : L.toFixed(4));
      readout.update("steps", String(stepCount));
      if (Math.abs(w) >= 1e5 || L > 50) status.textContent = "Training diverged: each step overshoots by more than it corrects. In real runs this shows up as the loss turning into NaN. Lower the learning rate and reset.";
      else if (lr > 1.15 && stepCount > 2) status.textContent = "The parameter is bouncing back and forth across the minimum. It may still settle, but slowly.";
      else if (Math.abs(w - 2) < 0.03) status.textContent = "Converged: the line fits the data and the loss stopped falling.";
      else if (lr < 0.2 && stepCount > 10) status.textContent = "Very small steps: safe, but training is slow and costs more compute.";
      else status.textContent = "Each step moves w downhill on the loss curve, by an amount set by the learning rate.";
      drawData(); drawLoss();
    }
    function drawData() {
      var W = LW, H = 220, m = { l: 34, r: 12, t: 22, b: 30 };
      var x = P.scaleLin(0, 1.1, m.l, W - m.r), y = P.scaleLin(-0.5, 2.6, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Data points and the fitted line" });
      [0, 1, 2].forEach(function (v) {
        svg.appendChild(s("line", { class: "chart-grid", x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
        svg.appendChild(s("text", { class: "chart-muted", x: m.l - 8, y: y(v) + 4, "text-anchor": "end", text: String(v) }));
      });
      svg.appendChild(s("text", { class: "chart-text-strong", x: m.l, y: 13, text: "Model: y = w × x" }));
      var wc = Math.max(-5, Math.min(5, w));
      svg.appendChild(s("line", { x1: x(0), y1: y(0), x2: x(1.1), y2: y(Math.max(-0.5, Math.min(2.6, wc * 1.1))), stroke: "var(--c2)", "stroke-width": 2, "stroke-linecap": "round" }));
      xs.forEach(function (xv, i) {
        svg.appendChild(s("circle", { cx: x(xv), cy: y(ys[i]), r: 4.5, fill: "var(--c1)", stroke: "var(--chart-surface)", "stroke-width": 2 }));
      });
      svg.appendChild(s("text", { class: "chart-muted", x: (m.l + W - m.r) / 2, y: H - 6, "text-anchor": "middle", text: "input x" }));
      P.clear(left).appendChild(svg);
    }
    function drawLoss() {
      var W = RW, H = 220, m = { l: 40, r: 12, t: 22, b: 30 };
      var x = P.scaleLin(-1.5, 5.5, m.l, W - m.r), y = P.scaleLin(0, 4, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Loss curve with current parameter" });
      [0, 1, 2, 3, 4].forEach(function (v) {
        svg.appendChild(s("line", { class: "chart-grid", x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
        svg.appendChild(s("text", { class: "chart-muted", x: m.l - 8, y: y(v) + 4, "text-anchor": "end", text: String(v) }));
      });
      var d = "";
      for (var i = 0; i <= 120; i++) {
        var wv = -1.5 + (7 * i) / 120;
        d += (i ? "L" : "M") + x(wv).toFixed(1) + "," + y(Math.min(4.2, loss(wv))).toFixed(1);
      }
      svg.appendChild(s("path", { d: d, fill: "none", stroke: "var(--ink-3)", "stroke-width": 2 }));
      svg.appendChild(s("text", { class: "chart-text-strong", x: m.l, y: 13, text: "Loss for every value of w" }));
      // history trail
      var pts = history.filter(function (v) { return v > -1.5 && v < 5.5; });
      for (var j = 1; j < pts.length; j++) {
        svg.appendChild(s("line", { x1: x(pts[j - 1]), y1: y(Math.min(4.2, loss(pts[j - 1]))), x2: x(pts[j]), y2: y(Math.min(4.2, loss(pts[j]))), stroke: "var(--c2)", "stroke-width": 1, opacity: 0.6 }));
      }
      if (w > -1.5 && w < 5.5 && loss(w) < 4.2) {
        svg.appendChild(s("circle", { cx: x(w), cy: y(loss(w)), r: 7, fill: "var(--c2)", stroke: "var(--chart-surface)", "stroke-width": 2 }));
      } else {
        svg.appendChild(s("text", { class: "chart-text", x: (m.l + W - m.r) / 2, y: m.t + 16, "text-anchor": "middle", text: "w left the chart: training diverged" }));
      }
      svg.appendChild(s("text", { class: "chart-muted", x: (m.l + W - m.r) / 2, y: H - 6, "text-anchor": "middle", text: "parameter w" }));
      P.clear(right).appendChild(svg);
    }
    paint();
  });

  /* ---------------- Embedding map (teaching model) ---------------- */
  var EMB = [
    { w: "king", x: 0.78, y: 0.80, g: "royalty" }, { w: "queen", x: 0.88, y: 0.62, g: "royalty" },
    { w: "prince", x: 0.70, y: 0.70, g: "royalty" }, { w: "princess", x: 0.80, y: 0.53, g: "royalty" },
    { w: "man", x: 0.58, y: 0.62, g: "people" }, { w: "woman", x: 0.68, y: 0.44, g: "people" },
    { w: "boy", x: 0.50, y: 0.55, g: "people" }, { w: "girl", x: 0.60, y: 0.38, g: "people" },
    { w: "dog", x: 0.16, y: 0.80, g: "animals" }, { w: "puppy", x: 0.10, y: 0.70, g: "animals" },
    { w: "cat", x: 0.24, y: 0.86, g: "animals" }, { w: "kitten", x: 0.19, y: 0.76, g: "animals" },
    { w: "pizza", x: 0.14, y: 0.20, g: "food" }, { w: "pasta", x: 0.22, y: 0.14, g: "food" },
    { w: "burger", x: 0.08, y: 0.28, g: "food" }, { w: "salad", x: 0.26, y: 0.26, g: "food" },
    { w: "roadmap", x: 0.48, y: 0.12, g: "work" }, { w: "sprint", x: 0.40, y: 0.18, g: "work" },
    { w: "backlog", x: 0.54, y: 0.20, g: "work" }, { w: "release", x: 0.46, y: 0.26, g: "work" }
  ];
  var GROUP_COLORS = { royalty: "var(--c1)", people: "var(--c2)", animals: "var(--c3)", food: "var(--c4)", work: "var(--c5)" };

  P.widget("embeddings", function (root) {
    var selected = "king", showAnalogy = false;
    var chart = h("div", { class: "chart" });
    var info = h("p", { class: "small", "aria-live": "polite" });
    var analogyBtn = h("button", { type: "button", class: "btn", text: "Show king − man + woman" });
    analogyBtn.addEventListener("click", function () {
      showAnalogy = !showAnalogy;
      analogyBtn.textContent = showAnalogy ? "Hide the analogy" : "Show king − man + woman";
      paint();
    });
    root.appendChild(h("div", { class: "row" }, analogyBtn, h("span", { class: "kbd-hint", text: "Click any word to see its nearest neighbours" })));
    root.appendChild(chart);
    root.appendChild(P.legend(Object.keys(GROUP_COLORS).map(function (g) { return { label: g, color: GROUP_COLORS[g] }; })));
    root.appendChild(info);
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function find(w) { for (var i = 0; i < EMB.length; i++) if (EMB[i].w === w) return EMB[i]; }
    function paint() {
      var H = Math.max(260, Math.min(380, W * 0.6)), m = 24;
      var x = P.scaleLin(0, 1, m, W - m), y = P.scaleLin(0, 1, H - m, m);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Two-dimensional word map" });
      svg.appendChild(s("rect", { x: 0, y: 0, width: W, height: H, fill: "var(--chart-surface)", rx: 6 }));
      var sel = find(selected);
      var near = EMB.filter(function (e) { return e !== sel; }).map(function (e) {
        return { e: e, d: Math.hypot(e.x - sel.x, e.y - sel.y) };
      }).sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
      near.forEach(function (n) {
        svg.appendChild(s("line", { x1: x(sel.x), y1: y(sel.y), x2: x(n.e.x), y2: y(n.e.y), stroke: "var(--ink-3)", "stroke-width": 1, "stroke-dasharray": "3 3" }));
      });
      if (showAnalogy) {
        var k = find("king"), mn = find("man"), wo = find("woman"), q = find("queen");
        var rx = k.x - mn.x + wo.x, ry = k.y - mn.y + wo.y;
        svg.appendChild(s("line", { x1: x(mn.x), y1: y(mn.y), x2: x(wo.x), y2: y(wo.y), stroke: "var(--c2)", "stroke-width": 2 }));
        svg.appendChild(s("line", { x1: x(k.x), y1: y(k.y), x2: x(rx), y2: y(ry), stroke: "var(--c2)", "stroke-width": 2 }));
        svg.appendChild(s("circle", { cx: x(rx), cy: y(ry), r: 10, fill: "none", stroke: "var(--c2)", "stroke-width": 2 }));
        svg.appendChild(s("text", { class: "chart-text", x: x(rx) + 14, y: y(ry) + 18, text: "result lands next to queen" }));
        void q;
      }
      EMB.forEach(function (e) {
        var g = s("g", { style: "cursor:pointer", role: "button", "aria-label": e.w });
        var isSel = e.w === selected;
        g.appendChild(s("circle", { cx: x(e.x), cy: y(e.y), r: 14, fill: "transparent" }));
        g.appendChild(s("circle", { cx: x(e.x), cy: y(e.y), r: isSel ? 7 : 5, fill: GROUP_COLORS[e.g], stroke: "var(--chart-surface)", "stroke-width": 2 }));
        g.appendChild(s("text", { class: isSel ? "chart-text-strong" : "chart-text", x: x(e.x) + 9, y: y(e.y) + 4, text: e.w }));
        g.setAttribute("tabindex", "0");
        var pick = function () { selected = e.w; paint(); };
        g.addEventListener("click", pick);
        g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(); } });
        svg.appendChild(g);
      });
      P.clear(chart).appendChild(svg);
      info.textContent = "Nearest to \"" + selected + "\": " + near.map(function (n) { return n.e.w; }).join(", ") +
        ". Words used in similar contexts end up close together, so the model can treat \"puppy\" a bit like \"dog\" even if it rarely saw \"puppy\".";
    }
    paint();
  });

  /* ---------------- Overfitting ---------------- */
  P.widget("overfit", function (root) {
    var step = 40;
    function train(t) { return 2.6 * Math.exp(-t / 22) + 0.25 * Math.exp(-t / 120) + 0.05; }
    function val(t) { return 2.6 * Math.exp(-t / 22) + 0.42 + 0.0000045 * Math.pow(Math.max(0, t - 45), 2.4) * 0.6; }
    var chart = h("div", { class: "chart" });
    var readout = P.readout([{ key: "tr", label: "Training loss" }, { key: "va", label: "Validation loss" }, { key: "st", label: "Verdict" }]);
    var slider = P.slider({ id: "of-step", label: "Training steps (thousands)", min: 1, max: 120, step: 1, value: step, onInput: function (v) { step = v; paint(); } });
    root.appendChild(h("div", { class: "controls" }, slider));
    root.appendChild(chart);
    root.appendChild(P.legend([{ label: "Training loss (data the model learns from)", color: "var(--c1)", line: true }, { label: "Validation loss (held-out data)", color: "var(--c2)", line: true }]));
    root.appendChild(readout);
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function paint() {
      var H = 230, m = { l: 36, r: 16, t: 14, b: 30 };
      var x = P.scaleLin(0, 120, m.l, W - m.r), y = P.scaleLin(0, 3, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Training versus validation loss" });
      [0, 1, 2, 3].forEach(function (v) {
        svg.appendChild(s("line", { class: "chart-grid", x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
        svg.appendChild(s("text", { class: "chart-muted", x: m.l - 8, y: y(v) + 4, "text-anchor": "end", text: String(v) }));
      });
      // best validation point
      var best = 0, bestV = 9;
      for (var t = 0; t <= 120; t++) if (val(t) < bestV) { bestV = val(t); best = t; }
      svg.appendChild(s("rect", { x: x(best), y: m.t, width: x(120) - x(best), height: H - m.b - m.t, fill: "var(--bad-soft)" }));
      svg.appendChild(s("text", { class: "chart-muted", x: x(best) + 6, y: m.t + 14, text: "overfitting zone" }));
      [[train, "var(--c1)"], [val, "var(--c2)"]].forEach(function (pair) {
        var d = "";
        for (var i = 0; i <= 120; i++) d += (i ? "L" : "M") + x(i).toFixed(1) + "," + y(Math.min(3, pair[0](i))).toFixed(1);
        svg.appendChild(s("path", { d: d, fill: "none", stroke: pair[1], "stroke-width": 2, "stroke-linejoin": "round" }));
      });
      svg.appendChild(s("line", { x1: x(step), x2: x(step), y1: m.t, y2: H - m.b, stroke: "var(--ink-2)", "stroke-width": 1 }));
      svg.appendChild(s("circle", { cx: x(step), cy: y(train(step)), r: 5, fill: "var(--c1)", stroke: "var(--chart-surface)", "stroke-width": 2 }));
      svg.appendChild(s("circle", { cx: x(step), cy: y(Math.min(3, val(step))), r: 5, fill: "var(--c2)", stroke: "var(--chart-surface)", "stroke-width": 2 }));
      svg.appendChild(s("text", { class: "chart-muted", x: (m.l + W - m.r) / 2, y: H - 6, "text-anchor": "middle", text: "training steps (thousands)" }));
      P.clear(chart).appendChild(svg);
      readout.update("tr", train(step).toFixed(2));
      readout.update("va", val(step).toFixed(2));
      readout.update("st", step < best - 8 ? "Still learning" : step <= best + 8 ? "Sweet spot" : "Overfitting", step <= best + 8 && step >= best - 8 ? "stop here (early stopping)" : step > best ? "memorizing, not generalizing" : "keep training");
    }
    paint();
  });
})();
