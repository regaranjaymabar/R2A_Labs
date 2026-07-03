import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Trash2, Loader2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { ProductCriteria } from "../ProductWeightIndex";

export interface TabelProductWeightIndexProps {
  data: ProductCriteria[];
  isLoading?: boolean;
  onEdit: (item: ProductCriteria) => void;
  onDelete: (id: number, prodName: string, critName: string) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<ProductCriteria>();

export function TabelProductWeightIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TabelProductWeightIndexProps) {
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
      columnHelper.accessor("product_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Laptop (product_id)" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div>
                <span className="font-bold text-gray-900 dark:text-white text-base block">
                  {info.getValue() || `Product #${item.product_id}`}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  product_id: {item.product_id}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("criteria_code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dimensi Kriteria" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold dark:bg-purple-950/60 text-black dark:text-purple-200">
                {info.getValue() || `C${item.criteria_id}`}
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                {item.criteria_name || `Criteria #${item.criteria_id}`}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("sub_criteria_description", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pilihan Spesifikasi (sub_criteria)" />,
        cell: (info) => (
          <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3.5 py-1.5 rounded-xl border border-purple-100 dark:border-purple-800/60 w-fit shadow-2xs">
            <span>{info.getValue() || "Belum dipilih"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("value_numeric", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Skala Numerik (Matriks)" />,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-base bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
              {Number(info.getValue()).toFixed(2)}
            </span>
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
                title="Pilih Spek dari Dropdown Sub-Kriteria"
              >
                <span>Pilih Spek</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id, item.product_name || "Laptop", item.criteria_name || "Kriteria")}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Hapus Bobot Produk"
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
      searchPlaceholder="Cari nama laptop (misal: ASUS, Legion) atau spesifikasi (misal: 8 GB, SSD)..."
      emptyMessage={isLoading ? "Sedang memuat data pembobotan produk..." : "Tidak ada data pembobotan produk yang ditemukan"}
    />
  );
}

export { TabelProductWeightIndex as TableProductWeightIndex };
