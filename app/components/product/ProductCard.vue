<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  product: Product
  priority?: boolean
}>()
</script>

<template>
  <BaseCard as="article" class="flex flex-col">
    <img
      class="block w-full aspect-[4/3] object-contain p-4"
      :src="product.image"
      :alt="product.title"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      width="400"
      height="300"
    >
    <div class="flex flex-1 flex-col gap-4 px-4 pb-4">
      <h2 class="m-0 line-clamp-2 text-start text-[0.95rem] font-semibold leading-relaxed">
        <NuxtLink :to="`/products/${product.id}`" class="hover:text-primary">
          {{ product.title }}
        </NuxtLink>
      </h2>
      <BaseButton
        variant="outline"
        block
        class="mt-auto"
        :to="`/products/${product.id}`"
      >
        مشاهده جزئیات
        <span
          aria-hidden="true"
          class="size-[0.45rem] rotate-45 border-b-2 border-e-2 border-current"
        />
      </BaseButton>
    </div>
  </BaseCard>
</template>
