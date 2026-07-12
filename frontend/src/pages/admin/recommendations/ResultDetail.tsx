import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Sliders,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  Cpu,
  Loader2,
  Scale,
  Table,
  Info,
  Award,
  HelpCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { useGet } from "../../../hooks/useGet";
import { recommendationService } from "../../../services/recommendationService";
import { productWeightService } from "../../../services/productWeightService";
import { initialHistory } from "./ReqHistory";

// Definisi Kriteria SPK Utama
const CRITERIAS = [
  { code: "C1", name: "Harga", type: "cost", desc: "Harga produk laptop (Semakin murah semakin baik)" },
  { code: "C2", name: "RAM", type: "benefit", desc: "Kapasitas RAM laptop (Semakin besar semakin baik)" },
  { code: "C3", name: "Storage", type: "benefit", desc: "Kapasitas Storage/Penyimpanan (Semakin besar semakin baik)" },
  { code: "C4", name: "Battery", type: "benefit", desc: "Kapasitas Baterai laptop dalam Wh (Semakin awet semakin baik)" },
  { code: "C5", name: "Berat", type: "cost", desc: "Berat fisik laptop dalam Kg (Semakin ringan semakin baik)" },
  { code: "C6", name: "Processor", type: "benefit", desc: "Kelas benchmark performa processor (Semakin tinggi semakin baik)" },
  { code: "C7", name: "Ukuran Layar", type: "benefit", desc: "Bentang layar laptop dalam Inch (Semakin luas semakin baik)" },
  { code: "C8", name: "Tahun Rilis", type: "benefit", desc: "Tahun rilis laptop ke pasar (Semakin baru semakin baik)" },
];

// Helper konversi spesifikasi ke skala 1-5 (Fallback jika tidak ada di database)
const getCriteriaScaleValue = (criteriaCode: string, alt: any): number => {
  // Cek apakah ada rating dari DB yang dicocokkan sebelumnya
  const dbVal = alt.dbWeights?.find((w: any) => w.criteria_code === criteriaCode);
  if (dbVal && dbVal.value_numeric !== undefined && dbVal.value_numeric !== null) {
    return Number(dbVal.value_numeric);
  }

  // Fallback konversi spesifikasi mentah jika belum terkonfigurasi di database
  switch (criteriaCode) {
    case "C1": { // Harga (cost)
      const price = Number(alt.price);
      if (price < 6000000) return 5;
      if (price < 10000000) return 4;
      if (price < 15000000) return 3;
      if (price < 20000000) return 2;
      return 1;
    }
    case "C2": { // RAM (benefit)
      const ram = String(alt.ram).toLowerCase();
      if (ram.includes("64")) return 5;
      if (ram.includes("32")) return 4;
      if (ram.includes("16")) return 3;
      if (ram.includes("8")) return 2;
      if (ram.includes("4")) return 1;
      return 2;
    }
    case "C3": { // Storage (benefit)
      const storage = String(alt.storage).toLowerCase();
      if (storage.includes("2") && storage.includes("tb")) return 4;
      if (storage.includes("1") && storage.includes("tb")) return 3;
      if (storage.includes("512")) return 2;
      if (storage.includes("256")) return 1;
      return 2;
    }
    case "C4": { // Battery (benefit)
      const batteryStr = String(alt.battery).toLowerCase();
      const match = batteryStr.match(/(\d+)/);
      const wh = match ? parseInt(match[1]) : 50;
      if (wh < 30) return 1;
      if (wh < 45) return 1.5;
      if (wh < 60) return 2;
      if (wh < 76) return 3;
      if (wh < 91) return 4;
      return 5;
    }
    case "C5": { // Berat (cost)
      const weightStr = String(alt.weight).toLowerCase();
      const match = weightStr.match(/([0-9.]+)/);
      const kg = match ? parseFloat(match[1]) : 1.6;
      if (kg < 1.2) return 5;
      if (kg < 1.5) return 4;
      if (kg < 2.0) return 3;
      if (kg < 2.5) return 2;
      return 1;
    }
    case "C6": { // Processor (benefit)
      const proc = String(alt.cpu).toLowerCase();
      if (proc.includes("celeron") || proc.includes("pentium") || proc.includes("athlon")) return 1;
      if (proc.includes("i3") || proc.includes("ryzen 3")) return 2;
      if (proc.includes("i5") || proc.includes("ryzen 5")) return 3;
      if (proc.includes("i7") || proc.includes("ryzen 7")) return 4;
      if (proc.includes("i9") || proc.includes("ryzen 9") || proc.includes("m1") || proc.includes("m2") || proc.includes("m3") || proc.includes("ultra 9")) return 5;
      return 3;
    }
    case "C7": { // Ukuran Layar (benefit)
      const screenStr = String(alt.screenSize || "14").toLowerCase();
      const match = screenStr.match(/([0-9.]+)/);
      const inches = match ? parseFloat(match[1]) : 14.0;
      if (inches < 13) return 1;
      if (inches < 14) return 2;
      if (inches < 15) return 3;
      if (inches < 16) return 4;
      return 5;
    }
    case "C8": { // Tahun Rilis (benefit)
      const yearStr = String(alt.releaseYear).toLowerCase();
      const match = yearStr.match(/(\d{4})/);
      const year = match ? parseInt(match[1]) : 2023;
      if (year < 2021) return 1;
      if (year === 2021) return 2;
      if (year === 2022) return 3;
      if (year === 2023) return 4;
      return 5;
    }
    default:
      return 3;
  }
};

