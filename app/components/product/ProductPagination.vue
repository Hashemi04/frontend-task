<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { formatCount } from "~/utils/format";

const props = defineProps<{
  page: number;
  totalPages: number;
  pageLocation: (page: number) => RouteLocationRaw;
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

const hasPrev = computed(() => props.page > 1);
const hasNext = computed(() => props.page < props.totalPages);

const stepBase =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full shadow-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const stepEnabled = `${stepBase} cursor-pointer bg-surface text-heading hover:bg-primary-soft`;
const stepDisabled = `${stepBase} bg-surface text-heading opacity-40`;

const numberBase =
  "inline-flex size-10 items-center justify-center rounded-full text-xs font-medium leading-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const numberCurrent = `${numberBase} bg-primary text-white`;
const numberOther = `${numberBase} cursor-pointer bg-surface text-filter-item shadow-card hover:bg-primary-soft`;
</script>

<template>
  <nav
    class="mt-6 flex items-center justify-between gap-2 md:justify-center md:gap-3"
    aria-label="صفحه‌بندی محصولات"
  >
    <NuxtLink
      v-if="hasPrev"
      :to="pageLocation(page - 1)"
      :class="stepEnabled"
      rel="prev"
      aria-label="صفحه قبل"
    >
      <IconChevron class="size-4 -rotate-90" />
    </NuxtLink>
    <span v-else :class="stepDisabled" aria-hidden="true">
      <IconChevron class="size-4 -rotate-90" />
    </span>

    <p
      class="min-w-0 flex-1 text-center text-xs font-medium leading-4 text-heading md:hidden"
    >
      صفحه {{ formatCount(page) }} از {{ formatCount(totalPages) }}
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
        <span
          v-else-if="item === page"
          :class="numberCurrent"
          aria-current="page"
          :aria-label="`صفحه ${formatCount(item)}`"
        >
          {{ formatCount(item) }}
        </span>
        <NuxtLink
          v-else
          :to="pageLocation(item)"
          :class="numberOther"
          :aria-label="`صفحه ${formatCount(item)}`"
        >
          {{ formatCount(item) }}
        </NuxtLink>
      </li>
    </ul>

    <NuxtLink
      v-if="hasNext"
      :to="pageLocation(page + 1)"
      :class="stepEnabled"
      rel="next"
      aria-label="صفحه بعد"
    >
      <IconChevron class="size-4 rotate-90" />
    </NuxtLink>
    <span v-else :class="stepDisabled" aria-hidden="true">
      <IconChevron class="size-4 rotate-90" />
    </span>
  </nav>
</template>
