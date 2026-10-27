<script setup>
import { computed } from 'vue'

// variant: 'muted' (загрузка) | 'error' | 'success'
const props = defineProps({
  variant: { type: String, default: 'muted' },
})

const classes = {
  muted: 'mt-4 text-sm text-slate-500 dark:text-slate-400',
  error: 'mt-4 text-sm text-red-600 dark:text-red-400',
  success:
    'mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30',
}
const roles = { error: 'alert', success: 'status' }

const cls = computed(() => classes[props.variant] ?? classes.muted)
const role = computed(() => roles[props.variant])
</script>

<template>
  <p :class="cls" :role="role"><slot /></p>
</template>