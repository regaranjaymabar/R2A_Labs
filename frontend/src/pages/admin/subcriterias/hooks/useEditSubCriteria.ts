import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subCriteriaService } from "../../../../services/subCriteriaService";
import { subCriteriaSchema, type SubCriteriaFormData } from "./useAddSubCriteria";
import { type SubCriteria } from "../SubCriteriaIndex";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

export function useEditSubCriteria() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubCriteriaFormData>({
    resolver: zodResolver(subCriteriaSchema) as any,
    defaultValues: {
      criteria_id: 1,
      description: "",
      value_numeric: 1.0,
    },
  });

  // 2. Fetch Data Eksisting menggunakan Generic Hook useGet + subCriteriaService: GET /subcriterias/:id
  const {
    data: subCriteriaData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<SubCriteria>({
    queryKey: ["subcriterias", id || ""],
    queryFn: () => subCriteriaService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: { id: Number(id), criteria_id: 1, description: "<= Rp 6.000.000 (Dummy)", value_numeric: 5.0 },
  });

  // 3. Populate form begitu data berhasil dimuat
  useEffect(() => {
    if (subCriteriaData) {
      reset({
        criteria_id: Number(subCriteriaData.criteria_id),
        description: subCriteriaData.description,
        value_numeric: Number(subCriteriaData.value_numeric),
      });
    }
  }, [subCriteriaData, reset]);

  // 4. Mutasi Update ke Backend menggunakan Generic Hook useUpdate + subCriteriaService: PUT /subcriterias/:id
  const updateMutation = useUpdate<SubCriteriaFormData>({
    mutationFn: (payload) => subCriteriaService.update(id!, payload),
    queryKey: ["subcriterias"],
    navigateTo: "/admin/subcriterias",
    successMessage: (variables) => `Sub-kriteria "${variables.description}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui sub-kriteria "${variables.description}": ${err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: SubCriteriaFormData) => {
    updateMutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isLoadingData,
    isFetchError,
    isSubmitting: updateMutation.isPending,
  };
}
