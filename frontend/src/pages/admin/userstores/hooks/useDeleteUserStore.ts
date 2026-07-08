import { userStoreService } from "../../../../services/userStoreService";
import { useDelete } from "../../../../hooks/useDelete";
import { type UserStoreAccess } from "../ManageAccess";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteUserStore() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => userStoreService.delete(id),
    queryKey: ["userstores"],
    successMessage: ({ name }) => `Hak akses toko "${name}" berhasil dicabut dari sistem!`,
    errorMessage: ({ name }, err) =>
      `Gagal mencabut hak akses "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<UserStoreAccess[]>(["userstores"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, userName: string, storeName?: string) => {
    const displayName = storeName ? `${userName} (${storeName})` : userName;
    setDeleteTarget({ id, name: displayName });
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
