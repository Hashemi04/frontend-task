<script setup lang="ts">
const props = defineProps<{
  applied: string;
}>();

const emit = defineEmits<{
  submit: [value: string];
  clear: [];
}>();

const draft = ref(props.applied);
const focused = ref(false);

watch(
  () => props.applied,
  (value) => {
    draft.value = value;
  },
);

const isActive = computed(() => focused.value || Boolean(draft.value.trim()));

function onSubmit() {
  emit("submit", draft.value);
}

function clear() {
  draft.value = "";
  emit("clear");
}
</script>

<template>
  <BaseCard as="section" class="flex flex-col gap-4 p-4 md:p-5">
    <h2 class="mb-4 text-[13px] font-medium text-section-title">
      فیلتر و جستجو
    </h2>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <label class="sr-only" for="product-search">جستجوی محصول</label>
      <div
        class="flex h-10 items-center rounded-xl border-2 bg-page transition-colors"
        :class="isActive ? 'border-primary' : 'border-line'"
        @focusin="focused = true"
        @focusout="focused = false"
      >
        <button
          type="submit"
          class="flex h-full shrink-0 items-center px-4 transition-colors"
          :class="isActive ? 'text-primary' : 'text-muted'"
          aria-label="جستجو"
        >
          <IconSearch class="size-4" />
        </button>

        <span
          class="my-3 w-px shrink-0 self-stretch bg-line"
          aria-hidden="true"
        />

        <input
          id="product-search"
          v-model="draft"
          type="text"
          name="q"
          class="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted"
          placeholder="جستجو"
          autocomplete="off"
        />

        <button
          v-if="draft"
          type="button"
          class="flex h-full shrink-0 cursor-pointer items-center px-4 text-ink"
          aria-label="پاک کردن جستجو"
          @click="clear"
        >
          <IconClose class="size-3.5" />
        </button>
      </div>

      <BaseButton type="submit" radius="xl" block> جستجو </BaseButton>
    </form>
  </BaseCard>
</template>
