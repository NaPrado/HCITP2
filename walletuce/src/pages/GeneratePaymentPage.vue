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

          <!-- ID de pago generado -->
          <v-alert v-if="paymentId" type="success" class="mb-4">
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

          <!-- Snackbar para notificaciones -->
          <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            :timeout="3000"
            location="top"
          >
            {{ snackbarText }}
            <template v-slot:actions>
              <v-btn color="white" variant="text" @click="snackbar = false">
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { PaymentsService } from "../api/payments.js";
import { Api } from "../api/api.js";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";

const router = useRouter();

const monto = ref("");
const descripcion = ref("");
const error = ref("");
const errorMonto = ref("");
const errorDescripcion = ref("");
const procesando = ref(false);
const paymentId = ref("");

// Snackbar
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

// Validación
const isValid = computed(() => {
  return monto.value && parseFloat(monto.value) > 0;
});

function onVolverClick() {
  router.push("./HomePage");
}

async function generarCobro() {
  if (!isValid.value) {
    error.value = "Por favor ingrese un monto válido";
    return null;
  }

  error.value = "";
  errorMonto.value = "";
  errorDescripcion.value = "";

  try {
    const paymentData = {
      amount: parseFloat(monto.value),
      description: descripcion.value || "",
    };

    console.log("Sending payment data:", paymentData);
    const response = await PaymentsService.createPaymentRequest(paymentData);
    console.log("Payment response:", response);

    if (!response || !response.id) {
      throw new Error("La respuesta del servidor no incluye un ID de pago");
    }

    // Mostrar el ID generado
    snackbarColor.value = "success";
    snackbarText.value = `Pago generado con ID: ${response.id}`;
    snackbar.value = true;

    return response;
  } catch (e) {
    console.error("Error al generar cobro:", e);
    if (e.code === 97 && e.description === "Unauthorized.") {
      router.push("/login");
    } else {
      error.value = e.description || "Error al generar el cobro";
      snackbarColor.value = "error";
      snackbarText.value = error.value;
      snackbar.value = true;
    }
    return null;
  }
}

async function onCopiarCodigoClick() {
  procesando.value = true;
  try {
    const payment = await generarCobro();
    if (payment && payment.id) {
      const paymentCode = payment.id;
      console.log("Code to copy:", paymentCode);

      // Método 1: API moderna
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(paymentCode);
          console.log("Copied using modern API");
          snackbarColor.value = "success";
          snackbarText.value = "Código de pago copiado al portapapeles";
          snackbar.value = true;
          return;
        } catch (e) {
          console.error("Modern clipboard API failed:", e);
        }
      }

      // Método 2: execCommand
      try {
        const textArea = document.createElement("textarea");
        textArea.value = paymentCode;
        textArea.style.position = "fixed";
        textArea.style.left = "0";
        textArea.style.top = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          console.log("Copied using execCommand");
          snackbarColor.value = "success";
          snackbarText.value = "Código de pago copiado al portapapeles";
        } else {
          throw new Error("execCommand copy failed");
        }
      } catch (e) {
        console.error("Fallback clipboard failed:", e);
        // Método 3: Mostrar el código para copiar manualmente
        snackbarColor.value = "warning";
        snackbarText.value = `Código de pago: ${paymentCode}`;
      }
      snackbar.value = true;
    } else {
      throw new Error("No payment ID received");
    }
  } catch (e) {
    console.error("Error in onCopiarCodigoClick:", e);
    snackbarColor.value = "error";
    snackbarText.value = "Error al generar el código";
    snackbar.value = true;
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
