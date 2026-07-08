import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productService } from "../../../../services/productService";
import { useCreate } from "../../../../hooks/useCreate";

// 1. Skema Validasi Zod untuk tabel products di database
export const productSchema = z.object({
  brand_id: z.coerce.number().min(1, "Pilih merek laptop terlebih dahulu!"),
  model_name: z.string().min(1, "Nama model laptop wajib diisi!"),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  screen_size: z.coerce.number().optional(),
  battery: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  release_year: z.coerce.number().optional(),
  is_active: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export function useAddProduct() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
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

  // Mutasi dengan Generic Hook useCreate + Product Service (Sangat Ringkas & Reusable)
  const createMutation = useCreate<ProductFormData>({
    mutationFn: (payload) => productService.create(payload),
    queryKey: ["products"],
    navigateTo: "/admin/products",
    successMessage: (variables) =>
      `Produk "${variables.model_name}" berhasil didaftarkan dengan status: ${variables.is_active ? "Aktif (Live)" : "Nonaktif (Draft)"
      }!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan produk "${variables.model_name}": ${err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: ProductFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors,
    isSubmitting: createMutation.isPending,
    isActive,
  };
}
