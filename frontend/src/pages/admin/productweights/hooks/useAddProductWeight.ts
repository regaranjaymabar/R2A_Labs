import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productWeightService } from "../../../../services/productWeightService";
import { useCreate } from "../../../../hooks/useCreate";

// Skema Validasi Zod untuk pembobotan kriteria produk (product_criteria)
export const productWeightSchema = z.object({
  product_id: z.coerce.number().min(1, "Pilih produk laptop terlebih dahulu!"),
  criteria_id: z.coerce.number().min(1, "Pilih kriteria penilaian terlebih dahulu!"),
  sub_criteria_id: z.coerce.number().min(1, "Pilih sub-kriteria / spesifikasi terlebih dahulu!"),
  value_numeric: z.coerce.number().min(0, "Nilai numerik tidak valid!"),
});

export type ProductWeightFormData = z.infer<typeof productWeightSchema>;

export function useAddProductWeight() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductWeightFormData>({
    resolver: zodResolver(productWeightSchema) as any,
    defaultValues: {
      product_id: 0,
      criteria_id: 0,
      sub_criteria_id: 0,
      value_numeric: 0,
    },
  });

  const createMutation = useCreate<ProductWeightFormData>({
    mutationFn: productWeightService.create,
    queryKey: ["productweights"],
    navigateTo: "/admin/productweights",
    successMessage: (variables) =>
      `Pembobotan untuk produk "${variables.product_id}" berhasil ditambahkan!`,
    errorMessage: (variables, err) =>
      `Gagal menambahkan pembobotan untuk produk "${variables.product_id}": ${err?.message || "Unknown error"}`,
  });

  const onSubmit = (data: ProductWeightFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: createMutation.isPending,
  };
}
