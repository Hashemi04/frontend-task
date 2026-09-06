<script setup lang="ts">
import { mockCategories, mockProducts } from '~/data/mockProducts'

usePageSeo({
  title: 'لیست محصولات',
  description: 'جستجو و مشاهده فهرست محصولات فروشگاه.',
})

const url = useRequestURL()
const {
  query,
  sort,
  appliedSort,
  selectedCategories,
  categoryCounts,
  hasAppliedFilters,
  filteredProducts,
  setQuery,
  setSort,
  clearSort,
  toggleCategory,
  clearCategory,
} = useProductFilters(mockProducts, mockCategories)

const filtersOpen = ref(false)

const appliedCount = computed(
  () => (appliedSort.value ? 1 : 0) + selectedCategories.value.length,
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: mockProducts.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${url.origin}/products/${product.id}`,
          name: product.title,
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-7 md:pb-12">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
      <FilterSidebar
        class="max-lg:hidden lg:w-[17.5rem] lg:shrink-0"
        :query="query"
        :sort="sort"
        :selected-categories="selectedCategories"
        :category-counts="categoryCounts"
        @search="setQuery"
        @clear-search="setQuery('')"
        @sort="setSort"
        @toggle-category="toggleCategory"
      />

      <div class="min-w-0 flex-1">
        <h1 class="mb-3 text-lg font-bold lg:text-xl">لیست محصولات</h1>
        <div class="mb-5 flex items-center gap-2">
          <BaseButton
            class="shrink-0 lg:hidden"
            variant="outline"
            :aria-expanded="filtersOpen"
            aria-controls="mobile-filters"
            @click="filtersOpen = true"
          >
            <IconFilter class="size-4" />
            فیلتر
            <span
              v-if="appliedCount"
              class="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] text-white"
            >
              {{ appliedCount.toLocaleString('fa-IR') }}
            </span>
          </BaseButton>
          <AppliedFilters
            v-if="hasAppliedFilters"
            :query="query"
            :sort="appliedSort"
            :categories="selectedCategories"
            @clear-search="setQuery('')"
            @clear-sort="clearSort"
            @clear-category="clearCategory"
          />
        </div>
        <ProductGrid
          v-if="filteredProducts.length"
          :products="filteredProducts"
        />
        <StateMessage
          v-else
          status="empty"
          title="محصولی پیدا نشد"
          description="محصولی با این فیلتر پیدا نشد."
        />
      </div>
    </div>

    <BaseDrawer
      placement="bottom"
      expandable
      :open="filtersOpen"
      title="فیلترها"
      @close="filtersOpen = false"
    >
      <template #default="{ expanded }">
        <div id="mobile-filters" class="flex min-h-0 flex-1 flex-col">
          <div
            data-sheet-handle
            class="flex touch-none select-none flex-col items-center px-4"
            :class="expanded ? 'pt-[max(0.75rem,env(safe-area-inset-top))]' : 'pt-3'"
          >
            <span
              class="mb-3 h-1.5 w-12 cursor-grab rounded-full bg-line active:cursor-grabbing"
              aria-hidden="true"
            />
            <div class="mb-4 flex w-full items-center justify-between">
              <p class="font-semibold">فیلترها</p>
              <button
                type="button"
                class="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink"
                aria-label="بستن فیلترها"
                @click="filtersOpen = false"
              >
                <IconClose class="size-5" />
              </button>
            </div>
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            <FilterSidebar
              sort-name="product-sort-mobile"
              :show-search="false"
              :query="query"
              :sort="sort"
              :selected-categories="selectedCategories"
              :category-counts="categoryCounts"
              @search="setQuery"
              @clear-search="setQuery('')"
              @sort="setSort"
              @toggle-category="toggleCategory"
            />
          </div>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>
