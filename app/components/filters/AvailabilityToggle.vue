<script setup lang="ts">
defineProps<{
  on: boolean;
}>();

const emit = defineEmits<{
  toggle: [value: boolean];
}>();

const labelId = useId();
</script>

<template>
  <div
    class="flex items-center justify-between gap-3 rounded-full bg-surface px-4 py-2.5 shadow-card"
  >
    <span :id="labelId" class="text-sm text-ink"> محصولات موجود </span>
    <button
      type="button"
      role="switch"
      dir="ltr"
      class="relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors"
      :class="on ? 'bg-primary' : 'bg-line'"
      :aria-checked="on"
      :aria-labelledby="labelId"
      @click="emit('toggle', !on)"
    >
      <span
        class="absolute top-0.5 flex size-6 items-center justify-center rounded-full bg-white shadow-sm transition-[left]"
        :class="on ? 'left-[22px]' : 'left-0.5'"
        aria-hidden="true"
      >
        <span class="grid grid-cols-2 gap-[2px]">
          <span
            v-for="n in 4"
            :key="n"
            class="size-[3px] rounded-full bg-[#c5d4e8]"
          />
        </span>
      </span>
    </button>
  </div>
</template>
