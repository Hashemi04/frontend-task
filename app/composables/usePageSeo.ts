import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

const DEFAULT_OG_IMAGE = "/og-default.png";
const SITE_NAME = "فروشگاه";

export function usePageSeo(options: {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  /** Absolute-from-root path used for canonical and og:url. Defaults to the
   *  current path, which deliberately drops filter query strings so facets do
   *  not compete with the clean catalog URL. */
  canonicalPath?: MaybeRefOrGetter<string>;
  ogImage?: MaybeRefOrGetter<string | undefined>;
  robots?: MaybeRefOrGetter<string | undefined>;
}) {
  const origin = useSiteOrigin();
  const route = useRoute();

  const canonical = computed(
    () => `${origin}${toValue(options.canonicalPath) ?? route.path}`,
  );
  const image = computed(
    () => toValue(options.ogImage) ?? `${origin}${DEFAULT_OG_IMAGE}`,
  );

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogSiteName: SITE_NAME,
    ogLocale: "fa_IR",
    ogUrl: () => canonical.value,
    ogType: "website",
    ogImage: () => image.value,
    ogImageAlt: () => toValue(options.title),
    twitterCard: "summary_large_image",
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
    twitterImage: () => image.value,
    robots: () => toValue(options.robots),
  });

  useHead({
    link: () => [{ rel: "canonical", href: canonical.value }],
  });
}
