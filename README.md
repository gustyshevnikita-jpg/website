# AgentForge — AI agent storefront

Static site (no build step). Open `index.html` or run `python3 -m http.server`.

## Make it yours
- **Products**: edit the `AGENTS` array at the top of `app.js` (name, price, description).
- **Payments**: create a Stripe Payment Link per agent and paste it in that agent's `checkout` field. Multi-item carts need a backend (Stripe Checkout session) — not included.
- **Contact form**: create a form at formspree.io and replace `YOUR_FORM_ID` in `index.html`.
- **Brand**: rename "AgentForge" in `index.html`; colours are CSS variables in `styles.css`.
- **Hosting**: GitHub Pages, Netlify, Vercel or Cloudflare Pages all work as-is.
