import { AxiosError } from 'axios';

interface BackendErrorBody {
  success: false;
  message?: string;
  errors?: string[];
}

/** Extracts a single human-readable message from any error thrown by `apiClient`. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as BackendErrorBody | undefined;
    if (body?.errors?.length) return body.errors[0];
    if (body?.message) return body.message;
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return 'Could not reach the server. Check your connection and try again.';
    }
  }
  return fallback;
}
