<script setup>
import Navbar from './components/layouts/Navbar.vue';
import FlightsPage from './views/FlightsPage.vue';
import HomePage from './views/HomePage.vue';
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <RouterView/>
      <!-- <HomePage /> -->
      <!-- <FlightsPage/> -->
  </div>
</template>

<style scoped></style>
