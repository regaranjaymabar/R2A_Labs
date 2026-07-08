import { useState } from "react";
import { useDelete } from "../../../../hooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import { productStoreService } from "../../../../services/productStoreService";
import type { ProductStore } from "../../../../types/productStore";


export function useDeleteProductStore() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => productStoreService.delete(id),
    queryKey: ["productstores"],
    successMessage: ({ name }) => `Data stok untuk produk "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus data produk "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<ProductStore[]>(["productstores"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, productName: string, storeName?: string) => {
    const displayName = storeName ? `${productName}" dari cabang "${storeName}` : productName;
    setDeleteTarget({ id, name: displayName });
  };

  // 2. Dipanggil saat tombol "Ya, Hapus" di dalam modal diklik -> Jalankan API Delete
  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          setDeleteTarget(null); // Tutup modal otomatis setelah berhasil
        },
      });
    }
  };

  // 3. Dipanggil saat tombol "Batal" atau "X" diklik -> Tutup Modal
  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return {
    handleDelete,    // Pasang di atribut onDelete komponen tabel
    confirmDelete,   // Pasang di atribut onConfirm komponen ModalConfirm
    cancelDelete,    // Pasang di atribut onClose komponen ModalConfirm
    deleteTarget,    // Untuk mengecek apakah modal sedang terbuka (Boolean(deleteTarget))
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables?.id : null,
  };
}
