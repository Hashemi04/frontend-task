<script setup lang="ts">
import { formatCount } from "~/utils/format";

const props = defineProps<{
  categories: { category: string; count: number }[];
  selected: string[];
}>();

const emit = defineEmits<{
  toggle: [category: string];
}>();

const open = ref(true);

function isSelected(category: string) {
  return props.selected.includes(category);
}
</script>

<template>
  <BaseCard as="section" class="p-4 md:p-5">
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between gap-3"
      :aria-expanded="open"
      aria-controls="category-options"
      @click="open = !open"
    >
      <h2 class="text-[13px] font-medium leading-none text-section-title">
        دسته بندی
      </h2>
      <IconChevron
        class="size-4 text-muted transition-transform duration-200"
        :class="open ? '' : 'rotate-90'"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <fieldset
        id="category-options"
        class="min-h-0 overflow-hidden border-0 p-0"
        :inert="!open"
      >
        <legend class="sr-only">دسته بندی محصولات</legend>
        <div class="mt-4 flex flex-col gap-3">
          <label
            v-for="item in categories"
            :key="item.category"
            class="flex cursor-pointer items-center gap-2.5"
          >
            <span class="relative grid size-4 shrink-0 place-items-center">
              <input
                class="size-4 cursor-pointer appearance-none rounded-[4px] border-2 border-line bg-surface checked:border-primary checked:bg-primary"
                type="checkbox"
                :value="item.category"
                :checked="isSelected(item.category)"
                @change="emit('toggle', item.category)"
              />
              <IconCheck
                v-if="isSelected(item.category)"
                class="pointer-events-none absolute size-2.5 text-white"
              />
            </span>
            <span
              class="min-w-0 flex-1 text-sm"
              :class="
                isSelected(item.category)
                  ? 'font-medium text-ink'
                  : 'text-muted'
              "
            >
              {{ item.category }}
            </span>
            <span
              class="min-w-6 rounded-md px-1.5 py-0.5 text-center text-[11px] font-medium text-white"
              :class="isSelected(item.category) ? 'bg-primary' : 'bg-ink'"
            >
              {{ formatCount(item.count) }}
            </span>
          </label>
        </div>
      </fieldset>
    </div>
  </BaseCard>
</template>
