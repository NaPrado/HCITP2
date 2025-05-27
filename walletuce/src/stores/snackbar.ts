import { defineStore } from "pinia";

interface SnackbarState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export const useSnackbarStore = defineStore("snackbar", {
  state: (): SnackbarState => ({
    show: false,
    message: "",
    type: "success",
  }),
  actions: {
    showSuccess(message: string) {
      this.message = message;
      this.type = "success";
      this.show = true;
    },
    showError(message: string) {
      this.message = message;
      this.type = "error";
      this.show = true;
    },
    hide() {
      this.show = false;
    },
  },
});
