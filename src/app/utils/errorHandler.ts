export interface APIError {
  response?: {
    data?: {
      errors?: Record<string, string[]> | string;
    };
  };
  message?: string;
}

// Utility function to handle errors
export const handleMutationError = (
  error: APIError,
  defaultMessage: string,
  setFormError?: (error: Record<string, string[]> | string | null) => void
): Error => {
  const errorMessage =
    typeof error?.response?.data?.errors === "string"
      ? error.response.data.errors
      : defaultMessage;
  setFormError?.(error?.response?.data?.errors || null);
  return new Error(errorMessage);
};
