import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { useAddProductWeight } from "./hooks/useAddProductWeight";
import { useGet } from "../../../hooks/useGet";
import { productService } from "../../../services/productService";
import { criteriaService } from "../../../services/criteriaService";
import { subCriteriaService } from "../../../services/subCriteriaService";
import { productWeightService } from "../../../services/productWeightService";

// Fallback data lokal untuk pengujian offline/tanpa backend server
import { initialProducts } from "../products/ProductIndex";
import { initialCriterias } from "../criterias/CriteriaIndex";
import { initialSubCriterias } from "../subcriterias/SubCriteriaIndex";
import { initialProductCriterias } from "./ProductWeightIndex";

export default function AddProductWeight() {
  const navigate = useNavigate();
  const { isSubmitting, mutateBatch } = useAddProductWeight();

  // State untuk melacak produk laptop yang dipilih
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  // State untuk opsi menanmpilkan seluruh laptop (termasuk yang sudah dibobot)
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false);

  // State untuk melacak pilihan sub-kriteria dinamis (key: criteria_id, value: sub_criteria_id)
  const [selectedSubs, setSelectedSubs] = useState<Record<number, number>>({});
  // State untuk melacak nilai numerik konversi (key: criteria_id, value: numeric_value)
  const [numericValues, setNumericValues] = useState<Record<number, number>>({});
  // State untuk pesan error validasi manual
  const [validationError, setValidationError] = useState<string | null>(null);

  // 1. Fetch seluruh data Master (menggunakan useGet + offlineFallbackData agar otomatis aktif saat offline/tanpa backend)
  const { data: fetchedProducts, isLoading: isProductsLoading } = useGet({
    queryKey: ["products"],
    queryFn: productService.getAll,
    offlineFallbackData: initialProducts,
  });
  const products = fetchedProducts || initialProducts;

  const { data: fetchedCriterias, isLoading: isCriteriasLoading } = useGet({
    queryKey: ["criterias"],
    queryFn: criteriaService.getAll,
    offlineFallbackData: initialCriterias,
  });
  const criterias = fetchedCriterias || initialCriterias;

  const { data: fetchedSubCriterias, isLoading: isSubCriteriasLoading } = useGet({
    queryKey: ["subcriterias"],
    queryFn: subCriteriaService.getAll,
    offlineFallbackData: initialSubCriterias,
  });
  const allSubCriterias = fetchedSubCriterias || initialSubCriterias;

  const { data: fetchedWeights, isLoading: isWeightsLoading } = useGet({
    queryKey: ["productweights"],
    queryFn: productWeightService.getAll,
    offlineFallbackData: initialProductCriterias,
  });
  const existingWeights = fetchedWeights || initialProductCriterias;

  // 2. Filter laptop yang BELUM dibobot (atau tampilkan semua jika toggle aktif)
  const availableProducts = useMemo(() => {
    if (showAllProducts) return products;
    const gradedProductIds = new Set(
      existingWeights.map((w: any) => Number(w.product_id))
    );
    return products.filter((p: any) => !gradedProductIds.has(Number(p.id)));
  }, [products, existingWeights, showAllProducts]);

  // 3. Handle perubahan pada dynamic dropdown sub-kriteria
  const handleSubCriteriaChange = (criteriaId: number, subId: number) => {
    setValidationError(null);
    const foundSub = allSubCriterias.find((s: any) => Number(s.id) === subId);
    const numVal = foundSub
      ? Number(foundSub.value_numeric ?? (foundSub as any).value ?? 0)
      : 0;

    setSelectedSubs((prev) => ({ ...prev, [criteriaId]: subId }));
    setNumericValues((prev) => ({ ...prev, [criteriaId]: numVal }));
  };

  // 4. Handle Simpan Seluruh Bobot (Batch Submission)
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validasi 1: Produk harus dipilih
    if (!selectedProductId || selectedProductId <= 0) {
      setValidationError("Silakan pilih produk laptop yang akan dibobot terlebih dahulu!");
      return;
    }

    // Validasi 2: Seluruh kriteria yang aktif harus dipilih spesifikasinya
    const unselectedCriterias = criterias.filter(
      (c: any) => !selectedSubs[c.id] || selectedSubs[c.id] <= 0
    );
    if (unselectedCriterias.length > 0) {
      setValidationError(
        `Harap lengkapi penilaian untuk kriteria: ${unselectedCriterias
          .map((c: any) => c.name)
          .join(", ")}!`
      );
      return;
    }

    // Siapkan array payload untuk seluruh kriteria
    const payloads = criterias.map((c: any) => ({
      product_id: Number(selectedProductId),
      criteria_id: Number(c.id),
      sub_criteria_id: Number(selectedSubs[c.id]),
      value_numeric: Number(numericValues[c.id] || 0),
    }));

    try {
      if (mutateBatch) {
        await mutateBatch(payloads);
      }
    } catch (err: any) {
      setValidationError(err?.message || "Terjadi kesalahan saat menyimpan data bobot.");
    }
  };

  const isDataLoading =
    isProductsLoading || isCriteriasLoading || isSubCriteriasLoading || isWeightsLoading;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER HALAMAN */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span>Tambah Bobot Spesifikasi Produk</span>
            </h1>
          </div>
        </div>

        <Link
          to="/admin/productweights"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Matriks</span>
        </Link>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center gap-3 text-red-700 dark:text-red-300 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{validationError}</span>
        </div>
      )}

      {/* 2. KARTU FORM UTAMA */}
      <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="h-2 bg-black"></div>

        <form onSubmit={handleBatchSubmit} className="p-6 md:p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black dark:text-purple-400">
              <span>Pilih Produk Laptop yang Akan Dinilai</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Model Laptop
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(Number(e.target.value));
                  setValidationError(null);
                }}
                disabled={isDataLoading}
                className={`w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-3 outline-none transition-all font-semibold text-sm bg-white dark:bg-[#181519] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 dark:focus:border-purple-500 cursor-pointer ${!selectedProductId ? "border-purple-300 dark:border-purple-800" : ""
                  }`}
              >
                <option value={0}>
                  {isDataLoading
                    ? "Memuat Katalog Laptop..."
                    : availableProducts.length === 0
                      ? "-- Semua Laptop Sudah Dibobot! Klik Tampilkan Semua --"
                      : "-- Pilih Model Laptop --"}
                </option>
                {availableProducts.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.brand_name ? `[${p.brand_name}] ` : ""}{p.model_name}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  * {showAllProducts ? "Menampilkan SELURUH laptop di katalog." : "Hanya menampilkan laptop yang belum dinilai dalam matriks SPK."}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 transition-all active:scale-95"
                >
                  {showAllProducts ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan Laptop Sudah Dibobot</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan Semua Laptop ({products.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: BARISAN KRITERIA PENILAIAN (DYNAMIC DROPDOWNS) */}
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-purple-400">
                <span>Barisan Kriteria Penilaian Spesifikasi ({criterias.length} Kriteria)</span>
              </div>
            </div>

            {isCriteriasLoading ? (
              <div className="p-8 text-center text-sm font-bold text-gray-500">
                Memuat barisan kriteria SPK...
              </div>
            ) : criterias.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/40 rounded-2xl">
                Belum ada data kriteria aktif di sistem. Silakan tambahkan kriteria terlebih dahulu.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {criterias.map((c: any, idx: number) => {
                  const subsForCriteria = allSubCriterias.filter(
                    (sub: any) => Number(sub.criteria_id) === Number(c.id)
                  );
                  const currentSelectedSubId = selectedSubs[c.id] || 0;
                  const currentNumericVal = numericValues[c.id] || 0;
                  const isBenefit = c.type?.toLowerCase() === "benefit";

                  return (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800/80 space-y-3.5 transition-all hover:border-black dark:hover:border-black"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full text-black dark:text-white flex items-center justify-center text-xs font-mono shrink-0">
                            {idx + 1}
                          </span>
                          <span>{c.name}</span>
                          <code className="text-[11px] font-mono text-gray-400">[{c.code}]</code>
                        </span>

                        {isBenefit ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 uppercase font-mono">
                            benefit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800/60 uppercase font-mono">
                            cost
                          </span>
                        )}
                      </div>

                      {/* Dropdown Sub-Kriteria */}
                      <div className="flex flex-col gap-1">
                        <select
                          value={currentSelectedSubId}
                          onChange={(e) =>
                            handleSubCriteriaChange(c.id, Number(e.target.value))
                          }
                          disabled={isSubCriteriasLoading}
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 outline-none transition-all font-semibold text-sm bg-white dark:bg-[#151216] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 dark:focus:border-purple-500 cursor-pointer shadow-2xs"
                        >
                          <option value={0}>-- Pilih Spesifikasi {c.name} --</option>
                          {subsForCriteria.map((sub: any) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name || sub.description} ({sub.value_numeric ?? sub.value ?? 0})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preview Nilai Bobot Numerik */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                        <span className="font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          Skala Konversi SPK:
                        </span>
                        <span
                          className={`font-mono font-bold px-2.5 py-1 rounded-lg transition-all ${currentSelectedSubId > 0
                              ? "bg-purple-600 text-white shadow-xs"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                            }`}
                        >
                          {currentNumericVal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TOMBOL AKSI FORM */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/productweights")}
              label="Batal"
              className="px-5! py-2.5! rounded-xl! text-xs! font-bold! cursor-pointer!"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isDataLoading}
              label={isSubmitting ? "Menyimpan Bobot..." : "Simpan Seluruh Bobot"}
              className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}