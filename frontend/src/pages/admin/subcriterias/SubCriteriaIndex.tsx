import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Filter,
} from "lucide-react";
import { TabelSubCriteriaIndex } from "./components/TabelSubCriteriaIndex";
import { useQuery } from "@tanstack/react-query";
import { subCriteriaService } from "../../../services/subCriteriaService";
import { useDeleteSubCriteria } from "./hooks/useDeleteSubCriteria";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import EditSubCriteria from "./EditSubCriteria";

import type { SubCriteria } from "../../../types/subCriteria";

// Re-export type SubCriteria agar import di komponen lain tetap aman dan terpusat
export type { SubCriteria };

// 2. Data Dummy Awal (Persis sesuai data di screenshot phpMyAdmin kamu)
export const initialSubCriterias: SubCriteria[] = [
  // C1: Harga (cost)
  { id: 1, description: "< Rp 6.000.000", criteria_id: 1, criteriaId: 1, value_numeric: 5, valueNumeric: 5, criteria_code: "C1", criteria_name: "Harga", criteria_type: "cost" },
  { id: 2, description: "Rp 6.000.000 - Rp 9.999.999", criteria_id: 1, criteriaId: 1, value_numeric: 4, valueNumeric: 4, criteria_code: "C1", criteria_name: "Harga", criteria_type: "cost" },
  { id: 3, description: "Rp 10.000.000 - Rp 14.999.999", criteria_id: 1, criteriaId: 1, value_numeric: 3, valueNumeric: 3, criteria_code: "C1", criteria_name: "Harga", criteria_type: "cost" },
  { id: 4, description: "Rp 15.000.000 - Rp 19.999.999", criteria_id: 1, criteriaId: 1, value_numeric: 2, valueNumeric: 2, criteria_code: "C1", criteria_name: "Harga", criteria_type: "cost" },
  { id: 5, description: ">= Rp 20.000.000", criteria_id: 1, criteriaId: 1, value_numeric: 1, valueNumeric: 1, criteria_code: "C1", criteria_name: "Harga", criteria_type: "cost" },

  // C2: RAM (benefit)
  { id: 6, description: "4 GB", criteria_id: 2, criteriaId: 2, value_numeric: 1, valueNumeric: 1, criteria_code: "C2", criteria_name: "RAM", criteria_type: "benefit" },
  { id: 7, description: "8 GB", criteria_id: 2, criteriaId: 2, value_numeric: 2, valueNumeric: 2, criteria_code: "C2", criteria_name: "RAM", criteria_type: "benefit" },
  { id: 8, description: "16 GB", criteria_id: 2, criteriaId: 2, value_numeric: 3, valueNumeric: 3, criteria_code: "C2", criteria_name: "RAM", criteria_type: "benefit" },
  { id: 9, description: "32 GB", criteria_id: 2, criteriaId: 2, value_numeric: 4, valueNumeric: 4, criteria_code: "C2", criteria_name: "RAM", criteria_type: "benefit" },
  { id: 10, description: "64 GB", criteria_id: 2, criteriaId: 2, value_numeric: 5, valueNumeric: 5, criteria_code: "C2", criteria_name: "RAM", criteria_type: "benefit" },

  // C3: Storage (benefit)
  { id: 11, description: "256 GB SSD", criteria_id: 3, criteriaId: 3, value_numeric: 1, valueNumeric: 1, criteria_code: "C3", criteria_name: "Storage", criteria_type: "benefit" },
  { id: 12, description: "512 GB SSD", criteria_id: 3, criteriaId: 3, value_numeric: 2, valueNumeric: 2, criteria_code: "C3", criteria_name: "Storage", criteria_type: "benefit" },
  { id: 13, description: "1 TB SSD", criteria_id: 3, criteriaId: 3, value_numeric: 3, valueNumeric: 3, criteria_code: "C3", criteria_name: "Storage", criteria_type: "benefit" },
  { id: 14, description: "2 TB SSD", criteria_id: 3, criteriaId: 3, value_numeric: 4, valueNumeric: 4, criteria_code: "C3", criteria_name: "Storage", criteria_type: "benefit" },

  // C4: Battery (benefit)
  { id: 15, description: "< 30 Wh", criteria_id: 4, criteriaId: 4, value_numeric: 1, valueNumeric: 1, criteria_code: "C4", criteria_name: "Battery", criteria_type: "benefit" },
  { id: 16, description: "30 - 44 Wh", criteria_id: 4, criteriaId: 4, value_numeric: 1.5, valueNumeric: 1.5, criteria_code: "C4", criteria_name: "Battery", criteria_type: "benefit" },
  { id: 17, description: "45 - 59 Wh", criteria_id: 4, criteriaId: 4, value_numeric: 2, valueNumeric: 2, criteria_code: "C4", criteria_name: "Battery", criteria_type: "benefit" },
  { id: 18, description: "60 - 75 Wh", criteria_id: 4, criteriaId: 4, value_numeric: 3, valueNumeric: 3, criteria_code: "C4", criteria_name: "Battery", criteria_type: "benefit" },
  { id: 19, description: "76 - 90 Wh", criteria_id: 4, criteriaId: 4, value_numeric: 4, valueNumeric: 4, criteria_code: "C4", criteria_name: "Battery", criteria_type: "benefit" },
  { id: 20, description: "> 90 Wh", criteria_id: 4, criteriaId: 4, value_numeric: 5, valueNumeric: 5, criteria_code: "C4", criteria_name: "Battery", criteria_type: "benefit" },

  // C5: Berat (cost)
  { id: 21, description: "< 1.2 kg", criteria_id: 5, criteriaId: 5, value_numeric: 5, valueNumeric: 5, criteria_code: "C5", criteria_name: "Berat", criteria_type: "cost" },
  { id: 22, description: "1.2 - 1.49 kg", criteria_id: 5, criteriaId: 5, value_numeric: 4, valueNumeric: 4, criteria_code: "C5", criteria_name: "Berat", criteria_type: "cost" },
  { id: 23, description: "1.5 - 1.99 kg", criteria_id: 5, criteriaId: 5, value_numeric: 3, valueNumeric: 3, criteria_code: "C5", criteria_name: "Berat", criteria_type: "cost" },
  { id: 24, description: "2.0 - 2.49 kg", criteria_id: 5, criteriaId: 5, value_numeric: 2, valueNumeric: 2, criteria_code: "C5", criteria_name: "Berat", criteria_type: "cost" },
  { id: 25, description: ">= 2.5 kg", criteria_id: 5, criteriaId: 5, value_numeric: 1, valueNumeric: 1, criteria_code: "C5", criteria_name: "Berat", criteria_type: "cost" },

  // C6: Processor (benefit)
  { id: 26, description: "Celeron / Pentium / Athlon", criteria_id: 6, criteriaId: 6, value_numeric: 1, valueNumeric: 1, criteria_code: "C6", criteria_name: "Processor", criteria_type: "benefit" },
  { id: 27, description: "Core i3 / Ryzen 3", criteria_id: 6, criteriaId: 6, value_numeric: 2, valueNumeric: 2, criteria_code: "C6", criteria_name: "Processor", criteria_type: "benefit" },
  { id: 28, description: "Core i5 / Ryzen 5", criteria_id: 6, criteriaId: 6, value_numeric: 3, valueNumeric: 3, criteria_code: "C6", criteria_name: "Processor", criteria_type: "benefit" },
  { id: 29, description: "Core i7 / Ryzen 7", criteria_id: 6, criteriaId: 6, value_numeric: 4, valueNumeric: 4, criteria_code: "C6", criteria_name: "Processor", criteria_type: "benefit" },
  { id: 30, description: "Core i9 / Ryzen 9", criteria_id: 6, criteriaId: 6, value_numeric: 5, valueNumeric: 5, criteria_code: "C6", criteria_name: "Processor", criteria_type: "benefit" },

  // C7: Ukuran Layar (benefit)
  { id: 31, description: "< 13 Inch", criteria_id: 7, criteriaId: 7, value_numeric: 1, valueNumeric: 1, criteria_code: "C7", criteria_name: "Ukuran Layar", criteria_type: "benefit" },
  { id: 32, description: "13 - 13.99 Inch", criteria_id: 7, criteriaId: 7, value_numeric: 2, valueNumeric: 2, criteria_code: "C7", criteria_name: "Ukuran Layar", criteria_type: "benefit" },
  { id: 33, description: "14 - 14.99 Inch", criteria_id: 7, criteriaId: 7, value_numeric: 3, valueNumeric: 3, criteria_code: "C7", criteria_name: "Ukuran Layar", criteria_type: "benefit" },
  { id: 34, description: "15 - 15.99 Inch", criteria_id: 7, criteriaId: 7, value_numeric: 4, valueNumeric: 4, criteria_code: "C7", criteria_name: "Ukuran Layar", criteria_type: "benefit" },
  { id: 35, description: ">= 16 Inch", criteria_id: 7, criteriaId: 7, value_numeric: 5, valueNumeric: 5, criteria_code: "C7", criteria_name: "Ukuran Layar", criteria_type: "benefit" },

  // C8: Tahun Rilis (benefit)
  { id: 36, description: "< 2021", criteria_id: 8, criteriaId: 8, value_numeric: 1, valueNumeric: 1, criteria_code: "C8", criteria_name: "Tahun Rilis", criteria_type: "benefit" },
  { id: 37, description: "2021", criteria_id: 8, criteriaId: 8, value_numeric: 2, valueNumeric: 2, criteria_code: "C8", criteria_name: "Tahun Rilis", criteria_type: "benefit" },
  { id: 38, description: "2022", criteria_id: 8, criteriaId: 8, value_numeric: 3, valueNumeric: 3, criteria_code: "C8", criteria_name: "Tahun Rilis", criteria_type: "benefit" },
  { id: 39, description: "2023", criteria_id: 8, criteriaId: 8, value_numeric: 4, valueNumeric: 4, criteria_code: "C8", criteria_name: "Tahun Rilis", criteria_type: "benefit" },
  { id: 40, description: ">= 2024", criteria_id: 8, criteriaId: 8, value_numeric: 5, valueNumeric: 5, criteria_code: "C8", criteria_name: "Tahun Rilis", criteria_type: "benefit" },
];


export default function SubCriteriaIndex() {

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
              Pemetaan Rentang Nilai 
            </h1>
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
      <EditSubCriteria
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        item={editingItem}
      />

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