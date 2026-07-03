import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Ban,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { ProductStore } from "../ProductStoreIndex";

export interface TableProductStoreIndexProps {
  data: ProductStore[];
  isLoading?: boolean;
  onEdit: (item: ProductStore) => void;
  onDelete: (id: number, productName: string, storeName?: string) => void;
  deletingId?: number | null;
}

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const columnHelper = createColumnHelper<ProductStore>();

export function TableProductStoreIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TableProductStoreIndexProps) {
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
      columnHelper.accessor("store_id", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cabang Toko" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm block">
                  {item.store_name || `Store ID #${item.store_id}`}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">store_id: {item.store_id}</span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("product_id", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Model Laptop" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-base">
                {item.product_name || `Product ID #${item.product_id}`}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.brand_name && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {item.brand_name}
                  </span>
                )}
                <span className="text-[11px] text-gray-500 font-mono">product_id: {item.product_id}</span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("price", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Jual" />,
        cell: (info) => (
          <span className="font-mono font-bold text-gray-900 dark:text-emerald-400 text-base">
            {formatIDR(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("stock", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stok Fisik" />,
        cell: (info) => (
          <span className="font-mono font-bold text-base px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {info.getValue()} <span className="text-xs font-normal text-gray-500">unit</span>
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: () => <span className="font-semibold">Status Operasional</span>,
        cell: (info) => {
          const item = info.row.original;
          const isAvail = item.is_available === 1 || item.is_available === true;
          const stockCount = item.stock;

          // LOGIKA TEGAS SESUAI ALUR KERJA OPERASIONAL:
          if (isAvail === false) {
            // 1. Dinonaktifkan secara manual / Discontinued
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-700 shadow-2xs">
                <Ban className="w-3.5 h-3.5 text-gray-500" />
                Non-Aktif (Discontinued)
              </span>
            );
          } else if (stockCount <= 0) {
            // 2. Peringatan merah bahwa barang kosong
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800/80 shadow-2xs animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                Stok Kosong (Habis!)
              </span>
            );
          } else if (stockCount > 0) {
            // 3. Barang siap jual
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Siap Jual
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
                onClick={() => onEdit(item)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-800/60 transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-50"
                title="Update Operasional (Harga, Stok, Ketersediaan)"
              >
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id, item.product_name || `Product #${item.product_id}`, item.store_name || `Store #${item.store_id}`)}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Hapus dari Cabang"
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
      searchPlaceholder="Cari model laptop, ID, atau cabang toko..."
      emptyMessage={isLoading ? "Sedang memuat data stok & harga..." : "Tidak ada data stok & harga yang ditemukan"}
    />
  );
}
