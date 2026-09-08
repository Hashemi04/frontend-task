/**
 * Single source of truth for absolute URLs (canonical, og:url, JSON-LD).
 * `siteUrl` is resolved once at build time (see `build/siteUrl.ts`), so server
 * and client always agree and prerendered markup cannot drift from the browser.
 */
export function useSiteOrigin() {
  const configured = String(useRuntimeConfig().public.siteUrl ?? "").replace(
    /\/+$/,
    "",
  );

  return configured || useRequestURL().origin.replace(/\/+$/, "");
}
