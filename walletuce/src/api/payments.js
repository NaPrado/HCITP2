import { Api } from './api.js';

export class PaymentsService {
  static getUrl(slug) {
    if (slug === 'pull') {
      return `${Api.baseUrl}/payment/pull`;
    }
    if (slug === 'push') {
      return `${Api.baseUrl}/payment/push`;
    }
    return `${Api.baseUrl}/payment${slug ? `/${slug}` : ''}`;
  }

  static async getPaymentInfo(paymentId) {
    try {
      const response = await Api.get(this.getUrl(paymentId), true);
      return response;
    } catch (error) {
      console.error('Error fetching payment info:', error);
      throw error;
    }
  }

  static async makePayment(paymentId, paymentData) {
    try {
      const response = await Api.put(`${Api.baseUrl}/payment/push?uuid=${paymentId}`, true, paymentData);
      return response;
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }

  static async createPaymentRequest(paymentData) {
    try {
      // Asegurarnos de que los datos estén en el formato correcto
      const formattedData = {
        type: "payment",
        amount: parseFloat(paymentData.amount),
        description: paymentData.description || ""
      };

      console.log('Sending formatted payment data:', formattedData);
      const response = await Api.post(this.getUrl('pull'), true, formattedData);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw error;
    }
  }
} 