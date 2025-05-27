import { Api } from "./api.js";

export function formatCardNumber(value) {
  if (!value) return "";
  const cleaned = value.replace(/\s/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
}

export function cleanCardNumber(value) {
  return value.replace(/\s/g, "");
}

export function formatDisplayNumber(number) {
  return `**** **** **** ${number.slice(-4)}`;
}

export function formatCardType(type) {
  return type === "CREDIT" ? "Crédito" : "Débito";
}

export const CARD_TYPES = [
  { value: "CREDIT", text: "Crédito" },
  { value: "DEBIT", text: "Débito" },
];
