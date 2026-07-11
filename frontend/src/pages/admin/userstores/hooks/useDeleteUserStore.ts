import { userStoreService } from "../../../../services/userStoreService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteUserStore() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id }) => userStoreService.delete(id),
    queryKey: ["userstores"],
    successMessage: ({ name }) => `Hak akses toko "${name}" berhasil dicabut dari sistem!`,
    errorMessage: ({ name }, err) =>
      `Gagal mencabut hak akses "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, userName: string, storeName?: string) => {
    const displayName = storeName ? `${userName} (${storeName})` : userName;
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
