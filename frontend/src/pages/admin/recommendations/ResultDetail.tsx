import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { useGet } from "../../../hooks/useGet";
import { recommendationService } from "../../../services/recommendationService";
import { productWeightService } from "../../../services/productWeightService";
import { criteriaService } from "../../../services/criteriaService";
import { ResultInfoCard } from "./components/ResultInfoCard";
import { DecisionMatrixTable } from "./components/DecisionMatrixTable";
import { NormalisationMatrixTable } from "./components/NormalisationMatrixTable";
import { FinalRankingList } from "./components/FinalRankingList";

const STATIC_CRITERIAS: any[] = [];

const getCriteriaScaleValue = (criteriaCode: string, alt: any): number => {
  // 1. C1 (Harga) uses original price in millions (e.g. Rp 5.485.000 -> 5.485)
  if (criteriaCode === "C1") {
    const price = Number(alt.price ?? 0);
    return price > 0 ? price / 1000000 : 1;
  }

  // 2. C2-C8 dynamically matched with product custom weight configuration
  const dbVal = alt.dbWeights?.find((w: any) => w.criteria_code === criteriaCode);
  if (dbVal && dbVal.value_numeric !== undefined && dbVal.value_numeric !== null) {
    return Number(dbVal.value_numeric);
  }

  // 3. Return default minimal score if not configured in database
  return 1;
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

  const { data: dbCriterias } = useGet<any[]>({
    queryKey: ["criterias-all"],
    queryFn: () => criteriaService.getAll(),
    offlineFallbackData: [],
  });

  const criterias = useMemo(() => {
    if (dbCriterias && dbCriterias.length > 0) {
      return [...dbCriterias].sort((a: any, b: any) => {
        const aCode = a.code || `C${a.id}`;
        const bCode = b.code || `C${b.id}`;
        return aCode.localeCompare(bCode);
      });
    }
    return STATIC_CRITERIAS;
  }, [dbCriterias]);

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
      criterias.forEach((crit) => {
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
  }, [activeAlternatives, criterias]);

  const columnExtremes = useMemo(() => {
    const extremes: Record<string, { min: number; max: number }> = {};
    criterias.forEach((crit) => {
      const values = decisionMatrix.map((row) => row.values[crit.code]);
      extremes[crit.code] = {
        min: values.length > 0 ? Math.min(...values) : 1,
        max: values.length > 0 ? Math.max(...values) : 5,
      };
    });
    return extremes;
  }, [decisionMatrix, criterias]);

  const columnSquareSums = useMemo(() => {
    const squareSums: Record<string, number> = {};
    criterias.forEach((crit) => {
      const sum = decisionMatrix.reduce((s, row) => s + Math.pow(row.values[crit.code], 2), 0);
      squareSums[crit.code] = Math.sqrt(sum);
    });
    return squareSums;
  }, [decisionMatrix, criterias]);

  const sawNormalizedMatrix = useMemo(() => {
    return decisionMatrix.map((row) => {
      const rowNorms: Record<string, number> = {};
      criterias.forEach((crit) => {
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
  }, [decisionMatrix, columnExtremes, criterias]);

  const wpCalculations = useMemo(() => {
    const totalW = criterias.reduce((sum, crit) => sum + (weightsMap[crit.code] ?? 0), 0);
    const normalizedW: Record<string, number> = {};
    criterias.forEach((crit) => {
      normalizedW[crit.code] = totalW > 0 ? (weightsMap[crit.code] ?? 0) / totalW : 0;
    });

    const alternativesS = decisionMatrix.map((row) => {
      let s = 1;
      const norms: Record<string, number> = {};
      criterias.forEach((crit) => {
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
  }, [decisionMatrix, weightsMap, criterias]);

  const topsisCalculations = useMemo(() => {
    const normalizedV = decisionMatrix.map((row) => {
      const vValues: Record<string, number> = {};
      const rValues: Record<string, number> = {};
      criterias.forEach((crit) => {
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
    criterias.forEach((crit) => {
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
      criterias.forEach((crit) => {
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
  }, [decisionMatrix, columnSquareSums, weightsMap, criterias]);

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
            <div className="mx-6 mt-6 p-4 bg-white border border-gray-200 rounded-2xl flex items-start gap-3">
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-black block">
                  Detail Kalkulasi Matematika:
                </span>
                <p className="text-gray-900 font-mono leading-relaxed break-all font-semibold whitespace-pre-wrap">
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
                criterias={criterias}
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
                criterias={criterias}
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
