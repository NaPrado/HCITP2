<template>
    <v-app>
      <v-container fluid class="pa-0 main-bg">
        <!-- Barra superior -->
        <AppHeader titulo="Tarjetas Registradas" />
  
        <!-- Contenido principal -->
        <v-container class="d-flex flex-column align-center justify-center main-content pt-16">
          <v-btn variant="text" color="black" @click="onVolverClick" class="back-button pl-1">
              <v-icon start>mdi-arrow-left</v-icon>
              Atrás
          </v-btn>
          <v-card class="pa-4 container-card bg-grey-lighten-2" rounded="lg">
            <v-container
                class="monto-card dashboard-balance mb-4 bg-green-lighten-1"
            >
                <v-container
                class="text-h4 font-weight-bold text-grey-lighten-4 pa-0"
                >Monto</v-container
                >
                <v-container
                class="text-h6 font-weight-bold text-grey-lighten-4 pa-0"
                >$205.376,82</v-container
                >
            </v-container>
            <v-row class="mt-2 mb-1 mr-1" justify="space-between" align="center">
                <v-btn variant="text" color="black" @click="onVolverClick">
                  <v-icon start>mdi-chevron-left</v-icon>
                  Volver a Hogar
                </v-btn>
                <v-btn
                  color="green-lighten-1"
                  class="text-white font-weight-bold"
                  rounded
                  @click="onAñadirTarjetaClick"
                >
                  <v-icon start class="mr-1">mdi-plus</v-icon>
                  Añadir Tarjeta
                </v-btn>
            </v-row>
            <v-divider class="mb-3 mt-2"></v-divider>
            

            <!-- Lista de tarjetas scrolleable -->
            <div class="tarjetas-container">
              <div v-if="hayTarjetas" class="tarjetas-lista">
                <v-card 
                  v-for="(tarjeta, index) in tarjetas" 
                  :key="index"
                  class="mb-3 pa-3 rounded-lg tarjeta-item"
                  flat
                >
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-subtitle-1 font-weight-bold text-black">{{ tarjeta.banco }}</div>
                      <div class="text-body-2 text-grey">{{ tarjeta.tipo }}</div>
                    </div>
                    <div class="text-green text-subtitle-1 font-weight-bold">
                      {{ tarjeta.numero }}
                      <v-btn variant="text" color="black" @click="onEliminarTarjeta(tarjeta.id)">
                            <v-icon color="green">mdi-trash-can</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-card>
                
                <!-- Botón de más tarjetas -->
                <div class="text-center my-3">
                  <v-btn variant="text" color="grey" density="comfortable" class="more-btn">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- Mensaje cuando no hay tarjetas -->
              <div v-else class="d-flex flex-column align-center justify-center no-tarjetas">
                <div class="text-h6 text-grey-darken-1 font-weight-medium text-center">
                  No hay tarjetas registradas
                </div>
              </div>
            </div>
          </v-card>

        </v-container>
      </v-container>
    </v-app>
  </template>

  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref, computed } from 'vue';
  import AppHeader from "../components/AppHeader.vue";
  
  const router = useRouter()
  const mostrarTarjetas = ref(true); // Cambiar a false para mostrar mensaje de "No hay tarjetas"

  // Genera varios tarjetas de ejemplo para mostrar scrolling
  const tarjetasEjemplo = [
    {
      banco: 'HCIB',
      tipo: 'Credito',
      numero: '**** **** **** 1234'
    },
    {
      banco: 'Bancolombia',
      tipo: 'Credito',
      numero: '**** **** **** 1234'
    },
    {
      banco: 'Scotiabank',
      tipo: 'Credito',
      numero: '**** **** **** 1234'
    },
    {
      banco: 'Davivienda',
      tipo: 'Credito',
      numero: '**** **** **** 1234'
    },
    {
      banco: 'Nequi',
      tipo: 'Debito',
      numero: '**** **** **** 1234'
    },
    {
      banco: 'Daviplata',
      tipo: 'Debito',
      numero: '**** **** **** 1234'
    }
  ];

  const tarjetas = tarjetasEjemplo;

  const hayTarjetas = computed(() => mostrarTarjetas.value && tarjetas.length > 0);

  function onVolverClick() {
    router.push('./HomePage')
  }
  function onEliminarTarjeta(id: number) {
    console.log('Eliminar tarjeta con ID:', id);
  } 
  function onAñadirTarjetaClick() {
    console.log('Añadir tarjeta');
  }
  </script>

  <style scoped>
  .monto-card {
  justify-content: center;
  align-items: center;
  margin-top: 10px;
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
  .main-bg {
    background: #eee !important;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
    padding: 16px;
  }
  
  .back-button {
    align-self: flex-start;
    margin-left: 20%;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  
  .saldo-card {
    width: 100%;
    background-color: #81C784 !important;
  }

  .tarjetas-container {
    width: 100%;
    overflow: hidden;
  }

  .tarjetas-lista {
    max-height: 350px;
    overflow-y: auto;
    padding-right: 8px;
  }

  /* Personalización de la barra de scroll */
  .tarjetas-lista::-webkit-scrollbar {
    width: 8px;
  }

  .tarjetas-lista::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .tarjetas-lista::-webkit-scrollbar-thumb {
    background: #dadada;
    border-radius: 10px;
  }

  .tarjetas-lista::-webkit-scrollbar-thumb:hover {
    background: #cccccc;
  }

  /* Para Firefox */
  .tarjetas-lista {
    scrollbar-width: thin;
    scrollbar-color: #dadada #f1f1f1;
  }

  .tarjeta-item {
    background-color: #F1F8E9 !important;
    transition: background-color 0.2s;
    border-radius: 12px;
  }

  .tarjeta-item:hover {
    background-color:rgb(227, 243, 228) !important;
  }

  .text-red {
    color:rgb(216, 99, 91) !important;
  }

  .text-green {
    color: #4CAF50 !important;
  }

  .no-tarjetas {
    min-height: 150px;
    width: 100%;
  }

  .more-btn {
    min-width: 36px !important;
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important;
  }
  </style>
