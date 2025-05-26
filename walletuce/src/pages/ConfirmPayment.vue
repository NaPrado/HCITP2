<template>
    <v-app>
      <v-container fluid class="pa-0 main-bg">
            <!-- Barra superior -->
            <AppHeader titulo="Realizar Pago" />

            <!-- Contenido principal -->
            <v-container class="d-flex flex-column align-center justify-center main-content pt-4">
              <v-btn variant="text" color="black" @click="onVolverClick" class="back-button pl-1">
                <v-icon start>mdi-arrow-left</v-icon>
                Volver
              </v-btn>
              <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">    
                  <!-- Loading state -->
                  <v-progress-circular
                    v-if="validando"
                    indeterminate
                    color="green-lighten-1"
                    class="mb-4"
                  ></v-progress-circular>

                  <template v-else-if="paymentInfo">
                    <v-card class="pa-4 mb-4 card-with-shadow-medium" color="green-lighten-1" rounded="lg">
                        <v-card-title class="text-white font-weight-bold pb-0 pt-0"><span><h2>Monto a pagar</h2></span></v-card-title>
                        <v-card-title class="text-white font-weight-bold pb-0 pt-0"><span><h3>${{ paymentInfo.amount }}</h3></span></v-card-title>
                    </v-card>

                    <!-- Descripción del pago (desplegable) -->
                    <v-expansion-panels class="mb-4">
                      <v-expansion-panel
                        class="bg-grey-lighten-3 card-with-shadow-light"
                        rounded="lg"
                      >
                        <v-expansion-panel-title class="text-grey-darken-3 font-weight-bold">
                          <template v-slot:default="{ expanded }">
                            <v-row no-gutters>
                              <v-col cols="12" class="d-flex align-center">
                                <v-icon 
                                  color="grey-darken-2" 
                                  class="mr-2"
                                  :icon="expanded ? 'mdi-text-box-minus' : 'mdi-text-box-plus'"
                                ></v-icon>
                                Descripción
                              </v-col>
                            </v-row>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-grey-darken-3 pt-2">
                          {{ paymentInfo.description || 'Sin descripción' }}
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>

                    <v-card class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow-light" rounded="lg">
                        <v-card-title class="text-black font-weight-bold pb-0 pt-0">
                          <span><h4>Desde: {{ metodo === 'balance' ? 'Saldo' : 'Tarjeta' }}</h4></span>
                        </v-card-title>
                        <v-card-title v-if="metodo === 'card'" class="text-black font-weight-bold pb-0 pt-0">
                          <span><h6>{{ cardInfo }}</h6></span>
                        </v-card-title>
                    </v-card>

                    <!-- Alerta de error -->
                    <v-alert
                      v-if="error"
                      type="error"
                      class="mb-4"
                      closable
                      @click="error = ''"
                    >
                      {{ error }}
                    </v-alert>

                    <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
                        <v-btn 
                          color="green-lighten-1" 
                          class="text-white font-weight-bold pl-6 pr-6" 
                          rounded 
                          @click="mostrarConfirmacion"
                        >
                            Pagar
                        </v-btn>
                    </v-row>
                  </template>

                  <!-- Error state -->
                  <template v-else-if="error">
                    <v-alert
                      type="error"
                      class="mb-4"
                    >
                      {{ error }}
                    </v-alert>
                    <v-btn
                      color="grey-darken-1"
                      variant="text"
                      @click="onVolverClick"
                    >
                      Volver
                    </v-btn>
                  </template>
              </v-card>
            </v-container>

            <!-- Modal de confirmación -->
            <v-dialog v-model="dialogoConfirmacion" max-width="500">
              <v-card class="bg-grey-lighten-2" rounded="lg">
                <v-card class="ma-4 card-with-shadow-medium" color="green-lighten-1" rounded="lg">
                  <v-card-title class="text-white font-weight-bold pa-4">
                    ¿Estás seguro que deseas realizar este pago?
                  </v-card-title>
                </v-card>

                <v-card-text class="pa-4">
                  <v-card class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow-light" rounded="lg">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="green-lighten-1">mdi-cash</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">Monto</v-list-item-title>
                      <v-list-item-subtitle class="text-h6">${{ paymentInfo?.amount || '0' }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-card>

                  <v-card class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow-light" rounded="lg">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="green-lighten-1">mdi-credit-card</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">Método de Pago</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ metodo === 'balance' ? 'Saldo' : `Tarjeta: ${cardInfo}` }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-card>

                  <v-expansion-panels class="mb-4">
                    <v-expansion-panel
                      class="bg-grey-lighten-3 card-with-shadow-light"
                      rounded="lg"
                    >
                      <v-expansion-panel-title class="text-grey-darken-3 font-weight-bold">
                        <template v-slot:default="{ expanded }">
                          <v-row no-gutters>
                            <v-col cols="12" class="d-flex align-center">
                              <v-icon 
                                color="grey-darken-2" 
                                class="mr-2"
                                :icon="expanded ? 'mdi-text-box-minus' : 'mdi-text-box-plus'"
                              ></v-icon>
                              Descripción
                            </v-col>
                          </v-row>
                        </template>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text class="text-grey-darken-3 pt-2">
                        {{ paymentInfo?.description || 'Sin descripción' }}
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey-darken-1"
                    variant="text"
                    class="font-weight-bold"
                    @click="dialogoConfirmacion = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green-lighten-1"
                    class="text-white font-weight-bold"
                    @click="onPagarClick"
                    :loading="procesando"
                  >
                    Confirmar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { PaymentsService } from '../api/payments.js';
