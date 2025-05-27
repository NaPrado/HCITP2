<template>
  <v-btn
    :class="['back-btn', props.variant === 'text' ? 'back-btn-text' : '']"
    :variant="props.variant"
    :color="props.color"
    :size="props.size"
    @click="handleClick"
  >
    <v-icon
      :size="props.iconSize"
      :class="props.variant === 'text' ? 'mr-1' : 'mr-2'"
      >mdi-arrow-left</v-icon
    >
    <span v-if="props.showText">Volver</span>
  </v-btn>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    /** Ruta a la que volver. Si no se especifica, usa router.back() */
    to?: string;
    /** Variante del botón: 'text' | 'elevated' | 'tonal' */
    variant?: "text" | "elevated" | "tonal";
    /** Color del botón */
    color?: string;
    /** Tamaño del botón */
    size?: "small" | "default" | "large";
    /** Tamaño del ícono */
    iconSize?: string | number;
    /** Mostrar texto "Volver" */
    showText?: boolean;
  }>(),
  {
    variant: "text",
    color: "grey-darken-3",
    size: "default",
    iconSize: 20,
    showText: true,
  }
);

const router = useRouter();

const handleClick = () => {
  if (props.to) {
    router.push(props.to);
  } else {
    router.back();
  }
};
</script>

<style scoped>
.back-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 8px;
}

.back-btn-text {
  padding-left: 0 !important;
}

.back-btn:hover {
  opacity: 0.85;
}
</style>

<script lang="ts">
export default {
  name: "BackButton",
};
</script>
