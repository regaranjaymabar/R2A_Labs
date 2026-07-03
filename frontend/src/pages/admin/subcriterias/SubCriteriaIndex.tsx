import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Sliders,
  Save,
  Filter,
} from "lucide-react";
import { TabelSubCriteriaIndex } from "./components/TabelSubCriteriaIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subCriteriaService } from "../../../services/subCriteriaService";
import { useDeleteSubCriteria } from "./hooks/useDeleteSubCriteria";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useUpdate } from "../../../hooks/useUpdate";
import type { SubCriteriaFormData } from "./hooks/useAddSubCriteria";

// 1. Definisi Interface Sub-Kriteria (sub_criteria)
// Persis sesuai 5 kolom di tabel MySQL kamu: id, criteria_id, description, value_numeric, created_at
export interface SubCriteria {
  id: number;
  criteria_id: number;
  description: string; // Misal: "4 GB", "8 GB", "<= Rp 6.000.000"
  value_numeric: number; // Misal: 1.00, 2.00, 5.00
  created_at?: string; // Misal: "2026-06-30 07:10:47"

  // Properti Opsional Hasil JOIN dengan tabel criteria (agar admin gampang membaca):
  criteria_code?: string; // Misal: "C1", "C2", "C3"
  criteria_name?: string; // Misal: "Harga", "RAM", "Storage"
  criteria_type?: "benefit" | "cost" | string;
}

// 2. Data Dummy Awal (Persis sesuai data di screenshot phpMyAdmin kamu)
const initialSubCriterias: SubCriteria[] = [
  // criteria_id: 1 -> C1: Harga (Cost)
  {
    id: 1,
    criteria_id: 1,
    description: "<= Rp 6.000.000",
    value_numeric: 5.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C1",
    criteria_name: "Harga",
    criteria_type: "cost",
  },
  {
    id: 2,
    criteria_id: 1,
    description: "Rp 6.000.001 - Rp 8.000.000",
    value_numeric: 4.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C1",
    criteria_name: "Harga",
    criteria_type: "cost",
  },
  {
    id: 3,
    criteria_id: 1,
    description: "Rp 8.000.001 - Rp 10.000.000",
    value_numeric: 3.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C1",
    criteria_name: "Harga",
    criteria_type: "cost",
  },
  {
    id: 4,
    criteria_id: 1,
    description: "Rp 10.000.001 - Rp 12.000.000",
    value_numeric: 2.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C1",
    criteria_name: "Harga",
    criteria_type: "cost",
  },
  {
    id: 5,
    criteria_id: 1,
    description: "> Rp 12.000.000",
    value_numeric: 1.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C1",
    criteria_name: "Harga",
    criteria_type: "cost",
  },
  // criteria_id: 2 -> C2: RAM (Benefit)
  {
    id: 6,
    criteria_id: 2,
    description: "4 GB",
    value_numeric: 1.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C2",
    criteria_name: "RAM",
    criteria_type: "benefit",
  },
  {
    id: 7,
    criteria_id: 2,
    description: "8 GB",
    value_numeric: 2.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C2",
    criteria_name: "RAM",
    criteria_type: "benefit",
  },
  {
    id: 8,
    criteria_id: 2,
    description: "12 GB",
    value_numeric: 3.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C2",
    criteria_name: "RAM",
    criteria_type: "benefit",
  },
  {
    id: 9,
    criteria_id: 2,
    description: "16 GB",
    value_numeric: 4.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C2",
    criteria_name: "RAM",
    criteria_type: "benefit",
  },
  {
    id: 10,
    criteria_id: 2,
    description: "24 GB atau lebih",
    value_numeric: 5.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C2",
    criteria_name: "RAM",
    criteria_type: "benefit",
  },
  // criteria_id: 3 -> C3: Storage (Benefit)
  {
    id: 11,
    criteria_id: 3,
    description: "128 GB SSD",
    value_numeric: 1.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C3",
    criteria_name: "Storage",
    criteria_type: "benefit",
  },
  {
    id: 12,
    criteria_id: 3,
    description: "256 GB SSD",
    value_numeric: 2.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C3",
    criteria_name: "Storage",
    criteria_type: "benefit",
  },
  {
    id: 13,
    criteria_id: 3,
    description: "512 GB SSD",
    value_numeric: 3.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C3",
    criteria_name: "Storage",
    criteria_type: "benefit",
  },
  {
    id: 14,
    criteria_id: 3,
    description: "1 TB SSD",
    value_numeric: 4.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C3",
    criteria_name: "Storage",
    criteria_type: "benefit",
  },
  {
    id: 15,
    criteria_id: 3,
    description: "2 TB SSD atau lebih",
    value_numeric: 5.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C3",
    criteria_name: "Storage",
    criteria_type: "benefit",
  },
  // criteria_id: 4 -> C4: Battery (Benefit)
  {
    id: 16,
    criteria_id: 4,
    description: "<= 3500 mAh",
    value_numeric: 1.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C4",
    criteria_name: "Battery",
    criteria_type: "benefit",
  },
  {
    id: 17,
    criteria_id: 4,
    description: "3501 - 4500 mAh",
    value_numeric: 2.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C4",
    criteria_name: "Battery",
    criteria_type: "benefit",
  },
  {
    id: 18,
    criteria_id: 4,
    description: "4501 - 5500 mAh",
    value_numeric: 3.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C4",
    criteria_name: "Battery",
    criteria_type: "benefit",
  },
  {
    id: 19,
    criteria_id: 4,
    description: "5501 - 6500 mAh",
    value_numeric: 4.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C4",
    criteria_name: "Battery",
    criteria_type: "benefit",
  },
  {
    id: 20,
    criteria_id: 4,
    description: "> 6500 mAh",
    value_numeric: 5.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C4",
    criteria_name: "Battery",
    criteria_type: "benefit",
  },
  // criteria_id: 5 -> C5: Berat (Cost)
  {
    id: 21,
    criteria_id: 5,
    description: "<= 1.20 Kg",
    value_numeric: 5.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C5",
    criteria_name: "Berat",
    criteria_type: "cost",
  },
  {
    id: 22,
    criteria_id: 5,
    description: "1.21 - 1.50 Kg",
    value_numeric: 4.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C5",
    criteria_name: "Berat",
    criteria_type: "cost",
  },
  {
    id: 23,
    criteria_id: 5,
    description: "1.51 - 1.80 Kg",
    value_numeric: 3.0,
    created_at: "2026-06-30 07:10:47",
    criteria_code: "C5",
    criteria_name: "Berat",
    criteria_type: "cost",
  },
];


