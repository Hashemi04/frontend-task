export default defineEventHandler((event) => {
  const configured = String(useRuntimeConfig(event).public.siteUrl ?? "").replace(
    /\/$/,
    "",
  );
  const origin = configured || getRequestURL(event).origin;
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
});
