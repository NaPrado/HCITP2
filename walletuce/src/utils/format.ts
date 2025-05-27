import { CURRENCY_FORMAT_OPTIONS } from "../constants";
import type { Card } from "../types/api";

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-AR", CURRENCY_FORMAT_OPTIONS);
}

export function formatCardNumber(number: string): string {
  const cleaned = number.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(" ");
}

export function cleanCardNumber(number: string): string {
  return number.replace(/\D/g, "");
}

export function formatDisplayNumber(number: string): string {
  return `**** ${number.slice(-4)}`;
}

export function formatCardType(type: Card["type"]): string {
  return type === "CREDIT" ? "Crédito" : "Débito";
}

export function formatFullName(firstName: string, lastName?: string): string {
  return firstName + (lastName ? ` ${lastName}` : "");
}

export function formatCardDisplay(card: Card): string {
  return `${card.fullName} - ${formatDisplayNumber(card.number)}`;
}
