<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <AppHeader titulo="Transferir Dinero" />

      <v-container
        class="d-flex flex-column align-center justify-center main-content"
      >
        <BackButton
          to="/HomePage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />
        <v-container class="dashboard-upper-card bg-grey-lighten-2">
          <v-form @submit.prevent="onSubmit" class="w-100 px-4 py-6">
            <!-- Paso 1: Elegir destinatario -->
            <template v-if="!destinatarioSeleccionado">
              <v-text-field
                v-model="form.to"
                label="Destinatario"
                placeholder="Alias, CVU o Email"
                prepend-inner-icon="mdi-account-search-outline"
                required
                variant="outlined"
                density="compact"
                class="mb-2"
                :error-messages="errorVerifyingRecipient"
                @input="errorVerifyingRecipient = ''"
              ></v-text-field>

              <div class="mt-4">
                <h3 class="text-subtitle-1 mb-2">Recientes</h3>
                <div class="recentes-list">
                  <template v-if="destinatariosFiltrados.length > 0">
                    <div
                      v-for="(dest, index) in destinatariosFiltrados"
                      :key="index"
                    >
                      <v-card
                        class="pa-3 mb-2 cursor-pointer"
                        variant="outlined"
                        @click="seleccionarDestinatario(dest.alias)"
                      >
                        <div class="font-weight-medium">{{ dest.nombre }}</div>
                        <div class="text-caption text-grey">
                          alias: {{ dest.alias }}
                        </div>
                      </v-card>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-grey text-caption text-center py-4">
                      No se encontraron destinatarios recientes o que coincidan
                      con tu búsqueda.
                    </div>
                  </template>
                </div>
              </div>

              <v-btn
                color="green-lighten-1"
                class="mt-6 text-white"
                block
                size="large"
                @click="confirmarDestinatario"
                :disabled="!form.to.trim() || verifyingRecipient"
                :loading="verifyingRecipient"
              >
                <v-icon left>mdi-arrow-right-thick</v-icon>
                Siguiente
              </v-btn>
            </template>

            <!-- Paso 2: Ingresar monto, origen y mensaje -->
            <template v-else>
              <div class="form-step-two">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <div class="text-subtitle-1">Enviando a:</div>
                    <div class="font-weight-bold text-h6 text-green-darken-2">
                      {{ form.to }}
                    </div>
                  </div>
                  <v-btn
                    icon
                    variant="tonal"
                    class="edit-btn"
                    @click="
                      () => {
                        destinatarioSeleccionado = false;
                        errorVerifyingRecipient = '';
                      }
                    "
                    size="small"
                  >
                    <v-icon color="green-darken-2">mdi-pencil</v-icon>
                  </v-btn>
                </div>

                <v-radio-group
                  v-model="origenFondo"
                  inline
                  label="Origen de los fondos"
                  class="mb-3"
                  density="compact"
                >
                  <v-radio
                    label="Saldo de la cuenta"
                    value="balance"
                    color="green-darken-1"
                  ></v-radio>
                  <v-radio
                    label="Tarjeta"
                    value="card"
                    color="green-darken-1"
                  ></v-radio>
                </v-radio-group>

                <v-select
                  v-if="origenFondo === 'card'"
                  v-model="selectedCardId"
                  :items="cards"
                  item-title="displayName"
                  item-value="id"
                  label="Seleccione una tarjeta"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                  :loading="loadingCards"
                  :disabled="loadingCards || cards.length === 0"
                  :error-messages="errorLoadingCards"
                  :rules="
                    origenFondo === 'card'
                      ? [(v) => !!v || 'Debe seleccionar una tarjeta']
                      : []
                  "
                  required
                >
                  <template
                    v-if="
                      cards.length === 0 && !loadingCards && !errorLoadingCards
                    "
                    v-slot:no-data
                  >
                    <v-list-item>
                      <v-list-item-title>
                        No tiene tarjetas cargadas.
                        <router-link
                          to="/AdminCardsPage"
                          class="text-green-darken-1"
                          >Administrar tarjetas</router-link
                        >
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:prepend-item>
                    <v-list-item v-if="loadingCards">
                      <v-list-item-title class="text-center">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                          size="24"
                        ></v-progress-circular>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>

                <v-text-field
                  v-model="form.amount"
                  label="Monto a transferir"
                  placeholder="0.00"
                  prepend-inner-icon="mdi-currency-usd"
                  required
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="mb-2"
                  :error-messages="montoErrorMessage"
                  :rules="[
                    (v) => !!v || 'El monto es requerido',
                    (v) =>
                      parseFloat(v) > 0 || 'El monto debe ser mayor a cero',
                    (v) => validateAmount(v) || 'Saldo insuficiente',
                  ]"
                ></v-text-field>

                <div v-if="origenFondo === 'balance'" class="balance-info mb-4">
                  <v-icon
                    icon="mdi-wallet-outline"
                    class="mr-1"
                    color="grey-darken-1"
                    size="small"
                  ></v-icon>
                  <span class="balance-label">Saldo disponible:</span>
                  <span class="balance-amount"
                    >${{ currentUserBalance?.toFixed(2) || "0.00" }}</span
                  >
                </div>

                <v-text-field
                  v-model="form.message"
                  label="Mensaje (opcional)"
                  placeholder="Ej: Regalo de cumpleaños"
                  prepend-inner-icon="mdi-message-text-outline"
                  variant="outlined"
                  density="compact"
                  class="mb-4"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="green-darken-1"
                  class="text-white"
                  block
                  size="large"
                  elevation="1"
                  :loading="loading"
                  :disabled="
                    loading ||
                    !form.amount ||
                    (origenFondo === 'card' && !selectedCardId) ||
                    (origenFondo === 'balance' &&
                      parseFloat(form.amount) > (currentUserBalance || 0)) ||
                    !!montoErrorMessage
                  "
                >
                  <v-icon left>mdi-swap-horizontal</v-icon>
                  Enviar Transferencia
                </v-btn>
              </div>
            </template>
          </v-form>
        </v-container>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // Importa useRoute
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { useSnackbarStore } from "../stores/snackbar";
import { PaymentsService } from "../api/payments.js";
import { CardApi } from "../api/card.js";
import { Api } from "../api/api.js";
import { AccountApi } from "../api/account.js";
import { useUserStore } from "../stores/user";