import AppHeader from "../components/AppHeader.vue";
import { Api } from '../api/api.js';

const router = useRouter();
const route = useRoute();

const metodo = ref(route.query.metodo || 'balance');
const cardInfo = ref(route.query.cardInfo || '');
const cardId = ref(route.query.cardId || '');
const paymentId = ref(route.query.id || '');
const error = ref('');
const procesando = ref(false);
const validando = ref(false);
const paymentInfo = ref(null);
const dialogoConfirmacion = ref(false);

onMounted(async () => {
  if (!paymentId.value) {
    error.value = 'ID de pago no proporcionado';
    return;
  }

  await validarPago();
});

async function validarPago() {
  validando.value = true;
  error.value = '';

  try {
    if (!Api.token) {
      router.push('/login');
      return;
    }

    const response = await PaymentsService.getPaymentInfo(paymentId.value);
    paymentInfo.value = response;
  } catch (e) {
    console.error('Error al obtener información del pago:', e);
    if (e.code === 97 && e.description === 'Unauthorized.') {
      Api.token = null; // Limpiar el token inválido
      router.push('/login');
      return;
    }
    error.value = 'ID de pago no válido';
    paymentInfo.value = null;
  } finally {
    validando.value = false;
  }
}

function onVolverClick() {
  router.push("./MakePaymentPage");
}

function mostrarConfirmacion() {
  dialogoConfirmacion.value = true;
}

async function onPagarClick() {
  procesando.value = true;
  error.value = '';

  try {
    if (!paymentInfo.value || !paymentInfo.value.uuid) {
      error.value = 'Información de pago no válida';
      return;
    }

    const paymentData = {
      method: metodo.value,
      ...(metodo.value === 'card' && { cardId: cardId.value })
    };

    await PaymentsService.makePayment(paymentInfo.value.uuid, paymentData);
    dialogoConfirmacion.value = false;
    router.push({
      path: '/PaymentSuccess',
      query: { 
        amount: paymentInfo.value.amount,
        method: metodo.value
      }
    });
  } catch (e) {
    console.error('Error al procesar el pago:', e);
    if (e.code === 97 && e.description === 'Unauthorized.') {
      Api.token = null;
      router.push('/login');
    } else {
      error.value = e.description || 'Error al procesar el pago';
    }
  } finally {
    procesando.value = false;
  }
}
</script>

<style scoped>
.main-bg {
  background: #eee !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.back-button {
  align-self: flex-start;
  margin-left: 20%;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.7) !important;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
}

:deep(.v-expansion-panel-title) {
  padding: 16px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 16px 16px 16px !important;
}
</style>