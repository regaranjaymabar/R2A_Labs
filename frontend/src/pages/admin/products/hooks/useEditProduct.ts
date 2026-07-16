import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productService } from "../../../../services/productService";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";
import { productSchema, type ProductFormData } from "./useAddProduct";
import type { Product } from "../../../../types/product";
import { getAutoMappedSubCriteriaIds } from "../../../../utils/spkAutoMapper";

export function useEditProduct() {
  const { id } = useParams<{ id: string }>();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
  });

  const isActive = watch("is_active");

  const {
    data: productData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<Product>({
    queryKey: ["products", id || ""],
    queryFn: () => productService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      brand_id: 1,
      model_name: "ASUS (Dummy)",
      processor: "",
      ram: "",
      storage: "",
      screen_size: 0,
      battery: 0,
      weight: 0,
      release_year: new Date().getFullYear(),
      is_active: 1,
    },
  });


  useEffect(() => {
    if (productData) {
      const rawYear = String(productData.releaseYear || productData.release_year || new Date().getFullYear());
      const formattedDate =
        rawYear.length === 4 ? `${rawYear}-01-01` : rawYear.slice(0, 10);

      const rawBattery = productData.battery || "";
      const parsedBattery = String(rawBattery).match(/[\d.]+/)?.[0] || "";

      const rawWeight = productData.weight || 0;
      const parsedWeight = Number(String(rawWeight).match(/[\d.]+/)?.[0] || 0);

      reset({
        brandId: Number(productData.brandId || productData.brand_id || 1),
        modelName: productData.modelName || productData.model_name || "",
        processor: productData.processor || "",
        ram: productData.ram || "",
        storage: productData.storage || "",
        screenSize: Number(productData.screenSize || productData.screen_size || 0),
        battery: parsedBattery,
        weight: parsedWeight,
        releaseYear: formattedDate,
        subCriteriaIds: [],
        is_active: Boolean(productData.is_active),
      });
    }
  }, [productData, reset]);

  const updateMutation = useUpdate<ProductFormData>({
    mutationFn: (payload) => productService.update(id!, payload),
    queryKey: ["products"],
    navigateTo: "/admin/products",
    successMessage: (variables) => `Produk "${variables.modelName}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui produk "${variables.modelName}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = async (data: ProductFormData) => {
    const subCriteriaIds = await getAutoMappedSubCriteriaIds(data);
    updateMutation.mutate({
      ...data,
      subCriteriaIds,
    });
  };

  return {
    id,
    productData,
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: updateMutation.isPending,
    isLoadingData,
    isFetchError,
    isActive,
  };
}