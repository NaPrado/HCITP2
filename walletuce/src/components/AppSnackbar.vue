<template>
  <v-snackbar
    v-model="snackbarStore.show"
    :color="
      snackbarStore.type === 'success' ? 'green-lighten-1' : 'red-lighten-1'
    "
    location="bottom right"
    :timeout="3000"
    rounded="lg"
    elevation="4"
    class="custom-snackbar"
    transition="slide-x-reverse-transition"
  >
    <div class="d-flex align-center justify-space-between" style="width: 100%">
      <div class="text-body-1">
        <v-icon
          :icon="
            snackbarStore.type === 'success'
              ? 'mdi-check-circle'
              : 'mdi-alert-circle'
          "
          class="mr-2"
          size="20"
        />
        {{ snackbarStore.message }}
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="compact"
        color="white"
        size="small"
        class="ml-4"
        style="margin: -8px -8px -8px 0"
        @click="snackbarStore.show = false"
      />
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from "../stores/snackbar";

const snackbarStore = useSnackbarStore();

defineOptions({
  name: "AppSnackbar",
});
</script>

<style scoped>
.custom-snackbar {
  min-width: 300px;
  max-width: 500px;
  position: fixed !important;
  bottom: 16px !important;
  right: 16px !important;
  left: auto !important;
}

:deep(.v-snackbar__wrapper) {
  margin: 0 !important;
  position: fixed !important;
  bottom: 16px !important;
  right: 16px !important;
  left: auto !important;
  overflow: visible !important;
}

:deep(.v-snackbar__content) {
  padding: 12px 16px !important;
}

:deep(.slide-x-reverse-transition-enter-from) {
  transform: translateX(105%) !important;
}

:deep(.slide-x-reverse-transition-enter-to),
:deep(.slide-x-reverse-transition-leave-from) {
  transform: translateX(0) !important;
}

:deep(.slide-x-reverse-transition-leave-to) {
  transform: translateX(105%) !important;
}

:deep(.slide-x-reverse-transition-enter-active),
:deep(.slide-x-reverse-transition-leave-active) {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>
