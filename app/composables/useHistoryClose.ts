const HISTORY_FLAG = 'appOverlay'

/**
 * Closes an overlay when the browser or device back button is pressed.
 * Opening pushes a history entry; closing via UI pops it only if that
 * entry is still on top (so a real navigation from inside the overlay
 * is not undone).
 */
export function useHistoryClose(
  open: MaybeRefOrGetter<boolean>,
  close: () => void,
) {
  const pushed = ref(false)

  watch(
    () => toValue(open),
    (isOpen) => {
      if (!import.meta.client) {
        return
      }

      if (isOpen) {
        history.pushState({ ...(history.state ?? {}), [HISTORY_FLAG]: true }, '')
        pushed.value = true
        return
      }

      if (!pushed.value) {
        return
      }

      pushed.value = false
      if (history.state?.[HISTORY_FLAG]) {
        history.back()
      }
    },
  )

  function onPopState() {
    if (!toValue(open)) {
      return
    }
    pushed.value = false
    close()
  }

  onMounted(() => {
    window.addEventListener('popstate', onPopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', onPopState)
  })
}
