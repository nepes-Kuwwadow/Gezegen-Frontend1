<!-- src/components/flights/FlightCard.vue -->
<script setup>
defineProps({
  flight: { type: Object, required: true },
  selected: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>

<template>
  <div
    class="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between bg-slate-900/40 border border-slate-800 rounded-2xl">

    <!-- Airline / Flight Number (Bazadan gelýän airline adyna görä üýtgeýär) -->
    <div class="flex items-center gap-4 min-w-[180px]">
      <div
        class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 uppercase">
        {{ flight.airline ? flight.airline.substring(0, 2) : (flight.number ? flight.number.substring(0, 2) : 'FL') }}
      </div>
      <div>
        <div class="font-bold text-slate-900 dark:text-slate-100">{{ flight.airline }}</div>
        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ flight.number }}</div>
      </div>
    </div>

    <!-- Flight Route & Times (Ortada takyk deňlenen wagtlar we uçar çyzygy) -->
    <div class="flex items-center justify-between gap-6 sm:justify-center flex-1 max-w-md mx-auto">

      <!-- Departure (Çykyş wagty - Çep tarapda) -->
      <div class="flex flex-col text-left">
        <div class="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {{ flight.dep }}
        </div>
        <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {{ flight.fromCity }}
        </div>
        <div class="text-[10px] text-slate-400">
          {{ flight.from }}
        </div>
      </div>

      <!-- Duration & Direct Line (Ortada uçar çyzygy) -->
      <div class="flex flex-col items-center">
        <span class="text-[10px] font-medium text-slate-400 whitespace-nowrap">{{ flight.duration }}</span>
        <div class="relative flex items-center w-28 my-1">
          <div class="h-[1px] w-full bg-slate-300 dark:bg-slate-700"></div>
          <span
            class="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-1 text-xs text-slate-400">✈️</span>
        </div>
        <span class="text-[10px] text-slate-400">Direct</span>
      </div>

      <!-- Arrival (Baryş wagty - Sag tarapda) -->
      <div class="flex flex-col text-right">
        <div class="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {{ flight.arr }}
        </div>
        <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {{ flight.toCity }}
        </div>
        <div class="text-[10px] text-slate-400">
          {{ flight.to }}
        </div>
      </div>

    </div>

    <!-- Price & Action -->
    <div
      class="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-800 pt-4 sm:border-0 sm:pt-0 min-w-[220px]">
      <div class="text-left sm:text-right">
        <div class="text-xl font-bold text-slate-900 dark:text-slate-100">${{ flight.price }}</div>
        <span class="text-xs text-slate-400 whitespace-nowrap">per person • Seats: {{ flight.empty_seats ?? flight.seats
        }}</span>
      </div>

      <button type="button"
        class="rounded-xl px-5 py-2.5 text-sm font-semibold transition bg-indigo-600 text-white hover:bg-indigo-500 shrink-0"
        @click="$emit('select', flight)">
        Select
      </button>
    </div>

  </div>
</template>