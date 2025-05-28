<template>
  <v-app>
    <!-- Header fijo -->
    <div class="fixed-header">
      <AppHeader titulo="Ayuda" />
    </div>

    <!-- Layout principal: Sidebar fijo + Contenido scrollable -->
    <div class="main-layout">
      <!-- Sidebar fijo hecho a mano (no v-navigation-drawer) -->
      <div class="custom-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">Índice</h3>
          <v-divider color="black" />
        </div>
        <v-list dense nav>
          <v-list-item
            v-for="item in sections"
            :key="item.id"
            :href="'#' + item.id"
            @click="scrollTo(item.id)"
          >
            <v-list-item-title class="text-black">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- Contenido scrollable -->
      <div class="help-scrollable-content">
        <v-container fluid class="help-content mt-4">
            <BackButton
            size="large"
            to="/HomePage"
            variant="text"
            class="align-self-start ml-0 mt-0"
            />
            <h1 class="mb-2">Tutoriales de uso</h1>
            <v-divider class="mb-2" :thickness="2"/>
          <div
            v-for="section in sections"
            :key="section.id"
            :id="section.id"
            class="mb-12"
          >
            <h2 class="text-h5 font-weight-bold mb-2 text-black">
              {{ section.title }}
            </h2>
            <p class="mb-4 text-black">{{ section.description }}</p>

            <v-card flat class="pa-4 white-stepper mb-4">
              <div
                v-for="(step, index) in section.steps"
                :key="index"
                class="mb-4"
              >
                <h3 class="text-h6 font-weight-bold text-black mb-1">
                  {{ index + 1 }}. {{ step.title }}
                </h3>
                <p class="text-black mb-2">{{ step.content }}</p>

                <!-- Mostrar imagen si existe -->
                <v-img
                  v-if="step.image"
                  :src="step.image"
                  class="my-2"
                  max-width="60%"
                  max-height="300"
                  cover
                  rounded
                />
              </div>
            </v-card>
          </div>
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import AppHeader from "../components/AppHeader";

