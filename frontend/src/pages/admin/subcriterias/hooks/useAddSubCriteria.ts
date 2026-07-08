import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { subCriteriaService } from "../../../../services/subCriteriaService";
import { useCreate } from "../../../../hooks/useCreate";

// 1. Skema Validasi Zod untuk tabel subcriterias di database
export const subCriteriaSchema = z.object({
  criteria_id: z.coerce.number().min(1, "Kriteria wajib dipilih!"),
  description: z
    .string()
    .min(1, "Deskripsi spesifikasi/rentang wajib diisi!"),
  value_numeric: z.coerce.number().min(0, "Nilai numerik minimal 0"),
});

export type SubCriteriaFormData = z.infer<typeof subCriteriaSchema>;

export function useAddSubCriteria() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubCriteriaFormData>({
    resolver: zodResolver(subCriteriaSchema) as any,
    defaultValues: {
      criteria_id: 1,
      description: "",
      value_numeric: 1.0,
    },
  });

  // Mutasi dengan Generic Hook useCreate + SubCriteria Service
  const createMutation = useCreate<SubCriteriaFormData>({
    mutationFn: (payload) => subCriteriaService.create(payload),
    queryKey: ["subcriterias"],
    navigateTo: "/admin/subcriterias",
    successMessage: (variables) =>
      `Sub-kriteria "${variables.description}" berhasil ditambahkan!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan sub-kriteria "${variables.description}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: SubCriteriaFormData) => {
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
