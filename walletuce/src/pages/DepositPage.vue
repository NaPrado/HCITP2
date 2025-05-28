<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Ingresar Dinero" />
      <!-- Contenido principal -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content pt-10"
      >
        <BackButton
          to="/HomePage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />
        <v-card class="pa-6 container-card bg-grey-lighten-2" rounded="lg">
          <!-- Monto -->
          <v-card
            class="pa-4 mb-4 card-with-shadow"
            color="green-lighten-1"
            rounded="lg"
          >
            <v-card-title class="text-white font-weight-bold"
              ><h2>Monto</h2></v-card-title
            >
            <v-text-field
              v-model="monto"
              type="number"
              hide-details
              class="ml-2 mr-2 bg-grey-lighten-4"
              placeholder="Ingrese un monto"
              min="0"
            />
          </v-card>

          <!-- Selección de origen -->
          <v-card
            class="pa-4 mb-4 bg-grey-lighten-3 card-with-shadow"
            rounded="lg"
          >
            <v-card-title
              class="text-grey-darken-3 font-weight-bold text-subtitle-1"
            >
              Seleccione de donde realiza el ingreso.
            </v-card-title>
            <v-radio-group v-model="origen" class="ml-2">
              <v-radio
                label="Cuenta Bancaria"
                value="cuenta"
                color="green-lighten-1"
              />
              <v-radio
                label="Tarjeta"
                value="tarjeta"
                color="green-lighten-1"
              />
            </v-radio-group>
            <!-- Selector de tarjeta usando el componente CardSelector -->
            <CardSelector
              v-if="origen === 'tarjeta'"
              v-model="selectedCard"
              @update:selectedCard="onSelectedCardChange"
              label="Seleccione una tarjeta"
              class="mt-2"
            />

            <v-text-field
              v-if="origen === 'cuenta'"
              v-model="cvuCuenta"
              label="Ingrese el CBU/CVU"
              placeholder="0000000000000000000000"
              class="mt-2 compact-select"
              variant="outlined"
              hide-details="auto"
              density="compact"
              maxlength="22"
              counter
              :rules="[
                (v) => !!v || 'El CBU/CVU es requerido',
                (v) =>
                  /^\d{22}$/.test(v) || 'Debe contener 22 dígitos numéricos',
              ]"
            />
          </v-card>

          <!-- Botones -->
          <v-row class="mt-4 mb-1 mr-1" justify="end" align="center">
            <v-btn
              color="green-lighten-1"
              class="text-white font-weight-bold"
              rounded
              @click="onCrearClick"
            >
              Seguir
            </v-btn>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"; // onMounted ya no es necesario aquí
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
// import { CardApi } from "../api/card.js"; // Ya no es necesario aquí
// import { Api } from "../api/api.js"; // Ya no es necesario aquí si CardSelector lo maneja
import { useSnackbarStore } from "../stores/snackbar";
import CardSelector from "../components/CardSelector.vue"; // Importar el componente

const router = useRouter();
const snackbarStore = useSnackbarStore();

const monto = ref("");
const origen = ref<"cuenta" | "tarjeta">("tarjeta"); // o el valor que prefieras por defecto
const selectedCard = ref<string | null>(null); // ID de la tarjeta seleccionada
const cvuCuenta = ref("");

// Ya no se necesita onMounted para cargar tarjetas aquí, CardSelector lo hace.
// onMounted(async () => {
//   if (origen.value === "tarjeta") {
//     // await loadCards(); // Eliminado
//   }
// });
const selectedCardDisplay = ref<string | null>(null);

watch(origen, (newValue) => {
  if (newValue === "tarjeta") {
    // No es necesario llamar a loadCards aquí, CardSelector se carga solo.
  } else {
    selectedCard.value = null; // Limpiar tarjeta seleccionada si se cambia de origen
    // errorTarjeta.value = ""; // CardSelector maneja su propio error
  }
});

// type CardFromApi = { ... }; // Eliminado
// type CardApiResponse = ...; // Eliminado
// async function loadCards() { ... } // Eliminada toda la función loadCards
function onSelectedCardChange(card: { id: string; displayName: string } | null) {
  selectedCardDisplay.value = card?.displayName || null;
}

function onCrearClick() {
  const montoNumero = parseFloat(monto.value);
  if (!monto.value || isNaN(montoNumero) || montoNumero <= 0) {
    snackbarStore.showError("Por favor, ingrese un monto válido mayor a 0");
    return;
  }

  if (origen.value === "tarjeta") {
    if (!selectedCard.value) {
      snackbarStore.showError("Seleccioná una tarjeta");
      // CardSelector debería mostrar su propio error si es un problema de carga.
      // Este error es si el usuario simplemente no seleccionó una.
      return;
    }
    // errorTarjeta.value = ""; // CardSelector maneja su propio error
  }

  if (origen.value === "cuenta") {
    if (!cvuCuenta.value || !/^\d{22}$/.test(cvuCuenta.value)) {
      snackbarStore.showError(
        "Ingresá un CBU/CVU válido (debe contener 22 dígitos numéricos)"
      );
      return;
    }
  }

  // Para obtener el displayName de la tarjeta seleccionada, necesitaríamos que CardSelector
  // emita más información o que la página de confirmación obtenga los detalles.
  // Por ahora, no pasaremos cardDisplay a la query si no lo tenemos fácilmente.
  // Si CardSelector emite el objeto completo, podríamos obtenerlo aquí.

  router.push({
    path: "./ConfirmDeposit",
    query: {
      monto: monto.value,
      origen: origen.value,
      cardId: selectedCard.value || undefined,
      cardDisplay: selectedCardDisplay.value || undefined,
      cvu: origen.value === "cuenta" ? cvuCuenta.value : undefined,
    },
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
/* Los estilos de compact-select pueden ser eliminados si CardSelector ya los tiene o si se aplican globalmente */
/* .compact-select .v-input__control { ... } */
.v-text-field {
  margin-bottom: 4px;
}
</style>
