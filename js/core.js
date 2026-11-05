/* Paper Trail core: namespace, DOM helpers, storage, formatting, tooltips. */
(function () {
  "use strict";
  var P = (window.Portal = window.Portal || {});
  P.papers = P.papers || [];
  P.glossary = P.glossary || [];
  P.widgets = P.widgets || {};

  /* ---------- Stages of the LLM lifecycle (each paper is tagged with one) ---------- */
  P.stages = {
    foundations: { name: "Foundations", color: "var(--st-foundations)" },
    architecture: { name: "Architecture", color: "var(--st-architecture)" },
    pretrain: { name: "Pre-training", color: "var(--st-pretrain)" },
    scale: { name: "Scaling", color: "var(--st-scale)" },
    align: { name: "Alignment", color: "var(--st-align)" },
    adapt: { name: "Adaptation", color: "var(--st-adapt)" },
    efficiency: { name: "Efficiency", color: "var(--st-efficiency)" }
  };

  /* ---------- Registration ---------- */
  P.addPaper = function (paper) { P.papers.push(paper); };
  P.addTerms = function (terms) { Array.prototype.push.apply(P.glossary, terms); };
  P.widget = function (name, fn) { P.widgets[name] = fn; };
  P.paper = function (id) {
    for (var i = 0; i < P.papers.length; i++) if (P.papers[i].id === id) return P.papers[i];
    return null;
  };
  P.term = function (id) {
    for (var i = 0; i < P.glossary.length; i++) if (P.glossary[i].id === id) return P.glossary[i];
    return null;
  };
  P.sortedPapers = function () {
    return P.papers.slice().sort(function (a, b) { return a.num - b.num; });
  };

  /* ---------- DOM ---------- */
  function applyAttrs(node, attrs, isSvg) {
    if (!attrs) return;
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") node.setAttribute("class", v);
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "style" && typeof v === "object") {
        Object.keys(v).forEach(function (s) {
          if (s.indexOf("--") === 0) node.style.setProperty(s, v[s]);
          else node.style[s] = v[s];
        });
      } else if (k.indexOf("on") === 0 && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (!isSvg && (k === "value" || k === "checked" || k === "disabled" || k === "hidden")) node[k] = v;
      else node.setAttribute(k, v === true ? "" : v);
    });
  }
  function append(node, children) {
    children.forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) append(node, c);
      else if (typeof c === "string" || typeof c === "number") node.appendChild(document.createTextNode(String(c)));
      else node.appendChild(c);
    });
  }
  P.h = function (tag, attrs) {
    var node = document.createElement(tag);
    applyAttrs(node, attrs, false);
    append(node, Array.prototype.slice.call(arguments, 2));
    return node;
  };
  var SVGNS = "http://www.w3.org/2000/svg";
  P.s = function (tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    applyAttrs(node, attrs, true);
    append(node, Array.prototype.slice.call(arguments, 2));
    return node;
  };
  P.clear = function (node) { while (node.firstChild) node.removeChild(node.firstChild); return node; };

  /* Rich text: our own authored HTML strings, with [[term-id]] or [[term-id|label]] turned into
     highlighted glossary terms. Content here is authored in this repo, never user input. */
  P.rich = function (str) {
    if (!str) return "";
    return String(str).replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, function (_, id, label) {
      var t = P.term(id);
      var text = label || (t ? t.term : id);
      return '<button type="button" class="term" data-term="' + id + '">' + text + "</button>";
    });
  };
  P.richEl = function (tag, attrs, str) {
    var node = P.h(tag, attrs);
    node.innerHTML = P.rich(str);
    return node;
  };

  /* ---------- Storage (per-viewer convenience only; always optional) ---------- */
  var PREFIX = "papertrail:";
  var memory = {};
  P.store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(PREFIX + key);
        if (raw !== null) return JSON.parse(raw);
      } catch (e) { /* storage unavailable */ }
      return key in memory ? memory[key] : fallback;
    },
    set: function (key, value) {
      memory[key] = value;
      try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    clearAll: function () {
      memory = {};
      try {
        var keys = [];
        for (var i = 0; i < window.localStorage.length; i++) {
          var k = window.localStorage.key(i);
          if (k && k.indexOf(PREFIX) === 0 && k !== PREFIX + "theme") keys.push(k);
        }
        keys.forEach(function (k) { window.localStorage.removeItem(k); });
      } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Progress ---------- */
  P.checklistItems = [
    { id: "read", label: "Read the 60-second version and the key concepts" },
    { id: "play", label: "Played with every interactive figure on this page" },
    { id: "paper", label: "Skimmed the original paper with the reading guide" },
    { id: "lab1", label: "Step 1 · Reproduced the core result, even partially" },
    { id: "lab2", label: "Step 2 · Ran it on my own dataset" },
    { id: "lab3", label: "Step 3 · Compared 2–3 baselines" },
    { id: "lab4", label: "Step 4 · Wrote down what failed and why" },
    { id: "quiz", label: "Answered every self-check question" }
  ];
  P.progress = {
    get: function (paperId) { return P.store.get("progress:" + paperId, {}); },
    set: function (paperId, itemId, val) {
      var p = P.progress.get(paperId);
      p[itemId] = !!val;
      P.store.set("progress:" + paperId, p);
      document.dispatchEvent(new CustomEvent("progress-change"));
    },
    pct: function (paperId) {
      var p = P.progress.get(paperId);
      var done = P.checklistItems.filter(function (i) { return p[i.id]; }).length;
      return done / P.checklistItems.length;
    }
  };

  /* ---------- Formatting ---------- */
  P.fmt = {
    num: function (n, digits) {
      return Number(n).toLocaleString("en-US", { maximumFractionDigits: digits === undefined ? 0 : digits });
    },
    compact: function (n, digits) {
      var d = digits === undefined ? 1 : digits;
      var abs = Math.abs(n);
      var units = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]];
      for (var i = 0; i < units.length; i++) {
        if (abs >= units[i][0]) {
          var v = n / units[i][0];
          return (v >= 100 ? v.toFixed(0) : v.toFixed(d).replace(/\.0+$/, "")) + units[i][1];
        }
      }
      return abs < 10 && abs % 1 ? n.toFixed(d) : String(Math.round(n));
    },
    sci: function (n) {
      if (n === 0) return "0";
      var e = Math.floor(Math.log10(Math.abs(n)));
      var m = n / Math.pow(10, e);
      return m.toFixed(1) + "×10^" + e;
    },
    sciHTML: function (n) {
      if (n === 0) return "0";
      var e = Math.floor(Math.log10(Math.abs(n)));
      var m = n / Math.pow(10, e);
      return m.toFixed(1) + "×10<sup>" + e + "</sup>";
    },
    bytes: function (b) {
      var units = [[1e12, "TB"], [1e9, "GB"], [1e6, "MB"], [1e3, "KB"]];
      for (var i = 0; i < units.length; i++) {
        if (b >= units[i][0]) {
          var v = b / units[i][0];
          return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + " " + units[i][1];
        }
      }
      return Math.round(b) + " B";
    },
    money: function (n) {
      if (n >= 1e6) return "$" + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
      if (n >= 1e3) return "$" + (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "K";
      return "$" + n.toFixed(n < 10 ? 2 : 0);
    },
    duration: function (hours) {
      if (hours < 1) return Math.max(1, Math.round(hours * 60)) + " min";
      if (hours < 48) return hours.toFixed(hours < 10 ? 1 : 0) + " h";
      var days = hours / 24;
      if (days < 120) return days.toFixed(days < 10 ? 1 : 0) + " days";
      return (days / 365).toFixed(1) + " years";
    }
  };

  /* ---------- Clipboard ---------- */
  P.copy = function (text, btn, fallbackEl) {
    var done = function () {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = old; }, 1400);
    };
    var fallback = function () {
      if (fallbackEl) {
        var range = document.createRange();
        range.selectNodeContents(fallbackEl);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        P.toast("Text selected. Press Ctrl+C or ⌘C to copy.");
      } else {
        P.toast("Copy is blocked here. Select the text and copy it manually.");
      }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else fallback();
    } catch (e) { fallback(); }
  };

  /* ---------- Toast ---------- */
  var toastTimer;
  P.toast = function (msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = P.h("div", { class: "toast", role: "status" }); document.body.appendChild(t); }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  };

  /* ---------- Chart tooltip ---------- */
  var tipEl;
  P.tip = {
    show: function (evt, value, label) {
      if (!tipEl) { tipEl = P.h("div", { class: "tip", role: "tooltip" }); document.body.appendChild(tipEl); }
      P.clear(tipEl);
      tipEl.appendChild(P.h("strong", { text: value }));
      if (label) tipEl.appendChild(P.h("span", { text: label }));
      tipEl.hidden = false;
      var x, y;
      if (evt && evt.clientX !== undefined && (evt.type.indexOf("pointer") === 0 || evt.type.indexOf("mouse") === 0)) {
        x = evt.clientX; y = evt.clientY;
      } else {
        var r = evt.target.getBoundingClientRect();
        x = r.left + r.width / 2; y = r.top;
      }
      var w = tipEl.offsetWidth, hgt = tipEl.offsetHeight;
      var left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 12));
      var top = y - hgt - 12;
      if (top < 8) top = y + 16;
      tipEl.style.left = left + "px";
      tipEl.style.top = top + "px";
    },
    hide: function () { if (tipEl) tipEl.hidden = true; }
  };
  /* Bind tooltip handlers to an SVG/HTML mark. */
  P.bindTip = function (node, valueFn, labelFn) {
    node.setAttribute("tabindex", "0");
    var show = function (e) {
      P.tip.show(e, typeof valueFn === "function" ? valueFn() : valueFn, typeof labelFn === "function" ? labelFn() : labelFn);
    };
    node.addEventListener("pointermove", show);
    node.addEventListener("focus", show);
    node.addEventListener("pointerleave", P.tip.hide);
    node.addEventListener("blur", P.tip.hide);
  };

  /* ---------- Small UI builders shared by widgets ---------- */
  P.slider = function (opts) {
    var id = opts.id;
    var out = P.h("output", { for: id, text: opts.format ? opts.format(opts.value) : String(opts.value) });
    var input = P.h("input", { type: "range", id: id, min: opts.min, max: opts.max, step: opts.step || 1, value: opts.value });
    input.addEventListener("input", function () {
      var v = parseFloat(input.value);
      out.textContent = opts.format ? opts.format(v) : String(v);
      if (opts.onInput) opts.onInput(v);
    });
    var wrap = P.h("div", { class: "control" }, P.h("label", { for: id }, P.h("span", { text: opts.label }), out), input);
    wrap.input = input;
    wrap.output = out;
    wrap.set = function (v) {
      input.value = v;
      out.textContent = opts.format ? opts.format(v) : String(v);
    };
    return wrap;
  };
  P.seg = function (options, current, onChange, label) {
    var wrap = P.h("div", { class: "seg", role: "group", "aria-label": label || "Options" });
    var buttons = options.map(function (o) {
      var b = P.h("button", { type: "button", "aria-pressed": String(o.value === current), text: o.label });
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        onChange(o.value);
      });
      wrap.appendChild(b);
      return b;
    });
    return wrap;
  };
  P.legend = function (items) {
    return P.h("div", { class: "legend" }, items.map(function (it) {
      return P.h("span", null, P.h("i", { class: it.line ? "line" : "", style: { background: it.color } }), it.label);
    }));
  };
  P.readout = function (items) {
    var wrap = P.h("div", { class: "readout" });
    var cells = {};
    items.forEach(function (it) {
      var v = P.h("span", { class: "v" });
      var s = P.h("span", { class: "s" });
      wrap.appendChild(P.h("div", null, P.h("span", { class: "k", text: it.label }), v, s));
      cells[it.key] = { v: v, s: s };
    });
    wrap.update = function (key, value, sub, asHTML) {
      if (!cells[key]) return;
      if (asHTML) cells[key].v.innerHTML = value; else cells[key].v.textContent = value;
      cells[key].s.textContent = sub || "";
    };
    return wrap;
  };

  /* ---------- Chart helpers ---------- */
  P.scaleLin = function (d0, d1, r0, r1) {
    var f = function (v) { return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0); };
    f.invert = function (px) { return d0 + ((px - r0) / (r1 - r0)) * (d1 - d0); };
    return f;
  };
  P.scaleLog = function (d0, d1, r0, r1) {
    var l0 = Math.log10(d0), l1 = Math.log10(d1);
    var f = function (v) { return r0 + ((Math.log10(v) - l0) / (l1 - l0)) * (r1 - r0); };
    f.invert = function (px) { return Math.pow(10, l0 + ((px - r0) / (r1 - r0)) * (l1 - l0)); };
    return f;
  };
  /* Calls draw(width) now and whenever the container's width changes, so SVG text stays 12px. */
  P.responsive = function (container, draw) {
    var last = 0;
    var run = function () {
      var w = Math.floor(container.clientWidth);
      if (w && Math.abs(w - last) > 1) { last = w; draw(w); }
    };
    if (window.ResizeObserver) new ResizeObserver(run).observe(container);
    else window.addEventListener("resize", run);
    setTimeout(run, 0);
  };
  /* color-mix helper so heatmaps follow the theme tokens */
  P.mix = function (colorVar, pct, baseVar) {
    return "color-mix(in oklab, " + colorVar + " " + Math.max(0, Math.min(100, pct)).toFixed(1) + "%, " + (baseVar || "var(--chart-surface)") + ")";
  };

  /* Math helpers */
  P.softmax = function (arr, temp) {
    var t = temp || 1;
    var m = Math.max.apply(null, arr.map(function (v) { return v / t; }));
    var ex = arr.map(function (v) { return Math.exp(v / t - m); });
    var sum = ex.reduce(function (a, b) { return a + b; }, 0);
    return ex.map(function (v) { return v / sum; });
  };
  P.niceLogTicks = function (min, max) {
    var ticks = [];
    for (var e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++) {
      var v = Math.pow(10, e);
      if (v >= min * 0.999 && v <= max * 1.001) ticks.push(v);
    }
    return ticks;
  };
})();
