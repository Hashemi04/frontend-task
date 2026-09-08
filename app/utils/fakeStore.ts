import type { Category, Product } from "~/types/product";
import { KNOWN_CATEGORIES } from "~/types/product";

export const FAKE_STORE_PRODUCTS_URL = "https://fakestoreapi.com/products";

export const CATALOG_CATEGORIES: readonly Category[] = KNOWN_CATEGORIES;

export function parseProductId(raw: unknown): number | null {
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) {
    return null;
  }

  return Number(raw);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  const rating = item.rating;

  if (!rating || typeof rating !== "object") {
    return false;
  }

  const { rate, count } = rating as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    Number.isInteger(item.id) &&
    item.id > 0 &&
    typeof item.title === "string" &&
    isFiniteNumber(item.price) &&
    typeof item.description === "string" &&
    typeof item.category === "string" &&
    typeof item.image === "string" &&
    isFiniteNumber(rate) &&
    isFiniteNumber(count)
  );
}

export function parseProduct(value: unknown): Product | null {
  return isProduct(value) ? value : null;
}

export function parseProductList(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    throw new Error("Fake Store catalog payload must be an array");
  }

  const products = value.filter(isProduct);

  if (value.length > 0 && products.length === 0) {
    throw new Error("Fake Store catalog payload had no valid products");
  }

  return products;
}

/**
 * Fake Store has no stock / availability field. Odd ids stay in stock so
 * the «محصولات موجود» filter can hide a stable subset of the catalog.
 */
export function isProductAvailable(product: Product): boolean {
  return product.id % 2 !== 0;
}

export function catalogCategories(products: Product[]): Category[] {
  const present = new Set(products.map((product) => product.category));
  const known = CATALOG_CATEGORIES.filter((category) => present.has(category));
  const extras = [...present].filter(
    (category) => !CATALOG_CATEGORIES.includes(category),
  );

  return [...known, ...extras];
}
