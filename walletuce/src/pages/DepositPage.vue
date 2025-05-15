<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <v-snackbar
        v-model="snackbar"
        timeout="3000"
        location="top center"
        class="snackbar-custom"
      >
        {{ mensajeError }}
      </v-snackbar>

      <!-- Barra superior -->
      <AppHeader titulo="Ingresar Dinero" />
      <!-- Contenido principal -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content pt-10"
      >
        <v-btn
          variant="text"
          color="black"
          @click="onVolverClick"
          class="back-button pl-1"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          Atrás
        </v-btn>
        <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
          <!-- Monto -->
          <v-card
            class="pa-4 mb-4 card-with-shadow"
            color="green-lighten-1"
            rounded="lg"
          >
            <v-card-title class="text-white font-weight-bold"
              ><h2>Monto</h2></v-card-title
            >
            <v-text-field
              v-model="monto"
              type="number"
              hide-details
              class="ml-2 mr-2 bg-grey-lighten-4"
              placeholder="Ingrese un monto"
            />
          </v-card>

          <!-- Selección de origen -->
          <v-card
            class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow"
            rounded="lg"
          >
            <v-card-title
              class="text-grey-darken-3 font-weight-bold text-subtitle-1"
            >
              Seleccione de donde realiza el ingreso.
            </v-card-title>
            <v-radio-group v-model="origen" class="ml-2">
              <v-radio
                label="Cuenta Bancaria"
                value="cuenta"
                color="green-lighten-1"
              />
              <v-radio
                label="Tarjeta"
                value="tarjeta"
                color="green-lighten-1"
              />
            </v-radio-group>
          </v-card>

          <!-- Botones -->
          <v-row class="mt-4 mb-1 mr-1" justify="space-between" align="center">
            <v-btn variant="text" color="black" @click="onVolverClick">
              <v-icon start>mdi-chevron-left</v-icon>
              Volver a Hogar
            </v-btn>
            <v-btn
              color="green-lighten-1"
              class="text-white font-weight-bold"
              rounded
              @click="onCrearClick"
            >
              Seguir
            </v-btn>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";

const router = useRouter();
const snackbar = ref(false);
const mensajeError = ref("");

const monto = ref("");
const origen = ref("tarjeta"); // valor inicial seleccionado

function onVolverClick() {
  router.push("./HomePage");
}

function onCrearClick() {
  const montoNumero = parseFloat(monto.value);
  if (!monto.value || isNaN(montoNumero) || montoNumero <= 0) {
    mensajeError.value = "Por favor, ingrese un monto válido mayor a 0";
    snackbar.value = true;
    return;
  }

  router.push({
    path: "./ConfirmDeposit",
    query: {
      monto: monto.value,
      origen: origen.value,
    },
  });
}
</script>

<style scoped>
.main-bg {
  background: #eee !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.avatar-espaciado {
  margin-left: 16px;
}
.container-card {
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
}
.card-with-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
.back-button {
  align-self: flex-start;
  margin-left: 20%;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.7) !important;
}

.snackbar-custom {
  border-radius: 10px !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
  font-weight: 500;
  font-size: 1rem;
  padding: 12px 20px;
}
</style>
