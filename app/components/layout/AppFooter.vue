<script setup lang="ts">
const quickLinks = [
  { to: '/contact', label: 'درباره ما' },
  { to: '/contact', label: 'بلاگ' },
  { to: '/contact', label: 'تماس با ما' },
  { to: '/contact', label: 'خدمات پس از فروش' },
]

const guideLinks = [
  { to: '/faq', label: 'قوانین و مقررات' },
  { to: '/consultation', label: 'دریافت مشاوره' },
  { to: '/contact', label: 'انتقادات و پیشنهادات' },
]

const socialLinks = [
  { href: '#', label: 'تلگرام' },
  { href: '#', label: 'اینستاگرام' },
  { href: '#', label: 'لینکدین' },
]
</script>

<template>
  <footer class="mt-8 bg-surface">
    <div class="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
      <p class="text-sm leading-7 text-muted">
        هفت روز هفته از ۸ صبح تا ۱۲ شب پاسخگو هستیم
      </p>

      <div>
        <h2 class="mb-3 text-sm font-bold">دسترسی سریع</h2>
        <ul class="space-y-2 text-sm text-muted">
          <li v-for="link in quickLinks" :key="link.label">
            <NuxtLink :to="link.to" class="hover:text-primary">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="mb-3 text-sm font-bold">راهنمای سایت</h2>
        <ul class="space-y-2 text-sm text-muted">
          <li v-for="link in guideLinks" :key="link.label">
            <NuxtLink :to="link.to" class="hover:text-primary">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="mb-3 text-sm font-bold">شبکه‌های اجتماعی</h2>
        <ul class="space-y-2 text-sm text-muted">
          <li v-for="link in socialLinks" :key="link.label">
            <a :href="link.href" class="hover:text-primary">{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-line">
      <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 py-5 text-center text-xs text-muted md:px-6">
        <p>
          تمامی حقوق مادی و معنوی این وب‌سایت محفوظ است و هرگونه کپی‌برداری پیگرد قانونی دارد.
        </p>
        <div class="flex gap-2">
          <span class="size-10 rounded-md bg-page" aria-hidden="true" />
          <span class="size-10 rounded-md bg-page" aria-hidden="true" />
        </div>
      </div>
    </div>
  </footer>
</template>
