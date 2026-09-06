<script setup lang="ts">
import type { SortKey } from '~/composables/useProductFilters'

defineProps<{
  query: string
  sort: SortKey | null
  categories: string[]
}>()

const emit = defineEmits<{
  clearSearch: []
  clearSort: []
  clearCategory: [category: string]
}>()

function sortLabel(sort: SortKey) {
  return sort.startsWith('count') ? 'تعداد' : 'رتبه'
}
</script>

<template>
  <div
    class="mb-5 flex min-h-12 flex-wrap items-center justify-between gap-3 rounded-full bg-surface px-4 py-2 shadow-card"
  >
    <h1 class="text-sm font-bold md:text-base">فیلترهای اعمال شده</h1>

    <ul class="flex flex-wrap items-center gap-2">
      <li v-if="query">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-soft py-1 pe-2.5 ps-2 text-xs text-ink"
          :aria-label="`حذف جستجوی ${query}`"
          @click="emit('clearSearch')"
        >
          <IconSearch class="size-3.5 shrink-0" />
          <span class="max-w-36 truncate">{{ query }}</span>
          <IconClose class="size-3 shrink-0" />
        </button>
      </li>
      <li v-if="sort">
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
      <li v-for="category in categories" :key="category">
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
  </div>
</template>
