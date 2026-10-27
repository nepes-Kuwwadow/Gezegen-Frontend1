<script setup>
// Блок рейсов одной даты: заголовок + список карточек (<FlightCard> передаются в слот)
defineProps({
  label: { type: String, required: true },
})
</script>

<template>
  <section class="mt-6">
    <h3 class="mb-3 px-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{{ label }}</h3>
    <ul class="space-y-3">
      <slot />
    </ul>
  </section>
</template>