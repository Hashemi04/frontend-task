import './set-polyfill.mjs'
import tailwindcss from '@tailwindcss/vite';

const staticRoutes = [
  '/',
  '/consultation',
  '/faq',
  '/contact',
  '/about',
  '/blog',
  '/after-sales',
  '/terms',
  '/feedback',
];

const longCache = {
  headers: {
    'cache-control': 'public, max-age=31536000, immutable',
  },
};

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  sourcemap: { client: false, server: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          visibility: false,
          interaction: true,
        },
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'esbuild',
    },
  },
  postcss: {
    plugins: {
      cssnano: false,
    },
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
        { name: 'theme-color', content: '#c2185b' },
      ],
      link: [
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/YekanBakhFaNum-Regular.woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/YekanBakhFaNum-Bold.woff2',
          crossorigin: 'anonymous',
        },
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: [
        ...staticRoutes,
        ...Array.from({ length: 20 }, (_, index) => `/products/${index + 1}`),
      ],
      ignore: ['/img', '/images'],
    },
    routeRules: {
      ...Object.fromEntries(staticRoutes.map((route) => [route, { prerender: true }])),
      '/products/**': { prerender: true },
      '/api/products': { swr: 600 },
      '/api/products/**': { swr: 600 },
      '/fonts/**': longCache,
      '/images/**': longCache,
      '/enamad.png': longCache,
      '/samandehi.png': longCache,
      '/favicon.ico': longCache,
      '/img**': longCache,
      '/_nuxt/**': longCache,
    },
  },
});
