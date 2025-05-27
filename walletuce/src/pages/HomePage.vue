<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader :titulo="'Bienvenido, ' + (userName || 'Usuario')" />

      <!-- Contenido principal -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content"
      >
        <v-container class="dashboard-upper-card bg-grey-lighten-2">
          <!-- Tarjeta Saldo + Botón CVU alineados -->
          <v-container
            class="d-flex align-center justify-space-between monto-card dashboard-balance mb-6 bg-green-lighten-1"
            style="padding: 16px"
          >
            <div>
              <div class="text-h5 font-weight-bold text-grey-lighten-4">
                Saldo
              </div>
              <div class="text-h6 font-weight-bold text-grey-lighten-4">
                {{ formattedBalance }}
              </div>
            </div>
          </v-container>

          <!-- Accesos rápidos -->
          <v-container
            class="d-flex align-center justify-space-between px-4"
            style="width: 100%; margin-bottom: 16px"
          >
            <!-- Link a movimientos -->
            <div
              class="movimientos-link d-flex align-center"
              @click="onMovimientosClick"
              style="cursor: pointer"
            >
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <span
                    v-bind="props"
                    :class="
                      isHovering ? 'text-green-lighten-1' : 'text-grey-darken-3'
                    "
                    class="font-weight-bold"
                    >Ver Movimientos</span
                  >
                  <v-icon
                    size="20"
                    v-bind="props"
                    :class="
                      isHovering ? 'text-green-lighten-1' : 'text-grey-darken-3'
                    "
                    >mdi-chevron-right</v-icon
                  >
                </template>
              </v-hover>
            </div>
            <!-- Botón para ver CVU -->
            <v-btn
              class="quick-access-btn modern-cvu-btn"
              @click="mostrarCvu = true"
              color="green-lighten-1"
              variant="elevated"
            >
              <v-icon left class="mr-2">mdi-file-document</v-icon>
              Ver CVU
            </v-btn>
          </v-container>
        </v-container>

        <!-- Acciones -->
        <v-container
          class="dashboard-lower-card d-flex flex-column align-center justify-center main-content"
        >
          <v-row class="justify-center mt-2" style="width: 100%">
            <v-col
              cols="auto"
              class="text-center"
              v-for="(action, i) in actions"
              :key="i"
            >
              <v-btn
                class="action-btn mb-2 d-flex align-center justify-center mx-auto bg-grey-lighten-2"
                min-width="64"
                min-height="64"
                style="border-radius: 50% !important; aspect-ratio: 1"
                @click="handleActionClick(action.action)"
              >
                <v-icon :color="action.color" size="32">
                  {{ action.icon }}
                </v-icon>
              </v-btn>
              <v-container class="text-grey-darken-3 font-weight-bold">
                {{ action.label1 }}<br />{{ action.label2 }}
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <v-dialog v-model="mostrarCvu" max-width="480">
        <v-card class="dialog-cvu-card">
          <v-card-title
            class="text-h5 font-weight-bold text-center py-6 bg-green-lighten-1 text-white d-flex align-center justify-space-between px-6"
          >
            <v-icon color="white" size="24">mdi-account-cash</v-icon>
            <span>Datos de tu cuenta</span>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              size="small"
              @click="mostrarCvu = false"
            ></v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Sección CVU -->
            <div class="dialog-section">
              <div class="dialog-label">
                <v-icon size="18" color="green-lighten-1" class="mr-2"
                  >mdi-numeric</v-icon
                >
                CVU
              </div>
              <div class="dialog-value-container">
                <span class="dialog-value">{{ cvu || "Cargando..." }}</span>
                <v-btn
                  variant="tonal"
                  color="green-lighten-1"
                  size="small"
                  class="ml-2 copy-btn"
                  @click="copiarCvu"
                >
                  <v-icon size="18" class="mr-1">mdi-content-copy</v-icon>
                  Copiar
                </v-btn>
              </div>
            </div>

            <!-- Sección Alias -->
            <div class="dialog-section mt-4">
              <div class="dialog-label">
                <v-icon size="18" color="green-lighten-1" class="mr-2"
                  >mdi-at</v-icon
                >
                Alias
              </div>
              <div class="dialog-value-container">
                <template v-if="!editandoAlias">
                  <span class="dialog-value">{{ alias || "Cargando..." }}</span>
                  <v-btn
                    variant="tonal"
                    color="green-lighten-1"
                    size="small"
                    class="ml-2 edit-btn"
                    @click="empezarEditarAlias"
                  >
                    <v-icon size="18" class="mr-1">mdi-pencil</v-icon>
                    Editar
                  </v-btn>
                </template>
                <template v-else>
                  <div class="alias-edit-container">
                    <v-text-field
                      v-model="nuevoAlias"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      placeholder="Ingresa tu nuevo alias"
                      class="alias-input"
                      color="green-lighten-1"
                      bg-color="white"
                    />
                    <div class="alias-actions mt-2">
                      <v-btn
                        variant="tonal"
                        color="green-lighten-1"
                        size="small"
                        class="mr-2"
                        @click="guardarAlias"
                      >
                        <v-icon size="18" class="mr-1">mdi-content-save</v-icon>
                        Guardar
                      </v-btn>
                      <v-btn
                        variant="outlined"
                        color="grey"
                        size="small"
                        @click="cancelarEditarAlias"
                      >
                        <v-icon size="18" class="mr-1">mdi-close</v-icon>
                        Cancelar
                      </v-btn>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="justify-end px-6 pb-6">
            <v-btn
              block
              variant="tonal"
              color="green-lighten-1"
              @click="mostrarCvu = false"
              class="close-btn"
            >
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import { AccountApi } from "../api/account";
import { UserApi } from "../api/user";
import { useSnackbarStore } from "../stores/snackbar";

