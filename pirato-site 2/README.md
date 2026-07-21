# Pirato — Built Different

A single-page promo site for the Pirato streetwear brand. Dark, rain-soaked, built from the brand's own lookbook photography.

## Structure

```
.
├── index.html          # landing page
├── shop.html            # product grid + quick view + cart drawer
├── css/
│   ├── styles.css       # shared site styles
│   └── shop.css         # shop-specific styles (grid, modal, cart)
├── js/
│   ├── main.js           # landing page: scroll reveals + hero rain animation
│   └── shop.js            # shop: product rendering, quick view, cart (localStorage)
├── data/
│   └── products.js       # product catalog + Stripe Payment Link URLs
└── images/               # lookbook photography used across the site
    ├── hero-car.jpg
    ├── droplets.jpg
    ├── jacket-detail.jpg
    ├── hood-closeup.jpg
    ├── shirt-logo.jpg
    ├── street-walk.jpg
    ├── gym-1.jpg
    ├── gym-2.jpg
    ├── gym-3.jpg
    ├── gym-4.jpg
    ├── shorts-detail.jpg
    └── skyline-portrait.jpg
```

## Setting up real checkout (Stripe Payment Links)

This shop has no backend and no API keys in the code — checkout runs entirely
through [Stripe Payment Links](https://stripe.com/payments/payment-links), which
are safe to link to directly from static HTML.

1. Create a free Stripe account if you don't have one.
2. In the Stripe Dashboard, go to **Product catalog** and add a product for
   each item in `data/products.js` (same name and price).
3. For each product, click **Create payment link**. Turn on **Adjustable
   quantity** if you want customers to change quantity at checkout.
   Optional: under **Collect additional information → Custom fields**, add a
   "Size" field so size shows up on the order.
4. Copy each generated `https://buy.stripe.com/...` URL and paste it into
   the matching `stripeLink` field in `data/products.js`.
5. Switch your Stripe account out of test mode when you're ready to accept
   real payments (top-left toggle in the Dashboard).

**Why "Buy Now" per product instead of one combined cart checkout:**
Stripe Payment Links are built to check out a single product. Combining
multiple different products into one checkout requires a server that calls
Stripe's Checkout Sessions API with a secret key — which this static site
intentionally doesn't have, so nothing sensitive ever ships to the browser.
The bag still lets shoppers collect several items and see a running
subtotal; at checkout, each distinct product gets its own secure Stripe
button. If you outgrow this later, the natural next step is a small serverless
function (e.g. a Cloudflare Worker or Vercel function) that creates a single
Checkout Session for the whole bag.

## Run it locally

No build step — it's plain HTML/CSS/JS. Any static server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repo (see commands below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Pick the `main` branch and `/ (root)` folder, then **Save**.
5. GitHub will publish the site at `https://<username>.github.io/<repo-name>/` within a minute or two.

```bash
git init
git add .
git commit -m "Initial commit: Pirato promo site"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

## Notes

- Fonts (Anton, Barlow Condensed, Rock Salt) load from Google Fonts via `<link>` tags in `index.html` — no local font files needed.
- Images are already sized/cropped for their sections; swap them out by replacing files of the same name in `images/`.
- `main.js` respects `prefers-reduced-motion` and disables the rain animation loop for users who have that setting on.
