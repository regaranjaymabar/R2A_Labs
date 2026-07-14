import { useState } from "react";
import { useDelete } from "./useDelete";
import { useQueryClient } from "@tanstack/react-query";

export interface UseDeleteWithConfirmOptions<TTarget = { id: number; name: string }> {
  mutationFn: (target: TTarget) => Promise<any>;
  queryKey: string[];
  successMessage?: (target: TTarget) => string;
  errorMessage?: (target: TTarget, err: any) => string;
  onOfflineFallback?: (target: TTarget, oldData: any[] | undefined) => any[];
}

export function useDeleteWithConfirm<TTarget extends { name: string; id?: number } = { id: number; name: string }>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
  onOfflineFallback,
}: UseDeleteWithConfirmOptions<TTarget>) {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<TTarget | null>(null);

  const deleteMutation = useDelete<TTarget>({
    mutationFn,
    queryKey,
    successMessage,
    errorMessage,
    onOfflineFallback: (target) => {
      queryClient.setQueryData<any[]>(queryKey, (old) => {
        if (!old || !Array.isArray(old)) return [];
        if (onOfflineFallback) {
          return onOfflineFallback(target, old);
        }
        if (target.id !== undefined) {
          return old.filter((item) => item.id !== target.id);
        }
        return old;
      });
    },
  });

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting: deleteMutation.isPending,
    deleteMutation,
  };
}
