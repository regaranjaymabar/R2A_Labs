import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TabelReqHistory } from "./components/TabelReqHistory";
import {
  Calculator,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useDeleteReqHistory } from "./hooks/useDeleteReqHistory";
import { useGet } from "../../../hooks/useGet";
import { recommendationService } from "../../../services/recommendationService";
import type { RecommendationRequest } from "../../../types/recomendation";

const initialHistory: RecommendationRequest[] = [
  
];

export default function ReqHistory() {
  const { data: fetchedData, isLoading } = useGet<RecommendationRequest[]>({
    queryKey: ["recommendations"],
    queryFn: recommendationService.getAll,
    offlineFallbackData: initialHistory,
  });

  const data = fetchedData || initialHistory;

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedDetail, setSelectedDetail] = useState<RecommendationRequest | null>(null);

  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    deletingId,
  } = useDeleteReqHistory();

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Riwayat Rekomendasi</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-1 font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
          </span>
          {(["ALL", "CALCULATED", "COMPLETED", "PENDING"] as const).map((status) => {
            const labels = {
              ALL: "Semua",
              CALCULATED: "Dihitung",
              COMPLETED: "Selesai",
              PENDING: "Tertunda",
            };
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-gray-500">
          Total Aktivitas: <strong className="text-gray-900 font-bold">{data.length} pencarian</strong>
        </div>
      </div>

      <TabelReqHistory
        data={filteredData}
        isLoading={isLoading}
        onSelectDetail={setSelectedDetail}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <Modal
        isOpen={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        maxWidth="xl"
        badge={
          <span className="text-black flex items-center gap-1.5">
            <span>Analisis Preferensi User SPK</span>
          </span>
        }
        title={selectedDetail ? `Pencarian dari: ${selectedDetail.user_name}` : ""}
        subtitle={
          selectedDetail ? (
            <span className="flex items-center gap-2">
              <span>Waktu: {selectedDetail.created_at}</span>
            </span>
          ) : undefined
        }
        footer={
          <Button
            type="button"
            variant="primary"
            onClick={() => setSelectedDetail(null)}
            label="Tutup Analisis"
            className="text-xs! py-2! px-5! rounded-xl! cursor-pointer"
          />
        }
      >
        {selectedDetail && (
          <div className="space-y-5 text-sm">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Kebutuhan Penggunaan:</span>
                <span>Rentang Budget:</span>
              </div>
              <div className="flex items-center justify-between font-bold text-gray-900">
                <span className="text-black">{selectedDetail.usage_purpose}</span>
                <span className="text-emerald-600 font-mono">{selectedDetail.budget_range}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700  block uppercase tracking-wider">
                Penggeseran Slider Bobot Kriteria (%):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-center">
                  <span className="text-[11px] font-bold text-black block">RAM</span>
                  <span className="text-lg font-extrabold text-gray-900 font-mono">{selectedDetail.weights?.ram ?? 0}%</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[11px] font-bold text-amber-600 block">HARGA</span>
                  <span className="text-lg font-extrabold text-amber-900 font-mono">{selectedDetail.weights?.price ?? 0}%</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[11px] font-bold text-blue-600 block">CPU</span>
                  <span className="text-lg font-extrabold text-blue-900 font-mono">{selectedDetail.weights?.processor || 20}%</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[11px] font-bold text-emerald-600 block">STORAGE</span>
                  <span className="text-lg font-extrabold text-emerald-900 font-mono">{selectedDetail.weights?.storage || 10}%</span>
                </div>
              </div>
            </div>

            {/* Hasil Rekomendasi & Keputusan User */}
            <div className="p-4 rounded-2xl bg-gray-100/80 border-2 border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <span>Rekomendasi Peringkat #1 Sistem SAW:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gray-800 text-white">
                  Skor: {selectedDetail.top_recommendation?.saw_score ?? "-"}
                </span>
              </div>
              <div className="text-lg font-extrabold text-gray-900">
                {selectedDetail.top_recommendation?.product_name ?? "-"}
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600">Keputusan Akhir User:</span>
                {selectedDetail.user_choice ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Memilih "{selectedDetail.user_choice}"
                  </span>
                ) : (
                  <span className="text-gray-500 italic">Belum memilih / Hanya memonitor</span>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                to={`/admin/recommendations/${selectedDetail.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Lihat Bedah Matriks Normalisasi SAW (Top 3)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </Modal>

      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Riwayat Pencarian SPK?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus riwayat pencarian SPK dari user <strong className="font-bold text-gray-900">{deleteTarget?.name}</strong>? Data analisis dan hasil rekomendasi terkait akan ikut terhapus.
          </span>
        }
        confirmLabel="Ya, Hapus Riwayat"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}