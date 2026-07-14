import { productWeightService } from "../../../../services/productWeightService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteProductWeight() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm<{ ids: number[]; name: string }>({
    mutationFn: async ({ ids }) => {
      await Promise.all(ids.map((id) => productWeightService.delete(id)));
    },
    queryKey: ["productweights"],
    successMessage: ({ name }) => `Semua bobot kriteria untuk "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus bobot kriteria "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: (target, oldData) =>
      oldData ? oldData.filter((item) => !target.ids.includes(item.id)) : [],
  });

  const handleDelete = (idOrIds: number | number[], prodName: string, critName: string = "") => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const displayName = critName && critName !== "Semua Bobot Kriteria" ? `${prodName} [${critName}]` : prodName;
    setDeleteTarget({ ids, name: displayName });
  };

  return {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting,
    deletingId: isDeleting ? deleteMutation.variables?.ids[0] : null,
    deletingIds: isDeleting ? deleteMutation.variables?.ids || [] : [],
  };
}
