import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { brandService } from "../../../../services/brandService";
import { useCreate } from "../../../../hooks/useCreate";

// 1. Skema Validasi Zod untuk tabel brands di database
export const brandSchema = z.object({
  name: z
    .string()
    .min(1, "Nama merek laptop wajib diisi!")
    .min(2, "Nama merek minimal terdiri dari 2 karakter"),
  is_active: z.boolean(),
});

export type BrandFormData = z.infer<typeof brandSchema>;

export function useAddBrand() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      is_active: true, // Default diatur ke "Aktif" (true)
    },
  });

  const isActive = watch("is_active");

  // Mutasi dengan Generic Hook useCreate + Brand Service (Sangat Ringkas & Reusable)
  const createMutation = useCreate<BrandFormData>({
    mutationFn: (payload) => brandService.create(payload),
    queryKey: ["brands"],
    navigateTo: "/admin/brands",
    successMessage: (variables) =>
      `Merek "${variables.name}" berhasil didaftarkan dengan status: ${
        variables.is_active ? "Aktif (Live)" : "Nonaktif (Draft)"
      }!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan brand "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: BrandFormData) => {
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
