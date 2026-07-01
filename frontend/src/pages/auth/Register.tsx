import { useForm } from "react-hook-form";


import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "../../components/ui/common/InputText";
import { InputPassword } from "../../components/ui/common/InputPassword";
import Button from "../../components/ui/common/Button";
import { Link } from "react-router-dom";



type FormData = {
    email: string;
    nama: string;
    password: string;
    password_confirm: string;
}

const schema = z.object({
    nama: z.string().min(1, "nama harus diisi"),
    email: z.string().min(1, "Email harus diisi"),
    password: z.string().min(8, "Password harus diisi"),
    password_confirm: z.string().min(8, "Password harus diisi")
})

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema)

    });



    const onSubmit = (data: FormData) => {
        console.log(data);
    };


    return (
        <div>

            <div className="mb-4 text-center sm:text-left">
                <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
                    Buat Akun Baru
                </h2>
                <p className="text-center text-xs text-gray-500 mt-1">
                    Lengkapi data di bawah ini untuk mendaftarkan akun Anda.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
                <InputText
                    label="Nama Lengkap"
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
                    placeholder="Minimal 8 karakter"
                />
                <InputPassword
                    label="Konfirmasi Password"
                    nama="password_confirm"
                    register={register}
                    error={errors.password_confirm?.message}
                    placeholder="Ulangi password"
                />

                <div className="pt-2">
                    <Button label="Register" type="submit" variant="primary" className="w-full py-2.5 text-base shadow-md hover:shadow-lg transition-all" />
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