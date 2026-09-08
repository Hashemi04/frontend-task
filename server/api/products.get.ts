import type { Product } from "~/types/product";
import { FAKE_STORE_PRODUCTS_URL, parseProductList } from "~/utils/fakeStore";
import { fallbackCatalog } from "../utils/catalogFallback";

export default defineCachedEventHandler(
  async (event): Promise<Product[]> => {
    try {
      const payload = await $fetch<unknown>(FAKE_STORE_PRODUCTS_URL, {
        timeout: 10_000,
      });
      return parseProductList(payload);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(`[api/products] upstream failed (${reason}); using fixture`);
      setHeader(event, "x-catalog-source", "fixture");
      return fallbackCatalog();
    }
  },
  { maxAge: 60 * 10, swr: true, name: "catalog" },
);
