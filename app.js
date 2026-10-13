// Edit this list to change what you sell. `checkout` is a payment link
// (e.g. a Stripe Payment Link) — leave empty to use the cart-based demo flow.
const AGENTS = [
  { id: "support",  icon: "🎧", name: "Support Agent",   cat: "Support",    price: 79, desc: "Answers customer tickets from your help docs, escalates the tricky ones.", checkout: "" },
  { id: "sdr",      icon: "📈", name: "Sales Outreach",  cat: "Sales",      price: 99, desc: "Researches leads and drafts personalised outreach and follow-ups.", checkout: "" },
  { id: "research", icon: "🔎", name: "Research Analyst",cat: "Research",   price: 69, desc: "Searches the web, reads sources and delivers cited briefings.", checkout: "" },
  { id: "inbox",    icon: "📬", name: "Inbox Manager",   cat: "Operations", price: 49, desc: "Triages email, drafts replies and flags what needs you.", checkout: "" },
  { id: "content",  icon: "✍️", name: "Content Writer",  cat: "Marketing",  price: 59, desc: "Turns a brief into blog posts, social posts and newsletters in your voice.", checkout: "" },
  { id: "books",    icon: "🧾", name: "Bookkeeping Aide",cat: "Operations", price: 89, desc: "Categorises transactions, chases invoices and preps month-end.", checkout: "" },
  { id: "recruit",  icon: "🧑‍💼", name: "Recruiting Screener", cat: "Operations", price: 84, desc: "Screens résumés against your criteria and ranks candidates.", checkout: "" },
  { id: "data",     icon: "📊", name: "Data Analyst",    cat: "Research",   price: 119, desc: "Ask questions in plain English; get queries, charts and answers.", checkout: "" },
];

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n;
let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart") || "[]"); } catch {}
let activeCat = "All";

function renderFilters() {
  const cats = ["All", ...new Set(AGENTS.map((a) => a.cat))];
  $("#filters").innerHTML = cats.map((c) =>
    `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
}

function renderGrid() {
  const list = AGENTS.filter((a) => activeCat === "All" || a.cat === activeCat);
  $("#grid").innerHTML = list.map((a) => `
    <article class="card">
      <div class="icon">${a.icon}</div>
      <span class="tag">${a.cat}</span>
      <h3>${a.name}</h3>
      <p>${a.desc}</p>
      <footer><span class="price">${money(a.price)}<small>/mo</small></span>
        <button class="btn primary" data-add="${a.id}">Add to cart</button></footer>
    </article>`).join("");
}

function saveCart() {
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch {}
  const items = cart.map((id) => AGENTS.find((a) => a.id === id)).filter(Boolean);
  $("#cartCount").textContent = items.length;
  $("#cartTotal").textContent = money(items.reduce((s, a) => s + a.price, 0));
  $("#cartItems").innerHTML = items.length
    ? items.map((a) => `<li><span>${a.icon} ${a.name} — ${money(a.price)}</span><button data-remove="${a.id}" aria-label="Remove ${a.name}">✕</button></li>`).join("")
    : "<li>Your cart is empty.</li>";
}

function toggleCart(open) {
  $("#drawer").classList.toggle("open", open);
  $("#scrim").classList.toggle("show", open);
  $("#drawer").setAttribute("aria-hidden", String(!open));
}

document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.cat) { activeCat = t.dataset.cat; renderFilters(); renderGrid(); }
  if (t.dataset.add && !cart.includes(t.dataset.add)) { cart.push(t.dataset.add); saveCart(); toggleCart(true); }
  if (t.dataset.remove) { cart = cart.filter((id) => id !== t.dataset.remove); saveCart(); }
});
$("#cartBtn").onclick = () => toggleCart(true);
$("#closeCart").onclick = $("#scrim").onclick = () => toggleCart(false);

$("#checkout").onclick = () => {
  const items = cart.map((id) => AGENTS.find((a) => a.id === id)).filter(Boolean);
  if (!items.length) return;
  // Single item with a payment link -> go straight to it.
  if (items.length === 1 && items[0].checkout) { location.href = items[0].checkout; return; }
  alert("Payments aren't connected yet. Add a Stripe Payment Link to each agent's `checkout` field in app.js (see README).");
};

$("#contactForm").addEventListener("submit", async (e) => {
  const form = e.target;
  if (form.action.includes("YOUR_FORM_ID")) { e.preventDefault(); $("#formNote").textContent = "Form not connected yet — set your Formspree ID in index.html."; return; }
  e.preventDefault();
  try {
    const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    $("#formNote").textContent = r.ok ? "Thanks! We'll be in touch soon." : "Something went wrong. Please try again.";
    if (r.ok) form.reset();
  } catch { $("#formNote").textContent = "Network error. Please try again."; }
});

$("#year").textContent = new Date().getFullYear();
renderFilters(); renderGrid(); saveCart();

// ---- Hero slider (auto-advances, pauses on hover) ----
(() => {
  const root = $("#slider"), slides = [...root.querySelectorAll(".slide")], dots = $("#dots");
  let i = 0, timer;
  dots.innerHTML = slides.map((_, n) => `<button aria-label="Go to slide ${n + 1}"></button>`).join("");
  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
  };
  const play = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 5500); };
  dots.onclick = (e) => { const k = [...dots.children].indexOf(e.target); if (k > -1) { show(k); play(); } };
  root.querySelector(".prev").onclick = () => { show(i - 1); play(); };
  root.querySelector(".next").onclick = () => { show(i + 1); play(); };
  root.onmouseenter = () => clearInterval(timer);
  root.onmouseleave = play;
  show(0); play();
})();

// ---- Scroll reveal ----
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  els.forEach((e) => io.observe(e));
})();
