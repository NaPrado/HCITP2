<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <v-app-bar color="deep-purple accent-4" dark flat>
        <v-avatar class="avatar-espaciado mr-3" color="white">
          <v-icon color="deep-purple accent-4">mdi-account</v-icon>
        </v-avatar>
        <v-toolbar-title><span class="font-weight-bold"><h2>Bienvenido, Matias</h2></span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-btn class="ayuda-btn ml-2" elevation="0" @click="onAyudaClick">
          <v-icon left size="20" color="#673AB7">mdi-help-circle</v-icon>
          <span class="ayuda-text">Ayuda</span>
        </v-btn>
      </v-app-bar>

      <!-- Contenido principal -->
      <v-container class="d-flex flex-column align-center justify-center main-content">
          <div class="dashboard-card">
            <!-- Tarjeta de monto -->
            <div class="monto-card dashboard-balance mb-6">
                <div class="text-h6 font-weight-bold ">Monto</div>
                <div class="text-h6 font-weight-bold">$205.376,82</div>
            </div>
            <!-- Tarjeta de movimientos -->
            <div
              class="movimientos-link d-flex align-center"
              @click="onMovimientosClick"
              style="cursor:pointer;"
            >
              <span class="movimientos-text">Ver Movimientos</span>
              <v-icon size="20" color="#484554">mdi-chevron-right</v-icon>
            </div>
        </div>
        <!-- Acciones -->
        <v-row class="justify-center mt-2" style="width:100%;">
          <v-col cols="auto" class="text-center" v-for="(action, i) in actions" :key="i">
            <div class="action-btn mb-2 d-flex align-center justify-center mx-auto">
              <v-icon :color="action.color" size="32">{{ action.icon }}</v-icon>
            </div>
            <div>{{ action.label1 }}<br>{{ action.label2 }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
const actions = [
  { icon: 'mdi-arrow-right-bold', color: 'deep-purple accent-4', label1: 'Ingresar', label2: 'Dinero' },
  { icon: 'mdi-swap-horizontal', color: 'deep-purple accent-4', label1: 'Transferir', label2: 'Dinero' },
  { icon: 'mdi-arrow-down-bold', color: 'deep-purple accent-4', label1: 'Generar', label2: 'Cobro' },
  { icon: 'mdi-arrow-up-bold', color: 'deep-purple accent-4', label1: 'Realizar', label2: 'Pago' },
  { icon: 'mdi-wallet', color: 'deep-purple accent-4', label1: 'Administrar', label2: 'tarjetas' },
]

function onMovimientosClick() {
  // Aquí puedes poner la navegación o acción deseada
  // Por ejemplo: router.push('/movimientos')
}

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
.dashboard-card {
  background: #ddd;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.monto-card {
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  background: #673AB7;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  width: 90%;
  max-width: 700px;
}
.dashboard-balance {
  padding: 10px 10px 10px 10px;
  margin-bottom: 32px;
  color: #fff;
  text-align: left;
}
.dashboard-movements {
  padding: 0 24px;
  margin-bottom: 48px;
  color: #222;
  text-align: left;
}
.action-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.v-btn.w-100 {
  width: 100%;
}
.movimientos-link {
  background: transparent !important;
  color: #484554 !important;
  border-radius: 0;
  box-shadow: none;
  padding: 0 8px;
  height: auto;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
  transition: color 0.2s;
  margin-left: 24px;
  justify-content: flex-start;
}
.movimientos-link:hover {
  color: #673AB7 !important;
}
.movimientos-text {
  font-weight: bold;
  margin-right: 4px;
}
.ayuda-btn {
  background: #f3eafe !important;
  color: #673AB7 !important;
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
  color: #673AB7 !important;
  font-size: 1.1rem;
}
.ayuda-btn .v-icon {
  font-size: 18px !important;
  margin-right: 2px;
  margin-left: 0;
  margin-top: 12px;
  margin-bottom: 12px;
  color: #673AB7 !important;
  vertical-align: middle;
}
.avatar-espaciado {
  margin-left: 16px;
}
</style>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style> 