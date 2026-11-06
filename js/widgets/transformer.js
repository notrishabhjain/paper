/* Widgets for Station 01: self-attention, attention math, positional encoding, architecture. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  /* ---------------- Self-attention explorer (teaching model) ---------------- */
  P.widget("attention", function (root, opts) {
    var simple = !!(opts && opts.simple);
    var base = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too"];
    var ending = "tired";
    var head = "coref";
    var causal = false;
    var query = 7; // "it"
    var VERBS = { 2: 1, 3: 1, 8: 1, 10: 1 };

    function tokens() { return base.concat([ending]); }
    function logits(i, n) {
      var row = [];
      for (var j = 0; j < n; j++) {
        var v = 0;
        if (head === "prev") v = j === i - 1 ? 4 : j === i ? 1.5 : 0;
        else if (head === "coref") {
          if (i === 7) {
            var target = ending === "tired" ? 1 : 5, other = ending === "tired" ? 5 : 1;
            v = j === target ? 4.2 : j === other ? 1.6 : j === i ? 1 : 0;
          } else v = j === i ? 2.5 : (j === 1 || j === 5) ? 0.8 : 0;
        } else if (head === "subject") {
          if (VERBS[i]) v = j === 1 ? 3.2 : j === 7 ? 2.2 : j === i ? 1 : 0;
          else v = j === i ? 2.5 : 0;
        }
        row.push(v);
      }
      return row;
    }
    function weights(i) {
      var n = tokens().length;
      var l = logits(i, n);
      if (causal) l = l.map(function (v, j) { return j > i ? -Infinity : v; });
      var finite = l.filter(isFinite);
      var m = Math.max.apply(null, finite);
      var ex = l.map(function (v) { return isFinite(v) ? Math.exp(v - m) : 0; });
      var sum = ex.reduce(function (a, b) { return a + b; }, 0);
      return ex.map(function (v) { return v / sum; });
    }

    var headSeg = P.seg([
      { value: "coref", label: "Head A · who is \"it\"?" },
      { value: "subject", label: "Head B · verb → subject" },
      { value: "prev", label: "Head C · previous word" }
    ], head, function (v) { head = v; paint(); }, "Attention head");
    var endSeg = P.seg([{ value: "tired", label: "…too tired" }, { value: "wide", label: "…too wide" }], ending,
      function (v) { ending = v; paint(); }, "Sentence ending");
    var causalBtn = h("button", { type: "button", class: "btn", "aria-pressed": "false", text: "Causal mask: off" });
    causalBtn.addEventListener("click", function () {
      causal = !causal;
      causalBtn.textContent = "Causal mask: " + (causal ? "on (GPT-style)" : "off");
      causalBtn.setAttribute("aria-pressed", String(causal));
      paint();
    });
    var words = h("div", { class: "word-row", role: "group", "aria-label": "Pick the word that is asking (the query)" });
    var explain = h("p", { class: "small", "aria-live": "polite" });
    var matrix = h("div", { class: "chart scroll-x" });

    if (simple) {
      root.appendChild(h("div", { class: "control" }, h("span", { class: "lbl", text: "Change the last word" }), endSeg));
      root.appendChild(h("p", { class: "kbd-hint", text: "The darker a word, the more attention “it” pays to it. Click any other word to see what it pays attention to." }));
    } else {
      root.appendChild(h("div", { class: "controls" },
        h("div", { class: "control" }, h("span", { class: "lbl", text: "Attention head" }), headSeg),
        h("div", { class: "control" }, h("span", { class: "lbl", text: "Last word" }), endSeg),
        h("div", { class: "control", style: { flex: "0 0 auto", minWidth: "auto" } }, h("span", { class: "lbl", text: "Mask" }), causalBtn)
      ));
      root.appendChild(h("p", { class: "kbd-hint", text: "Click a word to make it the query. Shading shows how much it attends to every other word." }));
    }
    root.appendChild(words);
    root.appendChild(explain);
    if (!simple) root.appendChild(matrix);
    root.appendChild(h("p", { class: "fig-note", text: "Teaching model: the weights are hand-set to mimic patterns researchers have found in trained models. A real model has many heads per layer and learns these weights itself." }));

    var W = 600;
    P.responsive(matrix, function (wd) { W = wd; drawMatrix(); });

    function paint() {
      var toks = tokens();
      var wts = weights(query);
      P.clear(words);
      toks.forEach(function (t, j) {
        var b = h("button", { type: "button", class: "word", "aria-pressed": String(j === query), text: t });
        var wv = wts[j];
        if (j !== query) b.style.background = P.mix("var(--c1)", wv * 100 * 1.4, "var(--surface)");
        if (causal && j > query) b.classList.add("hidden-ctx");
        b.title = "attention weight " + (wv * 100).toFixed(0) + "%";
        b.addEventListener("click", function () { query = j; paint(); });
        words.appendChild(b);
      });
      var top = wts.map(function (v, j) { return [v, j]; }).filter(function (p) { return p[1] !== query; }).sort(function (a, b) { return b[0] - a[0]; })[0];
      var msg = "\"" + toks[query] + "\" puts " + Math.round(top[0] * 100) + "% of its attention on \"" + toks[top[1]] + "\".";
      if (head === "coref" && query === 7) msg += ending === "tired" ? " Animals get tired, so \"it\" means the animal." : " Streets are wide, so \"it\" now means the street. One word changed the whole interpretation.";
      if (causal) msg += " With the causal mask on, a word can only look left, which is how GPT generates text one word at a time.";
      explain.textContent = msg;
      drawMatrix();
    }
    function drawMatrix() {
      if (simple) return;
      var toks = tokens(), n = toks.length;
      var labelW = 62, cell = Math.max(18, Math.min(34, Math.floor((W - labelW - 8) / n)));
      var Wd = labelW + cell * n + 8, H = 70 + cell * n;
      var svg = s("svg", { viewBox: "0 0 " + Wd + " " + H, width: Wd, height: H, style: "max-width:none;width:" + Wd + "px", role: "img", "aria-label": "Attention matrix" });
      svg.appendChild(s("text", { class: "chart-muted", x: 0, y: 12, text: "rows ask (query) → columns answer (key)" }));
      toks.forEach(function (t, j) {
        var tx = labelW + j * cell + cell / 2;
        svg.appendChild(s("text", { class: "chart-muted", x: tx, y: 62, transform: "rotate(-50 " + tx + " 62)", text: t }));
      });
      for (var i = 0; i < n; i++) {
        var wts = weights(i);
        svg.appendChild(s("text", { class: i === query ? "chart-text-strong" : "chart-muted", x: labelW - 6, y: 70 + i * cell + cell / 2 + 4, "text-anchor": "end", text: toks[i] }));
        for (var j = 0; j < n; j++) {
          (function (i, j, v) {
            var r = s("rect", { x: labelW + j * cell + 1, y: 70 + i * cell + 1, width: cell - 2, height: cell - 2, rx: 2,
              style: "fill:" + (causal && j > i ? "var(--surface-2)" : P.mix("var(--c1)", v * 100 * 1.2)) + (i === query ? ";stroke:var(--ink);stroke-width:1" : "") });
            P.bindTip(r, (v * 100).toFixed(1) + "%", "\"" + toks[i] + "\" → \"" + toks[j] + "\"");
            r.addEventListener("click", function () { query = i; paint(); });
            svg.appendChild(r);
          })(i, j, wts[j]);
        }
      }
      P.clear(matrix).appendChild(svg);
    }
    paint();
  });

  /* ---------------- Attention math: a soft lookup by similarity ---------------- */
  P.widget("attnmath", function (root) {
    var keys = [
      { label: "animal", v: [1.6, 0.6], color: "var(--c1)" },
      { label: "street", v: [-1.4, 0.9], color: "var(--c2)" },
      { label: "tired", v: [0.9, 1.5], color: "var(--c3)" },
      { label: "because", v: [-0.4, -1.4], color: "var(--c7)" }
    ];
    var angle = 25, length = 1.6;
    var chart = h("div", { class: "chart" });
    var table = h("div", { class: "tbl-wrap" });
    var aSlider = P.slider({ id: "am-angle", label: "Query direction", min: 0, max: 359, step: 1, value: angle, format: function (v) { return v + "°"; }, onInput: function (v) { angle = v; paint(); } });
    var lSlider = P.slider({ id: "am-len", label: "Query strength", min: 0.2, max: 4, step: 0.1, value: length, format: function (v) { return v.toFixed(1); }, onInput: function (v) { length = v; paint(); } });
    root.appendChild(h("div", { class: "controls" }, aSlider, lSlider));
    var grid = h("div", { class: "two-col" }, chart, table);
    root.appendChild(grid);
    root.appendChild(h("p", { class: "fig-note", text: "Real math on toy 2-D vectors. Real models use 64 to 128 numbers per head, but the steps are identical. Here each word's value vector equals its key vector to keep the picture simple." }));
    var W = 320;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function paint() {
      var rad = (angle * Math.PI) / 180;
      var q = [Math.cos(rad) * length, Math.sin(rad) * length];
      var dk = 2;
      var scores = keys.map(function (k) { return (q[0] * k.v[0] + q[1] * k.v[1]) / Math.sqrt(dk); });
      var w = P.softmax(scores);
      var out = [0, 0];
      keys.forEach(function (k, i) { out[0] += w[i] * k.v[0]; out[1] += w[i] * k.v[1]; });
      // draw
      var S = Math.min(W, 360), H = S, c = S / 2, sc = S / 9;
      var svg = s("svg", { viewBox: "0 0 " + S + " " + H, role: "img", "aria-label": "Query, keys and output vectors", style: "max-width:" + S + "px" });
      svg.appendChild(s("defs", null,
        s("marker", { id: "am-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" },
          s("path", { d: "M0,0 L10,5 L0,10 z", fill: "context-stroke" }))));
      svg.appendChild(s("rect", { x: 0, y: 0, width: S, height: H, fill: "var(--chart-surface)", rx: 6 }));
      svg.appendChild(s("line", { class: "chart-grid", x1: 0, x2: S, y1: c, y2: c }));
      svg.appendChild(s("line", { class: "chart-grid", x1: c, x2: c, y1: 0, y2: H }));
      function arrow(v, color, width, label, dash) {
        var x2 = c + v[0] * sc, y2 = c - v[1] * sc;
        svg.appendChild(s("line", { x1: c, y1: c, x2: x2, y2: y2, stroke: color, "stroke-width": width, "marker-end": "url(#am-arrow)", "stroke-dasharray": dash || null }));
        if (label) svg.appendChild(s("text", { class: "chart-text-strong", x: x2 + (v[0] >= 0 ? 6 : -6), y: y2 + (v[1] >= 0 ? -6 : 14), "text-anchor": v[0] >= 0 ? "start" : "end", text: label }));
      }
      keys.forEach(function (k, i) { arrow(k.v, k.color, 1.5 + w[i] * 4, k.label); });
      arrow(q, "var(--ink)", 2.5, "query", "4 3");
      arrow(out, "var(--c8)", 3, "output");
      P.clear(chart).appendChild(svg);
      P.clear(table).appendChild(h("table", { class: "tbl" },
        h("thead", null, h("tr", null, h("th", { text: "Key" }), h("th", { text: "q·k / √d" }), h("th", { text: "Weight" }))),
        h("tbody", null, keys.map(function (k, i) {
          return h("tr", null,
            h("td", null, h("span", { style: { display: "inline-block", width: "0.7rem", height: "0.7rem", borderRadius: "2px", background: k.color, marginRight: "0.4rem" } }), k.label),
            h("td", { class: "tnum", text: scores[i].toFixed(2) }),
            h("td", { class: "tnum" }, h("div", { style: { display: "grid", gap: "0.2rem" } },
              h("span", { text: (w[i] * 100).toFixed(1) + "%" }),
              h("span", { class: "meter" }, h("i", { style: { width: w[i] * 100 + "%", background: k.color } }))))
          );
        })),
        h("tfoot", null, h("tr", null, h("td", { colspan: "3", class: "small muted", style: { fontWeight: "400" }, text: "Output = Σ weight × value = (" + out[0].toFixed(2) + ", " + out[1].toFixed(2) + "). A stronger query makes the weights sharper." })))
      ));
    }
    paint();
  });

  /* ---------------- Sinusoidal positional encoding ---------------- */
  P.widget("posenc", function (root) {
    var D = 64, N = 40, pos = 10;
    function pe(p, i) {
      var k = Math.floor(i / 2);
      var ang = p / Math.pow(10000, (2 * k) / D);
      return i % 2 === 0 ? Math.sin(ang) : Math.cos(ang);
    }
    var chart = h("div", { class: "chart scroll-x" });
    var slider = P.slider({ id: "pe-pos", label: "Highlight position", min: 0, max: N - 1, step: 1, value: pos, onInput: function (v) { pos = v; paint(); } });
    root.appendChild(h("div", { class: "controls" }, slider));
    root.appendChild(chart);
    root.appendChild(P.legend([{ label: "+1", color: "var(--c1)" }, { label: "0", color: "var(--div-mid)" }, { label: "−1", color: "var(--c8)" }]));
    root.appendChild(h("p", { class: "fig-note", text: "Real values from the paper's formula with a 64-number embedding (the paper used 512). Each row is the \"position fingerprint\" added to a word's embedding. Left columns change quickly, right columns slowly, like the hands of a clock." }));
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function paint() {
      var lw = 34, cw = Math.max(5, Math.floor((W - lw - 4) / D)), ch = 7;
      var Wd = lw + cw * D + 4, H = 22 + ch * N + 24;
      var svg = s("svg", { viewBox: "0 0 " + Wd + " " + H, width: Wd, height: H, style: "max-width:none;width:" + Wd + "px", role: "img", "aria-label": "Positional encoding heatmap" });
      svg.appendChild(s("text", { class: "chart-muted", x: lw, y: 12, text: "embedding dimension → (fast-changing on the left, slow on the right)" }));
      for (var p = 0; p < N; p++) {
        if (p % 5 === 0) svg.appendChild(s("text", { class: "chart-muted", x: lw - 6, y: 22 + p * ch + ch, "text-anchor": "end", text: String(p) }));
        for (var i = 0; i < D; i++) {
          var v = pe(p, i);
          var fill = v >= 0 ? P.mix("var(--c1)", v * 100, "var(--div-mid)") : P.mix("var(--c8)", -v * 100, "var(--div-mid)");
          var r = s("rect", { x: lw + i * cw, y: 22 + p * ch, width: cw, height: ch, style: "fill:" + fill });
          svg.appendChild(r);
        }
      }
      svg.appendChild(s("rect", { x: lw - 1, y: 22 + pos * ch - 1, width: cw * D + 2, height: ch + 2, fill: "none", stroke: "var(--ink)", "stroke-width": 1.5 }));
      svg.appendChild(s("text", { class: "chart-muted", x: 2, y: H - 6, text: "position in the sentence ↓ (rows)" }));
      // hover layer
      svg.addEventListener("pointermove", function (e) {
        var rect = svg.getBoundingClientRect();
        var px = (e.clientX - rect.left) * (Wd / rect.width), py = (e.clientY - rect.top) * (H / rect.height);
        var i = Math.floor((px - lw) / cw), p = Math.floor((py - 22) / ch);
        if (i >= 0 && i < D && p >= 0 && p < N) P.tip.show(e, pe(p, i).toFixed(3), "position " + p + ", dimension " + i);
        else P.tip.hide();
      });
      svg.addEventListener("pointerleave", P.tip.hide);
      P.clear(chart).appendChild(svg);
    }
    paint();
  });

  /* ---------------- Clickable architecture ---------------- */
  var BLOCKS = {
    embed: { name: "Input embedding", text: "Turns each token ID into a list of numbers (a vector) the model can do math on. Words with similar meanings get similar vectors." },
    pos: { name: "Positional encoding", text: "Attention has no built-in sense of order, so a position fingerprint is added to each word vector. Without it, \"dog bites man\" and \"man bites dog\" look identical." },
    mha: { name: "Multi-head self-attention", text: "Every word looks at every other word and pulls in what is relevant. Eight heads run in parallel, each free to learn a different relationship." },
    mmha: { name: "Masked self-attention", text: "Same as self-attention, but each word may only look at earlier words. This lets the decoder generate text left to right without peeking at the answer." },
    cross: { name: "Cross-attention", text: "The decoder's words attend to the encoder's output. In translation, this is how the French word being written looks back at the English sentence." },
    ffn: { name: "Feed-forward network", text: "A small two-layer network applied to each word on its own. It holds much of the model's stored knowledge, and about two thirds of its parameters." },
    norm: { name: "Add & norm", text: "A residual connection adds the block's input to its output, then layer normalization rescales the numbers. Both keep deep stacks trainable." },
    linear: { name: "Linear + softmax", text: "Converts the final vector into a score for every word in the vocabulary, then into probabilities. The next word is picked from these." }
  };
  P.widget("arch", function (root) {
    var mode = "orig", selected = "mha";
    var segEl = P.seg([
      { value: "orig", label: "Original (encoder + decoder)" },
      { value: "bert", label: "BERT (encoder only)" },
      { value: "gpt", label: "GPT (decoder only)" }
    ], mode, function (v) { mode = v; paint(); }, "Architecture variant");
    var diagram = h("div", { class: "two-col", style: { gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))" } });
    var detail = h("div", { class: "callout", "aria-live": "polite" });
    root.appendChild(segEl);
    root.appendChild(diagram);
    root.appendChild(detail);
    function block(id, extra) {
      var b = BLOCKS[id];
      var btn = h("button", { type: "button", class: "lc-step", "aria-pressed": String(selected === id), style: { "--stage": extra || "var(--rule-strong)", borderTopWidth: "3px" } },
        h("span", { class: "lc-name", text: b.name }));
      btn.addEventListener("click", function () { selected = id; paint(); });
      return btn;
    }
    function stack(title, ids, active, note) {
      var col = h("div", { style: { display: "grid", gap: "0.35rem", opacity: active ? "1" : "0.35", alignContent: "start" } });
      col.appendChild(h("div", { class: "eyebrow", text: title }));
      var inner = h("div", { style: { display: "grid", gap: "0.35rem", border: "1px dashed var(--rule-strong)", borderRadius: "8px", padding: "0.5rem", position: "relative" } });
      inner.appendChild(h("span", { class: "kbd-hint", text: note }));
      ids.slice().reverse().forEach(function (id) {
        inner.appendChild(block(id, id === "mha" || id === "mmha" || id === "cross" ? "var(--c1)" : id === "ffn" ? "var(--c3)" : null));
      });
      if (title.indexOf("Decoder") === 0 || title.indexOf("GPT") === 0) col.appendChild(block("linear", "var(--c2)"));
      col.appendChild(inner);
      col.appendChild(block("pos", "var(--c5)"));
      col.appendChild(block("embed", "var(--c5)"));
      if (!active) col.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
      return col;
    }
    function paint() {
      P.clear(diagram);
      if (mode === "gpt") {
        diagram.appendChild(stack("Encoder", ["mha", "norm", "ffn", "norm"], false, "× 6 layers"));
        diagram.appendChild(stack("Decoder (GPT keeps this, minus cross-attention)", ["mmha", "norm", "ffn", "norm"], true, "× 12 to 96 layers"));
      } else if (mode === "bert") {
        diagram.appendChild(stack("Encoder (BERT keeps this)", ["mha", "norm", "ffn", "norm"], true, "× 12 or 24 layers"));
        diagram.appendChild(stack("Decoder", ["mmha", "norm", "cross", "norm", "ffn", "norm"], false, "× 6 layers"));
      } else {
        diagram.appendChild(stack("Encoder (reads the English sentence)", ["mha", "norm", "ffn", "norm"], true, "× 6 layers"));
        diagram.appendChild(stack("Decoder (writes the German sentence)", ["mmha", "norm", "cross", "norm", "ffn", "norm"], true, "× 6 layers"));
      }
      var b = BLOCKS[selected];
      P.clear(detail);
      detail.appendChild(h("span", { class: "callout-k", text: b.name }));
      detail.appendChild(h("p", { text: b.text }));
      var modeNote = { orig: "The 2017 Transformer used both halves for translation.", bert: "BERT (Station 02) keeps only the encoder: great for understanding text, not for writing it.", gpt: "GPT-2, GPT-3, and LLaMA keep only the decoder: built to generate the next word." }[mode];
      detail.appendChild(h("p", { class: "small muted", text: modeNote }));
    }
    paint();
  });
})();
