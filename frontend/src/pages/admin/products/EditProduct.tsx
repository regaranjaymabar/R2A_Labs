import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSearchSelect } from "../../../components/ui/common/InputSearchSelect";
import { useEditProduct } from "./hooks/useEditProduct";
import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../../services/brandService";

export default function EditProduct() {
    const navigate = useNavigate();
    const {
        id,
        productData,
        register,
        control,
        handleSubmit,
        errors,
        isSubmitting,
        isLoadingData,
        isFetchError,
    } = useEditProduct();

    // Fetch daftar merek dari backend untuk dropdown Brand
    const { data: brands = [], isLoading: isBrandsLoading } = useQuery({
        queryKey: ["brands"],
        queryFn: brandService.getAll,
    });

    if (isLoadingData) {
        return (
            <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400 dark:text-gray-500" />
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    Memuat data produk #{id} dari server...
                </p>
            </div>
        );
    }

    if (isFetchError) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center text-red-500 font-bold text-sm">
                Gagal memuat data produk #{id}.
            </div>
        );
    }

    const brandObj = brands.find(
        (b) => b.id === (productData?.brandId || productData?.brand_id)
    );
    const brandName = productData?.brand?.name || productData?.brand_name || brandObj?.name || "";
    const modelName = productData?.modelName || productData?.model_name || "";
    const headerTitle =
        brandName || modelName
            ? `Edit Spesifikasi: ${brandName} ${modelName}`.trim()
            : `Edit Spesifikasi Laptop #${id}`;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* 1. HEADER HALAMAN */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <span>{headerTitle}</span>
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
                                <InputSearchSelect
                                    label="Brand Laptop *"
                                    name="brandId"
                                    control={control}
                                    options={brands.map((b) => ({
                                        value: b.id,
                                        label: b.name,
                                    }))}
                                    placeholder={
                                        isBrandsLoading ? "Memuat Merek..." : "-- Cari atau Pilih Merek --"
                                    }
                                    isLoading={isBrandsLoading}
                                    disabled={isBrandsLoading}
                                    error={errors.brandId?.message}
                                    helperText="* Merek dari tabel brands (Bisa diketik)."
                                />
                            </div>

                            {/* 2. Nama Model */}
                            <div className="md:col-span-1">
                                <InputText
                                    label="Nama Model Laptop"
                                    nama="modelName"
                                    register={register}
                                    error={errors.modelName?.message}
                                    helperText="* Nama tipe/model tanpa nama merek."
                                />
                            </div>

                            {/* 9. Tahun Rilis */}
                            <div className="md:col-span-1">
                                <InputText
                                    label="Tanggal / Tahun Rilis"
                                    nama="releaseYear"
                                    type="date"
                                    register={register}
                                    error={errors.releaseYear?.message}
                                    helperText="* Pilih tanggal peluncuran laptop."
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: SPESIFIKASI DAPUR PACU (PERFORMA) */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black">
                            <span>Spesifikasi Dapur Pacu & Penyimpanan</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 4. Processor */}
                            <div>
                                <InputText
                                    label="Processor"
                                    nama="processor"
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
                            <span>Layar, Baterai & Dimensi Fisik</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 3. Ukuran Layar */}
                            <div>
                                <InputText
                                    label="Ukuran Layar (Inci)"
                                    nama="screenSize"
                                    type="number"
                                    register={register}
                                    error={errors.screenSize?.message}
                                    helperText="* Angka desimal (misal: 13.6)."
                                />
                            </div>

                            {/* 7. Kapasitas Baterai */}
                            <div>
                                <InputText
                                    label="Kapasitas Baterai (Wh / mAh)"
                                    nama="battery"
                                    type="text"
                                    register={register}
                                    error={errors.battery?.message}
                                    helperText="* Angka atau teks kapasitas baterai (misal: 54Wh)."
                                />
                            </div>

                            {/* 8. Berat Laptop */}
                            <div>
                                <InputText
                                    label="Berat Laptop (Kg)"
                                    nama="weight"
                                    type="number"
                                    register={register}
                                    error={errors.weight?.message}
                                    helperText="* Berat dalam Kilogram (misal: 1.24)."
                                />
                            </div>
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
                            label={isSubmitting ? "Menyimpan..." : "Simpan Perubahan Produk"}
                            className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
