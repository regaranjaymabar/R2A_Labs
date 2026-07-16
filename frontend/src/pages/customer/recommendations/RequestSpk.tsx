import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { customerProfileService } from "../../../services/customerProfileService";
import { customerSpkService, type SpkRequestPayload } from "../../../services/customerSpkService";
import { Loader2, Navigation, Info, Award, HelpCircle, ArrowRight, History } from "lucide-react";
import { InputText } from "../../../components/ui/common/InputText";
import Button from "../../../components/ui/common/Button";
import toast from "react-hot-toast";

const CRITERIAS_LIST = [
  { id: 1, code: "C1", name: "Harga", type: "cost", desc: "Harga produk laptop (Semakin murah semakin prioritas)" },
  { id: 2, code: "C2", name: "RAM", type: "benefit", desc: "Kapasitas RAM laptop (Semakin besar semakin prioritas)" },
  { id: 3, code: "C3", name: "Storage", type: "benefit", desc: "Kapasitas penyimpanan SSD/HDD (Semakin besar semakin prioritas)" },
  { id: 4, code: "C4", name: "Battery", type: "benefit", desc: "Kapasitas baterai laptop dalam Wh (Semakin awet semakin prioritas)" },
  { id: 5, code: "C5", name: "Berat", type: "cost", desc: "Berat fisik laptop dalam Kg (Semakin ringan semakin prioritas)" },
  { id: 6, code: "C6", name: "Processor", type: "benefit", desc: "Performa benchmark processor (Semakin cepat semakin prioritas)" },
  { id: 7, code: "C7", name: "Ukuran Layar", type: "benefit", desc: "Bentang layar laptop dalam Inch (Semakin luas semakin prioritas)" },
  { id: 8, code: "C8", name: "Tahun Rilis", type: "benefit", desc: "Tahun rilis laptop ke pasar (Semakin baru semakin prioritas)" },
];

const requestSchema = z.object({
  kebutuhan: z.string().min(10, "Deskripsi kebutuhan minimal 10 karakter!"),
  budgetMin: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => val >= 1000000, { message: "Budget minimal Rp 1.000.000!" }),
  budgetMax: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => val >= 1000000, { message: "Budget maksimal Rp 1.000.000!" }),
  userLat: z.union([
    z.string().transform((val) => (val === "" ? null : Number(val))),
    z.number().nullable(),
  ]).optional(),
  userLng: z.union([
    z.string().transform((val) => (val === "" ? null : Number(val))),
    z.number().nullable(),
  ]).optional(),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Budget maksimal tidak boleh lebih kecil dari budget minimal!",
  path: ["budgetMax"],
});

type RequestFormInput = z.input<typeof requestSchema>;
type RequestFormData = z.infer<typeof requestSchema>;

