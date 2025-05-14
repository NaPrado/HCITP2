<template>
    <v-app>
      <v-container fluid class="pa-0 main-bg">
            <!-- Barra superior -->
            <v-app-bar color="green-lighten-1 accent-4" dark flat class="custom-app-bar">
            <v-avatar class="avatar-espaciado mr-3">
                <v-img src="/src/assets/letucce.svg" alt="Logo" width="40" height="40"></v-img>
            </v-avatar>
            <v-toolbar-title class="text-h4 font-weight-bold">Ingresar Dinero</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="onConfigurationClick">
                <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-btn class="ayuda-btn ml-2" color="green-lighten-1" @click="onAyudaClick">
                <v-icon left size="20" color="green-lighten-1">mdi-help-circle</v-icon>
                <span class="ayuda-text" color="green-lighten-1">Ayuda</span>
            </v-btn>
            </v-app-bar>

            <!-- Botón de atrás -->

            <!-- Contenido principal -->
            <v-container class="d-flex flex-column align-center justify-center main-content pt-4">
              <v-btn variant="text" color="black" @click="onVolverClick" class="back-button pl-1">
                <v-icon start>mdi-arrow-left</v-icon>
                Atrás
              </v-btn>
                <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">    
                    <v-card class="pa-4 mb-4 card-with-shadow-medium" color="green-lighten-1" rounded="lg">
                        <v-card-title class="text-white font-weight-bold pb-0 pt-0"><span><h2>Monto ingresado</h2></span></v-card-title>
                        <v-card-title class="text-white font-weight-bold pb-0 pt-0"><span><h3>${{ monto_ingresado }}</h3></span></v-card-title>
                    </v-card>
                    <v-card class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow-light" rounded="lg">
                        <v-card-title class="text-black font-weight-bold pb-0 pt-0"><span><h4>Desde: {{ fuente }}</h4></span></v-card-title>
                        <v-card-title class="text-black font-weight-bold pb-0 pt-0"><span><h6>{{ detalle_fuente }}</h6></span></v-card-title>
                    </v-card>
                    <p class="confirmation-text">¿Estás seguro?</p>
                    <v-row class="mt-4 mb-1 mr-1" justify="space-between" align="center">
                      <v-btn variant="text" color="black" @click="onVolverHomeClick">
                        <v-icon start>mdi-chevron-left</v-icon>
                        Volver a Hogar
                      </v-btn>
                        <v-btn color="green-lighten-1" class="text-white font-weight-bold" rounded @click="onCrearClick">
                            Crear Importe
                        </v-btn>
                    </v-row>
                </v-card>
            </v-container>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'


const router = useRouter()

function onVolverHomeClick(){
  router.push("./HomePage");
}

function onVolverClick(){
  router.push("./DepositPage");
}

function onCrearClick(){
  router.push("./HomePage");
}

const monto_ingresado = ref(210343);
const fuente = ref("Tarjeta");
const detalle_fuente = ref("**** 1234");

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
  .confirmation-text{
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
</style>