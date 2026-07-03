import { brandService } from "../../../../services/brandService";
import { useDelete } from "../../../../hooks/useDelete";
import { type Brand } from "../BrandIndex";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteBrand() {
  const queryClient = useQueryClient();

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

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Apakah kamu yakin ingin menghapus brand "${name}" (ID: #${id}) dari database?`
      )
    ) {
      deleteMutation.mutate({ id, name });
    }
  };

  return {
    handleDelete,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables?.id : null,
  };
}
