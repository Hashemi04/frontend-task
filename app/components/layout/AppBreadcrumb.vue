<script setup lang="ts">
defineProps<{
  items: { to?: string, label: string }[]
}>()
</script>

<template>
  <nav aria-label="مسیر صفحه" class="mb-5 text-sm">
    <ol class="flex flex-wrap items-center gap-2">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="flex min-w-0 items-center gap-2"
      >
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="text-muted transition-colors hover:text-primary"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="min-w-0 truncate font-medium text-ink">
          {{ item.label }}
        </span>
        <span
          v-if="index < items.length - 1"
          class="text-line"
          aria-hidden="true"
        >/</span>
      </li>
    </ol>
  </nav>
</template>
