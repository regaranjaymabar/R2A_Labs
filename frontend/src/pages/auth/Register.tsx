import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "../../components/ui/common/InputText";
import { InputPassword } from "../../components/ui/common/InputPassword";
import Button from "../../components/ui/common/Button";
import { Link, useNavigate, type ErrorResponse } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { CustomerAuthWrapperResponse, User } from "../../types/auth";
import { api } from "../../lib/axios";

type FormData = {
    email: string;
    nama: string;
    password: string;
    password_confirm: string;
}

const schema = z.object({
    nama: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Format email tidak valid").min(1, "Email harus diisi"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    password_confirm: z.string().min(6, "Konfirmasi password harus diisi")
}).refine((data) => data.password === data.password_confirm, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirm"],
});

export default function RegisterForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const registerMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const payload = {
                name: formData.nama,
                email: formData.email,
                password: formData.password,
            };
            const response = await api.post<CustomerAuthWrapperResponse>("/api/customer/auth/register", payload);
            return response.data.data;
        },
        onSuccess: (data) => {
            const customerUser: User = {
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
        onError: (error: AxiosError<ErrorResponse>) => {
            const message = error.message || "Email sudah terdaftar atau terjadi kesalahan";
            alert(`Gagal Mendaftar : ${message}`);
        }
    });

    const onSubmit = (data: FormData) => {
        registerMutation.mutate(data);
    };

    return (
        <div>
            <div className="mb-4 text-center sm:text-left">
                <h2 className="text-center sm:text-left text-2xl font-extrabold text-gray-900 tracking-tight">
                    Buat Akun Pelanggan
                </h2>
                <p className="text-center sm:text-left text-xs text-gray-500 mt-1">
                    Lengkapi data di bawah ini untuk mendaftarkan akun Anda.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
                <InputText
                    label="Nama"
                    nama="nama"
                    register={register}
                    error={errors.nama?.message}
                />
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
                    placeholder="Minimal 6 karakter"
                />
                <InputPassword
                    label="Konfirmasi Password"
                    nama="password_confirm"
                    register={register}
                    error={errors.password_confirm?.message}
                    placeholder="Ulangi password"
                />

                <div className="pt-2">
                    <Button
                        label="Daftar Sekarang"
                        type="submit"
                        variant="primary"
                        isLoading={registerMutation.isPending}
                        disabled={registerMutation.isPending}
                        className="w-full py-2.5 text-base shadow-md hover:shadow-lg transition-all cursor-pointer font-bold"
                    />
                </div>

                <div className="mt-4 text-center text-xs text-gray-600">
                    Sudah punya akun?{" "}
                    <Link to="/login" className="font-semibold text-black hover:underline transition-colors">
                        Login di sini
                    </Link>
                </div>
            </form>
        </div>
    );
};