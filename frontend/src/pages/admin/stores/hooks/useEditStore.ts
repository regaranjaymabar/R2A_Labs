import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeService } from "../../../../services/storeService";
import { storeSchema, type StoreFormData } from "./useAddStore";
import { type Store } from "../StoreIndex";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

export function useEditStore() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  // 2. Fetch Data Eksisting menggunakan Generic Hook useGet + storeService: GET /stores/:id
  const {
    data: storeData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<Store>({
    queryKey: ["stores", id || ""],
    queryFn: () => storeService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      name: "Toko Asus Official Jakarta (Dummy)",
      address: "Mangga Dua Mall Lt. 2 No. 45",
      city: "Jakarta Pusat",
      phone: "081234567801",
      is_active: 1,
    },
  });

  // 3. Populate form begitu data berhasil dimuat
  useEffect(() => {
    if (storeData) {
      reset({
        name: storeData.name,
        address: storeData.address || "",
        city: storeData.city || "",
        phone: storeData.phone || "",
        is_active: Boolean(storeData.is_active),
      });
    }
  }, [storeData, reset]);

  // 4. Mutasi Update ke Backend menggunakan Generic Hook useUpdate + storeService: PUT /stores/:id
  const updateMutation = useUpdate<StoreFormData>({
    mutationFn: (payload) => storeService.update(id!, payload),
    queryKey: ["stores"],
    navigateTo: "/admin/stores",
    successMessage: (variables) => `Toko "${variables.name}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui toko "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: StoreFormData) => {
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
    isActive,
  };
}
