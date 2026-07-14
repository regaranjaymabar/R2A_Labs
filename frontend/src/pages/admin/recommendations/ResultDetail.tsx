import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { useGet } from "../../../hooks/useGet";
import { recommendationService } from "../../../services/recommendationService";
import { productWeightService } from "../../../services/productWeightService";
import { ResultInfoCard } from "./components/ResultInfoCard";
import { DecisionMatrixTable } from "./components/DecisionMatrixTable";
import { NormalisationMatrixTable } from "./components/NormalisationMatrixTable";
import { FinalRankingList } from "./components/FinalRankingList";

export const CRITERIAS = [
  { code: "C1", name: "Harga", type: "cost", desc: "Harga produk laptop (Semakin murah semakin baik)" },
  { code: "C2", name: "RAM", type: "benefit", desc: "Kapasitas RAM laptop (Semakin besar semakin baik)" },
  { code: "C3", name: "Storage", type: "benefit", desc: "Kapasitas Storage/Penyimpanan (Semakin besar semakin baik)" },
  { code: "C4", name: "Battery", type: "benefit", desc: "Kapasitas Baterai laptop dalam Wh (Semakin awet semakin baik)" },
  { code: "C5", name: "Berat", type: "cost", desc: "Berat fisik laptop dalam Kg (Semakin ringan semakin baik)" },
  { code: "C6", name: "Processor", type: "benefit", desc: "Kelas benchmark performa processor (Semakin tinggi semakin baik)" },
  { code: "C7", name: "Ukuran Layar", type: "benefit", desc: "Bentang layar laptop dalam Inch (Semakin luas semakin baik)" },
  { code: "C8", name: "Tahun Rilis", type: "benefit", desc: "Tahun rilis laptop ke pasar (Semakin baru semakin baik)" },
];

