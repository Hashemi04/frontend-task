export function usePageSeo(options: { title: string, description: string }) {
  const url = useRequestURL()
  const route = useRoute()
  const path = route.path === '/' ? '/' : route.path
  const canonical = `${url.origin}${path}`

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
