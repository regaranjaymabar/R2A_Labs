import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Hash, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputSelect } from "../../../components/ui/common/InputSelect";
import { useEditProductWeight } from "./hooks/useEditProductWeight";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../services/productService";
import { criteriaService } from "../../../services/criteriaService";
import { subCriteriaService } from "../../../services/subCriteriaService";

export default function EditProductWeight() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isLoadingData,
    isSubmitting,
    weightData,
  } = useEditProductWeight();

  const selectedProductId = watch("product_id");
  const selectedCriteriaId = watch("criteria_id");
  const selectedSubCriteriaId = watch("sub_criteria_id");

  // Fetch produk untuk dropdown
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  // Fetch kriteria untuk dropdown
  const { data: criterias = [] } = useQuery({
    queryKey: ["criterias"],
    queryFn: criteriaService.getAll,
  });

  // Fetch subkriteria untuk dropdown
  const { data: allSubCriterias = [] } = useQuery({
    queryKey: ["subcriterias"],
    queryFn: subCriteriaService.getAll,
  });

  // Filter subkriteria sesuai kriteria yang dipilih
  const availableSubCriterias = useMemo(() => {
    if (!selectedCriteriaId) return [];
    return allSubCriterias.filter(
      (sub: any) => Number(sub.criteria_id) === Number(selectedCriteriaId)
    );
  }, [allSubCriterias, selectedCriteriaId]);

  // Handle perubahan subkriteria -> otomatis set value_numeric
  const handleSubCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = Number(e.target.value);
    setValue("sub_criteria_id", subId, { shouldValidate: true });

    const found = allSubCriterias.find((sub: any) => Number(sub.id) === subId);
    if (found && (found.valueNumeric !== undefined || found.value_numeric !== undefined)) {
      setValue("value_numeric", Number(found.valueNumeric ?? found.value_numeric), { shouldValidate: true });
    } else if (found && (found as any).value !== undefined) {
      setValue("value_numeric", Number((found as any).value), { shouldValidate: true });
    } else {
      setValue("value_numeric", 0, { shouldValidate: true });
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Bobot Spesifikasi Produk
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Perbarui spesifikasi produk pada matriks keputusan (SPK).
          </p>
        </div>

        <Link
          to="/admin/productweights"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Matriks</span>
        </Link>
      </div>

      {/* Form Edit Bobot */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#151216] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {/* 1. Pilih Produk Laptop */}
        <InputSelect
          label={
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Produk Laptop (<code className="font-mono text-black">product_id</code>)
            </span>
          }
          register={register}
          nama="product_id"
          disabled={true}
          helperText="* Produk dan kriteria tidak dapat diubah agar ID riwayat tetap konsisten."
          className="bg-gray-100! dark:bg-[#181519]! text-gray-500! cursor-not-allowed!"
        >
          <option value={selectedProductId}>
            #{selectedProductId} - {weightData?.product_name || `Product #${selectedProductId}`}
          </option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>
              #{p.id} - {p.brand?.name || p.brand_name || ""} {p.modelName || p.model_name}
            </option>
          ))}
        </InputSelect>

        {/* 2. Pilih Kriteria Penilaian */}
        <InputSelect
          label={
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Kriteria Penilaian (<code className="font-mono text-black">criteria_id</code>)
            </span>
          }
          register={register}
          nama="criteria_id"
          disabled={true}
          className="bg-gray-100! dark:bg-[#181519]! text-gray-500! cursor-not-allowed!"
        >
          <option value={selectedCriteriaId}>
            #{selectedCriteriaId} - {weightData?.criteria_name || `Criteria #${selectedCriteriaId}`}
          </option>
          {criterias.map((c: any) => (
            <option key={c.id} value={c.id}>
              [{c.code}] {c.name} ({c.type?.toUpperCase()})
            </option>
          ))}
        </InputSelect>

        {/* 3. Pilih Spesifikasi (Sub-Kriteria) */}
        <InputSelect
          label={
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Pilih Spesifikasi Baru (<code className="font-mono text-black">sub_criteria_id</code>)
            </span>
          }
          value={selectedSubCriteriaId || 0}
          onChange={handleSubCriteriaChange}
          placeholder="-- Pilih Spesifikasi --"
          placeholderValue={0}
          error={errors.sub_criteria_id?.message}
          className="bg-gray-50! dark:bg-[#181519]! dark:text-white!"
        >
          {availableSubCriterias.map((sub: any) => (
            <option key={sub.id} value={sub.id}>
              {sub.name || sub.description} (Skala: {sub.value || sub.value_numeric || 0})
            </option>
          ))}
        </InputSelect>

        {/* 4. Nilai Numeric (Otomatis dari Sub-Kriteria) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            Nilai Numerik Konversi (<code className="font-mono text-black">value_numeric</code>)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              readOnly
              {...register("value_numeric")}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold bg-purple-50/50 dark:bg-[#1e1920] border border-purple-200 dark:border-purple-900/50 rounded-xl text-purple-700 dark:text-purple-300 focus:outline-none cursor-not-allowed"
            />
            <Hash className="w-4 h-4 text-purple-500 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/productweights")}
            label="Batal"
            className="text-xs! py-2.5 px-6 rounded-xl cursor-pointer"
          />
          <Button
            type="submit"
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            label={isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            disabled={isSubmitting}
            className="text-xs py-2.5 px-6 rounded-xl font-bold shadow-md cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}
