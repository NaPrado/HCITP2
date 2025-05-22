<template>
    <v-app>
      <v-container fluid class="pa-0 main-bg">
        <!-- Barra superior -->
        <AppHeader titulo="Tarjetas Registradas" />
  
        <!-- Contenido principal -->
        <v-container class="d-flex flex-column align-center justify-center main-content pt-16">
          <v-btn variant="text" color="black" @click="onVolverClick" class="back-button pl-1">
              <v-icon start>mdi-arrow-left</v-icon>
              Volver
          </v-btn>
          <v-card class="pa-4 container-card bg-grey-lighten-2" rounded="lg">

            <!-- Lista de tarjetas scrolleable -->
            <div class="tarjetas-container">
              <div v-if="hayTarjetas" class="tarjetas-lista">
                <v-card 
                  v-for="(tarjeta, index) in tarjetas" 
                  :key="index"
                  class="mb-3 pa-3 rounded-lg tarjeta-item"
                  :class="{ seleccionada: tarjetaSeleccionada === index }"
                  flat
                  @click="seleccionarTarjeta(index)"
                >
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-subtitle-1 font-weight-bold text-black">{{ tarjeta.banco }}</div>
                      <div class="text-body-2 text-black">{{ tarjeta.tipo }}</div>
                    </div>
                    <div class="text-green text-subtitle-1 font-weight-bold">
                      {{ tarjeta.numero }}
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
            <v-row class="mt-4 mb-1 mr-1 ma-1" justify="end" align="center">
              <v-btn
                color="green-lighten-1"
                class="text-white font-weight-bold mr-2"
                rounded
                @click="onAñadirTarjetaClick"
              >
                <v-icon start class="mr-1">mdi-plus</v-icon>
                Añadir Tarjeta
              </v-btn>
            </v-row>

          </v-card>

          <v-dialog v-model="mostrarDialogoEliminar" max-width="450" overlay-color="rgba(0, 0, 0, 0.7)">
            <v-card class="pa-4 rounded-lg" color="white">
              <v-card-title class="text-h6 font-weight-bold ml-2 mt-4">
                Detalles de tarjeta
              </v-card-title>
              <v-card-text class="text-body-1">
                Has seleccionado esta tarjeta:
                <v-card class="mt-4 pa-3 tarjeta-item">
                  <div class="text-subtitle-1 font-weight-bold text-black">{{ tarjetaSeleccionadaData?.banco }}</div>
                  <div class="text-body-2 text-black">{{ tarjetaSeleccionadaData?.tipo }}</div>
                  <div class="text-green text-subtitle-1 font-weight-bold">{{ tarjetaSeleccionadaData?.numero }}</div>
                </v-card>
              </v-card-text>
              <v-card-actions class="mt-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" color="grey" @click="mostrarDialogoEliminar = false">Cerrar</v-btn>
                <v-btn color="green-lighten-1" class="text-white font-weight-bold" @click="mostrarConfirmacionFinal = true">
                  Eliminar Tarjeta
                </v-btn>

              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="mostrarConfirmacionFinal" max-width="400" overlay-color="rgba(0, 0, 0, 0.7)">
            <v-card class="pa-4 rounded-lg" color="white">
              <v-card-title class="text-h6 font-weight-bold ml-2 mt-4">
                ¿Estás seguro?
              </v-card-title>
              <v-card-text class="text-body-1">
                Esta acción eliminará la tarjeta de forma permanente.
                <br><strong>{{ tarjetaSeleccionadaData?.banco }} - {{ tarjetaSeleccionadaData?.numero }}</strong>
              </v-card-text>
              <v-card-actions class="mt-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" color="grey" @click="mostrarConfirmacionFinal = false">
                  Cancelar
                </v-btn>
                <v-btn color="green-lighten-1" class="text-white font-weight-bold" @click="confirmarEliminarTarjeta">
                  Confirmar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


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
  const tarjetaSeleccionada = ref<number | null>(null);
  const mostrarDialogoEliminar = ref(false);
  const mostrarConfirmacionFinal = ref(false);


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

  const tarjetas = ref([...tarjetasEjemplo]); // reactividad

  const hayTarjetas = computed(() => mostrarTarjetas.value && tarjetas.value.length > 0);
  const tarjetaSeleccionadaData = computed(() =>
  tarjetaSeleccionada.value !== null ? tarjetas.value[tarjetaSeleccionada.value] : null
);


  function onVolverClick() {
    router.push('./HomePage')
  }
  function onAñadirTarjetaClick() {
    console.log('Añadir tarjeta');
  }
  function seleccionarTarjeta(index: number) {
  tarjetaSeleccionada.value = index === tarjetaSeleccionada.value ? null : index;
  if (tarjetaSeleccionada.value !== null) {
    mostrarDialogoEliminar.value = true;
  }
}

function confirmarEliminarTarjeta() {
  if (tarjetaSeleccionada.value !== null) {
    const eliminada = tarjetas.value.splice(tarjetaSeleccionada.value, 1);
    console.log('Eliminada:', eliminada[0]);
    tarjetaSeleccionada.value = null;
    mostrarDialogoEliminar.value = false;
    mostrarConfirmacionFinal.value = false;
  }
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
    margin-top: 20px;
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
    background-color:rgb(237, 237, 237) !important;
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
  .tarjeta-item.seleccionada {
  border: 2px solid #4CAF50 !important;
  background-color: rgb(237, 237, 237) !important;
}
.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.2) !important;
}


  </style>
