import catalogFixture from "../../data/catalog.json";
import type { Product } from "~/types/product";
import { parseProductList } from "~/utils/fakeStore";

/**
 * Committed snapshot of the Fake Store catalog. Fake Store rate-limits and
 * 502s regularly; serving a slightly stale catalog beats serving an error
 * page, so upstream failures degrade to this instead of propagating.
 */
export function fallbackCatalog(): Product[] {
  return parseProductList(catalogFixture);
}

export function fallbackProduct(id: number): Product | null {
  return fallbackCatalog().find((product) => product.id === id) ?? null;
}
