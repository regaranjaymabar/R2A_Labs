import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { Store } from "../StoreIndex";
import Button from "../../../../components/ui/common/Button";

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
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">ID / No</span>,
        cell: (info) => (
          <span className="text-gray-500 font-mono font-medium">
            #{info.getValue()}
          </span>
        ),
        size: 70,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Toko" />,
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-base">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("address", {
        header: () => <span className="font-semibold">Alamat Lengkap</span>,
        cell: (info) => (
          <span className="text-gray-500 text-xs truncate block max-w-xs" title={info.getValue() || ""}>
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("city", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kota / Wilayah" />,
        cell: (info) => (
          <span className="text-gray-700 font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("phone", {
        header: () => <span className="font-semibold">No. Telepon</span>,
        cell: (info) => <span className="font-mono text-gray-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor(
        (row: any) => {
          const val = row.isActive !== undefined ? row.isActive : row.is_active;
          return val === 1 || val === true || Number(val) === 1 ? "Aktif" : "Non-Aktif";
        },
        {
          id: "is_active",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
          cell: (info) => {
            const isActive = info.getValue() === "Aktif";
          return isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Aktif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
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
              <Button
                type="button"
                icon={<Edit className="w-3 h-3" />}
                disabled={isDeleting}
                onClick={() => navigate(`/admin/stores/edit/${store.id}`)}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
              />
              <Button
                type="button"
                variant="danger"
                icon={<Trash2 className="w-3 h-3" />}
                disabled={isDeleting}
                isLoading={isDeleting}
                onClick={() => onDelete(store.id, store.name)}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
              />
            </div>
          );
        },
      }),
    ],
    [deletingId, onDelete, navigate]
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
