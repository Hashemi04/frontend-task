<script setup lang="ts">
import type { SortKey } from '~/composables/useProductFilters'

defineProps<{
  query: string
  sort: SortKey
  selectedCategories: string[]
  categoryCounts: { category: string, count: number }[]
  sortName?: string
}>()

const emit = defineEmits<{
  search: [value: string]
  clearSearch: []
  sort: [value: SortKey]
  toggleCategory: [category: string]
}>()
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SearchCard
      :applied="query"
      @submit="emit('search', $event)"
      @clear="emit('clearSearch')"
    />
    <SortCard
      :selected="sort"
      :name="sortName"
      @select="emit('sort', $event)"
    />
    <CategoryCard
      :categories="categoryCounts"
      :selected="selectedCategories"
      @toggle="emit('toggleCategory', $event)"
    />
  </div>
</template>
