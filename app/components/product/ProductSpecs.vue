<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatCount, formatPrice, formatRating } from '~/utils/format'

defineProps<{
  product: Product
}>()
</script>

<template>
  <BaseCard as="section" class="p-5 md:p-6">
    <h1 class="text-xl font-bold leading-8 md:text-2xl">
      {{ product.title }}
    </h1>

    <p class="mt-4 text-lg font-bold text-primary">
      {{ formatPrice(product.price) }}
    </p>

    <dl class="mt-5 space-y-3 text-sm leading-7">
      <div class="flex flex-wrap gap-x-3">
        <dt class="text-muted">دسته‌بندی</dt>
        <dd>
          <NuxtLink
            class="text-primary hover:underline"
            :to="{ path: '/', query: { categories: product.category } }"
          >
            {{ product.category }}
          </NuxtLink>
        </dd>
      </div>
      <div class="flex flex-wrap gap-x-3">
        <dt class="text-muted">امتیاز</dt>
        <dd>
          {{ formatRating(product.rating.rate) }} از {{ formatCount(5) }}
          <span class="text-muted">
            ({{ formatCount(product.rating.count) }} نظر)
          </span>
        </dd>
      </div>
      <div>
        <dt class="mb-1 text-muted">توضیحات</dt>
        <dd class="text-ink">{{ product.description }}</dd>
      </div>
    </dl>
  </BaseCard>
</template>
