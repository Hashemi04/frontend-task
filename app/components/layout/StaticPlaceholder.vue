<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
    <BaseCard class="p-6">
      <h1 class="mb-3 text-xl font-bold">{{ title }}</h1>
      <p class="text-sm leading-7 text-muted">
        این صفحه در طراحی Figma وجود دارد ولی دادهٔ Fake Store برای آن نیست.
        لینک‌ها واقعی هستند تا منوی موبایل کار کند.
      </p>
    </BaseCard>
  </div>
</template>
