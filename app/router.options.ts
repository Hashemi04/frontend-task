import type { RouterConfig } from "@nuxt/schema";
import type { RouteLocationNormalized } from "vue-router";
import { isCatalogPath } from "~/utils/productQuery";

function productIdFrom(route: RouteLocationNormalized) {
  if (!route.path.startsWith("/products/")) {
    return undefined;
  }

  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id;
}

/** Height of the sticky chrome that would otherwise cover the scroll target. */
function stickyOffset() {
  const header = document.querySelector("header");
  const toolbar = document.getElementById("catalog-toolbar");
  return (
    (header?.getBoundingClientRect().height ?? 56) +
    (toolbar?.getBoundingClientRect().height ?? 0) +
    8
  );
}

/** Waits for an element the incoming page has not rendered yet. */
function whenPainted<T>(
  find: () => T | null | undefined,
  fallback: T | false,
  attempts = 24,
) {
  return new Promise<T | false>((resolve) => {
    const tick = (attempt = 0) => {
      const found = find();
      if (found) {
        resolve(found);
        return;
      }

      if (attempt < attempts) {
        requestAnimationFrame(() => tick(attempt + 1));
        return;
      }

      resolve(fallback);
    };

    requestAnimationFrame(() => tick());
  });
}

export default {
  async scrollBehavior(to, from, savedPosition) {
    // Coming back to the catalog from a product: land on the card you left.
    const productId = from ? productIdFrom(from) : undefined;
    if (productId && isCatalogPath(to.path)) {
      const el = await whenPainted(
        () => document.getElementById(`product-card-${productId}`),
        false,
      );
      if (el) {
        return { el, top: stickyOffset(), behavior: "auto" };
      }
      return savedPosition ?? false;
    }

    // Paginating within the catalog: put the first card of the new page under
    // the toolbar instead of bouncing the reader to the top of the document.
    if (
      from &&
      to.path !== from.path &&
      isCatalogPath(to.path) &&
      isCatalogPath(from.path)
    ) {
      const el = await whenPainted(
        () => document.getElementById("product-catalog"),
        false,
      );
      if (el) {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        return {
          el,
          top: stickyOffset(),
          behavior: reduced ? "auto" : "smooth",
        };
      }
    }

    if (savedPosition) {
      return savedPosition;
    }

    if (from && to.path === from.path) {
      return false;
    }

    return { top: 0, left: 0 };
  },
} satisfies RouterConfig;
