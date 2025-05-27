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
        <BackButton
          to="/HomePage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />
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
            <!-- Selector de tarjeta si se elige tarjeta como método -->
            <v-select
              v-if="origen === 'tarjeta'"
              v-model="selectedCard"
              :items="cards"
              item-title="displayName"
              item-value="id"
              label="Seleccione una tarjeta"
              class="mt-2 compact-select"
              :loading="loadingCards"
              :disabled="loadingCards"
              :error-messages="errorTarjeta"
              density="compact"
              variant="outlined"
              hide-details
            ></v-select>
          </v-card>

          <!-- Botones -->
          <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
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
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { CardApi } from "../api/card.js";
import { Api } from "../api/api.js";
import { onMounted } from "vue";

const router = useRouter();
const snackbar = ref(false);
const mensajeError = ref("");

const monto = ref("");

const origen = ref("tarjeta"); // o el valor que prefieras por defecto
const selectedCard = ref(null);
const cards = ref([]);
const loadingCards = ref(false);
const errorTarjeta = ref("");

// Cargar tarjetas cuando se selecciona "tarjeta" como origen
watch(origen, async (newValue) => {
  if (newValue === "tarjeta") {
    await loadCards();
  }
});

onMounted(() => {
  loadCards();
});

async function loadCards() {
  loadingCards.value = true;
  try {
    const response = await CardApi.getAll();
    console.log(response);
    if (Array.isArray(response)) {
      cards.value = response.map((card) => ({
        displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
        id: card.id,
      }));
    } else if (response && Array.isArray(response.cards)) {
      cards.value = response.cards.map((card) => ({
        displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
        id: card.id,
      }));
    }
  } catch (e) {
    errorTarjeta.value = "Error al cargar las tarjetas";
  } finally {
    loadingCards.value = false;
  }
}

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
  if (origen.value === "tarjeta" && !selectedCard.value) {
    mensajeError.value = "Seleccioná una tarjeta";
    snackbar.value = true;
    return;
  }
  router.push({
    path: "./ConfirmDeposit",
    query: {
      monto: monto.value,
      origen: origen.value,
      cardId: selectedCard.value,
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
