import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

export function usePageSeo(options: {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  ogImage?: MaybeRefOrGetter<string | undefined>;
  robots?: MaybeRefOrGetter<string | undefined>;
}) {
  const origin = useSiteOrigin();
  const route = useRoute();
  const path = route.path === "/" ? "/" : route.path;
  const canonical = `${origin}${path}`;

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogLocale: "fa_IR",
    ogUrl: canonical,
    ogType: "website",
    ogImage: () => toValue(options.ogImage),
    robots: () => toValue(options.robots),
  });

  useHead({
    link: [{ rel: "canonical", href: canonical }],
  });
}
