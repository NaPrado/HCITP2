import { Api } from "./api.js";

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

  // GET /api/payment
  static async getPayments(controller) {
    try {
      return await Api.get(this.getUrl(), true, controller);
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
  static async transferByEmail(email, amount, description = "", controller) {
    try {
      const data = { email, amount: parseFloat(amount), description };
      return await Api.post(
        this.getUrl("transfer-email"),
        true,
        data,
        controller
      );
    } catch (error) {
      console.error("Error transferring by email:", error);
      throw error;
    }
  }

  // POST /api/payment/transfer-cvu
  static async transferByCvu(cvu, amount, description = "", controller) {
    try {
      const data = { cvu, amount: parseFloat(amount), description };
      return await Api.post(
        this.getUrl("transfer-cvu"),
        true,
        data,
        controller
      );
    } catch (error) {
      console.error("Error transferring by CVU:", error);
      throw error;
    }
  }

  // POST /api/payment/transfer-alias
  static async transferByAlias(alias, amount, description = "", controller) {
    try {
      const data = { alias, amount: parseFloat(amount), description };
      return await Api.post(
        this.getUrl("transfer-alias"),
        true,
        data,
        controller
      );
    } catch (error) {
      console.error("Error transferring by alias:", error);
      throw error;
    }
  }
}
