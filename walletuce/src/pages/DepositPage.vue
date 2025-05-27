<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
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
              min="0"
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
              :disabled="loadingCards || cards.length === 0"
              :error-messages="errorTarjeta"
              density="compact"
              variant="outlined"
              hide-details="auto"
            ></v-select>
            <v-text-field
              v-if="origen === 'cuenta'"
              v-model="cvuCuenta"
              label="Ingrese el CBU/CVU"
              placeholder="0000000000000000000000"
              class="mt-2 compact-select"
              variant="outlined"
              hide-details="auto"
              density="compact"
              maxlength="22"
              counter
              :rules="[
                (v) => !!v || 'El CBU/CVU es requerido',
                (v) =>
                  /^\d{22}$/.test(v) || 'Debe contener 22 dígitos numéricos',
              ]"
            />
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
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { CardApi } from "../api/card.js";
// import { Api } from "../api/api.js"; // Api no se usa directamente, CardApi la usa internamente
import { useSnackbarStore } from "../stores/snackbar";

const router = useRouter();
const snackbarStore = useSnackbarStore(); // Usar el store global de snackbar

const monto = ref("");
const origen = ref("tarjeta"); // o el valor que prefieras por defecto
const selectedCard = ref<string | null>(null); // Tipado explícito
const cards = ref<{ displayName: string; id: string }[]>([]);
const loadingCards = ref(false);
const errorTarjeta = ref("");
const cvuCuenta = ref(""); // Declarar cvuCuenta

// Cargar tarjetas cuando se selecciona "tarjeta" como origen
watch(origen, async (newValue) => {
  if (newValue === "tarjeta") {
    if (cards.value.length === 0 && !loadingCards.value) {
      // Cargar solo si no hay tarjetas y no se están cargando
      await loadCards();
    }
  } else {
    selectedCard.value = null; // Limpiar tarjeta seleccionada si se cambia de origen
    errorTarjeta.value = ""; // Limpiar error de tarjeta
  }
});

onMounted(async () => {
  if (origen.value === "tarjeta") {
    // Cargar tarjetas al montar solo si el origen inicial es tarjeta
    await loadCards();
  }
});

type CardFromApi = {
  fullName: string;
  number: string;
  id: string;
  // Añade otros campos que esperas de la API si es necesario, ej: type
};

type CardApiResponse =
  | CardFromApi[]
  | { cards: CardFromApi[] }
  | { result: CardFromApi[] }
  | undefined
  | null;

async function loadCards() {
  loadingCards.value = true;
  errorTarjeta.value = ""; // Limpiar error previo
  try {
    const response = (await CardApi.getAll()) as CardApiResponse;
    console.log("Respuesta de CardApi.getAll():", response);

    let rawCards: CardFromApi[] = [];

    if (Array.isArray(response)) {
      rawCards = response;
    } else if (
      response &&
      typeof response === "object" &&
      "cards" in response &&
      Array.isArray(response.cards)
    ) {
      rawCards = response.cards;
    } else if (
      response &&
      typeof response === "object" &&
      "result" in response &&
      Array.isArray(response.result)
    ) {
      rawCards = response.result;
    } else {
      console.warn("Formato de respuesta de tarjetas no esperado:", response);
    }

    if (rawCards.length > 0) {
      cards.value = rawCards.map((card) => ({
        displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
        id: card.id,
      }));
    } else {
      cards.value = []; // Asegurar que cards esté vacío si no se obtienen tarjetas
    }

    if (cards.value.length === 0) {
      errorTarjeta.value = "No tiene tarjetas cargadas.";
    }
  } catch (e: any) {
    console.error("Error al cargar tarjetas:", e);
    const message =
      e?.description || e?.message || "Error al cargar las tarjetas.";
    snackbarStore.showError(message);
    errorTarjeta.value = message; // Mostrar error también en el v-select
    cards.value = [];
    if (e.code === 97) router.push("/login"); // Ejemplo de manejo de no autorizado
  } finally {
    loadingCards.value = false;
  }
}

// onVolverClick ya no es necesaria, BackButton maneja la navegación

function onCrearClick() {
  const montoNumero = parseFloat(monto.value);
  if (!monto.value || isNaN(montoNumero) || montoNumero <= 0) {
    snackbarStore.showError("Por favor, ingrese un monto válido mayor a 0");
    return;
  }

  if (origen.value === "tarjeta") {
    if (!selectedCard.value) {
      snackbarStore.showError("Seleccioná una tarjeta");
      errorTarjeta.value = "Debe seleccionar una tarjeta"; // Para mostrar en el v-select
      return;
    }
    errorTarjeta.value = ""; // Limpiar error si la tarjeta está seleccionada
  }

  if (origen.value === "cuenta") {
    if (!cvuCuenta.value || !/^\d{22}$/.test(cvuCuenta.value)) {
      snackbarStore.showError(
        "Ingresá un CBU/CVU válido (debe contener 22 dígitos numéricos)"
      );
      return;
    }
  }

  router.push({
    path: "./ConfirmDeposit",
    query: {
      monto: monto.value,
      origen: origen.value,
      cardId: selectedCard.value || undefined, // Enviar undefined si es null
      cardDisplay:
        cards.value.find((c) => c.id === selectedCard.value)?.displayName ||
        undefined,
      cvu: origen.value === "cuenta" ? cvuCuenta.value : undefined, // Enviar cvu solo si el origen es cuenta
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
.compact-select .v-input__control {
  min-height: auto !important;
}
/* Para asegurar que el v-text-field de CBU/CVU muestre el contador y errores correctamente */
.v-text-field {
  margin-bottom: 4px; /* Ajusta según sea necesario para el espacio de los mensajes de error/contador */
}
</style>
