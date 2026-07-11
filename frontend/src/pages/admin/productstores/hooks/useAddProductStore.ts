import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productStoreService } from "../../../../services/productStoreService";
import { useCreate } from "../../../../hooks/useCreate";

// 1. Skema Validasi Zod untuk tabel brands di database
export const productStoreSchema = z.object({
   product_id: z.coerce.number().min(1, "Pilih produk laptop terlebih dahulu!"),
  store_id: z.coerce.number().min(1, "Pilih toko penjual terlebih dahulu!"),
  price: z.coerce.number().min(1, "Harga wajib diisi dan harus lebih dari 0!"),
  stock: z.coerce.number().min(0, "Stok tidak boleh bernilai negatif!"),
  is_available: z.boolean(),
});

export type ProductStoreFormData = z.infer<typeof productStoreSchema>;

export function useAddProductStore() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductStoreFormData>({
    resolver: zodResolver(productStoreSchema) as any,
    defaultValues: {
      product_id: 0,
      store_id: 0,
      price: 0,
      stock: 0,
      is_available: true,
    },
  });

  const isAvailable = watch("is_available");

  // Mutasi dengan Generic Hook useCreate + Brand Service (Sangat Ringkas & Reusable)
  const createMutation = useCreate<any>({
    mutationFn: (payload) => productStoreService.create(payload),
    queryKey: ["productstores"],
    navigateTo: "/admin/productstores",
    successMessage: () => `Data harga dan stok berhasil ditambahkan!`,
    errorMessage: (_, err) =>
      `Gagal menyimpan harga dan stok: ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: ProductStoreFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: createMutation.isPending,
    isAvailable,
  };
}
