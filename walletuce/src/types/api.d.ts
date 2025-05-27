// API Response Types
export interface ApiError {
  code: number;
  description: string;
}

export interface Card {
  id: string;
  fullName: string;
  number: string;
  type: "CREDIT" | "DEBIT";
  expirationDate: string;
  cvv?: string;
}

export interface Account {
  balance: number;
  cvu: string;
  alias: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName?: string;
  birthDate?: string;
  metadata?: Record<string, unknown>;
}

export interface Payment {
  id: string;
  uuid: string;
  amount: number;
  description?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  payer?: User;
  receiver?: User;
  createdAt?: string;
}

// API Service Types
export interface CardService {
  getAll(): Promise<Card[]>;
  add(card: Omit<Card, "id">): Promise<Card>;
  remove(id: string): Promise<void>;
}

export interface AccountService {
  get(): Promise<Account>;
  recharge(data: { amount: number }): Promise<Account>;
  updateAlias(data: { alias: string }): Promise<Account>;
}

export interface UserService {
  get(): Promise<User>;
  login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string }>;
  register(data: User & { password: string }): Promise<User>;
  logout(): Promise<void>;
}

export interface PaymentService {
  createPaymentRequest(data: {
    amount: number;
    description?: string;
  }): Promise<Payment>;
  getPaymentInfo(id: string): Promise<Payment>;
  makePayment(uuid: string, data: { cardId?: string }): Promise<void>;
}
