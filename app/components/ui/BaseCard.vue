<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string;
  }>(),
  { as: "div" },
);
</script>

<template>
  <component :is="as" class="bg-surface rounded-card overflow-hidden">
    <slot />
  </component>
</template>
