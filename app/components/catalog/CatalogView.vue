<script setup lang="ts">
import { formatCount } from "~/utils/format";
import { catalogCategories } from "~/utils/fakeStore";
import { catalogPagePath } from "~/utils/productQuery";
import { itemListJsonLd } from "~/utils/seo";

const origin = useSiteOrigin();
const {
  data: catalogData,
  pending: catalogPending,
  error: catalogError,
  refresh: retryCatalog,
} = await useCatalogProducts();

const catalog = computed(() => catalogData.value ?? []);
const allCategories = computed(() => catalogCategories(catalog.value));

const {
  query,
  sort,
  appliedSort,
  available,
  selectedCategories,
  categoryCounts,
  hasAppliedFilters,
  filteredProducts,
  page,
  totalPages,
  pagedProducts,
  setQuery,
  setSort,
  setAvailable,
  clearSort,
  clearAvailable,
  toggleCategory,
  clearCategory,
  appliedCount,
  pageLocation,
} = useProductFilters(catalog, allCategories);

const filtersOpen = ref(false);

usePageSeo({
  title: () =>
    page.value > 1
      ? `لیست محصولات — صفحه ${formatCount(page.value)}`
      : "لیست محصولات",
  description: () =>
    page.value > 1
      ? `صفحه ${formatCount(page.value)} از فهرست محصولات فروشگاه.`
      : "جستجو و مشاهده فهرست محصولات فروشگاه.",
  // Each page self-canonicalises. Filter query strings are dropped so facets
  // consolidate onto the clean catalog URL instead of duplicating it.
  canonicalPath: () => catalogPagePath(page.value),
});

useHead(() => ({
  link: [
    ...(page.value > 1
      ? [
          {
            rel: "prev" as const,
            href: `${origin}${catalogPagePath(page.value - 1)}`,
          },
        ]
      : []),
    ...(page.value < totalPages.value
      ? [
          {
            rel: "next" as const,
            href: `${origin}${catalogPagePath(page.value + 1)}`,
          },
        ]
      : []),
  ],
}));

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

// Filtering happens client-side, so the result count has to be announced or a
// screen reader gets no feedback that the grid changed under it.
const resultSummary = computed(() => {
  if (catalogView.value !== "ready") {
    return "";
  }

  return `${formatCount(filteredProducts.value.length)} محصول یافت شد، صفحه ${formatCount(page.value)} از ${formatCount(totalPages.value)}`;
});

useHead(() => ({
  script: pagedProducts.value.length
    ? [
        {
          type: "application/ld+json",
          textContent: itemListJsonLd(origin, pagedProducts.value),
        },
      ]
    : [],
}));
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-7 md:pb-12">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
      <FilterSidebar
        class="app-scroll max-lg:hidden lg:sticky lg:top-22 lg:w-[17.5rem] lg:shrink-0 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto"
        :query="query"
        :sort="sort"
        :available="available"
        :selected-categories="selectedCategories"
        :category-counts="categoryCounts"
        @search="setQuery"
        @clear-search="setQuery('')"
        @sort="setSort"
        @available="setAvailable"
        @toggle-category="toggleCategory"
      />

      <div class="min-w-0 flex-1">
        <div
          id="catalog-toolbar"
          class="sticky top-14 z-20 mb-4 flex items-stretch gap-2 bg-page py-2 md:top-18 md:mb-5 md:py-3"
        >
          <div
            class="flex h-11 min-w-0 flex-1 items-center justify-between gap-3 overflow-hidden rounded-2xl bg-surface px-4 shadow-card lg:h-16 lg:rounded-3xl lg:px-6"
          >
            <h1 class="shrink-0 text-sm font-medium leading-4 text-heading">
              <span :class="hasAppliedFilters ? 'lg:hidden' : undefined">
                لیست محصولات
              </span>
              <span v-if="hasAppliedFilters" class="hidden lg:inline">
                فیلترهای اعمال شده
              </span>
            </h1>
            <AppliedFilters
              v-if="hasAppliedFilters"
              class="min-w-0 flex-1 max-lg:hidden"
              :query="query"
              :sort="appliedSort"
              :available="available"
              :categories="selectedCategories"
              @clear-search="setQuery('')"
              @clear-sort="clearSort"
              @clear-available="clearAvailable"
              @clear-category="clearCategory"
            />
          </div>
          <BaseButton
            class="min-h-11 shrink-0 lg:hidden"
            variant="outline"
            radius="2xl"
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
              {{ formatCount(appliedCount) }}
            </span>
          </BaseButton>
        </div>
        <div class="overflow-hidden">
          <!-- loading: catalog request in flight -->
          <ProductGrid v-if="catalogView === 'loading'" loading />
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
          <div v-else id="product-catalog" class="scroll-mt-32 md:scroll-mt-36">
            <ProductGrid :products="pagedProducts" />
            <ProductPagination
              v-if="totalPages > 1"
              :page="page"
              :total-pages="totalPages"
              :page-location="pageLocation"
            />
          </div>
        </div>
        <p class="sr-only" role="status" aria-live="polite">
          {{ resultSummary }}
        </p>
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
              :available="available"
              :selected-categories="selectedCategories"
              :category-counts="categoryCounts"
              @search="setQuery"
              @clear-search="setQuery('')"
              @sort="setSort"
              @available="setAvailable"
              @toggle-category="toggleCategory"
            />
          </div>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>
