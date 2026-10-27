<script setup>
// Карточка рейса. Слот по умолчанию показывается под карточкой, когда она выбрана
// (туда кладётся форма пассажира).
defineProps({
  flight: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])

const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2)
</script>

<template>
  <li
    class="rounded-2xl bg-white ring-1 transition dark:bg-slate-900"
    :class="selected ? 'ring-2 ring-indigo-500' : 'ring-slate-200 dark:ring-slate-800'"
  >
    <div class="flex flex-col gap-5 p-5 md:flex-row md:items-center">
      <!-- Авиакомпания -->
      <div class="flex items-center gap-3 md:w-48">
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
          {{ initials(flight.airline) }}
        </span>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold">{{ flight.airline }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ flight.number }}</p>
        </div>
      </div>

      <!-- Маршрут -->
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <div class="min-w-0 flex-1 basis-0 sm:w-28 sm:flex-none">
          <p class="text-xl font-bold">{{ flight.dep }}</p>
          <p class="break-words text-sm font-semibold leading-tight">{{ flight.fromCity }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ flight.from }}</p>
        </div>

        <div class="w-14 shrink-0 sm:w-auto sm:flex-1">
          <p class="whitespace-nowrap text-center text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">{{ flight.duration }}</p>
          <div class="my-1 flex items-center gap-1">
            <span class="h-2 w-2 rounded-full border-2 border-indigo-500"></span>
            <span class="h-0.5 flex-1 bg-slate-200 dark:bg-slate-700"></span>
            <svg class="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" class="origin-center rotate-90" />
            </svg>
            <span class="h-0.5 flex-1 bg-slate-200 dark:bg-slate-700"></span>
            <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
          </div>
          <p class="text-center text-xs text-slate-400 dark:text-slate-500">Direct</p>
        </div>

        <div class="min-w-0 flex-1 basis-0 text-right sm:w-28 sm:flex-none">
          <p class="text-xl font-bold">{{ flight.arr }}</p>
          <p class="break-words text-sm font-semibold leading-tight">{{ flight.toCity }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ flight.to }}</p>
        </div>
      </div>

      <!-- Цена и выбор -->
      <div class="flex items-center justify-between gap-4 md:w-44 md:flex-col md:items-end md:gap-2">
        <div class="md:text-right">
          <p class="text-2xl font-bold leading-none">${{ flight.price }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">per person</p>
          <p
            class="mt-1 text-xs font-semibold"
            :class="flight.seats <= 3 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-700 dark:text-emerald-400'"
          >
            {{ flight.seats === 0 ? 'Sold out' : `Empty seats: ${flight.seats}` }}
          </p>
        </div>
        <button
          type="button"
          :disabled="flight.seats === 0"
          class="rounded-lg border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
          @click="emit('select')"
        >
          {{ selected ? 'Close' : 'Select' }}
        </button>
      </div>
    </div>

    <!-- Раскрывающаяся часть (форма пассажира) -->
    <slot v-if="selected" />
  </li>
</template>