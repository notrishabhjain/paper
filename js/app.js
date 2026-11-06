/* Paper Trail app: hash router + page renderers. Routes are plain #names. */
(function () {
  "use strict";
  var P = window.Portal;
  var h = P.h;

  /* Standing instructions for every lab prompt. Claude Code writes the notebook into your portfolio
     repository; you open it in Colab from GitHub and run it on the free GPU. */
  var PROMPT_PREAMBLE =
    "You are my ML engineer, working in my portfolio repository through Claude Code. I am an IT project manager learning AI. I know Node.js, Postgres, and MongoDB; I can read Python but do not write it. So:\n" +
    "- Write ONE Jupyter notebook at <folder>/lab-<step>.ipynb that runs top to bottom on the free Google Colab T4 GPU. I will open it in Colab from GitHub.\n" +
    "- Free tools only: the Colab free tier and open models and datasets from Hugging Face. No paid APIs or keys.\n" +
    "- Before writing code, give me a short plan (5–8 bullets) and wait for my OK.\n" +
    "- Put a plain-English markdown cell above every code cell: what it does and why. Explain any math in words.\n" +
    "- Keep every run under 20 minutes. Print progress, then a short summary table at the end.\n" +
    "- Fix random seeds so results repeat. Save charts as PNG files next to the notebook.\n" +
    "- When something fails, explain the error in one paragraph a non-engineer can follow, then fix it.\n" +
    "- Finish by adding the results table and three lessons learned to <folder>/README.md.\n\n" +
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
    "Decision this informs (as a project manager): \n";

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

  function stationFolder(p) { return "stations/" + pad(p.num) + "-" + p.id; }

  /* ---------- Routing ---------- */
  var main, rail, currentName = "home", labCtl = null;
  var TITLES = { start: "Start here", method: "Study method", toolkit: "Toolkit", glossary: "Glossary", profile: "About you", portfolio: "Portfolio", interviews: "Interviews" };
  function route() {
    var hash = (location.hash || "").replace(/^#/, "");
    var name = hash || "home";
    P.tip.hide();
    closePopover();
    if (rail) rail.classList.remove("open");
    P.clear(main);
    labCtl = null;
    var page;
    var paper = P.paper(name);
    if (paper) page = renderPaper(paper);
    else if (name === "method") page = renderMethod();
    else if (name === "toolkit") page = renderToolkit();
    else if (name === "glossary") page = renderGlossary();
    else if (name.indexOf("term-") === 0) page = renderGlossary(name.slice(5));
    else if (name === "profile") page = renderProfile();
    else if (name === "portfolio") page = renderPortfolio();
    else if (name === "interviews") page = renderInterviews();
    else if (name === "start") page = renderStart();
    else { page = renderHome(); name = "home"; }
    main.appendChild(page);
    main.appendChild(footer());
    currentName = name;
    updateNav(name);
    if (name.indexOf("term-") !== 0) window.scrollTo(0, 0);
    document.title = (paper ? paper.short + " · " : TITLES[name] ? TITLES[name] + " · " : "") + "Paper Trail";
    P.store.set("lastRoute", name);
    if (paper && P.pendingJump) {
      var j = P.pendingJump;
      P.pendingJump = null;
      setTimeout(function () { jumpTo(j.target, j.step); }, 60);
    }
  }
  /* Scroll to a section on the current page (hash links would change the route). */
  function jumpTo(target, step) {
    if (target === "sec-lab" && typeof step === "number" && labCtl) labCtl.select(step);
    var el = document.getElementById(target);
    if (el) el.scrollIntoView({ block: "start" });
  }

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
      h("a", { href: "#start", "data-route": "start", text: "Start here (25-minute story)" }),
      h("a", { href: "#home", "data-route": "home", text: "Overview and today's session" }),
      h("a", { href: "#method", "data-route": "method", text: "Study method" }),
      h("a", { href: "#toolkit", "data-route": "toolkit", text: "AI project toolkit" }),
      h("a", { href: "#portfolio", "data-route": "portfolio", text: "Portfolio and capstone" }),
      h("a", { href: "#interviews", "data-route": "interviews", text: "Interview practice" }),
      h("a", { href: "#glossary", "data-route": "glossary", text: "Glossary" }),
      h("a", { href: "#profile", "data-route": "profile", text: "About you" })
    ));
    updateNav(currentName);
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- Shared bits ---------- */
  function section(title, idx, children, intro, id) {
    return h("section", { class: "section", id: id || null },
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
    var ns = P.nextSession();
    return ns.total ? ns.done / ns.total : 0;
  }
  function tableEl(head, rows, rich) {
    return h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
      h("thead", null, h("tr", null, head.map(function (c) { return h("th", { text: c }); }))),
      h("tbody", null, rows.map(function (r) {
        return h("tr", null, r.map(function (c) { return typeof c === "string" ? (rich ? P.richEl("td", null, c) : h("td", { text: c })) : h("td", null, c); }));
      }))
    ));
  }

  /* ---------- Today's session ---------- */
  function nextSessionCard() {
    var ns = P.nextSession();
    var hours = P.store.get("hours-per-week", 5);
    if (!ns.next) {
      return h("section", { class: "today-card" },
        h("div", { class: "today-k" }, h("span", { text: "Route complete" })),
        h("h2", { text: "You have finished every session on the route." }),
        h("p", { class: "small muted", text: "Polish your portfolio, finish the capstone documents for your work project, and keep practicing interview questions." }),
        h("div", { class: "row" }, h("a", { class: "btn primary", href: "#portfolio", text: "Open the portfolio plan" }), h("a", { class: "btn", href: "#interviews", text: "Practice interviews" })));
    }
    var p = ns.next.paper, s = ns.next.session;
    var remaining = 0;
    P.sortedPapers().forEach(function (q) {
      var st = P.progress.get(q.id);
      P.sessionsFor(q).forEach(function (x) { if (!st[x.id]) remaining += x.min; });
    });
    var weeksLeft = Math.max(1, Math.ceil(remaining / (hours * 60)));
    var dest = s.route || p.id;
    var go = h("a", { class: "btn primary", href: "#" + dest, text: "Start this session" });
    go.addEventListener("click", function () {
      if (!s.route) P.pendingJump = { target: s.target, step: s.step };
      if (location.hash === "#" + dest) { route(); }
    });
    var done = h("button", { type: "button", class: "btn", text: "Mark as done" });
    done.addEventListener("click", function () { P.progress.set(p.id, s.id, true); route(); P.toast("Session marked as done"); });
    return h("section", { class: "today-card", "aria-label": "Today's session" },
      h("div", { class: "today-k" }, h("span", { text: "Today's session" }), h("span", { class: "mono", text: "≈ " + s.min + " min" })),
      h("h2", { text: s.label }),
      h("p", { class: "small muted", text: "Station " + pad(p.num) + " · " + p.short + " · session " + (ns.next.index + 1) + " of " + ns.next.count }),
      h("div", { class: "row" }, go, done),
      h("div", { class: "meter" }, h("i", { style: { width: (ns.done / ns.total) * 100 + "%" } })),
      h("p", { class: "small muted", text: ns.done + " of " + ns.total + " sessions done · about " + weeksLeft + " week" + (weeksLeft === 1 ? "" : "s") + " left at " + hours + " hours a week" })
    );
  }

  /* ---------- Home ---------- */
  function renderHome() {
    var page = h("div", { class: "page" });
    var papers = P.sortedPapers();
    var ns = P.nextSession();
    var interviewCount = (P.interviewGeneral || []).length + papers.reduce(function (a, p) { return a + (p.interview || []).length; }, 0);
    page.appendChild(h("header", { class: "hero" },
      h("div", { class: "eyebrow" }, h("span", { text: "For project and program managers new to AI" })),
      h("h1", { html: "Understand AI from the ground up, <em>one small step at a time.</em>" }),
      P.richEl("p", { class: "dek" }, "No AI background needed. Every station starts in plain English, with an everyday comparison and an example from project work. Only then does it bring in the real terms, and only after that do you try things hands-on. You study in short daily sessions, with free tools."),
      h("div", { class: "row" },
        h("a", { class: "btn primary", href: "#start", text: "Start here: a 25-minute story" }),
        h("a", { class: "btn", href: "#foundations", text: "Go to the first station" })),
      h("div", { class: "hero-stats" },
        h("span", null, h("b", { text: String(papers.length) }), "stations"),
        h("span", null, h("b", { text: String(ns.total) }), "sessions of ~45 min"),
        h("span", null, h("b", { text: String(interviewCount) }), "interview questions"),
        h("span", null, h("b", { text: Math.round(overallPct() * 100) + "%" }), "of your route done")
      )
    ));
    page.appendChild(nextSessionCard());

    var routeList = h("ol", { class: "route" });
    papers.forEach(function (p) {
      var pct = P.progress.pct(p.id);
      routeList.appendChild(h("li", null,
        h("a", { class: "route-stop" + (pct === 1 ? " done" : ""), href: "#" + p.id, style: { "--stage": P.stages[p.stage].color } },
          h("span", { class: "rdot", text: pad(p.num) }),
          h("span", { class: "route-body" },
            h("span", { class: "route-title" },
              h("h3", { text: p.plainTitle || p.title })
            ),
            h("p", { text: p.hook || p.oneLiner }),
            h("span", { class: "yr", text: p.arxiv || p.url ? "The paper: " + p.title + " (" + p.year + ")" : "A primer before the papers" }),
            h("span", { class: "stage-chip", style: { "--stage": P.stages[p.stage].color }, text: P.stages[p.stage].name + " · " + P.sessionsFor(p).length + " sessions" + (p.build ? " · builds " + p.build.feature.toLowerCase() : "") })
          ),
          h("span", { class: "route-side" },
            h("span", { class: "pct", text: Math.round(pct * 100) + "% done" }),
            h("span", { class: "meter" }, h("i", { style: { width: pct * 100 + "%" } }))
          )
        )
      ));
    });
    page.appendChild(section("The route", null, routeList,
      "Ten stations, in order. Each one builds on the one before, so nothing appears before you are ready for it."));

    page.appendChild(section("How every station works", null, h("div", { class: "loop-grid three" },
      loopCard("PART 1", "Get the idea", "Plain English first: what the paper did, an everyday comparison, an example from project work, and a few figures to play with. No jargon."),
      loopCard("PART 2", "Go deeper", "Now the real terms. Every new word is highlighted; click it for a one-line meaning. Then a guided look at the paper itself."),
      loopCard("PART 3", "Do it", "A hands-on lab on a free GPU, one feature for your portfolio app, project-plan rows, interview questions, and a short public write-up.")
    ), "Highlighted words like [[attention]] or [[parameter]] open a plain definition when you click them. Progress and notes are saved in this browser only."));

    page.appendChild(section("Where each paper fits", null, figure({
      w: "lifecycle",
      k: "Map",
      title: "The life of a large language model",
      text: "Every LLM project you manage moves through these stages. Click a stage to see what happens there, which papers explain it, and the decisions a project manager owns."
    }, "home")));

    page.appendChild(section("After the nine", null, nextPapersTable(),
      "Once you finish the route, these papers fill the biggest remaining gaps for someone leading AI projects."));
    return page;
  }
  function loopCard(n, title, text) {
    return h("div", { class: "loop-card" }, h("span", { class: "ln", text: n }), h("h3", { text: title }), h("p", { text: text }));
  }
  function nextPapersTable() {
    var rows = [
      ["Retrieval-Augmented Generation (RAG)", "Lewis et al., 2020", "How models look things up in your documents. Delivery Copilot is a RAG system; read this right after the route."],
      ["Scaling Laws for Neural Language Models", "Kaplan et al., 2020", "The first scaling laws. Read it to understand what Chinchilla corrected."],
      ["Chain-of-Thought Prompting", "Wei et al., 2022", "Asking a model to reason step by step. The root of today's reasoning models."],
      ["Direct Preference Optimization (DPO)", "Rafailov et al., 2023", "A simpler replacement for the RLHF steps in InstructGPT, and the method your Station 06 lab uses."],
      ["QLoRA", "Dettmers et al., 2023", "LoRA on a 4-bit quantized model, so large models fine-tune on a single GPU."],
      ["Mixtral / Mixture of Experts", "Jiang et al., 2024", "Models that use only part of their parameters per token. Key to cost per token today."],
      ["Constitutional AI", "Bai et al., 2022", "Using written principles and AI feedback instead of only human labels for alignment."]
    ];
    return tableEl(["Paper", "Who, when", "Why it matters to you"], rows);
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
    var sessions = P.sessionsFor(p);
    function minutesOf(kinds) { return sessions.filter(function (s) { return kinds.indexOf(s.kind) >= 0; }).reduce(function (a, s) { return a + s.min; }, 0); }
    function timeLabel(min) { return min >= 90 ? "about " + Math.round(min / 60 * 2) / 2 + " hours" : "about " + min + " minutes"; }

    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" },
        h("span", { text: "Station " + pad(p.num) }),
        h("span", { text: String(p.year) }),
        h("span", { class: "stage-chip", style: { "--stage": stage.color }, text: stage.name })
      ),
      h("h1", { text: p.plainTitle || p.title }),
      P.richEl("p", { class: "dek" }, p.hook || p.oneLiner),
      h("div", { class: "meta-row" },
        link ? h("span", null, "The paper: ", h("strong", { text: p.title }), " · " + p.authors + ", " + p.org) : h("span", null, h("strong", { text: "A primer" }), " before the papers"),
        h("span", null, h("strong", { text: sessions.length + " sessions" }), " · ≈ " + P.hoursFor(p) + " hours"),
        link ? h("a", { href: link, target: "_blank", rel: "noopener", text: "Open the paper ↗" }) : null
      )
    ));

    // Jump chips and this station's next session
    var jumps = [["Plain English", "sec-intro"], ["Figures", "sec-see"], ["The paper", "sec-sixty"], ["Concepts", "sec-concepts"], ["Lab", "sec-lab"], ["Build", "sec-build"], ["Project plan", "sec-plan"], ["Interview", "sec-interview"], ["Publish", "sec-publish"], ["Sessions", "sec-progress"]];
    page.appendChild(h("nav", { class: "jump", "aria-label": "On this page" }, jumps.map(function (j) {
      var b = h("button", { type: "button", class: "chip", text: j[0] });
      b.addEventListener("click", function () { jumpTo(j[1]); });
      return b;
    })));
    var state = P.progress.get(p.id);
    var nextHere = sessions.filter(function (s) { return !state[s.id]; })[0];
    if (nextHere) {
      var goBtn = nextHere.route ? h("a", { class: "btn small primary", href: "#" + nextHere.route, text: "Go to it" }) : h("button", { type: "button", class: "btn small primary", text: "Go to it" });
      if (!nextHere.route) goBtn.addEventListener("click", function () { jumpTo(nextHere.target, nextHere.step); });
      page.appendChild(h("div", { class: "today-inline" },
        h("span", { class: "today-k" }, h("span", { text: "Next session here" })),
        h("span", { class: "small", text: nextHere.label + " · ≈ " + nextHere.min + " min" }),
        goBtn));
    }

    var n = 0;
    function idx() { n++; return pad(n); }
    function part(num, title, desc, min) {
      return h("div", { class: "part" },
        h("span", { class: "part-k", text: "Part " + num + " of 3 · " + timeLabel(min) }),
        h("p", { class: "part-t", text: title }),
        P.richEl("p", { class: "part-d" }, desc));
    }

    /* ===== Part 1: Get the idea ===== */
    page.appendChild(part(1, "Get the idea", "Plain English, an everyday comparison, and a few figures to play with. No jargon yet.", minutesOf(["read", "play"])));
    var intro = [];
    if (p.bridge) intro.push(h("div", { class: "callout" }, h("span", { class: "callout-k", text: "Where you are" }), P.richEl("p", null, p.bridge)));
    if (p.explain) intro.push(h("div", { class: "prose explain" }, p.explain.map(function (t) { return P.richEl("p", null, t); })));
    var pair = [];
    if (p.everyday) pair.push(h("div", { class: "aside-card" }, h("span", { class: "mini-h", text: "Everyday comparison" }), h("h3", { text: p.everyday.title }), h("p", { text: p.everyday.text })));
    if (p.example) pair.push(h("div", { class: "aside-card" }, h("span", { class: "mini-h", text: "Example from project work" }), h("h3", { text: p.example.title }), h("p", { text: p.example.text })));
    if (pair.length) intro.push(h("div", { class: "two-col" }, pair));
    if (p.words) intro.push(h("div", { style: { display: "grid", gap: "0.6rem" } },
      h("h3", { text: "Words worth learning now" }),
      wordCards(p.words),
      h("p", { class: "small muted", text: "Only these few for now. Click any word for its full glossary entry." })));
    if (p.remember) intro.push(h("div", { class: "remember" }, h("span", { class: "mini-h", text: "If you remember only three things" }), h("ol", null, p.remember.map(function (r) { return P.richEl("li", null, r); }))));
    page.appendChild(section("In plain English", idx(), intro, null, "sec-intro"));

    var nFig = 0;
    page.appendChild(section("See it work", idx(), p.figures.map(function (f) {
      nFig++;
      f.k = f.k || "Figure " + p.num + "." + nFig;
      return figure(f, p.id);
    }), "Change one thing and watch what happens. If a figure feels too technical, read its takeaway line and move on; Part 2 explains the terms.", "sec-see"));

    /* ===== Part 2: Go deeper ===== */
    page.appendChild(part(2, "Go deeper", "Now with the real terms. Every new word is <span class=\"term-sample\">highlighted</span>: click it for a one-line meaning.", minutesOf(["concepts", "paper"])));
    var storyEl = h("div", { class: "story" },
      storyCell("1", "The problem", p.story.problem),
      storyCell("2", "The idea", p.story.idea),
      storyCell("3", "The result", p.story.result)
    );
    var why = h("div", { class: "callout" }, h("span", { class: "callout-k", text: "Why it matters for AI projects" }), P.richEl("p", null, p.whyPM));
    page.appendChild(section(link ? "The paper in 60 seconds" : "The ideas in 60 seconds", idx(), [P.richEl("p", { class: "section-intro" }, p.oneLiner), storyEl, why], null, "sec-sixty"));

    var concepts = h("div", { class: "concepts" }, p.concepts.map(function (c, i) {
      return h("details", { class: "concept", open: i === 0 ? true : null },
        h("summary", null,
          h("span", null, h("span", { class: "c-name", text: c.name }), P.richEl("span", { class: "c-plain" }, c.plain)),
          h("span", { class: "chev", "aria-hidden": "true", text: "›" })
        ),
        h("div", { class: "concept-body" },
          h("div", null, h("span", { class: "k", text: "How it works" }), P.richEl("p", null, c.how)),
          h("div", null, h("span", { class: "k", text: "Where you meet it in projects" }), P.richEl("p", null, c.product))
        )
      );
    }));
    var vocab = h("div", { class: "chips" }, p.terms.map(function (id) {
      var t = P.term(id);
      return h("button", { type: "button", class: "chip", "data-term": id, text: t ? t.term : id });
    }));
    page.appendChild(section("Key concepts", idx(), [concepts, h("h3", { text: "All the vocabulary from this paper" }), vocab],
      "Each concept opens with one plain sentence. Expand it for how it works and where you will meet it at work.", "sec-concepts"));

    if (p.code) page.appendChild(section("Read the code", idx(), codeAnnot(p.code),
      "You will never need to write this. Read the plain-English note beside each line, so the code Claude Code writes for you stops looking foreign.", "sec-code"));

    page.appendChild(section("Numbers worth remembering", idx(), h("div", { class: "numbers" }, p.numbers.map(function (x) {
      return h("div", { class: "number" }, h("span", { class: "n", text: x.value }), P.richEl("span", { class: "l" }, x.label));
    })), null, "sec-numbers"));

    page.appendChild(section("Read the paper", idx(), h("div", { class: "prose" },
      h("ol", null, p.reading.map(function (r) { return P.richEl("li", null, r); })),
      link ? h("p", null, h("a", { class: "btn", href: link, target: "_blank", rel: "noopener", text: (p.arxiv ? "arXiv:" + p.arxiv : "Read the paper (PDF)") + " ↗" })) : null
    ), "Optional on a first pass. Read only the parts listed, skip the math, and come back after the lab when the tables make more sense.", "sec-read"));

    /* ===== Part 3: Do it ===== */
    page.appendChild(part(3, "Do it", "Hands-on work and portfolio pieces. Claude Code writes the code from ready prompts; you run it, read the results, and write down what you learned.", minutesOf(["lab", "build", "quiz", "publish"])));
    page.appendChild(section("Practice: the four-step lab", idx(), renderLab(p),
      (p.labIntro ? p.labIntro + " " : "") + "Each step has a ready prompt: paste it into Claude Code in your portfolio repository, approve its plan, and run the notebook in Colab. Notebooks go into <code>" + stationFolder(p) + "/</code>.", "sec-lab"));
    if (p.build) page.appendChild(section("Build it in your stack", idx(), renderBuild(p),
      "One feature of Delivery Copilot, the Node.js app you grow into your capstone. Paste the prompt into Claude Code in your portfolio repository; everything runs free on your laptop. The <a href=\"#portfolio\">portfolio page</a> shows the whole plan.", "sec-build"));
    page.appendChild(section("Put it in your project plan", idx(), renderPlan(p),
      "Work items you can copy into a real AI project plan, with typical effort for a small team, followed by the decisions this paper helps you make.", "sec-plan"));
    page.appendChild(section("Self-check", idx(), renderQuiz(p), "Four quick questions. Wrong answers are fine; each one comes with an explanation.", "sec-quiz"));
    if (p.interview) page.appendChild(section("Interview practice", idx(), renderInterviewList(p.interview.map(function (q, i) { return { key: p.id + i, q: q.q, a: q.a }; })),
      "Questions an interviewer could ask an AI project manager about this paper's ideas. Answer out loud first, then open the guidance. <a href=\"#interviews\">Practice every question with a timer</a>.", "sec-interview"));
    page.appendChild(section("Publish it", idx(), renderPublish(p),
      "Turn this station into a portfolio piece: a results README in your repository and a short public post.", "sec-publish"));
    page.appendChild(section("Your sessions and notes", idx(), [renderChecklist(p), renderNotes(p)],
      "Tick a session when you finish it. The overview's “Today's session” card always points to the next one.", "sec-progress"));

    if (p.next) page.appendChild(h("div", { class: "callout", style: { marginTop: "2.5rem" } },
      h("span", { class: "callout-k", text: "Coming up next" }), P.richEl("p", null, p.next)));

    var list = P.sortedPapers();
    var i = list.indexOf(p);
    var pager = h("nav", { class: "pager", "aria-label": "Stations" });
    if (i > 0) pager.appendChild(h("a", { href: "#" + list[i - 1].id }, h("span", { class: "pk", text: "← Station " + pad(list[i - 1].num) }), h("span", { class: "pn", text: list[i - 1].plainTitle || list[i - 1].short })));
    if (i < list.length - 1) pager.appendChild(h("a", { class: "next", href: "#" + list[i + 1].id }, h("span", { class: "pk", text: "Station " + pad(list[i + 1].num) + " →" }), h("span", { class: "pn", text: list[i + 1].plainTitle || list[i + 1].short })));
    page.appendChild(pager);
    return page;
  }
  function wordCards(words) {
    return h("div", { class: "word-cards" }, words.map(function (w) {
      var t = P.term(w[0]);
      return h("div", { class: "word-card" },
        h("button", { type: "button", class: "term", "data-term": w[0], text: t ? t.term : w[0] }),
        h("span", { text: w[1] }));
    }));
  }

  /* ---------- Start here ---------- */
  function renderStart() {
    var page = h("div", { class: "page" });
    var story = P.startStory || [];
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: "Start here" }), h("span", { text: "About 25 minutes" })),
      h("h1", { text: "How AI works, in nine small steps" }),
      P.richEl("p", { class: "dek" }, "No jargon, no math, no code. Each step explains one idea with an everyday comparison, introduces at most three new words, and tells you which station goes deeper later. By the end you will have a map of the whole route.")
    ));
    page.appendChild(h("div", { class: "loop-grid three" },
      loopCard("YOU DON'T NEED", "Math", "The route uses intuition and pictures. Where a formula appears, it is explained in words next to it."),
      loopCard("YOU DON'T NEED", "Python", "Claude Code writes every line of code. You read plain-English notes and run notebooks with one click."),
      loopCard("YOU DON'T NEED", "To memorize terms", "New words are highlighted everywhere. Click one any time for a one-line meaning.")
    ));
    story.forEach(function (ch, i) {
      var body = [
        P.richEl("p", { class: "start-text" }, ch.text),
        h("div", { class: "aside-card" }, h("span", { class: "mini-h", text: "Everyday comparison" }), h("p", { text: ch.everyday }))
      ];
      if (ch.example) body.push(P.richEl("p", null, ch.example));
      if (ch.widget) body.push(figure({ w: ch.widget, opts: ch.opts, k: "Try it", title: i === 0 ? "Guess the next word" : i === 2 ? "Words on a map" : "Who is “it”?", text: i === 2 ? "Click a word to see its nearest neighbours on the map." : "" }, "start"));
      body.push(h("div", { style: { display: "grid", gap: "0.5rem" } }, h("span", { class: "mini-h", text: "New words in this step" }), wordCards(ch.words)));
      var laters = (ch.later || []).map(function (id) { var p = P.paper(id); return p ? h("a", { href: "#" + id, text: "Station " + pad(p.num) + " · " + (p.plainTitle || p.short) }) : null; }).filter(Boolean);
      if (laters.length) body.push(h("p", { class: "small muted" }, "Goes deeper at ", laters.reduce(function (acc, a, j) { if (j) acc.push(j === laters.length - 1 ? " and " : ", "); acc.push(a); return acc; }, []), "."));
      page.appendChild(h("section", { class: "section start-step", id: "step-" + (i + 1) },
        h("h2", null, h("span", { class: "idx", text: "Step " + (i + 1) + " of " + story.length }), ch.title), body));
    });

    var done = P.progress.get("foundations").start;
    var mark = h("button", { type: "button", class: "btn primary", text: done ? "Done. Go to Station 00" : "I've read it. Mark this session done" });
    mark.addEventListener("click", function () {
      P.progress.set("foundations", "start", true);
      location.hash = "#foundations";
    });
    page.appendChild(section("What happens next", null, [
      h("p", { class: "section-intro", text: "You now have the whole picture in rough form. The stations fill it in one piece at a time, always in the same order: plain English first, then the real terms, then hands-on work." }),
      tableEl(["Day", "Session", "Time"], [
        ["1", "This story", "25 min"],
        ["2", "Station 00 · plain-English intro", "30 min"],
        ["3", "Station 00 · play with the figures", "40 min"],
        ["4", "Station 00 · the real terms, gently", "35 min"],
        ["5", "Station 00 · reading the code notes", "40 min"],
        ["6", "Station 00 · lab step 1: set up free accounts and run your first notebook", "45 min"],
        ["7", "Rest, or catch up on a session you skipped", "—"]
      ]),
      h("div", { class: "row" }, mark, h("a", { class: "btn", href: "#home", text: "Back to the overview" }))
    ]));
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
    var counts = p.labSessions || [];
    var wrap = h("div", { class: "figure" });
    wrap.appendChild(h("div", { class: "lab-meta" },
      h("span", null, "Sessions ", h("b", { text: String(counts.reduce(function (a, b) { return a + b; }, 0) || lab.steps.length) })),
      h("span", null, "Compute ", h("b", { text: lab.compute })),
      h("span", null, "Tools ", h("b", { text: lab.tools }))
    ));
    var tabs = h("div", { class: "tabs", role: "tablist", "aria-label": "Lab steps" });
    var panels = h("div");
    var saved = P.store.get("labtab:" + p.id, 0);
    var buttons = [];
    function select(i) {
      buttons.forEach(function (x, j) { x.setAttribute("aria-selected", String(j === i)); panels.children[j].hidden = j !== i; });
      P.store.set("labtab:" + p.id, i);
    }
    lab.steps.forEach(function (st, i) {
      var tabId = "tab-" + p.id + "-" + i, panelId = "panel-" + p.id + "-" + i;
      var b = h("button", { type: "button", role: "tab", id: tabId, "aria-controls": panelId, "aria-selected": String(i === saved) },
        h("span", { class: "tn", text: String(i + 1) }), st.name, counts[i] ? h("span", { class: "tn", text: "· " + counts[i] + (counts[i] === 1 ? " session" : " sessions") }) : null);
      var panel = labPanel(st, p, i);
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
      panel.hidden = i !== saved;
      b.addEventListener("click", function () { select(i); });
      buttons.push(b);
      tabs.appendChild(b);
      panels.appendChild(panel);
    });
    labCtl = { select: select };
    wrap.appendChild(tabs);
    wrap.appendChild(panels);
    return wrap;
  }
  function labPanel(st, p, i) {
    var panel = h("div", { class: "tab-panel" });
    panel.appendChild(P.richEl("p", { class: "goal" }, st.goal));
    if (st.do) panel.appendChild(h("div", null, h("h4", { text: "Do this" }), h("ol", { class: "steps" }, st.do.map(function (d) { return P.richEl("li", null, d); }))));
    if (st.ideas) panel.appendChild(h("div", null, h("h4", { text: "Dataset ideas from your world" }), h("ul", null, st.ideas.map(function (d) { return P.richEl("li", null, d); }))));
    if (st.table) panel.appendChild(tableEl(st.table[0], st.table.slice(1), true));
    if (st.prompt) {
      var pre = PROMPT_PREAMBLE.replace(/<folder>/g, stationFolder(p)).replace("<step>", String(i + 1));
      panel.appendChild(promptBox("Prompt for Claude Code", pre + st.prompt));
    }
    if (st.observe) panel.appendChild(h("div", null, h("h4", { text: "What to look for" }), h("ul", null, st.observe.map(function (d) { return P.richEl("li", null, d); }))));
    if (st.done) panel.appendChild(h("div", { class: "callout" }, h("span", { class: "callout-k", text: "Done when" }), P.richEl("p", null, st.done)));
    return panel;
  }
  function promptBox(title, text) {
    var pre = h("pre", { text: text });
    var btn = h("button", { type: "button", class: "btn small primary", text: "Copy" });
    btn.addEventListener("click", function () { P.copy(text, btn, pre); });
    return h("div", { class: "prompt-box" }, h("div", { class: "prompt-head" }, h("span", { text: title }), btn), pre);
  }

  function renderBuild(p) {
    var b = p.build;
    var doc = P.templates && P.templates[b.doc];
    var wrap = h("div", { class: "figure" });
    wrap.appendChild(h("div", { class: "lab-meta" },
      h("span", null, "Feature ", h("b", { text: b.feature })),
      h("span", null, "Sessions ", h("b", { text: String(b.sessions || 1) })),
      h("span", null, "Stack ", h("b", { text: "Node.js · Postgres · MongoDB · Ollama" }))
    ));
    wrap.appendChild(P.richEl("p", { class: "build-goal" }, b.what));
    wrap.appendChild(h("p", { class: "small" }, h("b", { text: "Why this feature: " }), b.why));
    wrap.appendChild(promptBox("Prompt for Claude Code", P.APP_PREAMBLE + b.prompt));
    if (doc) {
      wrap.appendChild(h("div", { style: { display: "grid", gap: "0.5rem" } },
        h("h4", { class: "mini-h", text: "Project document for this station" }),
        h("p", { class: "small" }, h("b", { text: doc.title + ". " }), "Draft it for Delivery Copilot and commit it to project-docs/. Then fill it in again for your real project at work, and keep that version private."),
        promptBox(doc.title + " template", doc.text)));
    }
    return wrap;
  }

  function renderPlan(p) {
    var parts = [];
    if (p.delivery) {
      var tsv = "Work item\tTypical effort\tWho\tWatch out for\n" + p.delivery.map(function (r) { return r.join("\t"); }).join("\n");
      var copyBtn = h("button", { type: "button", class: "btn small", text: "Copy rows for a spreadsheet" });
      copyBtn.addEventListener("click", function () { P.copy(tsv, copyBtn, null); });
      parts.push(tableEl(["Work item", "Typical effort", "Who", "Watch out for"], p.delivery));
      parts.push(h("div", { class: "row" }, copyBtn, h("span", { class: "small muted", text: "Pastes as four columns into Excel, Google Sheets, or a Jira import." })));
    }
    parts.push(h("h3", { text: "Decisions this paper informs" }));
    parts.push(h("div", { class: "pm-grid" }, p.pm.map(function (x) {
      return h("div", { class: "pm-card" }, P.richEl("span", { class: "q" }, x.q), P.richEl("p", null, x.a));
    })));
    return parts;
  }

  function renderInterviewList(items) {
    var status = P.store.get("interview-status", {});
    return h("div", { class: "concepts" }, items.map(function (q) {
      var st = status[q.key];
      return h("details", { class: "concept" },
        h("summary", null,
          h("span", null, h("span", { class: "c-name", text: q.q }), q.label ? h("span", { class: "c-plain", text: q.label }) : null),
          h("span", { class: "q-status" + (st ? " " + st : ""), text: st === "got" ? "✓ confident" : st === "again" ? "↻ practice" : "›" })
        ),
        h("div", { style: { padding: "0 1.1rem 1rem" } },
          h("span", { class: "mini-h", text: "A strong answer covers" }),
          h("ul", { class: "small" }, q.a.map(function (x) { return h("li", { text: x }); }))));
    }));
  }

  function renderPublish(p) {
    var t = P.portfolioTemplates || {};
    var folder = stationFolder(p);
    var readme = (t.readme || "").replace("NN", pad(p.num)).replace("PAPER", p.short);
    var post = (t.post || "").replace("HOOK: one surprising result in one line", (p.post || "HOOK") + "  (rewrite this with your own result)").replace("PAPER", p.title).replace("YEAR", String(p.year));
    var draftPrompt = "Read the notebooks, charts, experiment-card.md, and failure-log.md in " + folder + "/. Then:\n" +
      "1. Write " + folder + "/README.md using the template below. Use only numbers that appear in the notebooks, and mark anything you are unsure of with TODO.\n" +
      "2. Draft a 150–200 word post for LinkedIn in my voice: plain, specific, no hype, one number, one failure, one lesson for running AI projects.\n" +
      "3. Add a row for this station to the progress table in the repository's top-level README.md.\n" +
      "Do not include confidential or personal data.\n\nTEMPLATE\n" + readme;
    return [
      h("div", { class: "pm-grid" },
        h("div", { class: "pm-card" }, h("span", { class: "q", text: "Commit to your portfolio" }), h("ul", { class: "small" },
          h("li", null, "Notebooks and charts in ", h("code", { text: folder + "/" })),
          h("li", { text: "README with the results table and what failed" }),
          h("li", { text: "Experiment card and failure log" }),
          p.build ? h("li", { text: "The Delivery Copilot feature: " + p.build.feature } ) : null,
          p.build && P.templates[p.build.doc] ? h("li", { text: "The project document: " + P.templates[p.build.doc].title }) : null)),
        h("div", { class: "pm-card" }, h("span", { class: "q", text: "Post idea" }), h("p", { text: "“" + (p.post || "") + "”" }),
          h("p", { class: "small muted", text: "Lead with your own number or failure, keep it under 200 words, and link the repository." }))
      ),
      promptBox("Prompt for Claude Code: draft the write-up", draftPrompt),
      promptBox("Post template", post)
    ];
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
    var sessions = P.sessionsFor(p);
    function paintMeter() {
      var st = P.progress.get(p.id);
      var done = sessions.filter(function (s) { return st[s.id]; }).length;
      meter.style.width = (done / sessions.length) * 100 + "%";
      label.textContent = done + " of " + sessions.length + " sessions done on this station";
    }
    var state = P.progress.get(p.id);
    sessions.forEach(function (s) {
      var id = "chk-" + p.id + "-" + s.id;
      var input = h("input", { type: "checkbox", id: id, checked: !!state[s.id] });
      var labelEl = s.route ? h("span", null, s.label + " · ", h("a", { href: "#" + s.route, text: "open" })) : h("span", { text: s.label });
      var row = h("label", { class: "check" + (state[s.id] ? " done" : ""), for: id }, input,
        h("span", { class: "check-text" }, labelEl, h("span", { class: "check-min", text: s.min + " min" })));
      input.addEventListener("change", function () {
        P.progress.set(p.id, s.id, input.checked);
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
      P.richEl("p", { class: "dek" }, "Reading about AI tells you what people claim. Trying a small version yourself tells you what is true, what breaks easily, and what it costs. That hands-on knowledge is what lets an AI project manager estimate well, spot risks early, and push back with evidence.")
    ));

    page.appendChild(section("Your daily rhythm", "01", h("div", { class: "loop-grid" },
      methodCard("START · 2 MIN", "Open today's session", "The overview's “Today's session” card picks up exactly where you stopped and jumps to the right part of the station.", null),
      methodCard("DO · 35–40 MIN", "One session, one thing", "Read, play with figures, run one lab step, or build one feature. Stop at the session boundary even if you could keep going.", null),
      methodCard("CLOSE · 5 MIN", "Tick it and write two lines", "Mark the session done, and note one thing you learned or one thing that failed in the station's notes box.", null),
      methodCard("WEEKLY · OPTIONAL", "Catch up or publish", "Use a free weekend slot for a session you skipped, or to polish the station's README and post.", null)
    ), "The route is about " + Math.round(P.sortedPapers().reduce(function (a, p) { return a + P.minutesFor(p); }, 0) / 60) + " hours, split into " + P.nextSession().total + " sessions of about 45 minutes. One a day is roughly five hours a week."));

    page.appendChild(section("The four-step loop", "02", h("div", { class: "loop-grid" },
      methodCard("STEP 1 · COOK IT SMALL", "Reproduce, even partially", "Like trying a restaurant recipe at home in a small pot: rebuild the paper's main experiment at a tiny scale. Your numbers won't match the paper's, and that is fine.", "You learn which parts of the recipe really matter, and how far a demo is from production."),
      methodCard("STEP 2 · YOUR INGREDIENTS", "Use your own data", "Cook the same recipe with what is in your own kitchen: tickets, status reports, requirements, release notes instead of the paper's test data.", "Test data flatters AI. Your own data shows the real gaps, and preparing data is where most AI projects slip."),
      methodCard("STEP 3 · TASTE TEST", "Compare 2–3 simpler options", "Put the fancy dish next to a simple one and a cheap one, tasted the same way. In AI these simpler options are called baselines.", "“Is it better than a keyword rule?” is the most valuable question in an AI project review. Baselines answer it."),
      methodCard("STEP 4 · KITCHEN NOTES", "Write down what failed and why", "Note what burned, why it burned, and what fixed it. This is your failure log.", "Your failure log becomes your risk register, and your best interview material.")
    ), "Every station's lab follows the same four steps, so by the end you will have run this loop ten times."));

    page.appendChild(section("Working with Claude Code", "03", [
      h("ol", { class: "steps" },
        P.richEl("li", null, "Create a public GitHub repository for your portfolio (layout on the <a href=\"#portfolio\">portfolio page</a>), clone it, and open Claude Code in it."),
        P.richEl("li", null, "Copy a lab prompt from a station and paste it into Claude Code. Read its plan, change anything you disagree with, then approve."),
        P.richEl("li", null, "Claude Code writes the notebook into <code>stations/NN-name/</code>. Commit and push."),
        P.richEl("li", null, "Open <code>colab.research.google.com</code>, choose the GitHub tab, and pick the notebook. Set Runtime → Change runtime type → T4 GPU, then Run all."),
        P.richEl("li", null, "If a cell fails, paste the error back into Claude Code, ask for a plain-English explanation first, then the fix. Push and re-run. Log the failure."),
        P.richEl("li", null, "In Colab, use File → Save a copy in GitHub to keep the outputs. Fill in the experiment card, then use the station's publish prompt to draft the README.")
      ),
      h("div", { class: "two-col" },
        h("div", { class: "pm-card" },
          h("span", { class: "q", text: "You are the project manager. Claude Code is the engineer." }),
          h("ul", { class: "small" },
            h("li", { text: "Write each task like a ticket: goal, data, constraints, acceptance criteria." }),
            h("li", { text: "Ask for a plan before code. Approve or change it." }),
            h("li", { text: "Ask it to explain each step in plain English. Ask why, not only what." }),
            h("li", { text: "Make it state assumptions: data size, run time, memory." }),
            h("li", { text: "Keep runs short. Ten 2-minute runs teach more than one 20-minute run." })
          )
        ),
        h("div", { class: "pm-card" },
          h("span", { class: "q", text: "Questions that keep the engineer honest" }),
          h("ul", { class: "small" },
            h("li", { text: "How do I know this number is right? What would a bug look like?" }),
            h("li", { text: "Is the test set ever seen during training?" }),
            h("li", { text: "What is the simplest baseline, and how does it score?" }),
            h("li", { text: "Which settings did you choose, and which did the paper use?" }),
            h("li", { text: "What would change with 10× the data, or 10× the users?" })
          )
        )
      ),
      promptBox("Standing instructions at the top of every lab prompt", PROMPT_PREAMBLE.replace(/<folder>/g, "stations/NN-name").replace("<step>", "N") + "(the station's task goes here)"),
      promptBox("Standing instructions at the top of every Delivery Copilot prompt", P.APP_PREAMBLE + "(the station's feature goes here)")
    ], "Two kinds of prompts: lab prompts produce a Colab notebook for the paper, and build prompts add a feature to your Node.js app. Both assume Claude Code is running inside your portfolio repository."));

    page.appendChild(section("Your free toolbelt", "04", tableEl(["Tool", "What it is for", "Cost"], [
      ["Google Colab (free tier)", "Runs every lab notebook on a free T4 GPU. Sessions time out after a while, so save to GitHub.", "Free"],
      ["Kaggle Notebooks", "Backup free GPU when Colab limits you, about 30 GPU-hours a week.", "Free"],
      ["Hugging Face account", "Download open models and datasets. Some, like Llama, need you to accept a license first.", "Free"],
      ["Claude Code", "Your engineer for both the labs and the app.", "Your existing access"],
      ["GitHub", "Your public portfolio repository, and the bridge into Colab.", "Free"],
      ["Node.js 20, Ollama, Docker", "Run Delivery Copilot, local LLMs, Postgres, and MongoDB on your laptop.", "Free (see the portfolio page if Docker is not allowed)"]
    ]), "Every lab and build step is designed to run on free tiers. Where a step mentions paid APIs, it is only as a cost row you fill in by hand."));

    page.appendChild(section("Reading a paper in three passes", "05", h("div", { class: "loop-grid", style: { gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" } },
      methodCard("PASS 1 · 15 MIN", "Shape", "Title, abstract, figures, headings, conclusion. Can you say what problem it solves and what the result is?", "Each station's 60-second version is a pass 1 for you."),
      methodCard("PASS 2 · 45 MIN", "Story", "Read the intro and method. Skip proofs and dense math. Mark every term you cannot define.", "Use the station's reading guide and glossary."),
      methodCard("PASS 3 · AFTER THE LAB", "Detail", "Re-read the experiments section now that you have run one. The tables will make sense.", "Compare their setup with yours in your experiment card.")
    ), "Adapted from S. Keshav's “How to Read a Paper”. Nobody reads a paper once, front to back."));

    page.appendChild(section("Plan your schedule", "06", figure({ w: "schedule", k: "Planner", title: "How long will the route take?", text: "Set the hours you can give each week. Estimates include reading, figures, all four lab steps, the build step, interview practice, and publishing." }, "method")));

    page.appendChild(section("Templates", "07", h("div", { class: "two-col" },
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
      h("div", { class: "eyebrow" }, h("span", { text: "For planning, design reviews, and vendor calls" })),
      h("h1", { text: "The AI project toolkit" }),
      P.richEl("p", { class: "dek" }, "The papers turned into tools for running AI projects: a helper for choosing between prompting, retrieval, and fine-tuning, back-of-envelope calculators for training cost and serving capacity, a map of the LLM lifecycle, and the questions to ask your ML team.")
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

  /* ---------- Portfolio and capstone ---------- */
  function renderPortfolio() {
    var page = h("div", { class: "page" });
    var papers = P.sortedPapers();
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: "Capstone and public portfolio" })),
      h("h1", { text: "Portfolio and capstone" }),
      P.richEl("p", { class: "dek" }, "One public repository shows everything you did: a write-up for each station, and Delivery Copilot, a Node.js assistant for project teams that you build one feature at a time. Alongside it you draft the ten documents an AI project manager owns, first for the sample project and then, privately, for your real project at work.")
    ));

    page.appendChild(section("Two tracks, one set of skills", "01", h("div", { class: "two-col" },
      h("div", { class: "pm-card" },
        h("span", { class: "q", text: "Public: Delivery Copilot" }),
        h("p", { text: "An assistant that answers questions over project documents with citations, logs every call, collects reviewer feedback, and reports quality, cost, and latency. Use public or sample documents, such as an open-source project's docs or project documents you write for a fictional client." }),
        h("p", { class: "small muted", text: "Goes in your public repository. Shows you can build and evaluate an AI feature end to end." })),
      h("div", { class: "pm-card" },
        h("span", { class: "q", text: "Private: your project at work" }),
        h("p", { text: "Apply the same documents and habits to the AI product your team is building: charter, data readiness, evaluation plan, cost model, launch checklist. Reuse Delivery Copilot's patterns for an internal prototype if your company allows it." }),
        h("p", { class: "small muted", text: "Stays private. Shows up in interviews as stories, not files." }))
    )));

    page.appendChild(section("How Delivery Copilot fits together", "02", figure({ w: "copilotflow", k: "Architecture", title: "From documents to cited answers", text: "The request path through the app. Each piece is added at the station named in its box." }, "portfolio")));

    var rows = papers.filter(function (p) { return p.build; }).map(function (p) {
      var st = P.progress.get(p.id);
      var builds = P.sessionsFor(p).filter(function (s) { return s.kind === "build"; });
      var done = builds.length && builds.every(function (s) { return st[s.id]; });
      var doc = P.templates[p.build.doc];
      return [h("a", { href: "#" + p.id, text: pad(p.num) + " · " + p.short }), p.build.feature, doc ? doc.title : "", String(p.build.sessions || 1), done ? "✓ built" : "To do"];
    });
    page.appendChild(section("Milestones by station", "03", tableEl(["Station", "App feature", "Project document", "Sessions", "Status"], rows),
      "Status updates when you tick the build sessions on each station."));

    page.appendChild(section("The free stack", "04", [
      tableEl(["Tool", "Role in the app", "Cost"], P.capstone.stack),
      h("div", { class: "callout" }, h("span", { class: "callout-k", text: "If your laptop or employer limits you" }),
        h("p", { text: "Ollama runs 1B–3B models on a laptop with 8 GB of RAM; 16 GB is comfortable. If you cannot run Ollama, ask Claude Code to use Transformers.js with a small instruct model such as Qwen2.5-0.5B-Instruct inside Node instead. If Docker is not allowed, use the Neon free tier for Postgres with pgvector and the MongoDB Atlas free tier." }))
    ]));

    page.appendChild(section("Standing instructions for Claude Code", "05", promptBox("Paste this above any build prompt (each station's prompt already includes it)", P.APP_PREAMBLE + "(the station's feature goes here)")));

    page.appendChild(section("Your public portfolio", "06", [
      promptBox("Repository layout", P.portfolioTemplates.repo),
      h("div", { class: "two-col" },
        h("div", { class: "pm-card" }, h("span", { class: "q", text: "After each station, publish" }), h("ul", { class: "small" },
          h("li", { text: "The station folder: notebooks, charts, README with results and failures, experiment card, failure log." }),
          h("li", { text: "The Delivery Copilot feature with its README section." }),
          h("li", { text: "The project document for the sample project." }),
          h("li", { text: "A short post linking the folder. One number, one failure, one lesson." }))),
        h("div", { class: "pm-card" }, h("span", { class: "q", text: "Keep it safe" }), h("ul", { class: "small" },
          h("li", { text: "Never publish your employer's documents, data, or code. Use public or invented sample data." }),
          h("li", { text: "Check your company's policy on public posts about work topics." }),
          h("li", { text: "Never commit API keys or tokens; keep a .env file out of Git." }),
          h("li", { text: "Write about what you learned, not about confidential projects." }))))
    ], "Recruiters and hiring managers skim. A top-level README with a progress table and one-line results per station does more than polished notebooks."));

    var docs = Object.keys(P.templates).map(function (k) {
      var t = P.templates[k], p = P.paper(t.station);
      return h("details", { class: "concept" },
        h("summary", null, h("span", null, h("span", { class: "c-name", text: t.title }), h("span", { class: "c-plain", text: p ? "Drafted at Station " + pad(p.num) + " · " + p.short : "" })), h("span", { class: "chev", "aria-hidden": "true", text: "›" })),
        h("div", { style: { padding: "0 1.1rem 1rem" } }, promptBox(t.title, t.text)));
    });
    page.appendChild(section("Templates", "07", [
      h("div", { class: "two-col" }, promptBox("Station README", P.portfolioTemplates.readme), promptBox("Post", P.portfolioTemplates.post)),
      h("h3", { text: "The AI project manager's document kit" }),
      h("div", { class: "concepts" }, docs)
    ], "The same files are in the portfolio-template folder of this repository, ready to copy into your own."));
    return page;
  }

  /* ---------- Interviews ---------- */
  function renderInterviews() {
    var page = h("div", { class: "page" });
    var all = P.allInterviewQuestions();
    page.appendChild(h("header", { class: "page-head" },
      h("div", { class: "eyebrow" }, h("span", { text: all.length + " questions" })),
      h("h1", { text: "Interview practice" }),
      P.richEl("p", { class: "dek" }, "Questions AI project and program managers get asked, with what a strong answer covers. Practice out loud against the timer, mark what needs work, and use your labs, failure logs, and Delivery Copilot as your examples.")
    ));
    page.appendChild(section("Mock interview", "01", figure({ w: "interviewpractice", k: "Practice", title: "One question at a time", text: "Pick a pool, answer out loud in about two minutes, then compare with the guidance. Questions you mark for practice come back in their own pool." }, "interviews")));
    page.appendChild(section("How to answer well", "02", h("div", { class: "loop-grid" },
      loopCard("1", "Structure first", "Say how you will answer: “Three things: the metric, the data, and the risks.” Then keep to it."),
      loopCard("2", "Use your evidence", "Point to something you ran: “When I compared keyword and semantic search on project docs, hit rate went from X to Y.”"),
      loopCard("3", "Name the trade-off", "Cost against quality, speed against safety, build against buy. Interviewers listen for judgment."),
      loopCard("4", "Close with measurement", "End with how you would know it worked: the metric, the threshold, and who agreed it.")
    )));
    var groups = {};
    var order = [];
    all.forEach(function (q) {
      var g = q.group === "general" ? q.label : q.label;
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(q);
    });
    var bank = order.map(function (g) {
      return h("div", { style: { display: "grid", gap: "0.5rem" } }, h("h3", { text: g }), renderInterviewList(groups[g].map(function (q) { return { key: q.key, q: q.q, a: q.a }; })));
    });
    page.appendChild(section("Question bank", "03", bank, "General questions first, then one group per station. Status marks come from the mock interview above."));
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
