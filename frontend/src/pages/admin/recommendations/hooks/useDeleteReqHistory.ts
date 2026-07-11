import { recommendationService } from "../../../../services/recommendationService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteReqHistory() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id }) => recommendationService.delete(id),
    queryKey: ["recommendations"],
    successMessage: ({ name }) => `Riwayat pencarian SPK dari "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus riwayat "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, userName: string) => {
    setDeleteTarget({ id, name: userName });
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
