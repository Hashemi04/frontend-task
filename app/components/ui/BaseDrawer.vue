<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    placement?: "start" | "bottom" | "top";
    expandable?: boolean;
  }>(),
  { placement: "start", expandable: false },
);

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

const canExpand = computed(
  () => props.expandable && props.placement === "bottom",
);

const { expanded, dragging, panelStyle, onPointerDown } = useSheetExpand(
  canExpand,
  () => props.open,
  close,
);

const transitionName = computed(() => {
  if (props.placement === "bottom") {
    return "sheet";
  }
  if (props.placement === "top") {
    return "sheet-top";
  }
  return "drawer";
});

const panelClass = computed(() => {
  if (props.placement === "bottom") {
    const rounding =
      canExpand.value && expanded.value && !dragging.value
        ? "rounded-none"
        : "rounded-t-3xl";
    const size = dragging.value
      ? "max-h-dvh"
      : canExpand.value && expanded.value
        ? "h-dvh max-h-dvh"
        : "max-h-[85vh]";
    const motion = canExpand.value && !dragging.value ? "sheet-snapping" : "";
    return `drawer-panel absolute inset-x-0 bottom-0 z-50 flex ${size} ${rounding} ${motion} flex-col bg-surface shadow-card`;
  }
  if (props.placement === "top") {
    return "drawer-panel absolute inset-x-0 top-0 z-50 flex max-h-[85vh] flex-col rounded-b-3xl bg-surface shadow-card";
  }
  return "drawer-panel absolute inset-y-0 start-0 z-50 flex w-[min(20rem,90vw)] flex-col bg-surface shadow-card";
});
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName" :duration="220">
      <div v-if="open" class="fixed inset-0 z-40">
        <button
          type="button"
          class="sheet-overlay absolute inset-0 bg-ink/40"
          aria-label="بستن"
          @click="close"
        />
        <aside
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          :aria-expanded="canExpand ? expanded : undefined"
          :class="panelClass"
          :style="panelStyle"
          @pointerdown="onPointerDown"
        >
          <slot :expanded="expanded" />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
