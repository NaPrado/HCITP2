/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#4CAF50",
          "primary-darken-1": "#388E3C",
          "primary-lighten-1": "#66BB6A",
          "primary-lighten-2": "#81C784",
          "primary-lighten-3": "#A5D6A7",
          "primary-lighten-4": "#C8E6C9",
          "primary-lighten-5": "#E8F5E9",
          secondary: "#2E7D32",
          "secondary-darken-1": "#1B5E20",
          error: "#D84315",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          background: "#FFFFFF",
          surface: "#FFFFFF",
        },
      },
    },
  },
});
