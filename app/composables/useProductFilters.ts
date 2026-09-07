import type { Product } from '~/types/product'
import type { SortKey } from '~/utils/productQuery'
import {
  PAGE_SIZE,
  clampPage,
  compareProducts,
  parseAppliedSort,
  parseCategories,
  parsePage,
  parseSort,
  queryString,
} from '~/utils/productQuery'

export type { SortKey } from '~/utils/productQuery'

export function useProductFilters(products: Product[], allCategories: string[]) {
  const route = useRoute()
  const { patchQuery, setQuery } = useCatalogQuery()

  const query = computed(() => queryString(route.query.q))

  const sort = computed(() => parseSort(route.query.sort))

  const selectedCategories = computed(() =>
    parseCategories(route.query.categories, allCategories),
  )

  const categoryCounts = computed(() =>
    allCategories.map(category => ({
      category,
      count: products.filter(product => product.category === category).length,
    })),
  )

  const appliedSort = computed(() => parseAppliedSort(route.query.sort))

  const hasAppliedFilters = computed(
    () => Boolean(query.value || appliedSort.value || selectedCategories.value.length),
  )

  const filteredProducts = computed(() => {
    const term = query.value.toLowerCase()
    let list = products

    if (term) {
      list = list.filter(product => product.title.toLowerCase().includes(term))
    }

    if (selectedCategories.value.length) {
      const selected = new Set(selectedCategories.value)
      list = list.filter(product => selected.has(product.category))
    }

    return [...list].sort((a, b) => compareProducts(a, b, sort.value))
  })

  const requestedPage = computed(() => parsePage(route.query.page))

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / PAGE_SIZE)),
  )

  const page = computed(() => clampPage(requestedPage.value, totalPages.value))

  const pagedProducts = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filteredProducts.value.slice(start, start + PAGE_SIZE)
  })

  function setPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages.value)
    patchQuery({ page: clamped > 1 ? String(clamped) : undefined })
  }

  function setSort(next: SortKey) {
    patchQuery({ sort: next })
  }

  function setCategories(next: string[]) {
    patchQuery({ categories: next.length ? next.join(',') : undefined })
  }

  function toggleCategory(category: string) {
    const current = selectedCategories.value
    const next = current.includes(category)
      ? current.filter(item => item !== category)
      : [...current, category]
    setCategories(next)
  }

  function clearCategory(category: string) {
    setCategories(selectedCategories.value.filter(item => item !== category))
  }

  function clearSort() {
    patchQuery({ sort: undefined })
  }

  function syncRequestedPage() {
    if (requestedPage.value === page.value) {
      return
    }

    setPage(page.value)
  }

  onMounted(syncRequestedPage)
  watch(requestedPage, syncRequestedPage)

  return {
    query,
    sort,
    appliedSort,
    selectedCategories,
    categoryCounts,
    hasAppliedFilters,
    filteredProducts,
    page,
    totalPages,
    pagedProducts,
    setQuery,
    setSort,
    setPage,
    clearSort,
    toggleCategory,
    clearCategory,
  }
}
