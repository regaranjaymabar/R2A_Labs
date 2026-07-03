import { brandService } from "../../../../services/brandService";
import { useDelete } from "../../../../hooks/useDelete";
import { type Brand } from "../BrandIndex";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => brandService.delete(id),
    queryKey: ["brands"],
    successMessage: ({ name }) => `Brand "${name}" berhasil dihapus dari database!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus brand "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<Brand[]>(["brands"], (old) =>
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
    handleDelete,
    confirmDelete,   // Pasang di atribut onConfirm komponen ModalConfirm
    cancelDelete,    // Pasang di atribut onClose komponen ModalConfirm
    deleteTarget,  
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables?.id : null,
  };
}
