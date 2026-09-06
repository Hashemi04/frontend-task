<script setup lang="ts">
import { mockProducts } from '~/data/mockProducts'

usePageSeo({
  title: 'لیست محصولات',
  description: 'جستجو و مشاهده فهرست محصولات فروشگاه.',
})

const url = useRequestURL()

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
    <h1 class="mb-5 text-xl font-bold">لیست محصولات</h1>
    <ProductGrid :products="mockProducts" />
  </div>
</template>