export default function ResultDetail() {
  const { id } = useParams();

  // Tab State utama (Metode Perhitungan) & Sub-Tab (Langkah Perhitungan)
  const [activeMethod, setActiveMethod] = useState<"SAW" | "WP" | "TOPSIS">("SAW");
  const [activeStepTab, setActiveStepTab] = useState<"decision" | "norm" | "rank">("rank");

  // State rumus tooltip/popover untuk menunjukkan jalannya matematika
  const [activeFormulaDetails, setActiveFormulaDetails] = useState<{
    cellKey: string;
    description: string;
  } | null>(null);

  // Fetch riwayat detail request SPK
  const { data: fetchedData, isLoading } = useGet({
    queryKey: ["recommendation-detail", id || ""],
    queryFn: () => recommendationService.getById(id!),
    enabled: !!id,
    offlineFallbackData: initialHistory.find((item) => String(item.id) === String(id)) || initialHistory[0],
  });

  // Fetch pemetaan kriteria-alternatif asli dari database (ProductCriteria)
  const { data: allWeights } = useGet<any[]>({
    queryKey: ["product-weights-all"],
    queryFn: () => productWeightService.getAll(),
    offlineFallbackData: [],
  });

  // Parsing data mentah session & weights
  const session = useMemo(() => {
    if (!fetchedData) return null;
    const data: any = fetchedData;

    const rawWeights = data.recommendationWeights || [];
    const results = data.recommendationResults || [];

    const formatBudget = () => {
      if (data.budget_range) return data.budget_range;
      if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
        return `Rp ${Number(data.budgetMin).toLocaleString("id-ID")} - Rp ${Number(data.budgetMax).toLocaleString("id-ID")}`;
      }
      return "-";
    };

    return {
      id: data.id ?? id ?? "-",
      user_name: data.user_name || data.customer?.name || "Pengguna",
      user_email: data.user_email || data.customer?.email || "-",
      usage_purpose: data.usage_purpose || data.kebutuhan || "Umum",
      budget_range: formatBudget(),
      created_at: data.created_at || data.createdAt || "-",
      user_choice: data.user_choice || "-",
      rawWeights,
      results,
    };
  }, [fetchedData, id]);

  // Petakan bobot kriteria W secara dinamis
  const weightsMap = useMemo(() => {
    // Default weights jika database kosong
    const map: Record<string, number> = {
      C1: 0.3,
      C2: 0.25,
      C3: 0.25,
      C4: 0.1,
      C5: 0.1,
      C6: 0,
      C7: 0,
      C8: 0,
    };

    if (session && Array.isArray(session.rawWeights)) {
      session.rawWeights.forEach((rw: any) => {
        // criteria_code atau map ke criteriaId
        const code = rw.criteria?.code || (rw.criteriaId ? `C${rw.criteriaId}` : "");
        if (code) {
          map[code] = Number(rw.weight);
        }
      });
    }

    return map;
  }, [session]);

  // Filter alternatif teratas berdasarkan metode yang aktif
  const activeAlternatives = useMemo(() => {
    if (!session || !Array.isArray(session.results)) return [];

    return session.results
      .filter((r: any) => r.methodUsed === activeMethod || r.method_used === activeMethod)
      .sort((a: any, b: any) => (a.ranking || a.rank || 1) - (b.ranking || b.rank || 1))
      .map((r: any, index: number) => {
        const pStore = r.productStore || {};
        const prod = pStore.product || {};
        const brandName = prod.brand?.name || prod.brand || "-";
        const price = pStore.price ?? 0;
        const distance = pStore.distanceInKm ?? null;
        const ram = prod.ram || "-";
        const cpu = prod.processor || "-";
        const storage = prod.storage || "-";
        const battery = prod.battery || "-";
        const weight = prod.weight || "-";
        const screenSize = prod.screenSize || prod.screen_size || "-";
        const releaseYear = prod.releaseYear || prod.release_year || "-";
        const productId = prod.id || pStore.products_id_product || 0;

        // Cocokkan data spesifikasi laptop ini ke pemetaan kriteria di database
        const dbWeights = allWeights?.filter((w: any) => Number(w.product_id) === Number(productId)) || [];

        return {
          productId,
          rank: r.ranking || r.rank || index + 1,
          name: prod.modelName || r.product_name || `Alternative #${index + 1}`,
          brand: brandName,
          price,
          distance,
          ram,
          cpu,
          storage,
          battery,
          weight,
          screenSize,
          releaseYear,
          score: Number(r.score ?? 0),
          storeName: pStore.store?.name || "-",
          is_chosen_by_user: Boolean(r.is_chosen_by_user || r.isChosen || session.user_choice === (prod.modelName || r.product_name)),
          dbWeights,
          raw: r,
        };
      });
  }, [session, activeMethod, allWeights]);

  // 1. Hitung Matriks Keputusan X (Skala Nilai Mentah 1-5)
  const decisionMatrix = useMemo(() => {
    return activeAlternatives.map((alt) => {
      const rowValues: Record<string, number> = {};
      CRITERIAS.forEach((crit) => {
        rowValues[crit.code] = getCriteriaScaleValue(crit.code, alt);
      });
      return {
        alternativeName: alt.name,
        brand: alt.brand,
        score: alt.score,
        rank: alt.rank,
        is_chosen_by_user: alt.is_chosen_by_user,
        values: rowValues,
      };
    });
  }, [activeAlternatives]);

  // Cari Nilai Minimum & Maksimum tiap kolom kriteria (Untuk Pembagi Normalisasi SAW & TOPSIS)
  const columnExtremes = useMemo(() => {
    const extremes: Record<string, { min: number; max: number }> = {};
    CRITERIAS.forEach((crit) => {
      const values = decisionMatrix.map((row) => row.values[crit.code]);
      extremes[crit.code] = {
        min: values.length > 0 ? Math.min(...values) : 1,
        max: values.length > 0 ? Math.max(...values) : 5,
      };
    });
    return extremes;
  }, [decisionMatrix]);

  // Pembagi Kuadrat Kolom (Untuk Normalisasi Vektor pada TOPSIS)
  const columnSquareSums = useMemo(() => {
    const squareSums: Record<string, number> = {};
    CRITERIAS.forEach((crit) => {
      const sum = decisionMatrix.reduce((s, row) => s + Math.pow(row.values[crit.code], 2), 0);
      squareSums[crit.code] = Math.sqrt(sum);
    });
    return squareSums;
  }, [decisionMatrix]);

  // 2a. MATRIKS NORMALISASI SAW (R)
  const sawNormalizedMatrix = useMemo(() => {
    return decisionMatrix.map((row) => {
      const rowNorms: Record<string, number> = {};
      CRITERIAS.forEach((crit) => {
        const x = row.values[crit.code];
        const extremes = columnExtremes[crit.code];
        if (crit.type === "benefit") {
          rowNorms[crit.code] = extremes.max > 0 ? x / extremes.max : 0;
        } else {
          rowNorms[crit.code] = x > 0 ? extremes.min / x : 0;
        }
      });
      return {
        alternativeName: row.alternativeName,
        brand: row.brand,
        score: row.score,
        rank: row.rank,
        is_chosen_by_user: row.is_chosen_by_user,
        norms: rowNorms,
        rawValues: row.values,
      };
    });
  }, [decisionMatrix, columnExtremes]);

  // 2b. MATRIKS WP (Normalisasi Pangkat Bobot)
  const wpCalculations = useMemo(() => {
    // Cari total bobot kriteria aktif
    const totalW = CRITERIAS.reduce((sum, crit) => sum + (weightsMap[crit.code] ?? 0), 0);
    const normalizedW: Record<string, number> = {};
    CRITERIAS.forEach((crit) => {
      normalizedW[crit.code] = totalW > 0 ? (weightsMap[crit.code] ?? 0) / totalW : 0;
    });

    // Hitung S_i (Vektor S)
    const alternativesS = decisionMatrix.map((row) => {
      let s = 1;
      CRITERIAS.forEach((crit) => {
        const x = row.values[crit.code];
        const w = normalizedW[crit.code];
        if (w > 0) {
          const power = crit.type === "cost" ? -w : w;
          s *= Math.pow(x, power);
        }
      });
      return {
        alternativeName: row.alternativeName,
        brand: row.brand,
        score: row.score,
        rank: row.rank,
        is_chosen_by_user: row.is_chosen_by_user,
        s: s,
        values: row.values,
      };
    });

    const sumS = alternativesS.reduce((sum, alt) => sum + alt.s, 0);

    // Hitung V_i = S_i / sum(S)
    return alternativesS.map((alt) => ({
      ...alt,
      v: sumS > 0 ? alt.s / sumS : 0,
    }));
  }, [decisionMatrix, weightsMap]);

  // 2c. MATRIKS TOPSIS (Normalisasi Vektor & Closeness)
  const topsisCalculations = useMemo(() => {
    // Normalisasi Vektor & Matriks Ternormalisasi Ternilai (V_ij)
    const normalizedV = decisionMatrix.map((row) => {
      const vValues: Record<string, number> = {};
      const rValues: Record<string, number> = {};
      CRITERIAS.forEach((crit) => {
        const x = row.values[crit.code];
        const sqrtSum = columnSquareSums[crit.code];
        const r = sqrtSum > 0 ? x / sqrtSum : 0;
        const w = weightsMap[crit.code] ?? 0;
        rValues[crit.code] = r;
        vValues[crit.code] = r * w;
      });
      return {
        alternativeName: row.alternativeName,
        brand: row.brand,
        score: row.score,
        rank: row.rank,
        is_chosen_by_user: row.is_chosen_by_user,
        rValues: rValues,
        vValues: vValues,
        values: row.values,
      };
    });

    // Cari Solusi Ideal Positif (A+) & Ideal Negatif (A-)
    const idealPositive: Record<string, number> = {};
    const idealNegative: Record<string, number> = {};
    CRITERIAS.forEach((crit) => {
      const colValues = normalizedV.map((row) => row.vValues[crit.code]);
      if (crit.type === "benefit") {
        idealPositive[crit.code] = colValues.length > 0 ? Math.max(...colValues) : 0;
        idealNegative[crit.code] = colValues.length > 0 ? Math.min(...colValues) : 0;
      } else {
        idealPositive[crit.code] = colValues.length > 0 ? Math.min(...colValues) : 0;
        idealNegative[crit.code] = colValues.length > 0 ? Math.max(...colValues) : 0;
      }
    });

    // Hitung Jarak Jarak D+ & D-
    return normalizedV.map((row) => {
      let dPlusSquareSum = 0;
      let dMinusSquareSum = 0;
      CRITERIAS.forEach((crit) => {
        const v = row.vValues[crit.code];
        dPlusSquareSum += Math.pow(v - idealPositive[crit.code], 2);
        dMinusSquareSum += Math.pow(v - idealNegative[crit.code], 2);
      });
      const dPlus = Math.sqrt(dPlusSquareSum);
      const dMinus = Math.sqrt(dMinusSquareSum);
      const closeness = (dPlus + dMinus) > 0 ? dMinus / (dPlus + dMinus) : 0;

      return {
        ...row,
        dPlus: dPlus,
        dMinus: dMinus,
        c: closeness,
        idealPositive,
        idealNegative,
      };
    });
  }, [decisionMatrix, columnSquareSums, weightsMap]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-sm font-semibold text-gray-500">Memuat analisis perhitungan SPK...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <p className="text-base font-bold text-gray-700">
          Detail hasil rekomendasi tidak ditemukan.
        </p>
        <Link to="/admin/recommendations">
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            label="Kembali ke Riwayat"
            className="text-xs! py-2! px-4! rounded-xl!"
          />
        </Link>
      </div>
    );
  }

  // Tampilkan formula popover interaktif
  const handleCellClick = (cellKey: string, description: string) => {
    if (activeFormulaDetails?.cellKey === cellKey) {
      setActiveFormulaDetails(null);
    } else {
      setActiveFormulaDetails({ cellKey, description });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Tombol Kembali & Info Sesi */}
      <div className="flex items-center justify-between">
        <Link to="/admin/recommendations">
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            label="Kembali ke Riwayat"
            className="text-xs! py-2! px-4! rounded-xl!"
          />
        </Link>
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
          Session ID: #{session.id}
        </span>
      </div>

      {/* Card Info User & Preferensi Kebutuhan */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Matriks Analisis SPK: {session.user_name}
              </h1>
              <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Tanggal: {session.created_at}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Pilihan User: {session.user_choice || "-"}
            </span>
          </div>
        </div>

        {/* Info Grid Preferensi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-2 text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">Kriteria Utama & Budget:</span>
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="text-gray-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-500" />
                {session.usage_purpose}
              </span>
              <span className="text-emerald-600 font-mono">
                {session.budget_range}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
            <span className="font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Bobot Input Kriteria ($W_j$):
            </span>
            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px] font-bold">
              <div className="bg-white p-1.5 rounded-lg border border-purple-100 text-gray-900">RAM: {(weightsMap.C2 * 100).toFixed(0)}%</div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100 text-amber-600">Harga: {(weightsMap.C1 * 100).toFixed(0)}%</div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100 text-blue-600">Storage: {(weightsMap.C3 * 100).toFixed(0)}%</div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100 text-emerald-600">Baterai: {(weightsMap.C4 * 100).toFixed(0)}%</div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100 text-rose-600">Berat: {(weightsMap.C5 * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* PEMILIH METODE UTAMA (SAW, WP, TOPSIS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <span>Perbandingan Metode Pengambilan Keputusan</span>
          </h2>

          {/* Toggle Tab Metode */}
          <div className="bg-gray-100 p-1.5 rounded-2xl border border-gray-200 flex gap-1 self-start">
            {(["SAW", "WP", "TOPSIS"] as const).map((method) => (
              <button
                key={method}
                onClick={() => {
                  setActiveMethod(method);
                  setActiveFormulaDetails(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  activeMethod === method
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* SUB TAB LANGKAH PERHITUNGAN */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-1.5">
            <button
              onClick={() => {
                setActiveStepTab("rank");
                setActiveFormulaDetails(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeStepTab === "rank"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              Hasil Perangkingan Akhir
            </button>
            <button
              onClick={() => {
                setActiveStepTab("decision");
                setActiveFormulaDetails(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeStepTab === "decision"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Table className="w-4 h-4 text-purple-500" />
              Langkah 1: Matriks Keputusan (X)
            </button>
            <button
              onClick={() => {
                setActiveStepTab("norm");
                setActiveFormulaDetails(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeStepTab === "norm"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-500" />
              Langkah 2: Normalisasi Matriks (R)
            </button>
          </div>

          {/* Area Rumus Formula Interaktif Callout */}
          {activeFormulaDetails && (
            <div className="mx-6 mt-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-purple-900 block">
                  Detail Kalkulasi Matematika:
                </span>
                <p className="text-purple-800 font-mono leading-relaxed break-all font-semibold">
                  {activeFormulaDetails.description}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 overflow-x-auto">
            {/* ==================== TAB 1: MATRIKS KEPUTUSAN X ==================== */}
            {activeStepTab === "decision" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>* Menunjukkan konversi nilai spesifikasi ke skala skala numerik [1 sampai 5]</span>
                  <span className="font-mono text-purple-600 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Klik sel nilai untuk melihat spesifikasi mentahnya!
                  </span>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 min-w-[200px]">Alternatif Laptop</th>
                      {CRITERIAS.map((c) => (
                        <th key={c.code} className="py-3 px-3 text-center" title={c.desc}>
                          <span className="block font-mono text-[10px] text-gray-900 bg-gray-200/80 px-1 rounded-sm w-fit mx-auto mb-0.5">{c.code}</span>
                          <span>{c.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {decisionMatrix.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                          row.is_chosen_by_user ? "bg-purple-50/30" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          <div>
                            {row.alternativeName}
                            {row.is_chosen_by_user && (
                              <span className="ml-2 inline-block px-1.5 py-0.5 text-[8px] bg-emerald-500 text-white rounded font-bold uppercase tracking-wide">
                                Chosen
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium block">{row.brand}</span>
                        </td>
                        {CRITERIAS.map((crit) => {
                          const val = row.values[crit.code];
                          const rawAlt = activeAlternatives.find((a) => a.name === row.alternativeName);
                          let rawSpec = "-";
                          if (rawAlt) {
                            if (crit.code === "C1") rawSpec = `Rp ${rawAlt.price.toLocaleString("id-ID")}`;
                            else if (crit.code === "C2") rawSpec = rawAlt.ram;
                            else if (crit.code === "C3") rawSpec = rawAlt.storage;
                            else if (crit.code === "C4") rawSpec = rawAlt.battery;
                            else if (crit.code === "C5") rawSpec = `${rawAlt.weight} Kg`;
                            else if (crit.code === "C6") rawSpec = rawAlt.cpu;
                            else if (crit.code === "C7") rawSpec = `${rawAlt.screenSize || "14"}"`;
                            else if (crit.code === "C8") rawSpec = rawAlt.releaseYear;
                          }

                          const activeCellKey = `${idx}-${crit.code}`;
                          const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                          return (
                            <td
                              key={crit.code}
                              onClick={() =>
                                handleCellClick(
                                  activeCellKey,
                                  `Laptop: ${row.alternativeName}\nSpesifikasi mentah: "${rawSpec}"\nTipe Kriteria: ${crit.type.toUpperCase()} (${crit.desc})\nSkala Mapped: ${val} (Skala 1-5)`
                                )
                              }
                              className={`py-3.5 px-3 text-center font-mono font-bold transition-all cursor-pointer ${
                                isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                              }`}
                            >
                              <span className="bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200/50 block hover:bg-purple-50">
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ==================== TAB 2: MATRIKS NORMALISASI R ==================== */}
            {activeStepTab === "norm" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>* Menampilkan hasil normalisasi berdasarkan sifat kriteria (Benefit / Cost)</span>
                  <span className="font-mono text-purple-600 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Klik sel nilai untuk melihat rumus matematika rincinya!
                  </span>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 min-w-[200px]">Alternatif Laptop</th>
                      {CRITERIAS.map((c) => (
                        <th key={c.code} className="py-3 px-3 text-center" title={c.desc}>
                          <span className="block font-mono text-[10px] text-gray-900 bg-gray-200/80 px-1 rounded-sm w-fit mx-auto mb-0.5">{c.code}</span>
                          <span>{c.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Normalisasi SAW */}
                    {activeMethod === "SAW" &&
                      sawNormalizedMatrix.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                            row.is_chosen_by_user ? "bg-purple-50/30" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {row.alternativeName}
                            <span className="text-[10px] text-gray-400 font-medium block">{row.brand}</span>
                          </td>
                          {CRITERIAS.map((crit) => {
                            const val = row.norms[crit.code];
                            const x = row.rawValues[crit.code];
                            const ext = columnExtremes[crit.code];

                            const activeCellKey = `${idx}-${crit.code}`;
                            const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                            // Rumus text
                            const formulaDesc =
                              crit.type === "benefit"
                                ? `Benefit Formula R_ij = X_ij / Max(X_j)\nPerhitungan: ${x} / ${ext.max} = ${val.toFixed(4)}`
                                : `Cost Formula R_ij = Min(X_j) / X_ij\nPerhitungan: ${ext.min} / ${x} = ${val.toFixed(4)}`;

                            return (
                              <td
                                key={crit.code}
                                onClick={() => handleCellClick(activeCellKey, formulaDesc)}
                                className={`py-3.5 px-3 text-center font-mono font-bold cursor-pointer ${
                                  isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                                }`}
                              >
                                <span className="bg-blue-50/50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100/50 block hover:bg-blue-100">
                                  {val.toFixed(4)}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                    {/* WP - Pangkat Bobot */}
                    {activeMethod === "WP" && (
                      <tr>
                        <td colSpan={CRITERIAS.length + 1} className="py-6 px-4">
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                            <span className="font-extrabold text-gray-900 text-sm block">Bobot Normalisasi & Pangkat Kriteria ($w_j$):</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              {CRITERIAS.map((crit) => {
                                const w = weightsMap[crit.code] ?? 0;
                                const isCost = crit.type === "cost";
                                return (
                                  <div key={crit.code} className="bg-white p-3 rounded-xl border border-gray-200">
                                    <span className="font-bold text-gray-400 font-mono uppercase block">{crit.code} - {crit.name} ({crit.type})</span>
                                    <span className="text-sm font-extrabold text-gray-900 font-mono block mt-1">
                                      Pangkat: {isCost ? "-" : ""}{w.toFixed(4)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-[11px] text-gray-500 italic mt-2">
                              * Pada Metode WP (Weighted Product), kriteria bertipe BENEFIT dipangkatkan secara POSITIF (+), sedangkan kriteria bertipe COST dipangkatkan secara NEGATIF (-).
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* TOPSIS - Vektor Normalisasi */}
                    {activeMethod === "TOPSIS" &&
                      topsisCalculations.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                            row.is_chosen_by_user ? "bg-purple-50/30" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {row.alternativeName}
                            <span className="text-[10px] text-gray-400 font-medium block">{row.brand}</span>
                          </td>
                          {CRITERIAS.map((crit) => {
                            const rVal = row.rValues[crit.code]; // R normalized
                            const vVal = row.vValues[crit.code]; // Weighted R
                            const w = weightsMap[crit.code] ?? 0;
                            const squareSum = columnSquareSums[crit.code];
                            const x = row.values[crit.code];

                            const activeCellKey = `${idx}-${crit.code}`;
                            const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                            const formulaDesc =
                              `1. Normalisasi Vektor R_ij = X_ij / sqrt(sum(X_kj^2))\n` +
                              `   Perhitungan R: ${x} / ${squareSum.toFixed(4)} = ${rVal.toFixed(4)}\n` +
                              `2. Bobot Ternilai V_ij = R_ij * W_j\n` +
                              `   Perhitungan V: ${rVal.toFixed(4)} * ${w} = ${vVal.toFixed(4)}`;

                            return (
                              <td
                                key={crit.code}
                                onClick={() => handleCellClick(activeCellKey, formulaDesc)}
                                className={`py-3.5 px-3 text-center font-mono font-bold cursor-pointer ${
                                  isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                                }`}
                              >
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[10px] rounded block border border-indigo-100 hover:bg-indigo-100">
                                  R={rVal.toFixed(3)}
                                </span>
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] rounded block border border-purple-100 mt-1 hover:bg-purple-100">
                                  V={vVal.toFixed(3)}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ==================== TAB 3: HASIL PERANGKINGAN AKHIR ==================== */}
            {activeStepTab === "rank" && (
              <div className="space-y-6">
                <div className="text-xs text-gray-500">
                  Menampilkan peringkat alternatif dari skor tertinggi ke terendah menggunakan metode <strong className="font-bold text-black">{activeMethod}</strong>.
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* SAW Perangkingan */}
                  {activeMethod === "SAW" &&
                    activeAlternatives.map((laptop) => (
                      <div
                        key={laptop.rank}
                        className={`p-6 rounded-3xl border transition-all ${
                          laptop.is_chosen_by_user
                            ? "bg-linear-to-r from-purple-950/40 via-[#181519] to-[#151216] border-purple-500 shadow-md ring-2 ring-purple-500/10"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${
                                laptop.rank === 1
                                  ? "bg-amber-500 text-white"
                                  : laptop.rank === 2
                                  ? "bg-slate-400 text-white"
                                  : "bg-amber-700 text-white"
                              }`}
                            >
                              #{laptop.rank}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-gray-900">
                                  {laptop.name}
                                </h3>
                                {laptop.is_chosen_by_user && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white uppercase tracking-wider">
                                    ⭐ Dipilih User
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 font-mono mt-0.5">
                                {laptop.brand} | Rp {laptop.price.toLocaleString("id-ID")} | {laptop.ram} | {laptop.cpu}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Skor Preferensi (Vi)</span>
                            <span className="text-xl font-extrabold text-black font-mono">
                              {laptop.score.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* WP Perangkingan */}
                  {activeMethod === "WP" &&
                    wpCalculations
                      .sort((a, b) => b.v - a.v)
                      .map((item, idx) => {
                        const originalLaptop = activeAlternatives.find((a) => a.name === item.alternativeName);
                        const isChosen = originalLaptop?.is_chosen_by_user;
                        return (
                          <div
                            key={idx}
                            className={`p-6 rounded-3xl border transition-all ${
                              isChosen
                                ? "bg-linear-to-r from-purple-950/40 via-[#181519] to-[#151216] border-purple-500 shadow-md ring-2 ring-purple-500/10"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${
                                    idx + 1 === 1
                                      ? "bg-amber-500 text-white"
                                      : idx + 1 === 2
                                      ? "bg-slate-400 text-white"
                                      : "bg-amber-700 text-white"
                                  }`}
                                >
                                  #{idx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-gray-900">
                                      {item.alternativeName}
                                    </h3>
                                    {isChosen && (
                                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white uppercase tracking-wider">
                                        ⭐ Dipilih User
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                                    {item.brand} | Vektor S = {item.s.toFixed(4)}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 text-right bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Vektor V (Hasil Akhir)</span>
                                <span className="text-xl font-extrabold text-black font-mono">
                                  {item.v.toFixed(4)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                  {/* TOPSIS Perangkingan */}
                  {activeMethod === "TOPSIS" &&
                    topsisCalculations
                      .sort((a, b) => b.c - a.c)
                      .map((item, idx) => {
                        const originalLaptop = activeAlternatives.find((a) => a.name === item.alternativeName);
                        const isChosen = originalLaptop?.is_chosen_by_user;
                        return (
                          <div
                            key={idx}
                            className={`p-6 rounded-3xl border transition-all ${
                              isChosen
                                ? "bg-linear-to-r from-purple-950/40 via-[#181519] to-[#151216] border-purple-500 shadow-md ring-2 ring-purple-500/10"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${
                                    idx + 1 === 1
                                      ? "bg-amber-500 text-white"
                                      : idx + 1 === 2
                                      ? "bg-slate-400 text-white"
                                      : "bg-amber-700 text-white"
                                  }`}
                                >
                                  #{idx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-gray-900">
                                      {item.alternativeName}
                                    </h3>
                                    {isChosen && (
                                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white uppercase tracking-wider">
                                        ⭐ Dipilih User
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                                    {item.brand} | Jarak Ideal Positif (D+) = {item.dPlus.toFixed(4)} | Negatif (D-) = {item.dMinus.toFixed(4)}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 text-right bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Closeness Score (Ci)</span>
                                <span className="text-xl font-extrabold text-black font-mono">
                                  {item.c.toFixed(4)}
                                </span>
                              </div>
                            </div>

                            {/* Ideal Solutions info */}
                            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-500 font-mono">
                              <div>• Solusi Ideal Positif (A+): Harga={item.idealPositive.C1.toFixed(3)}, RAM={item.idealPositive.C2.toFixed(3)}, Storage={item.idealPositive.C3.toFixed(3)}</div>
                              <div>• Solusi Ideal Negatif (A-): Harga={item.idealNegative.C1.toFixed(3)}, RAM={item.idealNegative.C2.toFixed(3)}, Storage={item.idealNegative.C3.toFixed(3)}</div>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
