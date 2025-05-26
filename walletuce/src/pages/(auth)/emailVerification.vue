<template>
  <LettucePatternBackground>
    <div class="register-box">
      <img src="@/assets/letucce.svg" alt="Letucce Logo" class="logo" />
      <h2>Verificá tu correo</h2>

      <p class="instruction">
        Ingresá el código de verificación que te enviamos a tu correo
        electrónico.
      </p>

      <form @submit.prevent="verifyCode" class="form-grid">
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

        <p class="resend" @click="resendCode">
          ¿No recibiste el código? <span>Reenviar</span>
        </p>
      </form>
    </div>
  </LettucePatternBackground>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "@/api/user";

const code = ref("");
const loading = ref(false);
const router = useRouter();
const email = ref(""); // Nuevo: para reenviar el código

// Si querés obtener el email desde query params (por ejemplo, después del registro)
if (router.currentRoute.value.query.email) {
  email.value = router.currentRoute.value.query.email;
}

async function verifyCode() {
  loading.value = true;
  try {
    await UserApi.verify(code.value);
    alert("Cuenta verificada con éxito");
    router.push("/login");
  } catch (e) {
    alert(e.description || "Código inválido");
  } finally {
    loading.value = false;
  }
}

async function resendCode() {
  console.log(email.value);
  if (!email.value) {
    alert("No se encontró el email para reenviar el código.");
    return;
  }
  loading.value = true;
  try {
    await UserApi.resendVerification(email.value);
    alert("Código reenviado");
  } catch (e) {
    alert(e.description || "Error al reenviar código");
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
