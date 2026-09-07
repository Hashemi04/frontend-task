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
    class="md:grid md:grid-cols-[10.5rem_minmax(0,1fr)] md:items-stretch md:gap-2 md:rounded-none md:bg-transparent md:p-0 md:leading-7"
    :class="
      stacked
        ? 'flex flex-col gap-2 rounded-2xl bg-spec-box px-4 py-3 leading-7'
        : 'flex items-baseline justify-between gap-3 rounded-2xl bg-spec-box px-4 py-3 leading-7'
    "
  >
    <dt
      class="shrink-0 text-sm font-normal text-section-title md:flex md:items-center md:rounded-s-2xl md:rounded-e-[4px] md:bg-spec-box md:px-4 md:py-3 md:text-start"
    >
      {{ label }}
    </dt>
    <dd
      class="min-w-0 font-sans text-[13px] font-bold leading-5 text-spec-value md:rounded-s-[4px] md:rounded-e-2xl md:bg-spec-box md:px-4 md:py-3"
      :class="stacked ? 'md:text-start' : 'text-end md:text-start'"
    >
      <slot />
    </dd>
  </div>
</template>
