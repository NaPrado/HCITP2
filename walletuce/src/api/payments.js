import { Api } from "./api.js";

/**
 * @typedef {Object} PaymentQueryParams
 * @property {number} [page=1] - Page number
 * @property {'ASC'|'DESC'} [direction='ASC'] - Sort direction
 * @property {boolean} [pending] - Payment status filter (optional)
 * @property {'ACCOUNT'|'CARD'} [method] - Payment method filter (optional)
 * @property {'THREE_DAYS'|'LAST_WEEK'|'LAST_MONTH'} [range] - Date range filter (optional)
 * @property {'PAYER'|'RECEIVER'} [role] - User role in payment (optional)
 * @property {number} [cardId] - Card identifier filter (optional)
 */

export class PaymentsService {
  static getUrl(slug) {
    if (slug === "pull") {
      return `${Api.baseUrl}/payment/pull`;
    }
    if (slug === "push") {
      return `${Api.baseUrl}/payment/push`;
    }
    // Mantén las URLs base para las transferencias específicas
    if (slug === "transfer-email") {
      return `${Api.baseUrl}/payment/transfer-email`;
    }
    if (slug === "transfer-cvu") {
      return `${Api.baseUrl}/payment/transfer-cvu`;
    }
    if (slug === "transfer-alias") {
      return `${Api.baseUrl}/payment/transfer-alias`;
    }
    return `${Api.baseUrl}/payment${slug ? `/${slug}` : ""}`;
  }

  /**
   * Get payments with filters
   * @param {PaymentQueryParams} params - Query parameters
   * @param {AbortController} [controller] - Abort controller
   */
  static async getPayments(params = {}, controller) {
    try {
      const {
        page = 1,
        direction = "ASC",
        pending,
        method,
        range,
        role,
        cardId,
      } = params;

      const queryParams = new URLSearchParams();

      // Add required parameters
      queryParams.append("page", String(page));
      queryParams.append("direction", direction);

      // Add optional parameters only if they are defined and not undefined
      if (method) {
        queryParams.append("method", method);
      }
      if (range) {
        queryParams.append("range", range);
      }
      if (role) {
        queryParams.append("role", role);
      }
      if (pending !== undefined) {
        queryParams.append("pending", String(pending));
      }
      if (cardId) {
        queryParams.append("cardId", String(cardId));
      }

      const url = `${this.getUrl()}?${queryParams.toString()}`;
      console.log("Final URL:", url);

      const response = await Api.get(url, true, controller);
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  // GET /api/payment/{id}
  static async getPaymentInfo(paymentId, controller) {
    try {
      return await Api.get(this.getUrl(paymentId), true, controller);
    } catch (error) {
      console.error("Error fetching payment info:", error);
      throw error;
    }
  }

  // POST /api/payment/pull
  static async createPaymentRequest(paymentData, controller) {
    try {
      const formattedData = {
        type: "payment",
        amount: parseFloat(paymentData.amount),
        description: paymentData.description || "",
      };
      return await Api.post(
        this.getUrl("pull"),
        true,
        formattedData,
        controller
      );
    } catch (error) {
      console.error("Error creating payment request:", error);
      throw error;
    }
  }

  // PUT /api/payment/push
  static async makePayment(paymentId, paymentData, controller) {
    try {
      return await Api.put(
        `${Api.baseUrl}/payment/push?uuid=${paymentId}`,
        true,
        paymentData,
        controller
      );
    } catch (error) {
      console.error("Error making payment:", error);
      throw error;
    }
  }

  // POST /api/payment/transfer-email
  static async transferByEmail(
    email,
    amount,
    description = "",
    cardId = null,
    controller
  ) {
    try {
      let url = this.getUrl("transfer-email");
      const queryParams = new URLSearchParams();
      queryParams.append("email", email);
      if (cardId) {
        queryParams.append("cardId", cardId);
      }
      url = `${url}?${queryParams.toString()}`;

      const bodyData = { amount: parseFloat(amount), description };
      return await Api.post(url, true, bodyData, controller);
    } catch (error) {
      console.error("Error transferring by email:", error);
      throw error;
    }
  }

  // POST /api/payment/transfer-cvu
  static async transferByCvu(
    cvu,
    amount,
    description = "",
    cardId = null,
    controller
  ) {
    try {
      let url = this.getUrl("transfer-cvu");
      const queryParams = new URLSearchParams();
      queryParams.append("cvu", cvu);
      if (cardId) {
        queryParams.append("cardId", cardId);
      }
      url = `${url}?${queryParams.toString()}`;

      const bodyData = { amount: parseFloat(amount), description };
      return await Api.post(url, true, bodyData, controller);
    } catch (error) {
      console.error("Error transferring by CVU:", error);
      throw error;
    }
  }

  // POST /api/payment/transfer-alias
  static async transferByAlias(
    alias,
    amount,
    description = "",
    cardId = null,
    controller
  ) {
    try {
      let url = this.getUrl("transfer-alias");
      const queryParams = new URLSearchParams();
      queryParams.append("alias", alias);
      if (cardId) {
        queryParams.append("cardId", cardId);
      }
      url = `${url}?${queryParams.toString()}`;

      const bodyData = { amount: parseFloat(amount), description };
      return await Api.post(url, true, bodyData, controller);
    } catch (error) {
      console.error("Error transferring by alias:", error);
      throw error;
    }
  }
}
