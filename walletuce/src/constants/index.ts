import type { Card } from "../types/api";

export const CARD_TYPES: ReadonlyArray<{
  text: string;
  value: Card["type"];
}> = [
  { text: "Crédito", value: "CREDIT" },
  { text: "Débito", value: "DEBIT" },
] as const;

export const ROUTES = {
  HOME: "/HomePage",
  LOGIN: "/login",
  PROFILE: "/profile",
  ADMIN_CARDS: "/AdminCardsPage",
  DEPOSIT: "/DepositPage",
  CONFIRM_DEPOSIT: "/ConfirmDeposit",
  TRANSFER: "/TransferPage",
  MOVEMENTS: "/movements",
  GENERATE_PAYMENT: "/GeneratePaymentPage",
  MAKE_PAYMENT: "/MakePaymentPage",
  CONFIRM_PAYMENT: "/ConfirmPayment",
  PAYMENT_SUCCESS: "/PaymentSuccess",
  LANDING: "/LandingPage",
  HELP: "/help",
} as const;

export const API_ERROR_CODES = {
  UNAUTHORIZED: 97,
} as const;

export const CURRENCY_FORMAT_OPTIONS = {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
} as const;

export const DEFAULT_SNACKBAR_TIMEOUT = 3000;

// Tipos derivados de las constantes
export type Routes = typeof ROUTES;
export type RouteKeys = keyof Routes;
export type RouteValues = Routes[RouteKeys];

export type ApiErrorCodes = typeof API_ERROR_CODES;
export type ApiErrorCodeKeys = keyof ApiErrorCodes;
export type ApiErrorCodeValues = ApiErrorCodes[ApiErrorCodeKeys];
