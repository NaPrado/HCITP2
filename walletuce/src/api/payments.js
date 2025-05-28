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
   * Get paginated payments with filters
   * @param {Object} params Query parameters
   * @param {number} [params.page=1] Page number
   * @param {string} [params.direction='DESC'] Sort direction ('ASC' or 'DESC')
   * @param {boolean} [params.pending] Filter by pending status
   * @param {'ACCOUNT'|'CARD'} [params.method] Filter by payment method
   * @param {'THREE_DAYS'|'LAST_WEEK'|'LAST_MONTH'} [params.range] Filter by date range
   * @param {'PAYER'|'RECEIVER'} [params.role] Filter by user role in payment
   * @param {number} [params.cardId] Filter by card ID
   * @param {number} [params.pageSize=10] Items per page
   */
  static async getPayments(params = {}, controller) {
    try {
      const queryParams = new URLSearchParams();
      
      // Convertir todos los valores a string antes de agregarlos
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.direction) queryParams.append("direction", params.direction.toString());
      if (params.pending !== undefined) queryParams.append("pending", params.pending.toString());
      if (params.method) queryParams.append("method", params.method.toString());
      if (params.range) queryParams.append("range", params.range.toString());
      if (params.role) queryParams.append("role", params.role.toString());
      if (params.cardId) queryParams.append("cardId", params.cardId.toString());

      const url = `${this.getUrl()}?${queryParams.toString()}`;
      console.log("URL de búsqueda:", url);
      
      const response = await Api.get(url, true, controller);
      console.log("Respuesta de getPayments:", response);
      
      return response;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  /**
   * Get a specific payment by ID
   * @param {number} id Payment ID
   */
  static async getPayment(id, controller) {
    try {
      return await Api.get(this.getUrl(id), true, controller);
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw error;
    }
  }

  /**
   * Create a new payment request (pull)
   * @param {Object} paymentData Payment data
   * @param {number} paymentData.amount Amount to request
   * @param {string} paymentData.description Payment description
   */
  static async createPaymentRequest(paymentData, controller) {
    try {
      const formattedData = {
        amount: parseFloat(paymentData.amount),
        description: paymentData.description || "",
      };
      
      return await Api.post(this.getUrl("pull"), true, formattedData, controller);
    } catch (error) {
      console.error("Error creating payment request:", error);
      throw error;
    }
  }

  /**
   * Make a payment (push) using UUID
   * @param {string} uuid Payment UUID
   * @param {Object} paymentData Payment data
   * @param {number} [paymentData.cardId] Optional card ID to use for payment
   */
  static async makePayment(uuid, paymentData = {}, controller) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("uuid", uuid);
      if (paymentData.cardId) {
        queryParams.append("cardId", paymentData.cardId);
      }

      return await Api.put(
        `${this.getUrl("push")}?${queryParams.toString()}`,
        true,
        {},
        controller
      );
    } catch (error) {
      console.error("Error making payment:", error);
      throw error;
    }
  }

  /**
   * Transfer money to an email
   * @param {string} email Recipient email
   * @param {number} amount Amount to transfer
   * @param {string} [description] Optional description
   * @param {number} [cardId] Optional card ID to use
   */
  static async transferByEmail(email, amount, description, cardId, controller) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("email", email);
      if (cardId) {
        queryParams.append("cardId", cardId);
      }

      const data = {
        amount: parseFloat(amount),
        description: description || "",
      };

      return await Api.post(
        `${this.getUrl("transfer-email")}?${queryParams.toString()}`,
        true,
        data,
        controller
      );
    } catch (error) {
      console.error("Error transferring by email:", error);
      throw error;
    }
  }

  /**
   * Transfer money to a CVU
   * @param {string} cvu Recipient CVU
   * @param {number} amount Amount to transfer
   * @param {string} [description] Optional description
   * @param {number} [cardId] Optional card ID to use
   */
  static async transferByCvu(cvu, amount, description, cardId, controller) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("cvu", cvu);
      if (cardId) {
        queryParams.append("cardId", cardId);
      }

      const data = {
        amount: parseFloat(amount),
        description: description || "",
      };

      return await Api.post(
        `${this.getUrl("transfer-cvu")}?${queryParams.toString()}`,
        true,
        data,
        controller
      );
    } catch (error) {
      console.error("Error transferring by CVU:", error);
      throw error;
    }
  }

  /**
   * Transfer money to an alias
   * @param {string} alias Recipient alias
   * @param {number} amount Amount to transfer
   * @param {string} [description] Optional description
   * @param {number} [cardId] Optional card ID to use
   */
  static async transferByAlias(alias, amount, description, cardId, controller) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("alias", alias);
      if (cardId) {
        queryParams.append("cardId", cardId);
      }

      const data = {
        amount: parseFloat(amount),
        description: description || "",
      };

      return await Api.post(
        `${this.getUrl("transfer-alias")}?${queryParams.toString()}`,
        true,
        data,
        controller
      );
    } catch (error) {
      console.error("Error transferring by alias:", error);
      throw error;
    }
  }

  static async getPaymentByUuid(uuid, controller) {
    try {
      console.log("Buscando pago con UUID:", uuid);
      
      // Obtenemos todos los pagos sin filtros y buscamos el que tenga el UUID
      const response = await this.getPayments({
        pageSize: 1000,
        page: 1,
        pending: true, // Solo pagos pendientes
        role: 'RECEIVER' // Como receptor del pago
      }, controller);
      
      console.log("Respuesta:", response);
      
      if (!response || !response.results) {
        throw new Error("No se pudo obtener la información del pago");
      }

      // Buscamos el pago con el UUID específico
      const payment = response.results.find(p => p.uuid === uuid);
      
      if (!payment) {
        throw new Error("Pago no encontrado o ya fue procesado");
      }

      return payment;
    } catch (error) {
      console.error("Error fetching payment info:", error);
      throw error;
    }
  }
}
