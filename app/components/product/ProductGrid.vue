<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
    <ProductCard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :priority="index === 0"
    />
  </div>
</template>
