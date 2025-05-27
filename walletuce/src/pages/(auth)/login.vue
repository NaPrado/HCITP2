<template>
  <LettucePatternBackground>
    <div class="login-box">
      <!-- Logo -->
      <!-- Logo -->
      <div class="logo-wrapper" @click="goToLandingPage">
        <img
          src="@/assets/letucce.svg"
          alt="Letucce Logo"
          class="logo"
        />
      </div>


      <h2>Iniciar sesión</h2>

      <form @submit.prevent="login">
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

        <button type="submit">Entrar</button>
      </form>

      <p class="register" @click="goToRegister">
        ¿No tenés cuenta? <span>Registrate</span>
      </p>
    </div>
  </LettucePatternBackground>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { UserApi, Credentials } from "@/api/user.js";
import { Api } from "@/api/api.js";
import { onMounted } from "vue";

const email = ref("");
const password = ref("");
const router = useRouter();
const loading = ref(false);

function goToLandingPage() {
  router.push("/LandingPage");
}

onMounted(() => {
  const token = localStorage.getItem("token");
  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== ""
  ) {
    router.push("/HomePage");
  }
});

async function login() {
  loading.value = true;
  try {
    const creds = new Credentials(email.value, password.value);
    const response = await UserApi.login(creds);
    console.log("Respuesta login:", response);
    if (response.token) {
      Api.token = response.token; // Esto ya lo guarda en localStorage
      localStorage.setItem("auth", "true");
      router.push("/HomePage");
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (e) {
    console.error("Error en login:", e);
    alert(e.description || "Error al iniciar sesión");
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
  color: #2e7d32;
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
  margin-bottom: 12px;
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

.forgot {
  text-align: center;
  margin-bottom: 18px;
  font-size: 0.95rem;
  color: #444;
  cursor: pointer;
  transition: color 0.3s ease;
}

.forgot:hover {
  color: #388e3c;
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

.register {
  margin-top: 16px;
  color: #444;
  font-size: 0.95rem;
  user-select: none;
}

.register span {
  color: #388e3c;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.register span:hover {
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
  margin-top:20px;
  width: 80px;
  height: 80px;
  object-fit: contain;
}


</style>
