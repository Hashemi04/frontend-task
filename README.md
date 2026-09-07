# فروشگاه — frontend take-home

RTL Persian storefront: product list with URL filters, pagination, and a product detail page. Built with Nuxt 4, Vue 3, TypeScript, and Tailwind CSS v4.

Desktop layout follows the given mock as the visual contract. Fake Store is the data contract: English category names, real titles, and the `{ id, title, price, description, category, image, rating }` shape.

## Run

Node 20+ and [pnpm](https://pnpm.io) (lockfile is `pnpm-lock.yaml`).

```bash
pnpm install
pnpm dev
```

App: [http://localhost:3000](http://localhost:3000)

```bash
pnpm build
pnpm preview
pnpm lint
pnpm test
```

`pnpm lint` uses the Nuxt ESLint flat config. `pnpm test` runs Vitest on catalog query helpers (sort defaults, page clamp, category parse, URL page reset).

## Routes

| Path | What you get |
| --- | --- |
| `/` | Catalog: search, sort, categories, pagination |
| `/products/:id` | Detail: image, price, category, rating, description |
| `/consultation`, `/faq`, `/contact` | Real routes, placeholder copy |
| anything else / unknown product id | `error.vue` — 404 as empty, other failures as error |

Unknown or non-integer `id` throws `createError({ statusCode: 404, fatal: true })`. «بازگشت به فهرست» on that screen uses `clearError({ redirect: '/' })`.

## Data

Catalog: `GET https://fakestoreapi.com/products`. Detail: `GET https://fakestoreapi.com/products/:id`. Both go through `useAsyncData` (`products`, `product-${id}`) and `$fetch`. Filters still run on the client after the list fetch. Retry calls `refresh()`.

A missing or garbage id is `createError({ statusCode: 404, fatal: true })`. Network / 5xx stays on the page (`status="error"` + retry), not a 404.

Price on detail: `fa-IR` digits + `دلار` (`app/utils/format.ts`).

## Query params

Filters live in the URL. No Pinia. Shareable, back-button friendly. Changing search, sort, or category drops `page`.

| Param | Example | Meaning |
| --- | --- | --- |
| `q` | `?q=jacket` | Case-insensitive match on **title** |
| `sort` | `?sort=rating-desc` | `count-asc` \| `count-desc` \| `rating-asc` \| `rating-desc` |
| `categories` | `?categories=electronics,jewelery` | Comma-separated Fake Store names; unknown tokens ignored |
| `page` | `?page=2` | 1-based. Page 1 omits the param. Out of range clamps |

Default sort with **no** `sort` param is `count-asc`. That implicit default is **not** an applied chip. Selecting a sort in the UI writes `sort` and shows a chip.

List page size is **9**. Pagination is hidden when the filtered set fits on one page.

Price on detail: `fa-IR` digits + `دلار` (`app/utils/format.ts`).

## RTL and type

- `html lang="fa" dir="rtl"`
- Yekan Bakh (Persian digits) from jsDelivr
- Direction-aware chrome: start/end, sheet from the start edge, pagination reads right-to-left (page 1 on the right)

Category labels stay in English because that is what Fake Store returns. Translating them would fake a locale the API does not have.

## Layout

- **Desktop (`lg+`):** sticky filter column + product grid (3 columns)
- **Tablet (`md`):** 2-column grid, filters behind a sheet
- **Mobile:** 1-column grid, filter sheet from the bottom, search overlay from the top

The bottom sheet is expandable (drag the handle). Device back closes overlays without undoing a `replace` that happened while the sheet was open (filters applied inside it).

## Design decisions

### Compact header

The desktop mock header is about **120px**. This app uses **72px** on desktop and **56px** on mobile on purpose.

That mock height works as a static frame. In the live storefront the header stays on screen, and so do the filter column and the list toolbar. Stacking the mock height on top of those leaves almost no catalog in the first viewport.

The shorter bar still holds nav, search, and the contact action. More products visible before scroll is a UX call against the given artboard, not a missed measurement.

### Sticky list toolbar

The title / applied-filters pill stays under the header while the grid scrolls, so filter context does not disappear after a few rows.

### Pagination chrome

Mobile: prev / next and «صفحه ۱ از ۳». Tablet and desktop: numbered pills, current page in primary.

### Detail specs: label and value in one box

The product mock paints each spec as **two** gray chips (label tile, then value tile). On a phone that is a stack of ten surfaces. The pair «قیمت» / amount stops feeling like one fact, and you scroll more for the same five fields.

Detail keeps **one** rounded row per field: label on the start edge, value on the end. You read it as a key–value, the way a spec sheet works, without a second box competing for the same line. Description stays in that same tile — label above, body below — because a Fake Store paragraph cannot sit on one line next to «توضیحات» without colliding with the label.

The mock’s تومان figures and Persian dummy names stay on the artboard. The row still shows API English categories and `formatPrice` + دلار.

## What is invented (not in the desktop mock)

The assignment’s desktop frame does not specify these; they are implemented so the storefront works as a product:

- Mobile/tablet filter sheet and header search overlay
- Applied-filter chips and clear actions
- Pagination
- Loading skeletons and in-page error + retry (wired to Fake Store)
- 404 vs in-page error
- Extra nav pages as placeholders
- Page enter from the top; list page keeps the grid animation only so filters do not slide

## Gaps (honest)

- **Consult / FAQ / contact** are placeholders, not full pages.
- Product cards do not show price (detail does).
- JSON-LD `ItemList` lists the full fetched catalog, not the filtered page.

## Stack

Nuxt `^4.5`, Vue `^3.5`, Tailwind CSS `^4.3`, TypeScript. URL state in `app/composables/useProductFilters.ts`.
