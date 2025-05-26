<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  if (isAuthenticated) {
    router.replace("/HomePage");
  } else {
    router.replace("/LandingPage");
  }
});
</script>

<template>
  <p>Redirigiendo...</p>
</template>
