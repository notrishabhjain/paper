/* Paper Trail app: hash router + page renderers. Routes are plain #names. */
(function () {
  "use strict";
  var P = window.Portal;
  var h = P.h;

  var PROMPT_PREAMBLE =
    "You are my ML engineer. I am a product manager learning AI. I can read code but I do not write Python, so:\n" +
    "- Work in ONE Google Colab notebook (free T4 GPU unless I say otherwise).\n" +
    "- Before any code, give me a short plan (5–8 bullets) and wait for my OK.\n" +
    "- Put a plain-English markdown cell above every code cell: what it does and why.\n" +
    "- Keep every run under 20 minutes. Print progress, then a short summary table at the end.\n" +
    "- Fix random seeds so results are repeatable. Save charts as images.\n" +
    "- When something fails, explain the error in one paragraph a non-engineer can follow, then fix it.\n\n" +
    "TASK\n";

  var EXPERIMENT_CARD =
    "EXPERIMENT CARD\n" +
    "Paper / station: \n" +
    "Date: \n" +
    "Question I am answering: \n" +
    "Hypothesis (what I expect and why): \n" +
    "Dataset (source, size, how I split train/val/test): \n" +
    "Model + key settings (size, steps, learning rate, batch size): \n" +
    "Compute used (GPU type, minutes, cost): \n" +
    "Baselines compared: \n" +
    "Metric(s) and why they fit the question: \n" +
    "Result (numbers + one chart): \n" +
    "What surprised me: \n" +
    "What I would try next: \n" +
    "Decision this informs (as a PM): \n";

  var FAILURE_ENTRY =
    "FAILURE LOG ENTRY\n" +
    "What I tried: \n" +
    "What I expected: \n" +
    "What happened instead (error text, numbers, or a sample output): \n" +
    "Category: setup / data / training / evaluation / my misunderstanding\n" +
    "Root cause (my best explanation, then the assistant's): \n" +
    "Fix or workaround: \n" +
    "How I would catch this earlier next time: \n" +
    "Cost of the failure (time, money, compute): \n";

  /* ---------- Routing ---------- */
  var main, rail, currentName = "home";
  function route() {
    var hash = (location.hash || "").replace(/^#/, "");
    var name = hash || "home";
    P.tip.hide();
    closePopover();
    if (rail) rail.classList.remove("open");
    P.clear(main);
    var page;
    var paper = P.paper(name);
    if (paper) page = renderPaper(paper);
    else if (name === "method") page = renderMethod();
    else if (name === "toolkit") page = renderToolkit();
    else if (name === "glossary") page = renderGlossary();
    else if (name.indexOf("term-") === 0) page = renderGlossary(name.slice(5));
    else if (name === "profile") page = renderProfile();
    else { page = renderHome(); name = "home"; }
    main.appendChild(page);
    main.appendChild(footer());
    currentName = name;
    updateNav(name);
    if (name.indexOf("term-") !== 0) window.scrollTo(0, 0);
    document.title = (paper ? paper.short + " · " : name !== "home" ? cap(name) + " · " : "") + "Paper Trail";
    P.store.set("lastRoute", name);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function updateNav(name) {
    var current = name.indexOf("term-") === 0 ? "glossary" : name;
    document.querySelectorAll("[data-route]").forEach(function (a) {
      if (a.getAttribute("data-route") === current) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Rail ---------- */
  function renderRail() {
    P.clear(rail);
    rail.appendChild(h("div", { class: "line-label", text: "The route" }));
    var ol = h("ol", { class: "line" });
    P.sortedPapers().forEach(function (p) {
      var a = h("a", {
        class: "station",
        href: "#" + p.id,
        "data-route": p.id,
        style: { "--stage": P.stages[p.stage].color, "--p": P.progress.pct(p.id).toFixed(2) }
      },
        h("span", { class: "dot", "aria-hidden": "true" }),
        h("span", { class: "station-text" },
          h("span", { class: "station-num", text: pad(p.num) + " · " + p.year }),
          h("span", { class: "station-name", text: p.short })
        )
      );
      ol.appendChild(h("li", null, a));
    });
    rail.appendChild(ol);
    rail.appendChild(h("nav", { class: "rail-extra", "aria-label": "More" },
      h("a", { href: "#home", "data-route": "home", text: "Overview" }),
      h("a", { href: "#method", "data-route": "method", text: "Study method" }),
      h("a", { href: "#toolkit", "data-route": "toolkit", text: "PM toolkit" }),
      h("a", { href: "#glossary", "data-route": "glossary", text: "Glossary" }),
      h("a", { href: "#profile", "data-route": "profile", text: "About you" })
    ));
    updateNav(currentName);
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- Shared bits ---------- */
  function section(title, idx, children, intro) {
    return h("section", { class: "section" },
      h("h2", null, idx ? h("span", { class: "idx", text: idx }) : null, title),
      intro ? P.richEl("p", { class: "section-intro" }, intro) : null,
      children
    );
  }
  function footer() {
    return h("footer", { class: "footer" },
      h("span", { text: "Paper Trail · a study route through nine AI papers" }),
      h("span", { text: "Interactive figures are teaching models. Where numbers come from a paper, the paper is named." })
    );
  }
  function overallPct() {
    var ps = P.sortedPapers();
    var sum = ps.reduce(function (a, p) { return a + P.progress.pct(p.id); }, 0);
    return ps.length ? sum / ps.length : 0;
  }

  /* ---------- Home ---------- */
  function renderHome() {
    var page = h("div", { class: "page" });
    var papers = P.sortedPapers();
    var labs = papers.length * 4;
    page.appendChild(h("header", { class: "hero" },
      h("div", { class: "eyebrow" }, h("span", { text: "A study route for product people" }), h("span", { text: "2017 → 2023" })),
      h("h1", { html: "Nine papers built modern AI. Learn them <em>one station at a time.</em>" }),
      P.richEl("p", { class: "dek" }, "Each station explains one paper in plain language, lets you poke at the core idea with interactive figures, teaches the vocabulary you will hear in meetings, and ends with a four-step lab you run through an AI coding assistant. No Python required, only curiosity and a free Google account."),
      h("div", { class: "hero-stats" },
        h("span", null, h("b", { text: String(papers.length) }), "stations"),
        h("span", null, h("b", { text: String(P.glossary.length) }), "glossary terms"),
        h("span", null, h("b", { text: String(labs) }), "lab steps"),
        h("span", null, h("b", { text: Math.round(overallPct() * 100) + "%" }), "of your route done")
      )
    ));

    var route = h("ol", { class: "route" });
    papers.forEach(function (p) {
      var pct = P.progress.pct(p.id);
      route.appendChild(h("li", null,
        h("a", { class: "route-stop" + (pct === 1 ? " done" : ""), href: "#" + p.id, style: { "--stage": P.stages[p.stage].color } },
          h("span", { class: "rdot", text: pad(p.num) }),
          h("span", { class: "route-body" },
            h("span", { class: "route-title" },
              h("h3", { text: p.title }),
              h("span", { class: "yr", text: p.year + " · " + p.org })
            ),
            h("p", { text: p.oneLiner }),
            h("span", { class: "stage-chip", style: { "--stage": P.stages[p.stage].color }, text: P.stages[p.stage].name })
          ),
          h("span", { class: "route-side" },
            h("span", { class: "pct", text: Math.round(pct * 100) + "% done" }),
            h("span", { class: "meter" }, h("i", { style: { width: pct * 100 + "%" } }))
          )
        )
      ));
    });
    page.appendChild(section("The route", null, route,
      "Go in order. Each paper answers a question the previous one raised, and the labs reuse what you built at earlier stations."));

    page.appendChild(section("Where each paper fits", null, figure({
      w: "lifecycle",
      k: "Map",
      title: "The life of a large language model",
      text: "Every LLM product you will manage moves through these stages. Click a stage to see what happens there, which papers explain it, and the decisions a PM owns."
    }, "home")));

    page.appendChild(section("How every station works", null, h("div", { class: "loop-grid" },
      loopCard("A", "Understand", "A 60-second summary, the problem the authors faced, and why a PM should care."),
      loopCard("B", "Play", "Interactive figures that let you change one thing and watch what happens."),
      loopCard("C", "Speak", "Key concepts, highlighted vocabulary, and the numbers people quote in meetings."),
      loopCard("D", "Build", "Four lab steps: reproduce, use your own data, compare baselines, log failures.")
    ), "Highlighted words like [[attention]] or [[parameter]] open a definition when you click them. Your progress and notes are saved in this browser only."));

    page.appendChild(section("After the nine", null, nextPapersTable(),
      "Once you finish the route, these papers fill the biggest remaining gaps for someone designing AI products."));
    return page;
  }
  function loopCard(n, title, text) {
    return h("div", { class: "loop-card" }, h("span", { class: "ln", text: n }), h("h3", { text: title }), h("p", { text: text }));
  }
  function nextPapersTable() {
    var rows = [
      ["Scaling Laws for Neural Language Models", "Kaplan et al., 2020", "The first scaling laws. Read it to understand what Chinchilla corrected."],
      ["Retrieval-Augmented Generation (RAG)", "Lewis et al., 2020", "How models look things up in your documents. Most enterprise LLM products are RAG systems."],
      ["Chain-of-Thought Prompting", "Wei et al., 2022", "Asking a model to reason step by step. The root of today's reasoning models."],
      ["Direct Preference Optimization (DPO)", "Rafailov et al., 2023", "A simpler replacement for the RLHF step in InstructGPT. Widely used for fine-tuning."],
      ["QLoRA", "Dettmers et al., 2023", "LoRA on a 4-bit quantized model, so a 65B model fine-tunes on a single GPU."],
      ["Mixtral / Mixture of Experts", "Jiang et al., 2024", "Models that only use part of their parameters per token. Key to cost per token today."],
      ["Constitutional AI", "Bai et al., 2022", "Using written principles and AI feedback instead of only human labels for alignment."]
    ];
    return h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
      h("thead", null, h("tr", null, h("th", { text: "Paper" }), h("th", { text: "Who, when" }), h("th", { text: "Why it matters to you" }))),
      h("tbody", null, rows.map(function (r) { return h("tr", null, r.map(function (c) { return h("td", { text: c }); })); }))
    ));
  }

  /* ---------- Figure (widget host) ---------- */
  function figure(f, paperId) {
    var body = h("div", { class: "fig-body" });
    var fig = h("figure", { class: "figure", style: { margin: "0" } },
      h("div", { class: "figure-head" },
        f.k ? h("span", { class: "fig-k", text: f.k }) : null,
        h("h3", { text: f.title }),
        f.text ? P.richEl("p", null, f.text) : null
      ),
      body,
      f.takeaway ? P.richEl("p", { class: "fig-takeaway" }, "<b>Takeaway:</b> " + f.takeaway) : null
    );
    var fn = P.widgets[f.w];
    if (fn) {
      try { fn(body, f.opts || {}, paperId); }
      catch (e) {
        body.appendChild(h("p", { class: "fig-note", text: "This figure failed to load: " + e.message }));
        if (window.console) console.error(e);
      }
    } else body.appendChild(h("p", { class: "fig-note", text: "Figure coming soon." }));
    return fig;
  }

  /* ---------- Paper page ---------- */
  function paperLink(p) { return p.url || (p.arxiv ? "https://arxiv.org/abs/" + p.arxiv : null); }
  function renderPaper(p) {
    var page = h("article", { class: "page" });
    var link = paperLink(p);
    var stage = P.stages[p.stage];
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" },
        h("span", { text: "Station " + pad(p.num) }),
        p.arxiv ? h("span", { text: "arXiv:" + p.arxiv }) : null,
        h("span", { text: String(p.year) }),
        h("span", { class: "stage-chip", style: { "--stage": stage.color }, text: stage.name })
      ),
      h("h1", { text: p.title }),
      P.richEl("p", { class: "dek" }, p.oneLiner),
      h("div", { class: "meta-row" },
        h("span", null, h("strong", { text: p.authors }), " · " + p.org),
        h("span", null, "Study time ", h("strong", { text: "≈ " + p.hours + " hours" })),
        link ? h("a", { href: link, target: "_blank", rel: "noopener", text: "Open the paper ↗" }) : null
      )
    ));

    // 1. The 60-second version
    var storyEl = h("div", { class: "story" },
      storyCell("1", "The problem", p.story.problem),
      storyCell("2", "The idea", p.story.idea),
      storyCell("3", "The result", p.story.result)
    );
    var why = h("div", { class: "callout" }, h("span", { class: "callout-k", text: "Why a PM should care" }), P.richEl("p", null, p.whyPM));
    var sixty = [storyEl, why];
    if (p.analogy) sixty.splice(1, 0, h("div", { class: "prose" }, P.richEl("p", null, "<b>Analogy.</b> " + p.analogy)));
    page.appendChild(section("The 60-second version", "01", sixty));

    // 2. See it
    var nFig = 0;
    page.appendChild(section("See it work", "02", p.figures.map(function (f) {
      nFig++;
      f.k = f.k || "Figure " + p.num + "." + nFig;
      return figure(f, p.id);
    }), "Change the controls and watch the result. Figures marked as teaching models use made-up numbers to show the mechanism; the rest use numbers from the paper."));

    // 3. Key concepts
    var concepts = h("div", { class: "concepts" }, p.concepts.map(function (c, i) {
      return h("details", { class: "concept", open: i === 0 ? true : null },
        h("summary", null,
          h("span", null, h("span", { class: "c-name", text: c.name }), P.richEl("span", { class: "c-plain" }, c.plain)),
          h("span", { class: "chev", "aria-hidden": "true", text: "›" })
        ),
        h("div", { class: "concept-body" },
          h("div", null, h("span", { class: "k", text: "How it works" }), P.richEl("p", null, c.how)),
          h("div", null, h("span", { class: "k", text: "Where you meet it in products" }), P.richEl("p", null, c.product))
        )
      );
    }));
    var vocab = h("div", { class: "chips" }, p.terms.map(function (id) {
      var t = P.term(id);
      return h("button", { type: "button", class: "chip", "data-term": id, text: t ? t.term : id });
    }));
    page.appendChild(section("Key concepts", "03", [concepts, h("h3", { text: "Vocabulary from this paper" }), vocab]));

    // 4. Read the code
    if (p.code) page.appendChild(section("Read the code", "04", codeAnnot(p.code),
      "You do not need to write this. Read it next to the plain-English notes so the code your AI assistant writes stops looking foreign."));

    // 5. Numbers
    page.appendChild(section("Numbers worth remembering", "05", h("div", { class: "numbers" }, p.numbers.map(function (n) {
      return h("div", { class: "number" }, h("span", { class: "n", text: n.value }), P.richEl("span", { class: "l" }, n.label));
    }))));

    // 6. Lab
    page.appendChild(section("Practice: the four-step lab", "06", renderLab(p), p.lab.summary));

    // 7. System design takeaways
    page.appendChild(section("System design takeaways", "07", h("div", { class: "pm-grid" }, p.pm.map(function (x) {
      return h("div", { class: "pm-card" }, P.richEl("span", { class: "q" }, x.q), P.richEl("p", null, x.a));
    })), "Decisions this paper helps you make, and questions it helps you ask your team."));

    // 8. Reading guide
    page.appendChild(section("Read the paper", "08", h("div", { class: "prose" },
      h("ol", null, p.reading.map(function (r) { return P.richEl("li", null, r); })),
      link ? h("p", null, h("a", { class: "btn", href: link, target: "_blank", rel: "noopener", text: (p.arxiv ? "arXiv:" + p.arxiv : "Read the paper (PDF)") + " ↗" })) : null
    ), "A guided first pass. Read the parts below, skip the rest, and come back to the details after the lab."));

    // 9. Quiz
    page.appendChild(section("Self-check", "09", renderQuiz(p)));

    // 10. Progress + notes
    page.appendChild(section("Your progress and notes", "10", [renderChecklist(p), renderNotes(p)]));

    if (p.next) page.appendChild(h("div", { class: "callout", style: { marginTop: "2.5rem" } },
      h("span", { class: "callout-k", text: "What this unlocked" }), P.richEl("p", null, p.next)));

    // Pager
    var list = P.sortedPapers();
    var i = list.indexOf(p);
    var pager = h("nav", { class: "pager", "aria-label": "Stations" });
    if (i > 0) pager.appendChild(h("a", { href: "#" + list[i - 1].id }, h("span", { class: "pk", text: "← Station " + pad(list[i - 1].num) }), h("span", { class: "pn", text: list[i - 1].short })));
    if (i < list.length - 1) pager.appendChild(h("a", { class: "next", href: "#" + list[i + 1].id }, h("span", { class: "pk", text: "Station " + pad(list[i + 1].num) + " →" }), h("span", { class: "pn", text: list[i + 1].short })));
    page.appendChild(pager);
    return page;
  }
  function storyCell(n, k, text) {
    return h("div", null, h("span", { class: "story-k" }, h("b", { text: n }), k), P.richEl("p", null, text));
  }

  function codeAnnot(code) {
    var plain = code.lines.map(function (l) { return l[0]; }).join("\n");
    var copyBtn = h("button", { type: "button", class: "btn small", text: "Copy code" });
    copyBtn.addEventListener("click", function () { P.copy(plain, copyBtn); });
    return h("div", { class: "code-annot" },
      h("div", { class: "code-annot-head" }, h("span", null, h("b", { text: code.title }), code.lang ? h("span", { class: "muted", text: " · " + code.lang }) : null), copyBtn),
      h("div", { class: "code-rows" }, code.lines.map(function (l) {
        return h("div", { class: "code-row" }, h("pre", null, h("code", { text: l[0] || " ", style: { background: "none", padding: "0" } })), P.richEl("div", { class: "why" }, l[1] || ""));
      }))
    );
  }

  function renderLab(p) {
    var lab = p.lab;
    var wrap = h("div", { class: "figure" });
    wrap.appendChild(h("div", { class: "lab-meta" },
      h("span", null, "Time ", h("b", { text: lab.time })),
      h("span", null, "Compute ", h("b", { text: lab.compute })),
      h("span", null, "Tools ", h("b", { text: lab.tools }))
    ));
    var tabs = h("div", { class: "tabs", role: "tablist", "aria-label": "Lab steps" });
    var panels = h("div");
    var saved = P.store.get("labtab:" + p.id, 0);
    var buttons = [];
    lab.steps.forEach(function (st, i) {
      var tabId = "tab-" + p.id + "-" + i, panelId = "panel-" + p.id + "-" + i;
      var b = h("button", { type: "button", role: "tab", id: tabId, "aria-controls": panelId, "aria-selected": String(i === saved) },
        h("span", { class: "tn", text: String(i + 1) }), st.name);
      var panel = labPanel(st, p, i);
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
      panel.hidden = i !== saved;
      b.addEventListener("click", function () {
        buttons.forEach(function (x, j) { x.setAttribute("aria-selected", String(j === i)); panels.children[j].hidden = j !== i; });
        P.store.set("labtab:" + p.id, i);
      });
      buttons.push(b);
      tabs.appendChild(b);
      panels.appendChild(panel);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(panels);
    return wrap;
  }
  function labPanel(st, p, i) {
    var panel = h("div", { class: "tab-panel" });
    panel.appendChild(P.richEl("p", { class: "goal" }, st.goal));
    if (st.do) panel.appendChild(h("div", null, h("h4", { text: "Do this" }), h("ol", { class: "steps" }, st.do.map(function (d) { return P.richEl("li", null, d); }))));
    if (st.ideas) panel.appendChild(h("div", null, h("h4", { text: "Dataset ideas from your world" }), h("ul", null, st.ideas.map(function (d) { return P.richEl("li", null, d); }))));
    if (st.table) {
      var head = st.table[0], rows = st.table.slice(1);
      panel.appendChild(h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
        h("thead", null, h("tr", null, head.map(function (c) { return h("th", { text: c }); }))),
        h("tbody", null, rows.map(function (r) { return h("tr", null, r.map(function (c) { return P.richEl("td", null, c); })); }))
      )));
    }
    if (st.prompt) panel.appendChild(promptBox("Prompt for your AI coding assistant", PROMPT_PREAMBLE + st.prompt));
    if (st.observe) panel.appendChild(h("div", null, h("h4", { text: "What to look for" }), h("ul", null, st.observe.map(function (d) { return P.richEl("li", null, d); }))));
    if (st.done) panel.appendChild(h("div", { class: "callout" }, h("span", { class: "callout-k", text: "Done when" }), P.richEl("p", null, st.done)));
    return panel;
  }
  function promptBox(title, text) {
    var pre = h("pre", { text: text });
    var btn = h("button", { type: "button", class: "btn small primary", text: "Copy prompt" });
    btn.addEventListener("click", function () { P.copy(text, btn, pre); });
    return h("div", { class: "prompt-box" }, h("div", { class: "prompt-head" }, h("span", { text: title }), btn), pre);
  }

  function renderQuiz(p) {
    var wrap = h("div", { class: "quiz" });
    var answered = P.store.get("quiz:" + p.id, {});
    var letters = "ABCD";
    p.quiz.forEach(function (q, qi) {
      var why = P.richEl("p", { class: "q-why" }, q.why);
      why.hidden = answered[qi] === undefined;
      var opts = h("div", { class: "q-opts" });
      var btns = q.options.map(function (o, oi) {
        var b = h("button", { type: "button", class: "q-opt" }, h("span", { class: "ql", text: letters[oi] }), P.richEl("span", null, o));
        b.addEventListener("click", function () {
          answered[qi] = oi;
          P.store.set("quiz:" + p.id, answered);
          paint();
          if (Object.keys(answered).length === p.quiz.length) {
            P.progress.set(p.id, "quiz", true);
          }
        });
        opts.appendChild(b);
        return b;
      });
      function paint() {
        var picked = answered[qi];
        btns.forEach(function (b, oi) {
          b.classList.remove("correct", "wrong");
          if (picked === undefined) { b.disabled = false; return; }
          b.disabled = true;
          if (oi === q.answer) b.classList.add("correct");
          else if (oi === picked) b.classList.add("wrong");
        });
        why.hidden = picked === undefined;
      }
      paint();
      wrap.appendChild(h("div", { class: "q-item" }, P.richEl("p", { class: "qq" }, (qi + 1) + ". " + q.q), opts, why));
    });
    var reset = h("button", { type: "button", class: "btn small", text: "Reset answers" });
    reset.addEventListener("click", function () { P.store.set("quiz:" + p.id, {}); route(); });
    wrap.appendChild(h("div", { class: "row" }, reset));
    return wrap;
  }

  function renderChecklist(p) {
    var wrap = h("div", { class: "checklist" });
    var meter = h("i");
    var label = h("span", { class: "small muted" });
    function paintMeter() {
      var pct = P.progress.pct(p.id);
      meter.style.width = pct * 100 + "%";
      label.textContent = Math.round(pct * 100) + "% of this station done";
    }
    var state = P.progress.get(p.id);
    P.checklistItems.forEach(function (item) {
      var id = "chk-" + p.id + "-" + item.id;
      var input = h("input", { type: "checkbox", id: id, checked: !!state[item.id] });
      var row = h("label", { class: "check" + (state[item.id] ? " done" : ""), for: id }, input, h("span", { text: item.label }));
      input.addEventListener("change", function () {
        P.progress.set(p.id, item.id, input.checked);
        row.classList.toggle("done", input.checked);
        paintMeter();
      });
      wrap.appendChild(row);
    });
    paintMeter();
    return h("div", { style: { display: "grid", gap: "0.6rem" } }, h("div", { class: "meter" }, meter), label, wrap);
  }

  function renderNotes(p) {
    var id = "notes-" + p.id;
    var ta = h("textarea", { id: id, rows: "8", placeholder: "Your notes, open questions, and failure log for this station. Saved in this browser." });
    ta.value = P.store.get("notes:" + p.id, "");
    var status = h("span", { class: "small muted" });
    var timer;
    ta.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { P.store.set("notes:" + p.id, ta.value); status.textContent = "Saved in this browser"; }, 400);
    });
    var copyBtn = h("button", { type: "button", class: "btn small", text: "Copy notes" });
    copyBtn.addEventListener("click", function () { P.copy(ta.value, copyBtn, null); });
    var tplBtn = h("button", { type: "button", class: "btn small", text: "Insert failure-log template" });
    tplBtn.addEventListener("click", function () {
      ta.value = (ta.value ? ta.value + "\n\n" : "") + FAILURE_ENTRY;
      P.store.set("notes:" + p.id, ta.value);
      ta.focus();
    });
    var cardBtn = h("button", { type: "button", class: "btn small", text: "Insert experiment card" });
    cardBtn.addEventListener("click", function () {
      ta.value = (ta.value ? ta.value + "\n\n" : "") + EXPERIMENT_CARD.replace("Paper / station: ", "Paper / station: " + p.short);
      P.store.set("notes:" + p.id, ta.value);
      ta.focus();
    });
    return h("div", { style: { display: "grid", gap: "0.5rem", marginTop: "1rem" } },
      h("label", { for: id, class: "small", style: { fontWeight: "600" }, text: "Notes and failure log" }),
      ta,
      h("div", { class: "row" }, cardBtn, tplBtn, copyBtn, status)
    );
  }

  /* ---------- Method ---------- */
  function renderMethod() {
    var page = h("div", { class: "page" });
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: "How to study" })),
      h("h1", { text: "The study method" }),
      P.richEl("p", { class: "dek" }, "Reading a paper tells you what the authors claim. Running a small version of it tells you what is true, what is fragile, and what it costs. That second kind of knowledge is what lets a PM push back, estimate, and design.")
    ));

    page.appendChild(section("The four-step loop", "01", h("div", { class: "loop-grid" },
      methodCard("STEP 1", "Reproduce, even partially", "Rebuild the paper's core result at toy scale. You will not match the paper's numbers, and that is fine.", "Teaches you what is essential versus incidental, and how far a demo is from production."),
      methodCard("STEP 2", "Use your own dataset", "Swap the paper's benchmark for data from your world: tickets, PRDs, reviews, release notes.", "Benchmarks flatter models. Your data shows the real gaps, and data prep is where most AI projects slip."),
      methodCard("STEP 3", "Compare 2–3 baselines", "Put the fancy method next to something simple and something cheap, using the same data and metric.", "\"Is it better than a keyword rule?\" is the most valuable question an AI PM asks. Baselines answer it."),
      methodCard("STEP 4", "Document what failed and why", "Keep a failure log: what you tried, what broke, the root cause, and the fix.", "Your failure log becomes your risk register. It is also the best interview material you will have.")
    ), "Every station's lab follows the same four steps, so by the end you will have run this loop nine times."));

    page.appendChild(section("Working with an AI coding assistant", "02", [
      h("div", { class: "two-col" },
        h("div", { class: "pm-card" },
          h("span", { class: "q", text: "You are the PM. The assistant is the engineer." }),
          h("ul", { class: "small" },
            h("li", { text: "Write the task like a ticket: goal, data, constraints, acceptance criteria." }),
            h("li", { text: "Ask for a plan before code. Approve or change it." }),
            h("li", { text: "Ask it to explain each cell in plain English. Ask why, not only what." }),
            h("li", { text: "Make it state assumptions: data size, run time, cost." }),
            h("li", { text: "Keep runs short. Ten 2-minute runs teach more than one 20-minute run." })
          )
        ),
        h("div", { class: "pm-card" },
          h("span", { class: "q", text: "Questions that keep the assistant honest" }),
          h("ul", { class: "small" },
            h("li", { text: "How do I know this number is right? What would a bug look like?" }),
            h("li", { text: "Is the test set ever seen during training?" }),
            h("li", { text: "What is the simplest baseline, and how does it score?" }),
            h("li", { text: "Which settings did you choose, and which did the paper use?" }),
            h("li", { text: "What would change if we had 10× the data? 10× the budget?" })
          )
        )
      ),
      promptBox("The standing instructions added to every lab prompt", PROMPT_PREAMBLE + "(the station's task goes here)")
    ], "Each lab gives you a prompt to paste into Claude, Claude Code, or a similar assistant. The prompt starts with the standing instructions below."));

    page.appendChild(section("Your toolbelt", "03", h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
      h("thead", null, h("tr", null, h("th", { text: "Tool" }), h("th", { text: "What it is for" }), h("th", { text: "Cost" }))),
      h("tbody", null, [
        ["Google Colab", "A notebook in the browser with a free GPU (usually a T4). Every lab runs here.", "Free; Pro is about $10/month for faster GPUs"],
        ["Hugging Face account", "Download models and datasets with one line of code. Some models (like Llama) need you to accept a license.", "Free"],
        ["Kaggle Notebooks", "Backup free GPU, about 30 GPU-hours per week.", "Free"],
        ["Claude or Claude Code", "Your engineer. Paste the lab prompt, review the plan, run the code.", "Your existing plan"],
        ["GitHub", "Keep your notebooks, experiment cards, and failure logs in one repo. This portal lives there too.", "Free"],
        ["Weights & Biases (optional)", "Tracks training runs and charts automatically. Useful from the Chinchilla station onward.", "Free for personal use"]
      ].map(function (r) { return h("tr", null, r.map(function (c) { return h("td", { text: c }); })); }))
    ))));

    page.appendChild(section("Reading a paper in three passes", "04", h("div", { class: "loop-grid", style: { gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" } },
      methodCard("PASS 1 · 15 MIN", "Shape", "Title, abstract, figures, headings, conclusion. Can you say what problem it solves and what the result is?", "Each station's 60-second version is a pass 1 for you."),
      methodCard("PASS 2 · 1 HOUR", "Story", "Read the intro and method. Skip proofs and dense math. Mark every term you cannot define.", "Use the station's reading guide and glossary."),
      methodCard("PASS 3 · AFTER THE LAB", "Detail", "Re-read the experiments section now that you have run one. The tables will make sense.", "Compare their setup with yours in your experiment card.")
    ), "Adapted from S. Keshav's \"How to Read a Paper\". Nobody reads a paper once, front to back."));

    page.appendChild(section("Plan your schedule", "05", figure({ w: "schedule", k: "Planner", title: "How long will the route take?", text: "Move the slider to the hours you can give each week. Estimates include reading, figures, and all four lab steps." }, "method")));

    page.appendChild(section("Templates", "06", h("div", { class: "two-col" },
      promptBox("Experiment card (one per lab run)", EXPERIMENT_CARD),
      promptBox("Failure log entry (one per failure)", FAILURE_ENTRY)
    ), "The same templates are one click away in the notes box on every station."));
    return page;
  }
  function methodCard(n, title, text, why) {
    return h("div", { class: "loop-card" }, h("span", { class: "ln", text: n }), h("h3", { text: title }), h("p", { text: text }), why ? h("p", { style: { color: "var(--ink)" } }, h("b", { text: "Why: " }), why) : null);
  }

  /* ---------- Toolkit ---------- */
  function renderToolkit() {
    var page = h("div", { class: "page" });
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: "For design reviews and planning" })),
      h("h1", { text: "The AI PM toolkit" }),
      P.richEl("p", { class: "dek" }, "The papers turned into tools you can use at work: a map of the LLM lifecycle, a helper for choosing between prompting, retrieval, and fine-tuning, back-of-envelope calculators for training and serving, and the questions to ask your ML team.")
    ));
    page.appendChild(section("Choose an approach", "01", figure({ w: "decide", k: "Decision helper", title: "Prompt, retrieve, fine-tune, or train?", text: "Answer a few questions about your use case. The helper recommends the cheapest approach likely to work and names the station that explains it." }, "toolkit")));
    page.appendChild(section("Estimate training cost", "02", figure({ w: "traincost", k: "Calculator", title: "What would it cost to train this model?", text: "Uses the rule of thumb from the scaling-law papers: training compute ≈ 6 × parameters × tokens. Change the GPU, its utilization, and the hourly price to match a real quote." }, "toolkit")));
    page.appendChild(section("Estimate serving memory", "03", figure({ w: "servemem", k: "Calculator", title: "How many GPUs does it take to serve?", text: "Memory for the weights plus the [[kv-cache|KV cache]], which grows with context length and the number of users served at once." }, "toolkit")));
    page.appendChild(section("The lifecycle map", "04", figure({ w: "lifecycle", k: "Map", title: "The life of a large language model", text: "Click a stage to see decisions, roles, and costs." }, "toolkit")));
    page.appendChild(section("Questions to ask your ML team", "05", h("div", { class: "pm-grid" }, [
      ["Problem framing", ["What is the simplest baseline, and how does it score?", "What does a wrong answer cost the user? The business?", "Which errors are acceptable, and which are not?"]],
      ["Data", ["Where does the training and evaluation data come from? Who labeled it?", "How do we know the test set did not leak into training?", "What is our data refresh plan when the world changes?"]],
      ["Model choice", ["Why this model size? What did the smaller one score?", "Open weights or API? What happens to latency, cost, and privacy for each?", "What is the cost per 1,000 requests at our expected volume?"]],
      ["Evaluation", ["Which offline metric predicts the outcome we care about?", "Do we run human or blind side-by-side evaluations?", "How will we detect regressions after launch?"]],
      ["Safety and risk", ["How does it fail on adversarial or out-of-scope input?", "What does it do when it does not know?", "Who reviews outputs in high-stakes flows?"]],
      ["Operations", ["What are p50 and p95 latency at peak load?", "How long is the context window, and what happens when we exceed it?", "How do we roll back a model or an adapter?"]]
    ].map(function (g) {
      return h("div", { class: "pm-card" }, h("span", { class: "q", text: g[0] }), h("ul", { class: "small" }, g[1].map(function (q) { return h("li", { text: q }); })));
    }))));
    return page;
  }

  /* ---------- Glossary ---------- */
  function renderGlossary(focusId) {
    var page = h("div", { class: "page" });
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: P.glossary.length + " terms" })),
      h("h1", { text: "Glossary" }),
      P.richEl("p", { class: "dek" }, "Every term used on the route, in plain language with an analogy, and the station where it first matters.")
    ));
    var cats = ["All"];
    P.glossary.forEach(function (t) { if (cats.indexOf(t.cat) < 0) cats.push(t.cat); });
    var query = "", cat = "All";
    var search = h("input", { type: "search", id: "gloss-search", placeholder: "Search terms, e.g. token, LoRA, perplexity", "aria-label": "Search the glossary" });
    var list = h("div", { class: "gloss-list" });
    var count = h("span", { class: "small muted" });
    var segEl = P.seg(cats.map(function (c) { return { value: c, label: c }; }), "All", function (v) { cat = v; paint(); }, "Filter by category");
    page.appendChild(h("div", { class: "gloss-tools" }, search, h("div", { class: "scroll-x" }, segEl), count));
    page.appendChild(list);
    var sorted = P.glossary.slice().sort(function (a, b) { return a.term.toLowerCase().localeCompare(b.term.toLowerCase()); });
    function paint() {
      P.clear(list);
      var q = query.trim().toLowerCase();
      var shown = sorted.filter(function (t) {
        if (cat !== "All" && t.cat !== cat) return false;
        if (!q) return true;
        return (t.term + " " + t.def + " " + (t.aka || "")).toLowerCase().indexOf(q) >= 0;
      });
      count.textContent = shown.length + " of " + sorted.length + " terms";
      if (!shown.length) list.appendChild(h("p", { class: "empty", text: "No terms match \"" + query + "\". Try a shorter word." }));
      shown.forEach(function (t) {
        var paper = t.paper ? P.paper(t.paper) : null;
        list.appendChild(h("div", { class: "gloss-item", id: "g-" + t.id },
          h("div", { class: "gloss-term" }, h("b", { text: t.term }), h("span", { class: "cat", text: t.cat + (t.aka ? " · " + t.aka : "") })),
          h("div", { class: "gloss-def" },
            P.richEl("p", null, t.def),
            t.analogy ? h("p", { class: "an", text: t.analogy }) : null,
            paper ? h("p", { class: "seen" }, "First matters at ", h("a", { href: "#" + paper.id, text: "Station " + pad(paper.num) + " · " + paper.short })) : null
          )
        ));
      });
    }
    search.addEventListener("input", function () { query = search.value; paint(); });
    paint();
    if (focusId) {
      setTimeout(function () {
        var el = document.getElementById("g-" + focusId);
        if (el) {
          el.classList.add("flash");
          el.scrollIntoView({ block: "center" });
        }
      }, 30);
    }
    return page;
  }

  /* ---------- About you ---------- */
  var PROFILE_QUESTIONS = [
    ["Goal", "What role are you aiming for in 12 months? (AI product manager, AI program/project manager, technical PM on an ML platform team, founder, something else?)"],
    ["Goal", "What would make this course a success for you? (Pass interviews, lead an AI project at your current company, evaluate vendors, build a prototype?)"],
    ["Background", "Which languages and stacks did you use in your five years of development? Any data, SQL, or analytics work?"],
    ["Background", "How comfortable are you with high-school math: logarithms, exponents, basic probability, matrices? (1 = rusty, 5 = fine)"],
    ["Background", "Have you shipped or managed anything with ML or AI in it? What was your role?"],
    ["Domain", "Which industry or domain do you work in, and what data does it have (tickets, documents, transactions, logs, images)?"],
    ["Domain", "Is there a real AI use case at work you would like to design as your capstone?"],
    ["Time", "How many hours a week can you study, and do you prefer short daily sessions or long weekend blocks?"],
    ["Resources", "What compute can you use: free Colab only, a paid Colab or cloud budget, or a work GPU? Any budget per month?"],
    ["Resources", "Which AI coding assistants do you have access to (Claude Code, Cursor, Copilot, ChatGPT)?"],
    ["Learning style", "How do you learn best: visuals, reading, building, discussion, teaching others?"],
    ["Learning style", "Do you want deeper math (with derivations), or intuition plus code only?"],
    ["Output", "Do you want a public portfolio (GitHub, blog posts, LinkedIn write-ups) out of each station?"],
    ["Output", "Would short certification-style checkpoints or mock interview questions help you?"]
  ];
  function renderProfile() {
    var page = h("div", { class: "page" });
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: "Tailor the route" })),
      h("h1", { text: "About you" }),
      P.richEl("p", { class: "dek" }, "Answer what you can. Then copy all answers and paste them back to Claude to get labs, examples, and pacing tuned to your background and goals. Answers stay in this browser.")
    ));
    var saved = P.store.get("profile", {});
    var list = h("div", { style: { display: "grid", gap: "1rem" } });
    PROFILE_QUESTIONS.forEach(function (q, i) {
      var id = "pq-" + i;
      var ta = h("textarea", { id: id, rows: "3" });
      ta.value = saved[i] || "";
      ta.addEventListener("input", function () { saved[i] = ta.value; P.store.set("profile", saved); });
      list.appendChild(h("div", { class: "q-item" },
        h("span", { class: "eyebrow", text: q[0] }),
        h("label", { for: id, class: "qq", text: (i + 1) + ". " + q[1] }),
        ta
      ));
    });
    var copyBtn = h("button", { type: "button", class: "btn primary", text: "Copy all answers" });
    copyBtn.addEventListener("click", function () {
      var text = "My answers for tailoring Paper Trail:\n\n" + PROFILE_QUESTIONS.map(function (q, i) {
        return (i + 1) + ". " + q[1] + "\n→ " + (saved[i] || "(skipped)");
      }).join("\n\n");
      P.copy(text, copyBtn, null);
    });
    page.appendChild(list);
    page.appendChild(h("div", { class: "row", style: { marginTop: "1.25rem" } }, copyBtn));

    // Reset progress, with an in-page confirmation step
    var confirmRow = h("div", { class: "confirm-row" });
    confirmRow.hidden = true;
    var resetBtn = h("button", { type: "button", class: "btn", text: "Reset all progress, notes, and answers" });
    var yes = h("button", { type: "button", class: "btn primary", text: "Yes, erase everything" });
    var no = h("button", { type: "button", class: "btn", text: "Keep my data" });
    confirmRow.appendChild(h("span", { text: "This erases progress, quiz answers, notes, and these answers in this browser." }));
    confirmRow.appendChild(yes);
    confirmRow.appendChild(no);
    resetBtn.addEventListener("click", function () { confirmRow.hidden = false; resetBtn.hidden = true; });
    no.addEventListener("click", function () { confirmRow.hidden = true; resetBtn.hidden = false; });
    yes.addEventListener("click", function () { P.store.clearAll(); renderRail(); route(); P.toast("Progress erased"); });
    page.appendChild(section("Start over", null, h("div", { style: { display: "grid", gap: "0.75rem", justifyItems: "start" } }, resetBtn, confirmRow)));
    return page;
  }

  /* ---------- Term popover ---------- */
  var pop;
  function closePopover() { if (pop) { pop.remove(); pop = null; } }
  function openPopover(target, id) {
    closePopover();
    var t = P.term(id);
    if (!t) return;
    var paper = t.paper ? P.paper(t.paper) : null;
    pop = h("div", { class: "popover", role: "dialog", "aria-label": t.term },
      h("span", { class: "pop-cat", text: t.cat }),
      h("h4", { text: t.term }),
      P.richEl("p", null, t.def),
      t.analogy ? h("p", { class: "pop-analogy", text: t.analogy }) : null,
      h("div", { class: "pop-actions" },
        h("a", { href: "#term-" + t.id, text: "Open in glossary" }),
        paper ? h("a", { href: "#" + paper.id, class: "small", text: "Station " + pad(paper.num) }) : null
      )
    );
    document.body.appendChild(pop);
    var r = target.getBoundingClientRect();
    var w = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.min(window.innerWidth - w - 16, Math.max(16, r.left));
    var top = r.bottom + 8;
    if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 8);
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-term]") : null;
    if (t) { e.preventDefault(); openPopover(t, t.getAttribute("data-term")); return; }
    if (pop && !pop.contains(e.target)) closePopover();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePopover(); });
  window.addEventListener("scroll", function () { if (pop) closePopover(); }, { passive: true });

  /* ---------- Theme ---------- */
  function initTheme() {
    var saved = P.store.get("theme", null);
    if (saved === "dark" || saved === "light") document.documentElement.setAttribute("data-theme", saved);
    var btn = document.getElementById("theme-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      var isDark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      P.store.set("theme", next);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    main = document.getElementById("main");
    rail = document.getElementById("rail");
    initTheme();
    renderRail();
    var menu = document.getElementById("menu-btn");
    if (menu) menu.addEventListener("click", function () {
      var open = rail.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("progress-change", renderRail);
    window.addEventListener("hashchange", function () { renderRail(); route(); });
    route();
  }
  P.routeRefresh = route;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
