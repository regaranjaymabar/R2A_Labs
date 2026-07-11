import { storeService } from "../../../../services/storeService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteStore() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id }) => storeService.delete(id),
    queryKey: ["stores"],
    successMessage: ({ name }) => `Toko "${name}" berhasil dihapus dari database!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus toko "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, name: string) => {
    setDeleteTarget({ id, name });
  };

  return {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting,
    deletingId: isDeleting ? deleteMutation.variables?.id : null,
  };
}
