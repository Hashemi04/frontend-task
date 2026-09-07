<script setup lang="ts">
import { mockCategories, mockProducts } from "~/data/mockProducts";

definePageMeta({
  pageTransition: false,
});

usePageSeo({
  title: "لیست محصولات",
  description: "جستجو و مشاهده فهرست محصولات فروشگاه.",
});

const url = useRequestURL();
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
} = useProductFilters(mockProducts, mockCategories);

const filtersOpen = ref(false);

// Catalog request flags. Mocks resolve immediately; feat/api swaps these
// for useAsyncData pending / error / refresh.
const catalogPending = ref(false);
const catalogError = ref<Error | null>(null);

type CatalogView = "loading" | "error" | "empty" | "ready";

const catalogView = computed<CatalogView>(() => {
  if (catalogPending.value) {
    return "loading";
  }
  if (catalogError.value) {
    return "error";
  }
  if (!filteredProducts.value.length) {
    return "empty";
  }
  return "ready";
});

const emptyCopy = computed(() =>
  hasAppliedFilters.value
    ? {
        title: "محصولی پیدا نشد",
        description: "محصولی با این فیلتر پیدا نشد.",
      }
    : {
        title: "محصولی وجود ندارد",
        description: "در حال حاضر محصولی در فروشگاه نیست.",
      },
);

function retryCatalog() {
  catalogError.value = null;
}

const appliedCount = computed(
  () => (appliedSort.value ? 1 : 0) + selectedCategories.value.length,
);

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
        class="app-scroll max-lg:hidden lg:sticky lg:top-22 lg:w-[17.5rem] lg:shrink-0 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto"
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
        <div
          class="sticky top-14 z-20 mb-5 flex items-center gap-2 bg-page py-3 md:top-18"
        >
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
              {{ appliedCount.toLocaleString("fa-IR") }}
            </span>
          </BaseButton>
          <div
            class="flex min-w-0 flex-1 items-center justify-between rounded-3xl bg-surface p-6 shadow-card"
          >
            <h1
              class="shrink-0 text-right text-sm font-medium leading-4 text-heading"
            >
              {{ hasAppliedFilters ? "فیلترهای اعمال شده" : "لیست محصولات" }}
            </h1>
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
        </div>
        <div class="overflow-hidden">
          <!-- loading: catalog request in flight -->
          <StateMessage
            v-if="catalogView === 'loading'"
            status="loading"
            title="در حال بارگذاری"
            description="در حال دریافت فهرست محصولات."
          />
          <!-- error: catalog request failed -->
          <StateMessage
            v-else-if="catalogView === 'error'"
            status="error"
            title="دریافت محصولات با خطا مواجه شد"
            description="اتصال را بررسی کنید و دوباره تلاش کنید."
            @action="retryCatalog"
          />
          <!-- empty: request succeeded, nothing to show (no catalog rows, or filters matched none) -->
          <StateMessage
            v-else-if="catalogView === 'empty'"
            status="empty"
            :title="emptyCopy.title"
            :description="emptyCopy.description"
          />
          <!-- ready: at least one product after filters -->
          <ProductGrid v-else class="catalog-in" :products="filteredProducts" />
        </div>
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
            :class="
              expanded ? 'pt-[max(0.75rem,env(safe-area-inset-top))]' : 'pt-3'
            "
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
