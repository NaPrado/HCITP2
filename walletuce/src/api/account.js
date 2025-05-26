import { Api } from "./api.js";

export class AccountApi {
  static getUrl(slug) {
    return `${Api.baseUrl}/account${slug ? `/${slug}` : ""}`;
  }

  // Obtener información de la cuenta
  static async get(controller) {
    return await Api.get(AccountApi.getUrl(), true, controller);
  }

  // Recargar saldo de la cuenta
  // En account.js
  static async recharge(data, controller) {
    // data: { amount: number }
    const url = AccountApi.getUrl(
      `recharge?amount=${encodeURIComponent(data.amount)}`
    );
    return await Api.post(url, true, {}, controller); // body vacío
  }

  // Actualizar alias de la cuenta
  static async updateAlias(data, controller) {
    // data: { alias: string }
    const url = AccountApi.getUrl(
      `update-alias?alias=${encodeURIComponent(data.alias)}`
    );
    return await Api.put(url, true, {}, controller); // body vacío
  }

  // Verificar CVU
  static async verifyCVU(cvu, controller) {
    return await Api.get(
      `${AccountApi.getUrl("verify-cvu")}?cvu=${encodeURIComponent(cvu)}`,
      true,
      controller
    );
  }

  // Verificar alias
  static async verifyAlias(alias, controller) {
    return await Api.get(
      `${AccountApi.getUrl("verify-alias")}?alias=${encodeURIComponent(alias)}`,
      true,
      controller
    );
  }
}
