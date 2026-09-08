import type { Product } from "~/types/product";
import { FAKE_STORE_PRODUCTS_URL, parseProduct } from "~/utils/fakeStore";
import { isNotFoundError } from "~/utils/httpError";
import { fallbackProduct } from "../../utils/catalogFallback";

const notFound = () =>
  createError({ statusCode: 404, statusMessage: "Not Found" });

export default defineCachedEventHandler(
  async (event): Promise<Product> => {
    const id = Number(getRouterParam(event, "id"));
    if (!Number.isInteger(id) || id < 1) {
      throw notFound();
    }

    try {
      const payload = await $fetch<unknown>(
        `${FAKE_STORE_PRODUCTS_URL}/${id}`,
        { timeout: 10_000 },
      );
      const product = parseProduct(payload);
      if (!product) {
        throw notFound();
      }
      return product;
    } catch (error) {
      // A real 404 upstream is the answer, not a failure to retry.
      if (isNotFoundError(error)) {
        throw notFound();
      }

      const fallback = fallbackProduct(id);
      if (!fallback) {
        throw error;
      }

      const reason = error instanceof Error ? error.message : String(error);
      console.warn(
        `[api/products/${id}] upstream failed (${reason}); using fixture`,
      );
      setHeader(event, "x-catalog-source", "fixture");
      return fallback;
    }
  },
  {
    maxAge: 60 * 10,
    swr: true,
    name: "product",
    getKey: (event) => getRouterParam(event, "id") ?? "",
  },
);
