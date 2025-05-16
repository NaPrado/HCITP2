<!-- src/pages/[...notFound].vue -->
<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Página no encontrada" />

      <!-- Contenido principal -->
      <v-container class="d-flex flex-column align-center justify-center main-content">
        <div class="error-card text-center bg-grey-lighten-2">
          <v-icon size="64" color="grey-darken-3" class="mb-4">mdi-alert-circle</v-icon>
          <h1 class="text-h4 font-weight-bold mb-4 text-grey-darken-3">Página no encontrada</h1>
          <p class="text-body-1 mb-6 text-grey-darken-3">Lo sentimos, la página que buscas no existe.</p>
          <v-btn
            color="green-lighten-1"
            variant="elevated"
            class="px-6"
            to="/"
          >
            Volver al inicio
          </v-btn>
        </div>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
function onAyudaClick() {
  // Acción de ayuda
}
</script>

<style scoped>
.main-bg {
  background: #eee !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.error-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  padding: 48px;
}

.ayuda-btn {
  background: #f3eafe !important;
  border-radius: 10px !important;
  font-weight: bold;
  font-size: 1.15rem;
  padding: 4px 18px 4px 10px;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  min-height: 40px;
  height: 40px;
  transition: background 0.2s;
  gap: 4px;
}

.ayuda-btn:hover {
  background: #e1d5f6 !important;
}

.ayuda-text {
  font-weight: bold;
  margin-left: 2px;
  color: rgb(129, 199, 132) !important;
  font-size: 1.1rem;
}

.avatar-espaciado {
  margin-left: 16px;
}
</style>
