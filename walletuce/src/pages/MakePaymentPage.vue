<template>
    <v-app>
      <v-container fluid class="pa-0 main-bg">
        <!-- Barra superior -->
        <AppHeader titulo="Realizar Pago" />
  
        <!-- Contenido principal -->
        <v-container class="d-flex flex-column align-center justify-center main-content pt-10">
          <v-btn variant="text" color="black" @click="onVolverClick" class="back-button pl-1">
              <v-icon start>mdi-arrow-left</v-icon>
              Volver
          </v-btn>
          <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
            
            <!-- Código de pago -->
            <v-card class="pa-4 mb-4 card-with-shadow" color="green-lighten-1" rounded="lg">
              <v-card-title class="text-white font-weight-bold"><h2>Introducir identificador de pago</h2></v-card-title>
              <div class="d-flex align-center">
                <v-text-field 
                  v-model="identificador" 
                  placeholder="ID de pago" 
                  hide-details 
                  class="ml-2 mr-2 bg-grey-lighten-4"
                ></v-text-field>
              </div>
            </v-card>
  
            <!-- Selección de origen -->
            <v-card class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow" rounded="lg">
              <v-card-title class="text-grey-darken-3 font-weight-bold text-subtitle-1 mb-1">
                Seleccione el método de pago
              </v-card-title>
              <v-radio-group v-model="origen" class="ml-2 mb-n2">
                <v-radio
                  label="Saldo"
                  value="balance"
                  color="green-lighten-1"
                />
                <v-radio
                  label="Tarjeta"
                  value="card"
                  color="green-lighten-1"
                  class="mb-n2"
                />
              </v-radio-group>
  
              <!-- Selector de tarjeta si se elige tarjeta como método -->
              <v-select
                v-if="origen === 'card'"
                v-model="selectedCard"
                :items="cards"
                item-title="displayName"
                item-value="id"
                label="Seleccione una tarjeta"
                class="mt-n2 compact-select"
                :loading="loadingCards"
                :disabled="loadingCards"
                :error-messages="errorTarjeta"
                density="compact"
                variant="outlined"
                hide-details
              ></v-select>
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
  
            <!-- Botones -->
            <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
              <v-btn 
                color="green-lighten-1" 
                class="text-white font-weight-bold" 
                rounded 
                @click="irAConfirmacion"
                :disabled="!isValid"
              >
                Continuar
              </v-btn>
            </v-row>
          </v-card>
        </v-container>
      </v-container>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref, computed, watch } from 'vue';
  import { CardsService } from '../api/cards.js';
  import { Api } from '../api/api.js';
  import AppHeader from "../components/AppHeader.vue";
  
  const router = useRouter()
  
  const identificador = ref("");
  const origen = ref("balance");
  const selectedCard = ref(null);
  const cards = ref([]);
  const loadingCards = ref(false);
  const error = ref("");
  const errorTarjeta = ref("");
  
  // Validación
  const isValid = computed(() => {
    if (!identificador.value) return false;
    if (origen.value === 'card' && !selectedCard.value) return false;
    return true;
  });
  
  function getSelectedCardDisplay() {
    if (!selectedCard.value) return '';
    const card = cards.value.find(c => c.id === selectedCard.value);
    return card ? card.displayName : '';
  }
  
  // Cargar tarjetas cuando se selecciona ese método de pago
  watch(origen, async (newValue) => {
    if (newValue === 'card') {
      await loadCards();
    }
  });
  
  async function loadCards() {
    if (!Api.token) {
      router.push('/login');
      return;
    }
  
    loadingCards.value = true;
    try {
      const response = await CardsService.getAll();
      if (Array.isArray(response)) {
        cards.value = response.map(card => ({
          displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
          id: card.id
        }));
      } else if (response && Array.isArray(response.cards)) {
        cards.value = response.cards.map(card => ({
          displayName: `${card.fullName} - **** ${card.number.slice(-4)}`,
          id: card.id
        }));
      }
    } catch (e) {
      console.error('Error al cargar tarjetas:', e);
      error.value = 'Error al cargar las tarjetas';
    } finally {
      loadingCards.value = false;
    }
  }
  
  function onVolverClick() {
    router.push('./HomePage')
  }
  
  function irAConfirmacion() {
    if (!isValid.value) return;

    const selectedCardInfo = origen.value === 'card' ? getSelectedCardDisplay() : null;
    
    router.push({
      path: '/ConfirmPayment',
      query: {
        id: identificador.value,
        metodo: origen.value,
        cardId: selectedCard.value,
        cardInfo: selectedCardInfo
      }
    });
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
  
  .back-button {
    align-self: flex-start;
    margin-left: 20%;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  
  .compact-select :deep(.v-field__input) {
    min-height: 32px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  
  .compact-select :deep(.v-field) {
    font-size: 0.875rem;
  }
  </style>
  