import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, type ErrorResponse } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { LoginInput, LoginResponse } from "../../types/auth";
import { api } from "../../lib/axios";
import { InputText } from "../../components/ui/common/InputText";
import { InputPassword } from "../../components/ui/common/InputPassword";
import Button from "../../components/ui/common/Button";

type FormData = {
    email: string;
    password: string;
}

const schema = z.object({
    email: z.string().min(1, "email harus diisi"),
    password: z.string().min(8, "Password harus diisi"),
})

export default function Login() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginInput) => {
            //logic awal
            const response = await api.post<LoginResponse>("/auth/login", credentials);
            return response.data;
        },
        onSuccess: (data) => {
            //logic jika sukses
            login({
                user: data.user,
                token: data.token
            });

            queryClient.setQueryData(["me"], data.user);

            navigate("/dashboard");

        },
        onError: (error: AxiosError<ErrorResponse>) => {
            const message = error.message || "Error Boss!"
            alert(`Gagal Boss : ${message}`);

        }
    })

    const onSubmit = (data: FormData) => {
        loginMutation.mutate(data);
    };

    return (
    <div className="w-full">

      {/* Logo */}

      <div className="flex flex-col items-center text-center mb-10">
  
        {/* Logo dengan Image Path / Link */}
        <img 
          src="https://cdn-icons-png.flaticon.com/512/0/747.png" 
          alt="Logo Rekomlepsop" 
          className="w-14 h-14 rounded-2xl"
        />

        {/* Teks di bawah logo */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight">
            AMBALABS
          </h1>
          <p className="text-sm text-black/70">
            Masuk ke ambalabs Anda
          </p>
        </div>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        <InputText
          label="Email"
          nama="email"
          register={register}
          error={errors.email?.message}
          placeholder="Masukkan email Anda"
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
            className="
              text-sm
              text-zinc-500
              hover:text-black
              transition-colors
            "
          >
            Lupa password?
          </Link>

        </div>

        <Button
          type="submit"
          label={
            loginMutation.isPending
              ? "Sedang Masuk..."
              : "Masuk"
          }
          className="
            w-full
            h-13
            rounded-2xl
            text-base
            font-semibold
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
        />

        <div className="text-center text-sm text-zinc-500">

          Belum punya akun?

          <Link
            to="/register"
            className="
              ml-1
              font-semibold
              text-black
              hover:underline
            "
          >
            Daftar sekarang
          </Link>

        </div>

      </form>

    </div>
  );
}

