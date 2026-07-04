import { criteriaService } from "../../../../services/criteriaService";
import { useDelete } from "../../../../hooks/useDelete";
import { type Criteria } from "../CriteriaIndex";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteCriteria() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => criteriaService.delete(id),
    queryKey: ["criterias"],
    successMessage: ({ name }) => `Kriteria "${name}" berhasil dihapus dari sistem!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus kriteria "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<Criteria[]>(["criterias"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, code: string, name: string) => {
    const displayName = `[${code}] ${name}`;
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