export default function RequestSpk() {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);

  // Initialize weights state for each criteria (scale 0-10)
  const [weights, setWeights] = useState<Record<number, number>>({
    1: 5, // Harga
    2: 5, // RAM
    3: 5, // Storage
    4: 5, // Battery
    5: 5, // Berat
    6: 5, // Processor
    7: 5, // Ukuran Layar
    8: 5, // Tahun Rilis
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RequestFormInput, any, RequestFormData>({
    resolver: zodResolver(requestSchema) as any,
    defaultValues: {
      kebutuhan: "",
      budgetMin: "",
      budgetMax: "",
      userLat: "",
      userLng: "",
    },
  });

  // 1. Fetch Profile to get coordinates fallback
  const { data: profile } = useQuery({
    queryKey: ["customer-profile"],
    queryFn: () => customerProfileService.getProfile(),
  });

  useEffect(() => {
    if (profile) {
      if (profile.latitude !== null && profile.latitude !== undefined) {
        setValue("userLat", String(profile.latitude));
      }
      if (profile.longitude !== null && profile.longitude !== undefined) {
        setValue("userLng", String(profile.longitude));
      }
    }
  }, [profile, setValue]);

  // Dynamic weights calculations
  const totalRawWeight = useMemo(() => {
    return Object.values(weights).reduce((sum, w) => sum + w, 0);
  }, [weights]);

  const getWeightPercentage = (id: number): string => {
    const rawVal = weights[id] ?? 5;
    if (totalRawWeight === 0) return "12.5%";
    const pct = (rawVal / totalRawWeight) * 100;
    return `${pct.toFixed(1)}%`;
  };

  const handleWeightChange = (id: number, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  // 2. Geolocation automatic detection
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
        setValue("userLat", String(lat));
        setValue("userLng", String(lng));
        setIsLocating(false);
        toast.success("Lokasi GPS terdeteksi!");
      },
      () => {
        setIsLocating(false);
        toast.error("Gagal mendeteksi lokasi otomatis. Menggunakan fallback koordinat profil.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 3. Mutation to submit request
  const requestMutation = useMutation({
    mutationFn: (payload: SpkRequestPayload) => customerSpkService.createRequest(payload),
    onSuccess: (data) => {
      toast.success("Rekomendasi SPK Anda berhasil dihitung!");
      navigate(`/spk/result/${data.id}`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Gagal menghitung rekomendasi SPK.";
      toast.error(msg);
    },
  });

  const onSubmit = (data: RequestFormData) => {
    // Normalise weights layout to submit
    const weightsPayload = CRITERIAS_LIST.map((crit) => {
      const rawVal = weights[crit.id] ?? 5;
      const normalizedW = totalRawWeight > 0 ? Number((rawVal / totalRawWeight).toFixed(4)) : 0.125;
      return {
        criteriaId: crit.id,
        weight: normalizedW,
      };
    });

    const payload: SpkRequestPayload = {
      kebutuhan: data.kebutuhan,
      budgetMin: Number(data.budgetMin),
      budgetMax: Number(data.budgetMax),
      userLat: data.userLat !== null && data.userLat !== undefined ? Number(data.userLat) : null,
      userLng: data.userLng !== null && data.userLng !== undefined ? Number(data.userLng) : null,
      weights: weightsPayload,
    };

    requestMutation.mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-32 space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-zinc-150 pb-5 text-center sm:text-left">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <Award className="w-8 h-8 text-black" />
            <span>Rekomendasi Laptop SPK</span>
          </h1>
          <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed mt-2">
            Temukan laptop ideal Anda menggunakan sistem pendukung keputusan (SPK). Cukup masukkan detail kebutuhan, budget riil, koordinat GPS Anda, serta geser prioritas spesifikasi laptop.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/spk/history")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap self-center sm:self-auto"
        >
          <History className="w-4 h-4" />
          <span>Riwayat Request</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[30px] border border-gray-200/80 shadow-xl p-6 md:p-8 space-y-8">
          
          {/* Section 1: Kebutuhan & Budget */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 text-sm font-bold text-gray-900">
              <Info size={16} />
              <span>1. Kebutuhan Penggunaan & Budget Anda</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-900">Apa Kebutuhan Utama Laptop Anda? *</label>
                <textarea
                  {...register("kebutuhan")}
                  placeholder="Contoh: Saya membutuhkan laptop untuk kuliah teknik informatika, coding web, serta bermain game ringan seperti Valorant..."
                  className={`w-full min-h-[100px] p-4 text-sm rounded-2xl border bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-black/20 transition ${
                    errors.kebutuhan ? "border-red-500" : "border-zinc-300"
                  }`}
                />
                {errors.kebutuhan && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.kebutuhan.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputText
                    label="Budget Minimum (Rupiah) *"
                    nama="budgetMin"
                    type="number"
                    register={register}
                    error={errors.budgetMin?.message}
                    placeholder="Contoh: 5000000"
                  />
                </div>

                <div>
                  <InputText
                    label="Budget Maksimum (Rupiah) *"
                    nama="budgetMax"
                    type="number"
                    register={register}
                    error={errors.budgetMax?.message}
                    placeholder="Contoh: 12000000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Koordinat Lokasi */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 text-sm font-bold text-gray-900">
              <Navigation size={16} />
              <span>2. Koordinat Lokasi Anda (Untuk Jarak Toko)</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">Peta Jarak Toko Terdekat</p>
                  <p className="text-zinc-500">
                    Sistem akan mengukur jarak toko secara riil dari titik koordinat GPS Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Mendeteksi GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3" />
                      <span>Gunakan GPS Sekarang</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputText
                    label="Latitude Anda (Opsional)"
                    nama="userLat"
                    type="number"
                    step="any"
                    register={register}
                    error={errors.userLat?.message}
                    placeholder="Auto-load dari profile koordinat"
                  />
                </div>

                <div>
                  <InputText
                    label="Longitude Anda (Opsional)"
                    nama="userLng"
                    type="number"
                    step="any"
                    register={register}
                    error={errors.userLng?.message}
                    placeholder="Auto-load dari profile koordinat"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bobot Spesifikasi Sliders */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <HelpCircle size={16} />
                <span>3. Prioritas Spesifikasi Laptop (Bobot Kriteria)</span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                Total Bobot: {totalRawWeight} Poin
              </span>
            </div>

            <div className="space-y-8">
              <p className="text-xs text-zinc-500 leading-relaxed bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                ⚙️ **Tips Slider:** Geser slider ke kanan jika spesifikasi tersebut sangat Anda prioritaskan. Persentase (%) di samping kanan menunjukkan bobot relatif yang akan digunakan dalam perhitungan SPK (SAW, WP, TOPSIS).
              </p>

              {/* Sliders Grid with Touch Target Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {CRITERIAS_LIST.map((crit) => {
                  const val = weights[crit.id] ?? 5;
                  const pct = getWeightPercentage(crit.id);
                  return (
                    <div 
                      key={crit.id} 
                      className="p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all flex flex-col gap-3 min-h-[110px]"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="text-xs font-bold text-gray-900 font-mono bg-zinc-200/60 px-1.5 py-0.5 rounded-md mr-1.5">{crit.code}</span>
                          <span className="text-xs font-bold text-gray-900">{crit.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold font-mono text-gray-900 mr-2">{val}/10</span>
                          <span className="text-xs font-black font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md text-[10px]">{pct}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{crit.desc}</p>
                      
                      {/* Generous touch target margin: py-2 */}
                      <div className="py-2">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={val}
                          onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-hidden"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 border border-zinc-200 p-6 rounded-3xl">
          <div className="text-center sm:text-left">
            <p className="text-xs text-zinc-500 font-medium">Dengan mengklik submit, backend akan memproses ranking Top 10 secara simultan.</p>
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={requestMutation.isPending}
            label={requestMutation.isPending ? "Sedang Menghitung SPK..." : "Hitung Rekomendasi SPK"}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold cursor-pointer transition active:scale-98 shadow-md"
          />
        </div>
      </form>
    </div>
  );
}
