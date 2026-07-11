import { subCriteriaService } from "../../../../services/subCriteriaService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteSubCriteria() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id }) => subCriteriaService.delete(id),
    queryKey: ["subcriterias"],
    successMessage: ({ name }) => `Sub-kriteria "${name}" berhasil dihapus dari database!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus sub-kriteria "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, desc: string, criteriaCode?: string) => {
    const displayName = criteriaCode ? `[${criteriaCode}] ${desc}` : desc;
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
