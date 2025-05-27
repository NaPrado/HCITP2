<template>
  <LettucePatternBackground>
    <div class="login-box">
      <!-- Logo -->
      <!-- Logo -->
      <div class="logo-wrapper" @click="goToLandingPage">
        <img src="@/assets/letucce.svg" alt="Letucce Logo" class="logo" />
      </div>

      <h2>Iniciar sesión</h2>

      <form @submit.prevent="handleLogin">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="tu@correo.com"
          required
        />

        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="********"
          required
        />

        <p class="forgot" @click="forgotPassword">¿Olvidaste tu contraseña?</p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>
      </form>

      <p class="register" @click="goToRegister">
        ¿No tenés cuenta? <span>Registrate</span>
      </p>
    </div>
  </LettucePatternBackground>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "../../api/user";
import { Api } from "../../api/api"; // Import Api para setear el token globalmente si es necesario
import { useSnackbarStore } from "../../stores/snackbar";
import LettucePatternBackground from "../../components/LettucePatternBackground.vue";
// Importamos useUserStore solo si es estrictamente necesario para alguna acción simple post-login,
// o para la verificación en onMounted si decides mantenerla basada en el store.
// Por ahora, para la reversión, intentaremos minimizar su rol en el flujo crítico de login.
// import { useUserStore } from "../../stores/user";

const email = ref("");
const password = ref("");
const router = useRouter();
const loading = ref(false);
const snackbarStore = useSnackbarStore();
// const userStore = useUserStore(); // Comentado temporalmente para la reversión

function goToLandingPage() {
  router.push("/LandingPage");
}

onMounted(() => {
  // Verificar directamente el token en localStorage
  const token = localStorage.getItem("token");
  if (token) {
    // Si hay un token, podrías considerar validar su expiración o hacer una llamada rápida
    // para verificar si es válido antes de redirigir, o simplemente redirigir.
    // Para una reversión simple, redirigimos si el token existe.
    Api.token = token; // Asegúrate de que el token se cargue en tu instancia de Api
    router.push("/HomePage");
  }
});

async function handleLogin() {
  if (!email.value || !password.value) {
    snackbarStore.showError("Por favor, completa todos los campos.");
    return;
  }

  loading.value = true;
  try {
    const response = await UserApi.login({
      email: email.value,
      password: password.value,
    });

    if (response?.token) {
      localStorage.setItem("token", response.token); // Guardar token en localStorage
      Api.token = response.token; // Actualizar el token en la instancia global de Api

      // En lugar de depender de userStore.setToken para cargar el perfil aquí,
      // dejaremos que HomePage o una guarda de ruta se encargue de eso.
      snackbarStore.showSuccess("Inicio de sesión exitoso");
      router.push("/HomePage");
    } else {
      // Este caso es improbable si la API devuelve errores HTTP, pero es una salvaguarda.
      snackbarStore.showError(
        "Respuesta de inicio de sesión inválida del servidor."
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage =
      "Error al iniciar sesión. Verifique sus credenciales e intente nuevamente.";
    // Verificación más segura para la propiedad 'description'
    if (
      error &&
      typeof error === "object" &&
      "description" in error &&
      typeof error.description === "string"
    ) {
      errorMessage = error.description;
    }
    snackbarStore.showError(errorMessage);
  } finally {
    loading.value = false;
  }
}

function goToRegister() {
  router.push("/register");
}

function forgotPassword() {
  router.push("/forgot-password");
}
</script>

<style scoped>
.login-box {
  background: #ffffff;
  padding: 40px 48px;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  width: 360px;
  text-align: center;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 24px;
  font-weight: 700;
  color: #2e7d32; /* Un verde oscuro para el título */
}

label {
  display: block;
  text-align: left;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555; /* Gris oscuro para etiquetas */
}

input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px; /* Espacio entre inputs */
  border: 2px solid #c8e6c9; /* Borde verde claro */
  border-radius: 8px;
  font-size: 1rem;
  color: #222; /* Color de texto oscuro */
  background-color: #f9f9f9; /* Fondo muy claro para inputs */
  transition: all 0.2s ease-in-out;
  box-sizing: border-box; /* Para que el padding no afecte el ancho total */
}

input:focus {
  outline: none;
  border-color: #66bb6a; /* Verde más brillante al enfocar */
  background-color: #fff;
  box-shadow: 0 0 0 2px #a5d6a7; /* Sombra sutil al enfocar */
}

.forgot {
  text-align: center; /* Centrado */
  margin-bottom: 18px;
  font-size: 0.95rem;
  color: #444; /* Gris para texto secundario */
  cursor: pointer;
  transition: color 0.3s ease;
}

.forgot:hover {
  color: #388e3c; /* Verde al pasar el mouse */
}

button {
  width: 100%;
  padding: 14px;
  background-color: #4caf50; /* Verde principal para el botón */
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #388e3c; /* Verde más oscuro al pasar el mouse */
}

button:disabled {
  background-color: #a5d6a7; /* Verde claro cuando está deshabilitado */
  cursor: not-allowed;
}

.register {
  margin-top: 16px;
  color: #444;
  font-size: 0.95rem;
  user-select: none; /* Evitar selección de texto */
}

.register span {
  color: #388e3c; /* Verde para el enlace de registro */
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.register span:hover {
  color: #1b5e20; /* Verde muy oscuro al pasar el mouse */
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
  margin-top: 20px;
  width: 80px;
  height: 80px;
  object-fit: contain;
}
</style>
