import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface DeleteOptions<TVariables = any, TData = any> {
  mutationFn: (data: TVariables) => Promise<TData>;
  queryKey: string[];
  successMessage?: (data: TVariables) => string;
  errorMessage?: (data: TVariables, error: any) => string;
  onOfflineFallback?: (data: TVariables) => void;
}

export function useDelete<TVariables = any, TData = any>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
  onOfflineFallback,
}: DeleteOptions<TVariables, TData>) {
  const queryClient = useQueryClient();

  return useMutation<TData, any, TVariables>({
    mutationFn,
    onSuccess: (_, variables) => {
      if (successMessage) {
        alert(successMessage(variables));
      }

      queryClient.invalidateQueries({
        queryKey,
      });
    },
    onError: (err: any, variables) => {
      console.error("Mutation Delete Error:", err);
      if (errorMessage) {
        alert(errorMessage(variables, err));
      } else {
        const defaultMsg = err?.response?.data?.message || err?.message || "Gagal menghapus data.";
        alert(`Gagal menghapus data: ${defaultMsg}`);
      }

      // Fallback untuk development lokal jika backend offline:
      if (!err.response && onOfflineFallback) {
        onOfflineFallback(variables);
      }
    },
  });
}
