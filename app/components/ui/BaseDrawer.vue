<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function close() {
  emit("close");
}

useHistoryClose(() => props.open, close);

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) {
      return;
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
  },
);

function onKeydown(event: KeyboardEvent) {
  if (props.open && event.key === "Escape") {
    close();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-40">
        <button
          type="button"
          class="absolute inset-0 bg-ink/40"
          aria-label="بستن"
          @click="close"
        />
        <aside
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          class="drawer-panel absolute inset-y-0 start-0 z-50 flex w-[min(20rem,90vw)] flex-col bg-surface shadow-card"
        >
          <slot />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
