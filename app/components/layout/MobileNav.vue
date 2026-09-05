<script setup lang="ts">
import { navItems, PHONE_HREF } from '~/data/nav'
import { navIcons } from '~/data/navIcons'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <BaseDrawer :open="open" title="منوی سایت" @close="emit('close')">
    <div id="mobile-nav" class="flex h-full flex-col p-4">
      <div class="mb-6 flex items-center justify-between">
        <p class="font-semibold">منو</p>
        <button
          type="button"
          class="flex size-9 items-center justify-center rounded-full text-ink"
          aria-label="بستن منو"
          @click="emit('close')"
        >
          <IconClose class="size-5" />
        </button>
      </div>

      <nav class="flex flex-col gap-1" aria-label="منوی موبایل">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-card px-3 py-3 text-sm font-medium"
          :class="isActive(item.to) ? 'bg-primary-soft text-primary' : 'text-ink hover:bg-page'"
        >
          <component :is="navIcons[item.icon]" class="size-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <BaseButton class="mt-auto" :to="PHONE_HREF" block>
        تماس
      </BaseButton>
    </div>
  </BaseDrawer>
</template>
