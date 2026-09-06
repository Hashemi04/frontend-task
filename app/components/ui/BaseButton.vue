<script setup lang="ts">
type Variant = 'solid' | 'outline'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    to?: string
    block?: boolean
    decorative?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'solid', block: false, decorative: false, type: 'button' },
)

const variantClasses: Record<Variant, string> = {
  solid: 'bg-primary text-white hover:bg-primary/90',
  outline: 'border border-primary text-primary hover:bg-primary-soft',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5',
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
  <span v-else-if="decorative" :class="classes">
    <slot />
  </span>
  <button v-else :type="props.type" :class="classes">
    <slot />
  </button>
</template>
