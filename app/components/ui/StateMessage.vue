<script setup lang="ts">
type Status = 'empty' | 'error' | 'loading'

const props = withDefaults(
  defineProps<{
    status?: Status
    title?: string
    description?: string
    actionLabel?: string
    actionTo?: string
  }>(),
  {
    status: 'empty',
    actionLabel: 'تلاش دوباره',
  },
)

const emit = defineEmits<{
  action: []
}>()

const fallbackTitle: Record<Status, string> = {
  loading: 'در حال بارگذاری',
  empty: 'موردی پیدا نشد',
  error: 'دریافت اطلاعات با خطا مواجه شد',
}

const heading = computed(() => props.title ?? fallbackTitle[props.status])
const isLive = computed(() => props.status !== 'error')
</script>

<template>
  <BaseCard
    class="p-8 text-center"
    :aria-live="isLive ? 'polite' : undefined"
    :aria-busy="status === 'loading' ? 'true' : undefined"
    :role="status === 'error' ? 'alert' : 'status'"
  >
    <span
      v-if="status === 'loading'"
      class="mx-auto mb-4 block size-8 animate-spin rounded-full border-2 border-line border-t-primary"
      aria-hidden="true"
    />

    <h2 class="text-base font-bold">{{ heading }}</h2>

    <p
      v-if="description"
      class="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted"
    >
      {{ description }}
    </p>

    <div v-if="status === 'error'" class="mt-5">
      <BaseButton v-if="actionTo" :to="actionTo">
        {{ actionLabel }}
      </BaseButton>
      <BaseButton v-else type="button" @click="emit('action')">
        {{ actionLabel }}
      </BaseButton>
    </div>
  </BaseCard>
</template>
