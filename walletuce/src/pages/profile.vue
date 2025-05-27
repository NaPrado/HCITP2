<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Mi Perfil" />

      <!-- Contenido principal -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content pt-4"
      >
        <BackButton
          to="/HomePage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />
        <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
          <v-card
            class="pa-4 mb-4 card-with-shadow-medium bg-grey-lighten-3"
            rounded="lg"
          >
            <v-card-title class="text-green font-weight-bold pb-1 pt-0">
              <h2>{{ nombre }}</h2>
            </v-card-title>
            <v-card-title class="text-black pb-0 pt-0">
              <h5>Mail asociado: {{ mail }}</h5>
            </v-card-title>
            <v-card-text class="pt-2">
              <div>
                <b>CVU: </b>
                <span style="font-family: monospace">{{ cvu }}</span>
              </div>
              <div>
                <b>Alias: </b> <span>{{ alias }}</span>
              </div>
            </v-card-text>
          </v-card>
          <v-card
            class="d-flex align-center justify-space-between px-4 py-3 mb-4 bg-grey-lighten-3 card-with-shadow-light tarjeta-card"
            rounded="lg"
            @click="onTarjetasClick"
          >
            <v-icon size="36" color="green-darken-2" class="mr-4"
              >mdi-wallet</v-icon
            >
            <div class="flex-grow-1">
              <span class="text-black font-weight-medium text-subtitle-1"
                >Administrar Tarjetas</span
              >
            </div>
            <v-icon size="24" color="grey-darken-1">mdi-chevron-right</v-icon>
          </v-card>
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

const router = useRouter();

const mail = ref("");
const nombre = ref("");
const cvu = ref("");
const alias = ref("");

onMounted(async () => {
  try {
    // Obtener datos de usuario
    const user = await UserApi.get();
    mail.value = user.email || "";
    nombre.value = user.firstName
      ? user.firstName + (user.lastName ? " " + user.lastName : "")
      : "";
    // Obtener datos de cuenta
    const account = await AccountApi.get();
    cvu.value = account.cvu || "";
    alias.value = account.alias || "";
  } catch (e) {
    console.error("Error al obtener datos de perfil:", e);
    router.push("/login");
  }
});

function onCerrarClick() {
  router.push("./LandingPage");
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
  min-height: 72px !important; /* ajusta según necesidad */
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
  max-width: 700px; /* aumentado de 700px */
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
.tarjeta-card {
  cursor: pointer;
  transition: background-color 0.2s;
}
.tarjeta-card:hover {
  background-color: #e0e0e0; /* efecto hover sutil */
}
</style>
