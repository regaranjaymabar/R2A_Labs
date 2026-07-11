import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { LoginInput, CustomerAuthWrapperResponse } from "../../types/auth";
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
            const response = await api.post<CustomerAuthWrapperResponse>("/api/customer/auth/login", credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            const customerUser = {
                ...data.customer,
                role: data.customer.role || "customer",
            };

            login({
                user: customerUser,
                token: data.token
            });

            queryClient.setQueryData(["me"], customerUser);

            navigate("/");
        },
        onError: (error: AxiosError<any>) => {
            const message = error.response?.data?.message || error.message || "Email atau password salah!";
            alert(`Gagal Login : ${message}`);
        }
    })

    const onSubmit = (data: FormData) => {
        loginMutation.mutate(data);
    };

    return (
        <div>
            {/* Header Form */}
            <div className="mb-4 text-center sm:text-left">
                <h2 className="text-center flex justify-center sm:text-left text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Masuk Akun Customer
                </h2>
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
                    <Button
                        type="submit"
                        isLoading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                        label="Masuk Sekarang"
                        className="w-full py-2.5 text-base shadow-md hover:shadow-lg transition-all cursor-pointer font-bold"
                    />
                </div>

                <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
                    Belum punya akun?{" "}
                    <Link to="/register" className="font-semibold text-black dark:text-white hover:underline transition-colors">
                        Daftar di sini
                    </Link>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
                    Staf atau Admin toko?{" "}
                    <Link to="/admin/login" className="font-semibold text-black hover:underline transition-colors">
                        Masuk Portal Admin
                    </Link>
                </div>
            </form>
        </div>
    );
};

