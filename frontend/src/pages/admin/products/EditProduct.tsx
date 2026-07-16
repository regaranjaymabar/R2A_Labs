import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Upload,
    Trash2,
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
        setValue,
        watch,
    } = useEditProduct();

    const imageFile = watch("image");
    const removeImageFlag = watch("removeImage");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile instanceof File) {
            const url = URL.createObjectURL(imageFile);
            setPreviewUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else if (removeImageFlag) {
            setPreviewUrl(null);
        } else if (productData?.imageUrl) {
            setPreviewUrl(productData.imageUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [imageFile, removeImageFlag, productData?.imageUrl]);

    // ambil data brand
    const { data: brands = [], isLoading: isBrandsLoading } = useQuery({
        queryKey: ["brands"],
        queryFn: brandService.getAll,
    });

    if (isLoadingData) {
        return (
            <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                <p className="text-sm font-bold text-gray-600">
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                            <span>{headerTitle}</span>
                        </h1>
                    </div>
                </div>

                <Link
                    to="/admin/products"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="h-2 bg-black"></div>
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    {/* SECTION 0: FOTO PRODUK */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
                            <span>Foto Produk</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Preview Box */}
                            <div className="w-64 h-64 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 relative group shadow-inner">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                        <span className="text-[11px] text-gray-400 font-medium">Belum ada foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-3 w-full sm:w-auto">
                                <div className="text-xs text-gray-500 font-medium">
                                    Unggah foto produk laptop. Format yang didukung: JPEG, PNG, WebP. Maksimal ukuran 2MB.
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-md active:scale-95">
                                        <Upload className="w-4 h-4" />
                                        <span>Pilih File</span>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setValue("image", file);
                                                    setValue("removeImage", false);
                                                }
                                            }}
                                        />
                                    </label>
                                    {previewUrl && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue("image", null);
                                                setValue("removeImage", true);
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-200 cursor-pointer active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Hapus Foto</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
                            <span>Informasi Laptop</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        isBrandsLoading ? "Memuat Brand..." : "-- Cari atau Pilih Brand --"
                                    }
                                    isLoading={isBrandsLoading}
                                    disabled={isBrandsLoading}
                                    error={errors.brandId?.message}
                                    helperText="* Brand dari tabel brands (Bisa diketik)."
                                />
                            </div>

                            <div className="md:col-span-1">
                                <InputText
                                    label="Nama Model Laptop"
                                    nama="modelName"
                                    register={register}
                                    error={errors.modelName?.message}
                                    helperText="* Nama tipe/model tanpa nama brand."
                                />
                            </div>

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

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
                            <span>Spesifikasi Dapur Pacu & Penyimpanan</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                            <div>
                                <InputText
                                    label="Processor"
                                    nama="processor"
                                    register={register}
                                    error={errors.processor?.message}
                                    helperText="* Tipe dan generasi prosesor."
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Kapasitas RAM (GB)"
                                    nama="ram"
                                    register={register}
                                    error={errors.ram?.message}
                                    helperText="* Angka kapasitas RAM dalam GB."
                                />
                            </div>

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

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
                            <span>Layar, Baterai & Dimensi Fisik</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
