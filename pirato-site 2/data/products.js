/**
 * PIRATO — Product catalog
 *
 * HOW TO GO LIVE:
 * 1. In your Stripe Dashboard, go to Product catalog → add a product for each
 *    item below (same name/price), then create a Payment Link for it
 *    (Payment links → + New).
 * 2. Copy the generated https://buy.stripe.com/... URL and paste it into
 *    the matching `stripeLink` field below, replacing the placeholder.
 * 3. If you want to collect size at checkout, add a custom field named
 *    "Size" to the Payment Link in Stripe (Payment Link → Collect
 *    additional information → Custom fields).
 * 4. No API keys or backend needed — Payment Links are safe to use
 *    directly in static HTML/JS.
 */

const PRODUCTS = [
  {
    id: "shark-tee-oversized",
    name: "Shark Tee — Oversized",
    price: 52,
    description: "300 GSM heavyweight cotton, boxy oversized fit, full-chest puff-print shark mark. Custom neck print — no tag, no itch, all comfort.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "images/product-tee-shark.jpg"
    ],
    stripeLink: "https://buy.stripe.com/REPLACE_WITH_SHARK_TEE_LINK"
  },
  {
    id: "wordmark-tee-oversized",
    name: "Wordmark Tee — Oversized",
    price: 52,
    description: "Same 300 GSM build, same oversized box fit — this one carries the full brush-stroke PIRATO wordmark front and center.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "images/product-tee-wordmark.jpg"
    ],
    stripeLink: "https://buy.stripe.com/REPLACE_WITH_WORDMARK_TEE_LINK"
  },
  {
    id: "shark-tee-small-logo",
    name: "Shark Tee — Small Logo",
    price: 48,
    description: "The understated version — same heavyweight cotton and oversized fit, with a small chest-logo hit instead of the full graphic.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "images/product-tee-small.jpg"
    ],
    stripeLink: "https://buy.stripe.com/REPLACE_WITH_SMALL_LOGO_TEE_LINK"
  },
  {
    id: "shark-performance-shorts",
    name: "Shark 2-in-1 Performance Shorts",
    price: 64,
    description: "Built-in compression liner, secure phone pocket, moisture-wicking 4-way stretch fabric. Elastic waistband with premium drawcord. Gym to street, no limits.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "images/product-shorts.jpg"
    ],
    stripeLink: "https://buy.stripe.com/REPLACE_WITH_SHORTS_LINK"
  },
  {
    id: "rain-hoodie",
    name: "Rain Hoodie",
    price: 138,
    description: "Waterproof, windproof, breathable. Adjustable hood, waterproof zippers, adjustable cuffs. Engineered for performance, designed for the streets.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "images/product-hoodie.jpg"
    ],
    stripeLink: "https://buy.stripe.com/REPLACE_WITH_HOODIE_LINK"
  }
];
