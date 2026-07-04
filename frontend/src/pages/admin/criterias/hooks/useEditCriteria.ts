import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { criteriaService } from "../../../../services/criteriaService";
import { criteriaSchema, type CriteriaFormData } from "./useAddCriteria";
import { type Criteria } from "../CriteriaIndex";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

export function useEditCriteria() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  // 2. Fetch Data Eksisting menggunakan Generic Hook useGet + criteriaService: GET /criterias/:id
  const {
    data: criteriaData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<Criteria>({
    queryKey: ["criterias", id || ""],
    queryFn: () => criteriaService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      code: "C1",
      name: "Harga (Dummy)",
      type: "cost",
    },
  });

  // 3. Populate form begitu data berhasil dimuat
  useEffect(() => {
    if (criteriaData) {
      reset({
        code: criteriaData.code || "",
        name: criteriaData.name || "",
        type: (criteriaData.type?.toLowerCase() === "cost" ? "cost" : "benefit") as "cost" | "benefit",
      });
    }
  }, [criteriaData, reset]);

  // 4. Mutasi Update ke Backend menggunakan Generic Hook useUpdate + criteriaService: PUT /criterias/:id
  const updateMutation = useUpdate<CriteriaFormData>({
    mutationFn: (payload) => criteriaService.update(id!, payload),
    queryKey: ["criterias"],
    navigateTo: "/admin/criterias",
    successMessage: (variables) =>
      `Kriteria [${variables.code}] "${variables.name}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui kriteria "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: CriteriaFormData) => {
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
    selectedType,
  };
}
