<script setup lang="ts">
const error = useError()

const is404 = computed(() => error.value?.statusCode === 404)
const title = computed(() =>
  is404.value ? (error.value?.statusMessage || 'صفحه پیدا نشد') : 'خطایی رخ داد',
)
const description = computed(() => {
  if (error.value?.message && error.value.message !== error.value.statusMessage) {
    return error.value.message
  }
  return is404.value
    ? 'آدرس وارد شده در فروشگاه وجود ندارد.'
    : 'دریافت این صفحه با خطا مواجه شد.'
})

function goHome() {
  clearError({ redirect: '/' })
}

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
      <StateMessage
        status="error"
        :title="title"
        :description="description"
        action-label="بازگشت به فهرست"
        @action="goHome"
      />
    </div>
  </NuxtLayout>
</template>
