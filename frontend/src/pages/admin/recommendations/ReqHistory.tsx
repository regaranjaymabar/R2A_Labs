import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TabelReqHistory } from "./components/TabelReqHistory";
import {
  Filter,
  Calculator,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useDeleteReqHistory } from "./hooks/useDeleteReqHistory";
import { useGet } from "../../../hooks/useGet";
import { recommendationService } from "../../../services/recommendationService";
import type { RecommendationRequest } from "../../../types/recomendation";




// 2. Data Dummy Awal (Termasuk studi kasus Andi Pratama sesuai contoh)
const initialHistory: RecommendationRequest[] = [
  {
    id: 1,
    user_name: "Andi Pratama",
    user_email: "andi.pratama@gmail.com",
    usage_purpose: "Coding & Web Development",
    budget_range: "Rp 6.000.000 - Rp 10.000.000",
    weights: {
      price: 40,
      ram: 30,
      processor: 20,
      storage: 10,
    },
    top_recommendation: {
      product_name: "Lenovo IdeaPad Slim 3",
      saw_score: 0.895,
      rank: 1,
    },
    user_choice: "Lenovo IdeaPad Slim 3",
    status: "CHOSEN",
    created_at: "2026-07-02 14:30:25",
  },
  {
    id: 2,
    user_name: "Siti Rahmawati",
    user_email: "siti.rahma@yahoo.com",
    usage_purpose: "Desain Grafis & Video Editing 4K",
    budget_range: "> Rp 15.000.000",
    weights: {
      ram: 35,
      processor: 35,
      storage: 20,
      price: 10,
    },
    top_recommendation: {
      product_name: "MacBook Air M2 16GB",
      saw_score: 0.942,
      rank: 1,
    },
    user_choice: "MacBook Air M2 16GB",
    status: "CHOSEN",
    created_at: "2026-07-02 11:15:10",
  },
  {
    id: 3,
    user_name: "Budi Santoso",
    user_email: "budi.gamer@outlook.com",
    usage_purpose: "Gaming Esports & Streaming",
    budget_range: "Rp 10.000.000 - Rp 15.000.000",
    weights: {
      processor: 40,
      ram: 30,
      price: 20,
      storage: 10,
    },
    top_recommendation: {
      product_name: "Lenovo Legion 5 Pro",
      saw_score: 0.91,
      rank: 1,
    },
    user_choice: "ASUS TUF Gaming A15",
    status: "CHOSEN",
    created_at: "2026-07-01 19:45:00",
  },
  {
    id: 4,
    user_name: "Rina Maharani",
    user_email: "rina.m@ui.ac.id",
    usage_purpose: "Tugas Kuliah & Administrasi Perkantoran",
    budget_range: "< Rp 7.000.000",
    weights: {
      price: 50,
      storage: 20,
      ram: 20,
      processor: 10,
    },
    top_recommendation: {
      product_name: "ASUS Vivobook 14 X1404",
      saw_score: 0.88,
      rank: 1,
    },
    user_choice: undefined,
    status: "COMPLETED",
    created_at: "2026-07-01 09:20:15",
  },
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

  // Custom Hook Hapus Riwayat (Delete dengan Modal Confirm)
  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    deletingId,
  } = useDeleteReqHistory();

  // Filter berdasarkan status
  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  // Definisi Kolom Tabel


  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span>Riwayat Rekomendasi</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pantau preferensi nyata yang dicari oleh user biasa. Lihat bagaimana geseran bobot slider memengaruhi rekomendasi sistem SAW dan pilihan keputusan mereka.
          </p>
        </div>
      </div>


      {/* Bar Filter & Statistik Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-[#181519] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-black" />
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Filter Status Pilihan:</span>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === "ALL"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                }`}
            >
              Semua ({data.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("CHOSEN")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === "CHOSEN"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                }`}
            >
              Dipilih User ({data.filter((d) => d.status === "CHOSEN").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === "COMPLETED"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                }`}
            >
              Hanya Dilihat ({data.filter((d) => d.status === "COMPLETED").length})
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
          Total Aktivitas: <strong className="text-gray-900 dark:text-white font-bold">{data.length} pencarian</strong>
        </div>
      </div>

      {/* Tabel Riwayat Rekomendasi */}
      <TabelReqHistory
        data={filteredData}
        isLoading={isLoading}
        onSelectDetail={setSelectedDetail}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* MODAL DETAIL ANALISIS SPK */}
      <Modal
        isOpen={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        maxWidth="xl"
        badge={
          <span className="text-black dark:text-purple-400 flex items-center gap-1.5">
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
            {/* Kebutuhan & Budget */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Kebutuhan Penggunaan:</span>
                <span>Rentang Budget:</span>
              </div>
              <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                <span className="text-black dark:text-purple-400">{selectedDetail.usage_purpose}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedDetail.budget_range}</span>
              </div>
            </div>

            {/* Rincian Bobot yang Digeser */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase tracking-wider">
                Penggeseran Slider Bobot Kriteria (%):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-center">
                  <span className="text-[11px] font-bold text-black block">RAM</span>
                  <span className="text-lg font-extrabold text-purple-900 dark:text-purple-200 font-mono">{selectedDetail.weights.ram}%</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-center">
                  <span className="text-[11px] font-bold text-amber-600 block">HARGA</span>
                  <span className="text-lg font-extrabold text-amber-900 dark:text-amber-200 font-mono">{selectedDetail.weights.price}%</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-center">
                  <span className="text-[11px] font-bold text-blue-600 block">CPU</span>
                  <span className="text-lg font-extrabold text-blue-900 dark:text-blue-200 font-mono">{selectedDetail.weights.processor || 20}%</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center">
                  <span className="text-[11px] font-bold text-emerald-600 block">STORAGE</span>
                  <span className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200 font-mono">{selectedDetail.weights.storage || 10}%</span>
                </div>
              </div>
            </div>

            {/* Hasil Rekomendasi & Keputusan User */}
            <div className="p-4 rounded-2xl bg-purple-900/10 dark:bg-purple-950/30 border-2 border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                  <span>Rekomendasi Peringkat #1 Sistem SAW:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-600 text-white">
                  Skor: {selectedDetail.top_recommendation.saw_score}
                </span>
              </div>
              <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                {selectedDetail.top_recommendation.product_name}
              </div>

              <div className="pt-3 border-t border-purple-200 dark:border-purple-800/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Keputusan Akhir User:</span>
                {selectedDetail.user_choice ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Memilih "{selectedDetail.user_choice}"
                  </span>
                ) : (
                  <span className="text-gray-500 italic">Belum memilih / Hanya memonitor</span>
                )}
              </div>
            </div>

            {/* Tombol ke halaman ResultDetail (Bedah Matriks SAW) */}
            <div className="pt-2 flex justify-end">
              <Link
                to={`/admin/recommendations/${selectedDetail.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Lihat Bedah Matriks Normalisasi SAW (Top 3)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL KONFIRMASI HAPUS RIWAYAT */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Riwayat Pencarian SPK?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus riwayat pencarian SPK dari user <strong className="font-bold text-gray-900 dark:text-white">{deleteTarget?.name}</strong>? Data analisis dan hasil rekomendasi terkait akan ikut terhapus.
          </span>
        }
        confirmLabel="Ya, Hapus Riwayat"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}
