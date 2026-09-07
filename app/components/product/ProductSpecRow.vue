<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    stacked?: boolean;
  }>(),
  { stacked: false },
);
</script>

<template>
  <div
    class="rounded-2xl bg-page px-4 py-3 text-sm leading-7 text-section-title"
    :class="
      stacked
        ? 'flex flex-col gap-2'
        : 'flex items-baseline justify-between gap-3'
    "
  >
    <dt class="shrink-0">
      {{ label }}
    </dt>
    <dd class="min-w-0" :class="stacked ? undefined : 'text-end'">
      <slot />
    </dd>
  </div>
</template>
