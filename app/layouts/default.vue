<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <div class="relative flex-1 overflow-hidden">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
