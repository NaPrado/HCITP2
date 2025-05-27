<template>
  <LettucePatternBackground>
    <div class="register-box">
      <img src="@/assets/letucce.svg" alt="Letucce Logo" class="logo" />
      <h2>Registrarse</h2>

      <form @submit.prevent="register" class="form-grid">
        <!-- Nombre y Apellido -->
        <div class="input-pair">
          <div>
            <label for="firstName">Nombre</label>
            <input
              id="firstName"
              type="text"
              v-model="firstName"
              placeholder="Juan"
              required
            />
          </div>
          <div>
            <label for="lastName">Apellido</label>
            <input
              id="lastName"
              type="text"
              v-model="lastName"
              placeholder="Pérez"
              required
            />
          </div>
        </div>

        <!-- Fecha de nacimiento y Teléfono -->
        <div class="input-pair">
          <div>
            <label for="birthDate">Fecha de nacimiento</label>
            <input
              id="birthDate"
              type="text"
              v-model="birthDate"
              placeholder="dd/mm/yyyy"
              required
            />
          </div>

          <div>
            <label for="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              v-model="phone"
              placeholder="11 2345-6789"
              required
            />
          </div>
        </div>

        <!-- Email y Contraseña -->
        <div class="input-pair">
          <div>
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              v-model="email"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="********"
              required
            />
          </div>
        </div>

        <button type="submit">Crear cuenta</button>
      </form>

      <p class="login" @click="goToLogin">
        ¿Ya tenés cuenta? <span>Iniciar sesión</span>
      </p>
    </div>
  </LettucePatternBackground>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "@/api/user.js";

const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const birthDate = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);

async function register() {
  loading.value = true;

  // Parse dd/mm/yyyy to YYYY-MM-DD format for the API
  let formattedBirthDate = "";
  const dateParts = birthDate.value.split('/');
  if (dateParts.length === 3) {
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    // Basic validation: ensure parts are numbers and month/day are within reasonable range
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
       formattedBirthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else {
      alert("Formato de fecha inválido. Utiliza dd/mm/yyyy.");
      loading.value = false;
      return; // Stop registration if format is invalid
    }
  } else if (birthDate.value !== "") {
     alert("Formato de fecha inválido. Utiliza dd/mm/yyyy.");
     loading.value = false;
     return; // Stop registration if format is invalid
  }

  // Validate phone number: 6 to 15 digits
  const phoneRegex = /^\d{6,15}$/;
  if (!phoneRegex.test(phone.value)) {
    alert("Número de teléfono inválido.");
    loading.value = false;
    return; // Stop registration if phone is invalid
  }

  const newUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    birthDate: formattedBirthDate, // Use the formatted date
    email: email.value,
    password: password.value,
    metadata: {},
  };

  try {
    // Llama a la API para registrar el usuario usando UserApi
    const response = await UserApi.register(newUser);
    alert("Usuario registrado correctamente");
    router.push({ path: "/emailVerification", query: { email: email.value } });
  } catch (e) {
    alert(e.description || "Error al registrar usuario");
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push("/login");
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

.logo {
  width: 80px;
  margin-bottom: 20px;
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

/* Remove all Datepicker specific styles */

</style>
