import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
        toast.success(successMessage(variables));
      }

      // 1. Langsung hapus baris tabel dari cache UI secara instan agar tidak perlu menunggu network re-fetch
      const targetId =
        variables && typeof variables === "object" && "id" in variables
          ? (variables as any).id
          : typeof variables === "number" || typeof variables === "string"
          ? variables
          : undefined;

      if (targetId !== undefined) {
        queryClient.setQueryData<any[]>(queryKey, (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.filter((item) => item?.id !== targetId);
        });
      }

      // 2. Tetap lakukan invalidateQueries agar sinkronisasi dengan database backend berjalan di background
      queryClient.invalidateQueries({
        queryKey,
      });
    },
    onError: (err: any, variables) => {
      console.error("Mutation Delete Error:", err);

      const targetId =
        variables && typeof variables === "object" && "id" in variables
          ? (variables as any).id
          : typeof variables === "number" || typeof variables === "string"
          ? variables
          : undefined;

      const errorText = String(err?.response?.data?.message || err?.message || "").toLowerCase();
      const isNotFound = err?.response?.status === 404 || errorText.includes("not found");

      // Jika error karena data sudah tidak ada di server (404 / not found), hapus dari tabel UI & sync ulang
      if (isNotFound) {
        if (targetId !== undefined) {
          queryClient.setQueryData<any[]>(queryKey, (oldData) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;
            return oldData.filter((item) => item?.id !== targetId);
          });
        }
        queryClient.invalidateQueries({ queryKey });
        toast.success("Data sudah tidak ada di server, tabel telah disinkronkan!");
        return;
      }

      // Fallback untuk development lokal jika backend offline:
      if (!err.response && onOfflineFallback) {
        onOfflineFallback(variables);
        if (successMessage) {
          toast.success(`${successMessage(variables)} (Mode Offline/Lokal)`);
        }
        return;
      }

      if (errorMessage) {
        toast.error(errorMessage(variables, err));
      } else {
        const defaultMsg = err?.response?.data?.message || err?.message || "Gagal menghapus data.";
        toast.error(`Gagal menghapus data: ${defaultMsg}`);
      }
    },
  });
}
