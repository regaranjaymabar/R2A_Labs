import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,

} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { useAddSubCriteria } from "./hooks/useAddSubCriteria";
import { useGet } from "../../../hooks/useGet";
import { criteriaService } from "../../../services/criteriaService";
import { initialCriterias } from "../criterias/CriteriaIndex";

export default function AddSubCriteria() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, errors, isSubmitting } = useAddSubCriteria();

  // Fetch daftar Kriteria Induk dari backend dengan offlineFallbackData
  const { data: fetchedCriterias, isLoading: isCriteriasLoading } = useGet({
    queryKey: ["criterias"],
    queryFn: criteriaService.getAll,
    offlineFallbackData: initialCriterias,
  });
  const criterias = fetchedCriterias || initialCriterias;

  // Pantau input untuk Live Preview Buku Kamus Terjemahan SPK
  const watchCriteriaId = watch("criteria_id");
  const watchDescription = watch("description");
  const watchValue = watch("value_numeric");

  const selectedCriteria = criterias.find(
    (c: any) => Number(c.id) === Number(watchCriteriaId)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Tambah Sub-Kriteria Baru</span>
            </h1>
          </div>
        </div>

        <Link
          to="/admin/subcriterias"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Sub-Kriteria</span>
        </Link>
      </div>

      {/* 2. KARTU FORM UTAMA */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="h-2 bg-black"></div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Kriteria Induk</span>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="criteria_id" className="text-sm font-medium text-gray-700">
                Pilih Kriteria
              </label>
              <select
                id="criteria_id"
                {...register("criteria_id")}
                disabled={isCriteriasLoading}
                className={`w-full border border-gray-300 rounded-xl px-3.5 py-3 outline-none transition-all font-semibold text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blaxk cursor-pointer ${errors.criteria_id ? "border-red-500 focus:ring-red-500" : ""
                  }`}
              >
                <option value={0}>-- Pilih Kriteria SPK --</option>
                {criterias.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.name} ({c.type?.toUpperCase()})
                  </option>
                ))}
              </select>
              {errors.criteria_id && (
                <p className="text-xs font-semibold text-red-500 animate-fadeIn">
                  {errors.criteria_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Konversi Angka Mutlak</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-1">
                <InputText
                  label="Deskripsi Spesifikasi / Rentang"
                  nama="description"
                  register={register}
                  error={errors.description?.message}
                />
              </div>

              <div className="md:col-span-1">
                <InputText
                  label="Nilai Bobot"
                  nama="value_numeric"
                  type="number"
                  step="any"
                  placeholder="Contoh: 1, 2, 3, 4, 5 atau 2.5"
                  register={register}
                  error={errors.value_numeric?.message}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: LIVE PREVIEW KAMUS TERJEMAHAN */}
          <div className="p-5 rounded-2xl border border-black space-y-3 transition-all">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono">
              <span>Live Preview</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3.5 rounded-xl bg-white border border-purple-100 text-xs">
              <div>
                <span className="block text-gray-400 font-mono text-[11px]">KRITERIA INDUK:</span>
                <span className="font-bold text-gray-900 mt-0.5 block">
                  {selectedCriteria ? `[${selectedCriteria.code}] ${selectedCriteria.name}` : "Belum dipilih"}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px]">TEKS SPESIFIKASI:</span>
                <span className="font-bold mt-0.5 block font-mono">
                  &quot;{watchDescription || "..."}&quot;
                </span>
              </div>
              <div>
                <span className="block text-gray-400 font-mono text-[11px]">Konfersi:</span>
                <span className="font-bold text-emerald-600 mt-0.5 block font-mono text-sm">
                  {Number(watchValue || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* TOMBOL AKSI FORM */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/subcriterias")}
              label="Batal"
              className="px-5! py-2.5! rounded-xl! text-xs! font-bold! cursor-pointer!"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              label={isSubmitting ? "Menyimpan Aturan..." : "Simpan Sub-Kriteria"}
              className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
