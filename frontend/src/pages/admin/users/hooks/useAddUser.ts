import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userService } from "../../../../services/userService";
import { useCreate } from "../../../../hooks/useCreate";

// 1. Skema Validasi Zod untuk tabel users di database
export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi!")
    .min(3, "Nama minimal terdiri dari 3 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi!")
    .email("Format email tidak valid!"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
  role: z.enum(["superadmin", "admin", "store_admin", "user"]),
  storeId: z.union([
    z.coerce.number().min(1, "Cabang toko wajib dipilih!"),
    z.literal(""),
    z.null(),
  ]),
  is_active: z.boolean(),
});

export const UserSchema = userSchema;

export type UserFormData = z.infer<typeof userSchema>;

export function useAddUser() {
  // Inisialisasi React Hook Form + Zod Resolver
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "admin",
      storeId: 1,
      is_active: true, // Default diatur ke Aktif (true)
    },
  });

  const isActive = watch("is_active");
  const selectedRole = watch("role");

  // Mutasi dengan Generic Hook useCreate + User Service
  const createMutation = useCreate<UserFormData>({
    mutationFn: (payload) => userService.create(payload),
    queryKey: ["users"],
    navigateTo: "/admin/users",
    successMessage: (variables) =>
      `Pengguna "${variables.name}" berhasil didaftarkan!`,
    errorMessage: (variables, err) =>
      `Gagal menyimpan pengguna "${variables.name}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
  });

  const onSubmit = (data: UserFormData) => {
    createMutation.mutate(data);
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: createMutation.isPending,
    isActive,
    selectedRole,
  };
}
