import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreate } from "../../../../hooks/useCreate";
import { storeService } from "../../../../services/storeService";

// 1. Skema Validasi Zod untuk tabel stores di database
export const storeSchema = z.object({
  name: z
    .string()
    .min(1, "Nama toko wajib diisi!")
    .min(3, "Nama toko minimal terdiri dari 3 karakter"),
  address: z.string().min(1, "Alamat toko wajib diisi!"),
  city: z.string().min(1, "Kota cabang toko wajib diisi!"),
  phone: z
    .string()
    .min(1, "Nomor telepon toko wajib diisi!")
    .max(12, "Nomor telepon maksimal 12 karakter (sesuai spesifikasi backend)!"),
  is_active: z.boolean(),
});

// Alias StoreSchema untuk menjaga kompatibilitas impor
export const StoreSchema = storeSchema;

export type StoreFormData = z.infer<typeof storeSchema>;

export function useAddStore() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      is_active: true, // Default diatur ke "Aktif" (true)
    },
  });

  const isActive = watch("is_active");

  // Mutasi dengan Generic Hook useCreate + Store Service
  const createMutation = useCreate<StoreFormData>({
    mutationFn: (payload) => storeService.create(payload),
    queryKey: ["stores"],
    navigateTo: "/admin/stores",
    successMessage: (variables) =>
      `Cabang toko "${variables.name}" berhasil didaftarkan dengan status: ${
        variables.is_active ? "Aktif (Live)" : "Nonaktif (Draft)"
      }!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan toko "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: StoreFormData) => {
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
    isActive,
  };
}
