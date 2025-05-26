import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround para errores con imports dinámicos en Vite
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated =
    token && token !== "undefined" && token !== "null" && token.trim() !== "";

  const publicPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/emailVerification",
    "/LandingPage",
    "/PaymentPage/:id",
  ];
  const isPublic = publicPages.some((pattern) => {
    // Convertir el patrón de ruta a una expresión regular
    const regexPattern = pattern
      .replace(/:[^/]+/g, "[^/]+") // Reemplazar :param con [^/]+ para coincidir con cualquier cosa excepto /
      .replace(/\//g, "\\/"); // Escapar las barras
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(to.path);
  });

  if (!isAuthenticated && !isPublic) {
    return next("/login");
  }
  if (
    isAuthenticated &&
    ["/login", "/register", "/LandingPage"].includes(to.path)
  ) {
    return next("/HomePage");
  }
  next();
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
