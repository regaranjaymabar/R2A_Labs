import { userService } from "../../../../services/userService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";
import toast from "react-hot-toast";

export function useDeleteUser() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id }) => userService.delete(id),
    queryKey: ["users"],
    successMessage: ({ name }) => `Pengguna "${name}" berhasil dihapus secara permanen!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus pengguna "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, name: string) => {
    if (id === 1) {
      toast.error("Akun Super Admin Utama (#1) tidak boleh dihapus secara permanen!");
      return;
    }
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
