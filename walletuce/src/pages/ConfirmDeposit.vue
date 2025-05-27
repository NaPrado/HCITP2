<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Ingresar Dinero" />

      <!-- Contenido principal -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content pt-4"
      >
        <BackButton
          to="/DepositPage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />
        <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
          <!-- Monto ingresado -->
          <v-card
            class="pa-4 mb-4 card-with-shadow-medium"
            color="green-lighten-1"
            rounded="lg"
          >
            <v-card-title class="text-white font-weight-bold pb-0 pt-0">
              <h2>Monto ingresado</h2>
            </v-card-title>
            <v-card-title class="text-white font-weight-bold pb-0 pt-0">
              <h3>{{ monto_formateado }}</h3>
            </v-card-title>
          </v-card>

          <!-- Origen -->
          <v-card
            class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow-light"
            rounded="lg"
          >
            <v-card-title class="text-black font-weight-bold pb-0 pt-0">
              <h4>Desde: {{ fuente }}</h4>
            </v-card-title>
            <v-card-title class="text-black font-weight-bold pb-0 pt-0">
              <h6>{{ detalle_fuente }}</h6>
            </v-card-title>
          </v-card>

          <!-- Botones -->
          <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
            <v-btn
              color="green-lighten-1"
              class="text-white font-weight-bold"
              rounded
              @click="onCrearClick"
            >
              Crear Importe
            </v-btn>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { AccountApi } from "../api/account";
import { useSnackbarStore } from "../stores/snackbar";

const snackbar = ref(false);
const mensajeError = ref("");
const router = useRouter();
const route = useRoute();
const snackbarStore = useSnackbarStore();

// Recibir los datos desde la ruta
function formatearDinero(valor: number): string {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
}

const monto_ingresado = ref(Number(route.query.monto || 0)); // valor inicial recibido;
const monto_formateado = computed(() => formatearDinero(monto_ingresado.value));

const origen = route.query.origen || "tarjeta";
const cardId = route.query.cardId || "";
const cvu = route.query.cvu || "";
const cardDisplay = route.query.cardDisplay || "";

const detalle_fuente = computed(() => {
  if (origen === "cuenta" && cvu) {
    return `CBU •••• ${String(cvu).slice(-4)}`;
  }
  if (origen === "tarjeta" && cardDisplay) {
    return cardDisplay;
  }
  return "";
});


// Acciones
function onVolverHomeClick() {
  router.push("./HomePage");
}

function onVolverClick() {
  router.push("./DepositPage");
}

async function onCrearClick() {
  try {
    // Llama a la API para recargar saldo
    const response = await AccountApi.recharge({
      amount: monto_ingresado.value,
    });
    // Opcional: podés mostrar el nuevo saldo o actualizarlo en un store/reactivo
    // balance.value = response.balance; // si usás balance en este componente
    // Redirige al HomePage o muestra mensaje de éxito
    snackbarStore.showSuccess(
      `Depósito de $${monto_ingresado.value} realizado con éxito`
    );
    router.push("./HomePage");
  } catch (e) {
    const err = e as any;
    mensajeError.value =
      err.description || err.message || "Error al recargar saldo";
    snackbar.value = true;
  }
}
</script>

<style scoped>
.main-bg {
  background: #eee !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.ayuda-btn {
  background: #f3eafe !important;
  border-radius: 10px !important;
  font-weight: bold;
  font-size: 1.15rem;
  padding: 4px 18px 4px 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
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
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
}
.custom-app-bar {
  min-height: 72px !important;
}
.custom-app-bar .v-toolbar-title {
  line-height: 1.2;
}
.v-toolbar-title {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.container-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
}
.card-with-shadow-medium {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16) !important;
}
.card-with-shadow-light {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12) !important;
}
.confirmation-text {
  color: black;
  font-size: large;
  margin-left: 24px;
}
.back-button {
  align-self: flex-start;
  margin-left: 20%;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.7) !important;
}
</style>
