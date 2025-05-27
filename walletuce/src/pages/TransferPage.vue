<template>
  <v-app>
    <v-container fluid class="pa-0 main-bg">
      <AppHeader titulo="Transferir Dinero" />

      <v-container
        class="d-flex flex-column align-center justify-center main-content"
      >
        <BackButton
          to="/HomePage"
          variant="text"
          class="align-self-start ml-4 mt-4"
        />
        <v-container class="dashboard-upper-card bg-grey-lighten-2">
          <v-form @submit.prevent="onSubmit" class="w-100 px-4 py-6">
            <!-- Paso 1: Elegir destinatario -->
            <template v-if="!destinatarioSeleccionado">
              <!-- Input -->
              <v-text-field
                v-model="form.to"
                label="Destinatario"
                placeholder="Alias o CBU"
                prepend-inner-icon="mdi-account"
                required
              ></v-text-field>

              <!-- Recientes -->
              <div class="mt-4">
                <h3 class="text-subtitle-1 mb-2">Recientes</h3>
                <div class="recentes-list">
                  <template v-if="destinatariosFiltrados.length > 0">
                    <div
                      v-for="(dest, index) in destinatariosFiltrados"
                      :key="index"
                    >
                      <v-card
                        class="pa-3 mb-2 cursor-pointer"
                        variant="outlined"
                        @click="seleccionarDestinatario(dest.alias)"
                      >
                        <div class="font-weight-medium">{{ dest.nombre }}</div>
                        <div class="text-caption text-grey">
                          alias: {{ dest.alias }}
                        </div>
                      </v-card>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-grey text-caption text-center py-4">
                      No se encontraron destinatarios.
                    </div>
                  </template>
                </div>
              </div>

              <v-btn
                color="green-lighten-1"
                class="mt-4"
                block
                large
                @click="confirmarDestinatario"
              >
                <v-icon left>mdi-check</v-icon>
                Confirmar Destinatario
              </v-btn>
            </template>

            <!-- Paso 2: Ingresar monto y mensaje -->
            <template v-else>
              <div class="form-step-two">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <div class="text-subtitle-1">Enviando a:</div>
                    <div class="font-weight-bold">{{ form.to }}</div>
                  </div>
                  <v-btn
                    icon
                    class="edit-btn"
                    @click="destinatarioSeleccionado = false"
                  >
                    <v-icon color="green-darken-2">mdi-pencil</v-icon>
                  </v-btn>
                </div>

                <v-text-field
                  v-model="form.amount"
                  label="Monto"
                  placeholder="$0.00"
                  prepend-inner-icon="mdi-currency-usd"
                  required
                  type="number"
                  class="mb-3"
                ></v-text-field>

                <v-text-field
                  v-model="form.message"
                  label="Mensaje (opcional)"
                  placeholder="Escribe un mensaje..."
                  prepend-inner-icon="mdi-message-text-outline"
                  class="mb-4"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="green-darken-1"
                  block
                  size="large"
                  elevation="1"
                >
                  <v-icon left>mdi-swap-horizontal</v-icon>
                  Enviar Transferencia
                </v-btn>
              </div>
            </template>
          </v-form>
        </v-container>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";

const router = useRouter();

const form = ref({
  to: "",
  amount: "",
  message: "",
});

const destinatarioSeleccionado = ref(false);

const destinatariosRecientes = ref([
  { nombre: "Juan Perez", alias: "jp4321" },
  { nombre: "Roman Palermo", alias: "roman3324" },
  { nombre: "Ivonne Samantha Kim", alias: "ivo1234" },
]);

const destinatariosFiltrados = computed(() => {
  const query = form.value.to.toLowerCase().trim();
  if (!query) return destinatariosRecientes.value;

  return destinatariosRecientes.value.filter(
    (d) =>
      d.nombre.toLowerCase().includes(query) ||
      d.alias.toLowerCase().includes(query)
  );
});

function confirmarDestinatario() {
  if (form.value.to.trim()) {
    destinatarioSeleccionado.value = true;
  } else {
    alert("Por favor ingresá un destinatario válido");
  }
}

function seleccionarDestinatario(alias: string) {
  form.value.to = alias;
  destinatarioSeleccionado.value = true;
}

function onSubmit() {
  console.log("Transfiriendo a:", form.value.to);
  console.log("Monto:", form.value.amount);
  console.log("Mensaje:", form.value.message);

  // Simulamos una espera breve antes de redirigir
  setTimeout(() => {
    router.push("/");
  }, 300);
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
.v-btn {
  font-weight: bold;
}
.cursor-pointer {
  cursor: pointer;
  transition: background 0.2s ease;
}
.cursor-pointer:hover {
  background-color: #e0f2f1;
}
.recentes-list {
  max-height: 250px;
  overflow-y: auto;
  transition: all 0.2s ease;
}
.form-step-two {
  background-color: transparent; /* Sin fondo negro */
  padding: 16px 0;
}
.edit-btn {
  transition: background-color 0.2s ease;
  border-radius: 50%;
  padding: 8px;
  background-color: #f1f1f1; /* Gris muy claro, casi blanco */
}

.edit-btn:hover {
  background-color: #e0e0e0; /* Un poquito más oscuro para hover */
}
</style>
