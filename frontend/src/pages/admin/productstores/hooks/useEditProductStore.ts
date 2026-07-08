import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productStoreService } from "../../../../services/productStoreService";
import { productStoreSchema, type ProductStoreFormData } from "./useAddProductStore";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";
import type { ProductStore } from "../ProductStoreIndex";

export function useEditProductStore() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductStoreFormData>({
    resolver: zodResolver(productStoreSchema) as any,
  });

  const isAvailable = watch("is_available");

  // 2. Fetch Data Eksisting menggunakan Generic Hook useGet + productStoreService: GET /productstores/:id
  const {
    data: productStoreData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<ProductStore>({
    queryKey: ["productstores", id || ""],
    queryFn: () => productStoreService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      product_id: 1,
      store_id: 1,
      price: 15000000,
      stock: 10,
      is_available: 1,
    },
  });

  // 3. Populate form begitu data berhasil dimuat
  useEffect(() => {
    if (productStoreData) {
      reset({
        product_id: productStoreData.product_id,
        store_id: productStoreData.store_id,
        price: Number(productStoreData.price || 0),
        stock: Number(productStoreData.stock || 0),
        is_available: Boolean(productStoreData.is_available),
      });
    }
  }, [productStoreData, reset]);

  // 4. Mutasi Update ke Backend menggunakan Generic Hook useUpdate + productStoreService: PUT /productstores/:id
  const updateMutation = useUpdate<ProductStoreFormData>({
    mutationFn: (payload) => productStoreService.update(id!, payload),
    queryKey: ["productstores"],
    navigateTo: "/admin/productstores",
    successMessage: (variables) => `Stok produk "${variables.product_id}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui stok produk ID "${variables.product_id}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: ProductStoreFormData) => {
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
    isAvailable,
  };
}
