# Monèshrey website revamp (demo)

Redesigned storefront for moneshrey.in by Inloop Media, built from the website revamp brief. Static HTML, CSS and JavaScript, deployed on Vercel.

## Pages

| URL | File | What it is |
|---|---|---|
| `/` | `index.html` | Homepage: hero, trust strip, line-up, try-on, The Trio, formula, reviews, reels, story, FAQ |
| `/shop` | `shop.html` | Shade wall with Nudes / Pinks / Browns / Bolds filters (`/shop?family=browns`) |
| `/shades/<shade>` | `product.html` | One template for all 8 shades, e.g. `/shades/nude-eclipse` |
| `/trio` | `trio.html` | Build your trio, any 3 for ₹999 (`/trio?with=<shade>` pre-selects one) |
| `/find-your-shade` | `find-your-shade.html` | 3-question shade quiz |
| `/about` | `about.html` | Brand story |
| `/contact` | `contact.html` | WhatsApp, email, contact form |
| `/help` | `help.html` | Track order, shipping, returns, cancellation, FAQ |

Clean URLs and the `/shades/*` route come from `vercel.json`.

## Shared files

- `assets/site.css`: all styles. Spacing is controlled by `--sec`, `--pad` and `--head` at the top.
- `assets/site.js`: shade data, header, menu, bag (saved in the browser), footer and WhatsApp button.
  **Store settings** (WhatsApp number, COD, free-shipping limit, delivery days, email, phone) are in `CFG` at the top.
- `assets/home.js`: homepage-only behaviour.
- `images/`: retouched photography as responsive WebP (colour untouched).

## Preview locally

Pages use root-relative paths, so serve the folder rather than opening the file:

```
npx vercel dev
```

## Demo content to replace before launch

- Sample reviews (connect Judge.me), story copy on Home and About, the quiz matching table in `find-your-shade.html`.
- Items marked "to be added" on the product and Help pages: ingredient list, skin-tone swatches, policy texts.
