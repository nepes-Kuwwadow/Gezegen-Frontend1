<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
})
</script>

<template>
  <div
    class="mt-6 rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
  >
    <p class="font-semibold">{{ title }}</p>
    <p v-if="text" class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ text }}</p>
  </div>
</template>