const getCriteriaScaleValue = (criteriaCode: string, alt: any): number => {
  const dbVal = alt.dbWeights?.find((w: any) => w.criteria_code === criteriaCode);
  if (dbVal && dbVal.value_numeric !== undefined && dbVal.value_numeric !== null) {
    return Number(dbVal.value_numeric);
  }
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

  const [activeMethod, setActiveMethod] = useState<"SAW" | "WP" | "TOPSIS">("SAW");
  const [activeStepTab, setActiveStepTab] = useState<"decision" | "norm" | "rank">("rank");
  const [topsisSubTab, setTopsisSubTab] = useState<"R" | "Y" | "D">("R");

  const [activeFormulaDetails, setActiveFormulaDetails] = useState<{
    cellKey: string;
    description: string;
  } | null>(null);

  const { data: fetchedData, isLoading, error } = useGet({
    queryKey: ["recommendation-detail", id || ""],
    queryFn: () => recommendationService.getById(id!),
    enabled: !!id,
  });

  const { data: allWeights } = useGet<any[]>({
    queryKey: ["product-weights-all"],
    queryFn: () => productWeightService.getAll(),
    offlineFallbackData: [],
  });

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

  const weightsMap = useMemo(() => {
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
        const code = rw.criteria?.code || (rw.criteriaId ? `C${rw.criteriaId}` : "");
        if (code) {
          map[code] = Number(rw.weight);
        }
      });
    }

    return map;
  }, [session]);

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
        storeName: alt.storeName,
        price: alt.price,
        values: rowValues,
      };
    });
  }, [activeAlternatives]);

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

  const columnSquareSums = useMemo(() => {
    const squareSums: Record<string, number> = {};
    CRITERIAS.forEach((crit) => {
      const sum = decisionMatrix.reduce((s, row) => s + Math.pow(row.values[crit.code], 2), 0);
      squareSums[crit.code] = Math.sqrt(sum);
    });
    return squareSums;
  }, [decisionMatrix]);

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
        storeName: row.storeName,
        norms: rowNorms,
        rawValues: row.values,
      };
    });
  }, [decisionMatrix, columnExtremes]);

  const wpCalculations = useMemo(() => {
    const totalW = CRITERIAS.reduce((sum, crit) => sum + (weightsMap[crit.code] ?? 0), 0);
    const normalizedW: Record<string, number> = {};
    CRITERIAS.forEach((crit) => {
      normalizedW[crit.code] = totalW > 0 ? (weightsMap[crit.code] ?? 0) / totalW : 0;
    });

    const alternativesS = decisionMatrix.map((row) => {
      let s = 1;
      const norms: Record<string, number> = {};
      CRITERIAS.forEach((crit) => {
        const x = row.values[crit.code];
        const w = normalizedW[crit.code];
        if (w > 0) {
          const power = crit.type === "cost" ? -w : w;
          const calculatedPower = Math.pow(x, power);
          s *= calculatedPower;
          norms[crit.code] = calculatedPower;
        } else {
          norms[crit.code] = 1;
        }
        norms[crit.code + "_raw"] = x;
      });
      return {
        alternativeName: row.alternativeName,
        brand: row.brand,
        score: row.score,
        rank: row.rank,
        is_chosen_by_user: row.is_chosen_by_user,
        storeName: row.storeName,
        price: row.price,
        s: s,
        norms: norms,
        values: row.values,
      };
    });

    const sumS = alternativesS.reduce((sum, alt) => sum + alt.s, 0);

    return alternativesS.map((alt) => ({
      ...alt,
      v: sumS > 0 ? alt.s / sumS : 0,
    }));
  }, [decisionMatrix, weightsMap]);

  const topsisCalculations = useMemo(() => {
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
        storeName: row.storeName,
        price: row.price,
        rValues: rValues,
        vValues: vValues,
        values: row.values,
      };
    });

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
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="text-sm font-semibold text-gray-500">Memuat analisis perhitungan SPK...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl max-w-md mx-auto text-red-900">
          <p className="font-bold text-base mb-2">Gagal Menghubungi Server Backend</p>
          <p className="text-xs leading-relaxed text-red-700">
            Terjadi masalah saat mengambil data analisis perhitungan. Silakan pastikan server backend Anda sudah diaktifkan dan dapat dihubungi.
          </p>
        </div>
        <Link to="/admin/recommendations">
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            label="Kembali ke Riwayat"
            className="text-xs! py-2! px-4! rounded-xl! cursor-pointer"
          />
        </Link>
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

  const handleCellClick = (cellKey: string, description: string) => {
    if (activeFormulaDetails?.cellKey === cellKey) {
      setActiveFormulaDetails(null);
    } else {
      setActiveFormulaDetails({ cellKey, description });
    }
  };

  return (
    <div className="space-y-8 pb-12">
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

      <ResultInfoCard session={session} weightsMap={weightsMap} />

      {/* PEMILIH METODE UTAMA (SAW, WP, TOPSIS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Perbandingan Metode Pengambilan Keputusan</span>
          </h2>

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
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

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
              Langkah 1: Matriks Keputusan
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
              Langkah 2: Normalisasi Matriks (R)
            </button>
          </div>

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
              <DecisionMatrixTable
                decisionMatrix={decisionMatrix}
                activeAlternatives={activeAlternatives}
                activeFormulaDetails={activeFormulaDetails}
                onCellClick={handleCellClick}
              />
            )}

            {/* ==================== TAB 2: MATRIKS NORMALISASI R ==================== */}
            {activeStepTab === "norm" && (
              <NormalisationMatrixTable
                activeMethod={activeMethod}
                topsisSubTab={topsisSubTab}
                setTopsisSubTab={setTopsisSubTab}
                activeFormulaDetails={activeFormulaDetails}
                onCellClick={handleCellClick}
                sawNormalizedMatrix={sawNormalizedMatrix}
                columnExtremes={columnExtremes}
                wpCalculations={wpCalculations}
                topsisCalculations={topsisCalculations}
                columnSquareSums={columnSquareSums}
                weightsMap={weightsMap}
              />
            )}

            {/* ==================== TAB 3: HASIL PERANGKINGAN AKHIR ==================== */}
            {activeStepTab === "rank" && (
              <FinalRankingList
                activeMethod={activeMethod}
                activeAlternatives={activeAlternatives}
                wpCalculations={wpCalculations}
                topsisCalculations={topsisCalculations}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
