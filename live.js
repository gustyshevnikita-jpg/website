// Simulated live charts and activity feed. Data is generated in the browser for
// illustration only — it is NOT real customer data (the page says so).
(() => {
  const $ = (s) => document.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dash = $("#dash");
  if (!dash) return;

  // ---- line chart (streaming) ----
  const N = 36, W = 600, H = 220, PAD = 20;
  let data = Array.from({ length: N }, (_, i) => 55 + 18 * Math.sin(i / 3.2) + Math.random() * 10);
  const line = $("#lcLine"), area = $("#lcArea"), dot = $("#lcDot");
  const y = (v) => H - PAD - ((v - 20) / 80) * (H - 2 * PAD);
  function draw() {
    const pts = data.map((v, i) => [(i / (N - 1)) * W, y(v)]);
    // smooth path (Catmull-Rom -> cubic bezier)
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    line.setAttribute("d", d);
    area.setAttribute("d", `${d} L${W},${H} L0,${H} Z`);
    const last = pts[pts.length - 1];
    dot.style.left = (last[0] / W) * 100 + "%";
    dot.style.top = (last[1] / H) * 100 + "%";
  }
  const step = () => {
    const last = data[data.length - 1];
    data.push(Math.max(25, Math.min(95, last + (Math.random() - 0.5) * 22)));
    data.shift();
    draw();
  };
  draw();

  // ---- bars ----
  const bars = $("#bars"), days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let vals = [62, 78, 70, 92, 85, 40, 34];
  bars.innerHTML = days.map((d, i) => `<rect class="bar" x="${14 + i * 38}" y="140" width="24" height="0" rx="7"/><text x="${26 + i * 38}" y="156" text-anchor="middle" font-size="10" fill="#5d6280">${d}</text>`).join("");
  const rects = [...bars.querySelectorAll(".bar")];
  const setBars = () => rects.forEach((r, i) => { const h = vals[i] * 1.2; r.setAttribute("height", h); r.setAttribute("y", 140 - h); });

  // ---- donut + counters ----
  const arc = $("#donutArc"), dtext = $("#donutText"), C = 2 * Math.PI * 48;
  const animateNumber = (el, to, ms, fmt) => {
    if (still) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const tick = (t) => { const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(to * e)); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  function intro() {
    setBars();
    const pct = 87;
    arc.style.transition = still ? "none" : "stroke-dasharray 1.6s cubic-bezier(.2,.7,.2,1)";
    arc.setAttribute("stroke-dasharray", `${(pct / 100) * C} ${C}`);
    animateNumber(dtext, pct, 1600, (n) => n + "%");
    dash.querySelectorAll("[data-count]").forEach((el) => {
      const suf = el.dataset.suffix || "";
      animateNumber(el, +el.dataset.count, 1800, (n) => n.toLocaleString("en-US") + suf);
    });
  }

  // ---- activity feed ----
  const feed = $("#feed");
  const EVENTS = [
    ["🎧", "Support Agent", "answered a customer ticket"], ["📬", "Inbox Manager", "sorted 14 new emails"],
    ["📈", "Sales Outreach", "drafted 3 follow-ups"], ["🔎", "Research Analyst", "finished a market brief"],
    ["🧾", "Bookkeeping Aide", "categorised 27 transactions"], ["✍️", "Content Writer", "drafted a newsletter"],
    ["📊", "Data Analyst", "built a weekly report"], ["🧑‍💼", "Recruiting Screener", "ranked 9 applicants"],
  ];
  let ei = 0;
  function addEvent() {
    const [ic, who, what] = EVENTS[ei++ % EVENTS.length];
    const li = document.createElement("li");
    li.innerHTML = `<span class="fi">${ic}</span><span><strong>${who}</strong> ${what}</span><time>just now</time>`;
    feed.prepend(li);
    while (feed.children.length > 5) feed.lastChild.remove();
    [...feed.children].forEach((c, i) => { if (i) c.querySelector("time").textContent = i * 7 + "s ago"; });
  }
  for (let i = 0; i < 4; i++) addEvent();

  // ---- start when visible; pause when offscreen ----
  let timers = [];
  const start = () => {
    if (still || timers.length) return;
    timers = [setInterval(step, 1400), setInterval(addEvent, 2600),
      setInterval(() => { vals = vals.map((v) => Math.max(25, Math.min(100, v + (Math.random() - 0.5) * 14))); setBars(); }, 2600)];
  };
  const stop = () => { timers.forEach(clearInterval); timers = []; };
  let introDone = false;
  new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { if (!introDone) { introDone = true; intro(); } start(); } else stop();
  }), { threshold: 0.2 }).observe(dash);
  if (!("IntersectionObserver" in window)) { intro(); start(); }
})();
