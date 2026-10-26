// "Run a sample task" — a SCRIPTED walkthrough. No AI/API call is made; the page says so.
(() => {
  const $ = (s) => document.querySelector(s);
  if (!$("#tryAgents")) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, still ? 0 : ms));

  const DEMO = [
    { id: "support", icon: "🎧", name: "Support Agent", tasks: [
      { t: "Answer a refund question", steps: ["Reading the customer's message", "Searching help-centre articles", "Checking the refund policy", "Drafting a reply"],
        out: "Hi Sam — thanks for reaching out! Your order qualifies for a full refund within 30 days of purchase. I've started it, and you'll see the money back on your card in 5–10 business days. Anything else I can help with?" },
      { t: "Triage an angry ticket", steps: ["Detecting tone and urgency", "Looking up the customer's history", "Tagging as 'Billing · High priority'", "Escalating to a human with a summary"],
        out: "Escalated to your billing team. Summary: customer charged twice on 14 Oct, third contact this month, tone frustrated. Suggested next step: apologise, refund the duplicate charge." } ] },
    { id: "sdr", icon: "📈", name: "Sales Outreach", tasks: [
      { t: "Draft a first email", steps: ["Reading the lead's company page", "Finding a relevant talking point", "Matching your product to their need", "Writing a short, personal email"],
        out: "Subject: Quick idea for Northwind's onboarding\n\nHi Priya — saw you're hiring three support reps this quarter. Teams at that stage often cut ticket backlog with an AI agent handling the repetitive questions. Worth a 15-minute look next week?" } ] },
    { id: "research", icon: "🔎", name: "Research Analyst", tasks: [
      { t: "Brief me on a market", steps: ["Planning search queries", "Reading 12 sources", "Cross-checking key claims", "Writing a cited summary"],
        out: "Summary (sample): The market is growing steadily, driven by three trends — automation of routine work, falling model costs, and demand for faster support. Key risks: regulation and data privacy. Sources would be listed and linked here." } ] },
    { id: "inbox", icon: "📬", name: "Inbox Manager", tasks: [
      { t: "Triage this morning's email", steps: ["Scanning 42 new messages", "Grouping newsletters and receipts", "Spotting what needs a reply", "Drafting 3 replies for review"],
        out: "Done. 31 low-priority items filed, 8 need no action, 3 need you: the contract from Alex (due Friday), a meeting request from Mia, and an invoice question. Replies drafted — nothing is sent until you approve." } ] },
  ];
  let cur = 0, task = 0, running = false, token = 0;

  function renderTabs() {
    $("#tryAgents").innerHTML = DEMO.map((a, i) => `<button class="tab ${i === cur ? "on" : ""}" role="tab" aria-selected="${i === cur}" data-a="${i}">${a.icon} ${a.name}</button>`).join("");
    $("#tryTasks").innerHTML = DEMO[cur].tasks.map((t, i) => `<button class="task ${i === task ? "on" : ""}" data-t="${i}">${t.t}</button>`).join("");
  }
  function reset() {
    token++; running = false;
    $("#runSteps").innerHTML = ""; $("#runResult").innerHTML = ""; $("#runResult").classList.remove("show");
    $("#runIdle").style.display = ""; $("#runTitle").textContent = "Ready";
    $("#tryRun").disabled = false; $("#tryRun").textContent = "▶ Run sample task";
  }

  async function run() {
    if (running) return;
    reset(); running = true; const me = token;
    const a = DEMO[cur], t = a.tasks[task];
    $("#runIdle").style.display = "none"; $("#tryRun").disabled = true; $("#tryRun").textContent = "Working…";
    $("#runTitle").textContent = `${a.name} · ${t.t}`;
    const ol = $("#runSteps");
    for (const s of t.steps) {
      if (me !== token) return;
      const li = document.createElement("li"); li.className = "active";
      li.innerHTML = `<span class="spin"></span><span>${s}</span>`; ol.appendChild(li);
      await wait(950);
      if (me !== token) return;
      li.className = "done"; li.firstElementChild.outerHTML = '<span class="ck">✓</span>';
    }
    // type out the result
    const box = $("#runResult"); box.classList.add("show");
    box.innerHTML = `<small>Result — ready for your review</small><p></p>`;
    const p = box.querySelector("p");
    if (still) p.textContent = t.out;
    else for (let i = 1; i <= t.out.length; i++) { if (me !== token) return; p.textContent = t.out.slice(0, i); await wait(16); }
    running = false; $("#tryRun").disabled = false; $("#tryRun").textContent = "↻ Run again";
  }

  $("#tryAgents").onclick = (e) => { const b = e.target.closest("[data-a]"); if (!b) return; cur = +b.dataset.a; task = 0; renderTabs(); reset(); };
  $("#tryTasks").onclick = (e) => { const b = e.target.closest("[data-t]"); if (!b) return; task = +b.dataset.t; renderTabs(); reset(); };
  $("#tryRun").onclick = run;
  renderTabs();
})();

// ---- Agent-card hover: 3D tilt + moving glow (event delegation; cards are re-rendered) ----
(() => {
  const grid = document.querySelector("#grid");
  if (!grid || matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(hover: none)").matches) return;
  grid.addEventListener("pointermove", (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--rx", ((0.5 - y) * 8).toFixed(2) + "deg");
    c.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
    c.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  });
  grid.addEventListener("pointerout", (e) => {
    const c = e.target.closest(".card"); if (!c || c.contains(e.relatedTarget)) return;
    c.style.removeProperty("--rx"); c.style.removeProperty("--ry");
  });
})();
