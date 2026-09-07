import type { LocationQueryRaw } from 'vue-router'
import {
  applyQueryUpdates,
  catalogQuerySource,
} from '~/utils/productQuery'

export function useCatalogQuery() {
  const route = useRoute()
  const router = useRouter()

  function patchQuery(updates: Record<string, string | undefined>) {
    router.replace({
      path: '/',
      query: applyQueryUpdates(
        catalogQuerySource(route.path, { ...route.query }),
        updates,
      ) as LocationQueryRaw,
    })
  }

  function setQuery(next: string) {
    patchQuery({ q: next.trim() || undefined })
  }

  return {
    patchQuery,
    setQuery,
  }
}
