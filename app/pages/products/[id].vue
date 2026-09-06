<script setup lang="ts">
import { mockProducts } from '~/data/mockProducts'

const route = useRoute()
const rawId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const id = typeof rawId === 'string' ? Number(rawId) : Number.NaN
const product = mockProducts.find(item => item.id === id)

if (!product || !Number.isInteger(id) || String(id) !== rawId) {
  throw createError({
    statusCode: 404,
    statusMessage: 'محصول پیدا نشد',
    message: 'این محصول در فروشگاه وجود ندارد.',
    fatal: true,
  })
}

usePageSeo({
  title: product.title,
  description: product.description.slice(0, 160),
})

useSeoMeta({
  ogImage: product.image,
})

const url = useRequestURL()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.image,
        description: product.description,
        sku: String(product.id),
        category: product.category,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${url.origin}/products/${product.id}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.rate,
          reviewCount: product.rating.count,
        },
      }),
    },
  ],
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-7 md:pb-12">
    <AppBreadcrumb
      :items="[
        { to: '/', label: 'لیست محصولات' },
        { label: product.title },
      ]"
    />
    <div class="flex flex-col gap-4 lg:gap-5">
      <ProductHero :product="product" />
      <ProductSpecs :product="product" />
    </div>
  </div>
</template>
