<script setup lang="ts">
import type { SortKey } from "~/utils/productQuery";

withDefaults(
  defineProps<{
    query: string;
    sort: SortKey;
    selectedCategories: string[];
    categoryCounts: { category: string; count: number }[];
    available: boolean;
    sortName?: string;
    showSearch?: boolean;
  }>(),
  { showSearch: true },
);

const emit = defineEmits<{
  search: [value: string];
  clearSearch: [];
  sort: [value: SortKey];
  toggleCategory: [category: string];
  available: [value: boolean];
}>();
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SearchCard
      v-if="showSearch"
      :applied="query"
      @submit="emit('search', $event)"
      @clear="emit('clearSearch')"
    />
    <AvailabilityToggle
      :on="available"
      @toggle="emit('available', $event)"
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
