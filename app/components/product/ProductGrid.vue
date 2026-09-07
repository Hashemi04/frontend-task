<script setup lang="ts">
import type { Product } from "~/types/product";

withDefaults(
  defineProps<{
    products?: Product[];
    loading?: boolean;
    skeletonCount?: number;
  }>(),
  {
    products: () => [],
    skeletonCount: 6,
  },
);
</script>

<template>
  <div>
    <p v-if="loading" class="sr-only" role="status" aria-live="polite">
      در حال بارگذاری محصولات
    </p>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6"
      :aria-busy="loading ? 'true' : undefined"
    >
      <template v-if="loading">
        <ProductCardSkeleton v-for="n in skeletonCount" :key="n" />
      </template>
      <ProductCard
        v-else
        v-for="(product, index) in products"
        :key="product.id"
        :product="product"
        :priority="index < 4"
      />
    </div>
  </div>
</template>
