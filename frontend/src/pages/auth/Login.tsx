import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, type ErrorResponse } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { LoginInput, LoginRespone } from "../../types/auth";
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
            const response = await api.post<LoginRespone>("/auth/login", credentials);
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
        <div>
            {/* Header Form */}
            <div className="mb-4 text-center sm:text-left">
                <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
                    Selamat Datang
                </h2>
                <p className="text-center text-xs text-gray-500 mt-1">
                    Silakan masukkan email dan password untuk masuk ke akun Anda.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <InputText
                    label="Email"
                    nama="email"
                    register={register}
                    error={errors.email?.message}
                />
                <InputPassword
                    label="Password"
                    nama="password"
                    register={register}
                    error={errors.password?.message}
                    placeholder="Masukkan password Anda"
                />

                <div className="pt-2">
                    <Button type="submit" label="Login" className="w-full py-2.5 text-base shadow-md hover:shadow-lg transition-all" />
                </div>

                <div className="mt-4 text-center text-xs text-gray-600">
                    Belum punya akun?{" "}
                    <Link to="/register" className="font-semibold text-black hover:underline transition-colors">
                        Daftar di sini
                    </Link>
                </div>
            </form>
        </div>
    );
};

