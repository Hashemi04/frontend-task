<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:text-ink"
    >
      رفتن به محتوا
    </a>
    <AppHeader />
    <main id="main" class="relative min-h-0 flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
