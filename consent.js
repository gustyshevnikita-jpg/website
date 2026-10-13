// Cookie / local storage notice. This site only uses strictly necessary storage
// (cart contents and this choice), which does not require opt-in under the ePrivacy
// rules. If you add analytics, ads or embeds, make this an opt-in banner first.
(() => {
  const KEY = "cookie-notice-ack";
  const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const set = () => { try { localStorage.setItem(KEY, "1"); } catch {} };
  const show = () => {
    if (document.getElementById("cookieNotice")) return;
    const el = document.createElement("div");
    el.className = "cookie"; el.id = "cookieNotice"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Cookie notice");
    el.innerHTML = '<p>We only use strictly necessary browser storage (to remember your cart and this notice). No tracking or advertising cookies. See our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Policy</a>.</p><button class="btn primary" type="button">Got it</button>';
    el.querySelector("button").onclick = () => { set(); el.remove(); };
    document.body.appendChild(el);
  };
  if (!get()) show();
  document.addEventListener("click", (e) => { if (e.target.id === "cookieSettings") { e.preventDefault(); show(); } });
})();
