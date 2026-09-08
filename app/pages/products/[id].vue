<script setup lang="ts">
import { parseProductId } from "~/utils/fakeStore";
import { catalogImageUrl } from "~/utils/catalogImage";
import { breadcrumbJsonLd, productJsonLd } from "~/utils/seo";

const route = useRoute();
const rawId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const id = parseProductId(rawId);

const notFound = {
  statusCode: 404,
  statusMessage: "محصول پیدا نشد",
  message: "این محصول در فروشگاه وجود ندارد.",
  fatal: true,
} as const;

if (id == null) {
  throw createError(notFound);
}

const {
  data: product,
  pending: productPending,
  error: productError,
  refresh: retryProduct,
} = await useProductById(id);

if (
  !productPending.value &&
  !product.value &&
  (!productError.value || isNotFoundError(productError.value))
) {
  throw createError(notFound);
}

const origin = useSiteOrigin();

usePageSeo({
  title: () => product.value?.title ?? "محصول",
  description: () => (product.value?.description ?? "").slice(0, 160),
  ogImage: () =>
    product.value ? catalogImageUrl(origin, product.value.id, 640) : undefined,
});

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

watch(
  () => route.params.id,
  () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  },
);

useHead(() => ({
  script: product.value
    ? [
        {
          type: "application/ld+json",
          textContent: productJsonLd(origin, product.value),
        },
        {
          type: "application/ld+json",
          textContent: breadcrumbJsonLd(origin, product.value),
        },
      ]
    : [],
}));
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 pt-4 pb-10 md:px-6 md:pt-7 md:pb-12">
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
        :items="[
          { to: '/', icon: 'home' },
          { to: '/', label: 'لیست محصولات' },
          { label: product.title },
        ]"
      />
      <div class="flex flex-col gap-5">
        <ProductHero :product="product" />
        <ProductSpecs :product="product" />
      </div>
    </template>
  </div>
</template>
