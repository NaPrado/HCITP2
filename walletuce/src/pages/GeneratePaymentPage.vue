<template>
    <v-app>
      <v-container fluid class="pa-0 main-bg">
        <!-- Barra superior -->
        <AppHeader titulo="Generar Cobro" />
  
        <!-- Contenido principal -->
        <v-container class="d-flex flex-column align-center justify-center main-content pt-10">
          <v-btn variant="text" color="black" @click="onVolverClick" class="back-button pl-1">
              <v-icon start>mdi-arrow-left</v-icon>
              Atrás
          </v-btn>
          <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
            
            <!-- Monto y Título -->
            <div class="card-container">
              <v-card class="pa-4 mb-4 card-with-shadow equal-width-card" color="green-lighten-1" rounded="lg">
                <v-card-title class="text-white font-weight-bold"><h2>Monto a cobrar</h2></v-card-title>
                <v-text-field placeholder="Ingrese un monto" v-model="monto" type="number" hide-details class="ml-2 mr-2 bg-grey-lighten-4"></v-text-field>
              </v-card>
              
              <v-card class="pa-4 mb-4 card-with-shadow equal-width-card" color="green-lighten-1" rounded="lg">
                <v-card-title class="text-white font-weight-bold"><h2>Titulo</h2></v-card-title>
                <v-text-field placeholder="Ingrese un titulo" v-model="titulo" hide-details class="ml-2 mr-2 bg-grey-lighten-4"></v-text-field>
              </v-card>
            </div>
  
            <!-- Botones -->
            <v-row class="mt-4 mb-1 mr-1">
              <v-btn variant="text" color="black" @click="onVolverClick" align="left">
                <v-icon start>mdi-chevron-left</v-icon>
                Volver a Hogar
              </v-btn>
              <v-btn color="green-lighten-1" class="second-button text-white font-weight-bold" rounded @click="onGenerarLinkClick" align="right">
                Generar Link
                <v-icon class="ml-2">mdi-link</v-icon>
              </v-btn>
              <v-btn color="green-lighten-1" class="text-white font-weight-bold ml-4" rounded @click="onGenerarQRClick" align="right">
                Generar QR
                <v-icon class="ml-2">mdi-qrcode</v-icon>
              </v-btn>
            </v-row>
  
          </v-card>
        </v-container>
      </v-container>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref } from 'vue';
  
  const router = useRouter()

  const monto = ref();
  const titulo = ref("");
  
  function onVolverClick() {
    router.push('./HomePage')
  }
  function onGenerarLinkClick() {
    router.push('./HomePage')
  }
  function onGenerarQRClick() {
    router.push('./HomePage')
  }
  function onConfigurationClick() {
    // lógica de configuración
  }
  function onAyudaClick() {
    // lógica de ayuda
  }
  </script>
  
  <style scoped>
  .second-button {
    margin-left: 120px;
  }
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
    display: flex;
    align-items: center;
    min-height: 40px;
    height: 40px;
    transition: background 0.2s;
    gap: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
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
    vertical-align: middle;
  }
  .avatar-espaciado {
    margin-left: 16px;
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
  .custom-app-bar {
    min-height: 72px !important;
  }
  .custom-app-bar .v-toolbar-title {
    line-height: 1.2;
  }
  .v-toolbar-title {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .back-button {
    align-self: flex-start;
    margin-left: 20%;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  
  .card-container {
    display: flex;
    width: 100%;
    gap: 16px;
    margin: 0;
  }
  
  .equal-width-card {
    width: 100%;
    flex: 1;
  }
  </style>
  