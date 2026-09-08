<script setup lang="ts">
import type { Product } from "~/types/product";

const props = defineProps<{
  product: Product;
  width: number;
  height: number;
  sizes?: string;
  preload?: boolean;
  loading?: "lazy" | "eager";
  fetchpriority?: "high" | "low" | "auto";
}>();

function onError(payload: string | Event) {
  const el = payload instanceof Event ? payload.target : null;
  if (!(el instanceof HTMLImageElement)) {
    return;
  }

  if (el.src === props.product.image) {
    return;
  }

  el.src = props.product.image;
}
</script>

<template>
  <NuxtImg
    provider="catalog"
    :src="String(product.id)"
    :alt="product.title"
    :width="width"
    :height="height"
    :sizes="sizes"
    :preload="preload"
    :loading="loading"
    :fetchpriority="fetchpriority"
    @error="onError"
  />
</template>
