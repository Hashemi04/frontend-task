import { PAGE_SIZE } from "~/utils/productQuery";

interface SitemapUrl {
  loc: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
}

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[char]!,
  );
}

export default defineEventHandler(async (event) => {
  const configured = String(
    useRuntimeConfig(event).public.siteUrl ?? "",
  ).replace(/\/+$/, "");
  const origin = configured || getRequestURL(event).origin;
  const products = await $fetch<Array<{ id: number }>>("/api/products");

  // The document is regenerated on every build, so build time is the honest
  // answer for "when did this last change" — there is no per-product date in
  // the source data to report instead.
  const lastmod = new Date().toISOString().slice(0, 10);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  const urls: SitemapUrl[] = [
    { loc: `${origin}/`, changefreq: "daily", priority: "1.0" },
    ...Array.from({ length: totalPages - 1 }, (_, index) => ({
      loc: `${origin}/page/${index + 2}`,
      changefreq: "daily" as const,
      priority: "0.5",
    })),
    ...products.map((product) => ({
      loc: `${origin}/products/${product.id}`,
      changefreq: "weekly" as const,
      priority: "0.8",
    })),
  ];

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=3600");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
});
