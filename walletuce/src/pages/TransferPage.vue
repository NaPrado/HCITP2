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
          class="align-self-start ml-4 mt-2"
        />
        <v-container class="dashboard-upper-card">
          <v-form @submit.prevent="onSubmit" class="w-100 px-4 py-4">
            <!-- Paso 1: Elegir destinatario -->
            <template v-if="!destinatarioSeleccionado">
              <div class="text-subtitle-1 font-weight-medium mb-3">
                ¿A quién quieres enviar dinero?
              </div>
              <v-text-field
                v-model="form.to"
                label="Destinatario"
                placeholder="Alias o CVU"
                prepend-inner-icon="mdi-account-search-outline"
                required
                variant="outlined"
                density="comfortable"
                class="mb-3"
                :error-messages="errorVerifyingRecipient"
                @input="errorVerifyingRecipient = ''"
                bg-color="white"
                rounded="lg"
              ></v-text-field>

              <div class="mt-4">
                <div class="d-flex align-center mb-2">
                  <v-icon
                    icon="mdi-clock-outline"
                    color="grey-darken-1"
                    class="mr-2"
                    size="small"
                  ></v-icon>
                  <h3 class="text-subtitle-2 font-weight-medium mb-0">
                    Recientes
                  </h3>
                </div>
                <div class="recentes-list">
                  <template v-if="destinatariosFiltrados.length > 0">
                    <div
                      v-for="(dest, index) in destinatariosFiltrados"
                      :key="index"
                    >
                      <v-card
                        class="pa-2 mb-2 cursor-pointer recent-card"
                        variant="outlined"
                        @click="seleccionarDestinatario(dest)"
                      >
                        <div class="d-flex align-center">
                          <v-avatar
                            color="green-lighten-4"
                            size="36"
                            class="mr-2"
                          >
                            <v-icon color="green-darken-2" size="small"
                              >mdi-account</v-icon
                            >
                          </v-avatar>
                          <div>
                            <div class="font-weight-medium text-body-2">
                              {{ dest.nombre }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ dest.tipo }}: {{ dest.alias }}
                            </div>
                          </div>
                        </div>
                      </v-card>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-grey text-caption text-center py-3">
                      No se encontraron destinatarios recientes o que coincidan
                      con tu búsqueda.
                    </div>
                  </template>
                </div>
              </div>

              <v-btn
                color="green-darken-1"
                class="mt-4 text-white"
                block
                size="large"
                @click="confirmarDestinatario"
                :disabled="!form.to.trim() || verifyingRecipient"
                :loading="verifyingRecipient"
                elevation="2"
                rounded="lg"
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
                    <div class="text-subtitle-2 text-grey-darken-1">
                      Enviando a:
                    </div>
                    <div
                      class="font-weight-bold text-subtitle-1 text-green-darken-2"
                    >
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
                    color="green-darken-2"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>

                <v-radio-group
                  v-model="origenFondo"
                  inline
                  label="Origen de los fondos"
                  class="mb-3"
                  density="comfortable"
                  color="green-darken-1"
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
                  density="comfortable"
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
                  bg-color="white"
                  rounded="lg"
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
                  density="comfortable"
                  class="mb-3"
                  :error-messages="montoErrorMessage"
                  :rules="[
                    (v) => !!v || 'El monto es requerido',
                    (v) =>
                      parseFloat(v) > 0 || 'El monto debe ser mayor a cero',
                    (v) => validateAmount(v) || 'Saldo insuficiente',
                  ]"
                  bg-color="white"
                  rounded="lg"
                ></v-text-field>

                <div v-if="origenFondo === 'balance'" class="balance-info mb-3">
                  <v-icon
                    icon="mdi-wallet-outline"
                    class="mr-2"
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
                  density="comfortable"
                  class="mb-4"
                  bg-color="white"
                  rounded="lg"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="green-darken-1"
                  class="text-white"
                  block
                  size="large"
                  elevation="2"
                  :loading="loading"
                  :disabled="
                    loading ||
                    !form.amount ||
                    (origenFondo === 'card' && !selectedCardId) ||
                    (origenFondo === 'balance' &&
                      parseFloat(form.amount) > (currentUserBalance || 0)) ||
                    !!montoErrorMessage
                  "
                  rounded="lg"
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
import { useRouter, useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { useSnackbarStore } from "../stores/snackbar";
import { PaymentsService } from "../api/payments.js";
import { CardApi } from "../api/card.js";
import { Api } from "../api/api.js"; // Aunque no se use directamente, es dependencia de otras APIs
import { AccountApi } from "../api/account.js";
import { useUserStore } from "../stores/user";

const router = useRouter();
const route = useRoute();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const balanceFromQuery = ref<number | null>(null);

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

// Lista de recientes
const destinatariosRecientes = ref([]);

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
    // Podrías redirigir o mostrar un error si no hay token
    // snackbarStore.showError("Sesión no iniciada. Por favor, inicie sesión.");
    // router.push("/login");
    // return;
  }
  loadingCards.value = true;
  errorLoadingCards.value = "";
  try {
    const response = await CardApi.getAll(); // Asume que CardApi.getAll() existe y funciona
    let rawCards = [];
    if (Array.isArray(response)) {
      rawCards = response;
    } else if (response && Array.isArray(response.cards)) {
      rawCards = response.cards;
    } else if (response && Array.isArray(response.result)) {
      rawCards = response.result;
    }

    cards.value = rawCards.map((card: any) => ({
      // Añadir 'any' temporalmente si la estructura de card no está bien definida
      displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
      id: card.id,
    }));

    if (cards.value.length === 0 && !errorLoadingCards.value) {
      errorLoadingCards.value = "No tiene tarjetas cargadas.";
    }
  } catch (e: any) {
    console.error("Error al cargar tarjetas:", e);
    errorLoadingCards.value = e?.description || "Error al cargar tarjetas.";
    cards.value = [];
    if (e.code === 97) router.push("/login");
  } finally {
    loadingCards.value = false;
  }
}

