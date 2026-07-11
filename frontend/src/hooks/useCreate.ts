import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface CreateOptions<TVariables = any, TData = any> {
  mutationFn: (data: TVariables) => Promise<TData>;
  queryKey: string[];
  navigateTo?: string;
  successMessage?: (data: TVariables) => string;
  errorMessage?: (data: TVariables, error: any) => string;
  onOfflineFallback?: (data: TVariables) => void;
}

export function useCreate<TVariables = any, TData = any>({
  mutationFn,
  queryKey,
  navigateTo,
  successMessage,
  errorMessage,
  onOfflineFallback,
}: CreateOptions<TVariables, TData>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<TData, any, TVariables>({
    mutationFn,
    onSuccess: (_, variables) => {
      if (successMessage) {
        toast.success(successMessage(variables));
      }

      queryClient.invalidateQueries({
        queryKey,
      });

      if (navigateTo) {
        navigate(navigateTo);
      }
    },
    onError: (err: any, variables) => {
      console.error("Mutation Create Error:", err);
      if (errorMessage) {
        toast.error(errorMessage(variables, err));
      } else {
        const defaultMsg = err?.response?.data?.message || err?.message || "Gagal menyimpan data.";
        toast.error(`Gagal menyimpan data: ${defaultMsg}`);
      }

      // Fallback untuk development lokal jika backend offline:
      if (!err.response) {
        if (onOfflineFallback) {
          onOfflineFallback(variables);
        } else if (navigateTo) {
          if (successMessage) {
            toast.success(`${successMessage(variables)} (Simulasi Lokal/Offline)`);
          }
          navigate(navigateTo);
        }
      }
    },
  });
}
