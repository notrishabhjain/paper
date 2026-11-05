/* Widget for Station 05 (Chinchilla): compute-optimal planner with the paper's fitted loss curve. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  // Parametric fit from Hoffmann et al. 2022 (Approach 3): L(N, D) = E + A / N^alpha + B / D^beta
  var E = 1.69, A = 406.4, B = 410.7, AL = 0.34, BE = 0.28;
  function loss(N, D) { return E + A / Math.pow(N, AL) + B / Math.pow(D, BE); }

  var PRESETS = [
    { name: "GPT-3", N: 175e9, D: 300e9 },
    { name: "Gopher", N: 280e9, D: 300e9 },
    { name: "Chinchilla", N: 70e9, D: 1.4e12 },
    { name: "LLaMA-7B", N: 6.7e9, D: 1.0e12 }
  ];

  P.widget("chinchilla", function (root) {
    var logC = Math.log10(6 * 70e9 * 1.4e12), logN = Math.log10(70e9);
    var chart = h("div", { class: "chart" });
    var readout = P.readout([
      { key: "rule", label: "20-tokens rule says" },
      { key: "you", label: "Your model" },
      { key: "ratio", label: "Tokens per parameter" },
      { key: "loss", label: "Predicted loss" },
      { key: "gpu", label: "A100 GPU-hours" }
    ]);
    var sC = P.slider({ id: "ch-c", label: "Compute budget (FLOPs)", min: 19, max: 25.5, step: 0.05, value: logC,
      format: function (v) { return P.fmt.sci(Math.pow(10, v)); }, onInput: function (v) { logC = v; clampN(); paint(); } });
    var sN = P.slider({ id: "ch-n", label: "Model size (parameters)", min: 7, max: 12.5, step: 0.02, value: logN,
      format: function (v) { return P.fmt.compact(Math.pow(10, v), 1); }, onInput: function (v) { logN = v; paint(); } });
    var presets = h("div", { class: "row" }, h("span", { class: "small muted", text: "Load a real model:" }));
    PRESETS.forEach(function (p) {
      var b = h("button", { type: "button", class: "btn small", text: p.name });
      b.addEventListener("click", function () {
        logC = Math.log10(6 * p.N * p.D); logN = Math.log10(p.N);
        sC.set(logC); sN.set(logN); paint();
      });
      presets.appendChild(b);
    });
    var best = h("button", { type: "button", class: "btn small primary", text: "Snap to 20 tokens per parameter" });
    best.addEventListener("click", function () { logN = Math.log10(Math.sqrt(Math.pow(10, logC) / 120)); sN.set(logN); paint(); });
    presets.appendChild(best);
    var verdict = h("p", { class: "small", "aria-live": "polite" });
    root.appendChild(h("div", { class: "controls" }, sC, sN));
    root.appendChild(presets);
    root.appendChild(chart);
    root.appendChild(P.legend([
      { label: "Predicted loss at this budget (paper's fitted formula)", color: "var(--c1)", line: true },
      { label: "Your model", color: "var(--c2)" },
      { label: "20-tokens-per-parameter point", color: "var(--c3)" },
      { label: "Lowest point of the fitted curve", color: "var(--ink-3)" }
    ]));
    root.appendChild(readout);
    root.appendChild(verdict);
    root.appendChild(h("p", { class: "fig-note", html: "Curve uses the paper's fitted law L = 1.69 + 406.4/N<sup>0.34</sup> + 410.7/D<sup>0.28</sup>, with D = C ÷ (6N). The paper's three methods disagree somewhat on the exact optimum; this formula favors slightly smaller models than the 20:1 rule of thumb. A 2024 replication found this fit was off and its corrected version agrees with ~20:1. GPU-hours assume an A100 at 312 TFLOP/s and 40% utilization." }));

    function clampN() {
      var C = Math.pow(10, logC);
      var Dmin = 1e8;
      var maxN = Math.log10(C / (6 * Dmin));
      if (logN > maxN) { logN = maxN; sN.set(logN); }
    }
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });

    function paint() {
      var C = Math.pow(10, logC), N = Math.pow(10, logN), D = C / (6 * N);
      var Nr = Math.sqrt(C / 120), Dr = 20 * Nr;
      // numeric optimum of the fitted curve
      var bestN = N, bestL = Infinity;
      for (var e = 6; e <= 13; e += 0.01) {
        var n = Math.pow(10, e), d = C / (6 * n);
        if (d < 1e6) break;
        var l = loss(n, d);
        if (l < bestL) { bestL = l; bestN = n; }
      }
      var L = loss(N, D), Lr = loss(Nr, Dr);
      readout.update("rule", P.fmt.compact(Nr, 1) + " params", P.fmt.compact(Dr, 1) + " tokens");
      readout.update("you", P.fmt.compact(N, 1) + " params", P.fmt.compact(D, 1) + " tokens");
      readout.update("ratio", (D / N).toFixed(D / N < 10 ? 1 : 0), D / N < 10 ? "under-trained for its size" : D / N > 60 ? "over-trained: cheaper to serve" : "near compute-optimal");
      readout.update("loss", L.toFixed(3), "best on curve " + bestL.toFixed(3));
      var gpuH = C / (312e12 * 0.4 * 3600);
      readout.update("gpu", P.fmt.compact(gpuH, 1), "≈ " + P.fmt.money(gpuH * 2) + " at $2/hour");
      var pctWorse = ((L - bestL) / (bestL - E)) * 100;
      verdict.textContent = D / N < 10
        ? "Too big for this budget: the model never sees enough data to use its size. This is where GPT-3 and Gopher sat. Same compute, a smaller model on more tokens, would score better."
        : D / N > 60
          ? "Smaller than compute-optimal and trained on lots of data. You give up a little loss for this budget, but the model is much cheaper to run for every user, every day. This is LLaMA's bet."
          : "Close to compute-optimal for this budget. Spending the same compute any other way would give a worse model.";
      void pctWorse; void Lr;
      draw(C, N, Nr, bestN);
    }
    function draw(C, N, Nr, bestN) {
      var H = 260, m = { l: 44, r: 16, t: 22, b: 34 };
      // Window the x-axis around the optimum so the U-shape is visible; always include the chosen model.
      var nMaxAll = C / (6 * 1e8);
      var nMin = Math.max(1e6, Math.min(Nr / 300, N / 3)), nMax = Math.min(nMaxAll, Math.max(Nr * 300, N * 3));
      if (nMax < nMin * 10) nMax = nMin * 10;
      var pts = [];
      for (var e = Math.log10(nMin); e <= Math.log10(nMax); e += 0.02) {
        var n = Math.pow(10, e);
        pts.push([n, loss(n, C / (6 * n))]);
      }
      var lo = Math.min.apply(null, pts.map(function (p) { return p[1]; }));
      var yMin = Math.floor((lo - 0.02) * 20) / 20, yMax = yMin + 0.6;
      var x = P.scaleLog(nMin, nMax, m.l, W - m.r), y = P.scaleLin(yMin, yMax, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Loss versus model size for a fixed compute budget" });
      var step = 0.1;
      for (var t = Math.ceil(yMin / step) * step; t <= yMax + 1e-9; t += step) {
        svg.appendChild(s("line", { class: "chart-grid", x1: m.l, x2: W - m.r, y1: y(t), y2: y(t) }));
        svg.appendChild(s("text", { class: "chart-muted", x: m.l - 8, y: y(t) + 4, "text-anchor": "end", text: t.toFixed(1) }));
      }
      P.niceLogTicks(nMin, nMax).forEach(function (tk) {
        svg.appendChild(s("line", { class: "chart-grid", x1: x(tk), x2: x(tk), y1: m.t, y2: H - m.b }));
        svg.appendChild(s("text", { class: "chart-muted", x: x(tk), y: H - m.b + 16, "text-anchor": "middle", text: P.fmt.compact(tk, 0) }));
      });
      svg.appendChild(s("text", { class: "chart-muted", x: (m.l + W - m.r) / 2, y: H - 4, "text-anchor": "middle", text: "model size (parameters, log scale) · each point uses the whole budget" }));
      var d = "";
      var pen = "M";
      pts.forEach(function (p) {
        if (p[1] > yMax) { pen = "M"; return; }
        d += pen + x(p[0]).toFixed(1) + "," + y(p[1]).toFixed(1);
        pen = "L";
      });
      svg.appendChild(s("path", { d: d, fill: "none", stroke: "var(--c1)", "stroke-width": 2, "stroke-linejoin": "round" }));
      function dot(n, color, r, label, below) {
        if (n < nMin || n > nMax) return;
        var l = loss(n, C / (6 * n));
        var cy = y(Math.min(l, yMax));
        svg.appendChild(s("circle", { cx: x(n), cy: cy, r: r, fill: color, stroke: "var(--chart-surface)", "stroke-width": 2 }));
        if (label) svg.appendChild(s("text", { class: "chart-text-strong", x: x(n), y: below ? cy + r + 16 : cy - r - 8, "text-anchor": "middle", text: label }));
      }
      dot(bestN, "var(--ink-3)", 4, null);
      dot(Nr, "var(--c3)", 6, "20:1", true);
      dot(N, "var(--c2)", 7, "you", false);
      // crosshair hover
      var cross = s("line", { x1: 0, x2: 0, y1: m.t, y2: H - m.b, stroke: "var(--ink-3)", "stroke-width": 1, visibility: "hidden" });
      svg.appendChild(cross);
      var hit = s("rect", { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: "transparent" });
      hit.addEventListener("pointermove", function (ev) {
        var r = svg.getBoundingClientRect();
        var px = (ev.clientX - r.left) * (W / r.width);
        var n = x.invert(px);
        cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.setAttribute("visibility", "visible");
        P.tip.show(ev, "loss " + loss(n, C / (6 * n)).toFixed(3), P.fmt.compact(n, 1) + " params · " + P.fmt.compact(C / (6 * n), 1) + " tokens");
      });
      hit.addEventListener("pointerleave", function () { cross.setAttribute("visibility", "hidden"); P.tip.hide(); });
      svg.appendChild(hit);
      P.clear(chart).appendChild(svg);
    }
    paint();
  });
})();