onMounted(async () => {
  if (
    route.query.balance &&
    !isNaN(parseFloat(route.query.balance as string))
  ) {
    balanceFromQuery.value = parseFloat(route.query.balance as string);
  }

  if (origenFondo.value === "card") {
    loadCards();
  }

  if (
    balanceFromQuery.value === null &&
    (userStore.balance === null || userStore.balance === undefined)
  ) {
    try {
      await userStore.fetchUserProfile();
    } catch (error) {
      console.error(
        "Error al cargar el perfil del usuario en TransferPage onMounted:",
        error
      );
    }
  } else if (balanceFromQuery.value !== null) {
    if (userStore.balance === null || userStore.balance === undefined) {
      userStore.setBalance(balanceFromQuery.value); // Asumiendo que setBalance existe
    }
  }
});

watch(origenFondo, (newOrigin) => {
  if (newOrigin === "card") {
    if (cards.value.length === 0 && !loadingCards.value) {
      loadCards();
    }
  } else {
    selectedCardId.value = null;
  }
});

async function confirmarDestinatario() {
  const recipientInput = form.value.to.trim();
  errorVerifyingRecipient.value = "";
  if (!recipientInput) {
    errorVerifyingRecipient.value = "Por favor ingresá un destinatario válido.";
    return;
  }

  if (recipientInput.includes("@") && recipientInput.includes(".")) {
    destinatarioSeleccionado.value = true;
    return; // Es un email, no se verifica con API de cuenta
  }

  verifyingRecipient.value = true;
  try {
    // Verificamos si es un CVU (20 caracteres alfanuméricos)
    if (/^[A-Z0-9]{20}$/.test(recipientInput)) {
      try {
        await AccountApi.verifyCVU(recipientInput);
        destinatarioSeleccionado.value = true;
      } catch (e: any) {
        if (
          e.code === 404 ||
          e.description?.toLowerCase().includes("not found")
        ) {
          errorVerifyingRecipient.value = "El CVU ingresado no existe.";
        } else {
          throw e; // Re-lanzamos otros errores para manejarlos en el catch general
        }
      }
    } else {
      // Si no es CVU, asumimos que es un Alias
      await AccountApi.verifyAlias(recipientInput);
      destinatarioSeleccionado.value = true;
    }
  } catch (e: any) {
    console.error("Error al verificar destinatario:", e);
    if (e.code === 97) {
      router.push("/login");
      snackbarStore.showError(
        "Sesión expirada. Por favor, inicia sesión nuevamente."
      );
    } else if (
      e.code === 404 ||
      (e.description && e.description.toLowerCase().includes("not found")) ||
      (e.message && e.message.toLowerCase().includes("not found"))
    ) {
      errorVerifyingRecipient.value =
        "El CVU o Alias ingresado no existe o no es válido.";
    } else {
      errorVerifyingRecipient.value =
        e?.description || e?.message || "Error al verificar el destinatario.";
    }
    destinatarioSeleccionado.value = false;
  } finally {
    verifyingRecipient.value = false;
  }
}

