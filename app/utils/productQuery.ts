// Relative import: this module is also loaded from `nuxt.config.ts` tests
// via the prerender suite. Do not pull Vue or `~` aliases in here.
import type { Product } from "../types/product";

export const SORT_KEYS = [
  "count-asc",
  "count-desc",
  "rating-desc",
  "rating-asc",
] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = "count-asc";
export const PAGE_SIZE = 9;
export const CATALOG_PATH = "/";

const CATALOG_PAGE_PATH = /^\/page\/(\d+)\/?$/;

/**
 * Pagination lives in the path (`/page/2`) so every page is a real,
 * crawlable, prerenderable URL. Filters stay in the query string, and
 * changing one sends you back to `/`, which resets pagination.
 */
export function isCatalogPath(path: string) {
  return path === CATALOG_PATH || CATALOG_PAGE_PATH.test(path);
}

export function catalogPagePath(page: number) {
  return page > 1 ? `/page/${page}` : CATALOG_PATH;
}

/**
 * Filtered URLs are useful for users and must not compete with the clean
 * catalog in the index. They canonicalise to `/` and stay `noindex, follow`.
 */
export function catalogCanonicalPath(page: number, hasFilters: boolean) {
  return hasFilters ? CATALOG_PATH : catalogPagePath(page);
}

export function catalogRobots(hasFilters: boolean) {
  return hasFilters ? "noindex, follow" : undefined;
}

export function isCatalogPageParam(value: unknown) {
  const raw = typeof value === "string" ? value : queryString(value);
  return /^[1-9]\d*$/.test(raw);
}

export function catalogQuerySource(
  path: string,
  currentQuery: Record<string, unknown>,
) {
  return isCatalogPath(path) ? { ...currentQuery } : {};
}

export function queryString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0].trim();
  }

  return "";
}

export function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value);
}

export function parseSort(value: unknown): SortKey {
  const raw = queryString(value);
  return isSortKey(raw) ? raw : DEFAULT_SORT;
}

export function parseAppliedSort(value: unknown): SortKey | null {
  const raw = queryString(value);
  return isSortKey(raw) ? raw : null;
}

export function parsePage(value: unknown) {
  const raw = queryString(value);
  if (!/^\d+$/.test(raw)) {
    return 1;
  }

  const n = Number(raw);
  return n >= 1 ? n : 1;
}

export function clampPage(requested: number, totalPages: number) {
  return Math.min(requested, Math.max(1, totalPages));
}

export function parseAvailable(value: unknown) {
  return queryString(value) === "1";
}

export function parseCategories(value: unknown, allowed: string[]) {
  const raw = queryString(value);
  if (!raw) {
    return [];
  }

  const allowedSet = new Set(allowed);
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => allowedSet.has(item));
}

export function compareProducts(a: Product, b: Product, sort: SortKey) {
  if (sort === "count-asc") {
    return a.rating.count - b.rating.count;
  }

  if (sort === "count-desc") {
    return b.rating.count - a.rating.count;
  }

  if (sort === "rating-asc") {
    return a.rating.rate - b.rating.rate;
  }

  return b.rating.rate - a.rating.rate;
}

export interface CatalogCriteria {
  query: string;
  categories: string[];
  available: boolean;
  sort: SortKey;
}

/**
 * The whole catalog filter, as a pure function of the products and the parsed
 * URL state, so it can be tested without a router or a DOM.
 */
export function filterProducts(
  products: Product[],
  criteria: CatalogCriteria,
  isAvailable: (product: Product) => boolean,
) {
  const term = criteria.query.trim().toLowerCase();
  let list = products;

  if (term) {
    list = list.filter((product) => product.title.toLowerCase().includes(term));
  }

  if (criteria.categories.length) {
    const selected = new Set(criteria.categories);
    list = list.filter((product) => selected.has(product.category));
  }

  if (criteria.available) {
    list = list.filter(isAvailable);
  }

  return [...list].sort((a, b) => compareProducts(a, b, criteria.sort));
}

export function paginate<T>(
  items: T[],
  requestedPage: number,
  size = PAGE_SIZE,
) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const page = clampPage(requestedPage, totalPages);
  const start = (page - 1) * size;

  return { page, totalPages, items: items.slice(start, start + size) };
}

export function applyQueryUpdates(
  current: Record<string, unknown>,
  updates: Record<string, string | undefined>,
) {
  const cleared = new Set(
    Object.entries(updates)
      .filter(([, value]) => !value)
      .map(([key]) => key),
  );

  return Object.fromEntries([
    ...Object.entries(current).filter(([key]) => !cleared.has(key)),
    ...Object.entries(updates).filter(([, value]) => Boolean(value)),
  ]);
}

export function appliedFilterCount(options: {
  query: string;
  sort: SortKey | null;
  categories: string[];
  available: boolean;
}) {
  return (
    (options.query.trim() ? 1 : 0) +
    (options.sort ? 1 : 0) +
    options.categories.length +
    (options.available ? 1 : 0)
  );
}
