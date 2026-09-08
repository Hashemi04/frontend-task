<script setup lang="ts">
import { isCatalogPageParam, parsePage } from "~/utils/productQuery";

/**
 * Page 2 and beyond of the catalog. A real route rather than a `?page=` query
 * so each page is crawlable, prerenderable and self-canonical; page 1 stays on
 * `/`. Nitro also 301s `/page/1` for full document requests.
 */
definePageMeta({
  pageTransition: false,
  validate(route) {
    const raw = Array.isArray(route.params.page)
      ? route.params.page[0]
      : route.params.page;

    return isCatalogPageParam(raw);
  },
});

const route = useRoute();
const rawPage = Array.isArray(route.params.page)
  ? route.params.page[0]
  : route.params.page;

if (parsePage(rawPage) === 1) {
  await navigateTo("/", { replace: true, redirectCode: 301 });
}
</script>

<template>
  <CatalogView />
</template>
