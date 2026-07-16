import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Filter,
  AlertCircle,
} from "lucide-react";
import { TabelSubCriteriaIndex } from "./components/TabelSubCriteriaIndex";
import { useQuery } from "@tanstack/react-query";
import { subCriteriaService } from "../../../services/subCriteriaService";
import { useDeleteSubCriteria } from "./hooks/useDeleteSubCriteria";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import EditSubCriteria from "./EditSubCriteria";

import type { SubCriteria } from "../../../types/subCriteria";

export type { SubCriteria };

export const initialSubCriterias: SubCriteria[] = [
  
];

export default function SubCriteriaIndex() {
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
  const isDummyData = !isLoading && (subCriteriasData === initialSubCriterias || !subCriteriasData);

  const [selectedCriteriaFilter, setSelectedCriteriaFilter] = useState<string>("ALL");
  const [editingItem, setEditingItem] = useState<SubCriteria | null>(null);

  const filteredData = useMemo(() => {
    if (selectedCriteriaFilter === "ALL") {
      return data;
    }
    return data.filter((item) => (item.criteria_code || `ID:${item.criteria_id}`) === selectedCriteriaFilter);
  }, [data, selectedCriteriaFilter]);

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

  const handleOpenEdit = (item: SubCriteria) => {
    setEditingItem(item);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Pemetaan Rentang Nilai 
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Konversi tulisan spesifikasi fisik (`description`) menjadi angka skala numerik (`value_numeric`) agar dapat diproses oleh mesin perhitungan matriks SPK.
          </p>
        </div>
        <div>
          <Link
            to="/admin/subcriterias/add"
            className="inline-flex items-center gap-2 bg-[#151216] text-white hover:bg-[#262128] font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Konversi Baru</span>
          </Link>
        </div>
      </div>

      {isDummyData && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Mode Demo / Offline</h4>
            <p className="text-xs mt-0.5 text-amber-700">
              Gagal terhubung ke API backend. Data sub-kriteria yang ditampilkan di bawah ini adalah <strong>data dummy lokal</strong> untuk keperluan demonstrasi UI.
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-blue-900">
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-2xs shrink-0">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-gray-700">Filter Kriteria:</span>
          <select
            value={selectedCriteriaFilter}
            onChange={(e) => setSelectedCriteriaFilter(e.target.value)}
            className="bg-transparent font-bold text-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Kriteria ({data.length})</option>
            {uniqueCriterias.map((crit) => (
              <option key={crit.code} value={crit.code}>
                [{crit.code}] {crit.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TabelSubCriteriaIndex
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <EditSubCriteria
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        item={editingItem}
      />

      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Sub-Kriteria dari Sistem?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus data sub-kriteria{" "}
            <strong className="text-gray-900 font-semibold">
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