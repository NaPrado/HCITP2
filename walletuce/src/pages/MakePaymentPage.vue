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
                placeholder="Codigo de pago"
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

            <!-- Selector de tarjeta usando el componente CardSelector -->
            <CardSelector
              v-if="origen === 'card'"
              v-model="selectedCard"
              label="Seleccione una tarjeta"
              class="mt-2"
            />
          </v-card>

          <!-- Alerta de error general -->
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
import { ref, computed, watch } from "vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import CardSelector from "../components/CardSelector.vue";
import { useSnackbarStore } from "../stores/snackbar";
import { PaymentsService } from "../api/payments.js";
import { decodePaymentJSON } from "../utils/jsonEncoder";

const router = useRouter();
const snackbarStore = useSnackbarStore();

const identificador = ref("");
const origen = ref("balance");
const selectedCard = ref(null);
const errorLocal = ref("");

const isValid = computed(() => {
  try {
    if (!identificador.value.trim()) return false;
    // Intentar decodificar el código para validar que es correcto
    const decodedPayment = decodePaymentJSON(identificador.value);
    if (origen.value === "card" && !selectedCard.value) return false;
    return true;
  } catch (error) {
    return false;
  }
});

watch(origen, (newValue) => {
  if (newValue === "card") {
    // No es necesario llamar a loadCards aquí, CardSelector se carga solo.
    // Si se quiere resetear la tarjeta seleccionada al cambiar a 'card' si antes era otra cosa
    // y luego se vuelve a 'card', se podría considerar, pero usualmente v-if lo desmonta/remonta.
  } else {
    selectedCard.value = null; // Limpiar la tarjeta seleccionada si el origen no es 'card'
  }
});

function irAConfirmacion() {
  if (!isValid.value) {
    if (!identificador.value.trim()) {
      snackbarStore.showError("Por favor, ingrese un código de pago válido.");
    } else if (origen.value === "card" && !selectedCard.value) {
      snackbarStore.showError("Por favor, seleccione una tarjeta.");
    }
    return;
  }
  errorLocal.value = "";

  router.push({
    path: "/ConfirmPayment",
    query: {
      code: identificador.value,
      method: origen.value,
      cardId: selectedCard.value || undefined,
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

@media (max-width: 600px) {
  .container-card {
    padding: 16px;
  }
}
</style>
