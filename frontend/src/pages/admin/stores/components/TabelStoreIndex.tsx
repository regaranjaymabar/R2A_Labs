import { useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { Store } from "../StoreIndex";

export interface TabelStoreIndexProps {
  data: Store[];
  isLoading?: boolean;
  onDelete: (id: number, name: string) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<Store>();

export function TabelStoreIndex({
  data,
  isLoading = false,
  onDelete,
  deletingId = null,
}: TabelStoreIndexProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">ID / No</span>,
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
            #{info.getValue()}
          </span>
        ),
        size: 70,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Toko" />,
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 dark:text-white text-base">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("address", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Alamat" />,
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={info.getValue()}>
            <span className="truncate">{info.getValue() || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("city", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kota" />,
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("phone", {
        header: () => <span className="font-semibold">No. Telepon</span>,
        cell: (info) => <span className="font-mono text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      }),
      columnHelper.accessor("is_active", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: (info) => {
          const val = info.getValue();
          const isActive = val === 1 || val === true || Number(val) === 1;
          return isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Aktif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/60 shadow-2xs">
              <XCircle className="w-3.5 h-3.5 text-red-500" />
              Non-Aktif
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold">Aksi</span>,
        cell: (info) => {
          const store = info.row.original;
          const isDeleting = deletingId === store.id;
          return (
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/stores/edit/${store.id}`}
                className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/40 rounded-lg transition-colors ${isDeleting ? "pointer-events-none opacity-50" : ""}`}
                title="Edit Toko"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(store.id, store.name)}
                disabled={isDeleting}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Hapus Toko"
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
    [deletingId, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Cari nama toko, alamat, atau kota..."
      emptyMessage={isLoading ? "Sedang memuat data toko..." : "Tidak ada data toko yang ditemukan"}
    />
  );
}

export { TabelStoreIndex as TableStoreIndex };
