import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productService } from "../../../../services/productService";
import { useCreate } from "../../../../hooks/useCreate";


export const productSchema = z.object({
  brandId: z.coerce.number().min(1, "Pilih merek laptop terlebih dahulu!"),
  modelName: z.string().min(1, "Nama model laptop wajib diisi!"),
  screenSize: z.coerce.number().optional(),
  processor: z.string().min(1, "Processor wajib diisi!"),
  ram: z.string().min(1, "Kapasitas RAM wajib diisi!"),
  storage: z.string().min(1, "Storage wajib diisi!"),
  battery: z.string().optional(),
  weight: z.coerce.number().min(0.1, "Berat laptop wajib diisi!"),
  releaseYear: z.string().min(4, "Tahun rilis wajib diisi!"),
  subCriteriaIds: z.array(z.number()).default([]),
  is_active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

export function useAddProduct() {
 
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      is_active: true,
    },
  });

  const isActive = watch("is_active");

    const createMutation = useCreate<ProductFormData>({
    mutationFn: (payload) => productService.create(payload),
    queryKey: ["products"],
    navigateTo: "/admin/products",
    successMessage: (variables) =>
      `Produk "${variables.modelName}" berhasil didaftarkan dengan status: ${variables.is_active ? "Aktif (Live)" : "Nonaktif (Draft)"
      }!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan produk "${variables.modelName}": ${err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: ProductFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors,
    isSubmitting: createMutation.isPending,
    isActive,
  };
}
