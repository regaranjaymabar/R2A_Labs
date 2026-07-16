import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customerSpkService } from "../../../services/customerSpkService";
import { productService } from "../../../services/productService";
import {
  Loader2,
  ArrowLeft,
  Info,
  MapPin,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { DecisionMatrixTable } from "../../admin/recommendations/components/DecisionMatrixTable";
import { NormalisationMatrixTable } from "../../admin/recommendations/components/NormalisationMatrixTable";

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

const getCriteriaScaleValue = (criteriaCode: string, alt: any): number => {
  const dbVal = alt.dbWeights?.find((w: any) => w.criteria_code === criteriaCode);
  if (dbVal && dbVal.value_numeric !== undefined && dbVal.value_numeric !== null) {
    return Number(dbVal.value_numeric);
  }
  switch (criteriaCode) {
    case "C1": { // Harga (cost)
      return Number(alt.price);
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

export default function SpkResult() {
  const { id } = useParams();
  const [activeMethod, setActiveMethod] = useState<"SAW" | "WP" | "TOPSIS">("TOPSIS");
  const [activeTabStep, setActiveTabStep] = useState<"cards" | "math">("cards");
  const [activeMathSubTab, setActiveMathSubTab] = useState<"decision" | "norm">("decision");
  const [topsisSubTab, setTopsisSubTab] = useState<"R" | "Y" | "D">("R");
  
  // Track open state for store dropdowns in product cards
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});

  const [activeFormulaDetails, setActiveFormulaDetails] = useState<{
    cellKey: string;
    description: string;
  } | null>(null);

  // 1. Fetch SPK Request details
  const { data: fetchedData, isLoading, error } = useQuery({
    queryKey: ["customer-spk-result", id || ""],
    queryFn: () => customerSpkService.getRequestDetails(id!),
    enabled: !!id,
  });

  // 2. Fetch all products to get subCriteria value mappings fallback
  const { data: allProducts = [] } = useQuery({
    queryKey: ["customer-all-products"],
    queryFn: () => productService.getAll(),
  });

  // Build weights mapping
  const weightsMap = useMemo(() => {
    const map: Record<string, number> = {
      C1: 0.3, C2: 0.25, C3: 0.25, C4: 0.1, C5: 0.1, C6: 0, C7: 0, C8: 0
    };

    if (fetchedData && Array.isArray(fetchedData.recommendationWeights)) {
      fetchedData.recommendationWeights.forEach((rw: any) => {
        const code = rw.criteria?.code || (rw.criteriaId ? `C${rw.criteriaId}` : "");
        if (code) {
          map[code] = Number(rw.weight);
        }
      });
    }

    return map;
  }, [fetchedData]);

  // Grouped unique products list for current method
  const recommendations = useMemo(() => {
    if (!fetchedData?.recommendationResults) return [];
    const methodGroup = fetchedData.recommendationResults.find(
      (m: any) => m.method === activeMethod
    );
    return methodGroup?.recommendations || [];
  }, [fetchedData, activeMethod]);

  // Map to flat base order list of alternatives
  const activeAlternatives = useMemo(() => {
    return recommendations.map((rec: any, idx: number) => {
      const topStore = rec.available_stores[0] || {};

      // Match product from catalog using model name
      const matchingProduct = allProducts.find((p: any) => {
        const nameInCatalog = p.brand?.name ? `${p.brand.name} ${p.modelName}` : p.modelName;
        return nameInCatalog.toLowerCase() === rec.product_name.toLowerCase();
      });

      const productId = matchingProduct?.id || idx + 1000;
      const specs = {
        processor: matchingProduct?.processor || "-",
        ram: matchingProduct?.ram || "-",
        storage: matchingProduct?.storage || "-",
        battery: matchingProduct?.battery || "-",
        weight: matchingProduct?.weight || "-",
        screenSize: matchingProduct?.screenSize || "-",
        releaseYear: matchingProduct?.releaseYear || "-",
      };

      // Extract dbWeights from global product criteria list
      const dbWeights: any[] = [];
      const matchProductAny = matchingProduct as any;
      if (matchProductAny && Array.isArray(matchProductAny.productCriteria)) {
        matchProductAny.productCriteria.forEach((pc: any) => {
          dbWeights.push({
            criteria_code: pc.subCriteria?.criteria?.code || `C${pc.subCriteria?.criteriaId || ""}`,
            value_numeric: pc.subCriteria?.valueNumeric ?? 0,
            sub_criteria_description: pc.subCriteria?.description || "-",
          });
        });
      }

      const alt = {
        productId,
        rank: rec.rank || idx + 1,
        name: rec.product_name,
        brand: matchingProduct?.brand?.name || rec.product_name.split(" ")[0] || "-",
        price: topStore.price ?? 0,
        distance: topStore.distanceInKm ?? null,
        ram: specs.ram,
        cpu: specs.processor,
        storage: specs.storage,
        battery: specs.battery,
        weight: specs.weight,
        screenSize: specs.screenSize,
        releaseYear: specs.releaseYear,
        score: Number(rec.best_score ?? 0),
        storeName: topStore.store_name || "-",
        is_chosen_by_user: false,
        dbWeights,
        available_stores: rec.available_stores,
        specs, // Keep specs inside alternative
      };

      const values: Record<string, number> = {};
      CRITERIAS.forEach((crit) => {
        values[crit.code] = getCriteriaScaleValue(crit.code, alt);
      });

      return { ...alt, values };
    });
  }, [recommendations, allProducts]);

  const decisionMatrix = useMemo(() => {
    return activeAlternatives.map((alt: any) => ({
      alternativeName: alt.name,
      brand: alt.brand,
      score: alt.score,
      rank: alt.rank,
      is_chosen_by_user: alt.is_chosen_by_user,
      storeName: alt.storeName,
      price: alt.price,
      values: alt.values || {},
    }));
  }, [activeAlternatives]);

  const columnExtremes = useMemo(() => {
    const extremes: Record<string, { min: number; max: number }> = {};
    CRITERIAS.forEach((crit) => {
      const codeLower = crit.code.toLowerCase();
      const values = decisionMatrix.map((row: any) => row.values[crit.code]);
      
      let minVal = values.length > 0 ? Math.min(...values) : 1;
      let maxVal = values.length > 0 ? Math.max(...values) : 5;

      if (fetchedData?.calculationDetails?.saw) {
        const sawDetails = fetchedData.calculationDetails.saw;
        if (sawDetails[`min_${codeLower}`] !== undefined && sawDetails[`min_${codeLower}`] !== null) {
          minVal = Number(sawDetails[`min_${codeLower}`]);
        }
        if (sawDetails[`max_${codeLower}`] !== undefined && sawDetails[`max_${codeLower}`] !== null) {
          maxVal = Number(sawDetails[`max_${codeLower}`]);
        }
      }

      extremes[crit.code] = { min: minVal, max: maxVal };
    });
    return extremes;
  }, [decisionMatrix, fetchedData?.calculationDetails?.saw]);

  const columnSquareSums = useMemo(() => {
    const squareSums: Record<string, number> = {};
    CRITERIAS.forEach((crit) => {
      const codeLower = crit.code.toLowerCase();
      const sum = decisionMatrix.reduce((s: number, row: any) => s + Math.pow(row.values[crit.code], 2), 0);
      let sqrtSum = Math.sqrt(sum);

      if (fetchedData?.calculationDetails?.topsis) {
        const topsisDetails = fetchedData.calculationDetails.topsis;
        if (topsisDetails[`bagi_${codeLower}`] !== undefined && topsisDetails[`bagi_${codeLower}`] !== null) {
          sqrtSum = Number(topsisDetails[`bagi_${codeLower}`]);
        }
      }

      squareSums[crit.code] = sqrtSum;
    });
    return squareSums;
  }, [decisionMatrix, fetchedData?.calculationDetails?.topsis]);

  const sawNormalizedMatrix = useMemo(() => {
    return decisionMatrix.map((row: any) => {
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
    const useRawWeights = true;
    const alternativesS = decisionMatrix.map((row: any) => {
      let s = 1;
      const norms: Record<string, number> = {};
      CRITERIAS.forEach((crit) => {
        const x = row.values[crit.code];
        const w = useRawWeights ? (weightsMap[crit.code] ?? 0) : 0;
        if (w > 0 || (useRawWeights && w !== 0)) {
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

    const sumS = fetchedData?.calculationDetails?.wp?.total_s !== undefined && fetchedData?.calculationDetails?.wp?.total_s !== null
      ? Number(fetchedData.calculationDetails.wp.total_s)
      : alternativesS.reduce((sum: number, alt: any) => sum + alt.s, 0);

    return alternativesS.map((alt: any) => ({
      ...alt,
      v: sumS > 0 ? alt.s / sumS : 0,
    }));
  }, [decisionMatrix, weightsMap, fetchedData?.calculationDetails?.wp?.total_s]);

  const topsisCalculations = useMemo(() => {
    const normalizedV = decisionMatrix.map((row: any) => {
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
      const colValues = normalizedV.map((row: any) => row.vValues[crit.code]);
      if (crit.type === "benefit") {
        idealPositive[crit.code] = colValues.length > 0 ? Math.max(...colValues) : 0;
        idealNegative[crit.code] = colValues.length > 0 ? Math.min(...colValues) : 0;
      } else {
        idealPositive[crit.code] = colValues.length > 0 ? Math.min(...colValues) : 0;
        idealNegative[crit.code] = colValues.length > 0 ? Math.max(...colValues) : 0;
      }
    });

    return normalizedV.map((row: any) => {
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
        dPlus,
        dMinus,
        c: closeness,
        idealPositive,
        idealNegative,
      };
    });
  }, [decisionMatrix, columnSquareSums, weightsMap]);

  const toggleDropdown = (productId: number) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleCellClick = (cellKey: string, description: string) => {
    if (activeFormulaDetails?.cellKey === cellKey) {
      setActiveFormulaDetails(null);
    } else {
      setActiveFormulaDetails({ cellKey, description });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] pt-32 pb-20 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span className="text-sm font-semibold text-zinc-500">Menganalisis laptop impian Anda...</span>
      </div>
    );
  }

  if (error || !fetchedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] pt-32 pb-20 space-y-5 text-center px-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl max-w-md mx-auto text-red-900">
          <p className="font-bold text-base mb-2">Gagal Memuat Hasil SPK</p>
          <p className="text-xs text-red-700 leading-relaxed">
            Terjadi kesalahan saat mengambil hasil rekomendasi. Silakan ulangi pengisian form.
          </p>
        </div>
        <Link to="/spk/request">
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            label="Kembali ke Form Request"
            className="text-xs py-2 px-4 rounded-xl cursor-pointer"
          />
        </Link>
      </div>
    );
  }

  const formatBudgetRange = () => {
    return `Rp ${Number(fetchedData.budgetMin).toLocaleString("id-ID")} - Rp ${Number(fetchedData.budgetMax).toLocaleString("id-ID")}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-32 space-y-8">
      {/* Back button and Meta info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/spk/request">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-bold text-xs transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Request Baru</span>
          </button>
        </Link>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg">
          Request ID: #{fetchedData.id}
        </span>
      </div>

      {/* Meta Request Info Card */}
      <div className="bg-white border border-zinc-200 rounded-[30px] p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-1">
            Kebutuhan Penggunaan
          </span>
          <p className="text-sm font-semibold text-zinc-800 italic leading-relaxed">
            "{fetchedData.kebutuhan}"
          </p>
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-1">
            Kriteria Budget Riil
          </span>
          <p className="text-sm font-extrabold text-zinc-800">
            {formatBudgetRange()}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-1">
            Lokasi GPS Terdeteksi
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-zinc-800">
            <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
            <span>
              {fetchedData.userLat && fetchedData.userLng
                ? `${Number(fetchedData.userLat).toFixed(4)}, ${Number(fetchedData.userLng).toFixed(4)}`
                : "Belum disetel"}
            </span>
          </div>
        </div>
      </div>

      {/* Core Tabs & SPK Selector */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
            <button
              onClick={() => setActiveTabStep("cards")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabStep === "cards" ? "bg-white text-black shadow-xs" : "text-zinc-500 hover:text-black"
              }`}
            >
              Rekomendasi Laptop
            </button>
            <button
              onClick={() => setActiveTabStep("math")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabStep === "math" ? "bg-white text-black shadow-xs" : "text-zinc-500 hover:text-black"
              }`}
            >
              Matriks Kalkulasi SPK
            </button>
          </div>

          <div className="flex bg-purple-50 border border-purple-100 p-1 rounded-2xl flex-wrap gap-1">
            {(["TOPSIS", "SAW", "WP"] as const).map((method) => (
              <button
                key={method}
                onClick={() => {
                  setActiveMethod(method);
                  setActiveFormulaDetails(null);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black font-mono tracking-wider transition-all cursor-pointer ${
                  activeMethod === method ? "bg-black text-white" : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Tab CONTENT 1: Grouped Product Cards */}
        {activeTabStep === "cards" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">
                Top {activeAlternatives.length} Rekomendasi ({activeMethod})
              </h2>
            </div>

            {activeAlternatives.length === 0 ? (
              <div className="bg-zinc-50 text-center py-16 rounded-3xl border border-dashed border-zinc-300">
                <p className="text-sm font-semibold text-zinc-500">Laptop tidak ditemukan dalam rentang budget ini.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeAlternatives.map((alt: any) => {
                  const isGold = alt.rank === 1;
                  const isSilver = alt.rank === 2;
                  const isBronze = alt.rank === 3;
                  const scorePercent = (alt.score * 100).toFixed(1);
                  const isExpanded = !!openDropdowns[alt.productId];

                  return (
                    <div
                      key={alt.productId}
                      className={`relative bg-white/70 backdrop-blur-xl border rounded-[32px] transition-all p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between ${
                        isGold ? "border-amber-400 ring-2 ring-amber-100 bg-amber-50/10 shadow-lg" : "border-zinc-200 shadow-xs"
                      }`}
                    >
                      {/* Rank ribbon badge */}
                      <div
                        className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md border ${
                          isGold ? "bg-amber-400 border-amber-500" :
                          isSilver ? "bg-zinc-400 border-zinc-500" :
                          isBronze ? "bg-orange-400 border-orange-500" :
                          "bg-black border-zinc-900"
                        }`}
                      >
                        {alt.rank}
                      </div>

                      {/* Product specification info */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1 pt-2">
                          <h3 className="text-xl font-black text-gray-900 leading-tight">
                            {alt.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold">
                            <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-zinc-600 font-mono flex items-center gap-1">
                              <Cpu size={12} /> {alt.specs.processor}
                            </span>
                            <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-zinc-600 font-mono flex items-center gap-1">
                              <Layers size={12} /> {alt.specs.ram} RAM
                            </span>
                            <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-zinc-600 font-mono">
                              💾 {alt.specs.storage} SSD
                            </span>
                            <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-zinc-600 font-mono">
                              🔋 {alt.specs.battery}
                            </span>
                          </div>
                        </div>

                        {/* Specs subgrid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-zinc-600">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Berat Laptop</p>
                            <p className="text-gray-900">{alt.specs.weight}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Ukuran Layar</p>
                            <p className="text-gray-900">{alt.specs.screenSize}"</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Tahun Rilis</p>
                            <p className="text-gray-900">{alt.specs.releaseYear}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Penjual Terdekat</p>
                            <p className="text-purple-700 font-black">{alt.available_stores[0]?.store_name || "-"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Score & dropdown toggle */}
                      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-4 border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0 shrink-0">
                        <div className="text-right flex items-center gap-3 md:flex-col md:items-end">
                          <div className="shrink-0 flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-2xl md:bg-transparent md:border-0 md:p-0">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Score:</span>
                            <span className="text-lg font-black font-mono text-purple-700">{scorePercent}%</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-400 font-medium">Mulai dari</p>
                            <p className="text-base font-black text-gray-900">
                              Rp {Number(alt.available_stores[0]?.price ?? 0).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>

                        {/* Large Touch Target Accordion Button */}
                        <button
                          onClick={() => toggleDropdown(alt.productId)}
                          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer py-3.5 px-6 self-stretch text-center sm:self-auto"
                        >
                          <span>Bandingkan Toko ({alt.available_stores.length})</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Dropdown list of stores sorted by distance */}
                      {isExpanded && (
                        <div className="w-full border-t border-zinc-100 mt-6 pt-6 animate-fadeIn space-y-4">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">
                            Daftar Toko Penjual (Diurutkan Jarak Terdekat)
                          </p>
                          
                          <div className="grid grid-cols-1 gap-3">
                            {alt.available_stores.map((store: any, sIdx: number) => (
                              <div
                                key={sIdx}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition"
                              >
                                <div className="space-y-1">
                                  <p className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                                    <span>{store.store_name}</span>
                                    {sIdx === 0 && (
                                      <span className="inline-block px-1.5 py-0.5 text-[8px] bg-purple-700 text-white rounded font-bold uppercase tracking-wide">
                                        Terdekat
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {store.address || "-"}, {store.city || "-"}
                                  </p>
                                </div>

                                <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                                  <div className="text-left sm:text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Harga</p>
                                    <p className="text-sm font-black text-gray-900">
                                      Rp {Number(store.price).toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                  <div className="text-left sm:text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Jarak</p>
                                    <p className="text-sm font-black text-purple-700">
                                      {store.distanceInKm !== null ? `${Number(store.distanceInKm).toFixed(2)} Km` : "-"}
                                    </p>
                                  </div>
                                  
                                  {/* Map Action link with large target */}
                                  {store.latitude && store.longitude && (
                                    <a
                                      href={`https://www.google.com/maps?q=${store.latitude},${store.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 font-bold text-xs text-zinc-800 transition active:scale-95 cursor-pointer py-3 px-4"
                                    >
                                      <span>Peta Toko</span>
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab CONTENT 2: Mathematical Steps */}
        {activeTabStep === "math" && (
          <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden">
            <div className="flex border-b border-zinc-200 bg-zinc-50/50 p-2 gap-1.5">
              <button
                onClick={() => {
                  setActiveMathSubTab("decision");
                  setActiveFormulaDetails(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMathSubTab === "decision" ? "bg-white text-gray-900 shadow-xs border border-zinc-200" : "text-zinc-500 hover:text-black"
                }`}
              >
                Langkah 1: Matriks Keputusan (X)
              </button>
              <button
                onClick={() => {
                  setActiveMathSubTab("norm");
                  setActiveFormulaDetails(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMathSubTab === "norm" ? "bg-white text-gray-900 shadow-xs border border-zinc-200" : "text-zinc-500 hover:text-black"
                }`}
              >
                Langkah 2: Normalisasi Matriks (R)
              </button>
            </div>

            {/* Hover math info panel */}
            {activeFormulaDetails && (
              <div className="mx-6 mt-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold text-purple-900 block">Detail Kalkulasi Matematika:</span>
                  <p className="text-purple-800 font-mono leading-relaxed break-all font-semibold">
                    {activeFormulaDetails.description}
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 overflow-x-auto">
              {activeMathSubTab === "decision" && (
                <DecisionMatrixTable
                  decisionMatrix={decisionMatrix}
                  activeAlternatives={activeAlternatives}
                  activeFormulaDetails={activeFormulaDetails}
                  onCellClick={handleCellClick}
                  criterias={CRITERIAS}
                />
              )}

              {activeMathSubTab === "norm" && (
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
                  criterias={CRITERIAS}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
