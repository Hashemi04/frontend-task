<script setup lang="ts">
import { navItems, PHONE_HREF } from "~/data/nav";

const route = useRoute();
const menuOpen = ref(false);
const searchOpen = ref(false);

const mobileIconButton =
  "inline-flex size-10 items-center justify-center rounded-xl border border-primary bg-surface text-primary";

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
    searchOpen.value = false;
  },
);
</script>

<template>
  <header
    class="sticky top-0 z-30 bg-surface shadow-[0_1px_0_rgb(10_42_81_/6%)] rounded-b-4xl"
  >
    <div
      class="relative mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 md:h-18 md:justify-end md:px-10 lg:px-16"
    >
      <button
        type="button"
        :class="[mobileIconButton, 'md:hidden']"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        aria-label="منو"
        @click="menuOpen = true"
      >
        <IconMenu class="size-5" />
      </button>

      <nav
        class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex"
        aria-label="منوی اصلی"
      >
        <NavItem
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          :icon="item.icon"
        />
      </nav>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-full text-primary lg:hidden"
          :aria-expanded="searchOpen"
          aria-controls="mobile-product-search"
          aria-label="جستجو"
          @click="searchOpen = true"
        >
          <IconSearch class="size-5" />
        </button>
        <NuxtLink
          :to="PHONE_HREF"
          :class="[mobileIconButton, 'md:hidden']"
          aria-label="تماس"
        >
          <IconPhone class="size-5" />
        </NuxtLink>
        <span class="hidden md:inline-flex">
          <BaseButton :to="PHONE_HREF">
            تماس
            <IconPhone class="size-4" />
          </BaseButton>
        </span>
      </div>
    </div>

    <MobileNav :open="menuOpen" @close="menuOpen = false" />
    <MobileSearch :open="searchOpen" @close="searchOpen = false" />
  </header>
</template>
