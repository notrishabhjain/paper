/* Widgets for Station 06 (InstructGPT): the three-step pipeline, ranking game, KL leash. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h, s = P.s;

  var STEPS = [
    { n: "Step 1", name: "Supervised fine-tuning (SFT)", data: "About 13,000 prompts with answers written by labelers",
      flow: ["Prompt from real API users", "Labeler writes the ideal answer", "Fine-tune GPT-3 on these pairs", "SFT model"],
      plain: "Show the model examples of great answers and have it imitate them. Like onboarding a new hire with a binder of model responses.",
      pm: "Demonstrations are expensive: each one is written by a trained person. Quality and diversity of prompts matter more than raw count." },
    { n: "Step 2", name: "Reward model (RM)", data: "About 33,000 prompts, each with 4 to 9 answers ranked by labelers",
      flow: ["Prompt", "SFT model writes several answers", "Labeler ranks them best to worst", "Train a 6B model to predict the ranking"],
      plain: "Ranking is faster and more consistent than writing. A second model learns to score answers the way labelers would.",
      pm: "The reward model is only as good as the labeling guidelines. Ambiguous guidelines produce a confused scorer." },
    { n: "Step 3", name: "Reinforcement learning (PPO)", data: "About 31,000 prompts, no human labels needed",
      flow: ["Prompt", "Policy model writes an answer", "Reward model scores it", "PPO nudges the policy toward higher scores"],
      plain: "The model practices on new prompts and gets graded by the reward model, thousands of times. A penalty keeps it close to the SFT model so it does not game the grader.",
      pm: "This step scales without humans, which is the point, but it can learn to exploit flaws in the reward model (reward hacking)." }
  ];
  P.widget("rlhf", function (root) {
    var cur = 0;
    var stepper = h("div", { class: "stepper", role: "group", "aria-label": "RLHF steps" });
    var detail = h("div", { style: { display: "grid", gap: "0.9rem" } });
    var btns = STEPS.map(function (st, i) {
      var b = h("button", { type: "button", "aria-pressed": String(i === cur) }, h("span", { class: "sn", text: st.n }), h("b", { text: st.name }));
      b.addEventListener("click", function () { cur = i; paint(); });
      stepper.appendChild(b);
      return b;
    });
    root.appendChild(stepper);
    root.appendChild(detail);
    function paint() {
      btns.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === cur)); });
      var st = STEPS[cur];
      P.clear(detail);
      var flow = h("div", { class: "tok-out", style: { alignItems: "center" } });
      st.flow.forEach(function (f, i) {
        flow.appendChild(h("span", { class: "tok", style: { whiteSpace: "normal", fontFamily: "var(--font-body)", padding: "0.4rem 0.6rem", background: i === st.flow.length - 1 ? P.mix("var(--c4)", 30, "var(--surface)") : "var(--surface-2)" }, text: f }));
        if (i < st.flow.length - 1) flow.appendChild(h("span", { "aria-hidden": "true", class: "muted", text: "→" }));
      });
      detail.appendChild(flow);
      detail.appendChild(h("div", { class: "step-detail" },
        h("div", null, h("div", { class: "eyebrow", text: "In plain words" }), h("p", { class: "small", text: st.plain }), h("p", { class: "small muted", style: { marginTop: "0.4rem" }, text: "Data: " + st.data })),
        h("div", null, h("div", { class: "eyebrow", text: "PM angle" }), h("p", { class: "small", text: st.pm }))
      ));
    }
    paint();
  });

  /* ---------------- Ranking game → pairwise comparisons → reward scores ---------------- */
  P.widget("ranking", function (root) {
    var prompt = "Explain what an API is to a new sales hire, in two or three sentences.";
    var answers = [
      { id: "A", text: "An API is like a waiter: our app hands it an order, and it brings back what another system made. It's how our product talks to tools like Salesforce without anyone copying data by hand." },
      { id: "B", text: "An API (Application Programming Interface) is a set of HTTP endpoints exposing resources via REST or GraphQL with OAuth 2.0 authentication and JSON payloads." },
      { id: "C", text: "API stands for Advanced Product Integration. It is a paid add-on that customers buy to unlock premium features in our product." },
      { id: "D", text: "Great question!!! APIs are super important and honestly kind of amazing. There are many kinds of APIs and they do many things. Let me know if you want to know more about APIs!" }
    ];
    var order = [1, 3, 0, 2]; // start scrambled: B, D, A, C
    var list = h("div", { class: "rank-list" });
    var pairs = h("div", { class: "small" });
    var scores = h("div", { class: "bars" });
    root.appendChild(h("div", { class: "prompt-preview", text: "Prompt: " + prompt }));
    root.appendChild(h("p", { class: "kbd-hint", text: "Rank the answers from best (top) to worst using the arrows. You are now a labeler." }));
    root.appendChild(list);
    root.appendChild(h("div", { class: "two-col" },
      h("div", null, h("div", { class: "eyebrow", text: "Your ranking becomes training pairs" }), pairs),
      h("div", null, h("div", { class: "eyebrow", text: "Reward model scores after training on them" }), scores)));
    root.appendChild(h("p", { class: "fig-note", text: "Scores are fitted with a simple Bradley–Terry model on your pairs, the same kind of objective the paper's reward model uses: make the preferred answer's score higher than the rejected one's." }));
    function move(i, dir) {
      var j = i + dir;
      if (j < 0 || j >= order.length) return;
      var t = order[i]; order[i] = order[j]; order[j] = t;
      paint();
    }
    function paint() {
      P.clear(list);
      order.forEach(function (ai, rank) {
        var a = answers[ai];
        var up = h("button", { type: "button", class: "btn small", "aria-label": "Move answer " + a.id + " up", text: "↑", disabled: rank === 0 });
        var down = h("button", { type: "button", class: "btn small", "aria-label": "Move answer " + a.id + " down", text: "↓", disabled: rank === order.length - 1 });
        up.addEventListener("click", function () { move(rank, -1); });
        down.addEventListener("click", function () { move(rank, 1); });
        list.appendChild(h("div", { class: "rank-item" }, h("span", { class: "rk", text: "#" + (rank + 1) }), h("span", null, h("b", { text: a.id + ". " }), a.text), h("span", { class: "rbtns" }, up, down)));
      });
      // pairwise comparisons: K choose 2
      var pr = [];
      for (var i = 0; i < order.length; i++) for (var j = i + 1; j < order.length; j++) pr.push([order[i], order[j]]);
      P.clear(pairs);
      pairs.appendChild(h("p", { text: order.length + " answers ranked → " + pr.length + " comparisons (K choose 2). The paper's labelers ranked 4 to 9 answers, giving up to 36 pairs per prompt." }));
      pairs.appendChild(h("div", { class: "tok-out", style: { marginTop: "0.4rem" } }, pr.map(function (p) {
        return h("span", { class: "tok", text: answers[p[0]].id + " > " + answers[p[1]].id });
      })));
      // Bradley–Terry fit by gradient ascent
      var r = [0, 0, 0, 0];
      for (var it = 0; it < 400; it++) {
        var g = [0, 0, 0, 0];
        pr.forEach(function (p) {
          var sig = 1 / (1 + Math.exp(-(r[p[0]] - r[p[1]])));
          g[p[0]] += 1 - sig; g[p[1]] -= 1 - sig;
        });
        for (var k = 0; k < 4; k++) r[k] += 0.1 * (g[k] - 0.02 * r[k]);
      }
      var mn = Math.min.apply(null, r), mx = Math.max.apply(null, r);
      P.clear(scores);
      order.forEach(function (ai) {
        var v = (r[ai] - mn) / (mx - mn || 1);
        scores.appendChild(h("div", { class: "bar-row" },
          h("span", { class: "bl", text: "Answer " + answers[ai].id }),
          h("span", { class: "bar-track" }, h("span", { class: "bar-fill", style: { display: "block", width: Math.max(2, v * 100) + "%", background: "var(--c4)" } })),
          h("span", { class: "bv", text: r[ai].toFixed(2) })));
      });
      var best = answers[order[0]].id;
      scores.appendChild(h("p", { class: "small muted", text: best === "A" ? "Most labelers pick A: accurate, plain, and short. C is fluent but false, which is exactly what RLHF tries to train out." : best === "D" ? "You ranked the gushing answer first. If many labelers did this, the model would learn to flatter. This is why labeling guidelines matter." : "Interesting choice. Disagreement between labelers is real; the paper reports labelers agreed with each other about 73% of the time." }));
    }
    paint();
  });

  /* ---------------- KL leash: why PPO needs a penalty (teaching model) ---------------- */
  P.widget("klleash", function (root) {
    var beta = 0.1;
    var chart = h("div", { class: "chart" });
    var sample = h("div", { class: "gen-out", "aria-live": "polite" });
    var slider = P.slider({ id: "kl-beta", label: "KL penalty strength (β)", min: 0, max: 0.5, step: 0.01, value: beta, format: function (v) { return v.toFixed(2); }, onInput: function (v) { beta = v; paint(); } });
    root.appendChild(h("div", { class: "controls" }, slider));
    root.appendChild(chart);
    root.appendChild(P.legend([
      { label: "Reward model's score", color: "var(--c4)" },
      { label: "What humans actually think", color: "var(--c1)" },
      { label: "Drift from the SFT model", color: "var(--c8)" }
    ]));
    root.appendChild(sample);
    root.appendChild(h("p", { class: "fig-note", text: "Teaching model: curves show the qualitative trade-off described in RLHF papers, not measured values." }));
    var W = 600;
    P.responsive(chart, function (wd) { W = wd; paint(); });
    function metrics(b) {
      var drift = 1 / (1 + b * 14);
      var rm = 0.35 + 0.6 * drift;
      var human = 0.35 + 0.5 * drift - 0.75 * Math.pow(Math.max(0, drift - 0.55), 2) * 2.2;
      return { rm: rm, human: Math.max(0.05, human), drift: drift };
    }
    function paint() {
      var m = metrics(beta);
      var rows = [["Reward model's score", m.rm, "var(--c4)"], ["What humans actually think", m.human, "var(--c1)"], ["Drift from the SFT model", m.drift, "var(--c8)"]];
      var labelW = Math.min(190, W * 0.42), barH = 20, gap = 12, H = rows.length * (barH + gap) + 8;
      var x = P.scaleLin(0, 1, labelW, W - 44);
      var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Effect of the KL penalty" });
      rows.forEach(function (r, i) {
        var y = 4 + i * (barH + gap);
        svg.appendChild(s("text", { class: "chart-text", x: labelW - 8, y: y + barH / 2 + 4, "text-anchor": "end", text: r[0] }));
        var w = Math.max(4, x(r[1]) - labelW);
        svg.appendChild(s("path", { d: "M" + labelW + "," + y + "h" + (w - 4) + "a4,4 0 0 1 4,4v" + (barH - 8) + "a4,4 0 0 1 -4,4h" + (-(w - 4)) + "z", fill: r[2] }));
        svg.appendChild(s("text", { class: "chart-text-strong", x: labelW + w + 6, y: y + barH / 2 + 4, text: Math.round(r[1] * 100) }));
      });
      P.clear(chart).appendChild(svg);
      sample.textContent = beta < 0.05
        ? "Sample answer: \"Great question!!! As a helpful assistant I am SO happy to help!!! APIs are amazing and important and helpful…\" The policy found phrases the reward model over-scores. The score climbs while real quality collapses: reward hacking."
        : beta > 0.3
          ? "Sample answer: barely different from the SFT model. Safe, but most of the benefit of step 3 is lost."
          : "Sample answer: \"An API is how two pieces of software talk to each other, like a waiter carrying orders between you and the kitchen.\" The penalty lets the model improve while staying recognizably itself.";
    }
    paint();
  });
})();
