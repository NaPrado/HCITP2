<template>
  <v-app-bar
    :elevation="0"
    flat
    color="green-lighten-1"
    dark
    class="custom-app-bar"
  >
    <v-container
      class="d-flex align-center justify-space-between fill-height pa-0"
    >
      <!-- Logo + Título con hover -->
      <div
        class="d-flex align-center text-decoration-none link-wrapper px-2"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <RouterLink
          to="/HomePage"
          class="d-flex align-center text-decoration-none"
        >
          <v-avatar class="mr-3" size="40">
            <v-img
              src="/src/assets/letucce.svg"
              alt="Logo"
              width="40"
              height="40"
              cover
            />
          </v-avatar>
          <transition name="fade-slide-up" mode="out-in">
            <v-toolbar-title
              :key="hovering ? 'walletuce' : 'titulo'"
              class="text-white font-weight-bold text-h5 fixed-title-width"
            >
              {{ hovering ? "Walletuce" : titulo }}
            </v-toolbar-title>
          </transition>
        </RouterLink>
      </div>

      <!-- Acciones -->

      <div class="d-flex align-center">
        <!-- Botón de configuración con menú -->
        <v-menu
          v-model="menuVisible"
          :close-on-content-click="true"
          offset-y
          transition="scale-transition"
          location="bottom end"
          :theme="'light'"
        >
          <template #activator="{ props }">
            <v-btn icon v-bind="props" class="bg-white" width="35" height="35">
              <v-icon color="green-darken-3 ">mdi-account</v-icon>
            </v-btn>
          </template>

          <!-- Aquí aplicamos el modo claro explícitamente -->
          <v-card class="menu-card" width="200" color="white" :dark="false">
            <v-list dense>
              <v-list-item @click="onVerPerfil">
                <v-list-item-title class="text-black"
                  >Ver mi perfil</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="onCerrarSesion">
                <v-list-item-title class="text-green font-weight-bold"
                  >Cerrar sesión</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-btn class="ayuda-btn ml-2" @click="onAyudaClick">
          <v-icon left size="20">mdi-help-circle</v-icon>
          <span class="ayuda-text">Ayuda</span>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { Api } from "../api/api";
import { Api as ApiImpl } from "../api/api";
import { UserApi } from "../api/user";
import { ROUTES } from "../constants";

const router = useRouter();

defineProps<{
  titulo: string;
}>();

const hovering = ref(false);
const menuVisible = ref(false);

function onVerPerfil() {
  menuVisible.value = false;
  router.push(ROUTES.PROFILE);
}

async function onCerrarSesion() {
  menuVisible.value = false;
  try {
    await UserApi.logout();
  } catch (error: unknown) {
    console.error("Error al cerrar sesión:", error);
  }
  ApiImpl.token = null;
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  router.push(ROUTES.LOGIN);
}

function onAyudaClick() {
  router.push(ROUTES.HELP);
}
</script>

<script lang="ts">
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.custom-app-bar {
  min-height: 72px;
}

/* Nueva animación sin position absolute */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.ayuda-btn {
  background-color: #ffffff !important;
  color: #2e7d32 !important;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 6px 20px 6px 12px;
  display: flex;
  align-items: center;
  height: 42px;
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: 0.25px;
  border: 1px solid #c8e6c9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.ayuda-btn:hover {
  background-color: #e8f5e9 !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
}

.ayuda-text {
  margin-left: 6px;
  font-weight: 600;
  font-size: 1rem;
}

.text-decoration-none {
  text-decoration: none;
}

.link-wrapper {
  display: flex;
  align-items: center;
}

.fixed-title-width {
  min-width: 500px; /* Ajustá según el largo del titulo original */
}
.v-list-item:hover {
  background-color: #f9f9f9 !important;
}
.v-menu__content {
  background-color: white !important;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}
.menu-card {
  background-color: white !important;
}
</style>
