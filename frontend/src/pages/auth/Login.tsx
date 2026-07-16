import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { LoginInput, CustomerAuthWrapperResponse, AuthWrapperResponse, User } from "../../types/auth";
import { api } from "../../lib/axios";
import { InputText } from "../../components/ui/common/InputText";
import { InputPassword } from "../../components/ui/common/InputPassword";
import Button from "../../components/ui/common/Button";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, "Email harus diisi"),
  password: z.string().min(6, "Password harus diisi"),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const [searchParams] = useSearchParams();

  const roleMode: "customer" | "admin" =
    location.pathname.includes("/admin") || searchParams.get("role") === "admin"
      ? "admin"
      : "customer";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      if (roleMode === "admin") {
        const response = await api.post<AuthWrapperResponse>("/api/shared/auth/login", credentials);
        return { type: "admin" as const, data: response.data.data };
      } else {
        const response = await api.post<CustomerAuthWrapperResponse>("/api/customer/auth/login", credentials);
        return { type: "customer" as const, data: response.data.data };
      }
    },
    onSuccess: (result) => {
      const from = (location.state as any)?.from || (result.type === "admin" ? "/admin/dashboard" : "/");
      if (result.type === "admin") {
        login({
          user: result.data.user,
          token: result.data.token,
        });
        queryClient.setQueryData(["me"], result.data.user);
        toast.success("Berhasil masuk ke Portal Admin AMBALABS");
        navigate(from, { replace: true });
      } else {
        const customerUser: User = {
          ...result.data.customer,
          role: result.data.customer.role || "customer",
        };

        login({
          user: customerUser,
          token: result.data.token,
        });

        queryClient.setQueryData(["me"], customerUser);
        toast.success("Berhasil masuk ke AMBALABS");
        navigate(from, { replace: true });
      }
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.message || error.message || "Email atau password salah!";
      toast.error(`Gagal Login : ${message}`);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-6">

        <img
          src="https://cdn-icons-png.flaticon.com/512/0/747.png"
          alt="Logo AMBALABS"
          className="w-14 h-14 rounded-2xl"
        />

        <div className="mt-3">
          <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
            <span>AMBALABS</span>
            {roleMode === "admin" && (
              <span className="text-[10px] uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full font-extrabold shadow-xs">
                ADMIN
              </span>
            )}
          </h1>
          <p className="text-sm text-black/70 mt-0.5">
            {roleMode === "admin"
              ? "Masuk ke Portal Admin AMBALABS"
              : "Masuk ke ambalabs Anda"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-zinc-100 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            roleMode === "customer"
              ? "bg-white text-black shadow-sm scale-[1.01]"
              : "text-zinc-500 hover:text-black"
          }`}
        >
          <span>Pelanggan</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/login")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            roleMode === "admin"
              ? "bg-black text-white shadow-sm scale-[1.01]"
              : "text-zinc-500 hover:text-black"
          }`}
        >
          <span>Admin</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputText
          label={roleMode === "admin" ? "Email Admin" : "Email"}
          nama="email"
          register={register}
          error={errors.email?.message}
          placeholder={
            roleMode === "admin"
              ? "Masukkan email admin"
              : "Masukkan email Anda"
          }
        />

        <InputPassword
          label="Password"
          nama="password"
          register={register}
          error={errors.password?.message}
          placeholder="Masukkan password"
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-zinc-500 hover:text-black transition-colors"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          label={
            loginMutation.isPending
              ? "Sedang Masuk..."
              : roleMode === "admin"
              ? "Masuk Portal Admin"
              : "Masuk"
          }
          className="w-full h-12 rounded-2xl text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
        />

        {roleMode === "customer" && (
          <div className="text-center text-sm text-zinc-500 pt-2">
            Belum punya akun?
            <Link
              to="/register"
              className="ml-1 font-semibold text-black hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
