import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { criteriaService } from "../../../../services/criteriaService";
import { useCreate } from "../../../../hooks/useCreate";

export const criteriaSchema = z.object({
  code: z
    .string()
    .min(1, "Kode kriteria wajib diisi! (Misal: C1, C2)")
    .max(10, "Kode maksimal 10 karakter"),
  name: z
    .string()
    .min(1, "Nama kriteria wajib diisi!")
    .min(2, "Nama kriteria minimal terdiri dari 2 karakter"),
  type: z.enum(["benefit", "cost"]),
  weight: z.number().optional(),
});

export const CriteriaSchema = criteriaSchema;
export type CriteriaFormData = z.infer<typeof criteriaSchema>;

export function useAddCriteria() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CriteriaFormData>({
    resolver: zodResolver(criteriaSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      type: "benefit",
    },
  });

  const selectedType = watch("type");

  const createMutation = useCreate<CriteriaFormData>({
    mutationFn: (payload) => criteriaService.create(payload),
    queryKey: ["criterias"],
    navigateTo: "/admin/criterias",
    successMessage: (variables) =>
      `Dimensi Kriteria [${variables.code}] "${variables.name}" berhasil didaftarkan!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan kriteria "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: CriteriaFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: createMutation.isPending,
    selectedType,
  };
}
