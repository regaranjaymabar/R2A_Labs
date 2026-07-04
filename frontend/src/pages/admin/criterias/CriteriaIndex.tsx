import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Sliders,
  Save,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../components/ui/common/DataTable";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useDeleteCriteria } from "./hooks/useDeleteCriteria";
import { useGet } from "../../../hooks/useGet";
import { criteriaService } from "../../../services/criteriaService";
import { useQueryClient } from "@tanstack/react-query";

// 1. Definisi Interface Dimensi Penilaian (Criteria)
// Sesuai persis 4 kolom di database MySQL kamu: id, code, name, type
export interface Criteria {
  id: number;
  code: string; // Misal: C1, C2
  name: string; // Misal: Harga, RAM, Storage
  type: "benefit" | "cost" | string; // benefit atau cost
}

// 2. Data Dummy Awal (Persis 8 baris data dari screenshot database phpMyAdmin kamu)
const initialCriterias: Criteria[] = [
  {
    id: 1,
    code: "C1",
    name: "Harga",
    type: "cost",
  },
  {
    id: 2,
    code: "C2",
    name: "RAM",
    type: "benefit",
  },
  {
    id: 3,
    code: "C3",
    name: "Storage",
    type: "benefit",
  },
  {
    id: 4,
    code: "C4",
    name: "Battery",
    type: "benefit",
  },
  {
    id: 5,
    code: "C5",
    name: "Berat",
    type: "cost",
  },
  {
    id: 6,
    code: "C6",
    name: "Processor",
    type: "benefit",
  },
  {
    id: 7,
    code: "C7",
    name: "Ukuran Layar",
    type: "benefit",
  },
  {
    id: 8,
    code: "C8",
    name: "Tahun Rilis",
    type: "benefit",
  },
];

const columnHelper = createColumnHelper<Criteria>();

export default function CriteriaIndex() {
  const queryClient = useQueryClient();

  // Fetch data kriteria dari backend via useGet (React Query + offline fallback)
  const { data: fetchedData, isLoading } = useGet<Criteria[]>({
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

  // Buka Modal Update
  const handleOpenEdit = (item: Criteria) => {
    setEditingItem(item);
    setEditCode(item.code);
    setEditName(item.name);
    setEditType((item.type.toLowerCase() === "cost" ? "cost" : "benefit") as "benefit" | "cost");
  };

  // Simpan Perubahan
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    queryClient.setQueryData<Criteria[]>(["criterias"], (prev) =>
      (prev || []).map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              code: editCode.toUpperCase(),
              name: editName,
              type: editType,
            }
          : item
      )
    );
    setEditingItem(null);
  };

  // 3. Definisi Kolom Tabel
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">No</span>,
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
            #{info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.accessor("code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode" />,
        cell: (info) => (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-mono font-bold text-blaxk">
            {info.getValue()}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Dimensi Penilaian" />,
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-white text-base">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("type", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe Atribut (SAW)" />,
        cell: (info) => {
          const val = info.getValue();
          const typeStr = String(val).toLowerCase();

          // STRUKTUR ELSE IF MURNI SESUAI INSTRUKSI UNTUK BADGE WARNA:
          if (typeStr === "benefit") {
            // Badge Hijau: Semakin besar nilainya semakin bagus (contoh: RAM, Storage)
            return (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                benefit
              </span>
            );
          } else if (typeStr === "cost") {
            // Badge Merah: Semakin kecil nilainya semakin bagus (contoh: Harga, Berat)
            return (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800/60 shadow-2xs">
                cost
              </span>
            );
          }
          return null;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold">Aksi</span>,
        cell: (info) => {
          const item = info.row.original;
          const isDeleting = deletingId === item.id;
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-800/60 transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-50"
                title="Edit Kriteria"
              >
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.code, item.name)}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Hapus Kriteria"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dimensi Penilaian (Kriteria SPK)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono">
              criteria
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola kode dimensi (`code`), nama (`name`), dan tipe atribut (`benefit` / `cost`) untuk perhitungan matematis algoritma Simple Additive Weighting (SAW).
          </p>
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

      {/* Banner Penjelasan Algoritma SAW */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-300">
        <div className="flex items-start gap-3">
          <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Panduan Tipe Atribut Algoritma SAW:</p>
            <p className="text-purple-800 dark:text-purple-300/90 leading-relaxed">
              • <strong className="text-emerald-700 dark:text-emerald-400">benefit</strong>: Semakin besar nilai spek laptop, maka semakin bagus skornya (Contoh: RAM, Storage, Battery, Processor).<br />
              • <strong className="text-red-700 dark:text-red-400">cost</strong>: Semakin kecil nilainya, justru semakin bagus skor preferensinya (Contoh: Harga, Berat).
            </p>
          </div>
        </div>
        <div className="shrink-0 bg-white dark:bg-purple-900/50 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 font-mono text-center">
          <span className="block text-[10px] text-gray-500 uppercase font-sans">Total Dimensi</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-300">{data.length} Kriteria</span>
        </div>
      </div>

      {/* Tabel Kriteria */}
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Cari kode kriteria (misal: C1, C2) atau nama (misal: Harga, RAM)..."
        emptyMessage={isLoading ? "Sedang memuat dimensi penilaian..." : "Tidak ada dimensi penilaian yang ditemukan"}
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
                icon={<Save className="w-4 h-4" />}
                label="Simpan Kriteria"
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
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
