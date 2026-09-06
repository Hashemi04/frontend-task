<script setup lang="ts">
import { navItems, PHONE_HREF } from '~/data/nav'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
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
        <NavItem
          v-for="item in navItems"
          :key="item.to"
          stacked
          :to="item.to"
          :label="item.label"
          :icon="item.icon"
        />
      </nav>

      <BaseButton class="mt-auto" :to="PHONE_HREF" block>
        تماس
      </BaseButton>
    </div>
  </BaseDrawer>
</template>
