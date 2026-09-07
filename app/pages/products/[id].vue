<script setup lang="ts">
import { mockProducts } from "~/data/mockProducts";

const route = useRoute();
const rawId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const id = typeof rawId === "string" ? Number(rawId) : Number.NaN;
const product = mockProducts.find((item) => item.id === id);

// Product request flags. Mocks resolve immediately; feat/api swaps these
// for useAsyncData pending / error / refresh.
const productPending = ref(false);
const productError = ref<Error | null>(null);

function retryProduct() {
  productError.value = null;
}

const isMissingProduct =
  !product || !Number.isInteger(id) || String(id) !== rawId;

// not-found: id is invalid or not in the catalog → HTTP 404 (error.vue empty)
if (!productPending.value && !productError.value && isMissingProduct) {
  throw createError({
    statusCode: 404,
    statusMessage: "محصول پیدا نشد",
    message: "این محصول در فروشگاه وجود ندارد.",
    fatal: true,
  });
}

const url = useRequestURL();

usePageSeo({
  title: product?.title ?? "محصول",
  description: (product?.description ?? "").slice(0, 160),
});

useSeoMeta({
  ogImage: product?.image,
});

useHead({
  script: product
    ? [
        {
          type: "application/ld+json",
          textContent: {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image,
            description: product.description,
            sku: String(product.id),
            category: product.category,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${url.origin}/products/${product.id}`,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating.rate,
              reviewCount: product.rating.count,
            },
          },
        },
      ]
    : [],
});
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-7 md:pb-12">
    <!-- loading: product request in flight -->
    <StateMessage
      v-if="productPending"
      status="loading"
      title="در حال بارگذاری"
      description="در حال دریافت اطلاعات محصول."
    />
    <!-- error: product request failed (not a missing id) -->
    <StateMessage
      v-else-if="productError"
      status="error"
      title="دریافت محصول با خطا مواجه شد"
      description="اتصال را بررسی کنید و دوباره تلاش کنید."
      @action="retryProduct"
    />
    <!-- ready: product payload is on the page -->
    <template v-else-if="product">
      <AppBreadcrumb
        :items="[{ to: '/', label: 'لیست محصولات' }, { label: product.title }]"
      />
      <div class="flex flex-col gap-4 lg:gap-5">
        <ProductHero :product="product" />
        <ProductSpecs :product="product" />
      </div>
    </template>
  </div>
</template>
