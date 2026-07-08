import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export interface UpdateOptions<TVariables = any, TData = any> {
  mutationFn: (data: TVariables) => Promise<TData>;
  queryKey: string[];
  navigateTo?: string;
  successMessage?: (data: TVariables) => string;
  errorMessage?: (data: TVariables, error: any) => string;
  onOfflineFallback?: (data: TVariables) => void;
}

export function useUpdate<TVariables = any, TData = any>({
  mutationFn,
  queryKey,
  navigateTo,
  successMessage,
  errorMessage,
  onOfflineFallback,
}: UpdateOptions<TVariables, TData>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<TData, any, TVariables>({
    mutationFn,
    onSuccess: (_, variables) => {
      if (successMessage) {
        alert(successMessage(variables));
      }

      // Invalidate cache agar tabel maupun form langsung update
      queryClient.invalidateQueries({
        queryKey,
      });

      if (navigateTo) {
        navigate(navigateTo);
      }
    },
    onError: (err: any, variables) => {
      console.error("Mutation Update Error:", err);
      if (errorMessage) {
        alert(errorMessage(variables, err));
      } else {
        const defaultMsg = err?.response?.data?.message || err?.message || "Gagal memperbarui data.";
        alert(`Gagal memperbarui data: ${defaultMsg}`);
      }

      // Fallback untuk development lokal jika backend offline:
      if (!err.response) {
        if (onOfflineFallback) {
          onOfflineFallback(variables);
        } else if (navigateTo) {
          if (successMessage) {
            alert(`${successMessage(variables)} (Simulasi Lokal/Offline)`);
          }
          queryClient.invalidateQueries({ queryKey });
          navigate(navigateTo);
        }
      }
    },
  });
}
