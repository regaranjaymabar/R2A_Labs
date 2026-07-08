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
});

export type BrandFormData = z.infer<typeof brandSchema>;

export function useAddBrand() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
    },
  });

  const createMutation = useCreate<BrandFormData>({
    mutationFn: (payload) => brandService.create(payload),
    queryKey: ["brands"],
    navigateTo: "/admin/brands",
    successMessage: (variables) =>
      `Brand "${variables.name}" berhasil ditambahkan!`,
    errorMessage: (variables, err) =>
      `Gagal menambahkan brand "${variables.name}": ${
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
  };
}
