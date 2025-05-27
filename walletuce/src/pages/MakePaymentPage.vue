<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Realizar Pago" />

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
          <!-- Código de pago -->
          <v-card
            class="pa-4 mb-4 card-with-shadow"
            color="green-lighten-1"
            rounded="lg"
          >
            <v-card-title class="text-white font-weight-bold"
              ><h2>Introducir identificador de pago</h2></v-card-title
            >
            <div class="d-flex align-center">
              <v-text-field
                v-model="identificador"
                placeholder="ID de pago"
                hide-details
                class="ml-2 mr-2 bg-grey-lighten-4"
              ></v-text-field>
            </div>
          </v-card>

          <!-- Selección de origen -->
          <v-card
            class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow"
            rounded="lg"
          >
            <v-card-title
              class="text-grey-darken-3 font-weight-bold text-subtitle-1 mb-1"
            >
              Seleccione el método de pago
            </v-card-title>
            <v-radio-group v-model="origen" class="ml-2 mb-n2">
              <v-radio label="Saldo" value="balance" color="green-lighten-1" />
              <v-radio
                label="Tarjeta"
                value="card"
                color="green-lighten-1"
                class="mb-n2"
              />
            </v-radio-group>

            <!-- Selector de tarjeta si se elige tarjeta como método -->
            <v-select
              v-if="origen === 'card'"
              v-model="selectedCard"
              :items="cards"
              item-title="displayName"
              item-value="id"
              label="Seleccione una tarjeta"
              class="mt-n2 compact-select"
              :loading="loadingCards"
              :disabled="loadingCards"
              :error-messages="errorTarjeta"
              density="compact"
              variant="outlined"
              hide-details
            ></v-select>
          </v-card>

          <!-- Alerta de error -->
          <v-alert
            v-if="errorLocal"
            type="error"
            class="mb-4"
            closable
            @click="errorLocal = ''"
          >
            {{ errorLocal }}
          </v-alert>

          <!-- Botones -->
          <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
            <v-btn
              color="green-lighten-1"
              class="text-white font-weight-bold"
              rounded
              @click="irAConfirmacion"
              :disabled="!isValid"
            >
              Continuar
            </v-btn>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, computed, watch, onMounted } from "vue";
// Use the Card type from card.js as the single source of truth.
// Ensure its definition (especially cvv) is consistent with the API response.
import { CardApi, type Card as ApiCardType } from "../api/card.js";
import { Api } from "../api/api.js";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { useSnackbarStore } from "../stores/snackbar";

// This interface is for the cards once they are processed for display
interface DisplayCard {
  displayName: string;
  id: string;
}

// Define a type for the raw card object returned by the API
// This should match the structure of objects in the array returned by CardApi.getAll()
// and be consistent with ApiCardType from ../api/card.js
interface RawCard {
  id: string | number;
  fullName: string;
  number: string;
  cvv?: string;
  // Include other properties from ApiCardType, making them optional if they can be missing
  // For example, if ApiCardType has expiryDate, it would be: expiryDate?: string;
  // This is a pragmatic approach if ApiCardType is stricter than the actual API data.
  // Ideally, ApiCardType itself should accurately reflect the API contract.
}

// Type for the overall API response structure, if it's an object wrapping the array
interface GetAllCardsApiResponse {
  cards?: RawCard[];
  data?: RawCard[];
  result?: RawCard[];
  // Add other potential top-level keys if your API nests the array
}

const router = useRouter();
const snackbarStore = useSnackbarStore();

const identificador = ref("");
const origen = ref<"balance" | "card">("balance");
const selectedCard = ref<string | null>(null);
const cards = ref<DisplayCard[]>([]); // Holds cards formatted for display
const loadingCards = ref(false);
const errorLocal = ref(""); // For general errors on the page
const errorTarjeta = ref(""); // Specific for the card selection field

const isValid = computed(() => {
  if (!identificador.value.trim()) return false;
  if (origen.value === "card" && !selectedCard.value) return false;
  return true;
});

function getSelectedCardDisplay(): string {
  if (!selectedCard.value) return "";
  const card = cards.value.find((c) => c.id === selectedCard.value);
  return card ? card.displayName : "";
}

