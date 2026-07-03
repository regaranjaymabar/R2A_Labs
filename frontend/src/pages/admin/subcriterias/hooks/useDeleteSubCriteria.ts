import { subCriteriaService } from "../../../../services/subCriteriaService";
import { useDelete } from "../../../../hooks/useDelete";
import { type SubCriteria } from "../SubCriteriaIndex";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDeleteSubCriteria() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => subCriteriaService.delete(id),
    queryKey: ["subcriterias"],
    successMessage: ({ name }) => `Sub-kriteria "${name}" berhasil dihapus dari database!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus sub-kriteria "${name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<SubCriteria[]>(["subcriterias"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  // 1. Dipanggil saat tombol ikon tong sampah di tabel diklik -> Buka Modal Confirm
  const handleDelete = (id: number, desc: string, criteriaCode?: string) => {
    const displayName = criteriaCode ? `[${criteriaCode}] ${desc}` : desc;
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
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables?.id : null,
  };
}
