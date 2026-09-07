<script setup lang="ts">
import type { SortKey } from "~/composables/useProductFilters";

defineProps<{
  query: string;
  sort: SortKey | null;
  categories: string[];
}>();

const emit = defineEmits<{
  clearSearch: [];
  clearSort: [];
  clearCategory: [category: string];
}>();

function sortLabel(sort: SortKey) {
  return sort.startsWith("count") ? "تعداد" : "رتبه";
}
</script>

<template>
  <ul
    class="ms-auto flex min-w-0 items-center justify-end gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    aria-label="فیلترهای اعمال شده"
  >
    <li v-if="query" class="shrink-0">
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-soft py-1 pe-2.5 ps-2 text-xs text-ink"
        :aria-label="`حذف جستجوی ${query}`"
        @click="emit('clearSearch')"
      >
        <IconSearch class="size-3.5 shrink-0" />
        <span class="max-w-28 truncate">{{ query }}</span>
        <IconClose class="size-3 shrink-0" />
      </button>
    </li>
    <li v-if="sort" class="shrink-0">
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-soft py-1 pe-2.5 ps-2 text-xs text-ink"
        :aria-label="`حذف مرتب‌سازی ${sortLabel(sort)}`"
        @click="emit('clearSort')"
      >
        <IconSort class="size-3.5 shrink-0" />
        <span>{{ sortLabel(sort) }}</span>
        <IconClose class="size-3 shrink-0" />
      </button>
    </li>
    <li v-for="category in categories" :key="category" class="shrink-0">
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-soft py-1 pe-2.5 ps-2 text-xs text-ink"
        :aria-label="`حذف دسته ${category}`"
        @click="emit('clearCategory', category)"
      >
        <span>{{ category }}</span>
        <IconClose class="size-3 shrink-0" />
      </button>
    </li>
  </ul>
</template>
