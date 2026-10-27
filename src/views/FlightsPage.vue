<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import { bookTicket, fetchFlightData, fetchSeats } from '../api/flights.js'
import { prettyDate } from '../utils/format.js'

import AlertMessage from '../components/flights/AlertMessage.vue'
import EmptyState from '../components/flights/EmptyState.vue'
import FlightCard from '../components/flights/FlightCard.vue'
import FlightGroup from '../components/flights/FlightGroup.vue'
import PassengerForm from '../components/flights/PassengerForm.vue'
import ResultsHeader from '../components/flights/ResultsHeader.vue'
import SearchForm from '../components/flights/SearchForm.vue'

/* ---------- Данные ---------- */
const airports = ref([])
const tickets = ref([])
const loading = ref(true)
const loadError = ref('')

onMounted(async () => {
  try {
    const data = await fetchFlightData()
    airports.value = data.airports
    tickets.value = data.tickets
  } catch (e) {
    loadError.value = e.message
  } finally {
    loading.value = false
  }
})

/* ---------- Фильтры (работают на клиенте) ---------- */
const form = reactive({ from: '', to: '', date: '' })
const applied = reactive({ ...form })

function search() {
  Object.assign(applied, form)
  selectedId.value = null
  success.value = ''
}

const results = computed(() =>
  tickets.value
    .filter((t) => !applied.from || t.from === applied.from)
    .filter((t) => !applied.to || t.to === applied.to)
    .filter((t) => !applied.date || t.date === applied.date)
    .sort((a, b) => a.date.localeCompare(b.date) || a.dep.localeCompare(b.dep))
)

// рейсы, сгруппированные по датам
const groups = computed(() => {
  const map = new Map()
  for (const t of results.value) {
    if (!map.has(t.date)) map.set(t.date, [])
    map.get(t.date).push(t)
  }
  return [...map].map(([date, items]) => ({ date, items }))
})

const cityOf = (code) => airports.value.find((a) => a.code === code)?.city ?? code

const resultsTitle = computed(() =>
  applied.from && applied.to
    ? `${cityOf(applied.from)} – ${cityOf(applied.to)}`
    : 'Available flights'
)

/* ---------- Выбор рейса и покупка ---------- */
const selectedId = ref(null)
const submitting = ref(false)
const bookingError = ref('')
const success = ref('')

function select(flight) {
  selectedId.value = selectedId.value === flight.id ? null : flight.id
  bookingError.value = ''
  success.value = ''
}

// Подтягиваем актуальные места из базы (например, если кто-то купил последние)
async function refreshSeats() {
  const fresh = await fetchSeats()
  for (const { id, seats } of fresh) {
    const t = tickets.value.find((x) => x.id === id)
    if (t) t.seats = seats
  }
}

async function buy(flight, passenger) {
  bookingError.value = ''
  success.value = ''
  submitting.value = true
  try {
    const { seats } = await bookTicket(flight.id) // сервер возвращает оставшиеся места
    const ticket = tickets.value.find((t) => t.id === flight.id)
    ticket.seats = seats

    success.value = `Booked a seat on ${flight.number} for ${passenger.first_name.trim()} ${passenger.last_name.trim()}. Confirmation sent to ${passenger.email}.`
    selectedId.value = null
  } catch (e) {
    bookingError.value = e.message
    if (e.status === 409) refreshSeats().catch(() => {})
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:py-14">
    <div class="mx-auto max-w-4xl">
      <header class="mb-6 px-1">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Where to next?</h1>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Pick a route and a date to see available flights.</p>
      </header>

      <SearchForm
        v-model:from="form.from"
        v-model:to="form.to"
        v-model:date="form.date"
        :airports="airports"
        @search="search"
      />

      <ResultsHeader :title="resultsTitle" :count="results.length" />

      <AlertMessage v-if="loading">Loading flights…</AlertMessage>
      <AlertMessage v-if="loadError" variant="error">{{ loadError }}</AlertMessage>
      <AlertMessage v-if="success" variant="success">{{ success }}</AlertMessage>

      <FlightGroup v-for="g in groups" :key="g.date" :label="prettyDate(g.date)">
        <FlightCard
          v-for="f in g.items"
          :key="f.id"
          :flight="f"
          :selected="selectedId === f.id"
          @select="select(f)"
        >
          <PassengerForm
            :flight="f"
            :submitting="submitting"
            :server-error="bookingError"
            @submit="buy(f, $event)"
          />
        </FlightCard>
      </FlightGroup>

      <EmptyState
        v-if="!loading && !loadError && !results.length"
        title="No flights match these filters"
        text="Try another date or choose “Anywhere” for From or To."
      />
    </div>
  </main>
</template>