import type { LocationQueryRaw, RouteLocationRaw } from "vue-router";
import {
  CATALOG_PATH,
  applyQueryUpdates,
  catalogPagePath,
  catalogQuerySource,
} from "~/utils/productQuery";

export function useCatalogQuery() {
  const route = useRoute();
  const router = useRouter();

  /**
   * Filter changes always land on `/`, which drops pagination by construction:
   * a narrower result set should never leave you on a page that no longer
   * exists. `replace` keeps the back button pointing at the previous screen
   * rather than at every intermediate filter state.
   */
  function patchQuery(updates: Record<string, string | undefined>) {
    router.replace({
      path: CATALOG_PATH,
      query: applyQueryUpdates(
        catalogQuerySource(route.path, { ...route.query }),
        updates,
      ) as LocationQueryRaw,
    });
  }

  function setQuery(next: string) {
    patchQuery({ q: next.trim() || undefined });
  }

  function catalogPageLocation(page: number): RouteLocationRaw {
    return {
      path: catalogPagePath(page),
      query: { ...route.query } as LocationQueryRaw,
    };
  }

  return {
    patchQuery,
    setQuery,
    catalogPageLocation,
  };
}
