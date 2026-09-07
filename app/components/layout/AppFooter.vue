<script setup lang="ts">
import type { Component } from "vue";
import IconBadgeInstagram from "~/components/icons/IconBadgeInstagram.vue";
import IconBadgeLinkedin from "~/components/icons/IconBadgeLinkedin.vue";
import IconBadgeTelegram from "~/components/icons/IconBadgeTelegram.vue";
import IconBadgeX from "~/components/icons/IconBadgeX.vue";
import IconBadgeYoutube from "~/components/icons/IconBadgeYoutube.vue";
import IconInstagram from "~/components/icons/IconInstagram.vue";
import IconLinkedin from "~/components/icons/IconLinkedin.vue";
import IconTelegram from "~/components/icons/IconTelegram.vue";

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
  { href: "/contact", label: "تلگرام", icon: IconTelegram },
  { href: "/contact", label: "اینستاگرام", icon: IconInstagram },
  { href: "/contact", label: "لینکدین", icon: IconLinkedin },
];

const bottomSocial: { href: string; label: string; icon: Component }[] = [
  { href: "/contact", label: "تلگرام", icon: IconBadgeTelegram },
  { href: "/contact", label: "اینستاگرام", icon: IconBadgeInstagram },
  { href: "/contact", label: "ایکس", icon: IconBadgeX },
  { href: "/contact", label: "یوتیوب", icon: IconBadgeYoutube },
  { href: "/contact", label: "لینکدین", icon: IconBadgeLinkedin },
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
            <NuxtLink
              :to="link.href"
              class="flex items-center gap-2.5 transition-colors hover:text-primary"
            >
              <span
                class="flex size-7 shrink-0 items-center justify-center rounded-full bg-page text-ink"
              >
                <component :is="link.icon" class="size-3.5" />
              </span>
              {{ link.label }}
            </NuxtLink>
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
          <div class="flex items-center gap-4" dir="ltr">
            <NuxtLink
              v-for="item in bottomSocial"
              :key="item.label"
              :to="item.href"
              :aria-label="item.label"
              class="flex size-6 items-center justify-center text-social transition-colors hover:text-social-hover"
            >
              <component :is="item.icon" class="size-6" />
            </NuxtLink>
          </div>
        </div>

        <div
          class="mt-4 flex justify-center gap-3 md:absolute md:end-10 md:top-1/2 md:mt-0 md:-translate-y-1/2 lg:end-16"
        >
          <img
            src="/enamad.png"
            alt="نماد اعتماد الکترونیکی"
            width="72"
            height="72"
            class="size-[72px] rounded-md bg-surface object-contain shadow-sm"
          />
          <img
            src="/samandehi.png"
            alt="ستاد ساماندهی پایگاه‌های اینترنتی"
            width="72"
            height="72"
            class="size-[72px] rounded-md bg-surface object-contain shadow-sm"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
