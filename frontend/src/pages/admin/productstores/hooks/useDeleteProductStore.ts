import { productStoreService } from "../../../../services/productStoreService";
import { useDeleteWithConfirm } from "../../../../hooks/useDeleteWithConfirm";

export function useDeleteProductStore() {
  const {
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    cancelDelete,
    isDeleting,
    deleteMutation,
  } = useDeleteWithConfirm({
    mutationFn: ({ id, name }) => productStoreService.delete(id, name),
    queryKey: ["productstores"],
    successMessage: ({ name }) => `Data stok untuk produk "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus data produk "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const handleDelete = (id: number, productName: string, storeName?: string) => {
    const displayName = storeName ? `${productName}" dari cabang "${storeName}` : productName;
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
