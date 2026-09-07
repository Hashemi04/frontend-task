<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <div class="relative min-h-0 flex-1 overflow-x-clip">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
