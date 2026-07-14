import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import { Button } from "../../../../components/ui/common/Button";
import type { UserData } from "../../../../types/user";

export interface TabelUserIndexProps {
  data: UserData[];
  isLoading?: boolean;
  onEdit: (item: UserData) => void;
  onDelete: (item: UserData) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<UserData>();

export function TabelUserIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TabelUserIndexProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => row.id ?? (row as any).id_user ?? "-",
        {
          id: "id",
          header: () => <span className="font-semibold">ID</span>,
          cell: (info) => (
            <span className="text-gray-500 font-mono font-bold">
              #{info.getValue()}
            </span>
          ),
          size: 60,
        }
      ),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Identitas Pengguna" />,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="py-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-base">
                    {info.getValue()}
                  </span>
                  {item.id === 1 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-100 text-purple-700 border border-purple-300">
                      SUPER ADMIN UTAMA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono mt-0.5">
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
          if (role === "superadmin") {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                <span>Super Admin</span>
              </span>
            );
          }
          if (role === "admin" || role === "store_admin") {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                <span>Admin Toko</span>
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-2xs">
              <span>User Biasa</span>
            </span>
          );
        },
      }),
      columnHelper.accessor(
        (row) => {
          const val = row.isActive ?? row.is_active;
          return val === false || val === 0 ? false : true;
        },
        {
          id: "is_active",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Status Akun (Soft Delete)" />,
          cell: (info) => {
            const isActive = info.getValue();
            return isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span>Aktif</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                <span>Nonaktif</span>
              </span>
            );
          },
        }
      ),
      columnHelper.accessor(
        (row) => row.createdAt || row.created_at || "-",
        {
          id: "created_at",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Daftar" />,
          cell: (info) => {
            const raw = info.getValue();
            if (!raw || raw === "-") return <span className="text-xs text-gray-400">-</span>;
            try {
              const d = new Date(raw);
              if (isNaN(d.getTime())) return <span className="text-xs text-gray-600 font-mono">{raw}</span>;
              return (
                <span className="text-xs text-gray-600 font-mono">
                  {d.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              );
            } catch {
              return (
                <span className="text-xs text-gray-600 font-mono">
                  {raw}
                </span>
              );
            }
          },
        }
      ),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold text-right block">Aksi Kendali</span>,
        cell: (info) => {
          const item = info.row.original;
          const isSuperAdminMain = item.id === 1;
          const isDeleting = deletingId === item.id;

          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                icon={<Edit className="w-3 h-3" />}
                onClick={() => onEdit(item)}
                disabled={isDeleting}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-2xs cursor-pointer disabled:opacity-50"
              />

              {!isSuperAdminMain && (
                <Button
                  type="button"
                  variant="danger"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => onDelete(item)}
                  disabled={isDeleting}
                  isLoading={isDeleting}
                  className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-2xs cursor-pointer"
                />
              )}
            </div>
          );
        },
      }),
    ],
    [onEdit, onDelete, deletingId]
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
