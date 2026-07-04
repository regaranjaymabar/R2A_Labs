import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productWeightService } from "../../../../services/productWeightService";
import { productWeightSchema, type ProductWeightFormData } from "./useAddProductWeight";
import { type ProductCriteria } from "../ProductWeightIndex";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

export function useEditProductWeight() {
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductWeightFormData>({
    resolver: zodResolver(productWeightSchema) as any,
    defaultValues: {
      product_id: 0,
      criteria_id: 0,
      sub_criteria_id: 0,
      value_numeric: 0,
    },
  });

  const {
    data: weightData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<ProductCriteria>({
    queryKey: ["productweights", id || ""],
    queryFn: () => productWeightService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      product_id: 1,
      criteria_id: 1,
      sub_criteria_id: 1,
      value_numeric: 5.0,
      product_name: "Dummy Laptop",
      criteria_name: "Harga",
      sub_criteria_description: "<= Rp 6.000.000",
    },
  });

  useEffect(() => {
    if (weightData) {
      reset({
        product_id: weightData.product_id || 0,
        criteria_id: weightData.criteria_id || 0,
        sub_criteria_id: weightData.sub_criteria_id || 0,
        value_numeric: weightData.value_numeric || 0,
      });
    }
  }, [weightData, reset]);

  const updateMutation = useUpdate<ProductWeightFormData>({
    mutationFn: (payload) => productWeightService.update(id!, payload),
    queryKey: ["productweights"],
    navigateTo: "/admin/productweights",
    successMessage: (variables) =>
      `Pembobotan untuk produk "${variables.product_id}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui pembobotan untuk produk "${variables.product_id}": ${err?.message || "Unknown error"}`,
  });

  const onSubmit = (data: ProductWeightFormData) => {
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
    weightData,
  };
}
