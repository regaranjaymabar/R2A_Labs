import { useDelete } from "../../../../hooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../../services/productService";
import type { Product } from "../ProductIndex";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const deleteMutation = useDelete<{ id: number; name: string }>({
    mutationFn: ({ id }) => productService.delete(id),
    queryKey: ["products"],
    successMessage: ({ name }) => `Produk "${name}" berhasil dihapus dari database!`,
    errorMessage: ({ name }, err) =>
      `Gagal menghapus produk "${name}": ${err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: ({ id }) => {
      queryClient.setQueryData<Product[]>(["products"], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Apakah kamu yakin ingin menghapus produk "${name}" (ID: #${id}) dari database?`
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
