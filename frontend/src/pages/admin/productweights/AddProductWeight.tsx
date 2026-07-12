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

    // Validasi 2: Seluruh kriteria yang aktif harus dipilih spesifikasinya (kecuali Harga / C1 yang opsional)
    const unselectedCriterias = criterias.filter(
      (c: any) =>
        c.code !== "C1" &&
        c.name.toLowerCase() !== "harga" &&
        (!selectedSubs[c.id] || selectedSubs[c.id] <= 0)
    );
    if (unselectedCriterias.length > 0) {
      setValidationError(
        `Harap lengkapi penilaian untuk kriteria: ${unselectedCriterias
          .map((c: any) => c.name)
          .join(", ")}!`
      );
      return;
    }

    // Siapkan array payload untuk seluruh kriteria yang terpilih saja
    const payloads = criterias
      .filter((c: any) => selectedSubs[c.id] && selectedSubs[c.id] > 0)
      .map((c: any) => ({
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
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Tambah Bobot Spesifikasi Produk</span>
            </h1>
          </div>
        </div>

        <Link
          to="/admin/productweights"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Matriks</span>
        </Link>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{validationError}</span>
        </div>
      )}

      {/* 2. KARTU FORM UTAMA */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="h-2 bg-black"></div>

        <form onSubmit={handleBatchSubmit} className="p-6 md:p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Pilih Produk Laptop yang Akan Dinilai</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Model Laptop
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(Number(e.target.value));
                  setValidationError(null);
                }}
                disabled={isDataLoading}
                className={`w-full border border-gray-300 rounded-xl px-3.5 py-3 outline-none transition-all font-semibold text-sm bg-white text-gray-900 focus:ring-2 focus:ring-black cursor-pointer ${!selectedProductId ? "border-black" : ""
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
                    {p.id} - {(p.brand?.name || p.brand_name) ? `[${p.brand?.name || p.brand_name}] ` : ""}{p.modelName || p.model_name}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
                <span>
                  * {showAllProducts ? "Menampilkan SELURUH laptop di katalog." : "Hanya menampilkan laptop yang belum dinilai dalam matriks SPK."}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="font-bold text-gray-700 hover:underline cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 transition-all active:scale-95 shrink-0"
                >
                  {showAllProducts ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan Laptop Sudah Dibobot</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan Seluruh Laptop</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        {/* 2. Daftar Spesifikasi per Kriteria */}
        {selectedProductId !== 0 && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Atur Bobot Spesifikasi per Kriteria
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Pilih spesifikasi yang sesuai untuk masing-masing kriteria di bawah ini
                </p>
              </div>
            </div>

            {isCriteriasLoading || isSubCriteriasLoading ? (
              <div className="py-12 text-center text-sm text-gray-500 font-medium">
                Memuat data kriteria dan spesifikasi...
              </div>
            ) : criterias.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500 font-medium">
                Belum ada master data kriteria tersimpan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criterias
                  .filter((c: any) => c.code !== "C1" && c.name.toLowerCase() !== "harga")
                  .map((c: any) => {
                    const subsForCriteria = allSubCriterias.filter(
                      (s: any) =>
                        Number(s.criteria_id ?? s.criteriaId) === Number(c.id)
                    );
                  const currentSelectedSub = selectedSubs[c.id] || 0;
                  const currentNumericVal = numericValues[c.id] || 0;

                  return (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl border border-gray-200/80 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-extrabold text-black border border-gray-200">
                            {c.code}
                          </span>
                          <span className="font-bold text-gray-900 text-sm">
                            {c.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase">
                          {c.type}
                        </span>
                      </div>

                      {/* Dropdown Pilihan Subkriteria */}
                      <div>
                        <select
                          value={currentSelectedSub}
                          onChange={(e) =>
                            handleSubCriteriaChange(c.id, Number(e.target.value))
                          }
                          disabled={isSubCriteriasLoading}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all font-semibold text-sm bg-white text-gray-900 focus:ring-2 focus:ring-black cursor-pointer shadow-2xs"
                        >
                          <option value={0}>-- Pilih Spesifikasi {c.name} --</option>
                          {subsForCriteria.map((sub: any) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name || sub.description} ({sub.valueNumeric ?? sub.value_numeric ?? sub.value ?? 0})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                        <span className="font-medium text-gray-500 flex items-center gap-1">
                          Skala Konversi SPK:
                        </span>
                        <span
                          className={`font-mono font-bold px-2.5 py-1 rounded-lg transition-all ${currentSelectedSub > 0
                              ? "bg-gray-200 text-gray-500 shadow-xs"
                              : "bg-gray-200 text-gray-500"
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
        )}

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
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