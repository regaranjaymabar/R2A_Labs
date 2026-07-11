import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { criteriaService } from "../../../services/criteriaService";

export default function EditCriteria() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"benefit" | "cost">("benefit");
  const [weight, setWeight] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: criteriaItem, isLoading } = useQuery({
    queryKey: ["criteria", id],
    queryFn: async () => {
      if (!id) throw new Error("ID kriteria tidak valid");
      return await criteriaService.getById(id);
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (criteriaItem) {
      setCode(criteriaItem.code || "");
      setName(criteriaItem.name || "");
      setType((criteriaItem.type as "benefit" | "cost") || "benefit");
      setWeight(String(criteriaItem.weight ?? 0));
    }
  }, [criteriaItem]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID kriteria tidak valid");
      return await criteriaService.update(id, {
        code,
        name,
        type,
        weight: Number(weight),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criterias"] });
      navigate("/admin/criterias");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Gagal memperbarui kriteria SPK.";
      setErrorMsg(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 font-semibold">
        Memuat data kriteria SPK...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Edit Kriteria SPK SAW</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Perbarui kode, nama atribut, tipe benefit/cost, dan nilai bobot penimbangan kriteria.
          </p>
        </div>

        <Link
          to="/admin/criterias"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Form Edit Kriteria */}
      <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="h-2 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#151216] p-6 md:p-8 space-y-6"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Live Preview Badge */}
          <div className="bg-gray-50 dark:bg-[#1a171c] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Preview Kriteria:
              </span>
              <span className="text-sm font-bold font-mono text-gray-900 dark:text-white px-2.5 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xs">
                [{code || "C?"}] {name || "Nama Kriteria"}
              </span>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                type === "benefit"
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
              }`}
            >
              {type === "benefit" ? "Benefit (+)" : "Cost (-)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Kode Kriteria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="C1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Nama Kriteria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Harga Laptop"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tipe Atribut <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "benefit" | "cost")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="benefit">Benefit (Semakin tinggi semakin baik)</option>
                <option value="cost">Cost (Semakin rendah semakin baik)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Bobot Kriteria (0.0 - 1.0) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                placeholder="0.25"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pastikan total penjumlahan seluruh bobot kriteria bernilai 1.0 (100%).
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Link
              to="/admin/criterias"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </Link>
            <Button
              label={updateMutation.isPending ? "Menyimpan Perubahan..." : "Simpan Perubahan Kriteria"}
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
