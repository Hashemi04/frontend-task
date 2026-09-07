<script setup lang="ts">
defineProps<{
  items: { to?: string; label?: string; icon?: "home" }[];
}>();
</script>

<template>
  <nav
    aria-label="مسیر صفحه"
    class="mb-5 min-w-0 overflow-x-auto text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <ol class="flex w-max flex-nowrap items-center gap-2">
      <li
        v-for="(item, index) in items"
        :key="`${item.label ?? item.icon}-${index}`"
        class="flex shrink-0 items-center gap-2"
      >
        <NuxtLink
          v-if="item.to && item.icon === 'home'"
          :to="item.to"
          class="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-primary"
          aria-label="خانه"
        >
          <IconHome class="size-4" />
        </NuxtLink>
        <NuxtLink
          v-else-if="item.to"
          :to="item.to"
          class="whitespace-nowrap text-muted transition-colors hover:text-primary"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="whitespace-nowrap font-medium text-ink">
          {{ item.label }}
        </span>
        <IconChevron
          v-if="index < items.length - 1"
          class="size-3.5 shrink-0 rotate-90 text-muted"
        />
      </li>
    </ol>
  </nav>
</template>
