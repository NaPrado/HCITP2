<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <!-- App bar -->
      <AppHeader titulo="Transferir Dinero" />

      <!-- Formulario -->
      <v-container
        class="d-flex flex-column align-center justify-center main-content"
      >
        <v-container class="dashboard-upper-card bg-grey-lighten-2">
          <v-form @submit.prevent="onSubmit" class="w-100 px-4 py-6">
            <v-text-field
              v-model="form.to"
              label="Destinatario"
              placeholder="Email o CBU"
              prepend-inner-icon="mdi-account"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.amount"
              label="Monto"
              placeholder="$0.00"
              prepend-inner-icon="mdi-currency-usd"
              required
              type="number"
            ></v-text-field>

            <v-text-field
              v-model="form.message"
              label="Mensaje (opcional)"
              placeholder="Escribe un mensaje..."
              prepend-inner-icon="mdi-message-text-outline"
            ></v-text-field>

            <v-btn
              type="submit"
              color="green-lighten-1"
              class="mt-4"
              block
              large
              elevation="2"
            >
              <v-icon left>mdi-swap-horizontal</v-icon>
              Enviar Transferencia
            </v-btn>
          </v-form>
        </v-container>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";

const router = useRouter();

const form = ref({
  to: "",
  amount: "",
  message: "",
});

function onSubmit() {
  console.log("Transfiriendo a:", form.value.to);
  console.log("Monto:", form.value.amount);
  console.log("Mensaje:", form.value.message);
  // Aquí podés agregar lógica para validar/enviar datos al backend
  router.push("/"); // o mostrar confirmación
}

function onBack() {
  router.back();
}
</script>

<style scoped>
.main-bg {
  background: #eee !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}
.dashboard-upper-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
  width: 100%;
  max-width: 700px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  background: #f9f9f9;
}
.avatar-espaciado {
  margin-left: 16px;
}
.custom-app-bar {
  min-height: 72px !important;
}
.v-btn {
  font-weight: bold;
}
</style>
