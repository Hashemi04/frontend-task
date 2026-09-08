export default defineEventHandler(async (event) => {
  const configured = String(useRuntimeConfig(event).public.siteUrl ?? "").replace(
    /\/$/,
    "",
  );
  const origin = configured || getRequestURL(event).origin;
  const products = await $fetch<Array<{ id: number }>>("/api/products");
  const urls = [
    `${origin}/`,
    ...products.map((product) => `${origin}/products/${product.id}`),
  ];

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
});
