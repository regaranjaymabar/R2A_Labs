import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { useEditBrand } from "./hooks/useEditBrand";

export default function EditBrand() {
    const navigate = useNavigate();
    // Panggil seluruh logika GET, RHF, Zod, dan PUT MySQL dari Custom Hook
    const {
        id,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        isLoadingData,
    } = useEditBrand();

    if (isLoadingData) {
        return (
            <div className="max-w-3xl mx-auto py-20 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                <p className="text-sm font-bold text-gray-600">Mengambil data merek #{id} dari server...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* 1. HEADER HALAMAN & TOMBOL KEMBALI */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                            <span>Edit Merek Laptop #{id}</span>
                        </h1>
                    </div>
                </div>

                <Link
                    to="/admin/brands"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar</span>
                </Link>
            </div>

            {/* 2. KARTU FORM UTAMA */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Decorative Top Accent */}
                <div className="h-2 bg-black"></div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-7">
                    {/* INPUT 1: NAMA MEREK (Menggunakan komponen InputText + React Hook Form + Zod) */}
                    <div className="space-y-1">
                        <InputText
                            label="Nama Merek Laptop"
                            nama="name"
                            register={register}
                            error={errors.name?.message}
                        />
                    </div>

                    {/* TOMBOL AKSI FORM */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/admin/brands")}
                            label="Batal"
                            className="px-5! py-2.5! rounded-xl! text-xs! font-bold! cursor-pointer!"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                            label={isSubmitting ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
                            className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
