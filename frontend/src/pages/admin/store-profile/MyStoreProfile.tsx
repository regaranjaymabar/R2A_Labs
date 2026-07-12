import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeAdminService, type StoreProfileData } from "../../../services/storeAdminService";
import { MapPin, Loader2, Save, Navigation, Info } from "lucide-react";
import { InputText } from "../../../components/ui/common/InputText";
import { TextArea } from "../../../components/ui/common/TextArea";
import { InputSearchSelect } from "../../../components/ui/common/InputSearchSelect";
import { Button } from "../../../components/ui/common/Button";
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
    const [isLocating, setIsLocating] = useState(false);
    const { data: cities = [], isLoading: isCitiesLoading } = useIndonesianCities();

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
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

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrorMsg("Browser Anda tidak mendukung fitur deteksi lokasi (Geolocation).");
            return;
        }
        setIsLocating(true);
        setErrorMsg(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = Number(pos.coords.latitude.toFixed(6));
                const lng = Number(pos.coords.longitude.toFixed(6));
                setValue("latitude", String(lat), { shouldValidate: true });
                setValue("longitude", String(lng), { shouldValidate: true });
                setIsLocating(false);
                setSuccessMsg("Berhasil mengambil koordinat lokasi toko Anda saat ini!");
                setTimeout(() => setSuccessMsg(null), 4000);
            },
            () => {
                setIsLocating(false);
                setErrorMsg("Gagal mendeteksi lokasi. Pastikan izin akses lokasi aktif di browser Anda.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

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

    const watchedLat = Number(watch("latitude"));
    const watchedLng = Number(watch("longitude"));
    const watchedCity = watch("city") || "";
    const hasValidCoords = !isNaN(watchedLat) && !isNaN(watchedLng) && watchedLat !== 0 && watchedLng !== 0;
    const displayLat = hasValidCoords ? watchedLat : -6.2088;
    const displayLng = hasValidCoords ? watchedLng : 106.8456;

    const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

    useEffect(() => {
        if (!hasValidCoords) {
            setDetectedLocation(null);
            return;
        }
        const timer = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${watchedLat}&lon=${watchedLng}&format=json`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.address) {
                        const addr = data.address;
                        const area = addr.city || addr.regency || addr.county || addr.town || addr.state || "";
                        const state = addr.state || "";
                        setDetectedLocation(Array.from(new Set([area, state].filter(Boolean))).join(", "));
                    }
                })
                .catch(() => setDetectedLocation(null));
        }, 800);
        return () => clearTimeout(timer);
    }, [watchedLat, watchedLng, hasValidCoords]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-sm font-medium text-gray-500">Memuat data profil toko...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                        <span>Profil Tokoku</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola identitas, alamat, dan titik lokasi toko kamu agar mudah dicari pelanggan.
                    </p>
                </div>
            </div>

            {/* Notification Banner */}
            {successMsg && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                    <span>{successMsg}</span>
                </div>
            )}

            {errorMsg && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Form Box */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="h-2 bg-black"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
                    {/* Section 1: Identitas Toko */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-gray-900">
                            <span>Informasi Umum & Kontak</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputText
                                    label="Nama Toko / Cabang *"
                                    nama="name"
                                    register={register}
                                    error={errors.name?.message}
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Nomor Telepon / WhatsApp *"
                                    nama="phone"
                                    register={register}
                                    error={errors.phone?.message}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Alamat & Lokasi */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 text-sm font-bold text-gray-900">
                            <span>Alamat Lengkap & Koordinat Peta</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <InputSearchSelect
                                    label="Kota *"
                                    name="city"
                                    control={control}
                                    options={cities}
                                    isLoading={isCitiesLoading}
                                    error={errors.city?.message}
                                />
                            </div>

                            <div>
                                <TextArea
                                    label="Alamat Jalan *"
                                    nama="address"
                                    register={register}
                                    error={errors.address?.message}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Helper Lokasi GPS */}
                        <div className="pt-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-200">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-black mt-0.5 shrink-0" />
                                    <div className="text-xs text-gray-700 space-y-1">
                                        <p className="font-semibold text-gray-900">Koordinat GPS Toko (Latitude & Longitude)</p>
                                        <p>
                                            Klik tombol deteksi otomatis atau buka <b>Google Maps</b> → klik kanan pada titik toko Anda → klik angka koordinat untuk menyalin.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetCurrentLocation}
                                    disabled={isLocating}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-gray-800    text-white font-medium text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
                                >
                                    {isLocating ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Mendeteksi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Navigation className="w-3.5 h-3.5" />
                                            <span>Gunakan Lokasi Saat Ini</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Smart Paste Google Maps */}
                        <div className="p-4 rounded-2xl bg-white border border-indigo-200">
                            <InputText
                                label="Tempel lokasi google maps disini *"
                                placeholder="Contoh tempel di sini: -6.879293230671416, 109.1337399269172"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const parts = val.split(",").map((s) => s.trim());
                                    if (parts.length >= 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
                                        setValue("latitude", parts[0], { shouldValidate: true });
                                        setValue("longitude", parts[1], { shouldValidate: true });
                                        setSuccessMsg("Koordinat Google Maps berhasil dipisahkan otomatis ke Latitude & Longitude!");
                                        setTimeout(() => setSuccessMsg(null), 3000);
                                    }
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputText
                                    label="Latitude (Garis Lintang)"
                                    nama="latitude"
                                    type="number"
                                    step="any"
                                    register={register}
                                    error={errors.latitude?.message}
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
                                />
                            </div>
                        </div>

                        {/* Reverse Geocode Badge & Mismatch Alert */}
                        {detectedLocation && (
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                                    <span>📍 Wilayah Koordinat Terdeteksi:</span>
                                    <span className="font-bold underline">{detectedLocation}</span>
                                </div>

                                {watchedCity &&
                                    !detectedLocation
                                        .toLowerCase()
                                        .includes(
                                            watchedCity
                                                .toLowerCase()
                                                .replace(/kabupaten|kota/gi, "")
                                                .trim()
                                        ) && (
                                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                                            <span className="text-base">⚠️</span>
                                            <div>
                                                <p className="font-bold">Perhatian: Potensi Perbedaan Lokasi!</p>
                                                <p className="font-normal mt-0.5">
                                                    Kota yang Anda pilih adalah <b>"{watchedCity}"</b>, namun koordinat GPS yang dimasukkan berada di area <b>"{detectedLocation}"</b>. Pastikan koordinat yang ditempel sudah sesuai dengan cabang toko.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}

                        {/* Interactive OpenStreetMap Preview */}
                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 shadow-md transition-all animate-fadeIn">
                            <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                    <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>
                                        {hasValidCoords
                                            ? "Pratinjau Titik Lokasi Toko di Peta (OpenStreetMap)"
                                            : "Pratinjau Peta (Titik belum ditentukan — Klik tombol 'Gunakan Lokasi Saat Ini')"}
                                    </span>
                                </div>
                                {hasValidCoords && (
                                    <a
                                        href={`https://www.google.com/maps?q=${watchedLat},${watchedLng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1 shrink-0"
                                    >
                                        <span>Buka di Google Maps</span>
                                        <span>↗</span>
                                    </a>
                                )}
                            </div>
                            <div className="w-full h-64 bg-gray-100 relative">
                                <iframe
                                    title="Peta Lokasi Toko"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    src={`https://maps.google.com/maps?q=${displayLat},${displayLng}&hl=id&z=15&output=embed`}
                                    className="w-full h-full border-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={updateMutation.isPending}
                            label="Simpan Perubahan Profil"
                            icon={<Save className="w-4 h-4" />}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
