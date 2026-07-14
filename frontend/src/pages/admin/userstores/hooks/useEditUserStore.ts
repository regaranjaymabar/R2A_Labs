import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userStoreService } from "../../../../services/userStoreService";
import { userStoreSchema, type UserStoreFormData } from "./useAddUserStore";

import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";
import type { UserStoreAccess } from "../../../../types/userStore";

export function useEditUserStore() {
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserStoreFormData>({
    resolver: zodResolver(userStoreSchema) as any,
    defaultValues: {
      user_id: 0,
      store_id: 0,
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const selectedUserId = watch("user_id");
  const selectedStoreId = watch("store_id");

  const {
    data: userStoreData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<UserStoreAccess>({
    queryKey: ["userstores", id || ""],
    queryFn: () => userStoreService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      user_id: 2,
      user_name: "Budi Santoso (Dummy)",
      user_email: "budi.store@r2a-labs.com",
      store_id: 1,
      store_name: "Toko Asus Official Jakarta",
      store_city: "Jakarta Pusat",
      is_active: true,
      assigned_at: "2026-03-01 10:00:00",
    },
  });

  useEffect(() => {
    if (userStoreData) {
      reset({
        user_id: Number(userStoreData.user_id),
        store_id: Number(userStoreData.store_id),
        is_active: Boolean(userStoreData.is_active),
      });
    }
  }, [userStoreData, reset]);

  const updateMutation = useUpdate<UserStoreFormData>({
    mutationFn: (payload) => userStoreService.update(id!, payload),
    queryKey: ["userstores"],
    navigateTo: "/admin/user-stores",
    successMessage: () => `Hak akses pengelolaan toko berhasil diperbarui!`,
    errorMessage: (_variables, err) =>
      `Gagal memperbarui hak akses: ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: UserStoreFormData) => {
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
    selectedUserId,
    selectedStoreId,
  };
}
