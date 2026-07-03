import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, UserCheck, UserX, Loader2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import { Button } from "../../../../components/ui/common/Button";
import type { UserData } from "../UserIndex";

export interface TabelUserIndexProps {
  data: UserData[];
  isLoading?: boolean;
  onEdit: (item: UserData) => void;
  onToggleStatus: (item: UserData) => void;
  togglingId?: number | null;
}

const columnHelper = createColumnHelper<UserData>();

export function TabelUserIndex({
  data,
  isLoading = false,
  onEdit,
  onToggleStatus,
  togglingId = null,
}: TabelUserIndexProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">ID</span>,
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono font-bold">
            #{info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Identitas Pengguna" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="py-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white text-base">
                    {info.getValue()}
                  </span>
                  {item.id === 1 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                      SUPER ADMIN UTAMA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                  <span>{item.email}</span>
                </div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("role", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Peran Akses (Role)" />,
        cell: (info) => {
          const role = info.getValue();
          if (role === "admin") {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-2xs">
                <span>Super Admin</span>
              </span>
            );
          }
          if (role === "store_admin") {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                <span>Admin Toko</span>
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-2xs">
              <span>User Biasa</span>
            </span>
          );
        },
      }),
      columnHelper.accessor("is_active", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status Akun (Soft Delete)" />,
        cell: (info) => {
          const isActive = info.getValue();
          return isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span>Aktif (Live)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              <span>Nonaktif (Soft Deleted)</span>
            </span>
          );
        },
      }),
      columnHelper.accessor("created_at", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Daftar" />,
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
          const isSuperAdminMain = item.id === 1;
          const isToggling = togglingId === item.id;

          return (
            <div className="flex items-center justify-end gap-2">
              <span title="Edit Identitas & Peran Pengguna">
                <Button
                  type="button"
                  variant="info"
                  onClick={() => onEdit(item)}
                  disabled={isToggling}
                  icon={<Edit className="w-3.5 h-3.5" />}
                  label="Edit Role"
                  className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                />
              </span>

              {!isSuperAdminMain && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(item)}
                  disabled={isToggling}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs border transition-all active:scale-95 shadow-2xs cursor-pointer disabled:opacity-50 ${
                    item.is_active
                      ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border-red-200 dark:border-red-800/60"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800/60"
                  }`}
                  title={item.is_active ? "Nonaktifkan Akun (Soft Delete)" : "Aktifkan Kembali Akses Akun"}
                >
                  {isToggling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : item.is_active ? (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>Nonaktifkan</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Aktifkan</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        },
      }),
    ],
    [onEdit, onToggleStatus, togglingId]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Cari nama pengguna atau alamat email..."
      emptyMessage={isLoading ? "Sedang memuat data pengguna..." : "Tidak ada data pengguna yang cocok dengan filter aktif"}
    />
  );
}

export { TabelUserIndex as TableUserIndex };
