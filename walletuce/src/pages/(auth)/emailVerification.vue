<template>
  <LettucePatternBackground>
    <div class="register-box">
      <img src="@/assets/letucce.svg" alt="Letucce Logo" class="logo" />
      <h2>Verificá tu correo</h2>

      <p class="instruction">
        Ingresá el código de verificación que te enviamos a tu correo
        electrónico.
      </p>

      <form @submit.prevent="verifyEmail" class="form-grid">
        <div>
          <label for="code">Código de verificación</label>
          <input
            id="code"
            type="text"
            v-model="code"
            placeholder="123456"
            required
          />
        </div>

        <button type="submit" :disabled="loading">Verificar</button>

        <p class="resend" @click="resendVerification">
          ¿No recibiste el código? <span>Reenviar</span>
        </p>
      </form>
    </div>
  </LettucePatternBackground>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserApi } from "../../api/user";
import { useSnackbarStore } from "../../stores/snackbar";

const router = useRouter();
const route = useRoute();
const snackbarStore = useSnackbarStore();

const email = ref(route.query["email"]?.toString() || "");
const code = ref(route.query["code"]?.toString() || "");
const loading = ref(false);

async function verifyEmail() {
  loading.value = true;
  try {
    // Clear any existing session data before verifying
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    await UserApi.verify(code.value);
    snackbarStore.showSuccess("Email verificado correctamente");
    router.push("/login");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "description" in error &&
      typeof error.description === "string" &&
      error.description.toLowerCase().includes("already verified")
    ) {
      snackbarStore.showSuccess(
        "Tu cuenta ya está verificada. Puedes iniciar sesión."
      );
      router.push("/login");
      return;
    }

    const errorMessage =
      error &&
      typeof error === "object" &&
      "description" in error &&
      typeof error.description === "string"
        ? error.description
        : "Error al verificar el email";
    snackbarStore.showError(errorMessage);
  } finally {
    loading.value = false;
  }
}

async function resendVerification() {
  if (!email.value) {
    snackbarStore.showError("No se encontró el email para reenviar el código");
    return;
  }

  loading.value = true;
  try {
    await UserApi.resendVerification(email.value);
    // Clear the previous code from the input
    code.value = "";
    snackbarStore.showSuccess("Se ha enviado un nuevo código de verificación");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "description" in error &&
      typeof error.description === "string" &&
      error.description.toLowerCase().includes("already verified")
    ) {
      snackbarStore.showSuccess(
        "Tu cuenta ya está verificada. Puedes iniciar sesión."
      );
      router.push("/login");
      return;
    }

    const errorMessage =
      error &&
      typeof error === "object" &&
      "description" in error &&
      typeof error.description === "string"
        ? error.description
        : "Error al reenviar el código de verificación";
    snackbarStore.showError(errorMessage);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-width: 95vw;
  text-align: center;
}

.logo {
  width: 80px;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 16px;
  font-weight: 700;
  color: #2e7d32;
}

.instruction {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 20px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

button:hover {
  background-color: #388e3c;
}

.resend {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #444;
  cursor: pointer;
}

.resend span {
  color: #388e3c;
  font-weight: 600;
}

.resend span:hover {
  color: #1b5e20;
}
</style>
