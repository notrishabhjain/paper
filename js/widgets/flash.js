/* Widgets for Station 09 (FlashAttention): memory hierarchy, tiling animation, memory vs sequence length. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  /* ---------------- Memory hierarchy (numbers from the paper's Figure 1, A100) ---------------- */
  P.widget("memhier", function (root) {
    var tiers = [
      { name: "GPU SRAM (on-chip)", bw: "19 TB/s", size: "20 MB", w: 0.34, color: "var(--c3)", note: "Tiny and blazing fast. Where the math happens." },
      { name: "GPU HBM (main GPU memory)", bw: "1.5 TB/s", size: "40 GB", w: 0.64, color: "var(--c1)", note: "What \"80 GB GPU\" refers to. About 13× slower than SRAM." },
      { name: "CPU DRAM", bw: "12.8 GB/s", size: "> 1 TB", w: 1, color: "var(--ink-3)", note: "Huge but over 100× slower again. Avoid during training." }
    ];
    var wrap = h("div", { style: { display: "grid", gap: "0.4rem", justifyItems: "center" } });
    tiers.forEach(function (t) {
      wrap.appendChild(h("div", { style: { width: Math.round(t.w * 100) + "%", minWidth: "15rem", maxWidth: "100%", background: P.mix(t.color, 18, "var(--surface)"), borderTop: "3px solid " + t.color, borderRadius: "6px", padding: "0.55rem 0.8rem", display: "grid", gap: "0.15rem" } },
        h("div", { style: { display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" } },
          h("b", { class: "small", text: t.name }),
          h("span", { class: "small mono", text: t.bw + " · " + t.size })),
        h("span", { class: "small muted", text: t.note })));
    });
    root.appendChild(wrap);
    root.appendChild(h("p", { class: "fig-note", text: "Bandwidth and size for an A100-40GB, as shown in the FlashAttention paper's Figure 1." }));
  });

  /* ---------------- Tiling: standard vs flash ---------------- */
  P.widget("tiling", function (root) {
    var G = 8, mode = "standard", t = 0, timer = null;
    var grid = h("div", { class: "chart" });
    var readout = P.readout([
      { key: "hbm", label: "Slow-memory (HBM) traffic" },
      { key: "mem", label: "Extra memory held" },
      { key: "phase", label: "Phase" }
    ]);
    var segEl = P.seg([{ value: "standard", label: "Standard attention" }, { value: "flash", label: "FlashAttention" }], mode, function (v) { mode = v; reset(); }, "Algorithm");
    var play = h("button", { type: "button", class: "btn primary", text: "Play" });
    var stepB = h("button", { type: "button", class: "btn", text: "Step" });
    var resetB = h("button", { type: "button", class: "btn", text: "Reset" });
    play.addEventListener("click", function () {
      if (timer) { clearInterval(timer); timer = null; play.textContent = "Play"; return; }
      play.textContent = "Pause";
      timer = setInterval(function () { if (!advance()) { clearInterval(timer); timer = null; play.textContent = "Play"; } }, 140);
    });
    stepB.addEventListener("click", function () { advance(); });
    resetB.addEventListener("click", reset);
    root.appendChild(h("div", { class: "row" }, segEl, play, stepB, resetB));
    root.appendChild(grid);
    root.appendChild(P.legend([
      { label: "Being computed in fast SRAM", color: "var(--c3)" },
      { label: "Written to slow HBM", color: "var(--c1)" },
      { label: "Discarded after use", color: "var(--surface-2)" }
    ]));
    root.appendChild(readout);
    root.appendChild(h("p", { class: "fig-note", text: "Each square is a block of the N × N attention matrix. Traffic counts are in block units and simplified; the point is the pattern, not the exact count." }));
    function total() { return mode === "standard" ? G * G * 3 : G * G; }
    function advance() { if (t >= total()) return false; t++; paint(); return true; }
    function reset() { if (timer) { clearInterval(timer); timer = null; play.textContent = "Play"; } t = 0; paint(); }
    var W = 600;
    P.responsive(grid, function (wd) { W = wd; paint(); });
    function paint() {
      var n = G * G, cell = Math.min(34, Math.floor((Math.min(W, 420) - 70) / G)), off = 60;
      var S = off + cell * G + 4;
      var svg = s("svg", { viewBox: "0 0 " + S + " " + (cell * G + 30), role: "img", "aria-label": "Attention matrix blocks", style: "max-width:" + S + "px" });
      svg.appendChild(s("text", { class: "chart-muted", x: off, y: 12, text: "keys / values →" }));
      svg.appendChild(s("text", { class: "chart-muted", x: 0, y: 30 + cell * G / 2, text: "queries" }));
      var phase, hbm, mem;
      for (var i = 0; i < n; i++) {
        var r = Math.floor(i / G), c = i % G, fill = "var(--surface-2)";
        if (mode === "standard") {
          // phase 1: compute S = QK^T and write; phase 2: read S, softmax, write P; phase 3: read P, multiply V
          var p1 = t > i, p2 = t > n + i, p3 = t > 2 * n + i;
          var active = t === i + 1 || t === n + i + 1 || t === 2 * n + i + 1;
          fill = p1 ? "var(--c1)" : "var(--surface-2)";
          if (p3) fill = P.mix("var(--c1)", 55, "var(--surface)");
          if (active) fill = "var(--c3)";
          void p2;
        } else {
          var done = t > i, act = t === i + 1;
          fill = act ? "var(--c3)" : done ? "var(--surface-2)" : P.mix("var(--rule-strong)", 25, "var(--surface)");
          if (!done && !act) fill = "var(--chart-surface)";
        }
        svg.appendChild(s("rect", { x: off + c * cell + 1, y: 20 + r * cell + 1, width: cell - 2, height: cell - 2, rx: 3, fill: fill, stroke: "var(--rule)", "stroke-width": 1 }));
      }
      P.clear(grid).appendChild(svg);
      if (mode === "standard") {
        hbm = Math.min(t, n) + Math.max(0, Math.min(t - n, n)) * 2 + Math.max(0, Math.min(t - 2 * n, n));
        mem = Math.min(t, n);
        phase = t === 0 ? "ready" : t <= n ? "1 · compute scores, write all to HBM" : t <= 2 * n ? "2 · read scores, softmax, write back" : t < 3 * n ? "3 · read probabilities, multiply by V" : "done";
        readout.update("hbm", hbm + " block moves", "grows with N²");
        readout.update("mem", mem + " of " + n + " blocks", "the full N × N matrix sits in HBM");
      } else {
        hbm = Math.min(t, n) > 0 ? Math.ceil(Math.min(t, n) / G) * 2 : 0;
        phase = t === 0 ? "ready" : t < n ? "load a tile, compute, update running softmax, discard" : "done";
        readout.update("hbm", hbm + " block moves", "only Q, K, V in and the output out");
        readout.update("mem", "1 tile", "never stores the N × N matrix");
      }
      readout.update("phase", phase);
    }
    paint();
  });

  /* ---------------- Memory vs sequence length ---------------- */
  P.widget("flashmem", function (root) {
    var heads = 16, dHead = 64, batch = 1;
    var chart = h("div", { class: "chart" });
    var readout = P.readout([{ key: "len", label: "At 16k tokens · standard" }, { key: "fl", label: "At 16k tokens · flash" }]);
    var sb = P.slider({ id: "fm-batch", label: "Batch size", min: 1, max: 32, step: 1, value: batch, onInput: function (v) { batch = v; paint(); } });
    var sh = P.slider({ id: "fm-heads", label: "Attention heads", min: 8, max: 64, step: 8, value: heads, onInput: function (v) { heads = v; paint(); } });
    root.appendChild(h("div", { class: "controls" }, sb, sh));
    root.appendChild(chart);
    root.appendChild(P.legend([
      { label: "Standard: stores the N × N attention matrix", color: "var(--c8)", line: true },
      { label: "FlashAttention: stores only per-row statistics", color: "var(--c3)", line: true }
    ]));
    root.appendChild(readout);
    root.appendChild(h("p", { class: "fig-note", text: "Memory for one layer's attention matrix in 16-bit, per the formulas: standard ≈ batch × heads × N² × 2 bytes; flash ≈ batch × heads × N × 2 statistics × 4 bytes. Weights and activations are not included." }));
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function std(N) { return batch * heads * N * N * 2; }
    function fl(N) { return batch * heads * N * 2 * 4; }
    function paint() {
      var H = 250, m = { l: 56, r: 18, t: 14, b: 36 };
      var x = P.scaleLog(512, 131072, m.l, W - m.r), y = P.scaleLog(1e5, 1e13, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Attention memory versus sequence length" });
      [1e6, 1e9, 1e12].forEach(function (v) {
        svg.appendChild(s("line", { class: "chart-grid", x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
        svg.appendChild(s("text", { class: "chart-muted", x: m.l - 8, y: y(v) + 4, "text-anchor": "end", text: P.fmt.bytes(v) }));
      });
      [512, 2048, 8192, 32768, 131072].forEach(function (v) {
        svg.appendChild(s("line", { class: "chart-grid", x1: x(v), x2: x(v), y1: m.t, y2: H - m.b }));
        svg.appendChild(s("text", { class: "chart-muted", x: x(v), y: H - m.b + 16, "text-anchor": "middle", text: v >= 1024 ? (v / 1024) + "k" : String(v) }));
      });
      svg.appendChild(s("text", { class: "chart-muted", x: (m.l + W - m.r) / 2, y: H - 4, "text-anchor": "middle", text: "sequence length (tokens, log scale)" }));
      svg.appendChild(s("line", { x1: m.l, x2: W - m.r, y1: y(80e9), y2: y(80e9), stroke: "var(--ink-2)", "stroke-width": 1 }));
      svg.appendChild(s("text", { class: "chart-text", x: m.l + 6, y: y(80e9) - 6, text: "80 GB: a whole A100 / H100" }));
      [[std, "var(--c8)"], [fl, "var(--c3)"]].forEach(function (pair) {
        var d = "";
        for (var e = Math.log10(512); e <= Math.log10(131072) + 1e-9; e += 0.05) {
          var N = Math.pow(10, e), v = Math.min(1e13, Math.max(1e5, pair[0](N)));
          d += (d ? "L" : "M") + x(N).toFixed(1) + "," + y(v).toFixed(1);
        }
        svg.appendChild(s("path", { d: d, fill: "none", stroke: pair[1], "stroke-width": 2 }));
      });
      var cross = s("line", { y1: m.t, y2: H - m.b, stroke: "var(--ink-3)", visibility: "hidden" });
      svg.appendChild(cross);
      var hit = s("rect", { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: "transparent" });
      hit.addEventListener("pointermove", function (ev) {
        var r = svg.getBoundingClientRect();
        var px = (ev.clientX - r.left) * (W / r.width), N = Math.round(x.invert(px));
        cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.setAttribute("visibility", "visible");
        P.tip.show(ev, P.fmt.bytes(std(N)) + " vs " + P.fmt.bytes(fl(N)), N.toLocaleString() + " tokens · standard vs flash");
      });
      hit.addEventListener("pointerleave", function () { cross.setAttribute("visibility", "hidden"); P.tip.hide(); });
      svg.appendChild(hit);
      P.clear(chart).appendChild(svg);
      readout.update("len", P.fmt.bytes(std(16384)), std(16384) > 80e9 ? "does not fit on one GPU" : "per layer, per step");
      readout.update("fl", P.fmt.bytes(fl(16384)), (std(16384) / fl(16384)).toFixed(0) + "× less");
    }
    paint();
  });
})();
