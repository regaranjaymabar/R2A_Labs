import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerProfileService, type CustomerProfileData } from "../services/customerProfileService";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, Save, Navigation, Info, User, Mail, History } from "lucide-react";
import { InputText } from "../components/ui/common/InputText";
import { InputPassword } from "../components/ui/common/InputPassword";
import Button from "../components/ui/common/Button";
import toast from "react-hot-toast";

const profileSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi!"),
    email: z.string().email("Format email tidak valid!").min(1, "Email wajib diisi!"),
    password: z.string().refine((val) => val === "" || val.length >= 6, {
        message: "Password minimal 6 karakter!",
    }).optional(),
    latitude: z.union([
        z.string().transform((val) => (val === "" ? null : Number(val))),
        z.number().nullable(),
    ]).optional(),
    longitude: z.union([
        z.string().transform((val) => (val === "" ? null : Number(val))),
        z.number().nullable(),
    ]).optional(),
});

type ProfileFormInput = z.input<typeof profileSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
    const queryClient = useQueryClient();
    const login = useAuthStore((state) => state.login);
    const token = useAuthStore((state) => state.token);
    
    const [isLocating, setIsLocating] = useState(false);
    const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileFormInput, any, ProfileFormData>({
        resolver: zodResolver(profileSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            latitude: "",
            longitude: "",
        },
    });

    // 1. Fetch Profile Data
    const { data: profile, isLoading } = useQuery<CustomerProfileData>({
        queryKey: ["customer-profile"],
        queryFn: () => customerProfileService.getProfile(),
    });

    // Populate form values when data is loaded
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                email: profile.email || "",
                password: "",
                latitude: profile.latitude !== null && profile.latitude !== undefined ? profile.latitude : "",
                longitude: profile.longitude !== null && profile.longitude !== undefined ? profile.longitude : "",
            });
        }
    }, [profile, reset]);

    // 2. Mutation for updating profile
    const updateMutation = useMutation({
        mutationFn: (payload: Partial<CustomerProfileData>) => customerProfileService.updateProfile(payload),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
            
            // Sync user data to auth store so Header/Navbar reflects changes immediately
            if (token) {
                login({
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        storeId: null,
                        role: "customer",
                    },
                    token,
                });
            }

            toast.success("Profil Anda berhasil diperbarui!");
            reset({
                name: updatedUser.name || "",
                email: updatedUser.email || "",
                password: "",
                latitude: updatedUser.latitude !== null && updatedUser.latitude !== undefined ? updatedUser.latitude : "",
                longitude: updatedUser.longitude !== null && updatedUser.longitude !== undefined ? updatedUser.longitude : "",
            });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || err?.message || "Gagal memperbarui profil.";
            toast.error(message);
        },
    });

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Browser Anda tidak mendukung deteksi lokasi (Geolocation).");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = Number(pos.coords.latitude.toFixed(6));
                const lng = Number(pos.coords.longitude.toFixed(6));
                setValue("latitude", String(lat), { shouldValidate: true });
                setValue("longitude", String(lng), { shouldValidate: true });
                setIsLocating(false);
                toast.success("Lokasi GPS Anda berhasil dideteksi!");
            },
            () => {
                setIsLocating(false);
                toast.error("Gagal mendeteksi lokasi. Pastikan izin akses lokasi aktif.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const onSubmit = (data: ProfileFormData) => {
        const payload: Partial<CustomerProfileData> = {
            name: data.name,
            email: data.email,
            latitude: typeof data.latitude === "number" ? data.latitude : null,
            longitude: typeof data.longitude === "number" ? data.longitude : null,
        };

        if (data.password && data.password.trim() !== "") {
            payload.password = data.password;
        }

        updateMutation.mutate(payload);
    };

    const watchedLat = Number(watch("latitude"));
    const watchedLng = Number(watch("longitude"));
    const hasValidCoords = !isNaN(watchedLat) && !isNaN(watchedLng) && watchedLat !== 0 && watchedLng !== 0;
    const displayLat = hasValidCoords ? watchedLat : -6.2088;
    const displayLng = hasValidCoords ? watchedLng : 106.8456;

    // Nominatim Reverse Geocoding
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
            <div className="flex flex-col items-center justify-center min-h-[400px] pt-32 pb-20 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-medium text-zinc-500">Memuat profil Anda...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/20 pb-5 text-center sm:text-left">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2.5">
                        <span>Profil Saya</span>
                    </h1>
                    <p className="text-sm text-zinc-600 mt-1">
                        Kelola data diri dan lokasi Anda untuk mendapatkan rekomendasi toko laptop terdekat.
                    </p>
                </div>
                <Link
                    to="/spk/history"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap self-center sm:self-auto"
                >
                    <History className="w-4 h-4" />
                    <span>Riwayat Request SPK</span>
                </Link>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-[30px] border border-white/30 shadow-xl overflow-hidden">
                <div className="h-2 bg-black"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
                    {/* General Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 text-sm font-bold text-black">
                            <User size={16} />
                            <span>Informasi Umum & Kontak</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputText
                                    label="Nama Lengkap *"
                                    nama="name"
                                    register={register}
                                    error={errors.name?.message}
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                            </div>

                            <div>
                                <InputText
                                    label="Email *"
                                    nama="email"
                                    type="email"
                                    register={register}
                                    error={errors.email?.message}
                                    placeholder="Masukkan email Anda"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div>
                                <InputPassword
                                    label="Password Baru"
                                    nama="password"
                                    register={register}
                                    error={errors.password?.message}
                                    placeholder="Kosongkan jika tidak ingin diubah"
                                />
                                <p className="text-[10px] text-zinc-500 mt-1">
                                    Minimal 6 karakter. Biarkan kosong jika Anda ingin tetap menggunakan password saat ini.
                                </p>
                            </div>
                            
                            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-center text-xs text-zinc-600 space-y-1">
                                <p className="font-bold text-black flex items-center gap-1.5">
                                    <Mail size={12} />
                                    <span>Informasi Keanggotaan</span>
                                </p>
                                <p>Terdaftar sejak: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) : "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Geolocation Coordinate Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 text-sm font-bold text-black">
                            <Navigation size={16} />
                            <span>Alamat Koordinat GPS (Lokasi Anda)</span>
                        </div>

                        <div className="pt-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-black mt-0.5 shrink-0" />
                                    <div className="text-xs text-zinc-700 space-y-1">
                                        <p className="font-bold text-black">Koordinat GPS (Latitude & Longitude)</p>
                                        <p>
                                            Gunakan deteksi lokasi otomatis browser atau salin koordinat langsung dari Google Maps (klik kanan titik rumah/kantor Anda dan salin angka koordinat).
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetCurrentLocation}
                                    disabled={isLocating}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-medium text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
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

                        <div className="p-4 rounded-2xl bg-white border border-zinc-200">
                            <InputText
                                label="Deteksi Koordinat Cepat (Tempel dari Google Maps)"
                                placeholder="Contoh tempel di sini: -6.175392, 106.827153"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const parts = val.split(",").map((s) => s.trim());
                                    if (parts.length >= 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
                                        setValue("latitude", parts[0], { shouldValidate: true });
                                        setValue("longitude", parts[1], { shouldValidate: true });
                                        toast.success("Koordinat Google Maps dipisahkan otomatis!");
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

                        {detectedLocation && (
                            <div className="space-y-2 pt-1">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-semibold">
                                    <span>Wilayah Terdeteksi:</span>
                                    <span className="font-bold underline">{detectedLocation}</span>
                                </div>
                            </div>
                        )}

                        {/* Interactive OpenStreetMap Preview */}
                        <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                            <div className="bg-zinc-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200">
                                <span className="text-xs font-semibold text-zinc-700">
                                    {hasValidCoords
                                        ? "Pratinjau Lokasi Anda di Peta"
                                        : "Pratinjau Peta (Titik belum ditentukan)"}
                                </span>
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
                            <div className="w-full h-64 bg-zinc-100 relative">
                                <iframe
                                    title="Peta Lokasi Customer"
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

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-zinc-100 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={updateMutation.isPending}
                            label="Simpan Perubahan Profil"
                            icon={<Save className="w-4 h-4" />}
                            className="px-6 py-2.5 rounded-xl cursor-pointer"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
