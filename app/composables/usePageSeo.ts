export function usePageSeo(options: { title: string, description: string }) {
  const origin = useSiteOrigin()
  const route = useRoute()
  const path = route.path === '/' ? '/' : route.path
  const canonical = `${origin}${path}`

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogLocale: 'fa_IR',
    ogUrl: canonical,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}