const sections = [
  {
    id: "ver-movimientos",
    title: "Ver movimientos",
    description:
      "Accedé al historial de todas tus transacciones para llevar un control detallado de tus ingresos, egresos y actividades recientes.",
    steps: [
      {
        title: "Accedé al menú de inicio",
        content:
          "Tocá el ícono de Walletuce en la parte superior de la pantalla para volver al inicio.",
        image: null,
      },
      {
        title: 'Seleccioná "Ver Movimientos"',
        content:
          "Elegí esta opción para ver la lista de transacciones realizadas.",
        image: "/src/assets/pasos/movimientos-indicado.png",
      },
      {
        title: 'Navega a través de tus movimientos',
        content:
          "Utiliza los filtros disponibles para ver tu historial de pagos.",
        image: null,
      },
    ],
  },
  {
    id: "ingresar-dinero",
    title: "Ingresar Dinero",
    description:
      "Podés aumentar tu saldo transfiriendo dinero desde una cuenta bancaria o utilizando una tarjeta de débito/crédito.",
    steps: [
      {
        title: "Accedé al menú de inicio",
        content:
          "Tocá el ícono de Walletuce en la parte superior de la pantalla para volver al inicio.",
        image: null,
      },
      {
        title: 'Seleccioná "Ingresar Dinero"',
        content: "Una vez dentro, se verá la opción de ingresar dinero en la barra inferior.",
        image: "/src/assets/pasos/ingresar-indicado.png",
      },
      {
        title: "Elegí el método de ingreso",
        content: "Podés optar por usar una cuenta bancaria o una tarjeta.",
        image: null,
      },
      {
        title: "Ingresá el monto",
        content: "Especificá cuánto dinero querés ingresar.",
        image: null,
      },
      {
        title: "Confirmá la operación",
        content: "Verificá los datos ingresados antes de confirmar.",
        image: null,
      },
    ],
  },
  {
    id: "transferir-dinero",
    title: "Transferir Dinero",
    description:
      "Realizá transferencias a otras cuentas de manera rápida y segura dentro de la aplicación.",
    steps: [
      {
        title: "Accedé al menú de inicio",
        content: "Tocá el ícono de Walletuce en la parte superior de la pantalla para volver al inicio.",
        image: null,
      },
      {
        title: 'Seleccioná "Transferir Dinero"',
        content: "Esta opción te llevará al formulario de transferencia.",
        image: "/src/assets/pasos/transferir-indicado.png",
      },
      {
        title: "Completá los datos del destinatario",
        content: "Ingresá alias, mail o CVU del destinatario.",
        image: null,
      },
      {
        title: "Indicá el monto",
        content: "Escribí cuánto querés transferir.",
        image: null,
      },
      {
        title: "Revisá y confirmá",
        content: "Chequeá que toda la información esté correcta y finalizá.",
        image: null,
      },
    ],
  },
  {
    id: "generar-cobro",
    title: "Generar Cobro",
    description:
      "Solicitá pagos enviando un identificador de pago.",
    steps: [
      {
        title: "Ingresá al menú de inicio",
        content: "Tocá el ícono de Walletuce en la parte superior de la pantalla para volver al inicio.",
        image: null,
      },
      {
        title: 'Seleccioná "Generar Cobro"',
        content: "Elegí esta opción para comenzar.",
        image: "/src/assets/pasos/generar-indicado.png",
      },
      {
        title: "Completá los datos del cobro",
        content: "Ingresá el monto y una breve descripción.",
        image: null,
      },
      {
        title: "Generá el identificador de pago",
        content: "Compartí el identificador para que te paguen.",
        image: null,
      },
    ],
  },
  {
    id: "realizar-pago",
    title: "Realizar Pago",
    description:
      "Pagá productos o servicios usando tu saldo disponible o una tarjeta asociada desde la aplicación.",
    steps: [
      {
        title: "Abrí el menú de inicio",
        content: "Tocá el ícono de Walletuce en la parte superior de la pantalla para volver al inicio.",
        image: null,
      },
      {
        title: 'Seleccioná "Realizar Pago"',
        content: "Elegí esta opción para iniciar un pago.",
        image: "/src/assets/pasos/realizar-indicado.png",
      },
      {
        title: "Ingresá el identificador de pago",
        content: "Podés pagar con saldo en cuenta o usando una tarjeta.",
        image: null,
      },
      {
        title: "Confirmá el pago",
        content: "Verificá el monto y origen de los fondos antes de aceptar.",
        image: null,
      },
    ],
  },
  {
    id: "administrar-tarjetas",
    title: "Administrar Tarjetas",
    description:
      "Gestioná las tarjetas asociadas a tu cuenta: agregá nuevas o eliminá las que ya no usás.",
    steps: [
      {
        title: "Abrí el menú de inicio",
        content: "Tocá el ícono de Walletuce en la parte superior de la pantalla para volver al inicio.",
        image: null,
      },
      {
        title: 'Seleccioná "Administrar Tarjetas"',
        content: "Ingresá a la sección para ver tus tarjetas registradas.",
        image: "/src/assets/pasos/tarjetas-indicado.png",
      },
      {
        title: "Gestioná tus tarjetas",
        content:
          "Podés agregar una nueva tarjeta o eliminarla presionando encima de la misma.",
        image: null,
      },
    ],
  },
];

const currentSteps = reactive(
  Object.fromEntries(sections.map((section) => [section.id, 1]))
);

function scrollTo(id: string) {
  const container = document.querySelector(
    ".help-scrollable-content"
  ) as HTMLElement;
  const target = document.getElementById(id);

  if (container && target) {
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const offset = 40; // espacio entre el header y el título
    const scrollPosition =
      container.scrollTop + (targetTop - containerTop) - offset;

    container.scrollTo({ top: scrollPosition, behavior: "smooth" });
  }
}
</script>
<style>
html,
body,
#app,
.v-application {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
/* Scrollbar para navegadores WebKit (Chrome, Edge, Safari) */
.help-scrollable-content::-webkit-scrollbar {
  width: 10px;
}

.help-scrollable-content::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.help-scrollable-content::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 10px;
}

/* Firefox */
.help-scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 #f0f0f0;
}
</style>
<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
}

.main-layout {
  display: flex;
  margin-top: 64px; /* Altura del header */
  height: calc(100vh - 64px);
}

.custom-sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  width: 250px;
  height: calc(100vh - 64px);
  background-color: white !important;
  border-right: 1px solid #ccc;
  z-index: 500;
  overflow: hidden;
}

.custom-sidebar .v-list,
.custom-sidebar .v-list-item {
  background-color: transparent !important;
}

.help-scrollable-content {
  margin-left: 250px;
  height: 100%;
  overflow-y: auto;
  width: calc(100% - 250px);
  padding: 16px;
  background: #eee;
}

.help-content {
  padding: 16px;
}

.text-black {
  color: black !important;
}

.white-stepper {
  background-color: white !important;
  color: black !important;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08); /* sombra suave */
}

.custom-sidebar {
  background-color: white !important;
}

.custom-sidebar .v-list,
.custom-sidebar .v-list-item {
  background-color: transparent !important;
}
.sidebar-header {
  padding: 16px 16px 0;
  background-color: white;
}

.sidebar-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
