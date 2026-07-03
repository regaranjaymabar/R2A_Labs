import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandService } from "../../../../services/brandService";
import { brandSchema, type BrandFormData } from "./useAddBrand";
import { type Brand } from "../BrandIndex";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

export function useEditBrand() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  // 2. Fetch Data Eksisting menggunakan Generic Hook useGet + brandService: GET /brands/:id
  const {
    data: brandData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<Brand>({
    queryKey: ["brands", id || ""],
    queryFn: () => brandService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: { id: Number(id), name: "ASUS (Dummy)", is_active: 1 },
  });

  // 3. Populate form begitu data berhasil dimuat
  useEffect(() => {
    if (brandData) {
      reset({
        name: brandData.name,
        is_active: Boolean(brandData.is_active),
      });
    }
  }, [brandData, reset]);

  // 4. Mutasi Update ke Backend menggunakan Generic Hook useUpdate + brandService: PUT /brands/:id
  const updateMutation = useUpdate<BrandFormData>({
    mutationFn: (payload) => brandService.update(id!, payload),
    queryKey: ["brands"],
    navigateTo: "/admin/brands",
    successMessage: (variables) => `Merek "${variables.name}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui brand "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: BrandFormData) => {
    updateMutation.mutate(data);
  };

  return {
    id,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors,
    isSubmitting: updateMutation.isPending,
    isLoadingData,
    isFetchError,
    isActive,
  };
}
