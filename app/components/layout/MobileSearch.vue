<script setup lang="ts">
import type { Product } from "~/types/product";
import { queryString } from "~/utils/productQuery";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
const { setQuery } = useCatalogQuery();
const { data: catalogData } = await useCatalogProducts();
const inputRef = ref<HTMLInputElement | null>(null);
const draft = ref("");

const term = computed(() => draft.value.trim());
const catalog = computed(() => catalogData.value ?? []);

type TitlePart = { text: string; match: boolean };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTitle(title: string, query: string): TitlePart[] {
  if (!query) {
    return [{ text: title, match: false }];
  }

  const parts = title.split(new RegExp(`(${escapeRegExp(query)})`, "ig"));
  const needle = query.toLowerCase();

  return parts.filter(Boolean).map((part) => ({
    text: part,
    match: part.toLowerCase() === needle,
  }));
}

const results = computed(() => {
  if (!term.value) {
    return [] as { product: Product; parts: TitlePart[] }[];
  }

  const needle = term.value.toLowerCase();
  return catalog.value
    .filter((product) => product.title.toLowerCase().includes(needle))
    .map((product) => ({
      product,
      parts: highlightTitle(product.title, term.value),
    }));
});

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      return;
    }

    draft.value = queryString(route.query.q);
    await nextTick();
    inputRef.value?.focus();
  },
);

function close() {
  emit("close");
}

function commitToList() {
  setQuery(term.value);
  close();
}

function clearDraft() {
  draft.value = "";
  inputRef.value?.focus();
}
</script>

<template>
  <BaseDrawer placement="top" :open="open" title="جستجوی محصول" @close="close">
    <div class="flex min-h-0 flex-1 flex-col">
      <form
        class="flex items-center gap-2 border-b border-line px-4 py-3"
        @submit.prevent="commitToList"
      >
        <button
          type="button"
          class="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink"
          aria-label="بستن جستجو"
          @click="close"
        >
          <IconClose class="size-5" />
        </button>

        <label class="sr-only" for="mobile-product-search">جستجوی محصول</label>
        <div
          class="flex h-11 min-w-0 flex-1 items-center rounded-full border-2 border-primary bg-page"
        >
          <button
            type="submit"
            class="flex h-full shrink-0 items-center px-3 text-primary"
            aria-label="جستجو"
          >
            <IconSearch class="size-4" />
          </button>
          <input
            id="mobile-product-search"
            ref="inputRef"
            v-model="draft"
            type="text"
            name="q"
            class="min-w-0 flex-1 bg-transparent pe-3 text-sm text-ink outline-none placeholder:text-muted"
            placeholder="جستجو"
            autocomplete="off"
          />
          <button
            v-if="draft"
            type="button"
            class="flex h-full shrink-0 cursor-pointer items-center px-3 text-ink"
            aria-label="پاک کردن جستجو"
            @click="clearDraft"
          >
            <IconClose class="size-3.5" />
          </button>
        </div>
      </form>

      <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <!-- idle: no query yet — not an empty/error state -->
        <p v-if="!term" class="px-1 py-6 text-center text-sm text-muted">
          نام محصول را بنویسید
        </p>
        <!-- empty: typed query, no title matches. local filter over the fetched
             catalog — not a second Fake Store request. -->
        <StateMessage
          v-else-if="!results.length"
          status="empty"
          title="محصولی پیدا نشد"
          description="محصولی با این جستجو پیدا نشد."
        />
        <!-- ready: at least one title match -->
        <ul v-else class="flex flex-col gap-1" aria-label="نتایج جستجو">
          <li v-for="{ product, parts } in results" :key="product.id">
            <NuxtLink
              :to="`/products/${product.id}`"
              class="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-page"
            >
              <NuxtImg
                provider="catalog"
                :src="String(product.id)"
                :alt="product.title"
                width="48"
                height="48"
                class="size-12 shrink-0 rounded-lg bg-page object-contain p-1"
              />
              <p class="min-w-0 flex-1 text-sm font-medium leading-6">
                <template v-for="(part, index) in parts" :key="index">
                  <mark
                    v-if="part.match"
                    class="rounded-sm bg-primary-soft text-primary"
                    >{{ part.text }}</mark
                  >
                  <span v-else>{{ part.text }}</span>
                </template>
              </p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </BaseDrawer>
</template>
