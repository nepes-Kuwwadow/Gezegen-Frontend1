<script setup>
// Поиск: From / To / Date. Значения связываются через v-model:from, v-model:to, v-model:date
// (defineModel требует Vue 3.4+)
defineProps({
  airports: { type: Array, default: () => [] },
})
const emit = defineEmits(['search'])

const from = defineModel('from', { default: '' })
const to = defineModel('to', { default: '' })
const date = defineModel('date', { default: '' })

function swap() {
  const prev = from.value
  from.value = to.value
  to.value = prev
}
</script>

<template>
  <form
    class="relative grid grid-cols-1 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:grid-cols-[1fr_1fr_1fr_auto]"
    @submit.prevent="emit('search')"
  >
    <label class="block border-b border-slate-200 px-5 py-3 dark:border-slate-800 lg:border-b-0 lg:border-r">
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">From</span>
      <select
        v-model="from"
        class="mt-0.5 block w-full bg-transparent text-base font-semibold outline-none dark:[color-scheme:dark]"
      >
        <option value="">Anywhere</option>
        <option v-for="a in airports" :key="a.code" :value="a.code">{{ a.label }}</option>
      </select>
    </label>

    <label class="relative block border-b border-slate-200 px-5 py-3 dark:border-slate-800 lg:border-b-0 lg:border-r">
      <button
        type="button"
        title="Swap From and To"
        aria-label="Swap From and To"
        class="absolute -top-4 right-5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-500 shadow ring-1 ring-slate-200 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-indigo-300 lg:-left-4 lg:right-auto lg:top-1/2 lg:-translate-y-1/2"
        @click.prevent="swap"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
        </svg>
      </button>
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">To</span>
      <select
        v-model="to"
        class="mt-0.5 block w-full bg-transparent text-base font-semibold outline-none dark:[color-scheme:dark]"
      >
        <option value="">Anywhere</option>
        <option v-for="a in airports" :key="a.code" :value="a.code">{{ a.label }}</option>
      </select>
    </label>

    <label class="block border-b border-slate-200 px-5 py-3 dark:border-slate-800 lg:border-b-0">
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Date</span>
      <input
        v-model="date"
        type="date"
        class="mt-0.5 block w-full bg-transparent text-base font-semibold outline-none dark:[color-scheme:dark]"
      />
    </label>

    <button
      type="submit"
      class="m-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      Search
    </button>
  </form>
</template>