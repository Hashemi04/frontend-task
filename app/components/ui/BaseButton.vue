<script setup lang="ts">
type Variant = "solid" | "outline";
type Radius = "full" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "none";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    radius?: Radius;
    to?: string;
    block?: boolean;
    decorative?: boolean;
    type?: "button" | "submit";
  }>(),
  {
    variant: "solid",
    radius: "full",
    block: false,
    decorative: false,
    type: "button",
  },
);

const variantClasses: Record<Variant, string> = {
  solid: "bg-primary text-white hover:bg-primary/90",
  outline: "border border-primary text-primary hover:bg-primary-soft",
};

const radiusClasses: Record<Radius, string> = {
  full: "rounded-full",
  "3xl": "rounded-3xl",
  "2xl": "rounded-2xl",
  xl: "rounded-xl",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded-sm",
  none: "rounded-none",
};

const classes = computed(() => [
  "inline-flex items-center justify-center gap-2 px-5 py-2.5",
  "text-sm font-semibold transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  radiusClasses[props.radius],
  variantClasses[props.variant],
  props.block && "w-full",
]);
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
