<script setup lang="ts">
const props = defineProps<{
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  change: [page: number];
}>();

type PageItem = number | "gap";

const items = computed((): PageItem[] => {
  const total = props.totalPages;
  const current = props.page;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const numbers = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...numbers]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out: PageItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      out.push("gap");
    }
    out.push(sorted[i]!);
  }
  return out;
});

function formatPage(n: number) {
  return n.toLocaleString("fa-IR");
}

const buttonClass =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-heading shadow-card transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface";
</script>

<template>
  <nav
    class="mt-6 flex items-center justify-between gap-2 md:justify-center md:gap-3"
    aria-label="صفحه‌بندی محصولات"
  >
    <button
      type="button"
      :class="buttonClass"
      :disabled="page <= 1"
      aria-label="صفحه قبل"
      @click="emit('change', page - 1)"
    >
      <IconChevron class="size-4 -rotate-90" />
    </button>

    <p
      class="min-w-0 flex-1 text-center text-xs font-medium leading-4 text-heading md:hidden"
    >
      صفحه {{ formatPage(page) }} از {{ formatPage(totalPages) }}
    </p>

    <ul class="hidden items-center gap-1.5 md:flex">
      <li v-for="(item, index) in items" :key="`${item}-${index}`">
        <span
          v-if="item === 'gap'"
          class="grid size-10 place-items-center text-sm text-muted"
          aria-hidden="true"
        >
          …
        </span>
        <button
          v-else
          type="button"
          class="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-xs font-medium leading-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="
            item === page
              ? 'bg-primary text-white'
              : 'bg-surface text-filter-item shadow-card hover:bg-primary-soft'
          "
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`صفحه ${formatPage(item)}`"
          @click="emit('change', item)"
        >
          {{ formatPage(item) }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      :class="buttonClass"
      :disabled="page >= totalPages"
      aria-label="صفحه بعد"
      @click="emit('change', page + 1)"
    >
      <IconChevron class="size-4 rotate-90" />
    </button>
  </nav>
</template>
