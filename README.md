# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Design decisions

### Compact header

The Figma / desktop mock header is about **120px** tall. This app uses **72px** on desktop and **56px** on mobile on purpose.

That mock height works as a static frame. In the live storefront the header stays on screen (sticky), and so do the filter column and the list toolbar (`لیست محصولات` / applied chips). Stacking the mock height on top of those would leave a thin strip of catalog visible. People came to scan products, not chrome.

The shorter bar still holds nav, search, and the contact action. It improves the scan: more products in the first viewport, less jumping when filters stay pinned, and a calmer scroll on laptop heights. This is a UI/UX trade against the given artboard, not a missed measurement.

### Sticky list toolbar

The title / applied-filters pill on the catalog page stays under the header while the grid scrolls, so the current filter context does not disappear after a few rows.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
