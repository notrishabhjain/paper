/* Widgets for Station 02 (BERT): masked-word game, masking recipe, fine-tuning heads. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h;

  /* Illustrative predictions written to mimic a masked language model. */
  var SENTENCES = [
    { words: ["The", "customer", "was", "angry", "because", "the", "delivery", "was", "late", "again", "."],
      preds: {
        3: { both: [["angry", 41], ["upset", 27], ["frustrated", 14], ["unhappy", 8], ["furious", 5]], left: [["happy", 12], ["not", 9], ["very", 8], ["satisfied", 6], ["angry", 5]] },
        6: { both: [["delivery", 38], ["package", 22], ["order", 17], ["shipment", 12], ["driver", 4]], left: [["product", 14], ["price", 9], ["service", 8], ["staff", 6], ["food", 5]] },
        8: { both: [["late", 62], ["delayed", 18], ["wrong", 7], ["missing", 5], ["slow", 3]], left: [["late", 21], ["delayed", 12], ["cancelled", 10], ["damaged", 9], ["fine", 6]] }
      } },
    { words: ["She", "opened", "a", "bank", "account", "to", "deposit", "her", "salary", "."],
      preds: {
        3: { both: [["bank", 71], ["savings", 12], ["new", 5], ["checking", 4], ["joint", 2]], left: [["new", 18], ["door", 11], ["window", 9], ["box", 7], ["store", 6]] },
        6: { both: [["deposit", 55], ["receive", 14], ["save", 9], ["transfer", 8], ["get", 5]], left: [["save", 15], ["pay", 12], ["get", 10], ["receive", 8], ["deposit", 7]] },
        8: { both: [["salary", 33], ["money", 21], ["paycheck", 17], ["check", 10], ["savings", 6]], left: [["money", 26], ["savings", 14], ["salary", 11], ["check", 9], ["cash", 8]] }
      } },
    { words: ["He", "sat", "on", "the", "river", "bank", "and", "watched", "the", "boats", "."],
      preds: {
        4: { both: [["river", 52], ["grassy", 8], ["muddy", 6], ["sandy", 5], ["steep", 3]], left: [["floor", 15], ["couch", 12], ["bench", 10], ["edge", 6], ["grass", 5]] },
        5: { both: [["bank", 58], ["edge", 12], ["shore", 9], ["side", 7], ["banks", 3]], left: [["bank", 24], ["bed", 11], ["side", 10], ["edge", 9], ["water", 6]] },
        9: { both: [["boats", 46], ["water", 15], ["ducks", 9], ["birds", 8], ["sunset", 6]], left: [["game", 13], ["news", 11], ["movie", 9], ["sunset", 8], ["boats", 4]] }
      } }
  ];

  P.widget("mlm", function (root) {
    var si = 0, masked = 3, ctx = "both";
    var sentSeg = P.seg(SENTENCES.map(function (st, i) { return { value: i, label: "Sentence " + (i + 1) }; }), si, function (v) {
      si = v; masked = parseInt(Object.keys(SENTENCES[v].preds)[0], 10); paint();
    }, "Sentence");
    var ctxSeg = P.seg([{ value: "both", label: "BERT · sees both sides" }, { value: "left", label: "Left-to-right · sees only the left" }], ctx,
      function (v) { ctx = v; paint(); }, "Context");
    var row = h("div", { class: "word-row" });
    var bars = h("div", { class: "bars", "aria-live": "polite" });
    var note = h("p", { class: "small" });
    root.appendChild(h("div", { class: "controls" },
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Sentence" }), sentSeg),
      h("div", { class: "control" }, h("span", { class: "lbl", text: "What the model may read" }), ctxSeg)));
    root.appendChild(h("p", { class: "kbd-hint", text: "Click an underlined word to hide it behind [MASK]." }));
    root.appendChild(row);
    root.appendChild(bars);
    root.appendChild(note);
    root.appendChild(h("p", { class: "fig-note", text: "Teaching model: predictions are hand-written to mimic how a masked language model behaves. Try it with real BERT in Lab step 1." }));
    function paint() {
      var st = SENTENCES[si];
      P.clear(row);
      st.words.forEach(function (w, i) {
        var can = !!st.preds[i];
        var b = h("button", { type: "button", class: "word" + (i === masked ? " masked" : ""), text: i === masked ? "[MASK]" : w, disabled: !can && i !== masked });
        if (can && i !== masked) b.style.textDecoration = "underline";
        if (i !== masked) {
          if (ctx === "left" && i > masked) b.classList.add("hidden-ctx");
          else b.classList.add("visible-ctx");
        }
        if (!can) b.style.cursor = "default";
        b.addEventListener("click", function () { if (can) { masked = i; paint(); } });
        row.appendChild(b);
      });
      var preds = st.preds[masked][ctx];
      var truth = st.words[masked];
      P.clear(bars);
      bars.appendChild(h("div", { class: "small", style: { fontWeight: "600" }, text: "Model's top guesses for [MASK]" }));
      preds.forEach(function (p) {
        bars.appendChild(h("div", { class: "bar-row" },
          h("span", { class: "bl", text: p[0] + (p[0] === truth ? " ✓" : "") }),
          h("span", { class: "bar-track" }, h("span", { class: "bar-fill", style: { width: p[1] / 75 * 100 + "%", display: "block" } })),
          h("span", { class: "bv", text: p[1] + "%" })));
      });
      var rank = preds.map(function (p) { return p[0]; }).indexOf(truth);
      note.textContent = ctx === "both"
        ? "Reading both sides, the right word is the top guess with " + preds[0][1] + "% confidence. Words after the gap carry clues."
        : rank === -1 ? "Reading only the left side, the true word \"" + truth + "\" is not even in the top five. The clue was to the right."
          : "Reading only the left side, \"" + truth + "\" falls to " + preds[rank][1] + "%. The model has to guess from half the clues.";
    }
    paint();
  });

  /* ---------------- The 15% / 80-10-10 masking recipe (real procedure, random each click) ---------------- */
  P.widget("maskrecipe", function (root) {
    var text = "Product managers turn customer problems into clear requirements so engineering teams can build the right features at the right time and measure whether users actually benefit .";
    var words = text.split(" ");
    var vocab = ["banana", "river", "quickly", "table", "seven", "blue", "music", "planet"];
    var out = h("div", { class: "word-row", "aria-live": "polite" });
    var stats = P.readout([
      { key: "picked", label: "Tokens picked (15%)" },
      { key: "mask", label: "→ [MASK] (80%)" },
      { key: "rand", label: "→ random word (10%)" },
      { key: "keep", label: "→ unchanged (10%)" }
    ]);
    var btn = h("button", { type: "button", class: "btn primary", text: "Make a new training example" });
    btn.addEventListener("click", paint);
    root.appendChild(h("div", { class: "row" }, btn));
    root.appendChild(out);
    root.appendChild(P.legend([
      { label: "replaced by [MASK]", color: "var(--ink)" },
      { label: "swapped for a random word", color: "var(--c2)" },
      { label: "picked but left unchanged", color: "var(--c3)" }
    ]));
    root.appendChild(stats);
    function paint() {
      P.clear(out);
      var c = { picked: 0, mask: 0, rand: 0, keep: 0 };
      words.forEach(function (w) {
        var el = h("span", { class: "word", style: { cursor: "default" }, text: w });
        if (Math.random() < 0.15) {
          c.picked++;
          var r = Math.random();
          if (r < 0.8) { c.mask++; el.className = "word masked"; el.textContent = "[MASK]"; el.title = "was: " + w; }
          else if (r < 0.9) { c.rand++; el.textContent = vocab[Math.floor(Math.random() * vocab.length)]; el.style.borderColor = "var(--c2)"; el.style.boxShadow = "inset 0 0 0 2px var(--c2)"; el.title = "was: " + w; }
          else { c.keep++; el.style.borderColor = "var(--c3)"; el.style.boxShadow = "inset 0 0 0 2px var(--c3)"; el.title = "picked, kept as is"; }
        }
        out.appendChild(el);
      });
      stats.update("picked", String(c.picked), "of " + words.length + " tokens");
      stats.update("mask", String(c.mask));
      stats.update("rand", String(c.rand));
      stats.update("keep", String(c.keep));
    }
    paint();
  });

  /* ---------------- One pre-trained body, many task heads ---------------- */
  var TASKS = {
    cls: { name: "Classify a sentence", input: ["[CLS]", "The", "app", "keeps", "crashing", "[SEP]"], out: "Read the [CLS] vector → label: Bug report (94%)", ex: "Sentiment, spam, ticket routing, intent detection", focus: [0] },
    pair: { name: "Compare two sentences", input: ["[CLS]", "How", "do", "I", "reset", "my", "password", "?", "[SEP]", "Steps", "to", "change", "login", "[SEP]"], out: "Read the [CLS] vector → Same meaning: yes (88%)", ex: "Duplicate ticket detection, FAQ matching, search relevance", focus: [0] },
    ner: { name: "Tag each word", input: ["[CLS]", "Priya", "joined", "Acme", "in", "Pune", "[SEP]"], out: "Read every word's vector → Priya: PERSON · Acme: ORG · Pune: PLACE", ex: "Extracting names, products, dates from documents", focus: [1, 3, 5] },
    qa: { name: "Find an answer span", input: ["[CLS]", "When", "is", "launch", "?", "[SEP]", "Launch", "moves", "to", "March", "12", "[SEP]"], out: "Predict start and end positions → answer: \"March 12\"", ex: "Extractive question answering over manuals or policies", focus: [9, 10] }
  };
  P.widget("finetune", function (root) {
    var task = "cls";
    var segEl = P.seg(Object.keys(TASKS).map(function (k) { return { value: k, label: TASKS[k].name }; }), task, function (v) { task = v; paint(); }, "Task");
    var body = h("div", { style: { display: "grid", gap: "0.75rem" } });
    root.appendChild(h("div", { class: "scroll-x" }, segEl));
    root.appendChild(body);
    function paint() {
      var t = TASKS[task];
      P.clear(body);
      var toks = h("div", { class: "tok-out" });
      t.input.forEach(function (w, i) {
        var special = w.charAt(0) === "[";
        var el = h("span", { class: "tok", text: w });
        if (special) el.style.background = P.mix("var(--c7)", 22, "var(--surface)");
        if (t.focus.indexOf(i) >= 0) el.style.boxShadow = "inset 0 0 0 2px var(--c2)";
        toks.appendChild(el);
      });
      body.appendChild(h("div", { class: "small muted", text: "1 · Input, formatted the BERT way" }));
      body.appendChild(toks);
      body.appendChild(h("div", { class: "small muted", text: "2 · The same pre-trained BERT body (12 layers, 110M parameters) reads it" }));
      body.appendChild(h("div", { class: "meter", style: { height: "10px" } }, h("i", { style: { width: "100%", background: "var(--c2)" } })));
      body.appendChild(h("div", { class: "small muted", text: "3 · A tiny new output layer, trained on a few thousand labeled examples, reads the highlighted vectors" }));
      body.appendChild(h("div", { class: "callout" }, h("span", { class: "callout-k", text: "Output" }), h("p", { text: t.out }), h("p", { class: "small muted", text: "Real uses: " + t.ex })));
    }
    paint();
  });
})();
