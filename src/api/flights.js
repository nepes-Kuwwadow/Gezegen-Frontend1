// src/api/flights.js
// Всё общение с бэкендом и приведение данных к формату компонентов.
// В dev запросы идут через прокси Vite (vite.config.js) на `php artisan serve`.
const API = 'http://127.0.0.1:8000/api/v1'

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(API + path, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('Cannot reach the server. Is `php artisan serve` running?')
  }

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const err = new Error(json?.message || `Request ${path} failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return json
}

// Laravel Resource-коллекции приходят как { data: [...] }, простые — как [...]
async function getList(path) {
  const json = await request(path)
  return Array.isArray(json) ? json : json?.data ?? []
}

/* ---------- Приведение данных ---------- */
const shortName = (a) =>
  a.name.replace(/ International Airport$/, '').replace(/ Airport$/, '')

// Город аэропорта: из вложенного city, из /cities по city_id, иначе из названия аэропорта
function makeCityName(rawCities) {
  const byId = new Map(rawCities.map((c) => [c.id, c.name]))
  return (a) => a?.city?.name ?? byId.get(a?.city_id) ?? (a?.name ? shortName(a) : '')
}

function durationOf(from, to) {
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  let diff = toMin(to) - toMin(from)
  if (diff < 0) diff += 1440 // прилёт после полуночи
  return `${Math.floor(diff / 60)} hr ${diff % 60} min`
}

function normalize(rawTickets, rawFlights, rawAirports, cityName) {
  const airportsById = new Map(rawAirports.map((a) => [a.id, a]))
  const flightsById = new Map(rawFlights.map((f) => [f.id, f]))

  return rawTickets.map((t) => {
    // работает и если API вкладывает flight / airports, и если отдаёт только id
    const flight = t.flight ?? flightsById.get(t.flight_id) ?? {}
    const fromA = flight.from_airport ?? flight.fromAirport ?? airportsById.get(flight.from_airport_id) ?? {}
    const toA = flight.to_airport ?? flight.toAirport ?? airportsById.get(flight.to_airport_id) ?? {}
    const dep = String(flight.from_time ?? '00:00').slice(0, 5)
    const arr = String(flight.to_time ?? '00:00').slice(0, 5)

    return {
      id: t.id,
      airline: flight.airlines,
      number: flight.code,
      from: fromA.code,
      to: toA.code,
      fromCity: cityName(fromA),
      toCity: cityName(toA),
      date: String(t.date).slice(0, 10),
      dep,
      arr,
      duration: durationOf(dep, arr),
      price: Number(t.price),
      seats: Number(t.seats ?? 0),
    }
  })
}

/* ---------- Публичные функции ---------- */

/** Загружает аэропорты и билеты (уже в формате для интерфейса). */
export async function fetchFlightData() {
  const [rawAirports, rawFlights, rawTickets, rawCities] = await Promise.all([
    getList('/airports'),
    getList('/flights'),
    getList('/tickets'),
    getList('/cities'),
  ])
  const cityName = makeCityName(rawCities)

  return {
    airports: rawAirports.map((a) => ({
      code: a.code,
      city: cityName(a),
      label: `${cityName(a)} (${a.code})`,
    })),
    tickets: normalize(rawTickets, rawFlights, rawAirports, cityName),
  }
}

/** Актуальное число мест по каждому билету: [{ id, seats }] */
export async function fetchSeats() {
  const list = await getList('/tickets')
  return list.map((t) => ({ id: t.id, seats: Number(t.seats ?? 0) }))
}

/** Занимает одно место. Возвращает { id, seats }. При 409 мест нет. */
export function bookTicket(id) {
  return request(`/tickets/${id}/book`, { method: 'POST' })
}