import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userStoreService } from "../../../../services/userStoreService";
import { useCreate } from "../../../../hooks/useCreate";

export const userStoreSchema = z.object({
  user_id: z.coerce.number().min(1, "Pegawai / Admin Toko wajib dipilih!"),
  store_id: z.coerce.number().min(1, "Cabang toko wajib dipilih!"),
  is_active: z.boolean(),
});

export const UserStoreSchema = userStoreSchema;
export type UserStoreFormData = z.infer<typeof userStoreSchema>;

export function useAddUserStore() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const createMutation = useCreate<UserStoreFormData>({
    mutationFn: (payload) => userStoreService.create(payload),
    queryKey: ["userstores"],
    navigateTo: "/admin/user-stores",
    successMessage: () => `Hak akses pengelolaan toko berhasil ditugaskan!`,
    errorMessage: (_variables, err) =>
      `Gagal menyimpan hak akses: ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: UserStoreFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: createMutation.isPending,
    isActive,
    selectedUserId,
    selectedStoreId,
  };
}
