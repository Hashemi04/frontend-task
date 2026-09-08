<script setup lang="ts">
import type { Product } from "~/types/product";

defineProps<{
  product: Product;
}>();

const zoomed = ref(false);
const dialogRef = ref<HTMLElement | null>(null);

function openZoom() {
  zoomed.value = true;
}

function closeZoom() {
  zoomed.value = false;
}

useHistoryClose(zoomed, closeZoom);
useFocusTrap(zoomed, () => dialogRef.value);

watch(zoomed, async (isOpen) => {
  if (!import.meta.client) {
    return;
  }

  document.body.classList.toggle("overflow-hidden", isOpen);

  if (!isOpen) {
    return;
  }

  await nextTick();
  dialogRef.value?.focus();
});

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeZoom();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.classList.remove("overflow-hidden");
});
</script>

<template>
  <BaseCard as="section" class="!rounded-[32px] p-4 shadow-card md:p-6 lg:p-8">
    <h1
      class="mb-4 text-xl font-bold leading-8 text-heading lg:mb-6 lg:text-2xl lg:leading-9"
    >
      {{ product.title }}
    </h1>

    <div
      class="relative mx-auto aspect-square w-full max-h-hero overflow-hidden rounded-2xl bg-page"
    >
      <NuxtImg
        provider="catalog"
        :src="String(product.id)"
        class="absolute inset-0 size-full object-contain p-4 md:p-8 lg:p-10"
        :alt="product.title"
        width="640"
        height="640"
        sizes="xs:90vw sm:640px lg:1000px"
        preload
        loading="eager"
        fetchpriority="high"
      />
      <button
        type="button"
        class="absolute start-3 top-3 flex size-12 cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-black/50 p-2 text-white backdrop-blur-[1px]"
        aria-label="بزرگ‌نمایی تصویر"
        @click="openZoom"
      >
        <IconZoom class="size-6" />
      </button>
    </div>
  </BaseCard>

  <Teleport to="body">
    <div
      v-if="zoomed"
      ref="dialogRef"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="تصویر محصول"
      tabindex="-1"
      @click.self="closeZoom"
    >
      <button
        type="button"
        class="absolute end-4 top-4 flex size-12 cursor-pointer items-center justify-center rounded-full bg-surface text-ink"
        aria-label="بستن"
        @click="closeZoom"
      >
        <IconClose class="size-5" />
      </button>
      <NuxtImg
        provider="catalog"
        :src="String(product.id)"
        class="max-h-[90dvh] max-w-full object-contain"
        :alt="product.title"
        width="1000"
        height="1000"
      />
    </div>
  </Teleport>
</template>
