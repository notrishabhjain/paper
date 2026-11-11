/* Career widgets: mock interview practice and the capstone architecture strip. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h;

  /* All interview questions: the general bank plus every station's questions. */
  P.allInterviewQuestions = function () {
    var list = (P.interviewGeneral || []).map(function (q, i) {
      return { key: "g" + i, group: "general", label: q.cat, q: q.q, a: q.a };
    });
    P.sortedPapers().forEach(function (p) {
      (p.interview || []).forEach(function (q, i) {
        list.push({ key: p.id + i, group: "station", label: "Station " + (p.num < 10 ? "0" : "") + p.num + " · " + p.short, q: q.q, a: q.a, paper: p.id });
      });
    });
    (P.units || []).slice().sort(function (a, b) { return P.track(a.track).num - P.track(b.track).num || a.num - b.num; }).forEach(function (u) {
      (u.interview || []).forEach(function (q, i) {
        list.push({ key: u.id + i, group: "unit", label: P.itemTag(u) + " · " + u.short, q: q.q, a: q.a, paper: u.id });
      });
    });
    return list;
  };

  P.widget("interviewpractice", function (root) {
    var pool = "all", current = null, timer = null, started = 0;
    var status = P.store.get("interview-status", {});
    var all = P.allInterviewQuestions();
    var stats = P.readout([
      { key: "got", label: "Answered confidently" },
      { key: "again", label: "Marked for practice" },
      { key: "left", label: "Not tried yet" }
    ]);
    var segEl = P.seg([{ value: "all", label: "All questions" }, { value: "general", label: "General" }, { value: "station", label: "Paper-specific" }, { value: "unit", label: "Agents and second brain" }, { value: "again", label: "Marked for practice" }], pool,
      function (v) { pool = v; pick(); }, "Question pool");
    var label = h("span", { class: "eyebrow" });
    var question = h("p", { class: "decide-q" });
    var clock = h("span", { class: "mono small muted", "aria-live": "off" });
    var guidance = h("ul", { class: "small" });
    guidance.hidden = true;
    var revealBtn = h("button", { type: "button", class: "btn", text: "Show what a strong answer covers" });
    var gotBtn = h("button", { type: "button", class: "btn primary", text: "I answered it well" });
    var againBtn = h("button", { type: "button", class: "btn", text: "Practice again later" });
    var nextBtn = h("button", { type: "button", class: "btn", text: "Skip to next question" });
    var empty = h("p", { class: "small muted", text: "Nothing in this pool yet. Choose another pool." });
    empty.hidden = true;
    var card = h("div", { class: "q-item" }, h("div", { class: "row", style: { justifyContent: "space-between" } }, label, clock), question,
      h("p", { class: "small muted", text: "Answer out loud in about two minutes, as if in an interview. Then compare with the guidance." }),
      h("div", { class: "row" }, revealBtn, gotBtn, againBtn, nextBtn), guidance);
    root.appendChild(h("div", { class: "scroll-x" }, segEl));
    root.appendChild(card);
    root.appendChild(empty);
    root.appendChild(stats);

    revealBtn.addEventListener("click", function () { guidance.hidden = !guidance.hidden; revealBtn.textContent = guidance.hidden ? "Show what a strong answer covers" : "Hide guidance"; });
    gotBtn.addEventListener("click", function () { mark("got"); });
    againBtn.addEventListener("click", function () { mark("again"); });
    nextBtn.addEventListener("click", pick);

    function mark(v) {
      if (!current) return;
      status[current.key] = v;
      P.store.set("interview-status", status);
      document.dispatchEvent(new CustomEvent("interview-change"));
      pick();
    }
    function candidates() {
      return all.filter(function (q) {
        if (pool === "general") return q.group === "general";
        if (pool === "station") return q.group === "station";
        if (pool === "unit") return q.group === "unit";
        if (pool === "again") return status[q.key] === "again";
        return true;
      });
    }
    function pick() {
      var c = candidates();
      var fresh = c.filter(function (q) { return !status[q.key] && (!current || q.key !== current.key); });
      var source = fresh.length ? fresh : c.filter(function (q) { return !current || q.key !== current.key || c.length === 1; });
      current = source.length ? source[Math.floor(Math.random() * source.length)] : null;
      card.hidden = !current;
      empty.hidden = !!current;
      if (current) {
        label.textContent = current.label;
        question.textContent = current.q;
        P.clear(guidance);
        current.a.forEach(function (x) { guidance.appendChild(h("li", { text: x })); });
        guidance.hidden = true;
        revealBtn.textContent = "Show what a strong answer covers";
        started = Date.now();
      }
      paintStats();
    }
    function paintStats() {
      var got = 0, again = 0;
      all.forEach(function (q) { if (status[q.key] === "got") got++; else if (status[q.key] === "again") again++; });
      stats.update("got", String(got), "of " + all.length);
      stats.update("again", String(again));
      stats.update("left", String(all.length - got - again));
    }
    function tick() {
      if (!document.body.contains(root)) { clearInterval(timer); return; }
      if (!current) return;
      var sec = Math.floor((Date.now() - started) / 1000);
      clock.textContent = Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0") + (sec > 120 ? " · over two minutes" : "");
    }
    timer = setInterval(tick, 1000);
    pick();
    tick();
  });

  /* ---------------- Capstone architecture strip ---------------- */
  P.widget("copilotflow", function (root) {
    var steps = (P.capstone && P.capstone.flow) || [];
    var stationFor = { 1: "transformer", 2: "bert", 3: "bert", 4: "lora", 5: "gpt2", 6: "gpt3", 7: "instructgpt", 8: "gpt3" };
    var row = h("div", { class: "tok-out", style: { alignItems: "center" } });
    steps.forEach(function (st, i) {
      var p = stationFor[i] ? P.paper(stationFor[i]) : null;
      row.appendChild(h("span", { class: "tok", style: { whiteSpace: "normal", fontFamily: "var(--font-body)", padding: "0.45rem 0.65rem", background: p ? P.mix(P.stages[p.stage].color, 18, "var(--surface)") : "var(--surface-2)" } },
        st, p ? h("small", { text: " · " + p.short }) : null));
      if (i < steps.length - 1) row.appendChild(h("span", { class: "muted", "aria-hidden": "true", text: "→" }));
    });
    root.appendChild(row);
    root.appendChild(h("p", { class: "fig-note", text: "Each box names the station whose build step adds it. The token meter (Station 00), cost planner (05), model comparison (08), and performance benchmark (09) wrap around this flow as tools and reports." }));
  });
})();
