import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";
import type { Product } from "~/types/product";
import type { SortKey } from "~/utils/productQuery";
import { isProductAvailable } from "~/utils/fakeStore";
import {
  appliedFilterCount,
  filterProducts,
  paginate,
  parseAppliedSort,
  parseAvailable,
  parseCategories,
  parsePage,
  parseSort,
  queryString,
} from "~/utils/productQuery";

export function useProductFilters(
  products: MaybeRefOrGetter<Product[]>,
  allCategories: MaybeRefOrGetter<string[]>,
) {
  const route = useRoute();
  const router = useRouter();
  const { patchQuery, setQuery, catalogPageLocation } = useCatalogQuery();

  const query = computed(() => queryString(route.query.q));

  const sort = computed(() => parseSort(route.query.sort));

  const catalog = computed(() => toValue(products));
  const categories = computed(() => toValue(allCategories));

  const selectedCategories = computed(() =>
    parseCategories(route.query.categories, categories.value),
  );

  const categoryCounts = computed(() =>
    categories.value.map((category) => ({
      category,
      count: catalog.value.filter((product) => product.category === category)
        .length,
    })),
  );

  const available = computed(() => parseAvailable(route.query.available));

  const appliedSort = computed(() => parseAppliedSort(route.query.sort));

  const hasAppliedFilters = computed(() =>
    Boolean(
      query.value ||
      appliedSort.value ||
      selectedCategories.value.length ||
      available.value,
    ),
  );

  const appliedCount = computed(() =>
    appliedFilterCount({
      query: query.value,
      sort: appliedSort.value,
      categories: selectedCategories.value,
      available: available.value,
    }),
  );

  const filteredProducts = computed(() =>
    filterProducts(
      catalog.value,
      {
        query: query.value,
        categories: selectedCategories.value,
        available: available.value,
        sort: sort.value,
      },
      isProductAvailable,
    ),
  );

  const requestedPage = computed(() => parsePage(route.params.page));

  const pageState = computed(() =>
    paginate(filteredProducts.value, requestedPage.value),
  );

  const page = computed(() => pageState.value.page);
  const totalPages = computed(() => pageState.value.totalPages);
  const pagedProducts = computed(() => pageState.value.items);

  function setSort(next: SortKey) {
    patchQuery({ sort: next });
  }

  function setCategories(next: string[]) {
    patchQuery({ categories: next.length ? next.join(",") : undefined });
  }

  function toggleCategory(category: string) {
    const current = selectedCategories.value;
    const next = current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category];
    setCategories(next);
  }

  function clearCategory(category: string) {
    setCategories(selectedCategories.value.filter((item) => item !== category));
  }

  function setAvailable(next: boolean) {
    patchQuery({ available: next ? "1" : undefined });
  }

  function clearAvailable() {
    setAvailable(false);
  }

  function clearSort() {
    patchQuery({ sort: undefined });
  }

  /**
   * `/page/99` is a valid URL to type but not a valid page to sit on. Replace
   * it with the last real page instead of rendering an empty grid.
   */
  function syncRequestedPage() {
    if (requestedPage.value === page.value) {
      return;
    }

    router.replace(catalogPageLocation(page.value));
  }

  onMounted(syncRequestedPage);
  watch([requestedPage, totalPages], syncRequestedPage);

  return {
    query,
    sort,
    appliedSort,
    available,
    selectedCategories,
    categoryCounts,
    hasAppliedFilters,
    appliedCount,
    filteredProducts,
    page,
    totalPages,
    pagedProducts,
    pageLocation: catalogPageLocation,
    setQuery,
    setSort,
    setAvailable,
    clearSort,
    clearAvailable,
    toggleCategory,
    clearCategory,
  };
}
