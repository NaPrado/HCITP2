import type { Router } from "vue-router";
import { API_ERROR_CODES, ROUTES } from "../constants";
import type { ApiError } from "../types/api";

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "description" in error
  );
}

export function handleApiError(
  error: unknown,
  router: Router,
  defaultMessage = "Error desconocido"
): string {
  console.error("API Error:", error);

  if (isApiError(error)) {
    if (error.code === API_ERROR_CODES.UNAUTHORIZED) {
      router.push(ROUTES.LOGIN);
      return error.description;
    }
    return error.description;
  }

  return defaultMessage;
}
