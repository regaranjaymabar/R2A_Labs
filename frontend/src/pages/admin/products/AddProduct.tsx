import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    Ban,
    Cpu,
    Monitor,
    Layers,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSelect } from "../../../components/ui/common/InputSelect";
import { useAddProduct } from "./hooks/useAddProduct";
import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../../services/brandService";

export default function AddProduct() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, errors, isSubmitting, isActive } =
        useAddProduct();

    // Fetch daftar merek dari backend untuk dropdown Brand
    const { data: brands = [], isLoading: isBrandsLoading } = useQuery({
        queryKey: ["brands"],
        queryFn: brandService.getAll,
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* 1. HEADER HALAMAN */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <span>Tambah Spesifikasi Laptop Baru</span>
                        </h1>
                    </div>
                </div>

                <Link
                    to="/admin/products"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </Link>
            </div>

            {/* 2. KARTU FORM UTAMA */}
            <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                {/* Decorative Top Accent */}
                <div className="h-2 bg-black"></div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    {/* SECTION 1: INFORMASI DASAR & MEREK */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black">
                            <span>Informasi Laptop</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 1. Merek (Brand) */}
                            <div className="md:col-span-1">
                                <InputSelect
                                    label="Brand Laptop *"
                                    nama="brand_id"
                                    options={brands.map((b) => ({
                                        value: b.id,
                                        label: `#${b.id} - ${b.name}`,
                                    }))}
                                    placeholder={
                                        isBrandsLoading ? "Memuat Merek..." : "-- Pilih Merek --"
                                    }
                                    disabled={isBrandsLoading}
                                    register={register}
                                    error={errors.brand_id?.message}
                                    helperText="* Merek dari tabel brands."
                                />
                            </div>

                            {/* 2. Nama Model */}
                            <div className="md:col-span-1">
                                <InputText
                                    label="Nama Model Laptop"
                                    nama="model_name"
                                    placeholder="Contoh: MacBook Air M4, Vivobook 14"
                                    register={register}
                                    error={errors.model_name?.message}
                                    helperText="* Nama tipe/model tanpa nama merek."
                                />
                            </div>

                            {/* 9. Tahun Rilis */}
                            <div className="md:col-span-1">
                                <InputText
                                    label="Tahun Rilis"
                                    nama="release_year"
                                    type="number"
                                    placeholder="Contoh: 2024, 2025"
                                    register={register}
                                    error={errors.release_year?.message}
                                    helperText="* Tahun peluncuran laptop di pasar."
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: SPESIFIKASI DAPUR PACU (PERFORMA) */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black">
                            <Cpu className="w-4 h-4" />
                            <span>Spesifikasi Dapur Pacu & Penyimpanan</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 4. Processor */}
                            <div>
                                <InputText
                                    label="Processor"
                                    nama="processor"
                                    placeholder="Contoh: Apple M4, Intel Core i5-13500H"
                                    register={register}
                                    error={errors.processor?.message}
                                    helperText="* Tipe dan generasi prosesor."
                                />
                            </div>

                            {/* 5. Kapasitas RAM */}
                            <div>
                                <InputText
                                    label="Kapasitas RAM (GB)"
                                    nama="ram"
                                    placeholder="Contoh: 8, 16, 32"
                                    register={register}
                                    error={errors.ram?.message}
                                    helperText="* Angka kapasitas RAM dalam GB."
                                />
                            </div>

                            {/* 6. Storage */}
                            <div>
                                <InputText
                                    label="Storage (SSD / NVMe)"
                                    nama="storage"
                                    placeholder="Contoh: 512 GB SSD, 1 TB NVMe"
                                    register={register}
                                    error={errors.storage?.message}
                                    helperText="* Kapasitas dan jenis penyimpanan."
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: LAYAR, BATERAI & FISIK */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black dark:text-purple-400">
                            <Monitor className="w-4 h-4" />
                            <span>Layar, Baterai & Dimensi Fisik</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 3. Ukuran Layar */}
                            <div>
                                <InputText
                                    label="Ukuran Layar (Inci)"
                                    nama="screen_size"
                                    type="number"
                                    placeholder="Contoh: 13.6, 14, 15.6"
                                    register={register}
                                    error={errors.screen_size?.message}
                                    helperText="* Angka desimal (misal: 13.6)."
                                />
                            </div>

                            {/* 7. Kapasitas Baterai */}
                            <div>
                                <InputText
                                    label="Kapasitas Baterai (Wh / mAh)"
                                    nama="battery"
                                    type="number"
                                    placeholder="Contoh: 50, 70, 7000"
                                    register={register}
                                    error={errors.battery?.message}
                                    helperText="* Angka kapasitas baterai."
                                />
                            </div>

                            {/* 8. Berat Laptop */}
                            <div>
                                <InputText
                                    label="Berat Laptop (Kg)"
                                    nama="weight"
                                    type="number"
                                    placeholder="Contoh: 1.24, 1.5, 2.1"
                                    register={register}
                                    error={errors.weight?.message}
                                    helperText="* Berat dalam Kilogram (misal: 1.24)."
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: STATUS PUBLIKASI PRODUK */}
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-purple-500" />
                                <span>Status Ketersediaan Produk</span>
                            </span>
                            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                                Default: Aktif (true)
                            </span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Opsi 1: Aktif (Live) */}
                            <button
                                type="button"
                                onClick={() =>
                                    setValue("is_active", true, { shouldValidate: true })
                                }
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
                                    <span
                                        className={`block font-bold text-sm ${isActive
                                                ? "text-emerald-900 dark:text-emerald-200"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        Aktif & Siap Diranking
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                                        Laptop ini langsung tampil di katalog dan bisa diberikan bobot spesifikasi SPK.
                                    </span>
                                </div>
                            </button>

                            {/* Opsi 2: Nonaktif (Draft) */}
                            <button
                                type="button"
                                onClick={() =>
                                    setValue("is_active", false, { shouldValidate: true })
                                }
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
                                    <span
                                        className={`block font-bold text-sm ${!isActive
                                                ? "text-red-900 dark:text-red-200"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        Nonaktif (Simpan sebagai Draft)
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                                        Laptop disembunyikan sementara dari proses perhitungan ranking SPK tanpa menghapus data.
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
                            onClick={() => navigate("/admin/products")}
                            label="Batal"
                            className="px-5! py-2.5! rounded-xl! text-xs! font-bold! cursor-pointer!"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                            icon={<Save className="w-4 h-4" />}
                            label={isSubmitting ? "Menyimpan..." : "Simpan Produk Baru"}
                            className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
