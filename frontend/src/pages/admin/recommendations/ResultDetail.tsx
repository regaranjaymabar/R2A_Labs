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

  const dbSortedCriterias = useMemo(() => {
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
      calculationDetails: data.calculationDetails || null,
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

  const criterias = useMemo(() => {
    if (session && Array.isArray(session.rawWeights) && session.rawWeights.length > 0) {
      return session.rawWeights.map((rw: any) => {
        const code = rw.criteria?.code || (rw.criteriaId ? `C${rw.criteriaId}` : "");
        const name = rw.criteria?.name || `Kriteria ${rw.criteriaId}`;
        const type = rw.criteria?.type || "benefit";
        
        let desc = "";
        if (code === "C1") desc = "Harga produk laptop (Semakin murah semakin baik)";
        else if (code === "C2") desc = "Kapasitas RAM laptop (Semakin besar semakin baik)";
        else if (code === "C3") desc = "Kapasitas Storage/Penyimpanan (Semakin besar semakin baik)";
        else if (code === "C4") desc = "Kapasitas Baterai laptop dalam Wh (Semakin awet semakin baik)";
        else if (code === "C5") desc = "Berat fisik laptop dalam Kg (Semakin ringan semakin baik)";
        else if (code === "C6") desc = "Kelas benchmark performa processor (Semakin tinggi semakin baik)";
        else if (code === "C7") desc = "Bentang layar laptop dalam Inch (Semakin luas semakin baik)";
        else if (code === "C8") desc = "Tahun rilis laptop ke pasar (Semakin baru semakin baik)";
        else {
          desc = `${name} (${type === "cost" ? "Semakin kecil semakin baik" : "Semakin besar semakin baik"})`;
        }

        return { code, name, type, desc };
      });
    }

    return dbSortedCriterias;
  }, [session, dbSortedCriterias]);

  const activeAlternatives = useMemo(() => {
    if (!session || !Array.isArray(session.results)) return [];

    // 1. Map all alternatives in their base order first
    const baseAlts = session.results
      .filter((r: any) => r.methodUsed === activeMethod || r.method_used === activeMethod)
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

        const alt = {
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

        // Precompute values map for scoring
        const values: Record<string, number> = {};
        criterias.forEach((crit) => {
          values[crit.code] = getCriteriaScaleValue(crit.code, alt);
        });

        return { ...alt, values };
      });

    if (baseAlts.length === 0) return [];

    // 2. Sort and group depending on activeMethod
    let finalAlts: typeof baseAlts = [];

    if (activeMethod === "WP") {
      const totalW = criterias.reduce((sum, crit) => sum + (weightsMap[crit.code] ?? 0), 0);
      const normalizedW: Record<string, number> = {};
      criterias.forEach((crit) => {
        normalizedW[crit.code] = totalW > 0 ? (weightsMap[crit.code] ?? 0) / totalW : 0;
      });

      const wpS = baseAlts.map((alt) => {
        let s = 1;
        criterias.forEach((crit) => {
          const x = alt.values[crit.code];
          const w = normalizedW[crit.code];
          if (w > 0) {
            const power = crit.type === "cost" ? -w : w;
            s *= Math.pow(x, power);
          }
        });
        return s;
      });

      const sumS = wpS.reduce((sum, s) => sum + s, 0);
      const calculatedAlts = baseAlts.map((alt, idx) => ({
        ...alt,
        calculatedScore: sumS > 0 ? wpS[idx] / sumS : 0,
      }));

      // Group by product name
      const groups: Record<string, typeof calculatedAlts> = {};
      calculatedAlts.forEach((alt) => {
        const name = alt.name;
        if (!groups[name]) groups[name] = [];
        groups[name].push(alt);
      });

      // Sort items within each group by calculatedScore descending
      Object.values(groups).forEach((g) => {
        g.sort((a, b) => b.calculatedScore - a.calculatedScore);
      });

      // Sort groups based on the best calculatedScore descending
      const sortedGroups = Object.values(groups).sort((a, b) => b[0].calculatedScore - a[0].calculatedScore);

      // Flatten back into a single list
      finalAlts = sortedGroups.flat();
    } else if (activeMethod === "TOPSIS") {
      const columnSquareSums: Record<string, number> = {};
      criterias.forEach((crit) => {
        const sum = baseAlts.reduce((s, alt) => s + Math.pow(alt.values[crit.code], 2), 0);
        columnSquareSums[crit.code] = Math.sqrt(sum);
      });

      const normalizedV = baseAlts.map((alt) => {
        const vValues: Record<string, number> = {};
        criterias.forEach((crit) => {
          const x = alt.values[crit.code];
          const sqrtSum = columnSquareSums[crit.code];
          const r = sqrtSum > 0 ? x / sqrtSum : 0;
          const w = weightsMap[crit.code] ?? 0;
          vValues[crit.code] = r * w;
        });
        return vValues;
      });

      const idealPositive: Record<string, number> = {};
      const idealNegative: Record<string, number> = {};
      criterias.forEach((crit) => {
        const colValues = normalizedV.map((v) => v[crit.code]);
        if (crit.type === "benefit") {
          idealPositive[crit.code] = colValues.length > 0 ? Math.max(...colValues) : 0;
          idealNegative[crit.code] = colValues.length > 0 ? Math.min(...colValues) : 0;
        } else {
          idealPositive[crit.code] = colValues.length > 0 ? Math.min(...colValues) : 0;
          idealNegative[crit.code] = colValues.length > 0 ? Math.max(...colValues) : 0;
        }
      });

      const calculatedAlts = baseAlts.map((alt, idx) => {
        let dPlusSquareSum = 0;
        let dMinusSquareSum = 0;
        criterias.forEach((crit) => {
          const v = normalizedV[idx][crit.code];
          dPlusSquareSum += Math.pow(v - idealPositive[crit.code], 2);
          dMinusSquareSum += Math.pow(v - idealNegative[crit.code], 2);
        });
        const dPlus = Math.sqrt(dPlusSquareSum);
        const dMinus = Math.sqrt(dMinusSquareSum);
        const closeness = (dPlus + dMinus) > 0 ? dMinus / (dPlus + dMinus) : 0;
        return {
          ...alt,
          calculatedScore: closeness,
        };
      });

      // Group by product name
      const groups: Record<string, typeof calculatedAlts> = {};
      calculatedAlts.forEach((alt) => {
        const name = alt.name;
        if (!groups[name]) groups[name] = [];
        groups[name].push(alt);
      });

      // Sort items within each group by calculatedScore descending
      Object.values(groups).forEach((g) => {
        g.sort((a, b) => b.calculatedScore - a.calculatedScore);
      });

      // Sort groups based on the best calculatedScore descending
      const sortedGroups = Object.values(groups).sort((a, b) => b[0].calculatedScore - a[0].calculatedScore);

      // Flatten back
      finalAlts = sortedGroups.flat();
    } else {
      // Default to SAW: sort by raw backend score descending
      const calculatedAlts = baseAlts.map((alt) => ({
        ...alt,
        calculatedScore: alt.score,
      }));

      // Group by product name
      const groups: Record<string, typeof calculatedAlts> = {};
      calculatedAlts.forEach((alt) => {
        const name = alt.name;
        if (!groups[name]) groups[name] = [];
        groups[name].push(alt);
      });

      // Sort items within each group by calculatedScore descending
      Object.values(groups).forEach((g) => {
        g.sort((a, b) => b.calculatedScore - a.calculatedScore);
      });

      // Sort groups based on the best calculatedScore descending
      const sortedGroups = Object.values(groups).sort((a, b) => b[0].calculatedScore - a[0].calculatedScore);

      // Flatten back
      finalAlts = sortedGroups.flat();
    }

    return finalAlts;
  }, [session, activeMethod, allWeights, criterias, weightsMap]);

  const decisionMatrix = useMemo(() => {
    return activeAlternatives.map((alt) => {
      return {
        alternativeName: alt.name,
        brand: alt.brand,
        score: alt.score,
        rank: alt.rank,
        is_chosen_by_user: alt.is_chosen_by_user,
        storeName: alt.storeName,
        price: alt.price,
        values: alt.values || {},
      };
    });
  }, [activeAlternatives, criterias]);

  const columnExtremes = useMemo(() => {
    const extremes: Record<string, { min: number; max: number }> = {};
    criterias.forEach((crit) => {
      const codeLower = crit.code.toLowerCase();
      const values = decisionMatrix.map((row) => row.values[crit.code]);
      
      let minVal = values.length > 0 ? Math.min(...values) : 1;
      let maxVal = values.length > 0 ? Math.max(...values) : 5;

      if (session?.calculationDetails?.saw) {
        const sawDetails = session.calculationDetails.saw;
        if (sawDetails[`min_${codeLower}`] !== undefined && sawDetails[`min_${codeLower}`] !== null) {
          minVal = Number(sawDetails[`min_${codeLower}`]);
        }
        if (sawDetails[`max_${codeLower}`] !== undefined && sawDetails[`max_${codeLower}`] !== null) {
          maxVal = Number(sawDetails[`max_${codeLower}`]);
        }
      }

      extremes[crit.code] = {
        min: minVal,
        max: maxVal,
      };
    });

    return extremes;
  }, [decisionMatrix, criterias, session?.calculationDetails?.saw]);

  const columnSquareSums = useMemo(() => {
    const squareSums: Record<string, number> = {};
    criterias.forEach((crit) => {
      const codeLower = crit.code.toLowerCase();
      const sum = decisionMatrix.reduce((s, row) => s + Math.pow(row.values[crit.code], 2), 0);
      let sqrtSum = Math.sqrt(sum);

      if (session?.calculationDetails?.topsis) {
        const topsisDetails = session.calculationDetails.topsis;
        if (topsisDetails[`bagi_${codeLower}`] !== undefined && topsisDetails[`bagi_${codeLower}`] !== null) {
          sqrtSum = Number(topsisDetails[`bagi_${codeLower}`]);
        }
      }

      squareSums[crit.code] = sqrtSum;
    });
    return squareSums;
  }, [decisionMatrix, criterias, session?.calculationDetails?.topsis]);

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
    const useRawWeights = true; // database v_wp view uses raw weights

    const alternativesS = decisionMatrix.map((row) => {
      let s = 1;
      const norms: Record<string, number> = {};
      criterias.forEach((crit) => {
        const x = row.values[crit.code];
        // Use raw weight to match v_wp view in database
        const w = useRawWeights ? (weightsMap[crit.code] ?? 0) : (() => {
          const totalW = criterias.reduce((sum, c) => sum + (weightsMap[c.code] ?? 0), 0);
          return totalW > 0 ? (weightsMap[crit.code] ?? 0) / totalW : 0;
        })();

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

    const sumS = session?.calculationDetails?.wp?.total_s !== undefined && session?.calculationDetails?.wp?.total_s !== null
      ? Number(session.calculationDetails.wp.total_s)
      : alternativesS.reduce((sum, alt) => sum + alt.s, 0);

    return alternativesS.map((alt) => ({
      ...alt,
      v: sumS > 0 ? alt.s / sumS : 0,
    }));
  }, [decisionMatrix, weightsMap, criterias, session?.calculationDetails?.wp?.total_s]);

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

      <ResultInfoCard session={session} weightsMap={weightsMap} criterias={criterias} />

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
