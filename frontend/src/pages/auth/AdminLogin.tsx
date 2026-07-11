import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { LoginInput, AuthWrapperResponse } from "../../types/auth";
import { api } from "../../lib/axios";
import { InputText } from "../../components/ui/common/InputText";
import { InputPassword } from "../../components/ui/common/InputPassword";
import Button from "../../components/ui/common/Button";
import toast from "react-hot-toast";

type FormData = {
    email: string;
    password: string;
}

const schema = z.object({
    email: z.string().min(1, "Email harus diisi"),
    password: z.string().min(6, "Password harus diisi"),
})

export default function AdminLogin() {
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
            const response = await api.post<AuthWrapperResponse>("/api/shared/auth/login", credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            login({
                user: data.user,
                token: data.token
            });

            queryClient.setQueryData(["me"], data.user);
            toast.success("Berhasil masuk ke portal admin");
            navigate("/admin/dashboard");
        },
        onError: (error: AxiosError<any>) => {
            const message = error.response?.data?.message || error.message || "Gagal masuk ke portal admin";
            toast.error(`Gagal Login Admin: ${message}`);
        }
    });

    const onSubmit = (data: FormData) => {
        loginMutation.mutate(data);
    };

    return (
        <div>
            {/* Header Form */}
            <div className="mb-4 text-center sm:text-left">
                <h2 className="text-center flex justify-center sm:text-left text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Login Admin
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <InputText
                    label="Email Staf"
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
                    <Button
                        type="submit"
                        isLoading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                        label="Masuk Portal Admin"
                        className="w-full py-2.5 text-base shadow-md hover:shadow-lg transition-all cursor-pointer font-bold"
                    />
                </div>

                <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
                    Bukan staf?{" "}
                    <Link to="/login" className="font-semibold text-black hover:underline transition-colors">
                        Masuk sebagai Pelanggan
                    </Link>
                </div>
            </form>
        </div>
    );
}
