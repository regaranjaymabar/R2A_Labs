import { recommendationService } from "../../../../services/recommendationService";
import { useDelete } from "../../../../hooks/useDelete";
import { type RecommendationRequest } from "../../../../types/recomendation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteReqHistory() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => recommendationService.delete(id),
    queryKey: ["recommendations"],
    successMessage: ({ name }) => `Riwayat pencarian SPK dari "${name}" berhasil dihapus!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus riwayat "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<RecommendationRequest[]>(["recommendations"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, userName: string) => {
    setDeleteTarget({ id, name: userName });
  };

  // 2. Dipanggil saat tombol "Ya, Hapus" di dalam modal diklik -> Jalankan API Delete
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
