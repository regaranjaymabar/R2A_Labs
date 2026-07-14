import { criteriaService } from "../../../../services/criteriaService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteCriteria() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id }) => criteriaService.delete(id),
    queryKey: ["criterias"],
    successMessage: ({ name }) => `Kriteria "${name}" berhasil dihapus dari sistem!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus kriteria "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, code: string, name: string) => {
    const displayName = `[${code}] ${name}`;
    setDeleteTarget({ id, name: displayName });
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
