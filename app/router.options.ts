import type { RouterConfig } from "@nuxt/schema";
import type { RouteLocationNormalized } from "vue-router";

function productIdFrom(route: RouteLocationNormalized) {
  if (!route.path.startsWith("/products/")) {
    return undefined;
  }

  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export default {
  scrollBehavior(to, from, savedPosition) {
    const productId = from ? productIdFrom(from) : undefined;

    if (to.path === "/" && productId) {
      return new Promise((resolve) => {
        const tryScroll = (attempt = 0) => {
          const el = document.getElementById(`product-card-${productId}`);
          if (el) {
            resolve({ el, behavior: "auto" });
            return;
          }

          if (attempt < 24) {
            requestAnimationFrame(() => tryScroll(attempt + 1));
            return;
          }

          resolve(savedPosition ?? false);
        };

        requestAnimationFrame(() => tryScroll());
      });
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
