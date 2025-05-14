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
          <v-btn class="ayuda-btn ml-2" color="green-lighten-1" elevation="0" @click="onAyudaClick">
            <v-icon left size="20" color="green-lighten-1">mdi-help-circle</v-icon>
            <span class="ayuda-text" color="green-lighten-1">Ayuda</span>
          </v-btn>
        </v-app-bar>
  
        <!-- Contenido principal -->
        <v-container class="d-flex flex-column align-center justify-center main-content pt-10">
          <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg" elevation="4">
            
            <!-- Monto -->
            <v-card class="pa-4 mb-4" color="green-lighten-1" rounded="lg" elevation="2">
              <v-card-title class="text-white font-weight-bold"><span><h2>Monto</h2></span></v-card-title>
              <v-text-field
                hide-details
                class="ml-2 mr-2 bg-grey-lighten-4"
              ></v-text-field>
            </v-card>
  
            <!-- Selección de origen -->
            <v-card class="pa-4 mb-4 bg-grey-lighten-3" rounded="lg" elevation="1">
              <v-card-title class="text-grey-darken-3 font-weight-bold text-subtitle-1">Seleccione de donde realiza el ingreso.</v-card-title>
              <v-checkbox label="Cuenta Bancaria" color="green-lighten-1" class="ml-2" hide-details></v-checkbox>
              <v-checkbox label="Tarjeta" color="green-lighten-1" class="ml-2" :model-value="true" hide-details></v-checkbox>
            </v-card>
  
            <!-- Botones -->
            <v-row class="mt-4 mb-1 mr-1" justify="space-between" align="center">
              <v-btn variant="text" color="black">
                <v-icon start>mdi-chevron-left</v-icon>
                Volver a Hogar
              </v-btn>
              <v-btn color="green-lighten-1" class="text-white font-weight-bold" rounded>
                Crear Importe
              </v-btn>
            </v-row>
  
          </v-card>
        </v-container>
      </v-container>
    </v-app>
  </template>
  
  <script setup lang="ts">
  //import { onAyudaClick, onConfigurationClick } from "./HomePage"
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
    box-shadow: none !important;
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
  
  /* Ahora más ancho */
  .container-card {
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    width: 100%;
    max-width: 700px; /* aumentado de 700px */
    margin-left: auto;
    margin-right: auto;
    flex-direction: column;
    align-items: center;
  }
  
  /* Corregido */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24px;
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
  </style>
  