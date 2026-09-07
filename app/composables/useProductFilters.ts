import type { Product } from '~/types/product'

export const SORT_KEYS = [
  'count-asc',
  'count-desc',
  'rating-desc',
  'rating-asc',
] as const
export type SortKey = (typeof SORT_KEYS)[number]
export const DEFAULT_SORT: SortKey = 'count-asc'
export const PAGE_SIZE = 9

function queryString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0].trim()
  }

  return ''
}

function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value)
}

function parsePage(value: unknown) {
  const n = Number(queryString(value))
  if (!Number.isInteger(n) || n < 1) {
    return 1
  }

  return n
}

function parseCategories(value: unknown, allowed: string[]) {
  const raw = queryString(value)
  if (!raw) {
    return []
  }

  const allowedSet = new Set(allowed)
  return raw.split(',').map(item => item.trim()).filter(item => allowedSet.has(item))
}

function compareProducts(a: Product, b: Product, sort: SortKey) {
  if (sort === 'count-asc') {
    return a.rating.count - b.rating.count
  }

  if (sort === 'count-desc') {
    return b.rating.count - a.rating.count
  }

  if (sort === 'rating-asc') {
    return a.rating.rate - b.rating.rate
  }

  return b.rating.rate - a.rating.rate
}

export function useProductFilters(products: Product[], allCategories: string[]) {
  const route = useRoute()
  const router = useRouter()

  const query = computed(() => queryString(route.query.q))

  const sort = computed<SortKey>(() => {
    const value = queryString(route.query.sort)
    return isSortKey(value) ? value : DEFAULT_SORT
  })

  const selectedCategories = computed(() =>
    parseCategories(route.query.categories, allCategories),
  )

  const categoryCounts = computed(() =>
    allCategories.map(category => ({
      category,
      count: products.filter(product => product.category === category).length,
    })),
  )

  const appliedSort = computed<SortKey | null>(() => {
    const value = queryString(route.query.sort)
    return isSortKey(value) ? value : null
  })

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

  const page = computed(() => Math.min(requestedPage.value, totalPages.value))

  const pagedProducts = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filteredProducts.value.slice(start, start + PAGE_SIZE)
  })

  function patchQuery(updates: Record<string, string | undefined>) {
    const current = { ...route.query }

    if (!('page' in updates)) {
      delete current.page
    }

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        current[key] = value
      }
      else {
        delete current[key]
      }
    }

    router.replace({ path: route.path, query: current })
  }

  function setPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages.value)
    patchQuery({ page: clamped > 1 ? String(clamped) : undefined })
  }

  function setQuery(next: string) {
    patchQuery({ q: next.trim() || undefined })
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
