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
              <v-progress-circular
                v-if="cargando"
                indeterminate
                color="green-lighten-1"
                class="mt-4"
              ></v-progress-circular>
              
              <div v-else-if="error" class="d-flex flex-column align-center justify-center no-tarjetas">
                <div class="text-h6 text-grey-darken-1 font-weight-medium text-center">
                  {{ error }}
                </div>
              </div>

              <div v-else-if="hayTarjetas" class="tarjetas-lista">
                <v-card 
                  v-for="(tarjeta, index) in tarjetas" 
                  :key="tarjeta.id"
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
                @click="mostrarDialogoAgregar = true"
              >
                <v-icon start class="mr-1">mdi-plus</v-icon>
                Añadir Tarjeta
              </v-btn>
            </v-row>

          </v-card>

          <!-- Modal para agregar tarjeta -->
          <v-dialog v-model="mostrarDialogoAgregar" max-width="500" overlay-color="rgba(0, 0, 0, 0.7)">
            <v-card class="pa-4 rounded-lg" color="white">
              <v-card-title class="text-h6 font-weight-bold ml-2 mt-4">
                Agregar Nueva Tarjeta
              </v-card-title>
              <v-card-text>
                <v-alert
                  v-if="errorAgregar"
                  type="error"
                  class="mb-4"
                  closable
                  @click="errorAgregar = ''"
                >
                  {{ errorAgregar }}
                </v-alert>
                <v-form @submit.prevent="agregarTarjeta" ref="form">
                  <v-text-field
                    v-model="nuevaTarjeta.fullName"
                    label="Nombre en la tarjeta"
                    required
                    :rules="[v => !!v || 'El nombre es requerido']"
                  ></v-text-field>

                  <v-text-field
                    v-model="nuevaTarjeta.number"
                    label="Número de tarjeta"
                    required
                    :rules="[
                      v => !!v || 'El número es requerido',
                      v => cleanCardNumber(v).length === 16 || 'Debe tener 16 dígitos',
                      v => /^[\d\s]+$/.test(v) || 'Solo se permiten números'
                    ]"
                    maxlength="19"
                    placeholder="4895 7487 6869 5219"
                  ></v-text-field>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="nuevaTarjeta.cvv"
                        label="CVV"
                        required
                        :rules="[
                          v => !!v || 'El CVV es requerido',
                          v => /^\d{3,4}$/.test(v) || 'CVV inválido'
                        ]"
                        maxlength="4"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="nuevaTarjeta.expirationDate"
                        label="MM/YY"
                        required
                        :rules="[
                          v => !!v || 'La fecha es requerida',
                          v => /^\d{2}\/\d{2}$/.test(v) || 'Formato MM/YY'
                        ]"
                        placeholder="MM/YY"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-select
                    v-model="nuevaTarjeta.type"
                    :items="[
                      { value: 'CREDIT', text: 'Crédito' },
                      { value: 'DEBIT', text: 'Débito' }
                    ]"
                    item-title="text"
                    item-value="value"
                    label="Tipo de tarjeta"
                    required
                    :rules="[v => !!v || 'Seleccione un tipo']"
                  ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions class="mt-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" color="grey" @click="mostrarDialogoAgregar = false">
                  Cancelar
                </v-btn>
                <v-btn 
                  color="green-lighten-1" 
                  class="text-white font-weight-bold" 
                  @click="agregarTarjeta"
                  :loading="guardando"
                >
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
  import { ref, computed, onMounted, watch } from 'vue';
  import AppHeader from "../components/AppHeader.vue";
  import { CardApi, Card } from "../api/card.js";
  import { Api } from "../api/api.js";
  
  const router = useRouter()
  const tarjetaSeleccionada = ref<number | null>(null);
  const mostrarDialogoEliminar = ref(false);
  const mostrarConfirmacionFinal = ref(false);
  const mostrarDialogoAgregar = ref(false);
  const tarjetas = ref([]);
  const cargando = ref(true);
  const guardando = ref(false);
  const form = ref(null);
  const error = ref('');
  const errorAgregar = ref('');

  const nuevaTarjeta = ref({
    fullName: '',
    number: '',
    cvv: '',
    expirationDate: '',
    type: 'CREDIT'
  });

  const bancos = [
    { value: 'HCIB', text: 'HCIB' },
    { value: 'Santander', text: 'Santander' },
    { value: 'BBVA', text: 'BBVA' },
    { value: 'Galicia', text: 'Galicia' },
    { value: 'ICBC', text: 'ICBC' }
  ];

  const hayTarjetas = computed(() => tarjetas.value.length > 0);
  const tarjetaSeleccionadaData = computed(() =>
  tarjetaSeleccionada.value !== null ? tarjetas.value[tarjetaSeleccionada.value] : null
);

  onMounted(async () => {
    if (!Api.token) {
      router.push('/login');
      return;
    }

    try {
      const cards = await CardApi.getAll();
      if (Array.isArray(cards)) {
        tarjetas.value = cards.map(card => ({
          banco: card.fullName,
          tipo: card.type === 'CREDIT' ? 'Crédito' : 'Débito',
          numero: `**** **** **** ${card.number.slice(-4)}`,
          id: card.id
        }));
      } else {
        tarjetas.value = [];
      }
    } catch (e) {
      console.error('Error al cargar tarjetas:', e);
      if (e.code === 97 && e.description === 'Unauthorized.') {
        router.push('/login');
      } else {
        tarjetas.value = [];
      }
    } finally {
      cargando.value = false;
    }
  });

  function onVolverClick() {
    router.back()
  }

  // Función para formatear el número de tarjeta
  function formatCardNumber(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }

  // Función para limpiar el número de tarjeta
  function cleanCardNumber(value: string): string {
    return value.replace(/\s/g, '');
  }

  // Watch para formatear el número mientras se escribe
  watch(() => nuevaTarjeta.value.number, (newValue) => {
    if (newValue) {
      const cleaned = cleanCardNumber(newValue);
      if (cleaned !== newValue) {
        nuevaTarjeta.value.number = formatCardNumber(cleaned);
      }
    }
  });

  async function agregarTarjeta() {
    if (!form.value?.validate()) return;
    errorAgregar.value = '';

    guardando.value = true;
    try {
      if (!Api.token) {
        router.push('/login');
        return;
      }

      const cleanedNumber = cleanCardNumber(nuevaTarjeta.value.number);
      const nuevaCard = new Card(
        null,
        nuevaTarjeta.value.fullName,
        nuevaTarjeta.value.cvv,
        cleanedNumber,
        nuevaTarjeta.value.expirationDate,
        nuevaTarjeta.value.type
      );

      const cardCreada = await CardApi.add(nuevaCard);
      
      tarjetas.value.push({
        banco: cardCreada.fullName,
        tipo: cardCreada.type === 'CREDIT' ? 'Crédito' : 'Débito',
        numero: `**** **** **** ${cardCreada.number.slice(-4)}`,
        id: cardCreada.id
      });

      nuevaTarjeta.value = {
        fullName: '',
        number: '',
        cvv: '',
        expirationDate: '',
        type: 'CREDIT'
      };
      mostrarDialogoAgregar.value = false;
    } catch (e) {
      console.error('Error al agregar tarjeta:', e);
      if (e.code === 97 && e.description === 'Unauthorized.') {
        router.push('/login');
      } else {
        errorAgregar.value = e.description || 'Error al agregar la tarjeta';
      }
    } finally {
      guardando.value = false;
    }
  }

  function seleccionarTarjeta(index: number) {
    tarjetaSeleccionada.value = index === tarjetaSeleccionada.value ? null : index;
    if (tarjetaSeleccionada.value !== null) {
      mostrarDialogoEliminar.value = true;
    }
  }

  async function confirmarEliminarTarjeta() {
    if (tarjetaSeleccionada.value !== null) {
      const tarjeta = tarjetas.value[tarjetaSeleccionada.value];
      try {
        await CardApi.remove(tarjeta.id);
        tarjetas.value.splice(tarjetaSeleccionada.value, 1);
        tarjetaSeleccionada.value = null;
        mostrarDialogoEliminar.value = false;
        mostrarConfirmacionFinal.value = false;
      } catch (e) {
        console.error('Error al eliminar tarjeta:', e);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
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
