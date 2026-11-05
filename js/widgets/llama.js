/* Widgets for Station 08 (LLaMA): architecture diff, data mix, rotary embeddings. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  var DIFF = [
    { part: "Normalization", gpt: "LayerNorm before each block (GPT-2/3 style)", llama: "RMSNorm before each block", why: "RMSNorm skips the mean-subtraction step. Slightly cheaper and equally stable. Borrowed from GPT-3's pre-norm idea with a simpler norm." },
    { part: "Activation", gpt: "GELU", llama: "SwiGLU (from PaLM)", why: "A gated activation: one branch decides how much of the other to let through. Gives better quality per unit of compute." },
    { part: "Position", gpt: "Learned absolute position embeddings", llama: "Rotary embeddings, RoPE (from GPT-Neo)", why: "Encodes position by rotating vectors, so attention depends on how far apart words are. Handles relative order naturally and extends to longer contexts more gracefully." },
    { part: "Attention", gpt: "Dense and sparse layers alternating (GPT-3)", llama: "Dense causal attention, memory-efficient implementation", why: "LLaMA used the xformers library to avoid storing attention weights and skip masked work: the same idea FlashAttention (Station 09) formalized." },
    { part: "Tokenizer", gpt: "Byte-level BPE, ≈ 50k tokens", llama: "SentencePiece BPE, 32k tokens; numbers split into digits", why: "Splitting numbers into single digits helps arithmetic. Unknown characters fall back to bytes, so nothing is ever out of vocabulary." },
    { part: "Training data", gpt: "Includes private datasets", llama: "Only publicly available data", why: "Anyone can, in principle, rebuild the dataset. This made LLaMA the base for a wave of open research." }
  ];
  P.widget("llamadiff", function (root) {
    var sel = 0;
    var list = h("div", { class: "tbl-wrap" });
    var why = h("div", { class: "callout", "aria-live": "polite" });
    root.appendChild(list);
    root.appendChild(why);
    function paint() {
      P.clear(list);
      var tbody = h("tbody");
      DIFF.forEach(function (d, i) {
        var tr = h("tr", { tabindex: "0", style: { cursor: "pointer", background: i === sel ? "var(--accent-soft)" : "" } },
          h("td", { text: d.part }), h("td", { class: "muted", text: d.gpt }), h("td", { text: d.llama }));
        var pick = function () { sel = i; paint(); };
        tr.addEventListener("click", pick);
        tr.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
        tbody.appendChild(tr);
      });
      list.appendChild(h("table", { class: "tbl" }, h("thead", null, h("tr", null, h("th", { text: "Part" }), h("th", { text: "GPT-style" }), h("th", { text: "LLaMA" }))), tbody));
      P.clear(why);
      why.appendChild(h("span", { class: "callout-k", text: "Why the change · " + DIFF[sel].part }));
      why.appendChild(h("p", { text: DIFF[sel].why }));
    }
    paint();
  });

  /* ---------------- Pre-training data mix (LLaMA paper, Table 1) ---------------- */
  var MIX = [
    { name: "CommonCrawl", pct: 67.0, epochs: 1.10, size: "3.3 TB", note: "Web pages, filtered for English and quality" },
    { name: "C4", pct: 15.0, epochs: 1.06, size: "783 GB", note: "A cleaner, differently filtered web crawl" },
    { name: "GitHub", pct: 4.5, epochs: 0.64, size: "328 GB", note: "Open-source code under permissive licenses" },
    { name: "Wikipedia", pct: 4.5, epochs: 2.45, size: "83 GB", note: "20 languages; seen more than twice" },
    { name: "Books", pct: 4.5, epochs: 2.23, size: "85 GB", note: "Project Gutenberg and Books3" },
    { name: "ArXiv", pct: 2.5, epochs: 1.06, size: "92 GB", note: "Scientific papers (LaTeX)" },
    { name: "StackExchange", pct: 2.0, epochs: 1.03, size: "78 GB", note: "Q&A sites, sorted by answer score" }
  ];
  P.widget("datamix", function (root) {
    var colors = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)", "var(--c7)"];
    var chart = h("div", { class: "chart" });
    root.appendChild(chart);
    root.appendChild(P.legend(MIX.map(function (m, i) { return { label: m.name + " " + m.pct + "%", color: colors[i] }; })));
    root.appendChild(h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
      h("thead", null, h("tr", null, h("th", { text: "Source" }), h("th", { text: "Share of training" }), h("th", { text: "Epochs" }), h("th", { text: "Disk size" }), h("th", { text: "What it is" }))),
      h("tbody", null, MIX.map(function (m) { return h("tr", null, h("td", { text: m.name }), h("td", { class: "tnum", text: m.pct.toFixed(1) + "%" }), h("td", { class: "tnum", text: m.epochs.toFixed(2) }), h("td", { class: "tnum", text: m.size }), h("td", { class: "muted", text: m.note })); }))
    )));
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function paint() {
      var H = 40;
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "LLaMA pre-training data mix" });
      var x = 0;
      MIX.forEach(function (m, i) {
        var w = (m.pct / 100) * W - (i < MIX.length - 1 ? 2 : 0);
        var r = s("rect", { x: x, y: 4, width: Math.max(1, w), height: 30, rx: i === 0 || i === MIX.length - 1 ? 4 : 0, fill: colors[i] });
        P.bindTip(r, m.pct + "%", m.name + " · " + m.epochs + " epochs");
        svg.appendChild(r);
        if (w > 90) svg.appendChild(s("text", { x: x + 8, y: 24, fill: "#ffffff", "font-size": 12, "font-weight": 600, text: m.name + " " + m.pct + "%" }));
        x += w + 2;
      });
      P.clear(chart).appendChild(svg);
    }
    paint();
  });

  /* ---------------- Rotary position embeddings (real 2-D rotation) ---------------- */
  P.widget("rope", function (root) {
    var m = 3, n = 1, theta = 20;
    var q0 = [1.6, 0.4], k0 = [1.2, 1.0];
    var chart = h("div", { class: "chart" });
    var readout = P.readout([{ key: "gap", label: "Distance m − n" }, { key: "dot", label: "Attention score q·k" }]);
    var sm = P.slider({ id: "rope-m", label: "Query position m", min: 0, max: 12, step: 1, value: m, onInput: function (v) { m = v; paint(); } });
    var sn = P.slider({ id: "rope-n", label: "Key position n", min: 0, max: 12, step: 1, value: n, onInput: function (v) { n = v; paint(); } });
    var shift = h("button", { type: "button", class: "btn", text: "Shift both by +3" });
    shift.addEventListener("click", function () {
      if (m + 3 > 12 || n + 3 > 12) { m = Math.max(0, m - 9); n = Math.max(0, n - 9); }
      else { m += 3; n += 3; }
      sm.set(m); sn.set(n); paint();
    });
    root.appendChild(h("div", { class: "controls" }, sm, sn, shift));
    root.appendChild(chart);
    root.appendChild(readout);
    root.appendChild(h("p", { class: "fig-note", text: "Real math in 2-D: each position rotates the vector by 20°. Press \"Shift both\": the vectors move, but the score stays the same because only the gap between positions matters." }));
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function rot(v, deg) { var r = deg * Math.PI / 180; return [v[0] * Math.cos(r) - v[1] * Math.sin(r), v[0] * Math.sin(r) + v[1] * Math.cos(r)]; }
    function paint() {
      var q = rot(q0, m * theta), k = rot(k0, n * theta);
      var S = Math.min(W, 320), c = S / 2, sc = S / 5.2;
      var svg = s("svg", { viewBox: "0 0 " + S + " " + S, role: "img", "aria-label": "Rotated query and key vectors", style: "max-width:" + S + "px" });
      svg.appendChild(s("defs", null, s("marker", { id: "rope-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, s("path", { d: "M0,0 L10,5 L0,10 z", fill: "context-stroke" }))));
      svg.appendChild(s("rect", { x: 0, y: 0, width: S, height: S, rx: 6, fill: "var(--chart-surface)" }));
      svg.appendChild(s("circle", { cx: c, cy: c, r: sc * 1.65, fill: "none", class: "chart-grid" }));
      svg.appendChild(s("line", { class: "chart-grid", x1: 0, x2: S, y1: c, y2: c }));
      svg.appendChild(s("line", { class: "chart-grid", x1: c, x2: c, y1: 0, y2: S }));
      [[q, "var(--c1)", "query @ " + m], [k, "var(--c2)", "key @ " + n]].forEach(function (a) {
        var x2 = c + a[0][0] * sc, y2 = c - a[0][1] * sc;
        svg.appendChild(s("line", { x1: c, y1: c, x2: x2, y2: y2, stroke: a[1], "stroke-width": 3, "marker-end": "url(#rope-arrow)" }));
        svg.appendChild(s("text", { class: "chart-text-strong", x: x2 + (a[0][0] >= 0 ? 6 : -6), y: y2 + (a[0][1] >= 0 ? -6 : 14), "text-anchor": a[0][0] >= 0 ? "start" : "end", text: a[2] }));
      });
      P.clear(chart).appendChild(svg);
      readout.update("gap", String(m - n));
      readout.update("dot", (q[0] * k[0] + q[1] * k[1]).toFixed(3), "depends only on m − n");
    }
    paint();
  });
})();
