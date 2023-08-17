import { AxiosError } from "axios";
import toast from "react-hot-toast";

/**
 * Wrapper for toast.error that handles AxiosError and Error
 * @param err The error to handle
 * @param toastId The id of the toast, for use in limiting the number of toasts shown at once
 * @param msg A message to show instead of the error
 */
export function handleToastError(err: unknown, toastId: string, msg?: string) {
  const error =
    err instanceof AxiosError
      ? err?.response?.data?.error
      : (err as Error).message;
  toast.error(msg || error || "An error occurred.", {
    id: toastId,
  });
}
