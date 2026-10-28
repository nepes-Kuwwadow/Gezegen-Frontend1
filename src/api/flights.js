// src/api/flights.js

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

export async function fetchFlightData() {
  const [airportsRes, flightsRes] = await Promise.all([
    fetch(`${API_BASE_URL}/airports`),
    fetch(`${API_BASE_URL}/flights`)
  ]);

  const airportsData = await airportsRes.json();
  const flightsData = await flightsRes.json();
  

  const airports = Array.isArray(airportsData) ? airportsData : (airportsData.data || []);
  const flights = Array.isArray(flightsData) ? flightsData : (flightsData.data || []);

  const airportMap = new Map(airports.map(a => [a.code || a.id, { city: a.city || a.name, label: a.name || a.city }]));
  const getTime = (v) => v ? v.slice(-8, -3) : '08:00';

  // Diňe sagat we minutlary alyp, dogry we gysga wagt hasaplaýan funksiýa
  function calculateDuration(dep, arr) {
    if (!dep || !arr) return '2h';

    // Wagt bölegini (HH:mm) çykaryp alýarys
    const getTimeMinutes = (str) => {
      const timePart = str.includes(' ') ? str.split(' ')[1] : str;
      const parts = timePart.split(':');
      return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
    };

    let diffMin = getTimeMinutes(arr) - getTimeMinutes(dep);
    if (diffMin < 0) diffMin += 24 * 60; // Eger arrival indiki güne geçýän bolsa

    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;

    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  const tickets = flights.map(t => {
    const fromCode = t.from_airport?.code || t.from || 'MIA';
    const toCode = t.to_airport?.code || t.to || 'ORD';
    const fromObj = airportMap.get(fromCode);
    const toObj = airportMap.get(toCode);

    let rawNumber = t.flight_number || t.number || `FL-${t.id}`;
    let airlineName = t.airline || 'Emirates';

    if (rawNumber && rawNumber.startsWith('AA-') && airlineName !== 'American Airlines') {
      const prefix = airlineName.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
      rawNumber = rawNumber.replace('AA-', prefix + '-');
    }

    return {
      id: t.id,
      number: rawNumber,
      from: fromCode,
      fromCity: fromObj?.city || fromCode,
      to: toCode,
      toCity: toObj?.city || toCode,
      date: (t.departure_time || t.date || '').split(' ')[0],
      dep: getTime(t.departure_time || t.dep_time),
      arr: getTime(t.arrival_time || t.arr_time),
      duration: t.duration || calculateDuration(t.departure_time, t.arrival_time),
      airline: airlineName,
      price: t.price ?? 100,
      seats: t.empty_seats ?? t.seats_available ?? t.seats ?? 0,
    };
  });

  return { airports, tickets };
  
}

export async function fetchSeats() {
  return [];
}

export async function bookTicket(flightId, passengerData) {
  const res = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      flight_id: flightId,
      first_name: passengerData.first_name,
      last_name: passengerData.last_name,
      full_name: `${passengerData.first_name} ${passengerData.last_name}`,
      email: passengerData.email,
      phone: passengerData.phone,
      passport_number: passengerData.passport_number
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.message || 'Bilet alynmady'), { status: res.status });
  }

  const json = await res.json();
  return { seats: json.seats_available ?? json.seats ?? 9 };
}