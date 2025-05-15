<template>
  <v-app-bar
    :elevation="0"
    flat
    color="green-lighten-1"
    dark
    class="custom-app-bar"
  >
    <v-container
      class="d-flex align-center justify-space-between fill-height pa-0"
    >
      <!-- Logo + Título -->
      <div class="d-flex align-center">
        <RouterLink to="/" class="d-flex align-center text-decoration-none">
          <v-avatar class="mr-3" size="40">
            <v-img
              src="/src/assets/letucce.svg"
              alt="Logo"
              width="40"
              height="40"
              cover
            />
          </v-avatar>
        </RouterLink>
        <v-toolbar-title class="text-white font-weight-bold text-h5">
          {{ titulo }}
        </v-toolbar-title>
      </div>

      <!-- Acciones -->
      <div class="d-flex align-center">
        <v-btn icon @click="onConfigurationClick" class="mr-1">
          <v-icon color="white">mdi-cog</v-icon>
        </v-btn>
        <v-btn class="ayuda-btn ml-2" @click="onAyudaClick">
          <v-icon left size="20">mdi-help-circle</v-icon>
          <span class="ayuda-text">Ayuda</span>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
defineProps<{ titulo: string }>();

function onConfigurationClick() {
  // lógica de configuración general
}

function onAyudaClick() {
  // lógica de ayuda general
}
</script>

<style scoped>
.custom-app-bar {
  min-height: 72px;
}

.ayuda-btn {
  background-color: #ffffff !important;
  color: #2e7d32 !important; /* Verde accesible y elegante */
  border-radius: 9999px; /* Totalmente redondo */
  font-weight: 600;
  font-size: 0.95rem;
  padding: 6px 20px 6px 12px;
  display: flex;
  align-items: center;
  height: 42px;
  transition: all 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  text-transform: none;
  letter-spacing: 0.25px;
}

.ayuda-btn:hover {
  background-color: #e8f5e9 !important; /* Verde muy claro */
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.ayuda-text {
  margin-left: 6px;
  font-weight: 600;
  font-size: 1rem;
}
.text-decoration-none {
  text-decoration: none;
}
</style>
