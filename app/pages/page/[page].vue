<script setup lang="ts">
/**
 * Page 2 and beyond of the catalog. A real route rather than a `?page=` query
 * so each page is crawlable, prerenderable and self-canonical; page 1 stays on
 * `/` (see the `/page/1` redirect in `nuxt.config.ts`) so the clean catalog URL
 * is never duplicated. A page past the end clamps to the last real page.
 */
definePageMeta({
  pageTransition: false,
  validate(route) {
    const raw = Array.isArray(route.params.page)
      ? route.params.page[0]
      : route.params.page;

    return typeof raw === "string" && /^\d+$/.test(raw);
  },
});
</script>

<template>
  <CatalogView />
</template>
