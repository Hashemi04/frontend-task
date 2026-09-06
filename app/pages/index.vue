<script setup lang="ts">
import { mockProducts } from "~/data/mockProducts";

usePageSeo({
  title: "لیست محصولات",
  description: "جستجو و مشاهده فهرست محصولات فروشگاه.",
});

const url = useRequestURL();
const {
  query,
  sort,
  appliedSort,
  hasAppliedFilters,
  filteredProducts,
  setQuery,
  setSort,
  clearSort,
} = useProductFilters(mockProducts);

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: mockProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${url.origin}/products/${product.id}`,
          name: product.title,
        })),
      }),
    },
  ],
});
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-7 md:pb-12">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
      <FilterSidebar
        :query="query"
        :sort="sort"
        @search="setQuery"
        @clear-search="setQuery('')"
        @sort="setSort"
      />

      <div class="min-w-0 flex-1">
        <AppliedFilters
          v-if="hasAppliedFilters"
          :query="query"
          :sort="appliedSort"
          @clear-search="setQuery('')"
          @clear-sort="clearSort"
        />
        <h1 v-else class="mb-5 text-xl font-bold">لیست محصولات</h1>
        <ProductGrid
          v-if="filteredProducts.length"
          :products="filteredProducts"
        />
        <StateMessage
          v-else
          status="empty"
          title="محصولی پیدا نشد"
          description="محصولی با این جستجو پیدا نشد."
        />
      </div>
    </div>
  </div>
</template>
