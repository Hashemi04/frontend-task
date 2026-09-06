<script setup lang="ts">
import type { Component } from "vue";
import IconInstagram from "~/components/icons/IconInstagram.vue";
import IconLinkedin from "~/components/icons/IconLinkedin.vue";
import IconTelegram from "~/components/icons/IconTelegram.vue";
import IconX from "~/components/icons/IconX.vue";
import IconYoutube from "~/components/icons/IconYoutube.vue";

const quickLinks = [
  { to: "/contact", label: "درباره ما" },
  { to: "/contact", label: "بلاگ" },
  { to: "/contact", label: "تماس با ما" },
  { to: "/contact", label: "خدمات پس از فروش" },
];

const guideLinks = [
  { to: "/faq", label: "قوانین و مقررات" },
  { to: "/consultation", label: "دریافت مشاوره" },
  { to: "/contact", label: "انتقادات و پیشنهادات" },
];

const socialLinks = [
  { href: "#", label: "تلگرام", icon: IconTelegram },
  { href: "#", label: "اینستاگرام", icon: IconInstagram },
  { href: "#", label: "لینکدین", icon: IconLinkedin },
];

const bottomSocial: { href: string; label: string; icon: Component }[] = [
  { href: "#", label: "تلگرام", icon: IconTelegram },
  { href: "#", label: "اینستاگرام", icon: IconInstagram },
  { href: "#", label: "ایکس", icon: IconX },
  { href: "#", label: "یوتیوب", icon: IconYoutube },
  { href: "#", label: "لینکدین", icon: IconLinkedin },
];
</script>

<template>
  <footer class="mt-10 bg-surface">
    <div
      class="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 md:grid-cols-4 md:items-start md:gap-8 md:px-10 lg:px-16"
    >
      <p class="text-sm leading-8 text-muted md:max-w-[14rem]">
        هفت روز هفته از ۸ صبح تا ۱۲ شب پاسخگو هستیم
      </p>

      <section>
        <h2 class="mb-4 text-base font-bold text-ink">دسترسی سریع</h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="(link, index) in quickLinks" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="transition-colors hover:text-primary"
              :class="index === 0 ? 'text-primary' : 'text-muted'"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="mb-4 text-base font-bold text-ink">راهنمای سایت</h2>
        <ul class="space-y-2.5 text-sm text-muted">
          <li v-for="link in guideLinks" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="transition-colors hover:text-primary"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="mb-4 text-base font-bold text-ink">شبکه‌های اجتماعی</h2>
        <ul class="space-y-3 text-sm text-muted">
          <li v-for="link in socialLinks" :key="link.label">
            <a
              :href="link.href"
              class="flex items-center gap-2.5 transition-colors hover:text-primary"
              rel="nofollow noopener"
            >
              <span
                class="flex size-7 shrink-0 items-center justify-center rounded-full bg-page text-ink"
              >
                <component :is="link.icon" class="size-3.5" />
              </span>
              {{ link.label }}
            </a>
          </li>
        </ul>
      </section>
    </div>

    <div class="bg-page">
      <div class="relative mx-auto max-w-[1440px] px-4 py-6 md:px-10 lg:px-16">
        <div class="flex flex-col items-center gap-3 text-center">
          <p class="max-w-xl text-xs leading-6 text-muted">
            تمامی حقوق مادی و معنوی این وب‌سایت محفوظ است و هرگونه کپی‌برداری
            پیگرد قانونی دارد.
          </p>
          <div class="flex items-center gap-2" dir="ltr">
            <a
              v-for="item in bottomSocial"
              :key="item.label"
              :href="item.href"
              :aria-label="item.label"
              class="flex size-8 items-center justify-center rounded-full bg-primary text-white"
              rel="nofollow noopener"
            >
              <component :is="item.icon" class="size-3.5" />
            </a>
          </div>
        </div>

        <div
          class="mt-4 flex justify-center gap-3 md:absolute md:end-10 md:top-1/2 md:mt-0 md:-translate-y-1/2 lg:end-16"
        >
          <span
            class="size-14 rounded-md bg-surface shadow-sm"
            aria-label="نماد اعتماد"
          />
          <span
            class="size-14 rounded-md bg-surface shadow-sm"
            aria-label="نماد ساماندهی"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
