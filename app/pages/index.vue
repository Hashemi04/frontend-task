<script setup lang="ts">
import { mockProducts } from '~/data/mockProducts'

useHead({
  title: 'لیست محصولات',
})
</script>

<template>
  <main class="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-6 md:pt-7 md:pb-12">
    <h1 class="mb-5 text-xl font-bold">لیست محصولات</h1>
    <ProductGrid :products="mockProducts" />
  </main>
</template>
