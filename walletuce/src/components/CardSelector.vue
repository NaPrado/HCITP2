<template>
  <div>
    <v-select
      v-model="selectedCardId"
      :items="formattedCards"
      item-title="displayName"
      item-value="id"
      :label="label"
      class="mt-2 compact-select"
      :loading="loading"
      :disabled="loading"
      :error-messages="error"
      density="compact"
      variant="outlined"
      hide-details
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import type { CardApi } from "../api/card";
import { CardApi as CardApiImpl } from "../api/card";
import { handleApiError } from "../utils/error";
import type { Card } from "../types/api";
import { formatCardDisplay } from "../utils/format";

const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    label?: string;
  }>(),
  {
    modelValue: null,
    label: "Seleccione una tarjeta",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

const router = useRouter();
const loading = ref(false);
const error = ref("");
const cards = ref<Array<Card>>([]);
const selectedCardId = ref<string | null>(props.modelValue);

const formattedCards = computed(() => {
  return cards.value.map((card: Card) => ({
    displayName: formatCardDisplay(card),
    id: card.id,
  }));
});

watch(
  () => props.modelValue,
  (newValue) => {
    selectedCardId.value = newValue;
  }
);

watch(selectedCardId, (newValue) => {
  emit("update:modelValue", newValue);
});

async function loadCards() {
  loading.value = true;
  error.value = "";

  try {
    const response = await CardApiImpl.getAll();
    if (Array.isArray(response)) {
      cards.value = response;
    } else {
      console.error("La respuesta no es un array:", response);
      cards.value = [];
    }
  } catch (e: unknown) {
    error.value = handleApiError(e, router, "Error al cargar las tarjetas");
    cards.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCards();
});
</script>

<script lang="ts">
export default {
  name: "CardSelector",
};
</script>

<style scoped>
@import "../styles/common.css";
</style>
