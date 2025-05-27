import { defineStore } from "pinia";
import { AccountApi } from "../api/account";
import { UserApi } from "../api/user";
import { Api } from "../api/api"; // Importa la clase Api para setear el token global

export const useUserStore = defineStore("user", {
  state: () => ({
    // Datos del usuario
    firstName: "",
    lastName: "",
    email: "",
    // Datos de la cuenta
    balance: null as number | null,
    cvu: "",
    alias: "",
    isLoggedIn: !!localStorage.getItem("token"),
    token: localStorage.getItem("token") || null, // Añade el token al estado
  }),
  getters: {
    fullName: (state) => `${state.firstName} ${state.lastName}`.trim(),
    currentBalance: (state) => state.balance,
  },
  actions: {
    setToken(newToken: string) {
      this.token = newToken;
      localStorage.setItem("token", newToken);
      Api.token = newToken; // Actualiza el token en tu clase Api
      this.isLoggedIn = true;
      // Después de establecer el token, carga los datos del perfil/cuenta
      // Esto es importante para que el saldo y otros datos estén disponibles inmediatamente
      this.fetchUserProfile().catch((error) => {
        console.error("Error fetching user profile after login:", error);
        // Podrías querer manejar este error, por ejemplo, mostrando un snackbar
      });
    },
    setUserData(userData: {
      firstName?: string;
      lastName?: string;
      email?: string;
    }) {
      if (userData.firstName) this.firstName = userData.firstName;
      if (userData.lastName) this.lastName = userData.lastName;
      if (userData.email) this.email = userData.email;
    },
    setAccountData(accountData: {
      balance?: number;
      cvu?: string;
      alias?: string;
    }) {
      if (accountData.balance !== undefined) this.balance = accountData.balance;
      if (accountData.cvu) this.cvu = accountData.cvu;
      if (accountData.alias) this.alias = accountData.alias;
    },
    // setBalance ya no es necesaria si usas setAccountData
    // setBalance(newBalance: number) {
    //   this.balance = newBalance;
    // },
    async fetchUserProfile() {
      if (!this.token && !Api.token) {
        // Verifica si hay un token para hacer la llamada
        console.warn("No token available, cannot fetch user profile.");
        // this.logout(); // Opcional: desloguear si no hay token
        return;
      }
      try {
        const accountResponse = await AccountApi.get();
        if (accountResponse) {
          this.balance = accountResponse.balance ?? null;
          this.cvu = accountResponse.cvu || "";
          this.alias = accountResponse.alias || "";
        } else {
          this.balance = null;
        }

        const userResponse = await UserApi.get();
        if (userResponse) {
          this.firstName = userResponse.firstName || "";
          this.lastName = userResponse.lastName || "";
          this.email = userResponse.email || "";
        }
        this.isLoggedIn = true;
        console.log("User profile and account data fetched:", {
          ...this.$state,
        });
      } catch (error: any) {
        console.error(
          "Error in userStore fetching user profile/account data:",
          error
        );
        if (error.code === 97 || error.status === 401) {
          // No autorizado o similar
          this.logout();
        }
        throw error;
      }
    },
    logout() {
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.balance = null;
      this.cvu = "";
      this.alias = "";
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem("token");
      Api.token = null; // Limpia el token en tu clase Api
      console.log("User logged out, store cleared.");
      // Considera redirigir al login aquí o desde donde se llame a logout
      // router.push('/login'); // Necesitarías importar `router` si haces esto aquí
    },
    checkLoginStatus() {
      const tokenFromStorage = localStorage.getItem("token");
      if (tokenFromStorage) {
        this.token = tokenFromStorage;
        Api.token = tokenFromStorage; // Asegura que Api.token esté seteado
        this.isLoggedIn = true;
        if (this.balance === null && this.firstName === "") {
          this.fetchUserProfile().catch((err) =>
            console.warn("Failed to auto-fetch profile on login check", err)
          );
        }
      } else {
        this.logout(); // Si no hay token, asegura estado de logout
      }
    },
  },
});
