<template>
  <LettucePatternBackground>
    <div class="register-box">
      <div class="logo-wrapper" @click="goToLandingPage">
        <img src="@/assets/letucce.svg" alt="Letucce Logo" class="logo" />
      </div>
      <h2>Restablecer contraseña</h2>
      <form
        v-if="step === 1"
        @submit.prevent="handleRequestCode"
        class="form-grid"
      >
        <div class="input-single">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="tu@correo.com"
            required
            :disabled="loading"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Enviando..." : "Enviar código" }}
        </button>
      </form>
      <form v-else @submit.prevent="handleChangePassword" class="form-grid">
        <div class="input-single">
          <label for="code">Código de recuperación</label>
          <input
            id="code"
            type="text"
            v-model="code"
            placeholder="Código recibido por email"
            required
            :disabled="loading"
          />
        </div>
        <div class="input-pair">
          <div>
            <label for="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              v-model="newPassword"
              placeholder="********"
              required
              :disabled="loading"
            />
          </div>
          <div>
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="********"
              required
              :disabled="loading"
            />
          </div>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Cambiando..." : "Cambiar contraseña" }}
        </button>
      </form>
      <p class="login" @click="goToLogin">
        ¿Ya la recordaste? <span>Iniciar sesión</span>
      </p>
    </div>
  </LettucePatternBackground>
</template>
<script setup lang="ts">
// ...existing code...
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserApi } from "../../api/user.js"; // <--- LÍNEA CORREGIDA
import { useSnackbarStore } from "../../stores/snackbar";
import LettucePatternBackground from "../../components/LettucePatternBackground.vue"; // Importar el componente
// ...existing code...

const router = useRouter();
const route = useRoute();
const snackbarStore = useSnackbarStore();

const email = ref("");
const code = ref(route.query.code || ""); // Mantener la inicialización desde query
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const step = ref(code.value ? 2 : 1); // 1: pedir código, 2: cambiar contraseña

async function handleRequestCode() {
  if (!email.value) {
    snackbarStore.showError("Por favor, ingresa tu correo electrónico.");
    return;
  }
  loading.value = true;
  try {
    await UserApi.requestPasswordReset(email.value);
    snackbarStore.showSuccess(
      "Te enviamos un correo con el código de recuperación."
    );
    step.value = 2;
  } catch (error: any) {
    const errorMessage =
      error?.description ||
      error?.message ||
      "Error al solicitar el código. Verifica el correo e intenta nuevamente.";
    snackbarStore.showError(errorMessage);
  } finally {
    loading.value = false;
  }
}

async function handleChangePassword() {
  if (!code.value) {
    snackbarStore.showError("Por favor, ingresa el código de recuperación.");
    return;
  }
  if (!newPassword.value || !confirmPassword.value) {
    snackbarStore.showError("Por favor, completa ambos campos de contraseña.");
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    snackbarStore.showError("Las contraseñas no coinciden.");
    return;
  }
  if (newPassword.value.length < 6) {
    // Ejemplo de validación de longitud mínima
    snackbarStore.showError(
      "La nueva contraseña debe tener al menos 6 caracteres."
    );
    return;
  }

  loading.value = true;
  try {
    await UserApi.changePassword({
      code: code.value,
      password: newPassword.value,
    });
    snackbarStore.showSuccess("Contraseña actualizada correctamente.");
    router.push("/login");
  } catch (error: any) {
    const errorMessage =
      error?.description ||
      error?.message ||
      "Error al cambiar la contraseña. Verifica el código e intenta nuevamente.";
    snackbarStore.showError(errorMessage);
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push("/login");
}

function goToLandingPage() {
  router.push("/LandingPage"); // O la ruta que corresponda a tu landing page
}
</script>

<style scoped>
.register-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  width: 720px;
  max-width: 95vw;
  text-align: center;
}

h2 {
  margin-bottom: 24px;
  font-weight: 700;
  color: #2e7d32;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-pair {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.input-pair > div {
  flex: 1;
}

.input-single {
  width: 100%;
}

label {
  display: block;
  text-align: left;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #c8e6c9;
  border-radius: 8px;
  font-size: 1rem;
  color: #222;
  background-color: #f9f9f9;
  transition: all 0.2s ease-in-out;
}

input:focus {
  outline: none;
  border-color: #66bb6a;
  background-color: #fff;
  box-shadow: 0 0 0 2px #a5d6a7;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #388e3c;
}

button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.login {
  margin-top: 16px;
  color: #444;
  font-size: 0.95rem;
  user-select: none;
}

.login span {
  color: #388e3c;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.login span:hover {
  color: #1b5e20;
}
.logo-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: transparent;
  margin: 0 auto 20px auto;
}

.logo-wrapper:hover {
  border: 2px solid #4caf50;
  background-color: #dcedc8;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
</style>
