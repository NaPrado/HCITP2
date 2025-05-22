<template>
  <v-app>
    <v-main class="landing-background">
      <v-container class="d-flex flex-column justify-space-between align-center pa-0 pt-4">
        <!-- Encabezado -->
        <v-row align="center" class="w-100 pa-6">
          <!-- Logo e Identidad -->
          <v-col cols="2" class="d-flex align-center">
            <v-img
              src="/src/assets/letucce.svg"
              alt="Logo"
              width="40"
              height="40"
            />
            <span class="text-green-darken-2 text-h5 font-weight-bold">Walletuce</span>
          </v-col>

          <!-- Botones -->
          <v-col cols="10" class="d-flex justify-end align-center">
            <v-btn class="mr-2" variant="outlined" color="green-darken-2" rounded @click="onIniciarSesionClick">
              Iniciar Sesión
            </v-btn>
            <v-btn color="green-darken-2" class="text-white font-weight-bold" rounded @click="onRegistrarseClick">
              Registrarse
            </v-btn>
          </v-col>
        </v-row>

        <!-- Contenido principal -->
        <v-container class="text-center mt-16">
          <h1 class="display-2 font-weight-bold text-green-darken-2 mb-4">Tu dinero, simple y seguro.</h1>
          <h3 class="text-grey-darken-1 font-weight-regular mb-8">
            Con Walletuce podés enviar, recibir y administrar tu dinero sin complicaciones.
          </h3>
          <v-btn color="green-darken-2" class="text-white font-weight-bold px-10 pt-2 pb-8 text-lg" rounded @click="onIniciarSesionClick">
            COMENZAR AHORA
          </v-btn>
        </v-container>

        <!-- Espaciado inferior -->
      </v-container>
    </v-main>
    <v-footer color="grey-lighten-3" class="text-center py-0" padless>
        <v-container class="py-0">
            <h3>Sobre nosotros</h3>
            <p class="text-body-1 text-grey-darken-2 font-weight-regular mb-0">
            Walletuce es una plataforma para gestionar tu dinero de forma simple y segura. Fundada en 2025.
            </p>
            <h3 class="mt-2">Contactos</h3>
            <p class="text-body-1 text-grey-darken-2 font-weight-regular mb-0">
            Para cualquier consulta contactenos en <span class="text-green">mcuneogima@itba.edu.ar</span>.
            </p>
        </v-container>
    </v-footer>
  </v-app>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function onIniciarSesionClick() {
  router.push("/HomePage")
}

function onRegistrarseClick() {
  // Por ahora sin lógica
}
</script>

<style scoped>
.landing-background {
  background-color: #ffffff;
  overflow: hidden;
}

.display-2 {
  font-size: 3rem;
}

.text-lg {
  font-size: 1.2rem;
}

/* Reduce espacio entre logo y texto */
.logo-row {
  gap: 8px;
  align-items: center;
}

/* Eliminar fondo negro del body si lo hay */
:global(body) {
  background-color: white !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
