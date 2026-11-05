/* Widgets for Station 07 (LoRA): low-rank update visual + calculator, adapter swapping. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  var MODELS = {
    gpt2: { name: "GPT-2 small", d: 768, layers: 12, mlp: [[768, 3072], [3072, 768]], total: 124e6 },
    llama7: { name: "LLaMA-7B", d: 4096, layers: 32, mlp: [[4096, 11008], [4096, 11008], [11008, 4096]], total: 6.7e9 },
    gpt3: { name: "GPT-3 175B", d: 12288, layers: 96, mlp: [[12288, 49152], [49152, 12288]], total: 175e9 }
  };
  var RANKS = [1, 2, 4, 8, 16, 32, 64, 128, 256];

  P.widget("lora", function (root) {
    var model = "gpt3", ri = 2, targets = "qv";
    var visual = h("div", { class: "chart" });
    var readout = P.readout([
      { key: "one", label: "One weight matrix" },
      { key: "train", label: "Trainable parameters" },
      { key: "pct", label: "Share of the model" },
      { key: "file", label: "Adapter file (16-bit)" },
      { key: "full", label: "Full fine-tuned copy" }
    ]);
    var modelSeg = P.seg(Object.keys(MODELS).map(function (k) { return { value: k, label: MODELS[k].name }; }), model, function (v) { model = v; paint(); }, "Model");
    var targetSeg = P.seg([{ value: "qv", label: "Query + value (paper)" }, { value: "attn", label: "All attention" }, { value: "all", label: "Attention + MLP" }], targets, function (v) { targets = v; paint(); }, "Where to add LoRA");
    var rSlider = P.slider({ id: "lora-r", label: "Rank r", min: 0, max: RANKS.length - 1, step: 1, value: ri, format: function (v) { return String(RANKS[v]); }, onInput: function (v) { ri = v; paint(); } });
    root.appendChild(h("div", { class: "controls" },
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Base model" }), modelSeg),
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Matrices adapted" }), targetSeg),
      rSlider));
    root.appendChild(visual);
    root.appendChild(h("p", { class: "fig-note", text: "Shapes are proportional; the thin bars are drawn 6× wider than true scale so they stay visible." }));
    root.appendChild(readout);
    var note = h("p", { class: "small", "aria-live": "polite" });
    root.appendChild(note);
    var W = 600;
    P.responsive(visual, function (wd) { W = wd; paint(); });
    function paint() {
      var m = MODELS[model], r = RANKS[ri], d = m.d;
      var mats = targets === "qv" ? [[d, d], [d, d]] : [[d, d], [d, d], [d, d], [d, d]];
      if (targets === "all") mats = mats.concat(m.mlp);
      var perLayer = mats.reduce(function (a, x) { return a + r * (x[0] + x[1]); }, 0);
      var train = perLayer * m.layers;
      readout.update("one", P.fmt.compact(d * d, 1), "frozen: " + d.toLocaleString() + " × " + d.toLocaleString());
      readout.update("train", P.fmt.compact(train, 1), "B and A in " + m.layers + " layers");
      readout.update("pct", (train / m.total * 100 < 0.01 ? (train / m.total * 100).toFixed(4) : (train / m.total * 100).toFixed(2)) + "%", "≈ 1/" + P.fmt.compact(m.total / train, 0) + " of all weights");
      readout.update("file", P.fmt.bytes(train * 2));
      readout.update("full", P.fmt.bytes(m.total * 2), "per customer or task");
      note.textContent = model === "gpt3" && targets === "qv" && r === 4
        ? "This is the paper's GPT-3 setting: about 18.9M trainable parameters and an adapter of roughly 35 MB instead of a 350 GB checkpoint."
        : "The paper found ranks as low as 1 to 4 often match full fine-tuning on the tasks it tested. Higher ranks cost more and rarely help much.";
      drawVisual(d, r);
    }
    function drawVisual(d, r) {
      var H = 190;
      var side = Math.min(150, (W - 140) * 0.42);
      var thin = Math.max(3, (r / d) * side * 6);
      thin = Math.min(thin, side * 0.5);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Frozen weight matrix plus low-rank update" });
      var x0 = 8, y0 = 20;
      svg.appendChild(s("rect", { x: x0, y: y0, width: side, height: side, rx: 4, fill: "var(--surface-2)", stroke: "var(--rule-strong)" }));
      svg.appendChild(s("text", { class: "chart-text-strong", x: x0 + side / 2, y: y0 + side / 2 - 4, "text-anchor": "middle", text: "W (frozen)" }));
      svg.appendChild(s("text", { class: "chart-muted", x: x0 + side / 2, y: y0 + side / 2 + 12, "text-anchor": "middle", text: d + " × " + d }));
      var px = x0 + side + 18;
      svg.appendChild(s("text", { class: "chart-text-strong", x: px, y: y0 + side / 2 + 6, "font-size": 20, text: "+" }));
      var bx = px + 26;
      svg.appendChild(s("rect", { x: bx, y: y0, width: thin, height: side, rx: 2, fill: "var(--c5)" }));
      svg.appendChild(s("text", { class: "chart-text-strong", x: bx + thin / 2, y: y0 + side + 16, "text-anchor": "middle", text: "B" }));
      svg.appendChild(s("text", { class: "chart-muted", x: bx + thin / 2, y: y0 + side + 30, "text-anchor": "middle", text: d + "×" + r }));
      var tx = bx + thin + 14;
      svg.appendChild(s("text", { class: "chart-text-strong", x: tx, y: y0 + side / 2 + 6, "font-size": 18, text: "×" }));
      var ax = tx + 22;
      svg.appendChild(s("rect", { x: ax, y: y0, width: side, height: thin, rx: 2, fill: "var(--c5)" }));
      svg.appendChild(s("text", { class: "chart-text-strong", x: ax + side / 2, y: y0 + thin + 16, "text-anchor": "middle", text: "A" }));
      svg.appendChild(s("text", { class: "chart-muted", x: ax + side / 2, y: y0 + thin + 30, "text-anchor": "middle", text: r + "×" + d }));
      P.clear(visual).appendChild(svg);
    }
    paint();
  });

  /* ---------------- One base model, many adapters ---------------- */
  P.widget("adapters", function (root) {
    var tenants = [
      { id: "support", name: "Support replies", tone: "Hi Sam, sorry about the double charge. I've refunded it; you'll see it in 3–5 days." },
      { id: "legal", name: "Contract review", tone: "Clause 7.2 permits termination without cause on 30 days' notice. Flag: no cap on liability." },
      { id: "marketing", name: "Release notes", tone: "New: schedule reports weekly. Set it once, and your team gets fresh numbers every Monday." }
    ];
    var cur = "support", n = 3;
    var segEl = P.seg(tenants.map(function (t) { return { value: t.id, label: t.name }; }), cur, function (v) { cur = v; paint(); }, "Adapter");
    var out = h("div", { class: "gen-out", "aria-live": "polite" });
    var nSlider = P.slider({ id: "ad-n", label: "Number of customers or tasks", min: 1, max: 200, step: 1, value: n, onInput: function (v) { n = v; paint(); } });
    var readout = P.readout([{ key: "lora", label: "One base + adapters" }, { key: "full", label: "One full copy each" }]);
    root.appendChild(h("div", { class: "control" }, h("span", { class: "lbl", text: "Active adapter on the same base model" }), segEl));
    root.appendChild(out);
    root.appendChild(h("div", { class: "controls" }, nSlider));
    root.appendChild(readout);
    root.appendChild(h("p", { class: "fig-note", text: "Storage assumes a 7B-parameter base in 16-bit (≈ 13.4 GB) and a 20 MB adapter each. Sample outputs are illustrative." }));
    function paint() {
      var t = tenants.filter(function (x) { return x.id === cur; })[0];
      out.textContent = t.tone;
      var base = 6.7e9 * 2, ad = 20e6;
      readout.update("lora", P.fmt.bytes(base + n * ad), "swap adapters in milliseconds");
      readout.update("full", P.fmt.bytes(n * base), n > 1 ? (n * base / (base + n * ad)).toFixed(0) + "× more storage" : "same for one task");
    }
    paint();
  });
})();