function seleccionarDestinatario(dest: any) {
  form.value.to = dest.alias;
  errorVerifyingRecipient.value = "";
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

  if (origenFondo.value === "balance") {
    const currentBalance = currentUserBalance.value || 0;
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
    const trimmedMessage = form.value.message.trim();
    const message = trimmedMessage || "Transferencia";
    const cardIdForTransfer =
      origenFondo.value === "card" ? selectedCardId.value : undefined;

    let response;

    if (recipient.includes("@") && recipient.includes(".")) {
      response = await PaymentsService.transferByEmail(
        recipient,
        transferAmount,
        message,
        cardIdForTransfer
      );
    } else if (/^[A-Z0-9]{20}$/.test(recipient)) {
      response = await PaymentsService.transferByCvu(
        recipient,
        transferAmount,
        message,
        cardIdForTransfer
      );
    } else {
      response = await PaymentsService.transferByAlias(
        recipient,
        transferAmount,
        message,
        cardIdForTransfer
      );
    }

    snackbarStore.showSuccess(
      `Transferencia de $${transferAmount.toFixed(
        2
      )} realizada con éxito a ${recipient}`
    );

    if (origenFondo.value === "balance") {
      const currentBalance = currentUserBalance.value || 0;
      const newBalance = currentBalance - transferAmount;
      userStore.setAccountData({ balance: newBalance });
      if (balanceFromQuery.value !== null) {
        balanceFromQuery.value = newBalance;
      }
    }

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
  background: #f4f6f8 !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  width: 100%;
}

.dashboard-upper-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  width: 100%;
  max-width: 500px;
  margin-top: 12px;
  background: #ffffff;
  padding: 20px;
}

.v-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.2px;
  border-radius: 12px;
  height: 44px;
}

.v-text-field,
.v-select {
  margin-bottom: 12px;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.recent-card:hover {
  background-color: #f9f9f9;
  border-color: #cccccc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recentes-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 12px;
}

.form-step-two {
  padding-top: 12px;
}

.edit-btn {
  border-radius: 50%;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: #e8f5e9 !important;
}

.text-green-darken-1 {
  color: #388e3c !important;
}

.recentes-list::-webkit-scrollbar {
  width: 6px;
}

.recentes-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}

.recentes-list::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 10px;
}

.recentes-list::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}

.balance-info {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background-color: #f5f5f5;
  border-radius: 12px;
  font-size: 0.875rem;
  border: 1px solid #e0e0e0;
}

.balance-label {
  color: #666;
  margin-right: 8px;
}

.balance-amount {
  font-weight: 600;
  color: #2e7d32;
}

:deep(.v-field) {
  border-radius: 12px;
}

:deep(.v-field__input) {
  padding-top: 12px;
  padding-bottom: 12px;
}

:deep(.v-label) {
  font-size: 0.875rem;
}

:deep(.v-radio) {
  margin-right: 24px;
}

:deep(.v-radio__label) {
  font-size: 0.875rem;
}
</style>
