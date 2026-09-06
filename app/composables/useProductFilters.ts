import type { Product } from "~/types/product";

export const SORT_KEYS = [
  "count-asc",
  "count-desc",
  "rating-desc",
  "rating-asc",
] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = "count-asc";

function queryString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0].trim();
  }

  return "";
}

function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value);
}

function compareProducts(a: Product, b: Product, sort: SortKey) {
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

export function useProductFilters(products: Product[]) {
  const route = useRoute();
  const router = useRouter();

  const query = computed(() => queryString(route.query.q));

  const sort = computed<SortKey>(() => {
    const value = queryString(route.query.sort);
    return isSortKey(value) ? value : DEFAULT_SORT;
  });

  const filteredProducts = computed(() => {
    const term = query.value.toLowerCase();
    const list = term
      ? products.filter((product) => product.title.toLowerCase().includes(term))
      : products;

    return [...list].sort((a, b) => compareProducts(a, b, sort.value));
  });

  function patchQuery(updates: Record<string, string | undefined>) {
    const current = { ...route.query };

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        current[key] = value;
      } else {
        delete current[key];
      }
    }

    router.replace({ path: route.path, query: current });
  }

  function setQuery(next: string) {
    patchQuery({ q: next.trim() || undefined });
  }

  function setSort(next: SortKey) {
    patchQuery({ sort: next });
  }

  const appliedSort = computed<SortKey | null>(() => {
    const value = queryString(route.query.sort);
    return isSortKey(value) ? value : null;
  });

  const hasAppliedFilters = computed(
    () => Boolean(query.value || appliedSort.value),
  );

  function clearSort() {
    patchQuery({ sort: undefined });
  }

  return {
    query,
    sort,
    appliedSort,
    hasAppliedFilters,
    filteredProducts,
    setQuery,
    setSort,
    clearSort,
  };
}
