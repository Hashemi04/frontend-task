<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    placement?: 'start' | 'bottom'
  }>(),
  { placement: 'start' },
)

const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
}

useHistoryClose(() => props.open, close)

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) {
      return
    }
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

function onKeydown(event: KeyboardEvent) {
  if (props.open && event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

const isSheet = computed(() => props.placement === 'bottom')

const panelClass = computed(() =>
  isSheet.value
    ? 'drawer-panel absolute inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-surface shadow-card'
    : 'drawer-panel absolute inset-y-0 start-0 z-50 flex w-[min(20rem,90vw)] flex-col bg-surface shadow-card',
)
</script>

<template>
  <Teleport to="body">
    <Transition :name="isSheet ? 'sheet' : 'drawer'">
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
          :class="panelClass"
        >
          <slot />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
