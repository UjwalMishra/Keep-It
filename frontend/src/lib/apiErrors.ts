export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  const anyErr = err as {
    response?: { data?: { msg?: string; errors?: Record<string, string[]> } };
    message?: string;
  };

  const errors = anyErr?.response?.data?.errors;
  if (errors) {
    const first = Object.values(errors).flat()[0];
    if (first) return first;
  }

  return anyErr?.response?.data?.msg || anyErr?.message || fallback;
}
