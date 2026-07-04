import { useState } from "react";
import { productWeightService } from "../../../../services/productWeightService";
import { useDelete } from "../../../../hooks/useDelete";
import { type ProductCriteria } from "../ProductWeightIndex";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteProductWeight() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => productWeightService.delete(id),
    queryKey: ["productweights"],
    successMessage: ({ name }) => `Bobot spesifikasi "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus bobot spesifikasi "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<ProductCriteria[]>(["productweights"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  const handleDelete = (id: number, prodName: string, critName: string) => {
    const displayName = `${prodName} [${critName}]`;
    setDeleteTarget({ id, name: displayName });
  };

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
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables?.id : null,
  };
}
