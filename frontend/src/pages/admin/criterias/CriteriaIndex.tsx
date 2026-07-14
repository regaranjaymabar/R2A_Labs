import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";
import { TabelCriteriaIndex } from "./components/TabelCriteriaIndex";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import EditCriteria from "./EditCriteria";
import { useDeleteCriteria } from "./hooks/useDeleteCriteria";
import { useGet } from "../../../hooks/useGet";
import { criteriaService } from "../../../services/criteriaService";
import type { Criteria } from "../../../types/criteria";
export type { Criteria };


export const initialCriterias: Criteria[] = [
  { id: 1, code: "C1", name: "Harga", type: "cost" },
  { id: 2, code: "C2", name: "RAM", type: "benefit" },
  { id: 3, code: "C3", name: "Storage", type: "benefit" },
  { id: 4, code: "C4", name: "Battery", type: "benefit" },
  { id: 5, code: "C5", name: "Berat", type: "cost" },
  { id: 6, code: "C6", name: "Processor", type: "benefit" },
  { id: 7, code: "C7", name: "Ukuran Layar", type: "benefit" },
  { id: 8, code: "C8", name: "Tahun Rilis", type: "benefit" },
];


export default function CriteriaIndex() {

  const { 
    data: fetchedData, 
    isLoading, 
    refetch 
  } = useGet<Criteria[]>({
    queryKey: ["criterias"],
    queryFn: criteriaService.getAll,
    offlineFallbackData: initialCriterias,
  });

  const data = fetchedData || initialCriterias;
  const isDummyData = !isLoading && (fetchedData === initialCriterias || !fetchedData);

  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    deletingId,
  } = useDeleteCriteria();

  const [editingItem, setEditingItem] = useState<Criteria | null>(null);

  const handleOpenEdit = (item: Criteria) => {
    setEditingItem(item);
  };

  return (
    <div className="space-y-6 pb-12">
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

      {isDummyData && (
        <div className="bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Mode Demo / Offline</h4>
            <p className="text-xs mt-0.5 text-amber-700 dark:text-amber-400">
              Gagal terhubung ke API backend. Data sub-kriteria yang ditampilkan di bawah ini adalah <strong>data dummy lokal</strong> untuk keperluan demonstrasi UI.
            </p>
          </div>
        </div>
      )}

      <TabelCriteriaIndex
        data={data}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />


      <EditCriteria
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={refetch}
      />

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