const router = useRouter();
const route = useRoute(); // Añade esta línea para acceder a los parámetros de la ruta
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const balanceFromQuery = ref<number | null>(null); // Para almacenar el saldo pasado por query

// Usar el getter del store si lo tienes, o acceder directamente al estado
const currentUserBalance = computed(() => {
  return balanceFromQuery.value ?? userStore.balance ?? 0;
});

const form = ref({
  to: "",
  amount: "",
  message: "",
});

const destinatarioSeleccionado = ref(false);
const loading = ref(false);
const verifyingRecipient = ref(false);
const errorVerifyingRecipient = ref("");

const origenFondo = ref<"balance" | "card">("balance");
const selectedCardId = ref<string | null>(null);
const cards = ref<Array<{ displayName: string; id: string }>>([]);
const loadingCards = ref(false);
const errorLoadingCards = ref("");

const destinatariosRecientes = ref([
  { nombre: "Juan Perez (Alias)", alias: "jp4321" },
  { nombre: "Roman Palermo (CVU)", alias: "0000000000000000000022" },
  { nombre: "Ivonne Kim (Email)", alias: "ivonne@example.com" },
]);

const destinatariosFiltrados = computed(() => {
  const query = form.value.to.toLowerCase().trim();
  if (!query && !destinatarioSeleccionado.value)
    return destinatariosRecientes.value;
  if (!query && destinatarioSeleccionado.value) return [];

  return destinatariosRecientes.value.filter(
    (d) =>
      d.nombre.toLowerCase().includes(query) ||
      d.alias.toLowerCase().includes(query)
  );
});

const montoErrorMessage = computed(() => {
  if (!form.value.amount) return "";
  const amount = parseFloat(form.value.amount);
  if (isNaN(amount)) return "Ingrese un monto válido";
  if (amount <= 0) return "El monto debe ser mayor a cero";
  if (
    origenFondo.value === "balance" &&
    amount > (currentUserBalance.value || 0)
  ) {
    return `Saldo insuficiente. Tu saldo actual es $${
      currentUserBalance.value?.toFixed(2) || "0.00"
    }`;
  }
  return "";
});

function validateAmount(value: string): boolean {
  if (!value || origenFondo.value !== "balance") return true;
  const amount = parseFloat(value);
  return !isNaN(amount) && amount <= (currentUserBalance.value || 0);
}

async function loadCards() {
  if (!Api.token) {
    // Asumiendo que Api.token existe y es reactivo o se setea al inicio
    // router.push("/login");
    // return;
  }
  loadingCards.value = true;
  errorLoadingCards.value = "";
  try {
    const response = await CardApi.getAll();
    if (Array.isArray(response)) {
      cards.value = response.map((card) => ({
        displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
        id: card.id,
      }));
    } else if (response && Array.isArray(response.cards)) {
      // Adaptado a posible estructura de respuesta
      cards.value = response.cards.map((card) => ({
        displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
        id: card.id,
      }));
    } else if (response && Array.isArray(response.result)) {
      // Otra posible estructura
      cards.value = response.result.map((card) => ({
        displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
        id: card.id,
      }));
    } else {
      cards.value = []; // Si la respuesta no es un array o no tiene la estructura esperada
    }
    if (cards.value.length === 0 && !errorLoadingCards.value) {
      // Solo mostrar si no hay otro error
      errorLoadingCards.value = "No tiene tarjetas cargadas.";
    }
  } catch (e: any) {
    console.error("Error al cargar tarjetas:", e);
    errorLoadingCards.value = e?.description || "Error al cargar tarjetas.";
    cards.value = []; // Asegurar que cards esté vacío en caso de error
    if (e.code === 97) router.push("/login"); // Código de no autorizado
  } finally {
    loadingCards.value = false;
  }
}

