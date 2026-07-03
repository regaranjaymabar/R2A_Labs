import { userService } from "../../../../services/userService";
import { useDelete } from "../../../../hooks/useDelete";
import { type UserData } from "../UserIndex";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => userService.delete(id),
    queryKey: ["users"],
    successMessage: ({ name }) => `Pengguna "${name}" berhasil dihapus secara permanen!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus pengguna "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<UserData[]>(["users"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, name: string) => {
    if (id === 1) {
      alert("⚠️ Akun Super Admin Utama (#1) tidak boleh dihapus secara permanen!");
      return;
    }
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
