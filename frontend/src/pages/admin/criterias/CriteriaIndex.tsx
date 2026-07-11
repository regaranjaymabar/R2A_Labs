import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Save,
} from "lucide-react";
import { TabelCriteriaIndex } from "./components/TabelCriteriaIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useDeleteCriteria } from "./hooks/useDeleteCriteria";
import { useGet } from "../../../hooks/useGet";
import { criteriaService } from "../../../services/criteriaService";
import { useQueryClient } from "@tanstack/react-query";
import type { Criteria } from "../../../types/criteria";
export type { Criteria };

// 1. Definisi Interface Dimensi Penilaian (Criteria)
// Sesuai persis 4 kolom di database MySQL kamu: id, code, name, type


// 2. Data Dummy Awal (Persis 8 baris data dari screenshot database phpMyAdmin kamu)
export const initialCriterias: Criteria[] = [
  
];


export default function CriteriaIndex() {
  const queryClient = useQueryClient();

  // Fetch data kriteria dari backend via useGet (React Query + offline fallback)
  const { data: fetchedData, isLoading, refetch } = useGet<Criteria[]>({
    queryKey: ["criterias"],
    queryFn: criteriaService.getAll,
    offlineFallbackData: initialCriterias,
  });

  const data = fetchedData || initialCriterias;

  // Custom Hook Hapus Data (Delete dengan Modal Confirm)
  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    deletingId,
  } = useDeleteCriteria();

  // State Modal Edit / Update Dimensi Kriteria
  const [editingItem, setEditingItem] = useState<Criteria | null>(null);
  const [editCode, setEditCode] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editType, setEditType] = useState<"benefit" | "cost">("benefit");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Buka Modal Update
  const handleOpenEdit = (item: Criteria) => {
    setEditingItem(item);
    setEditCode(item.code);
    setEditName(item.name);
    setEditType((item.type.toLowerCase() === "cost" ? "cost" : "benefit") as "benefit" | "cost");
  };

  // Simpan Perubahan ke Backend Server (PUT /api/superadmin/criteria/:id)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSavingEdit(true);
      await criteriaService.update(editingItem.id, {
        code: editCode.toUpperCase(),
        name: editName.trim(),
        type: editType,
      });

      // Update cache lokal langsung seketika agar UI tabel berubah seketika tanpa jeda
      queryClient.setQueryData<Criteria[]>(["criterias"], (old = []) =>
        old.map((item) =>
          Number(item.id) === Number(editingItem.id)
            ? {
                ...item,
                code: editCode.toUpperCase(),
                name: editName.trim(),
                type: editType,
              }
            : item
        )
      );

      setEditingItem(null);

      // Paksa refetch langsung ke backend agar data tabel 100% tersinkron
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["criterias"] });
    } catch (err: any) {
      alert(
        `Gagal memperbarui kriteria: ${
          err?.response?.data?.message || err?.message || "Error"
        }`
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  

  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dimensi Penilaian (Kriteria SPK)
            </h1>
          </div>
        </div>
        <div>
          <Link
            to="/admin/criterias/add"
            className="inline-flex items-center gap-2 bg-[#151216] dark:bg-white text-white dark:text-gray-900 hover:bg-[#262128] dark:hover:bg-gray-200 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kriteria Baru</span>
          </Link>
        </div>
      </div>

      {/* Tabel Kriteria */}
      <TabelCriteriaIndex
        data={data}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* MODAL UPDATE DIMENSI PENILAIAN */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        maxWidth="lg"
        badge={
          <span className="text-black dark:text-gray-400">
            Update Dimensi Penilaian
          </span>
        }
        title={editingItem ? `[${editingItem.code}] ${editingItem.name}` : ""}
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            {/* 1. Kode Dimensi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Kode Dimensi (Label Perhitungan SAW)
              </label>
              <input
                type="text"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                placeholder="Misal: C1, C2"
                className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white uppercase transition-all shadow-2xs"
                required
              />
            </div>

            {/* 2. Nama Kriteria */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Nama Dimensi Penilaian
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Misal: Harga, RAM, Storage"
                className="w-full px-4 py-2.5 text-sm font-semibold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all shadow-2xs"
                required
              />
            </div>

            {/* 3. Tipe Atribut (Benefit vs Cost) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center gap-1.5">
                <span>Tipe Atribut Algoritma SAW (<code className="font-mono text-[11px]">type</code>)</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditType("benefit")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    editType === "benefit"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                      : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <TrendingUp className={`w-4 h-4 ${editType === "benefit" ? "text-emerald-600" : "text-gray-400"}`} />
                    <span>benefit</span>
                  </div>
                  <span className="text-[10px] opacity-80">
                    Semakin besar nilainya semakin bagus
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditType("cost")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    editType === "cost"
                      ? "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-300 ring-2 ring-red-500/20"
                      : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <TrendingDown className={`w-4 h-4 ${editType === "cost" ? "text-red-600" : "text-gray-400"}`} />
                    <span>cost</span>
                  </div>
                  <span className="text-[10px] opacity-80">
                    Semakin kecil nilainya semakin bagus
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons Menggunakan Komponen Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingItem(null)}
                label="Batal"
                className="!text-xs! py-2! px-5! rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
              />
              <Button
                type="submit"
                disabled={isSavingEdit}
                icon={<Save className="w-4 h-4" />}
                label={isSavingEdit ? "Menyimpan..." : "Simpan Kriteria"}
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
              />
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL KONFIRMASI HAPUS KRITERIA */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Dimensi Penilaian?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus dimensi penilaian <strong className="font-bold text-gray-900 dark:text-white">{deleteTarget?.name}</strong>? Seluruh sub-kriteria dan bobot produk yang terkait akan terpengaruh.
          </span>
        }
        confirmLabel="Ya, Hapus Kriteria"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}
