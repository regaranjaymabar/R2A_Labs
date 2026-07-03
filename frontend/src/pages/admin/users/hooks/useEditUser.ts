import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userService } from "../../../../services/userService";
import { userSchema, type UserFormData } from "./useAddUser";
import { type UserData } from "../UserIndex";
import { useGet } from "../../../../hooks/useGet";
import { useUpdate } from "../../../../hooks/useUpdate";

export function useEditUser() {
  const { id } = useParams<{ id: string }>();

  // 1. Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "store_admin",
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
      role: "store_admin",
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
        role: userData.role || "user",
        is_active: Boolean(userData.is_active),
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
    selectedRole,
  };
}
