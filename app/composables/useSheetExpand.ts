const COMPACT_VH = 0.85
const MIN_HEIGHT = 140

export function useSheetExpand(
  enabled: MaybeRefOrGetter<boolean>,
  open: MaybeRefOrGetter<boolean>,
  onClose: () => void,
) {
  const expanded = ref(false)
  const dragging = ref(false)
  const heightPx = ref<number | null>(null)

  let startY = 0
  let startHeight = 0
  let startExpanded = false
  let lastY = 0
  let lastTime = 0
  let velocity = 0

  function stopListening() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }

  watch(
    () => toValue(open),
    (isOpen) => {
      if (isOpen) {
        return
      }
      stopListening()
      expanded.value = false
      dragging.value = false
      heightPx.value = null
    },
  )

  onUnmounted(stopListening)

  function compactMax() {
    return Math.round(window.innerHeight * COMPACT_VH)
  }

  function onPointerDown(event: PointerEvent) {
    if (!toValue(enabled) || event.button !== 0) {
      return
    }

    const target = event.target as HTMLElement | null
    if (!target?.closest('[data-sheet-handle]')) {
      return
    }
    if (target.closest('button, a, input, textarea, label')) {
      return
    }

    const el = event.currentTarget as HTMLElement | null
    if (!el) {
      return
    }

    dragging.value = true
    startY = event.clientY
    startHeight = el.getBoundingClientRect().height
    startExpanded = expanded.value
    heightPx.value = startHeight
    lastY = event.clientY
    lastTime = event.timeStamp
    velocity = 0
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    }
    catch {
      // Synthetic or non-capturing pointers still use window listeners.
    }
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging.value) {
      return
    }

    const dt = event.timeStamp - lastTime
    if (dt > 0) {
      velocity = (event.clientY - lastY) / dt
    }
    lastY = event.clientY
    lastTime = event.timeStamp

    const next = startHeight - (event.clientY - startY)
    heightPx.value = Math.min(window.innerHeight, Math.max(MIN_HEIGHT, next))
    event.preventDefault()
  }

  function onPointerUp() {
    if (!dragging.value) {
      return
    }

    dragging.value = false
    stopListening()
    const height = heightPx.value ?? startHeight
    const compact = compactMax()
    const full = window.innerHeight
    const midpoint = (compact + full) / 2
    const flickedUp = velocity < -0.35
    const flickedDown = velocity > 0.35

    if (startExpanded) {
      const draggedDown = height < startHeight - 64
      expanded.value = flickedUp || (!flickedDown && !draggedDown && height >= midpoint)
      heightPx.value = null
      return
    }

    const pulledDown = height < startHeight - 96 && height < compact * 0.7
    if (pulledDown || (flickedDown && height < startHeight - 48)) {
      heightPx.value = null
      expanded.value = false
      onClose()
      return
    }

    const draggedUp = height > startHeight + 64
    expanded.value = flickedUp || draggedUp || height >= midpoint
    heightPx.value = null
  }

  const panelStyle = computed(() => {
    if (!toValue(enabled) || heightPx.value == null) {
      return undefined
    }
    return {
      height: `${heightPx.value}px`,
      maxHeight: '100dvh',
    }
  })

  return {
    expanded,
    dragging,
    panelStyle,
    onPointerDown,
  }
}
