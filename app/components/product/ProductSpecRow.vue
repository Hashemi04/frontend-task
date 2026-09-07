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
    class="rounded-2xl bg-page px-4 py-3 leading-7"
    :class="
      stacked
        ? 'flex flex-col gap-2'
        : 'flex items-baseline justify-between gap-3'
    "
  >
    <dt class="shrink-0 text-sm font-normal text-section-title">
      {{ label }}
    </dt>
    <dd
      class="min-w-0 font-sans text-[13px] font-bold leading-5 text-spec-value"
      :class="stacked ? undefined : 'text-end'"
    >
      <slot />
    </dd>
  </div>
</template>
