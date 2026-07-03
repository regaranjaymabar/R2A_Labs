import { useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import { type Brand } from "../BrandIndex";

interface TableBrandIndexProps {
  data: Brand[];
  isLoading?: boolean;
  onDelete: (id: number, name: string) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<Brand>();

export function TableBrandIndex({
  data,
  isLoading = false,
  onDelete,
  deletingId = null,
}: TableBrandIndexProps) {
  
  // Definisi Kolom Tabel (id, name, is_active, dan actions)
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Brand" />,
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 dark:text-white text-base">
              {info.getValue()}
            </span>
          </div>
        ),
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
        header: () => <span className="font-semibold text-right block">Aksi</span>,
        cell: (info) => {
          const brand = info.row.original;
          const isDeleting = deletingId === brand.id;
          return (
            <div className="flex items-center justify-end gap-2">
              <Link
                to={`/admin/brands/edit/${brand.id}`}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                title="Edit Brand"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(brand.id, brand.name)}
                disabled={isDeleting}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Hapus Brand"
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
      searchPlaceholder="Cari nama brand (misal: ASUS, Lenovo)..."
      emptyMessage={isLoading ? "Sedang memuat data dari server..." : "Tidak ada data brand yang ditemukan"}
    />
  );
}
