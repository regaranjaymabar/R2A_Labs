import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeAdminService, type StoreProfileData } from "../../../services/storeAdminService";
import { Store, MapPin, CheckCircle2, Loader2, Save } from "lucide-react";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSearchSelect } from "../../../components/ui/common/InputSearchSelect";
import { useIndonesianCities } from "../../../hooks/useIndonesianCities";

export const storeProfileSchema = z.object({
    name: z.string().min(1, "Nama toko wajib diisi!"),
    address: z.string().min(1, "Alamat toko wajib diisi!"),
    city: z.string().min(1, "Kota wajib diisi!"),
    phone: z.string().min(8, "Nomor telepon minimal 8 digit!").max(13, "Nomor telepon maksimal 13 digit!"),
    latitude: z.union([
        z.string().transform((val) => (val === "" ? null : Number(val))),
        z.number().nullable(),
    ]).optional(),
    longitude: z.union([
        z.string().transform((val) => (val === "" ? null : Number(val))),
        z.number().nullable(),
    ]).optional(),
});

export type StoreProfileFormInput = z.input<typeof storeProfileSchema>;
export type StoreProfileFormData = z.infer<typeof storeProfileSchema>;

export default function MyStoreProfile() {
    const queryClient = useQueryClient();
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { data: cities = [], isLoading: isCitiesLoading } = useIndonesianCities();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<StoreProfileFormInput, any, StoreProfileFormData>({
        resolver: zodResolver(storeProfileSchema) as any,
        defaultValues: {
            name: "",
            address: "",
            city: "",
            phone: "",
            latitude: "",
            longitude: "",
        },
    });

    // Fetch Profil Toko
    const { data: profile, isLoading } = useQuery<StoreProfileData>({
        queryKey: ["store-profile"],
        queryFn: () => storeAdminService.getProfile(),
    });

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                address: profile.address || "",
                city: profile.city || "",
                phone: profile.phone || "",
                latitude: profile.latitude !== null && profile.latitude !== undefined ? profile.latitude : "",
                longitude: profile.longitude !== null && profile.longitude !== undefined ? profile.longitude : "",
            });
        }
    }, [profile, reset]);

    // Update Profil Mutation
    const updateMutation = useMutation({
        mutationFn: (payload: Partial<StoreProfileData>) => storeAdminService.updateProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store-profile"] });
            setSuccessMsg("Profil toko berhasil diperbarui!");
            setErrorMsg(null);
            setTimeout(() => setSuccessMsg(null), 4000);
        },
        onError: (err: any) => {
            setErrorMsg(err?.response?.data?.message || err?.message || "Gagal memperbarui profil toko.");
            setSuccessMsg(null);
        },
    });

    const onSubmit = (data: StoreProfileFormData) => {
        updateMutation.mutate(data as Partial<StoreProfileData>);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat data profil toko...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                        <Store className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        <span>Profil Tokoku (Store Profile)</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Kelola identitas, alamat, dan titik lokasi toko kamu agar mudah dicari pelanggan.
                    </p>
                </div>
            </div>

            {/* Notification Banner */}
            {successMsg && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {errorMsg && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-medium">
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Form Box */}
            <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="h-2 bg-linear-to-r from-purple-600 to-indigo-600"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
                    {/* Section 1: Identitas Toko */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-purple-400">
                            <Store className="w-4 h-4" />
                            <span>Informasi Umum & Kontak</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputText
                                    label="Nama Toko / Cabang *"
                                    nama="name"
                                    register={register}
                                    error={errors.name?.message}
                                    placeholder="Contoh: Laptop Zone Jakarta"
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Nomor Telepon / WhatsApp *"
                                    nama="phone"
                                    register={register}
                                    error={errors.phone?.message}
                                    placeholder="Contoh: 081234567890"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Alamat & Lokasi */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-purple-400">
                            <MapPin className="w-4 h-4" />
                            <span>Alamat Lengkap & Koordinat Peta</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputSearchSelect
                                    label="Kota *"
                                    name="city"
                                    control={control}
                                    options={cities}
                                    isLoading={isCitiesLoading}
                                    error={errors.city?.message}
                                    placeholder="Cari atau pilih kota..."
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Alamat Jalan *"
                                    nama="address"
                                    register={register}
                                    error={errors.address?.message}
                                    placeholder="Contoh: Jl. Sudirman No. 12"
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Latitude (Garis Lintang)"
                                    nama="latitude"
                                    type="number"
                                    step="any"
                                    register={register}
                                    error={errors.latitude?.message}
                                    placeholder="Contoh: -6.1754"
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Longitude (Garis Bujur)"
                                    nama="longitude"
                                    type="number"
                                    step="any"
                                    register={register}
                                    error={errors.longitude?.message}
                                    placeholder="Contoh: 106.8272"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Simpan Perubahan Profil</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
