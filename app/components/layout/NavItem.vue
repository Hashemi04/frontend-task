<script setup lang="ts">
import type { NavIconName } from '~/data/nav'
import { navIcons } from '~/data/navIcons'

const props = withDefaults(
  defineProps<{
    to: string
    label: string
    icon: NavIconName
    stacked?: boolean
  }>(),
  { stacked: false },
)

const route = useRoute()

const isActive = computed(() =>
  props.to === '/' ? route.path === '/' : route.path.startsWith(props.to),
)
</script>

<template>
  <NuxtLink
    :to="to"
    :class="
      stacked
        ? [
            'flex items-center gap-2 rounded-card px-3 py-3 text-sm font-medium',
            isActive ? 'bg-primary-soft text-primary' : 'text-ink hover:bg-page',
          ]
        : [
            'relative flex items-center gap-2 text-sm font-medium transition-colors',
            isActive ? 'text-primary' : 'text-ink hover:text-primary',
          ]
    "
  >
    <component :is="navIcons[icon]" class="shrink-0" :class="stacked ? 'size-5' : 'size-4'" />
    <span class="relative">
      {{ label }}
      <span
        v-if="isActive && !stacked"
        class="absolute top-full left-1/2 mt-1.5 size-1.5 -translate-x-1/2 rounded-full bg-primary"
      />
    </span>
  </NuxtLink>
</template>
