<script setup lang="ts">
import type { SortKey } from '~/composables/useProductFilters'

const props = withDefaults(
  defineProps<{
    selected: SortKey
    name?: string
  }>(),
  { name: 'product-sort' },
)

const emit = defineEmits<{
  select: [value: SortKey]
}>()

const open = ref(true)

const selectedSort = computed({
  get: () => props.selected,
  set: (value: SortKey) => emit('select', value),
})

const options: { value: SortKey, label: string }[] = [
  { value: 'count-asc', label: 'تعداد: کم به زیاد' },
  { value: 'count-desc', label: 'تعداد: زیاد به کم' },
  { value: 'rating-desc', label: 'رتبه: زیاد به کم' },
  { value: 'rating-asc', label: 'رتبه: کم به زیاد' },
]
</script>

<template>
  <BaseCard as="section" class="p-4 md:p-5">
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between gap-3"
      :aria-expanded="open"
      aria-controls="sort-options"
      @click="open = !open"
    >
      <h2 class="text-base font-bold">مرتب سازی</h2>
      <IconChevron
        class="size-4 text-muted transition-transform duration-200"
        :class="open ? '' : '-rotate-90'"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <fieldset
        id="sort-options"
        class="min-h-0 overflow-hidden border-0 p-0"
        :inert="!open"
      >
        <legend class="sr-only">مرتب سازی محصولات</legend>
        <div class="mt-4 flex flex-col gap-3">
        <label
          v-for="option in options"
          :key="option.value"
          class="flex cursor-pointer items-center gap-2.5"
        >
          <input
            v-model="selectedSort"
            class="size-4 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-line bg-surface checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white]"
            type="radio"
            :name="name"
            :value="option.value"
          >
          <span
            class="text-sm"
            :class="selected === option.value ? 'font-medium text-ink' : 'text-muted'"
          >
            {{ option.label }}
          </span>
        </label>
      </div>
    </fieldset>
    </div>
  </BaseCard>
</template>
