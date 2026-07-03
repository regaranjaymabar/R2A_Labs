import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRight, Hash, Trash2, Loader2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { SubCriteria } from "../SubCriteriaIndex";

export interface TabelSubCriteriaIndexProps {
  data: SubCriteria[];
  isLoading?: boolean;
  onEdit: (item: SubCriteria) => void;
  onDelete: (id: number, desc: string, criteriaCode?: string) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<SubCriteria>();

export function TabelSubCriteriaIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TabelSubCriteriaIndexProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">ID</span>,
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
            #{info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.accessor("criteria_id", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kriteria (criteria_id)" />,
        cell: (info) => {
          const item = info.row.original;
          const code = item.criteria_code || `C${item.criteria_id}`;
          const isBenefit = String(item.criteria_type).toLowerCase() === "benefit";
          return (
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold dark:bg-purple-950/60 text-black dark:text-purple-200">
                {code}
              </span>
              <div>
                <span className="font-bold text-gray-900 dark:text-white text-sm block">
                  {item.criteria_name || `Criteria ID #${item.criteria_id}`}
                </span>
                <span className={`text-[11px] font-mono font-bold ${isBenefit ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  criteria_id: {item.criteria_id} ({item.criteria_type || "attr"})
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi Spesifikasi / Rentang" />,
        cell: (info) => (
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 text-base">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("value_numeric", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nilai Numerik (value_numeric)" />,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-base bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
              <Hash className="w-3.5 h-3.5 text-blue-500" />
              {Number(info.getValue()).toFixed(2)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dibuat Pada" />,
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span>{info.getValue() || "-"}</span>
          </div>
        ),
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
                onClick={() => onEdit(item)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-800/60 transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-50"
                title="Edit Konversi Skala"
              >
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id, item.description, item.criteria_code)}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Hapus Sub-Kriteria"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        },
      }),
    ],
    [deletingId, onDelete, onEdit]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Cari deskripsi (misal: 8 GB, Rp 6.000.000) atau kode kriteria (misal: C1, C2)..."
      emptyMessage={isLoading ? "Sedang memuat data sub-kriteria..." : "Tidak ada aturan konversi sub-kriteria yang ditemukan"}
    />
  );
}

export { TabelSubCriteriaIndex as TableSubCriteriaIndex };
