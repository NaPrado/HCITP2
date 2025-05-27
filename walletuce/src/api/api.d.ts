import type { ApiError, Card, Account, User, Payment } from "../types/api";

declare module "../api/api.js" {
  export class Api {
    static token: string | null;
    static async request<T>(
      endpoint: string,
      options?: RequestInit
    ): Promise<T>;
    static handleError(error: unknown): ApiError;
  }
}

declare module "../api/user.js" {
  export class UserApi {
    static async get(): Promise<User>;
    static async login(credentials: {
      email: string;
      password: string;
    }): Promise<{ token: string }>;
    static async register(
      data: User & {
        password: string;
      }
    ): Promise<User>;
    static async logout(): Promise<void>;
  }
}

declare module "../api/account.js" {
  export class AccountApi {
    static async get(): Promise<Account>;
    static async recharge(data: { amount: number }): Promise<Account>;
    static async updateAlias(data: { alias: string }): Promise<Account>;
  }
}

declare module "../api/card.js" {
  export class CardApi {
    static async getAll(): Promise<Array<Card>>;
    static async add(card: Omit<Card, "id">): Promise<Card>;
    static async remove(id: string): Promise<void>;
  }
}

declare module "../api/payments.js" {
  export class PaymentsService {
    static async createPaymentRequest(data: {
      amount: number;
      description?: string;
    }): Promise<Payment>;
    static async getPaymentInfo(id: string): Promise<Payment>;
    static async makePayment(
      uuid: string,
      data: { cardId?: string }
    ): Promise<void>;
  }
}
