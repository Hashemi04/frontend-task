export default defineEventHandler((event) => {
  const configured = String(
    useRuntimeConfig(event).public.siteUrl ?? "",
  ).replace(/\/+$/, "");
  const origin = configured || getRequestURL(event).origin;

  setHeader(event, "content-type", "text/plain; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=3600");

  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
});
