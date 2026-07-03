import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Ban,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { useAddBrand } from "./hooks/useAddBrand";

export default function AddBrand() {
    const navigate = useNavigate();
    // 1. Panggil seluruh logika form (RHF + Zod) dan mutasi POST MySQL dari Custom Hook
    const { register, handleSubmit, setValue, errors, isSubmitting, isActive } = useAddBrand();

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* 1. HEADER HALAMAN & TOMBOL KEMBALI */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <span>Tambah Merek Laptop Baru</span>
                        </h1>
                    </div>
                </div>

                <Link
                    to="/admin/brands"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar</span>
                </Link>
            </div>

            {/* 2. KARTU FORM UTAMA */}
            <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
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

                    {/* INPUT 2: STATUS AKTIF (RADIO / TOGGLE CARDS TERINTEGRASI REACT HOOK FORM) */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span>Status Ketersediaan Merek</span>
                            </span>
                            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                Default: Aktif (true)
                            </span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Opsi 1: Aktif (Live) */}
                            <button
                                type="button"
                                onClick={() => setValue("is_active", true, { shouldValidate: true })}
                                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${isActive
                                        ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                                        : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-300"
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${isActive
                                            ? "bg-emerald-500 text-white shadow-xs"
                                            : "border-2 border-gray-300 dark:border-gray-600"
                                        }`}
                                >
                                    {isActive && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <div>
                                    <span className={`block font-bold text-sm ${isActive ? "text-emerald-900 dark:text-emerald-200" : "text-gray-700 dark:text-gray-300"}`}>
                                        Aktif & Siap Digunakan
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                                        Merek ini langsung muncul di katalog produk dan dropdown pemilihan spesifikasi laptop.
                                    </span>
                                </div>
                            </button>

                            {/* Opsi 2: Nonaktif (Draft) */}
                            <button
                                type="button"
                                onClick={() => setValue("is_active", false, { shouldValidate: true })}
                                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${!isActive
                                        ? "bg-red-50/80 dark:bg-red-950/40 border-red-500 shadow-md ring-2 ring-red-500/20"
                                        : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-300"
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${!isActive
                                            ? "bg-red-500 text-white shadow-xs"
                                            : "border-2 border-gray-300 dark:border-gray-600"
                                        }`}
                                >
                                    {!isActive && <Ban className="w-4 h-4" />}
                                </div>
                                <div>
                                    <span className={`block font-bold text-sm ${!isActive ? "text-red-900 dark:text-red-200" : "text-gray-700 dark:text-gray-300"}`}>
                                        Nonaktif (Simpan sebagai Draft)
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                                        Merek disembunyikan sementara dari pilihan input produk baru tanpa menghapus data.
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* TOMBOL AKSI FORM */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
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
                            label={isSubmitting ? "Menyimpan..." : "Simpan Merek Baru"}
                            className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
