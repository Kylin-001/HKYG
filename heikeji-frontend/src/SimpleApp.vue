<template>
  <div class="simple-app">
    <h1>Simple App Component</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello from Simple App')
</script>

<style scoped>
.simple-app {
  text-align: center;
  padding: 20px;
}
</style>
