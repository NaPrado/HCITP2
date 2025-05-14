<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <v-app-bar color="green-lighten-1 accent-4" dark flat class="custom-app-bar">
        <v-avatar class="avatar-espaciado mr-3" >
          <v-img src="/src/assets/letucce.svg" alt="Logo" width="40" height="40"></v-img>
        </v-avatar>
        <v-toolbar-title class="text-h4 font-weight-bold">Bienvenido, Matias</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="onConfigurationClick">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-btn class="ayuda-btn ml-2" color="green-lighten-1" @click="onAyudaClick">
          <v-icon left size="20" color="green-lighten-1">mdi-help-circle</v-icon>
          <span class="ayuda-text" color="green-lighten-1">Ayuda</span>
        </v-btn>
      </v-app-bar>

      <!-- Contenido principal -->
      <v-container class="d-flex flex-column align-center justify-center main-content">
          <v-container class="dashboard-upper-card bg-grey-lighten-2">
            <!-- Tarjeta de monto -->
            <v-container class="monto-card dashboard-balance mb-6 bg-green-lighten-1">
              <v-container class="text-h4 font-weight-bold text-grey-lighten-4 pa-0">Monto</v-container>
              <v-container class="text-h6 font-weight-bold text-grey-lighten-4 pa-0">$205.376,82</v-container>
            </v-container>
            <!-- Tarjeta de movimientos -->
            <v-container
              class="movimientos-link d-flex align-center pa-0"
              @click="onMovimientosClick"
              style="cursor:pointer;"
            >
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <span
                    v-bind="props"
                    :class="isHovering ? 'text-green-lighten-1' : 'text-grey-darken-3'"
                    class="font-weight-bold"
                  >Ver Movimientos</span>
                  <v-icon size="20" v-bind="props" :class="isHovering ? 'text-green-lighten-1' : 'text-grey-darken-3'">mdi-chevron-right</v-icon>
                </template>
              </v-hover>
            </v-container>
        </v-container>
        <!-- Acciones -->
        <v-container class="dashboard-lower-card d-flex flex-column align-center justify-center main-content">
        <v-row class="justify-center mt-2" style="width:100%;">
          <v-col cols="auto" class="text-center" v-for="(action, i) in actions" :key="i">
            <v-btn 
              class="action-btn mb-2 d-flex align-center justify-center mx-auto bg-grey-lighten-2"
              min-width="64"
              min-height="64"
              style="border-radius: 50% !important; aspect-ratio: 1;"
              @click="handleActionClick(action.action)"
            >
              <v-icon :color="action.color" size="32">{{ action.icon }}</v-icon>
            </v-btn>
            <v-container class="text-grey-darken-3 font-weight-bold">{{ action.label1 }}<br>{{ action.label2 }}</v-container>
          </v-col>
        </v-row>
        </v-container>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const actions = [
  { icon: 'mdi-arrow-right-bold', color: 'green-lighten-1', label1: 'Ingresar', label2: 'Dinero', action: 'ingresar' },
  { icon: 'mdi-swap-horizontal', color: 'green-lighten-1', label1: 'Transferir', label2: 'Dinero', action: 'transferir' },
  { icon: 'mdi-arrow-down-bold', color: 'green-lighten-1', label1: 'Generar', label2: 'Cobro', action: 'generarCobro' },
  { icon: 'mdi-arrow-up-bold', color: 'green-lighten-1', label1: 'Realizar', label2: 'Pago', action: 'realizarPago' },
  { icon: 'mdi-wallet', color: 'green-lighten-1', label1: 'Administrar', label2: 'tarjetas', action: 'administrarTarjetas' },
]

function handleActionClick(action: string) {
  switch(action) {
    case 'ingresar':
      router.push("./DepositPage")
      break;
    case 'transferir':
      router.push("./TransferPage")
      break;
    case 'generarCobro':
      router.push("./GeneratePaymentPage")
      break;
    case 'realizarPago':
      router.push("./MakePaymentPage")
      break;
    case 'administrarTarjetas':
      router.push("./AdminCardsPage")
      break;
    default:
      console.warn("Acción no reconocida:", action);
  }
}

function onMovimientosClick() {
  router.push('/movements')
}

function onAyudaClick() {
  router.push('/help')
}
function onConfigurationClick(){
  //ver que hacemos aca
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
  padding: 24px;
}
.dashboard-upper-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dashboard-lower-card {
  background: #ddd;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: fit-content;
}
.monto-card {
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
  width: 95%;
  max-width: 700px;
}
.dashboard-balance {
  padding: 16px;
  margin-bottom: 32px;
  text-align: left;
}
.dashboard-movements {
  padding: 0 24px;
  margin-bottom: 48px;
  color: #222;
  text-align: left;
}
.action-btn {
  width: 64px !important;
  height: 64px !important;
  min-width: 64px !important;
  min-height: 64px !important;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  aspect-ratio: 1;
  box-shadow: 0 3px 8px rgba(0,0,0,0.14) !important;
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
  margin-bottom: 10px;
}
.movimientos-text {
  font-weight: bold;
  margin-right: 4px;
}
.ayuda-btn {
  background: #f3eafe !important;
  border-radius: 10px !important;
  font-weight: bold;
  font-size: 1.15rem;
  padding: 4px 18px 4px 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
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
  font-size: 1.1rem;
}
.ayuda-btn .v-icon {
  font-size: 18px !important;
  margin-right: 2px;
  margin-left: 0;
  margin-top: 12px;
  margin-bottom: 12px;
  vertical-align: middle;
}
.avatar-espaciado {
  margin-left: 16px;
}
.custom-app-bar {
  min-height: 72px !important; /* ajusta según necesidad */
}
.custom-app-bar .v-toolbar-title {
  line-height: 1.2;
}
.v-toolbar-title {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
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