import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userService } from "../../../../services/userService";
import { type UserFormData } from "./useAddUser";
import { type UserData } from "../../../../types/user";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

const editUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi!")
    .min(3, "Nama minimal terdiri dari 3 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi!")
    .email("Format email tidak valid!"),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(["superadmin", "admin", "store_admin", "user"]),
  storeId: z.coerce.number().min(1, "Cabang toko wajib dipilih!"),
  is_active: z.boolean(),
});

export function useEditUser() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(editUserSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "admin",
      storeId: 1,
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const selectedRole = watch("role");

  // 2. Fetch Data Eksisting menggunakan Generic Hook useGet + userService: GET /users/:id
  const {
    data: userData,
    isLoading: isLoadingData,
    isError: isFetchError,
  } = useGet<UserData>({
    queryKey: ["users", id || ""],
    queryFn: () => userService.getById(id!),
    enabled: Boolean(id),
    offlineFallbackData: {
      id: Number(id),
      name: "Siti Rahma (Dummy)",
      email: "siti.store@r2a-labs.com",
      role: "admin",
      storeId: 1,
      is_active: true,
      created_at: "2026-03-01 09:15:00",
    },
  });

  // 3. Populate form begitu data berhasil dimuat
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        email: userData.email,
        password: "", // Jangan tampilkan password eksisting
        role: (userData.role as any) || "admin",
        storeId: userData.storeId || userData.store?.id || 1,
        is_active: Boolean(userData.isActive ?? userData.is_active ?? true),
      });
    }
  }, [userData, reset]);

  // 4. Mutasi Update ke Backend menggunakan Generic Hook useUpdate + userService: PUT /users/:id
  const updateMutation = useUpdate<UserFormData>({
    mutationFn: (payload) => userService.update(id!, payload),
    queryKey: ["users"],
    navigateTo: "/admin/users",
    successMessage: (variables) => `Pengguna "${variables.name}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui pengguna "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: UserFormData) => {
    const payload: any = { ...data };
    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }
    updateMutation.mutate(payload);
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isLoadingData,
    isFetchError,
    isSubmitting: updateMutation.isPending,
    isActive,
    selectedRole,
  };
}
