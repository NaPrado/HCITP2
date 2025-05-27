<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- Barra superior -->
      <AppHeader titulo="Generar Cobro" />

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
          <!-- Monto y Título -->
          <div class="card-container">
            <v-card
              class="pa-4 mb-4 card-with-shadow equal-width-card"
              color="green-lighten-1"
              rounded="lg"
            >
              <v-card-title class="text-white font-weight-bold"
                ><h2>Monto a cobrar</h2></v-card-title
              >
              <v-text-field
                placeholder="Ingrese un monto"
                v-model="monto"
                type="number"
                hide-details
                class="ml-2 mr-2 bg-grey-lighten-4"
                :error-messages="errorMonto"
                @input="errorMonto = ''"
              ></v-text-field>
            </v-card>

            <v-card
              class="pa-4 mb-4 card-with-shadow equal-width-card"
              color="green-lighten-1"
              rounded="lg"
            >
              <v-card-title class="text-white font-weight-bold"
                ><h2>Descripción</h2></v-card-title
              >
              <v-text-field
                placeholder="Ingrese una descripción"
                v-model="descripcion"
                hide-details
                class="ml-2 mr-2 bg-grey-lighten-4"
                :error-messages="errorDescripcion"
                @input="errorDescripcion = ''"
              ></v-text-field>
            </v-card>
          </div>

          <!-- Alerta de error general (se puede mantener o reemplazar también si se prefiere) -->
          <v-alert
            v-if="errorLocal"
            type="error"
            class="mb-4"
            closable
            @click:close="errorLocal = ''"
          >
            {{ errorLocal }}
          </v-alert>

          <!-- ID de pago generado (se puede mostrar de otra forma o con snackbar) -->
          <v-alert
            v-if="paymentId && showPaymentIdAlert"
            type="success"
            class="mb-4"
            closable
            @click:close="showPaymentIdAlert = false"
          >
            ID de pago generado: {{ paymentId }}
          </v-alert>

          <!-- Botones -->
          <v-row class="mt-4 mb-1 mr-1" justify="end">
            <v-btn
              color="green-lighten-1"
              class="text-white font-weight-bold"
              rounded
              @click="onCopiarCodigoClick"
              :loading="procesando"
              :disabled="!isValid"
            >
              Copiar Código
              <v-icon class="ml-2">mdi-content-copy</v-icon>
            </v-btn>
          </v-row>

          <!-- El AppSnackbar global se encargará de las notificaciones -->
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { PaymentsService } from "../api/payments.js";
// import { Api } from "../api/api.js"; // Api no se usa directamente aquí
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import { useSnackbarStore } from "../stores/snackbar"; // Importar el store global de snackbar

const router = useRouter();
const snackbarStore = useSnackbarStore(); // Usar el store global

const monto = ref("");
const descripcion = ref("");
const errorLocal = ref(""); // Renombrado para evitar conflicto con error de evento
const errorMonto = ref("");
const errorDescripcion = ref("");
const procesando = ref(false);
const paymentId = ref("");
const showPaymentIdAlert = ref(false); // Para controlar la visibilidad del alert de ID de pago

// Validación
const isValid = computed(() => {
  return monto.value && parseFloat(monto.value) > 0;
});

// Ya no se necesita onVolverClick si el BackButton tiene :to

