const HISTORY_FLAG = "appOverlay";

/**
 * Closes an overlay when the browser or device back button is pressed.
 * Opening pushes a history entry; closing via UI pops it only if that
 * entry is still on top and the URL did not change (so a replace from
 * inside the overlay, like applying filters, is not undone).
 */
export function useHistoryClose(
  open: MaybeRefOrGetter<boolean>,
  close: () => void,
) {
  const pushed = ref(false);
  const openedHref = ref("");

  watch(
    () => toValue(open),
    (isOpen) => {
      if (!import.meta.client) {
        return;
      }

      if (isOpen) {
        openedHref.value = location.href;
        history.pushState(
          { ...(history.state ?? {}), [HISTORY_FLAG]: true },
          "",
        );
        pushed.value = true;
        return;
      }

      if (!pushed.value) {
        return;
      }

      pushed.value = false;
      if (!history.state?.[HISTORY_FLAG]) {
        return;
      }

      if (location.href === openedHref.value) {
        history.back();
        return;
      }

      const { [HISTORY_FLAG]: _flag, ...nextState } = {
        ...(history.state ?? {}),
      };
      history.replaceState(nextState, "");
    },
  );

  function onPopState() {
    if (!toValue(open)) {
      return;
    }
    pushed.value = false;
    close();
  }

  onMounted(() => {
    window.addEventListener("popstate", onPopState);
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", onPopState);
  });
}
