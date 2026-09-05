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
  <header
    class="sticky top-0 z-30 bg-surface shadow-[0_1px_0_rgb(10_42_81_/6%)]"
  >
    <div
      class="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 md:h-[4.5rem] md:px-10 lg:px-16"
    >
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

      <nav
        class="hidden items-center gap-8 lg:gap-12 md:flex"
        aria-label="منوی اصلی"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex items-center gap-2 text-sm font-medium transition-colors"
          :class="
            isActive(item.to) ? 'text-primary' : 'text-ink hover:text-primary'
          "
        >
          <component :is="navIcons[item.icon]" class="size-4 shrink-0" />
          <span class="relative">
            {{ item.label }}
            <span
              v-if="isActive(item.to)"
              class="absolute top-full left-1/2 mt-1.5 size-1.5 -translate-x-1/2 rounded-full bg-primary"
            />
          </span>
        </NuxtLink>
      </nav>

      <BaseButton :to="PHONE_HREF">
        <IconPhone class="size-4" />
        تماس
      </BaseButton>
    </div>

    <MobileNav :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>
