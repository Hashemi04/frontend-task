# فروشگاه — frontend take-home

RTL Persian storefront: product list with URL-driven filters, crawlable pagination, and a product detail page. Built with Nuxt 4, Vue 3, TypeScript, and Tailwind CSS v4.

Live: <https://frontend-task-maz.vercel.app/>

Desktop layout follows the given mock as the visual contract. Fake Store is the data contract: English category names, real titles, and the `{ id, title, price, description, category, image, rating }` shape.

## Run

Node **22+** (`.nvmrc`) and [pnpm](https://pnpm.io) (lockfile is `pnpm-lock.yaml`).

```bash
nvm use
pnpm install
pnpm dev
```

App: [http://localhost:3000](http://localhost:3000)

```bash
pnpm lint          # ESLint (Nuxt flat config)
pnpm format        # Prettier write
pnpm format:check  # Prettier verify (what CI runs)
pnpm typecheck     # nuxt typecheck
pnpm test          # Vitest — filters, pagination, query parsing, JSON-LD, fixtures
pnpm test:e2e      # Playwright — search, pagination URLs, 404, robots/sitemap
```

`.github/workflows/ci.yml` runs all of the above plus a production build on every push.

### Building for production

The build **requires** an origin:

```bash
NUXT_PUBLIC_SITE_URL=https://frontend-task-maz.vercel.app pnpm build
pnpm preview
```

Canonical, `og:url`, sitemap and JSON-LD URLs are baked into prerendered HTML. Building without an origin would publish `http://localhost:3000` as this site's canonical origin, so the build **fails loudly** instead (`build/siteUrl.ts`). On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is picked up automatically. In dev the origin is `http://localhost:3000`.

### Upstream failures

Fake Store is a free demo API that rate-limits and 502s. Product **data** falls back to `data/catalog.json`. Product **images** are generated at `dev`/`build` into `public/images/` (gitignored) — they are a build artifact, not source. A missing local file does not fail the build: the `<img>` and JSON-LD `image` array fall back to the Fake Store URL.

| Consumer                                                 | On upstream failure                                         |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Prerender route list (`build/catalog.ts`)                | Warns, uses the fixture                                     |
| Image generation (`scripts/generate-catalog-images.mjs`) | Warns; build continues; UI/JSON-LD use the remote URL       |
| `/api/products`, `/api/products/:id`                     | Warns, serves the fixture, sets `x-catalog-source: fixture` |

A genuine upstream `404` is still a `404` — only network and 5xx failures fall back.

## Routes

| Path                                                     | What you get                                                                  |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `/`                                                      | Catalog page 1: search, sort, categories, availability, pagination            |
| `/page/:n`                                               | Catalog page _n_. Real prerendered route, self-canonical. `/page/1` → `301 /` |
| `/products/:id`                                          | Detail: image, price, category, rating, description                           |
| `/consultation`, `/faq`, `/contact`                      | Real routes, placeholder copy                                                 |
| `/about`, `/blog`, `/after-sales`, `/terms`, `/feedback` | Footer placeholders, same pattern as FAQ                                      |
| `/sitemap.xml`, `/robots.txt`                            | Prerendered, origin-aware                                                     |
| anything else / unknown product id                       | `error.vue` — 404 as empty, other failures as error                           |

Unknown or non-integer `id` throws `createError({ statusCode: 404, fatal: true })`. «بازگشت به فهرست» on that screen uses `clearError({ redirect: '/' })`.

## Data

Catalog: `GET /api/products`. Detail: `GET /api/products/:id`. Both server routes proxy Fake Store behind a 10-minute SWR cache and the fixture fallback above. The client reaches them through `useAsyncData` (`products`, `product-${id}`). Filters run on the client after the list fetch. Retry calls `refresh()`.

Network / 5xx stays on the page (`status="error"` + retry), not a 404.

Price: `fa-IR` digits + `دلار` (`app/utils/format.ts`), on both the card and the detail row.

## URL state

Filters live in the query string, pagination lives in the path. No Pinia. Shareable, back-button friendly, crawlable.

| Param        | Example                            | Meaning                                                      |
| ------------ | ---------------------------------- | ------------------------------------------------------------ |
| `q`          | `?q=jacket`                        | Case-insensitive match on **title**                          |
| `sort`       | `?sort=rating-desc`                | `count-asc` \| `count-desc` \| `rating-asc` \| `rating-desc` |
| `categories` | `?categories=electronics,jewelery` | Comma-separated Fake Store names; unknown tokens ignored     |
| _(path)_     | `/page/2?q=jacket`                 | 1-based. Page 1 is `/`. Past the end clamps to the last page |

Default sort with **no** `sort` param is `count-asc`. That implicit default is **not** an applied chip. Selecting a sort in the UI writes `sort` and shows a chip.

Changing search, sort, category or availability navigates back to `/` — a narrower result set should never leave you on a page that no longer exists.

List page size is **9**. Pagination is hidden when the filtered set fits on one page. The page-size constant is shared between the app and the prerenderer, and a unit test keeps the two in sync.

## SEO

- **Pagination is navigable.** `<a href="/page/2">`, not a click handler: middle-clickable, shareable, crawlable, prerendered. Clean pages self-canonicalise and carry `rel="prev"` / `rel="next"`, with their own `<title>`.
- **Facets stay out of the index.** Any URL with `q`, `sort`, `categories`, or `available` is `noindex, follow` and canonicalises to `/`. `/page/2?q=jacket` must not claim it is `/page/2`.
- **Structured data.** `Product` + `Offer` + `AggregateRating` + `BreadcrumbList` on detail pages (`og:type=product`); `ItemList` of the visible page (with prices) on the catalog. `image` is `[same-origin webp, Fake Store source]` so a missed generate still has a crawlable URL.
- **Social.** `og:*` and `twitter:card` on every page, with `public/og-default.png` as the fallback image (regenerate with `node scripts/generate-og-image.mjs`).
- **Sitemap** lists `/`, every `/page/:n`, and every product URL with `lastmod` / `changefreq` / `priority`. Placeholder marketing pages are `noindex, follow` and stay out of it.

Two deliberate omissions in the structured data, because Fake Store does not carry the underlying facts:

- **No `brand`.** There is no brand field in the source data, and inventing one would put an unsupported claim in machine-readable markup.
- **`availability` is a stand-in.** Fake Store has no stock field, so odd product ids are treated as in stock. It keeps the «محصولات موجود» filter and `schema.org/InStock` consistent with each other, but against a real catalogue this would be a merchant policy violation — it is demo behaviour, not shippable behaviour.

## RTL and type

- `html lang="fa" dir="rtl"`
- Self-hosted Yekan Bakh (Persian digits) in `public/fonts/`
- Direction-aware chrome: start/end, sheet from the start edge, pagination reads right-to-left (page 1 on the right)

Category labels stay in English because that is what Fake Store returns. Translating them would fake a locale the API does not have.

## Layout

- **Desktop (`lg+`):** sticky filter column + product grid (3 columns)
- **Tablet (`md`):** 2-column grid, filters behind a sheet
- **Mobile:** 1-column grid, filter sheet from the bottom, search overlay from the top

The bottom sheet is expandable (drag the handle). Device back closes overlays without undoing a `replace` that happened while the sheet was open (filters applied inside it).

## Accessibility

- Focus trap and `Escape` on the filter sheet, search overlay, and image zoom
- Result count announced through a polite live region when filters change
- `aria-current="page"` on the current pagination page; disabled steps are not focusable
- Loading and error states carry `role="status"` / `role="alert"` and `aria-busy`

## Design decisions

### Compact header

The desktop mock header is about **120px**. This app uses **72px** on desktop and **56px** on mobile on purpose.

That mock height works as a static frame. In the live storefront the header stays on screen, and so do the filter column and the list toolbar. Stacking the mock height on top of those leaves almost no catalog in the first viewport.

The shorter bar still holds nav, search, and the contact action. More products visible before scroll is a UX call against the given artboard, not a missed measurement.

### Sticky list toolbar

The title / applied-filters pill stays under the header while the grid scrolls, so filter context does not disappear after a few rows.

### Pagination chrome

Mobile: prev / next and «صفحه ۱ از ۳». Tablet and desktop: numbered pills, current page in primary. Changing page scrolls the first card of the new page under the toolbar rather than jumping to the top of the document (`app/router.options.ts`), and respects `prefers-reduced-motion`.

### Detail specs: label and value in one box

The product mock paints each spec as **two** gray chips (label tile, then value tile). On a phone that is a stack of ten surfaces. The pair «قیمت» / amount stops feeling like one fact, and you scroll more for the same five fields.

Detail keeps **one** rounded row per field: label on the start edge, value on the end. You read it as a key–value, the way a spec sheet works, without a second box competing for the same line. Description stays in that same tile — label above, body below — because a Fake Store paragraph cannot sit on one line next to «توضیحات» without colliding with the label.

The mock's تومان figures and Persian dummy names stay on the artboard. The row still shows API English categories and `formatPrice` + دلار.

## What is invented (not in the desktop mock)

The assignment's desktop frame does not specify these; they are implemented so the storefront works as a product:

- Mobile/tablet filter sheet and header search overlay
- Applied-filter chips and clear actions
- Pagination
- Loading skeletons and in-page error + retry
- 404 vs in-page error
- Extra nav pages as placeholders
- Page enter from the top; list page keeps the grid animation only so filters do not slide

## Gaps (honest)

- **Consult / FAQ / contact / footer extras** are placeholders (`noindex`), not full pages.
- **Filtering is client-side.** Fine for a 20-product catalog; a real one needs server-side filtering, and the filtered result sets are not prerendered.
- **No component-level tests.** The catalog logic is extracted into pure functions (`filterProducts`, `paginate`) and unit tested; rendering is covered end-to-end instead of with a component test runner.

## Layout of the code

```
app/          Vue app — pages, components, composables, pure utils
build/        Build-time only: prerender route list, origin resolution
data/         Committed Fake Store snapshot used as the offline fallback
scripts/      Image + social-card generation
server/       Nitro API proxy, sitemap, robots
test/unit     Vitest over pure functions
test/e2e      Playwright over the built app
```

## Stack

Nuxt `^4.5`, Vue `^3.5`, Tailwind CSS `^4.3`, `@nuxt/image`, TypeScript. URL state in `app/composables/useProductFilters.ts`, catalog view in `app/components/catalog/CatalogView.vue`.
