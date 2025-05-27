<template>
  <div id="app">
    <router-view />
    <AppSnackbar />
  </div>
</template>

<script setup lang="ts">
import AppSnackbar from "./components/AppSnackbar.vue";
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
