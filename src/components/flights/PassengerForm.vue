<script setup>
import { reactive, ref } from 'vue'

// Форма пассажира. Хранит свои поля и проверяет их сама,
// наружу отдаёт событие submit с готовыми данными.
// Компонент создаётся только когда карточка выбрана, поэтому поля
// очищаются сами при закрытии/повторном открытии.
const props = defineProps({
  flight: { type: Object, required: true },
  submitting: { type: Boolean, default: false },
  serverError: { type: String, default: '' },
})
const emit = defineEmits(['submit'])

const fields = [
  { key: 'first_name', label: 'First name', type: 'text', autocomplete: 'given-name' },
  { key: 'last_name', label: 'Last name', type: 'text', autocomplete: 'family-name' },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel' },
  { key: 'passport_number', label: 'Passport number', type: 'text', autocomplete: 'off', maxlength: 12 },
]

const passenger = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  passport_number: '',
})
const localError = ref('')

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const passportOk = (v) => /^[A-Z0-9]{6,12}$/i.test(v.trim())

function validate() {
  if (passenger.first_name.trim().length < 2) return 'Enter the first name'
  if (passenger.last_name.trim().length < 2) return 'Enter the last name'
  if (!emailOk(passenger.email)) return 'Enter a valid email'
  if (passenger.phone.replace(/\D/g, '').length < 7) return 'Enter a valid phone number'
  if (!passportOk(passenger.passport_number)) return 'Enter a valid passport number (6–12 letters or digits)'
  if (props.flight.seats < 1) return 'No empty seats left on this flight'
  return ''
}

function onSubmit() {
  localError.value = validate()
  if (localError.value) return
  emit('submit', { ...passenger })
}
</script>

<template>
  <form
    class="rounded-b-2xl border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50"
    novalidate
    @submit.prevent="onSubmit"
  >
    <p class="mb-3 text-sm font-semibold">Passenger</p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label v-for="f in fields" :key="f.key" class="block">
        <span class="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{{ f.label }}</span>
        <input
          v-model="passenger[f.key]"
          :type="f.type"
          :autocomplete="f.autocomplete"
          :maxlength="f.maxlength"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Total ${{ flight.price }}. Buying drops the empty seats from {{ flight.seats }} to {{ Math.max(flight.seats - 1, 0) }}.
      </p>
      <button
        type="submit"
        :disabled="submitting"
        class="rounded-lg bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
      >
        Buy
      </button>
    </div>

    <p
      v-if="localError || serverError"
      class="mt-3 text-sm font-medium text-red-600 dark:text-red-400"
      role="alert"
    >
      {{ localError || serverError }}
    </p>
  </form>
</template>