onMounted(async () => {
  // Leer el saldo del query parameter si existe
  if (
    route.query.balance &&
    !isNaN(parseFloat(route.query.balance as string))
  ) {
    balanceFromQuery.value = parseFloat(route.query.balance as string);
  }

  if (origenFondo.value === "card") {
    loadCards();
  }
  // Cargar el saldo del usuario desde el store si no se pasó por query o si el store está vacío
  if (
    balanceFromQuery.value === null &&
    (userStore.balance === null || userStore.balance === undefined)
  ) {
    console.log(
      "Balance no encontrado en query ni en store, intentando cargar perfil..."
    );
    try {
      await userStore.fetchUserProfile(); // Llama a la acción del store
      console.log("Perfil cargado. Nuevo balance en store:", userStore.balance);
    } catch (error) {
      console.error(
        "Error al cargar el perfil del usuario en TransferPage onMounted:",
        error
      );
    }
  } else if (balanceFromQuery.value !== null) {
    console.log("Balance obtenido de query params:", balanceFromQuery.value);
    // Opcional: si se quiere que el store refleje este saldo inicial si el store está vacío
    if (userStore.balance === null || userStore.balance === undefined) {
      userStore.setBalance(balanceFromQuery.value);
    }
  } else {
    console.log("Balance ya existente en el store:", userStore.balance);
  }
});

watch(origenFondo, (newOrigin) => {
  if (newOrigin === "card") {
    if (cards.value.length === 0 && !loadingCards.value) {
      // Solo cargar si no hay tarjetas y no se están cargando
      loadCards();
    }
  } else {
    selectedCardId.value = null; // Limpiar tarjeta seleccionada si se cambia a saldo
  }
});

async function confirmarDestinatario() {
  const recipientInput = form.value.to.trim();
  errorVerifyingRecipient.value = ""; // Limpiar error previo
  if (!recipientInput) {
    errorVerifyingRecipient.value = "Por favor ingresá un destinatario válido.";
    return;
  }

  // Si es un email, no necesitamos verificar con AccountApi, avanzamos directamente
  if (recipientInput.includes("@") && recipientInput.includes(".")) {
    destinatarioSeleccionado.value = true;
    return;
  }

  verifyingRecipient.value = true;
  try {
    if (/^\d{22}$/.test(recipientInput)) {
      // Es un CVU
      await AccountApi.verifyCVU(recipientInput);
      destinatarioSeleccionado.value = true;
    } else {
      // Asumimos que es un Alias
      await AccountApi.verifyAlias(recipientInput);
      destinatarioSeleccionado.value = true;
    }
  } catch (e: any) {
    console.error("Error al verificar destinatario:", e);
    if (e.code === 97) {
      // No autorizado
      router.push("/login");
      snackbarStore.showError(
        "Sesión expirada. Por favor, inicia sesión nuevamente."
      );
    } else if (
      e.code === 404 ||
      (e.description && e.description.toLowerCase().includes("not found")) ||
      (e.message && e.message.toLowerCase().includes("not found")) // Para errores genéricos de Axios
    ) {
      errorVerifyingRecipient.value = "El CVU o Alias ingresado no existe.";
    } else {
      errorVerifyingRecipient.value =
        e?.description || e?.message || "Error al verificar el destinatario.";
    }
    destinatarioSeleccionado.value = false; // No avanzar si hay error
  } finally {
    verifyingRecipient.value = false;
  }
}

function seleccionarDestinatario(alias: string) {
  form.value.to = alias;
  errorVerifyingRecipient.value = ""; // Limpiar error si se selecciona de la lista
}

