const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function focusableIn(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => {
    if (el.closest('[inert]')) {
      return false
    }
    return el.getClientRects().length > 0
  })
}

export function useFocusTrap(
  open: MaybeRefOrGetter<boolean>,
  getRoot: () => HTMLElement | null,
) {
  let previous: HTMLElement | null = null

  function onKeydown(event: KeyboardEvent) {
    if (!toValue(open) || event.key !== 'Tab') {
      return
    }

    const root = getRoot()
    if (!root) {
      return
    }

    const items = focusableIn(root)
    if (!items.length) {
      event.preventDefault()
      root.focus()
      return
    }

    const first = items[0]!
    const last = items[items.length - 1]!
    const active = document.activeElement
    const inside = active instanceof Node && root.contains(active)

    if (event.shiftKey && (!inside || active === first)) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && (!inside || active === last)) {
      event.preventDefault()
      first.focus()
    }
  }

  function stopListening() {
    document.removeEventListener('keydown', onKeydown, true)
  }

  watch(
    () => toValue(open),
    async (isOpen) => {
      if (!import.meta.client) {
        return
      }

      if (isOpen) {
        const active = document.activeElement
        previous = active instanceof HTMLElement ? active : null
        await nextTick()
        const root = getRoot()
        if (root && !root.contains(document.activeElement)) {
          ;(focusableIn(root)[0] ?? root).focus()
        }
        document.addEventListener('keydown', onKeydown, true)
        return
      }

      stopListening()
      const target = previous
      previous = null
      if (target?.isConnected) {
        target.focus()
      }
    },
    { flush: 'post' },
  )

  onUnmounted(stopListening)
}
