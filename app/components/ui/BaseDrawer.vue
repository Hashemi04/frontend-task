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

const panelRef = ref<HTMLElement | null>(null);

useFocusTrap(
  () => props.open,
  () => panelRef.value,
);

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

const PANEL_BASE =
  "drawer-panel absolute z-50 flex flex-col bg-surface shadow-card outline-none";

const placementClass: Record<NonNullable<typeof props.placement>, string> = {
  bottom: "inset-x-0 bottom-0",
  top: "inset-x-0 top-0 max-h-[85vh] rounded-b-3xl",
  start: "inset-y-0 start-0 w-[min(20rem,90vw)]",
};

/** While dragging, height follows the pointer, so no snap transition. */
const bottomSheetClass = computed(() => {
  if (dragging.value) {
    return "max-h-dvh rounded-t-3xl";
  }

  if (canExpand.value && expanded.value) {
    return "h-dvh max-h-dvh rounded-none sheet-snapping";
  }

  return canExpand.value
    ? "max-h-[85vh] rounded-t-3xl sheet-snapping"
    : "max-h-[85vh] rounded-t-3xl";
});

const panelClass = computed(() => [
  PANEL_BASE,
  placementClass[props.placement],
  props.placement === "bottom" ? bottomSheetClass.value : "",
]);
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName" :duration="220">
      <div v-if="open" class="fixed inset-0 z-40">
        <button
          type="button"
          tabindex="-1"
          class="sheet-overlay absolute inset-0 bg-ink/40"
          aria-label="بستن"
          @click="close"
        />
        <aside
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
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
