<script setup lang="ts">
import type { Product } from "~/types/product";
import { formatCount, formatPrice, formatRating } from "~/utils/format";

const props = defineProps<{
  product: Product;
}>();

const descriptionParts = computed(() =>
  props.product.description
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean),
);
</script>

<template>
  <BaseCard as="section" class="!rounded-[32px] p-4 shadow-card md:p-6 lg:p-8">
    <h2 class="mb-4 text-lg font-bold text-heading lg:mb-6">مشخصات فنی</h2>

    <dl class="flex flex-col gap-2">
      <ProductSpecRow label="قیمت">
        {{ formatPrice(product.price) }}
      </ProductSpecRow>

      <ProductSpecRow label="توضیحات" stacked>
        <ul
          v-if="descriptionParts.length > 1"
          class="list-disc space-y-2 ps-5 marker:text-ink"
        >
          <li v-for="(part, index) in descriptionParts" :key="index">
            {{ part }}
          </li>
        </ul>
        <template v-else>
          {{ product.description }}
        </template>
      </ProductSpecRow>

      <ProductSpecRow label="دسته‌بندی">
        <NuxtLink
          class="text-primary hover:underline"
          :to="{ path: '/', query: { categories: product.category } }"
        >
          {{ product.category }}
        </NuxtLink>
      </ProductSpecRow>

      <ProductSpecRow label="رتبه">
        {{ formatRating(product.rating.rate) }}
      </ProductSpecRow>

      <ProductSpecRow label="تعداد">
        {{ formatCount(product.rating.count) }}
      </ProductSpecRow>
    </dl>
  </BaseCard>
</template>