const router = useRouter();
const snackbarStore = useSnackbarStore();

const balance = ref(0);
const cvu = ref("");
const alias = ref("");
const mostrarCvu = ref(false);
const mostrarAlias = ref(false);
const editandoAlias = ref(false);
const nuevoAlias = ref("");
const userName = ref("");

function formatBalance(amount: number) {
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
}

const formattedBalance = computed(() => formatBalance(balance.value));

onMounted(async () => {
  try {
    // Cargar información de la cuenta
    const accountResponse = await AccountApi.get();
    balance.value = accountResponse?.balance ?? 0;
    cvu.value = accountResponse?.cvu ?? "";
    alias.value = accountResponse?.alias ?? "";

    // Cargar información del usuario
    const userResponse = await UserApi.get();
    if (userResponse && userResponse.firstName) {
      const fullName = userResponse.firstName;
      userName.value = fullName;
    } else {
      userName.value = "Usuario";
    }
  } catch (e) {
    console.error("Error al obtener datos:", e);
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      "description" in e &&
      (e as any).code === 97 &&
      (e as any).description === "Unauthorized."
    ) {
      router.push("/login");
    }
  }
});

function copiarCvu() {
  if (cvu.value) {
    navigator.clipboard.writeText(cvu.value);
  }
}

function empezarEditarAlias() {
  nuevoAlias.value = alias.value;
  editandoAlias.value = true;
}

function cancelarEditarAlias() {
  editandoAlias.value = false;
  nuevoAlias.value = "";
}

async function guardarAlias() {
  try {
    await AccountApi.updateAlias({ alias: nuevoAlias.value });
    alias.value = nuevoAlias.value;
    editandoAlias.value = false;
    snackbarStore.showSuccess("Alias actualizado correctamente");
  } catch (e) {
    snackbarStore.showError("Error al actualizar el alias");
  }
}

const actions = [
  {
    icon: "mdi-arrow-right-bold",
    color: "green-lighten-1",
    label1: "Ingresar",
    label2: "Dinero",
    action: "ingresar",
  },
  {
    icon: "mdi-swap-horizontal",
    color: "green-lighten-1",
    label1: "Transferir",
    label2: "Dinero",
    action: "transferir",
  },
  {
    icon: "mdi-arrow-down-bold",
    color: "green-lighten-1",
    label1: "Generar",
    label2: "Cobro",
    action: "generarCobro",
  },
  {
    icon: "mdi-arrow-up-bold",
    color: "green-lighten-1",
    label1: "Realizar",
    label2: "Pago",
    action: "realizarPago",
  },
  {
    icon: "mdi-wallet",
    color: "green-lighten-1",
    label1: "Administrar",
    label2: "tarjetas",
    action: "administrarTarjetas",
  },
];

function handleActionClick(action: string) {
  switch (action) {
    case "ingresar":
      router.push("./DepositPage");
      break;
    case "transferir":
      // Asegúrate de que balance.value es un número antes de convertirlo a string
      const currentBalance =
        typeof balance.value === "number" ? balance.value.toString() : "";
      router.push({
        path: "./TransferPage",
        query: { balance: currentBalance },
      });
      break;
    case "generarCobro":
      router.push("./GeneratePaymentPage");
      break;
    case "realizarPago":
      router.push("./MakePaymentPage");
      break;
    case "administrarTarjetas":
      router.push("./AdminCardsPage");
      break;
    default:
      console.warn("Acción no reconocida:", action);
  }
}

function onMovimientosClick() {
  router.push("/movements");
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.14) !important;
}
.v-btn.w-100 {
  width: 100%;
}
.movimientos-link {
  background: transparent !important;
  color: #484554 !important;
  border-radius: 0;
  box-shadow: none;
  height: auto;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.movimientos-text {
  font-weight: bold;
  margin-right: 4px;
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

.quick-access-row {
  margin-left: 24px;
  margin-bottom: 10px;
  gap: 16px;
}
.quick-access-btn {
  min-width: 0 !important;
  padding: 0 12px !important;
  font-weight: bold;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: 0.5px;
}
.modern-cvu-btn {
  font-weight: bold;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  text-transform: none;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  height: 40px;
}

.modern-cvu-btn:hover {
  transform: translateY(-2px);
}

.dialog-cvu-card {
  border-radius: 16px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 6px 24px rgba(56, 142, 60, 0.15) !important;
}

.dialog-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dialog-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 0.95rem;
  color: #2e7d32;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dialog-value-container {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.dialog-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  word-break: break-word;
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  flex-grow: 1;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.copy-btn,
.edit-btn {
  transition: all 0.2s ease;
  height: 48px !important;
}

.copy-btn:hover,
.edit-btn:hover {
  transform: translateY(-2px);
}

.alias-edit-container {
  width: 100%;
}

.alias-input {
  width: 100%;
  margin-bottom: 8px;
}

.alias-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.close-btn {
  margin-top: 8px;
  height: 48px;
}

html body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