async function onSubmit() {
  if (!destinatarioSeleccionado.value) {
    snackbarStore.showError(
      "Por favor, confirma un destinatario válido primero."
    );
    return;
  }

  const amount = parseFloat(form.value.amount);
  if (isNaN(amount) || amount <= 0) {
    snackbarStore.showError(
      "Por favor, ingresa un monto válido y mayor a cero."
    );
    return;
  }

  // Solo validar saldo si se usa el balance
  if (origenFondo.value === "balance") {
    const currentBalance = currentUserBalance.value;
    if (amount > currentBalance) {
      snackbarStore.showError(
        "No tienes saldo suficiente para realizar esta transferencia."
      );
      return;
    }
  }

  if (origenFondo.value === "card" && !selectedCardId.value) {
    snackbarStore.showError("Por favor, selecciona una tarjeta.");
    return;
  }

  loading.value = true;
  try {
    const recipient = form.value.to.trim();
    const transferAmount = amount;
    const message = form.value.message || "";
    let response;

    const paymentPayload = {
      amount: transferAmount,
      description: message,
      cardId: origenFondo.value === "card" ? selectedCardId.value : undefined,
    };

    if (recipient.includes("@") && recipient.includes(".")) {
      response = await PaymentsService.transferByEmail(
        recipient,
        paymentPayload.amount,
        paymentPayload.description,
        paymentPayload.cardId as undefined
      );
    } else if (/^\d{22}$/.test(recipient)) {
      response = await PaymentsService.transferByCvu(
        recipient,
        paymentPayload.amount,
        paymentPayload.description,
        paymentPayload.cardId as undefined
      );
    } else {
      response = await PaymentsService.transferByAlias(
        recipient,
        paymentPayload.amount,
        paymentPayload.description,
        paymentPayload.cardId as undefined
      );
    }

    snackbarStore.showSuccess(
      `Transferencia de $${transferAmount.toFixed(
        2
      )} realizada con éxito a ${recipient}`
    );

    // Solo actualizar el saldo si se usó el balance
    if (origenFondo.value === "balance") {
      const currentBalance = currentUserBalance.value;
      const newBalance = currentBalance - transferAmount;
      userStore.setAccountData({ balance: newBalance });
      if (balanceFromQuery.value !== null) {
        balanceFromQuery.value = newBalance;
      }
    }

    // Resetear el formulario
    form.value.to = "";
    form.value.amount = "";
    form.value.message = "";
    destinatarioSeleccionado.value = false;
    origenFondo.value = "balance";
    selectedCardId.value = null;
    errorVerifyingRecipient.value = "";
    router.push("/HomePage");
  } catch (e: any) {
    console.error("Error al realizar la transferencia:", e);
    snackbarStore.showError(
      e?.description ||
        e?.message ||
        "Error al realizar la transferencia. Verifica los datos e intenta nuevamente."
    );
    if (e.code === 97) router.push("/login");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.main-bg {
  background: #f4f6f8 !important; /* Un gris más claro y moderno */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  width: 100%;
}
.dashboard-upper-card {
  border-radius: 12px; /* Bordes ligeramente menos redondeados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important; /* Sombra más sutil */
  width: 100%;
  max-width: 550px; /* Un poco más compacto */
  margin-top: 20px; /* Más espacio arriba */
  background: #ffffff;
  padding: 20px 24px; /* Ajuste de padding interno */
}
.v-btn {
  font-weight: 600; /* Un poco más de peso para legibilidad */
  text-transform: none;
  letter-spacing: 0.2px; /* Menos espaciado */
  border-radius: 8px; /* Bordes consistentes */
}
.v-text-field,
.v-select {
  margin-bottom: 12px; /* Espacio consistente debajo de los inputs */
}
.cursor-pointer {
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
  border-radius: 8px; /* Bordes consistentes */
}
.cursor-pointer:hover {
  background-color: #f9f9f9; /* Hover muy sutil */
  border-color: #cccccc;
}
.recentes-list {
  max-height: 180px; /* Un poco más compacto */
  overflow-y: auto;
  padding-right: 6px; /* Para que el scrollbar no tape el contenido */
  margin-bottom: 16px; /* Espacio antes del botón */
}
.form-step-two {
  padding-top: 12px; /* Espacio arriba en el segundo paso */
}
.edit-btn {
  border-radius: 50%; /* Botón de editar circular */
}
.text-green-darken-1 {
  color: #388e3c !important; /* Asegurar color para el link */
}

/* Estilos para el scrollbar */
.recentes-list::-webkit-scrollbar {
  width: 6px;
}
.recentes-list::-webkit-scrollbar-track {
  background: #eeeeee; /* Color de fondo de la pista */
  border-radius: 10px;
}
.recentes-list::-webkit-scrollbar-thumb {
  background: #bdbdbd; /* Color del pulgar del scrollbar */
  border-radius: 10px;
}
.recentes-list::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0; /* Color del pulgar al pasar el mouse */
}
.balance-info {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 0.875rem;
}

.balance-label {
  color: #666;
  margin-right: 8px;
}

.balance-amount {
  font-weight: 600;
  color: #2e7d32;
}
</style>
