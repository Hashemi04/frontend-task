<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  product: Product
}>()
</script>

<template>
  <BaseCard as="section" class="p-4 md:p-6">
    <img
      class="mx-auto block h-auto w-auto max-h-hero max-w-full object-contain"
      :src="product.image"
      :alt="product.title"
      width="600"
      height="600"
    >
  </BaseCard>
</template>