onMounted(() => {
  if (origen.value === "card") {
    loadCards();
  }
});

watch(origen, (newValue) => {
  errorTarjeta.value = "";
  if (newValue === "card") {
    if (cards.value.length === 0 && !loadingCards.value) {
      loadCards();
    }
  } else {
    selectedCard.value = null;
  }
});

async function loadCards() {
  if (!Api.token) {
    snackbarStore.showError(
      "Sesión no iniciada. Por favor, ingrese nuevamente."
    );
    router.push("/login");
    return;
  }

  loadingCards.value = true;
  errorTarjeta.value = "";
  cards.value = []; // Clear previous cards

  try {
    // Expect CardApi.getAll() to return Promise<RawCard[] | GetAllCardsApiResponse>
    const response: RawCard[] | GetAllCardsApiResponse = await CardApi.getAll();

    let fetchedRawCards: RawCard[] = [];

    if (Array.isArray(response)) {
      fetchedRawCards = response;
    } else if (response && typeof response === "object") {
      const responseObject = response as GetAllCardsApiResponse;
      if (Array.isArray(responseObject.cards)) {
        fetchedRawCards = responseObject.cards;
      } else if (Array.isArray(responseObject.data)) {
        fetchedRawCards = responseObject.data;
      } else if (Array.isArray(responseObject.result)) {
        fetchedRawCards = responseObject.result;
      } else {
        // If the object doesn't match known structures, but might be a single card object (edge case?)
        // Or it's an unexpected structure
        console.warn(
          "Unexpected response structure from CardApi.getAll:",
          response
        );
      }
    }

    if (fetchedRawCards.length > 0) {
      // Filter out any cards that might be missing essential data for display
      cards.value = fetchedRawCards
        .filter(
          (card) => card && card.id != null && card.fullName && card.number
        )
        .map((card: RawCard) => ({
          displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
          id: card.id.toString(), // Ensure ID is a string for v-select model
        }));
      if (cards.value.length === 0 && fetchedRawCards.length > 0) {
        errorTarjeta.value =
          "Algunas tarjetas no pudieron ser mostradas (datos incompletos).";
      } else if (fetchedRawCards.length === 0) {
        errorTarjeta.value =
          "No tiene tarjetas cargadas o no se pudieron obtener.";
      }
    } else {
      errorTarjeta.value =
        "No tiene tarjetas cargadas o no se pudieron obtener.";
    }
  } catch (e: any) {
    console.error("Error al cargar tarjetas:", e);
    const message =
      e.description || e.message || "Error crítico al cargar las tarjetas.";
    errorTarjeta.value = message;
    snackbarStore.showError(message);
    if (e.code === 97) {
      // Unauthorized or similar
      snackbarStore.showError("Sesión expirada. Redirigiendo al login.");
      router.push("/login");
    }
  } finally {
    loadingCards.value = false;
  }
}

function irAConfirmacion() {
  if (!isValid.value) {
    if (!identificador.value.trim()) {
      snackbarStore.showError("Por favor, ingrese un identificador de pago.");
    } else if (origen.value === "card" && !selectedCard.value) {
      snackbarStore.showError("Por favor, seleccione una tarjeta.");
      errorTarjeta.value = "Debe seleccionar una tarjeta";
    }
    return;
  }
  errorLocal.value = "";

  const selectedCardInfo =
    origen.value === "card" ? getSelectedCardDisplay() : null;

  router.push({
    path: "/ConfirmPayment", // Using path as a fallback
    query: {
      paymentId: identificador.value,
      method: origen.value,
      cardId: selectedCard.value || undefined,
      cardInfo: selectedCardInfo || undefined,
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

.compact-select :deep(.v-input__control .v-field__input) {
  min-height: 40px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  font-size: 0.9rem;
}
.compact-select :deep(.v-label.v-field-label) {
  font-size: 0.9rem;
  margin-top: -2px;
}
.compact-select :deep(.v-field__append-inner .v-icon) {
  font-size: 1.2rem;
}

@media (max-width: 600px) {
  .container-card {
    padding: 16px;
  }
}
</style>
