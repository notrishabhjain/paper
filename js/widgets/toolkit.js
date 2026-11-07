/* Toolkit widgets: approach decision helper, training cost and serving memory calculators. */
(function () {
  "use strict";
  var P = window.Portal, h = P.h;

  /* ---------------- Decision helper ---------------- */
  var Q = {
    start: { q: "What is missing when you try a general AI tool on your task?", opts: [
      ["It doesn't know our facts or documents, or they change often", "knowledge"],
      ["It knows enough, but the format, tone, or behavior is wrong", "behavior"],
      ["It can't do the task at all: a new language, a niche field, an unusual kind of input", "skill"],
      ["Not sure yet", "R:eval"]] },
    knowledge: { q: "How does that knowledge behave?", opts: [
      ["Changes weekly or faster, or users need cited sources", "R:rag"],
      ["Small and stable: it fits in a few pages", "R:context"],
      ["Huge and stable, and answers need deep synthesis across it", "R:raglora"]] },
    behavior: { q: "Have you tried clear written instructions with 3–5 examples (a prompt)?", opts: [
      ["Not yet", "R:fewshot"],
      ["Yes, it works, but it is too slow or expensive at our volume", "R:distill"],
      ["Yes, and the output is still inconsistent", "data"]] },
    data: { q: "How many high-quality examples of the ideal output can you collect?", opts: [
      ["Fewer than 100", "R:collect"],
      ["Hundreds to a few thousand", "R:lora"],
      ["Thousands, plus people who can rank outputs", "R:pref"]] },
    skill: { q: "What budget and timeline do you have?", opts: [
      ["Under $10K and a few weeks", "R:lora"],
      ["$100K to $1M and a few months", "R:continued"],
      ["$10M+ and a dedicated research team", "R:pretrain"]] }
  };
  var R = {
    eval: { like: "Before choosing how to train someone, write down what a good job looks like and test a few candidates.", t: "Start with prompting and an evaluation set", why: "Before choosing a technique, write 50–100 real examples with the answers you expect. Try a strong model with a good prompt. The failures tell you which branch you are on.", st: ["gpt3"], first: "Collect 50 real inputs and write the ideal output for each." },
    rag: { like: "An open-book exam: the model answers by looking up your pages each time.", t: "Retrieval-augmented generation (RAG)", why: "Fetch the relevant documents at question time and put them in the prompt. Knowledge stays fresh, sources can be cited, and nothing is retrained when documents change.", st: ["bert", "gpt3"], first: "Index a sample of documents with an embedding model and test 30 real questions." },
    context: { like: "Handing over the whole short document with every question.", t: "Put the knowledge in the prompt", why: "If it fits in the context window, the simplest system wins. Pay per token on every call, but skip all retrieval infrastructure.", st: ["gpt3", "flashattention"], first: "Measure prompt length and cost per 1,000 calls with the documents included." },
    raglora: { like: "An open book, plus a short course in how your experts reason.", t: "RAG first, then consider fine-tuning", why: "Retrieval handles facts. If answers still miss the domain's style of reasoning, add a LoRA fine-tune on worked examples.", st: ["gpt3", "lora"], first: "Ship RAG, log failures, and label which failures are retrieval misses versus reasoning misses." },
    fewshot: { like: "Briefing a contractor with a few finished examples.", t: "Prompting with a few examples", why: "GPT-3 showed that a handful of examples in the prompt often gets most of the way there, with no training at all. It is the cheapest experiment you can run.", st: ["gpt3"], first: "Write the prompt, add 3–5 diverse examples, and score it on your evaluation set." },
    distill: { like: "Having your senior expert write model answers, then training a junior to match them at lower cost.", t: "Fine-tune a smaller model with LoRA", why: "Use the big model's good outputs as training data for a small open model. LoRA makes this cheap, and the small model is faster and cheaper to serve.", st: ["lora", "llama", "chinchilla"], first: "Generate 1,000 outputs with the big model, filter for quality, and LoRA-tune a 7B–8B model." },
    collect: { like: "Gathering real examples before designing a training course.", t: "Collect data before fine-tuning", why: "Fewer than 100 examples rarely beats a good prompt. Improve the prompt now, and set up a way to capture real examples and corrections from users.", st: ["gpt3", "instructgpt"], first: "Add a thumbs-up/down and an edit box to the current flow to collect examples." },
    lora: { like: "A short training course, delivered as a small add-on to the model.", t: "LoRA fine-tuning (supervised)", why: "Hundreds to thousands of examples are enough to teach format, tone, and task behavior. LoRA trains a tiny adapter, so experiments cost tens of dollars, not thousands.", st: ["lora", "llama"], first: "Split examples 80/10/10, LoRA-tune an open 7B–8B model, and compare against your best prompt." },
    pref: { like: "A training course plus a coach who says which of two drafts is better.", t: "Supervised fine-tuning plus preference tuning", why: "With rankings, you can go beyond imitation and teach the model which of two good-looking answers people prefer, as InstructGPT did. Today DPO is a common, simpler alternative to PPO.", st: ["instructgpt", "lora"], first: "Write labeling guidelines and measure agreement between two labelers on 50 items." },
    continued: { like: "Sending the model to study your industry's literature before its job-specific course.", t: "Continued pre-training on domain data, then fine-tune", why: "Keep training an open model on billions of tokens of your domain text so it learns the vocabulary, then fine-tune for the task.", st: ["llama", "chinchilla", "lora"], first: "Estimate how many domain tokens you have, and run a small pilot to measure the loss drop." },
    pretrain: { like: "Founding your own university. Rarely worth it.", t: "Pre-train your own model", why: "Rarely the right call. Justified only for unique data, strict sovereignty needs, or a new modality. Size it with the Chinchilla rule and plan for serving cost too.", st: ["chinchilla", "llama", "flashattention"], first: "Run the training-cost calculator below and a small-scale scaling study before committing." }
  };
  P.widget("decide", function (root) {
    var path = ["start"];
    var body = h("div", { class: "decide", "aria-live": "polite" });
    root.appendChild(body);
    function paint() {
      P.clear(body);
      var cur = path[path.length - 1];
      if (path.length > 1) {
        body.appendChild(h("div", { class: "decide-path" }, path.slice(0, -1).map(function (p, i) { return h("span", { text: (i ? "→ " : "") + "Q" + (i + 1) }); })));
      }
      if (cur.indexOf("R:") === 0) {
        var r = R[cur.slice(2)];
        body.appendChild(h("div", { class: "decide-result" },
          h("span", { class: "eyebrow", text: "Recommended approach" }),
          h("h4", { text: r.t }),
          r.like ? h("p", { class: "small" }, h("b", { text: "In everyday terms: " }), r.like) : null,
          h("p", { class: "small", text: r.why }),
          h("p", { class: "small" }, h("b", { text: "First step: " }), r.first),
          h("p", { class: "small" }, h("b", { text: "Learn it at: " }), r.st.map(function (id, i) {
            var p = P.paper(id);
            return p ? [i ? ", " : "", h("a", { href: "#" + id, text: p.short })] : null;
          }))));
      } else {
        var q = Q[cur];
        body.appendChild(h("p", { class: "decide-q", text: q.q }));
        var opts = h("div", { class: "q-opts" });
        q.opts.forEach(function (o, i) {
          var b = h("button", { type: "button", class: "q-opt" }, h("span", { class: "ql", text: "ABCD"[i] }), h("span", { text: o[0] }));
          b.addEventListener("click", function () { path.push(o[1]); paint(); });
          opts.appendChild(b);
        });
        body.appendChild(opts);
      }
      if (path.length > 1) {
        var back = h("button", { type: "button", class: "btn small", text: "Back" });
        back.addEventListener("click", function () { path.pop(); paint(); });
        var restart = h("button", { type: "button", class: "btn small", text: "Start over" });
        restart.addEventListener("click", function () { path = ["start"]; paint(); });
        body.appendChild(h("div", { class: "row" }, back, restart));
      }
    }
    paint();
  });

  /* ---------------- Training cost calculator ---------------- */
  var GPUS = {
    t4: { name: "T4 (free Colab)", tflops: 65, price: 0.35 },
    a100: { name: "A100", tflops: 312, price: 2.0 },
    h100: { name: "H100", tflops: 989, price: 3.5 }
  };
  P.widget("traincost", function (root) {
    var logN = Math.log10(6.7e9), logD = 12, gpu = "a100", mfu = 40, price = GPUS.a100.price, count = 1024, chin = false;
    var readout = P.readout([
      { key: "flops", label: "Training compute" },
      { key: "hours", label: "GPU-hours" },
      { key: "cost", label: "Compute cost" },
      { key: "wall", label: "Wall-clock time" },
      { key: "ratio", label: "Tokens per parameter" }
    ]);
    var sN = P.slider({ id: "tc-n", label: "Parameters", min: 7, max: 12, step: 0.02, value: logN, format: function (v) { return P.fmt.compact(Math.pow(10, v), 1); }, onInput: function (v) { logN = v; paint(); } });
    var sD = P.slider({ id: "tc-d", label: "Training tokens", min: 8, max: 13.3, step: 0.02, value: logD, format: function (v) { return P.fmt.compact(Math.pow(10, v), 1); }, onInput: function (v) { logD = v; chin = false; chinBtn.setAttribute("aria-pressed", "false"); paint(); } });
    var sM = P.slider({ id: "tc-mfu", label: "GPU utilization (MFU)", min: 15, max: 65, step: 1, value: mfu, format: function (v) { return v + "%"; }, onInput: function (v) { mfu = v; paint(); } });
    var sP = P.slider({ id: "tc-price", label: "Price per GPU-hour", min: 0.2, max: 8, step: 0.05, value: price, format: function (v) { return "$" + v.toFixed(2); }, onInput: function (v) { price = v; paint(); } });
    var sC = P.slider({ id: "tc-count", label: "GPUs in parallel", min: 1, max: 4096, step: 1, value: count, onInput: function (v) { count = v; paint(); } });
    var gpuSeg = P.seg(Object.keys(GPUS).map(function (k) { return { value: k, label: GPUS[k].name }; }), gpu, function (v) { gpu = v; price = GPUS[v].price; sP.set(price); paint(); }, "GPU type");
    var chinBtn = h("button", { type: "button", class: "btn small", "aria-pressed": "false", text: "Set tokens = 20 × parameters" });
    chinBtn.addEventListener("click", function () { logD = logN + Math.log10(20); sD.set(logD); chin = true; chinBtn.setAttribute("aria-pressed", "true"); paint(); });
    var check = h("p", { class: "small muted" });
    root.appendChild(h("div", { class: "controls" }, sN, sD));
    root.appendChild(h("div", { class: "row" }, chinBtn));
    root.appendChild(h("div", { class: "control" }, h("span", { class: "lbl", text: "GPU" }), gpuSeg));
    root.appendChild(h("div", { class: "controls" }, sM, sP, sC));
    var plainT = h("p", { class: "fig-plain", "aria-live": "polite" });
    root.appendChild(readout);
    root.appendChild(plainT);
    root.appendChild(check);
    function paint() {
      if (chin) { logD = logN + Math.log10(20); sD.set(logD); }
      var N = Math.pow(10, logN), D = Math.pow(10, logD), C = 6 * N * D;
      var hours = C / (GPUS[gpu].tflops * 1e12 * (mfu / 100) * 3600);
      readout.update("flops", P.fmt.sciHTML(C) + " FLOPs", "6 × N × D", true);
      readout.update("hours", P.fmt.compact(hours, 1), GPUS[gpu].name);
      readout.update("cost", P.fmt.money(hours * price), "compute only; staff and data extra");
      readout.update("wall", P.fmt.duration(hours / count), "on " + count.toLocaleString() + " GPUs, if it scaled perfectly");
      readout.update("ratio", (D / N).toFixed(D / N < 10 ? 1 : 0), D / N < 15 ? "below the Chinchilla rule" : D / N > 40 ? "inference-optimal territory" : "near Chinchilla-optimal");
      P.clear(plainT);
      plainT.appendChild(h("b", { text: "In plain words: " }));
      plainT.appendChild(document.createTextNode("A model with " + P.fmt.compact(N, 1) + " adjustable settings reading " + P.fmt.compact(D, 1) + " tokens needs about " + P.fmt.compact(hours, 1) + " hours of " + GPUS[gpu].name + " chip time. At $" + price.toFixed(2) + " an hour that is roughly " + P.fmt.money(hours * price) + ", or " + P.fmt.duration(hours / count) + " if you rent " + count.toLocaleString() + " chips at once. Real projects add 2–3× for experiments and failed runs."));
      check.textContent = "Sanity check: LLaMA-7B (6.7B parameters, 1T tokens) reported 82,432 A100 GPU-hours. This calculator gives about 89,500 at 40% utilization, so the rule of thumb holds within about 10%.";
    }
    paint();
  });

  /* ---------------- Serving memory calculator ---------------- */
  var SERVE = {
    l7: { name: "LLaMA-7B", params: 6.7e9, layers: 32, d: 4096 },
    l13: { name: "LLaMA-13B", params: 13e9, layers: 40, d: 5120 },
    l65: { name: "LLaMA-65B", params: 65.2e9, layers: 80, d: 8192 },
    g3: { name: "GPT-3 175B", params: 175e9, layers: 96, d: 12288 }
  };
  P.widget("servemem", function (root) {
    var model = "l7", bytes = 2, ctxLog = Math.log2(4096), batch = 8;
    var readout = P.readout([
      { key: "w", label: "Weights" },
      { key: "kv", label: "KV cache" },
      { key: "tot", label: "Total with ~10% overhead" },
      { key: "gpus", label: "80 GB GPUs needed" }
    ]);
    var modelSeg = P.seg(Object.keys(SERVE).map(function (k) { return { value: k, label: SERVE[k].name }; }), model, function (v) { model = v; paint(); }, "Model");
    var precSeg = P.seg([{ value: 4, label: "32-bit" }, { value: 2, label: "16-bit" }, { value: 1, label: "8-bit" }, { value: 0.5, label: "4-bit" }], bytes, function (v) { bytes = v; paint(); }, "Weight precision");
    var sCtx = P.slider({ id: "sm-ctx", label: "Context length (tokens)", min: 9, max: 15, step: 1, value: ctxLog, format: function (v) { return Math.pow(2, v).toLocaleString(); }, onInput: function (v) { ctxLog = v; paint(); } });
    var sB = P.slider({ id: "sm-b", label: "Users served at once", min: 1, max: 64, step: 1, value: batch, onInput: function (v) { batch = v; paint(); } });
    var note = h("p", { class: "small muted" });
    root.appendChild(h("div", { class: "controls" },
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Model" }), h("div", { class: "scroll-x" }, modelSeg)),
      h("div", { class: "control" }, h("span", { class: "lbl", text: "Weight precision" }), precSeg)));
    root.appendChild(h("div", { class: "controls" }, sCtx, sB));
    var plainS = h("p", { class: "fig-plain", "aria-live": "polite" });
    root.appendChild(readout);
    root.appendChild(plainS);
    root.appendChild(note);
    function paint() {
      var m = SERVE[model], ctx = Math.pow(2, ctxLog);
      var w = m.params * bytes;
      var kvPerTok = 2 * m.layers * m.d * 2;
      var kv = kvPerTok * ctx * batch;
      var tot = (w + kv) * 1.1;
      readout.update("w", P.fmt.bytes(w), m.name + " at " + (bytes * 8) + "-bit");
      readout.update("kv", P.fmt.bytes(kv), P.fmt.bytes(kvPerTok) + " per token, per user");
      readout.update("tot", P.fmt.bytes(tot));
      readout.update("gpus", String(Math.ceil(tot / 80e9)), tot > 80e9 ? "split across GPUs (tensor parallel)" : "fits on one GPU");
      P.clear(plainS);
      plainS.appendChild(h("b", { text: "In plain words: " }));
      plainS.appendChild(document.createTextNode("The model itself takes " + P.fmt.bytes(w) + " just to load. Each of the " + batch + " users being served at once needs working memory for their conversation, " + P.fmt.bytes(kv) + " in total at " + ctx.toLocaleString() + " tokens each. " + (tot > 80e9 ? "That is more than one 80 GB graphics chip holds, so you would need " + Math.ceil(tot / 80e9) + " chips working together." : "That fits on a single 80 GB graphics chip.")));
      note.textContent = "KV cache = 2 (keys and values) × layers × model width × 2 bytes, per token per user. It is why long contexts and many simultaneous users get expensive. Newer models shrink it with grouped-query attention, so treat this as an upper bound.";
    }
    paint();
  });
})();
