<script setup lang="ts">
import { navItems, PHONE_HREF } from "~/data/nav";
import { navIcons } from "~/data/navIcons";

const route = useRoute();
const menuOpen = ref(false);

function isActive(to: string) {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-line bg-surface">
    <div
      class="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 md:px-6"
    >
      <nav class="hidden items-center gap-5 md:flex" aria-label="منوی اصلی">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex flex-col items-center gap-1 px-1 text-xs font-medium transition-colors"
          :class="
            isActive(item.to) ? 'text-primary' : 'text-ink hover:text-primary'
          "
        >
          <component :is="navIcons[item.icon]" class="size-5" />
          {{ item.label }}
          <span
            v-if="isActive(item.to)"
            class="absolute -bottom-1 size-1.5 rounded-full bg-primary"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <BaseButton :to="PHONE_HREF">
          <IconPhone class="size-4" />
          تماس
        </BaseButton>

        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-full text-ink md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          aria-label="منو"
          @click="menuOpen = true"
        >
          <IconMenu class="size-6" />
        </button>
      </div>
    </div>

    <MobileNav :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>
