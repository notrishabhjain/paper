/* Diagram widgets for the agents and second-brain routes.
   Most are data-driven: a unit's figure passes its own steps, layers, rings, or rows in `opts`.
   A few are small simulators (context budget, loop, gate threshold, eval checks, knowledge graph).
   Colors come from the theme tokens, so every diagram works in light and dark mode. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;
  var ORDER = [1, 2, 3, 7, 5, 6, 4, 8];
  function color(c, i) { return "var(--c" + (c || ORDER[i % ORDER.length]) + ")"; }

  /* Shared detail panel: title, plain text, everyday comparison, example, points. */
  function detailBox(it) {
    var box = h("div", { class: "dg-detail", "aria-live": "polite" });
    if (!it.noTitle) box.appendChild(h("h4", { text: it.t + (it.s && !it.hideSub ? " · " + it.s : "") }));
    if (it.d) box.appendChild(P.richEl("p", null, it.d));
    if (it.points) box.appendChild(h("ul", null, it.points.map(function (x) { return P.richEl("li", null, x); })));
    if (it.like) box.appendChild(P.richEl("p", { class: "dg-like" }, "<b>Everyday comparison:</b> " + it.like));
    if (it.ex) box.appendChild(P.richEl("p", { class: "dg-ex" }, "<b>Example:</b> " + it.ex));
    return box;
  }
  function note(root, text) { if (text) root.appendChild(P.richEl("p", { class: "fig-note" }, text)); }

  /* ---------------- Flow: steps in order, optionally looping back ---------------- */
  P.widget("flow", function (root, o) {
    var steps = o.steps || [];
    var cur = o.start || 0;
    var grid = o.arrows === false || steps.length > 6;
    var row = h("div", { class: "dg-flow" + (grid ? " is-grid" : ""), role: "group", "aria-label": o.label || "Steps", style: { "--n": steps.length } });
    var detail = h("div");
    var btns = steps.map(function (st, i) {
      var b = h("button", { type: "button", class: "dg-step", "aria-pressed": String(i === cur), style: { "--c": color(st.c, i) } },
        h("span", { class: "dg-n", text: st.n || String(i + 1) }),
        h("span", { class: "dg-t", text: st.t }),
        st.s ? h("span", { class: "dg-s", text: st.s }) : null);
      b.addEventListener("click", function () { cur = i; paint(); });
      row.appendChild(b);
      return b;
    });
    root.appendChild(row);
    if (o.cycle) root.appendChild(h("div", { class: "dg-cycle" }, h("span", { class: "dg-cycle-i", "aria-hidden": "true", text: "↺" }), h("span", { text: o.cycle })));
    root.appendChild(detail);
    function paint() {
      btns.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === cur)); });
      P.clear(detail);
      detail.appendChild(detailBox(Object.assign({ hideSub: true }, steps[cur])));
    }
    paint();
    note(root, o.note);
  });

  /* ---------------- Layers: a stack of bands, one open at a time ---------------- */
  P.widget("layers", function (root, o) {
    var items = o.items || [];
    var cur = o.start || 0;
    var stack = h("div", { class: "dg-layers" });
    if (o.top) stack.appendChild(h("div", { class: "dg-axis", text: "↑ " + o.top }));
    var rows = items.map(function (it, i) {
      var b = h("button", { type: "button", class: "dg-layer", "aria-expanded": String(i === cur), style: { "--c": color(it.c, i) } },
        h("span", { class: "dg-ln", text: it.n || String(i + 1) }),
        h("span", { class: "dg-lt" }, h("b", { text: it.t }), it.s ? h("span", { text: it.s }) : null),
        it.tag ? h("span", { class: "dg-tag", text: it.tag }) : null);
      var body = h("div", { class: "dg-layer-body", style: { "--c": color(it.c, i) } }, detailBox(Object.assign({ noTitle: true }, it)));
      b.addEventListener("click", function () { cur = i; paint(); });
      stack.appendChild(b);
      stack.appendChild(body);
      return { b: b, body: body };
    });
    if (o.bottom) stack.appendChild(h("div", { class: "dg-axis", text: "↓ " + o.bottom }));
    root.appendChild(stack);
    function paint() {
      rows.forEach(function (r, i) { r.b.setAttribute("aria-expanded", String(i === cur)); r.body.hidden = i !== cur; });
    }
    paint();
    note(root, o.note);
  });

  /* ---------------- Rings: concentric layers around a center (outermost first) ---------------- */
  P.widget("rings", function (root, o) {
    var items = o.items || [];
    var cur = o.start || 0;
    var n = items.length, C = 200, core = 46, band = (190 - core) / n;
    var svg = s("svg", { viewBox: "0 0 400 400", class: "dg-rings-svg", role: "group", "aria-label": o.label || "Rings" });
    var detail = h("div", { class: "dg-rings-detail" });
    function annulus(R, r) {
      return "M" + (C - R) + " " + C + "a" + R + " " + R + " 0 1 0 " + 2 * R + " 0a" + R + " " + R + " 0 1 0 " + -2 * R + " 0Z" +
        "M" + (C - r) + " " + C + "a" + r + " " + r + " 0 1 1 " + 2 * r + " 0a" + r + " " + r + " 0 1 1 " + -2 * r + " 0Z";
    }
    var paths = items.map(function (it, i) {
      var R = 190 - i * band, r = R - band;
      var g = s("g", { class: "dg-ring", tabindex: "0", role: "button", "aria-label": it.t });
      var path = s("path", { d: annulus(R, r), "fill-rule": "evenodd", stroke: "var(--surface)", "stroke-width": "2" });
      g.appendChild(path);
      g.appendChild(s("text", { x: C, y: C - R + band / 2 + 4, "text-anchor": "middle", class: "dg-ring-label", text: it.short || it.t }));
      function pick() { cur = i; paint(); }
      g.addEventListener("click", pick);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      svg.appendChild(g);
      return { path: path, c: color(it.c, i), g: g };
    });
    svg.appendChild(s("circle", { cx: C, cy: C, r: core, fill: "var(--ink)" }));
    svg.appendChild(s("text", { x: C, y: C + 5, "text-anchor": "middle", class: "dg-ring-core", text: o.center || "model" }));
    root.appendChild(h("div", { class: "dg-rings" }, h("div", { class: "dg-rings-pic" }, svg), detail));
    function paint() {
      paths.forEach(function (p, i) {
        p.path.setAttribute("fill", P.mix(p.c, i === cur ? 70 : 24));
        p.g.setAttribute("aria-pressed", String(i === cur));
      });
      P.clear(detail);
      var it = items[cur];
      detail.appendChild(h("span", { class: "mini-h", text: "Ring " + (cur + 1) + " of " + n + (cur === 0 ? " · outermost" : cur === n - 1 ? " · closest to the model" : "") }));
      detail.appendChild(detailBox(it));
    }
    paint();
    note(root, o.note);
  });

  /* ---------------- Compare: columns side by side, row by row ---------------- */
  P.widget("compare", function (root, o) {
    var cols = o.cols || [];
    var table = h("table", { class: "dg-compare" },
      h("thead", null, h("tr", null, h("th", { class: "dg-c-blank", text: "" }), cols.map(function (c, i) {
        return h("th", { style: { "--c": color(c.c, i) } }, h("span", { class: "dg-c-t", text: c.t }), c.s ? h("span", { class: "dg-c-s", text: c.s }) : null);
      }))),
      h("tbody", null, (o.rows || []).map(function (r) {
        return h("tr", null, h("th", { scope: "row", text: r[0] }), r.slice(1).map(function (v, i) {
          var td = P.richEl("td", { "data-label": cols[i] ? cols[i].t : "" }, v);
          td.style.setProperty("--c", color(cols[i] && cols[i].c, i));
          return td;
        }));
      })));
    root.appendChild(h("div", { class: "dg-compare-wrap" }, table));
    if (o.verdict) root.appendChild(P.richEl("p", { class: "dg-verdict" }, o.verdict));
    note(root, o.note);
  });

  /* ---------------- Bars: horizontal bars, optionally with several sets ---------------- */
  P.widget("bars", function (root, o) {
    var sets = o.sets || [{ name: "", items: o.items || [], max: o.max, caption: o.caption }];
    var cur = 0;
    var list = h("div", { class: "dg-bars" });
    var cap = h("p", { class: "small muted" });
    if (sets.length > 1) root.appendChild(P.seg(sets.map(function (x, i) { return { value: String(i), label: x.name }; }), "0", function (v) { cur = +v; paint(); }, o.label || "Choose a view"));
    root.appendChild(list);
    root.appendChild(cap);
    function paint() {
      var set = sets[cur];
      var max = set.max || Math.max.apply(null, set.items.map(function (x) { return x.value; }));
      P.clear(list);
      set.items.forEach(function (it, i) {
        var pct = Math.max(1.5, Math.min(100, (it.value / max) * 100));
        list.appendChild(h("div", { class: "dg-bar" },
          h("span", { class: "dg-bar-l" }, h("b", { text: it.label }), it.note ? h("span", { text: it.note }) : null),
          h("span", { class: "dg-bar-track" }, h("i", { style: { width: pct + "%", background: color(it.c, i) } })),
          h("span", { class: "dg-bar-v", text: it.display || String(it.value) })));
      });
      cap.textContent = set.caption || "";
      cap.hidden = !set.caption;
    }
    paint();
    note(root, o.note);
  });

  /* ---------------- Tree: a folder layout you can click through ---------------- */
  P.widget("tree", function (root, o) {
    var items = o.items || [];
    var cur = o.start || 0;
    var list = h("div", { class: "dg-tree", role: "group", "aria-label": o.label || "Folders" });
    var detail = h("div");
    var btns = items.map(function (it, i) {
      var isDir = /\/$/.test(it.p);
      var b = h("button", { type: "button", class: "dg-tree-row" + (isDir ? " dir" : ""), "aria-pressed": String(i === cur), style: { "--depth": it.depth || 0 } },
        h("span", { class: "dg-tree-i", "aria-hidden": "true", text: isDir ? "▸" : "·" }),
        h("span", { class: "dg-tree-p", text: it.p }),
        it.s ? h("span", { class: "dg-tree-s", text: it.s }) : null);
      b.addEventListener("click", function () { cur = i; paint(); });
      list.appendChild(b);
      return b;
    });
    root.appendChild(h("div", { class: "dg-tree-wrap" }, list, detail));
    function paint() {
      btns.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === cur)); });
      P.clear(detail);
      detail.appendChild(detailBox({ t: items[cur].p, d: items[cur].d, like: items[cur].like, ex: items[cur].ex }));
    }
    paint();
    note(root, o.note);
  });

  /* ---------------- Lost in the Middle: accuracy by where the answer sits ---------------- */
  var LITM = [{ pos: 1, v: 75.8, label: "At the start", key: "start" }, { pos: 10, v: 53.8, label: "In the middle", key: "middle" }, { pos: 20, v: 63.2, label: "At the end", key: "end" }];
  var CLOSED = 56.1;
  P.widget("ucurve", function (root) {
    var cur = 1;
    var chart = h("div", { class: "chart" });
    var readout = P.readout([
      { key: "acc", label: "Accuracy with the answer here" },
      { key: "closed", label: "With no documents at all" },
      { key: "gap", label: "Difference" }
    ]);
    root.appendChild(P.seg(LITM.map(function (x, i) { return { value: String(i), label: x.label }; }), "1", function (v) { cur = +v; paint(); }, "Where the answer document sits"));
    root.appendChild(chart);
    root.appendChild(P.legend([
      { label: "Accuracy (the paper's three reported points)", color: "var(--c1)" },
      { label: "No documents at all (closed book)", color: "var(--c8)", line: true }
    ]));
    root.appendChild(readout);
    var verdict = h("p", { class: "small", "aria-live": "polite" });
    root.appendChild(verdict);
    note(root, "Data: Liu et al., <i>Lost in the Middle</i> (2023), GPT-3.5-Turbo answering questions over 20 retrieved documents with exactly one holding the answer. The curve between the three reported points is a sketch of the U shape the paper shows.");
    var width = 600;
    function draw(w) {
      width = w;
      P.clear(chart);
      var H = Math.max(220, Math.min(300, w * 0.48)), m = { l: 40, r: 16, t: 18, b: 34 };
      var x = P.scaleLin(1, 20, m.l, w - m.r), y = P.scaleLin(45, 80, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + w + " " + H, role: "img", "aria-label": "Accuracy by the position of the answer document" });
      [50, 60, 70, 80].forEach(function (v) {
        svg.appendChild(s("line", { x1: m.l, x2: w - m.r, y1: y(v), y2: y(v), class: "chart-grid" }));
        svg.appendChild(s("text", { x: m.l - 6, y: y(v) + 4, "text-anchor": "end", class: "chart-muted", text: v + "%" }));
      });
      // Parabola through the three reported points: a sketch of the U, not extra data.
      var a = 0.17813, b = -0.8413;
      var d = "";
      for (var px = 1; px <= 20; px += 0.25) d += (px === 1 ? "M" : "L") + x(px).toFixed(1) + " " + y(a * (px - 10) * (px - 10) + b * (px - 10) + 53.8).toFixed(1);
      svg.appendChild(s("path", { d: d, fill: "none", stroke: "var(--c1)", "stroke-width": "2.5", "stroke-linecap": "round", opacity: "0.55" }));
      svg.appendChild(s("line", { x1: m.l, x2: w - m.r, y1: y(CLOSED), y2: y(CLOSED), stroke: "var(--c8)", "stroke-width": "2", "stroke-dasharray": "6 5" }));
      svg.appendChild(s("text", { x: m.l + 6, y: y(CLOSED) + 16, "text-anchor": "start", class: "chart-muted", text: "no documents: 56.1%" }));
      LITM.forEach(function (pt, i) {
        var on = i === cur;
        svg.appendChild(s("circle", { cx: x(pt.pos), cy: y(pt.v), r: on ? 7 : 5, fill: "var(--c1)", stroke: "var(--chart-surface)", "stroke-width": "2" }));
        svg.appendChild(s("text", { x: x(pt.pos), y: y(pt.v) - 12, "text-anchor": i === 0 ? "start" : i === 2 ? "end" : "middle", class: on ? "chart-text-strong" : "chart-text", text: pt.v + "%" }));
      });
      [[1, "doc 1"], [10, "doc 10"], [20, "doc 20"]].forEach(function (t) {
        svg.appendChild(s("text", { x: x(t[0]), y: H - m.b + 18, "text-anchor": t[0] === 1 ? "start" : t[0] === 20 ? "end" : "middle", class: "chart-muted", text: t[1] }));
      });
      svg.appendChild(s("text", { x: (m.l + w - m.r) / 2, y: H - 4, "text-anchor": "middle", class: "chart-muted", text: "position of the document that holds the answer" }));
      chart.appendChild(svg);
    }
    function paint() {
      var pt = LITM[cur];
      readout.update("acc", pt.v + "%");
      readout.update("closed", CLOSED + "%");
      var gap = Math.round((pt.v - CLOSED) * 10) / 10;
      readout.update("gap", (gap > 0 ? "+" : "") + gap + " points", gap < 0 ? "worse than no documents" : "better than no documents");
      verdict.textContent = cur === 1
        ? "The answer was right there in the window, yet the model did worse than with no documents at all. Middle positions get the least attention."
        : cur === 0 ? "Facts at the very start of the window get the most attention. That is why the system prompt and the goal go first."
          : "Facts at the very end do well too. That is why long-running agents restate the goal at the end of the context.";
      draw(width);
    }
    P.responsive(chart, function (w) { draw(w); });
    paint();
  });

  /* ---------------- Context budget: what fills the window, and what a long run costs ---------------- */
  P.widget("budget", function (root) {
    var st = { tools: 20, turns: 10, docs: 4, price: 3, cache: true };
    var SYS = 3000, TOOL = 950, TURN = 1500, DOC = 2000, WINDOW = 200000;
    var bar = h("div", { class: "dg-budget" });
    var readout = P.readout([
      { key: "last", label: "Size of the last call" },
      { key: "paid", label: "Tokens sent over the run" },
      { key: "cost", label: "Cost of the run" },
      { key: "save", label: "Prompt caching saves" }
    ]);
    var warn = h("p", { class: "small", "aria-live": "polite" });
    root.appendChild(h("div", { class: "controls" },
      P.slider({ id: "bg-tools", label: "Tools loaded", min: 0, max: 80, step: 1, value: st.tools, format: function (v) { return v + " tools"; }, onInput: function (v) { st.tools = v; paint(); } }),
      P.slider({ id: "bg-turns", label: "Turns in the run", min: 1, max: 40, step: 1, value: st.turns, format: function (v) { return v + " turns"; }, onInput: function (v) { st.turns = v; paint(); } }),
      P.slider({ id: "bg-docs", label: "Documents pasted in", min: 0, max: 30, step: 1, value: st.docs, format: function (v) { return v + " docs"; }, onInput: function (v) { st.docs = v; paint(); } }),
      P.slider({ id: "bg-price", label: "Price per million input tokens", min: 0.25, max: 15, step: 0.25, value: st.price, format: function (v) { return "$" + v.toFixed(2); }, onInput: function (v) { st.price = v; paint(); } })
    ));
    var cacheSeg = P.seg([{ value: "on", label: "Prompt caching on" }, { value: "off", label: "Caching off" }], "on", function (v) { st.cache = v === "on"; paint(); }, "Prompt caching");
    root.appendChild(cacheSeg);
    root.appendChild(bar);
    root.appendChild(P.legend([
      { label: "System prompt", color: "var(--c7)" },
      { label: "Tool definitions", color: "var(--c2)" },
      { label: "Documents", color: "var(--c4)" },
      { label: "Conversation so far", color: "var(--c1)" },
      { label: "Free space", color: "var(--surface-2)" }
    ]));
    root.appendChild(readout);
    root.appendChild(warn);
    note(root, "Teaching model. Tool size uses Anthropic's measurement of 58 tools ≈ 55,000 tokens (about 950 each). The system prompt (3,000), each turn (1,500), and each document (2,000) are typical sizes, not measurements. Caching assumes the system prompt and tools stay byte-identical: reads cost 0.1× and the first write 1.25×. Window: 200,000 tokens.");
    function paint() {
      var fixed = SYS + st.tools * TOOL + st.docs * DOC;
      var last = fixed + st.turns * TURN;
      var paid = 0, cost = 0, costNo = 0, prefix = SYS + st.tools * TOOL;
      for (var t = 1; t <= st.turns; t++) {
        var call = fixed + t * TURN;
        paid += call;
        costNo += call;
        cost += t === 1 ? prefix * 1.25 + (call - prefix) : prefix * 0.1 + (call - prefix);
      }
      var price = st.price / 1e6;
      var runCost = (st.cache ? cost : costNo) * price;
      P.clear(bar);
      var parts = [[SYS, "var(--c7)", "System prompt"], [st.tools * TOOL, "var(--c2)", "Tools"], [st.docs * DOC, "var(--c4)", "Documents"], [st.turns * TURN, "var(--c1)", "Conversation"]];
      var used = 0;
      parts.forEach(function (p) {
        var w = Math.min(p[0], Math.max(0, WINDOW - used));
        used += w;
        if (w > 0) bar.appendChild(h("i", { style: { width: (w / WINDOW) * 100 + "%", background: p[1] }, title: p[2] + ": " + P.fmt.compact(p[0], 1) + " tokens" }));
      });
      if (used < WINDOW) bar.appendChild(h("i", { class: "free", style: { width: ((WINDOW - used) / WINDOW) * 100 + "%" } }));
      readout.update("last", P.fmt.compact(last, 1), Math.round((last / WINDOW) * 100) + "% of a 200K window");
      readout.update("paid", P.fmt.compact(paid, 1), "every turn resends everything");
      readout.update("cost", P.fmt.money(runCost), st.cache ? "with caching" : "without caching");
      readout.update("save", st.cache ? Math.round((1 - cost / costNo) * 100) + "%" : "off", st.cache ? P.fmt.money((costNo - cost) * price) + " on this run" : "turn it on to compare");
      var toolShare = (st.tools * TOOL) / last;
      warn.textContent = last > WINDOW ? "Over the window: the run would fail or have to drop old turns. Compact the history or load fewer tools."
        : toolShare > 0.4 ? "Tool definitions are " + Math.round(toolShare * 100) + "% of every call. Past about 20 tools, load tools on demand (tool search) instead of all at once."
          : last > WINDOW * 0.5 ? "Over half the window is full. Quality drops as key facts drift into the middle; restate the goal at the end or compact."
            : "Healthy. Note how the total sent over the run grows much faster than any single call.";
    }
    paint();
  });

  /* ---------------- Compounding: what a second brain feels like over six months ---------------- */
  var MILESTONES = [
    { wk: 1, t: "Week 1", d: "Setup, ten or twenty sources. It feels like a folder with extra steps. This is normal, and it is where most people quit." },
    { wk: 3, t: "Weeks 2 to 4", d: "Fifty to a hundred sources. The first moment it connects two things you read weeks apart. From here it starts being worth the setup." },
    { wk: 13, t: "Month 3", d: "A few hundred pages. It answers faster than you could by rereading, and surfaces things you had forgotten saving." },
    { wk: 26, t: "Month 6", d: "It knows things you do not remember learning. This is the payoff everyone describes, and it takes six months of feeding it." }
  ];
  P.widget("compound", function (root) {
    var cur = 0;
    var chart = h("div", { class: "chart" });
    var detail = h("div");
    root.appendChild(P.seg(MILESTONES.map(function (m, i) { return { value: String(i), label: m.t }; }), "0", function (v) { cur = +v; paint(); }, "Milestone"));
    root.appendChild(chart);
    root.appendChild(detail);
    note(root, "The milestones are from Second Brain OS's “What good looks like” guide. The curve shows the shape (slow, then compounding), not measured data.");
    var width = 600;
    function val(wk) { return 1 / (1 + Math.exp(-(wk - 12) / 4)); }
    function draw(w) {
      width = w;
      P.clear(chart);
      var H = Math.max(200, Math.min(260, w * 0.42)), m = { l: 16, r: 16, t: 20, b: 30 };
      var x = P.scaleLin(0, 26, m.l, w - m.r), y = P.scaleLin(val(0), 1, H - m.b, m.t);
      var svg = s("svg", { viewBox: "0 0 " + w + " " + H, role: "img", "aria-label": "Value of a second brain over six months" });
      svg.appendChild(s("line", { x1: m.l, x2: w - m.r, y1: H - m.b, y2: H - m.b, class: "chart-axis" }));
      var d = "", area = "M" + x(0) + " " + (H - m.b);
      for (var wk = 0; wk <= 26; wk += 0.5) { d += (wk === 0 ? "M" : "L") + x(wk).toFixed(1) + " " + y(val(wk)).toFixed(1); area += "L" + x(wk).toFixed(1) + " " + y(val(wk)).toFixed(1); }
      area += "L" + x(26) + " " + (H - m.b) + "Z";
      svg.appendChild(s("path", { d: area, fill: P.mix("var(--c3)", 16) }));
      svg.appendChild(s("path", { d: d, fill: "none", stroke: "var(--c3)", "stroke-width": "2.5" }));
      svg.appendChild(s("rect", { x: x(0), y: m.t, width: x(2) - x(0), height: H - m.b - m.t, fill: P.mix("var(--c8)", 10) }));
      svg.appendChild(s("text", { x: x(0) + 4, y: m.t + 12, class: "chart-muted", text: "most people quit here" }));
      MILESTONES.forEach(function (ms, i) {
        var on = i === cur;
        var g = s("g", { class: "dg-pt", tabindex: "0", role: "button", "aria-label": ms.t });
        g.appendChild(s("circle", { cx: x(ms.wk), cy: y(val(ms.wk)), r: on ? 8 : 5.5, fill: on ? "var(--c3)" : "var(--chart-surface)", stroke: "var(--c3)", "stroke-width": "2.5" }));
        g.appendChild(s("text", { x: x(ms.wk), y: H - m.b + 18, "text-anchor": i === 0 ? "start" : i === 3 ? "end" : "middle", class: on ? "chart-text-strong" : "chart-muted", text: ms.t }));
        g.addEventListener("click", function () { cur = i; paint(); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cur = i; paint(); } });
        svg.appendChild(g);
      });
      svg.appendChild(s("text", { x: w - m.r, y: m.t - 6, "text-anchor": "end", class: "chart-muted", text: "how useful it feels ↑" }));
      chart.appendChild(svg);
    }
    function paint() {
      P.clear(detail);
      detail.appendChild(detailBox({ t: MILESTONES[cur].t, d: MILESTONES[cur].d }));
      draw(width);
    }
    P.responsive(chart, function (w) { draw(w); });
    paint();
  });

  /* ---------------- Funnel: how much work each stage handles ---------------- */
  P.widget("funnel", function (root, o) {
    var stages = o.stages || [];
    var max = stages[0] ? stages[0].value : 1;
    var list = h("div", { class: "dg-funnel" });
    stages.forEach(function (st, i) {
      var pct = Math.max(8, (st.value / max) * 100);
      list.appendChild(h("div", { class: "dg-fun-row" },
        h("div", { class: "dg-fun-bar", style: { width: pct + "%", background: P.mix(color(st.c, i), 30), borderColor: color(st.c, i) } },
          h("b", { text: st.display || P.fmt.num(st.value) }), h("span", { text: st.label })),
        st.note ? P.richEl("p", { class: "dg-fun-note" }, st.note) : null));
    });
    root.appendChild(list);
    note(root, o.note);
  });

  /* ---------------- Gate threshold: auto-handle the confident cases, escalate the rest ---------------- */
  /* Small seeded random generator (scrambled seed, first draws discarded) so figures repeat exactly. */
  function rng(seed) {
    var x = (seed * 2654435761) % 4294967296;
    var next = function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
    next(); next(); next();
    return next;
  }
  var GATE_CASES = (function () {
    var r = rng(7), out = [];
    for (var i = 0; i < 1000; i++) {
      var u = r(), v = r();
      out.push(Math.min(0.995, 0.5 + 0.5 * Math.pow(Math.max(u, v), 0.6)));
    }
    return out;
  })();
  var GATE_SCENARIOS = [
    { key: "queue", label: "Pick a support queue", wrong: 2, esc: 1.5, hint: "A wrong queue costs a few minutes of rerouting, so a low threshold is fine." },
    { key: "refund", label: "Auto-approve a refund", wrong: 120, esc: 1.5, hint: "A wrong refund costs real money, so only near-certain cases should go through." }
  ];
  P.widget("threshold", function (root) {
    var st = { t: 0.85, sc: 0, calib: true };
    var chart = h("div", { class: "dg-gatebar" });
    var readout = P.readout([
      { key: "auto", label: "Handled automatically" },
      { key: "esc", label: "Escalated (to a person or a bigger model)" },
      { key: "err", label: "Wrong automatic answers" },
      { key: "cost", label: "Cost per 1,000 items" }
    ]);
    var verdict = h("p", { class: "small", "aria-live": "polite" });
    var slider = P.slider({ id: "gate-t", label: "Confidence needed to act on its own", min: 0.5, max: 0.99, step: 0.01, value: st.t, format: function (v) { return v.toFixed(2); }, onInput: function (v) { st.t = v; paint(); } });
    root.appendChild(h("div", { class: "controls" }, slider));
    root.appendChild(P.seg(GATE_SCENARIOS.map(function (x, i) { return { value: String(i), label: x.label }; }), "0", function (v) { st.sc = +v; paint(); }, "Decision"));
    root.appendChild(P.seg([{ value: "yes", label: "Honest confidence" }, { value: "no", label: "Overconfident model" }], "yes", function (v) { st.calib = v === "yes"; paint(); }, "Calibration"));
    var best = h("button", { type: "button", class: "btn small", text: "Find the cheapest threshold" });
    best.addEventListener("click", function () {
      var bestT = 0.5, bestC = Infinity;
      for (var t = 0.5; t <= 0.99; t += 0.01) { var c = evalAt(t).cost; if (c < bestC) { bestC = c; bestT = t; } }
      st.t = Math.round(bestT * 100) / 100; slider.set(st.t); paint();
    });
    root.appendChild(h("div", { class: "row" }, best));
    root.appendChild(chart);
    root.appendChild(P.legend([
      { label: "Acted on automatically, right", color: "var(--c3)" },
      { label: "Acted on automatically, wrong", color: "var(--c8)" },
      { label: "Escalated", color: "var(--c1)" }
    ]));
    root.appendChild(readout);
    root.appendChild(verdict);
    note(root, "Teaching model with 1,000 made-up items. “Honest confidence” means a 0.9 really is right 9 times in 10. The overconfident model is right less often than it says. Costs per mistake and per escalation are illustrative.");
    function evalAt(t) {
      var sc = GATE_SCENARIOS[st.sc], auto = 0, err = 0;
      GATE_CASES.forEach(function (c) {
        if (c >= t) { auto++; var trueAcc = st.calib ? c : Math.max(0.5, c - 0.18 * (c - 0.5) / 0.5 - 0.05); err += 1 - trueAcc; }
      });
      var esc = GATE_CASES.length - auto;
      return { auto: auto, err: err, esc: esc, cost: err * sc.wrong + esc * sc.esc };
    }
    function paint() {
      var r = evalAt(st.t), n = GATE_CASES.length, sc = GATE_SCENARIOS[st.sc];
      P.clear(chart);
      chart.appendChild(h("i", { style: { width: ((r.auto - r.err) / n) * 100 + "%", background: "var(--c3)" } }));
      chart.appendChild(h("i", { style: { width: (r.err / n) * 100 + "%", background: "var(--c8)" } }));
      chart.appendChild(h("i", { style: { width: (r.esc / n) * 100 + "%", background: "var(--c1)" } }));
      readout.update("auto", Math.round((r.auto / n) * 100) + "%", P.fmt.num(r.auto) + " of 1,000");
      readout.update("esc", Math.round((r.esc / n) * 100) + "%", "$" + sc.esc.toFixed(2) + " each");
      readout.update("err", P.fmt.num(Math.round(r.err)), "$" + sc.wrong + " each");
      readout.update("cost", P.fmt.money(r.cost));
      verdict.textContent = sc.hint + (st.calib ? "" : " With an overconfident model, the same threshold lets through more mistakes than you planned for. Check its accuracy in confidence bands before trusting the number.");
    }
    paint();
  });

  /* ---------------- Loop simulator: goal, external checker, stop rule, budget ---------------- */
  P.widget("loopsim", function (root) {
    var st = { turns: 5, budget: 0.5, checker: "tests" };
    var COST = 0.08;
    var seed = 2; // the first run shows two failed attempts, then a pass
    var track = h("div", { class: "dg-loop-track", "aria-live": "polite" });
    var outcome = h("div", { class: "dg-loop-out" });
    var tally = h("p", { class: "small muted" });
    root.appendChild(h("div", { class: "controls" },
      P.slider({ id: "loop-turns", label: "Turn limit", min: 1, max: 10, step: 1, value: st.turns, format: function (v) { return v + " turns"; }, onInput: function (v) { st.turns = v; } }),
      P.slider({ id: "loop-budget", label: "Budget for the run", min: 0.1, max: 1, step: 0.05, value: st.budget, format: function (v) { return "$" + v.toFixed(2); }, onInput: function (v) { st.budget = v; } })
    ));
    root.appendChild(P.seg([{ value: "tests", label: "Checker: real tests" }, { value: "self", label: "Checker: the model grades itself" }], "tests", function (v) { st.checker = v; }, "Who checks the work"));
    var runBtn = h("button", { type: "button", class: "btn primary small", text: "Run the loop once" });
    var manyBtn = h("button", { type: "button", class: "btn small", text: "Run it 100 times" });
    root.appendChild(h("div", { class: "row" }, runBtn, manyBtn));
    root.appendChild(track);
    root.appendChild(outcome);
    root.appendChild(tally);
    note(root, "Teaching model. Each attempt costs $0.08 and has a growing chance of truly fixing the bug. Real tests always tell the truth. A model grading its own work says “done” about half the time even when the fix is broken, in line with research showing models rarely correct themselves without outside feedback (Huang et al., 2024).");
    function simulate(r) {
      var attempts = [], spent = 0, last = null;
      for (var t = 1; t <= st.turns; t++) {
        if (spent + COST > st.budget + 1e-9) return { attempts: attempts, end: "budget" };
        spent += COST;
        var fixed = r() < 0.18 + 0.1 * t;
        var sig = fixed ? "fix" : "try" + Math.floor(r() * 3);
        if (!fixed && sig === last) { attempts.push({ ok: false, note: "same as last" }); return { attempts: attempts, end: "stuck" }; }
        last = sig;
        if (st.checker === "tests") {
          attempts.push({ ok: fixed });
          if (fixed) return { attempts: attempts, end: "pass" };
        } else {
          var says = fixed || r() < 0.5;
          attempts.push({ ok: fixed, claimed: says });
          if (says) return { attempts: attempts, end: fixed ? "pass" : "silent" };
        }
      }
      return { attempts: attempts, end: "turns" };
    }
    var ENDS = {
      pass: ["good", "Done: the checker confirmed the fix."],
      turns: ["warn", "Stopped at the turn limit. Handed to the fallback (a person or a fixed workflow)."],
      budget: ["warn", "Stopped: the budget ran out. Handed to the fallback."],
      stuck: ["warn", "Stopped: two identical attempts in a row means it is stuck. Handed to the fallback."],
      silent: ["bad", "Claimed done, but the fix is broken. Nobody finds out until a user does."]
    };
    function showOne() {
      var res = simulate(rng(seed++));
      P.clear(track);
      res.attempts.forEach(function (a, i) {
        var label = st.checker === "self" ? (a.claimed ? "says done" : "says not yet") : (a.ok ? "tests pass" : "tests fail");
        track.appendChild(h("span", { class: "dg-loop-chip " + (a.ok ? "ok" : "no") }, h("b", { text: "Turn " + (i + 1) }), h("span", { text: a.note || label })));
      });
      var e = ENDS[res.end];
      P.clear(outcome);
      outcome.className = "dg-loop-out " + e[0];
      outcome.appendChild(h("span", { text: e[1] }));
    }
    function showMany() {
      var counts = { pass: 0, turns: 0, budget: 0, stuck: 0, silent: 0 };
      var r = rng(seed++);
      for (var i = 0; i < 100; i++) counts[simulate(r).end]++;
      P.clear(track);
      P.clear(outcome);
      outcome.className = "dg-loop-out " + (counts.silent ? "bad" : "good");
      outcome.appendChild(h("span", { text: counts.pass + " fixed and confirmed · " + (counts.turns + counts.budget + counts.stuck) + " handed to the fallback safely · " + counts.silent + " claimed done but broken" }));
      tally.textContent = counts.silent ? "Every one of those " + counts.silent + " silent failures comes from letting the model grade its own work. Switch to real tests and run again." : "No silent failures: an outside checker plus a stop rule means the loop either succeeds or hands off safely.";
    }
    runBtn.addEventListener("click", function () { tally.textContent = ""; showOne(); });
    manyBtn.addEventListener("click", showMany);
    showOne();
  });

  /* ---------------- Trace check: end-to-end vs behavioural checks on one agent run ---------------- */
  var RUNS = [
    { name: "A good run", steps: ["get_order", "ask_approval", "refund", "reply"], outcome: true },
    { name: "Refund before approval", steps: ["get_order", "refund", "ask_approval", "reply"], outcome: true },
    { name: "Skipped the lookup", steps: ["ask_approval", "refund", "reply"], outcome: true },
    { name: "Wrong amount refunded", steps: ["get_order", "ask_approval", "refund", "reply"], outcome: false }
  ];
  var STEP_PLAIN = { get_order: "Look up the order", ask_approval: "Ask a person to approve", refund: "Send the refund", reply: "Reply to the customer" };
  P.widget("tracecheck", function (root) {
    var cur = 0;
    var trace = h("ol", { class: "dg-trace" });
    var checks = h("div", { class: "dg-checks" });
    var verdict = h("p", { class: "small", "aria-live": "polite" });
    root.appendChild(P.seg(RUNS.map(function (r, i) { return { value: String(i), label: r.name }; }), "0", function (v) { cur = +v; paint(); }, "Agent run"));
    root.appendChild(h("div", { class: "dg-trace-wrap" }, h("div", null, h("span", { class: "mini-h", text: "The trace: what the agent did, in order" }), trace), checks));
    root.appendChild(verdict);
    function before(steps, a, b) { var i = steps.indexOf(a), j = steps.indexOf(b); return i >= 0 && j >= 0 && i < j; }
    function paint() {
      var run = RUNS[cur];
      P.clear(trace);
      run.steps.forEach(function (st) { trace.appendChild(h("li", null, h("code", { text: st }), h("span", { text: STEP_PLAIN[st] }))); });
      var list = [
        { kind: "End-to-end", t: "Right outcome for the customer", ok: run.outcome },
        { kind: "Behavioural", t: "Looked up the order before refunding", ok: before(run.steps, "get_order", "refund") },
        { kind: "Behavioural", t: "Asked for approval before refunding", ok: before(run.steps, "ask_approval", "refund") }
      ];
      P.clear(checks);
      checks.appendChild(h("span", { class: "mini-h", text: "The checks" }));
      list.forEach(function (c) {
        checks.appendChild(h("div", { class: "dg-check " + (c.ok ? "ok" : "no") }, h("span", { class: "dg-check-i", text: c.ok ? "✓" : "✗" }), h("span", null, h("b", { text: c.kind + ": " }), c.t)));
      });
      var e2e = list[0].ok, beh = list[1].ok && list[2].ok;
      verdict.textContent = e2e && beh ? "Every check passes. Both kinds agree."
        : e2e ? "The end-to-end check passes because the customer got the right result, but the agent broke a rule on the way. Only the behavioural checks, which read the trace, catch it."
          : "The steps were in the right order, but the result was wrong. Only the end-to-end check catches this. You need both kinds.";
    }
    paint();
  });

  /* ---------------- Knowledge graph: shapes and health numbers, or "what connects X and Y" ---------------- */
  var KG_NAMES = ["Transformer", "Attention", "Tokens", "Context", "Scaling", "LoRA", "Copilot", "Evals", "Golden set", "Risks", "Budget", "Standups"];
  var KG_PRESETS = {
    healthy: { label: "Well linked", edges: [[0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [0, 4], [4, 5], [0, 5], [6, 7], [7, 8], [6, 8], [6, 9], [9, 10], [6, 10], [6, 11], [9, 11], [7, 9], [3, 6], [4, 10]],
      text: "Dense inside each topic, a couple of bridges between topics (Context to Copilot, Scaling to Budget). Most pages are two or three hops from each other. This is the shape to aim for." },
    star: { label: "Star", edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11]],
      text: "Everything links only to one broad hub page. Paths are short, but always through the hub, so the graph says nothing beyond “these are all in my vault”. Cause: linking to broad concepts instead of specific ones." },
    chain: { label: "Chain", edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]],
      text: "Each page links to the next and nothing links sideways, common after a bulk import that never checked existing pages. Related ideas end up many hops apart, too far for the agent to walk." },
    islands: { label: "Islands", edges: [[0, 1], [1, 2], [0, 2], [6, 7], [7, 8], [6, 8], [9, 10], [10, 11], [9, 11]],
      text: "Separate clusters with no bridges, plus orphan pages nobody links to. Nothing in one island can inform an answer about another, and nothing looks wrong while it happens." }
  };
  function kgLayout(key, n) {
    var pos = [];
    if (key === "star") {
      pos[0] = [0.5, 0.5];
      for (var i = 1; i < n; i++) { var a = (i - 1) / (n - 1) * Math.PI * 2 - Math.PI / 2; pos[i] = [0.5 + 0.4 * Math.cos(a), 0.5 + 0.4 * Math.sin(a)]; }
    } else if (key === "chain") {
      for (var j = 0; j < n; j++) pos[j] = [0.06 + j * (0.88 / (n - 1)), j % 2 ? 0.66 : 0.3];
    } else if (key === "islands") {
      var c = [[0.2, 0.36], [0.2, 0.36], [0.2, 0.36], null, null, null, [0.52, 0.66], [0.52, 0.66], [0.52, 0.66], [0.82, 0.34], [0.82, 0.34], [0.82, 0.34]];
      var orph = { 3: [0.56, 0.16], 4: [0.86, 0.84], 5: [0.14, 0.84] };
      var k = 0;
      for (var m = 0; m < n; m++) {
        if (orph[m]) { pos[m] = orph[m]; continue; }
        var ang = (k % 3) / 3 * Math.PI * 2 - Math.PI / 2; k++;
        pos[m] = [c[m][0] + 0.11 * Math.cos(ang), c[m][1] + 0.17 * Math.sin(ang)];
      }
    } else {
      // Two topic clusters (models on the left, project work on the right) with two bridges.
      pos = [[0.14, 0.5], [0.08, 0.15], [0.32, 0.52], [0.34, 0.2], [0.3, 0.82], [0.08, 0.85],
        [0.62, 0.22], [0.9, 0.15], [0.94, 0.48], [0.78, 0.5], [0.62, 0.8], [0.8, 0.9]];
    }
    return pos;
  }
  function components(n, edges) {
    var adj = []; for (var i = 0; i < n; i++) adj.push([]);
    edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    var seen = [], comps = [];
    for (var v = 0; v < n; v++) {
      if (seen[v]) continue;
      var stack = [v], comp = []; seen[v] = true;
      while (stack.length) { var x = stack.pop(); comp.push(x); adj[x].forEach(function (y) { if (!seen[y]) { seen[y] = true; stack.push(y); } }); }
      comps.push(comp);
    }
    return { adj: adj, comps: comps };
  }
  function bfs(adj, a) {
    var dist = {}, prev = {}; dist[a] = 0;
    var q = [a];
    while (q.length) { var x = q.shift(); adj[x].forEach(function (y) { if (dist[y] === undefined) { dist[y] = dist[x] + 1; prev[y] = x; q.push(y); } }); }
    return { dist: dist, prev: prev };
  }
  /* Typed graph for path finding: a small learning vault. */
  var TG_NODES = [
    { t: "Transformer", sh: "Transformer", x: 0.08, y: 0.16, k: "concept" },
    { t: "Context window", sh: "Context", x: 0.24, y: 0.44, k: "concept" },
    { t: "Lost in the Middle", sh: "Lost in Middle", x: 0.09, y: 0.76, k: "paper" },
    { t: "Claim: a bigger window is enough", sh: "Claim: bigger", x: 0.34, y: 0.9, k: "claim" },
    { t: "Prompt caching", sh: "Caching", x: 0.42, y: 0.14, k: "concept" },
    { t: "Agent loop", sh: "Loop", x: 0.47, y: 0.58, k: "concept" },
    { t: "Evals", sh: "Evals", x: 0.64, y: 0.86, k: "concept" },
    { t: "Golden set", sh: "Golden set", x: 0.9, y: 0.86, k: "concept" },
    { t: "Delivery Copilot", sh: "Copilot", x: 0.66, y: 0.34, k: "project" },
    { t: "RAG", sh: "RAG", x: 0.86, y: 0.56, k: "concept" },
    { t: "GraphRAG", sh: "GraphRAG", x: 0.94, y: 0.3, k: "paper" },
    { t: "Second brain", sh: "2nd brain", x: 0.84, y: 0.1, k: "concept" },
    { t: "Karpathy's LLM wiki", sh: "LLM wiki", x: 0.62, y: 0.08, k: "source" }
  ];
  var TG_EDGES = [[1, "part-of", 0], [2, "extends", 1], [2, "contradicts", 3], [4, "extends", 1], [5, "applies", 1], [4, "supports", 5], [6, "supports", 5], [7, "part-of", 6], [8, "applies", 5], [8, "applies", 6], [8, "applies", 9], [10, "extends", 9], [12, "supports", 11], [11, "applies", 9]];
  var TYPE_COLOR = { supports: "var(--c3)", contradicts: "var(--c8)", extends: "var(--c1)", "part-of": "var(--c7)", applies: "var(--c2)" };
  var KIND_COLOR = { concept: "var(--ink-3)", paper: "var(--c4)", project: "var(--c5)", claim: "var(--c8)", source: "var(--c6)" };

  P.widget("kgraph", function (root, o) {
    var mode = o.mode || "shapes";
    var chart = h("div", { class: "chart dg-kg" });
    var info = h("p", { class: "small", "aria-live": "polite" });
    var width = 600, selected = null;
    if (mode === "shapes") {
      var preset = "healthy";
      var readout = P.readout([
        { key: "deg", label: "Average links per page" },
        { key: "orph", label: "Orphans (no links)" },
        { key: "main", label: "Largest connected part" },
        { key: "hops", label: "Longest walk between pages" }
      ]);
      root.appendChild(P.seg(Object.keys(KG_PRESETS).map(function (k) { return { value: k, label: KG_PRESETS[k].label }; }), preset, function (v) { preset = v; selected = null; paint(); }, "Graph shape"));
      root.appendChild(chart);
      root.appendChild(readout);
      root.appendChild(info);
      note(root, "Targets from Second Brain OS: orphans under 5%, 3 to 8 links per page on average, and one main part holding at least 80% of pages. Click a page to see its links. (In a real vault an orphan is a page nothing links <i>to</i>.)");
      var paint = function () {
        var pr = KG_PRESETS[preset], n = KG_NAMES.length;
        var g = components(n, pr.edges);
        var deg = g.adj.map(function (a) { return a.length; });
        var avg = (2 * pr.edges.length) / n;
        var orphans = deg.filter(function (d) { return d === 0; }).length;
        var main = Math.max.apply(null, g.comps.map(function (c) { return c.length; }));
        var mainComp = g.comps.filter(function (c) { return c.length === main; })[0];
        var diam = 0;
        mainComp.forEach(function (v) { var r = bfs(g.adj, v); Object.keys(r.dist).forEach(function (k) { diam = Math.max(diam, r.dist[k]); }); });
        function mark(ok) { return ok ? "✓ on target" : "✗ off target"; }
        readout.update("deg", avg.toFixed(1), mark(avg >= 3 && avg <= 8));
        readout.update("orph", Math.round((orphans / n) * 100) + "%", mark(orphans / n < 0.05));
        readout.update("main", Math.round((main / n) * 100) + "%", mark(main / n >= 0.8));
        readout.update("hops", diam + " hops", diam <= 4 ? "close enough to walk" : "too far for an agent to walk");
        info.textContent = selected !== null ? KG_NAMES[selected] + " has " + deg[selected] + " link" + (deg[selected] === 1 ? "" : "s") + (deg[selected] ? ": " + g.adj[selected].map(function (y) { return KG_NAMES[y]; }).join(", ") + "." : ". It is an orphan: no walk ever reaches it.") : pr.text;
        draw(width, kgLayout(preset, n), pr.edges.map(function (e) { return { a: e[0], b: e[1] }; }), KG_NAMES.map(function (t, i) { return { t: t, sh: t, deg: deg[i], k: deg[i] === 0 ? "orphan" : "concept" }; }), null);
      };
    } else {
      var from = o.from !== undefined ? o.from : 7, to = o.to !== undefined ? o.to : 0;
      function select(id, val, onChange, label) {
        var sel = h("select", { id: id, "aria-label": label });
        TG_NODES.forEach(function (nd, i) { var op = h("option", { value: String(i), text: nd.t }); if (i === val) op.selected = true; sel.appendChild(op); });
        sel.addEventListener("change", function () { onChange(+sel.value); });
        return h("label", { class: "dg-select", for: id }, h("span", { class: "small muted", text: label }), sel);
      }
      root.appendChild(h("div", { class: "row" },
        select("kg-from", from, function (v) { from = v; paint(); }, "From"),
        select("kg-to", to, function (v) { to = v; paint(); }, "To")));
      root.appendChild(chart);
      root.appendChild(P.legend(Object.keys(TYPE_COLOR).map(function (k) { return { label: k, color: TYPE_COLOR[k], line: true }; })));
      var pathBox = h("div", { class: "dg-path", "aria-live": "polite" });
      root.appendChild(pathBox);
      note(root, "A small example vault. Each link has a type: supports, contradicts, extends, part-of, or applies. The path is computed by walking the links, not guessed, which is what graph retrieval adds over similarity search.");
      var paint = function () {
        var g = components(TG_NODES.length, TG_EDGES.map(function (e) { return [e[0], e[2]]; }));
        var r = bfs(g.adj, from);
        var path = [];
        if (r.dist[to] !== undefined) { var x = to; path.push(x); while (x !== from) { x = r.prev[x]; path.push(x); } path.reverse(); }
        var onPath = {}, edgeOn = {};
        path.forEach(function (v, i) { onPath[v] = true; if (i) edgeOn[Math.min(v, path[i - 1]) + "-" + Math.max(v, path[i - 1])] = true; });
        P.clear(pathBox);
        if (from === to) pathBox.appendChild(h("p", { class: "small", text: "Pick two different pages." }));
        else if (!path.length) pathBox.appendChild(h("p", { class: "small", text: "No path: these pages sit on separate islands." }));
        else {
          pathBox.appendChild(h("span", { class: "mini-h", text: (path.length - 1) + " hop" + (path.length === 2 ? "" : "s") + " from " + TG_NODES[from].t + " to " + TG_NODES[to].t }));
          var ol = h("ol", { class: "dg-hops" });
          for (var i = 1; i < path.length; i++) {
            var a = path[i - 1], b = path[i];
            var e = TG_EDGES.filter(function (e) { return (e[0] === a && e[2] === b) || (e[0] === b && e[2] === a); })[0];
            var fwd = e[0] === a;
            ol.appendChild(h("li", null,
              h("b", { text: TG_NODES[e[0]].t }), " ", h("span", { class: "dg-type", style: { "--c": TYPE_COLOR[e[1]] }, text: e[1] }), " ", h("b", { text: TG_NODES[e[2]].t }),
              h("span", { class: "muted small", text: fwd ? "" : "  (walked backwards)" })));
          }
          pathBox.appendChild(ol);
        }
        draw(width, TG_NODES.map(function (nd) { return [nd.x, nd.y]; }), TG_EDGES.map(function (e) { return { a: e[0], b: e[2], type: e[1], on: !!edgeOn[Math.min(e[0], e[2]) + "-" + Math.max(e[0], e[2])] }; }),
          TG_NODES.map(function (nd, i) { return { t: nd.t, sh: nd.sh, k: nd.k, on: !!onPath[i], deg: g.adj[i].length }; }), path.length ? true : null);
      };
    }
    function draw(w, pos, edges, nodes, highlight) {
      width = w;
      P.clear(chart);
      var narrow = w < 520;
      var H = Math.max(280, Math.min(380, w * 0.58)), pad = { x: narrow ? 30 : 44, t: 18, b: 30 };
      function X(v) { return pad.x + v * (w - 2 * pad.x); }
      function Y(v) { return pad.t + v * (H - pad.t - pad.b); }
      var svg = s("svg", { viewBox: "0 0 " + w + " " + H, role: "img", "aria-label": mode === "shapes" ? "A small knowledge graph" : "A typed knowledge graph" });
      edges.forEach(function (e) {
        var c = e.type ? TYPE_COLOR[e.type] : "var(--rule-strong)";
        var dim = highlight && !e.on;
        svg.appendChild(s("line", { x1: X(pos[e.a][0]), y1: Y(pos[e.a][1]), x2: X(pos[e.b][0]), y2: Y(pos[e.b][1]), stroke: c, "stroke-width": e.on ? 4 : 2, opacity: dim ? 0.25 : 0.9, "stroke-linecap": "round" }));
      });
      nodes.forEach(function (nd, i) {
        var x = X(pos[i][0]), y = Y(pos[i][1]);
        var dim = highlight && !nd.on;
        var g = s("g", { class: "dg-node", tabindex: "0", role: "button", "aria-label": nd.t + ", " + nd.deg + " links", opacity: dim ? 0.4 : 1 });
        var r = mode === "shapes" ? 6 + Math.min(nd.deg, 8) * 1.3 : 8;
        var stroke = nd.k === "orphan" ? "var(--c8)" : KIND_COLOR[nd.k] || "var(--ink-3)";
        g.appendChild(s("circle", { cx: x, cy: y, r: r, fill: selected === i || nd.on ? P.mix(stroke, 45) : "var(--chart-surface)", stroke: stroke, "stroke-width": selected === i ? 3.5 : 2.2, "stroke-dasharray": nd.k === "orphan" ? "3 3" : null }));
        var anchor = pos[i][0] > 0.86 ? "end" : pos[i][0] < 0.12 ? "start" : "middle";
        var label = narrow ? nd.sh : nd.t;
        g.appendChild(s("text", { x: anchor === "end" ? x + r : anchor === "start" ? x - r : x, y: pos[i][1] > 0.8 ? y - r - 6 : y + r + 13, "text-anchor": anchor, class: "chart-text", text: label }));
        if (mode === "shapes") {
          g.addEventListener("click", function () { selected = selected === i ? null : i; paint(); });
          g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selected = selected === i ? null : i; paint(); } });
        }
        svg.appendChild(g);
      });
      chart.appendChild(svg);
    }
    P.responsive(chart, function (w) { width = w; paint(); });
    paint();
  });
})();