export default function SubCriteriaIndex() {
  const queryClient = useQueryClient();

  // Fetch Data Sub-Kriteria dari backend menggunakan React Query + subCriteriaService
  const {
    data: subCriteriasData,
    isLoading,
  } = useQuery<SubCriteria[]>({
    queryKey: ["subcriterias"],
    queryFn: async () => {
      try {
        return await subCriteriaService.getAll();
      } catch (err: any) {
        if (!err.response) {
          console.warn("Server backend offline, menggunakan data dummy cadangan untuk UI.");
          return initialSubCriterias;
        }
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const data = subCriteriasData || initialSubCriterias;

  // Filter berdasarkan Kriteria Utama
  const [selectedCriteriaFilter, setSelectedCriteriaFilter] = useState<string>("ALL");

  // State Modal Edit Sub-Kriteria
  const [editingItem, setEditingItem] = useState<SubCriteria | null>(null);
  const [editDescription, setEditDescription] = useState<string>("");
  const [editValueNumeric, setEditValueNumeric] = useState<number>(1);

  // 1. Filter Data Berdasarkan Dropdown Kriteria
  const filteredData = useMemo(() => {
    if (selectedCriteriaFilter === "ALL") {
      return data;
    }
    return data.filter((item) => (item.criteria_code || `ID:${item.criteria_id}`) === selectedCriteriaFilter);
  }, [data, selectedCriteriaFilter]);

  // Daftar kode & nama kriteria unik untuk dropdown filter
  const uniqueCriterias = useMemo(() => {
    const list: { code: string; name: string }[] = [];
    const seen = new Set<string>();
    data.forEach((item) => {
      const code = item.criteria_code || `ID:${item.criteria_id}`;
      if (!seen.has(code)) {
        seen.add(code);
        list.push({ code, name: item.criteria_name || `Criteria #${item.criteria_id}` });
      }
    });
    return list;
  }, [data]);

  // Buka Modal Update
  const handleOpenEdit = (item: SubCriteria) => {
    setEditingItem(item);
    setEditDescription(item.description);
    setEditValueNumeric(item.value_numeric);
  };

  // Mutasi Update Sub-Kriteria dari dalam Modal
  const updateMutation = useUpdate<SubCriteriaFormData>({
    mutationFn: (payload) => subCriteriaService.update(editingItem!.id, payload),
    queryKey: ["subcriterias"],
    successMessage: (variables) => `Konversi "${variables.description}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui konversi "${variables.description}": ${err?.response?.data?.message || err?.message || "Error"}`,
    onOfflineFallback: () => {
      queryClient.setQueryData<SubCriteria[]>(["subcriterias"], (old) =>
        old
          ? old.map((item) =>
              item.id === editingItem?.id
                ? {
                    ...item,
                    description: editDescription,
                    value_numeric: Number(editValueNumeric),
                  }
                : item
            )
          : []
      );
    },
  });

  // Simpan Perubahan Sub-Kriteria
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateMutation.mutate(
      {
        criteria_id: Number(editingItem.criteria_id),
        description: editDescription,
        value_numeric: Number(editValueNumeric),
      },
      {
        onSuccess: () => setEditingItem(null),
        onSettled: () => setEditingItem(null),
      }
    );
  };

  // Custom Hook Hapus Data (Delete dengan Modal Confirm)
  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting,
    deletingId,
  } = useDeleteSubCriteria();



  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pemetaan Rentang Nilai (Sub-Kriteria)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
              sub_criteria
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Konversi tulisan spesifikasi fisik (`description`) menjadi angka skala numerik (`value_numeric`) agar dapat diproses oleh mesin perhitungan matriks SPK.
          </p>
        </div>
        <div>
          <Link
            to="/admin/subcriterias/add"
            className="inline-flex items-center gap-2 bg-[#151216] dark:bg-white text-white dark:text-gray-900 hover:bg-[#262128] dark:hover:bg-gray-200 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Konversi Baru</span>
          </Link>
        </div>
      </div>

      {/* Banner Penjelasan Alur Konversi SPK */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-blue-900 dark:text-blue-300">
        <div className="flex items-start gap-3">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Mengapa Butuh Pemetaan Sub-Kriteria?</p>
            <p className="text-blue-800 dark:text-blue-300/90 leading-relaxed">
              Mesin komputer tidak dapat menghitung matematika dari teks spesifikasi mentah seperti <code className="bg-blue-100 dark:bg-blue-900/60 px-1 rounded font-mono">"16 GB"</code> atau <code className="bg-blue-100 dark:bg-blue-900/60 px-1 rounded font-mono">"Rp 8.000.000"</code>.<br />
              Melalui tabel ini, setiap <code className="font-mono">description</code> diberi <strong>Nilai Numerik (<code className="font-mono">value_numeric</code>)</strong> yang siap diproses ke matriks SAW.
            </p>
          </div>
        </div>
        
        {/* Dropdown Filter Kriteria */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#181519] px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-800 shadow-2xs shrink-0">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Filter Kriteria:</span>
          <select
            value={selectedCriteriaFilter}
            onChange={(e) => setSelectedCriteriaFilter(e.target.value)}
            className="bg-transparent font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">🌐 Semua Kriteria ({data.length})</option>
            {uniqueCriterias.map((crit) => (
              <option key={crit.code} value={crit.code}>
                [{crit.code}] {crit.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Sub-Kriteria (Modular) */}
      <TabelSubCriteriaIndex
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* MODAL UPDATE CONVERSION RULE */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        maxWidth="lg"
        badge={
          <span className="text-blue-600 dark:text-blue-400">
            Update Konversi (sub_criteria)
          </span>
        }
        title={
          editingItem
            ? `[${editingItem.criteria_code || `ID:${editingItem.criteria_id}`}] ${editingItem.criteria_name || `Criteria #${editingItem.criteria_id}`}`
            : ""
        }
        subtitle={
          editingItem ? `id: ${editingItem.id} | criteria_id: ${editingItem.criteria_id}` : undefined
        }
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            {/* 1. Deskripsi Spesifikasi / Rentang */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Deskripsi Spesifikasi (<code className="font-mono">description</code>)
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Tulisan rentang spesifikasi fisik atau harga yang dibaca oleh admin/konsumen.
              </p>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Misal: <= Rp 6.000.000, 8 GB, 512 GB SSD"
                className="w-full px-4 py-2.5 text-sm font-semibold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs font-mono"
                required
              />
            </div>

            {/* 2. Nilai Numerik Skala Matriks */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center gap-1.5">
                <span>Nilai Numerik (<code className="font-mono">value_numeric</code>)</span>
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Angka skala konversi yang akan dimasukkan ke dalam matriks keputusan SAW (Misal: 1.00 - 5.00).
              </p>
              <div className="relative mt-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editValueNumeric}
                  onChange={(e) => setEditValueNumeric(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-base font-mono font-bold bg-blue-50/50 dark:bg-[#181519] border border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs text-blue-700"
                  required
                />
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
                variant="info"
                icon={<Save className="w-4 h-4" />}
                label={updateMutation.isPending ? "Menyimpan..." : "Simpan Konversi"}
                disabled={updateMutation.isPending}
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
              />
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL CONFIRM DELETE */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Sub-Kriteria dari Sistem?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus data sub-kriteria{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              {deleteTarget?.name}
            </strong>{" "}
            (ID: #{deleteTarget?.id})? Data yang dihapus tidak dapat dikembalikan.
          </span>
        }
        confirmLabel="Ya, Hapus Sub-Kriteria"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
