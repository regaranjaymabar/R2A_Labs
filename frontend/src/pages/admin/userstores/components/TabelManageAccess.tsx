import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { UserStoreAccess } from "../ManageAccess";

export interface TabelManageAccessProps {
  data: UserStoreAccess[];
  isLoading?: boolean;
  onToggleRevoke: (item: UserStoreAccess) => void;
  togglingId?: number | null;
}

const columnHelper = createColumnHelper<UserStoreAccess>();

export function TabelManageAccess({
  data,
  isLoading = false,
  onToggleRevoke,
  togglingId = null,
}: TabelManageAccessProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">ID</span>,
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono font-bold">
            #US-{info.getValue()}
          </span>
        ),
        size: 70,
      }),
      columnHelper.accessor("user_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pegawai Ditugaskan" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <div>
                <span className="font-bold text-gray-900 dark:text-white text-base block">
                  {info.getValue()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                  <span>{item.user_email}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                    store_admin
                  </span>
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("store_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cabang Toko Pengecer" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                <span>{info.getValue()}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 font-semibold">
                <span>Kota: {item.store_city}</span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("is_active", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Kendali (Revoking)" />,
        cell: (info) => {
          const isActive = info.getValue();
          return isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <span>Akses Aktif (Granted)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs">
              <span>Dicabut (Revoked)</span>
            </span>
          );
        },
      }),
      columnHelper.accessor("assigned_at", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Wewenang" />,
        cell: (info) => (
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold text-right block">Aksi Kendali</span>,
        cell: (info) => {
          const item = info.row.original;
          const isToggling = togglingId === item.id;

          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onToggleRevoke(item)}
                disabled={isToggling}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs border transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-50 ${
                  item.is_active
                    ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border-red-200 dark:border-red-800/60"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800/60"
                }`}
                title={
                  item.is_active
                    ? "Cabut Akses dari Cabang Toko Ini"
                    : "Pulihkan Kembali Akses ke Cabang Toko Ini"
                }
              >
                {isToggling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : item.is_active ? (
                  <span>Cabut Akses</span>
                ) : (
                  <span>Pulihkan Akses</span>
                )}
              </button>
            </div>
          );
        },
      }),
    ],
    [onToggleRevoke, togglingId]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Cari nama pegawai atau cabang toko..."
      emptyMessage={isLoading ? "Sedang memuat data hak akses toko..." : "Tidak ada delegasi penugasan yang cocok dengan filter"}
    />
  );
}

export { TabelManageAccess as TableManageAccess };
