const DEV_SITE_URL = "http://localhost:3000";

function normalize(value: string | undefined) {
  const trimmed = (value ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isProductionBuild() {
  return (
    process.env.NODE_ENV === "production" &&
    process.argv.some((arg) => arg === "build" || arg === "generate")
  );
}

/**
 * Canonical, Open Graph, sitemap and JSON-LD URLs are baked into prerendered
 * HTML, so an unset origin silently ships `http://localhost:3000` to
 * production. Fail the build instead of shipping that.
 */
export function resolveSiteUrl(): string {
  const explicit = normalize(
    process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL,
  );
  if (explicit) {
    return explicit;
  }

  const vercel = normalize(
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL,
  );
  if (vercel) {
    return vercel;
  }

  if (isProductionBuild()) {
    throw new Error(
      [
        "NUXT_PUBLIC_SITE_URL is not set.",
        "Canonical, og:url, sitemap and JSON-LD URLs are baked into the prerendered HTML,",
        "so building without it would publish http://localhost:3000 as this site's canonical origin.",
        "Set NUXT_PUBLIC_SITE_URL=https://your-domain.example before building.",
      ].join(" "),
    );
  }

  return DEV_SITE_URL;
}
