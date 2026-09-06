import type { Product } from '~/types/product'

function queryString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0].trim()
  }

  return ''
}

export function useProductFilters(products: Product[]) {
  const route = useRoute()
  const router = useRouter()

  const query = computed(() => queryString(route.query.q))

  const filteredProducts = computed(() => {
    const term = query.value.toLowerCase()
    if (!term) {
      return products
    }

    return products.filter(product => product.title.toLowerCase().includes(term))
  })

  function setQuery(next: string) {
    const q = next.trim()
    const current = { ...route.query }

    if (q) {
      current.q = q
    }
    else {
      delete current.q
    }

    router.replace({ path: route.path, query: current })
  }

  return {
    query,
    filteredProducts,
    setQuery,
  }
}
