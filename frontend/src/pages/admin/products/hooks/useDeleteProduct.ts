import { useState } from "react";
import { useDelete } from "../../../../hooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../../services/productService";
import type { Product } from "../../../../types/product";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => productService.delete(id),
    queryKey: ["products"],
    successMessage: ({ name }) => `Produk "${name}" berhasil dihapus dari database!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus produk "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<Product[]>(["products"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, name: string) => {
    setDeleteTarget({ id, name });
  };

  // 2. Dipanggil saat tombol Ya, Hapus di dalam modal diklik -> Jalankan API Delete
  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      });
    }
  };

  // 3. Dipanggil saat tombol Batal atau X diklik -> Tutup Modal
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
