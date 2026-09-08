import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Build-time catalog access. Fake Store is a free demo API that rate-limits
 * and 502s, so nothing here is allowed to fail the build: every network read
 * falls back to the committed `data/catalog.json` snapshot.
 */
const FAKE_STORE_PRODUCTS_URL = "https://fakestoreapi.com/products";
const FETCH_TIMEOUT_MS = 10_000;

/** Kept in sync with `PAGE_SIZE` in `app/utils/productQuery.ts` (see prerender tests). */
export const CATALOG_PAGE_SIZE = 9;

export const CATALOG_FIXTURE_PATH = fileURLToPath(
  new URL("../data/catalog.json", import.meta.url),
);

export function readCatalogFixture(): unknown[] {
  return JSON.parse(readFileSync(CATALOG_FIXTURE_PATH, "utf8")) as unknown[];
}

export function catalogIds(payload: unknown): number[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) =>
      item && typeof item === "object" && "id" in item
        ? Number((item as { id: unknown }).id)
        : Number.NaN,
    )
    .filter((id) => Number.isInteger(id) && id > 0);
}

export async function fetchCatalog(): Promise<{
  products: unknown[];
  source: "network" | "fixture";
}> {
  try {
    const response = await fetch(FAKE_STORE_PRODUCTS_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("payload was empty");
    }

    return { products, source: "network" };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[catalog] Fake Store unreachable (${reason}); falling back to data/catalog.json`,
    );
    return { products: readCatalogFixture(), source: "fixture" };
  }
}

/**
 * Product detail routes plus the unfiltered catalog pages (`/page/2`, ...).
 * Filtered result sets are narrower, so these cover every paginated URL a
 * crawler can reach from the catalog.
 */
export async function fetchProductPrerenderRoutes(): Promise<string[]> {
  const { products } = await fetchCatalog();
  const ids = catalogIds(products);

  if (!ids.length) {
    throw new Error(
      "No product ids from Fake Store or data/catalog.json — the fixture is corrupt.",
    );
  }

  const totalPages = Math.max(1, Math.ceil(ids.length / CATALOG_PAGE_SIZE));
  const pageRoutes = Array.from(
    { length: totalPages - 1 },
    (_, index) => `/page/${index + 2}`,
  );

  return [...ids.map((id) => `/products/${id}`), ...pageRoutes];
}
