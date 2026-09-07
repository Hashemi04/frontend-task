import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  // Subfolders group components by domain; names stay unique so we skip the path prefix.
  components: [{ path: '~/components', pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    pageTransition: { name: 'page' },
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s | فروشگاه',
      meta: [
        {
          name: 'description',
          content: 'فهرست و جزئیات محصولات از فروشگاه آزمایشی Fake Store.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
        { rel: 'preconnect', href: 'https://fakestoreapi.com' },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/': { swr: 120 },
      '/products/**': { swr: 120 },
      '/consultation': { swr: 120 },
      '/faq': { swr: 120 },
      '/contact': { swr: 120 },
      '/about': { swr: 120 },
      '/blog': { swr: 120 },
      '/after-sales': { swr: 120 },
      '/terms': { swr: 120 },
      '/feedback': { swr: 120 },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },
});