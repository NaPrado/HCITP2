<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Mi Perfil" />

      <!-- Contenido principal -->
      <v-container class="d-flex flex-column align-center justify-center main-content pt-4">
        <BackButton to="/HomePage" variant="text" class="align-self-start ml-4 mt-4" />

        <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
          <!-- Información de usuario -->
          <v-card class="pa-4 mb-4 card-with-shadow-medium bg-grey-lighten-3" rounded="lg">
            <v-card-title class="text-green font-weight-bold pb-1 pt-0">
              <h2>{{ nombre }}</h2>
            </v-card-title>
            <v-card-title class="text-black pb-0 pt-0">
              <h5>Mail asociado: {{ mail }}</h5>
            </v-card-title>
            <v-card-text class="pt-2">
              <!-- Alias -->
              <div class="mb-4">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-subtitle-1 font-weight-bold">Alias</span>
                  <template v-if="!editandoAlias">
                    <v-btn
                      variant="tonal"
                      color="green-lighten-1"
                      size="small"
                      class="ml-2"
                      @click="empezarEditarAlias"
                    >
                      <v-icon size="18" class="mr-1">mdi-pencil</v-icon>
                      Editar
                    </v-btn>
                  </template>
                </div>

                <div v-if="!editandoAlias" class="alias-display">
                  {{ alias || 'Cargando...' }}
                </div>
                <div v-else>
                  <v-text-field
                    v-model="editableAlias"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    placeholder="Ingresa tu nuevo alias"
                    color="green-lighten-1"
                    bg-color="white"
                    class="mb-2"
                  />
                  <div class="d-flex">
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
              </div>

              <!-- CVU -->
              <div>
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-subtitle-1 font-weight-bold">CVU</span>
                </div>
                <div class="alias-display">
                  {{ cvu || 'Cargando...' }}
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Tarjetas -->
          <v-card
            class="d-flex align-center justify-space-between px-4 py-3 mb-4 bg-grey-lighten-3 card-with-shadow-light tarjeta-card"
            rounded="lg"
            @click="onTarjetasClick"
          >
            <v-icon size="36" color="green-darken-2" class="mr-4">mdi-wallet</v-icon>
            <div class="flex-grow-1">
              <span class="text-black font-weight-medium text-subtitle-1">Administrar Tarjetas</span>
            </div>
            <v-icon size="24" color="grey-darken-1">mdi-chevron-right</v-icon>
          </v-card>

          <!-- Botón cerrar sesión -->
          <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
            <v-btn
              color="green-lighten-1"
              class="text-white font-weight-bold pl-6 pr-6 ml-3"
              rounded
              @click="onCerrarClick"
            >
              Cerrar Sesión
            </v-btn>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { UserApi } from "../api/user";
import { AccountApi } from "../api/account";
import { Api } from "../api/api";
import { useSnackbarStore } from "../stores/snackbar";

const snackbarStore = useSnackbarStore();
const editandoAlias = ref(false);

const router = useRouter();

const mail = ref("");
const nombre = ref("");
const cvu = ref("");
const alias = ref("");
const editableAlias = ref("");
function empezarEditarAlias() {
  editableAlias.value = alias.value;
  editandoAlias.value = true;
}

function cancelarEditarAlias() {
  editandoAlias.value = false;
  editableAlias.value = alias.value;
}

onMounted(async () => {
  try {
    const user = await UserApi.get();
    mail.value = user.email || "";
    nombre.value = user.firstName
      ? user.firstName + (user.lastName ? " " + user.lastName : "")
      : "";

    const account = await AccountApi.get();
    cvu.value = account.cvu || "";
    alias.value = account.alias || "";
    editableAlias.value = alias.value;
  } catch (e) {
    console.error("Error al obtener datos de perfil:", e);
    router.push("/login");
  }
});

async function guardarAlias() {
  try {
    const nuevoAlias = editableAlias.value.trim();
    await AccountApi.updateAlias({ alias: nuevoAlias }); // Asegúrate que exista este método
    alias.value = nuevoAlias;
    editandoAlias.value = false;
    snackbarStore.showSuccess("Alias actualizado correctamente");
  } catch (e) {
    console.error("Error al actualizar alias:", e);
    snackbarStore.showError("Error al actualizar el alias");
  }
}


async function onCerrarClick() {
  try {
    await UserApi.logout();
  } catch (error: unknown) {
    console.error("Error al cerrar sesión:", error);
  }
  Api.token = null;
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  router.push("/login");
}

function onTarjetasClick() {
  router.push("./AdminCardsPage");
}
</script>

<style scoped>
.main-bg {
  background: #eee !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.cvu-box {
  font-family: monospace;
  background-color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-all;
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
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tarjeta-card {
  cursor: pointer;
  transition: background-color 0.2s;
}
.tarjeta-card:hover {
  background-color: #e0e0e0;
}

.alias-display {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  font-family: "Roboto", sans-serif;
  word-break: break-word;
}


</style>
