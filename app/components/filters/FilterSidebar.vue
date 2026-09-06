<script setup lang="ts">
import type { SortKey } from '~/composables/useProductFilters'

defineProps<{
  query: string
  sort: SortKey
}>()

const emit = defineEmits<{
  search: [value: string]
  clearSearch: []
  sort: [value: SortKey]
}>()
</script>

<template>
  <aside class="flex w-full shrink-0 flex-col gap-4 lg:w-[17.5rem]">
    <SearchCard
      :applied="query"
      @submit="emit('search', $event)"
      @clear="emit('clearSearch')"
    />
    <SortCard
      :selected="sort"
      @select="emit('sort', $event)"
    />
  </aside>
</template>
