import { useState } from "react";
import { productWeightService } from "../../../../services/productWeightService";
import { useDelete } from "../../../../hooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import type { ProductWeight } from "../../../../types/productWeight";

export function useDeleteProductWeight() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ ids: number[]; name: string } | null>(null);

  const deleteMutation = useDelete<{ ids: number[]; name: string }>({
    mutationFn: async ({ ids }) => {
      await Promise.all(ids.map((id) => productWeightService.delete(id)));
    },
    queryKey: ["productweights"],
    successMessage: ({ name }) => `Semua bobot kriteria untuk "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus bobot kriteria "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ ids }) => {
      queryClient.setQueryData<ProductWeight[]>(["productweights"], (old) =>
        old ? old.filter((item) => !ids.includes(item.id)) : []
      );
    },
  });

  const handleDelete = (idOrIds: number | number[], prodName: string, critName: string = "") => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const displayName = critName && critName !== "Semua Bobot Kriteria" ? `${prodName} [${critName}]` : prodName;
    setDeleteTarget({ ids, name: displayName });
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
    deletingId: deleteMutation.isPending ? deleteMutation.variables?.ids[0] : null,
    deletingIds: deleteMutation.isPending ? deleteMutation.variables?.ids || [] : [],
  };
}