async function generarCobro() {
  if (!isValid.value) {
    // Validar campos individuales también para mostrar errores en los text-fields
    if (!monto.value || parseFloat(monto.value) <= 0) {
      errorMonto.value = "Ingrese un monto válido y mayor a cero.";
    }
    // No es necesario un snackbar aquí si los errores se muestran en los campos
    return null;
  }

  errorLocal.value = "";
  errorMonto.value = "";
  errorDescripcion.value = ""; // Limpiar error de descripción si se implementa validación
  showPaymentIdAlert.value = false; // Ocultar alerta de ID de pago anterior

  try {
    const paymentData = {
      amount: parseFloat(monto.value),
      description: descripcion.value || "", // Asegurar que la descripción no sea undefined
    };

    const response = await PaymentsService.createPaymentRequest(paymentData);

    if (!response || !response.id) {
      throw new Error(
        "La respuesta del servidor no incluye un ID de pago válido."
      );
    }

    paymentId.value = response.id; // Guardar el ID
    showPaymentIdAlert.value = true; // Mostrar la alerta con el ID
    snackbarStore.showSuccess(
      `¡Cobro generado exitosamente! ID: ${response.id}`
    );

    return response; // Devolver la respuesta completa
  } catch (e: any) {
    // Tipar error como any para acceder a sus propiedades
    console.error("Error al generar cobro:", e);
    if (e.code === 97) {
      // Asumiendo que 97 es no autorizado
      snackbarStore.showError(
        e.description || "Sesión expirada. Por favor, inicie sesión nuevamente."
      );
      router.push("/login");
    } else {
      const message =
        e.description || e.message || "Error desconocido al generar el cobro.";
      errorLocal.value = message; // Mostrar error en el v-alert local
      snackbarStore.showError(message); // Y también en el snackbar global
    }
    return null;
  }
}

async function onCopiarCodigoClick() {
  // Primero, asegurar que los campos son válidos para generar el cobro si aún no se ha hecho
  if (!monto.value || parseFloat(monto.value) <= 0) {
    errorMonto.value =
      "Ingrese un monto válido para generar y copiar el código.";
    snackbarStore.showError("Por favor, ingrese un monto válido.");
    return;
  }
  if (!descripcion.value.trim()) {
    // Ejemplo de validación para descripción
    errorDescripcion.value = "La descripción es recomendable para el cobro.";
    // podrías mostrar un snackbar de advertencia o permitir continuar
  }

  procesando.value = true;
  let paymentToCopy = null;

  // Si ya tenemos un paymentId y es del monto/descripción actual, no regenerar.
  // Esta lógica puede ser más compleja si se quiere evitar regenerar innecesariamente.
  // Por simplicidad, aquí siempre intentaremos generar uno nuevo si no hay ID o lo limpiaremos.
  if (!paymentId.value) {
    // O si el monto/descripción cambió desde la última generación
    paymentToCopy = await generarCobro();
  } else {
    // Asumimos que el paymentId existente es el que queremos copiar
    paymentToCopy = { id: paymentId.value };
  }

  if (paymentToCopy && paymentToCopy.id) {
    const paymentCode = paymentToCopy.id;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(paymentCode);
        snackbarStore.showSuccess("Código de pago copiado al portapapeles.");
      } else {
        // Fallback para HTTP o contextos no seguros / navegadores antiguos
        const textArea = document.createElement("textarea");
        textArea.value = paymentCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          snackbarStore.showSuccess("Código de pago copiado (fallback).");
        } catch (err) {
          console.error("Fallback copy failed:", err);
          snackbarStore.showError(`No se pudo copiar. Código: ${paymentCode}`);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Copying to clipboard failed:", err);
      snackbarStore.showError(`Error al copiar. Código: ${paymentCode}`);
    }
  } else if (!errorLocal.value && !errorMonto.value) {
    // Solo mostrar error de copia si no hubo error de generación
    snackbarStore.showError(
      "No se pudo generar el código de pago para copiar."
    );
  }
  procesando.value = false;
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
  /* Ajustado para que no se salga tanto en pantallas pequeñas */
  margin-left: max(4%, 16px); /* Usa max para asegurar un mínimo margen */
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.7) !important;
}

.card-container {
  display: flex;
  flex-wrap: wrap; /* Permite que las tarjetas se envuelvan en pantallas pequeñas */
  width: 100%;
  gap: 16px;
  margin: 0;
}

.equal-width-card {
  width: 100%;
  flex: 1 1 calc(50% - 8px); /* Intenta que ocupen 50% del espacio, restando el gap */
  min-width: 280px; /* Un mínimo para que no se achiquen demasiado */
}

/* Ajustes para pantallas más pequeñas */
@media (max-width: 600px) {
  .card-container {
    flex-direction: column;
  }
  .equal-width-card {
    flex-basis: auto; /* Permite que ocupen el ancho completo */
  }
  .main-content {
    padding-top: 1rem; /* Menos padding arriba en móviles */
  }
  .container-card {
    padding: 16px; /* Menos padding en la tarjeta principal */
  }
}
</style>
