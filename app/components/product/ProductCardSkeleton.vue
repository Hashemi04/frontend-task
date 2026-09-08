<template>
  <article aria-hidden="true">
    <div
      class="flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card"
    >
      <div class="aspect-[4/3] p-4">
        <div class="size-full rounded-2xl bg-line motion-safe:animate-pulse" />
      </div>
      <div class="flex flex-1 flex-col gap-4 px-4 pb-4">
        <div class="flex min-h-[3.25em] flex-col justify-center gap-2">
          <div class="h-4 w-full rounded bg-line motion-safe:animate-pulse" />
          <div class="h-4 w-2/3 rounded bg-line motion-safe:animate-pulse" />
        </div>
        <div
          class="mt-auto h-10 w-full rounded-full bg-line motion-safe:animate-pulse"
        />
      </div>
    </div>
  </article>
</template>
