export const handleError = (
  error: any,
  setFormError: (error: Record<string, string[]> | string | null) => void,
  defaultMessage: string
) => {
  const errorMessage = error?.response?.data?.errors || defaultMessage;
  setFormError(errorMessage);
  return new Error(errorMessage);
};
