<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg overflow-y-auto">
      <!-- Barra superior -->
      <AppHeader titulo="Movimientos" />

      <!-- Contenido principal -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content pt-16"
      >
        <BackButton
          to="/HomePage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />

        <!-- Filtros -->
        <v-card class="mb-4 pa-4 container-card" rounded="lg">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.direction"
                :items="[
                  { title: 'Más recientes primero', value: 'DESC' },
                  { title: 'Más antiguos primero', value: 'ASC' },
                ]"
                label="Ordenar por fecha"
                density="comfortable"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.range"
                :items="[
                  { title: 'Todos', value: null },
                  { title: 'Últimos 3 días', value: 'THREE_DAYS' },
                  { title: 'Última semana', value: 'LAST_WEEK' },
                  { title: 'Último mes', value: 'LAST_MONTH' },
                ]"
                label="Período"
                density="comfortable"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.method"
                :items="[
                  { title: 'Todos', value: null },
                  { title: 'Cuenta', value: 'ACCOUNT' },
                  { title: 'Tarjeta', value: 'CARD' },
                ]"
                label="Método"
                density="comfortable"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.role"
                :items="[
                  { title: 'Todos', value: null },
                  { title: 'Pagos realizados', value: 'PAYER' },
                  { title: 'Pagos recibidos', value: 'RECEIVER' },
                ]"
                label="Tipo"
                density="comfortable"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="pa-4 container-card bg-grey-lighten-2" rounded="lg">
          <!-- Lista de movimientos scrolleable -->
          <div class="movements-container">
            <div v-if="movements.length > 0" class="movements-list">
              <v-card
                v-for="movement in movements"
                :key="movement.id"
                class="mb-3 pa-3 rounded-lg movimiento-card"
                flat
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-subtitle-1 font-weight-bold text-black">
                      {{ movement.description || "Sin descripción" }}
                    </div>
                    <div class="text-body-2 text-grey">
                      {{ formatDate(movement.date) }}
                    </div>
                    <div class="text-caption text-grey-darken-1">
                      {{ movement.method === "ACCOUNT" ? "Cuenta" : "Tarjeta" }}
                      <v-chip
                        size="x-small"
                        :color="
                          movement.status === 'PENDING' ? 'warning' : 'success'
                        "
                        class="ml-2"
                      >
                        {{
                          movement.status === "PENDING"
                            ? "Pendiente"
                            : "Confirmado"
                        }}
                      </v-chip>
                    </div>
                  </div>
                  <div
                    class="text-subtitle-1 font-weight-bold"
                    :class="getAmountClass(movement)"
                  >
                    {{ formatAmount(movement) }}
                  </div>
                </div>
              </v-card>

              <!-- Paginación -->
              <div class="text-center mt-4">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="5"
                  rounded="circle"
                ></v-pagination>
              </div>
            </div>

            <!-- Loading state -->
            <div
              v-else-if="loading"
              class="d-flex justify-center align-center"
              style="height: 200px"
            >
              <v-progress-circular
                indeterminate
                color="green"
              ></v-progress-circular>
            </div>

            <!-- Mensaje cuando no hay movimientos -->
            <div
              v-else
              class="d-flex flex-column align-center justify-center no-movements"
            >
              <div
                class="text-h6 text-grey-darken-1 font-weight-medium text-center"
              >
                No hay registro de<br />movimientos recientes
              </div>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { PaymentsService, type PaymentQueryParams } from "../api/payments.js";
import { useSnackbarStore } from "../stores/snackbar";

interface Movement {
  id: string;
  amount: number;
  description: string;
  date: string;
  role: "PAYER" | "RECEIVER";
  method: "ACCOUNT" | "CARD" | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  relatedAccount?: string;
}

const router = useRouter();
const snackbarStore = useSnackbarStore();
const loading = ref(false);
const movements = ref<Movement[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 10;

const filters = ref<{
  direction: "ASC" | "DESC";
  pending: boolean | null;
  method: "ACCOUNT" | "CARD" | null;
  range: "THREE_DAYS" | "LAST_WEEK" | "LAST_MONTH" | null;
  role: "PAYER" | "RECEIVER" | null;
  cardId: number | null;
}>({
  direction: "DESC",
  pending: null,
  method: null,
  range: null,
  role: null,
  cardId: null,
});

async function loadMovements() {
  loading.value = true;
  try {
    const queryParams: PaymentQueryParams = {
      page: currentPage.value,
      direction: filters.value.direction,
    };

    if (filters.value.method) {
      queryParams.method = filters.value.method;
    }
    if (filters.value.range) {
      queryParams.range = filters.value.range;
    }
    if (filters.value.role) {
      queryParams.role = filters.value.role;
    }
    if (filters.value.pending !== null) {
      queryParams.pending = filters.value.pending;
    }
    if (filters.value.cardId !== null) {
      queryParams.cardId = filters.value.cardId;
    }

    const response = await PaymentsService.getPayments(queryParams);

    if (response && Array.isArray(response.results)) {
      movements.value = response.results as Movement[];
      totalPages.value =
        response.paging?.totalPages ||
        (response.results.length > 0
          ? Math.ceil(response.results.length / itemsPerPage)
          : 1);
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value;
      }
      if (totalPages.value === 0 && response.results.length === 0)
        totalPages.value = 1;
      if (response.results.length === 0) currentPage.value = 1;
    } else {
      movements.value = [];
      totalPages.value = 1;
      currentPage.value = 1;
    }
  } catch (error: any) {
    console.error("Error loading movements:", error);
    snackbarStore.showError(
      error?.description || "Error al cargar los movimientos"
    );
    movements.value = [];
    totalPages.value = 1;
    currentPage.value = 1;
    if (error.code === 97) router.push("/login");
  } finally {
    loading.value = false;
  }
}

watch(
  [() => ({ ...filters.value }), () => currentPage.value],
  ([newFilters, newPage], [oldFilters, oldPage]) => {
    const filtersActuallyChanged =
      JSON.stringify(newFilters) !== JSON.stringify(oldFilters);

    if (filtersActuallyChanged) {
      if (currentPage.value !== 1) {
        currentPage.value = 1;
      } else {
        loadMovements();
      }
    } else if (newPage !== oldPage) {
      loadMovements();
    }
  },
  { deep: true }
);

onMounted(() => {
  loadMovements();
});

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha no disponible";
    }
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha no disponible";
  }
}

function getAmountClass(movement: Movement) {
  if (movement.role === "PAYER") return "text-red";
  return "text-green";
}

function formatAmount(movement: Movement) {
  const amount = movement.role === "PAYER" ? -movement.amount : movement.amount;
  return formatCurrency(amount);
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
  height: 100%;
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
  background-color: #81c784 !important;
}

.movements-container {
  width: 100%;
  overflow: hidden;
}

.movements-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Personalización de la barra de scroll */
.movements-list::-webkit-scrollbar {
  width: 8px;
}

.movements-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.movements-list::-webkit-scrollbar-thumb {
  background: #dadada;
  border-radius: 10px;
}

.movements-list::-webkit-scrollbar-thumb:hover {
  background: #cccccc;
}

/* Para Firefox */
.movements-list {
  scrollbar-width: thin;
  scrollbar-color: #dadada #f1f1f1;
}

.movimiento-card {
  background-color: #f1f8e9 !important;
  transition: background-color 0.2s;
  border-radius: 12px;
}

.movimiento-card:hover {
  background-color: rgb(237, 237, 237) !important;
}

.text-red {
  color: rgb(216, 99, 91) !important;
}

.text-green {
  color: #4caf50 !important;
}

.no-movements {
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
