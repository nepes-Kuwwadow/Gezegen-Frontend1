<script setup>
defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
})
</script>

<template>
  <div class="mt-10 flex items-baseline justify-between gap-4 px-1">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400">{{ count }} found</p>
  </div>
</template>