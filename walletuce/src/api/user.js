import { Api } from "./api.js";

export { UserApi, Credentials };

class UserApi {
  static getUrl(slug) {
    return `${Api.baseUrl}/user${slug ? `/${slug}` : ""}`;
  }

  static async login(credentials, controller) {
    return await Api.post(
      UserApi.getUrl("login"),
      false,
      credentials,
      controller
    );
  }

  static async logout(controller) {
    await Api.post(UserApi.getUrl("logout"), true, {}, controller);
  }

  static async get(controller) {
    return Api.get(UserApi.getUrl(), true, controller);
  }

  static async register(user, controller) {
    return await Api.post(UserApi.getUrl(), false, user, controller);
  }

  static async verify(code, controller) {
    return await Api.post(
      UserApi.getUrl(`verify?code=${encodeURIComponent(code)}`),
      true,
      {},
      controller
    );
  }

  static async resendVerification(email, controller) {
    return await Api.post(
      UserApi.getUrl("resend-verification"),
      false,
      { email },
      controller
    );
  }

  static async requestPasswordReset(email, controller) {
    return await Api.post(
      UserApi.getUrl(`reset-password?email=${encodeURIComponent(email)}`),
      false,
      {},
      controller
    );
  }

  static async changePassword(data, controller) {
    // data debe ser: { code, password }
    return await Api.post(
      UserApi.getUrl("change-password"),
      false, // No requiere autenticación
      data,
      controller
    );
  }
}

class Credentials {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}
