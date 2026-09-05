<script setup lang="ts">
type Variant = 'solid' | 'outline'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    to?: string
    block?: boolean
  }>(),
  { variant: 'solid', block: false },
)

const variantClasses: Record<Variant, string> = {
  solid: 'bg-primary text-white hover:bg-primary/90',
  outline: 'border border-primary text-primary hover:bg-primary-soft',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5',
  'text-sm font-medium transition-colors cursor-pointer',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  variantClasses[props.variant],
  props.block && 'w-full',
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else type="button" :class="classes">
    <slot />
  </button>
</template>
