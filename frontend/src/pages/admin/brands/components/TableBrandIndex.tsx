import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Edit,
  Trash2,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { Brand } from "../../../../types/brand";
import Button from "../../../../components/ui/common/Button";


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
  const navigate = useNavigate();

  // Definisi Kolom Tabel (id, name, is_active, dan actions)
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Brand" />,
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-base">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold text-right block">Aksi</span>,
        cell: (info) => {
          const brand = info.row.original;
          const isDeleting = deletingId === brand.id;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                icon={<Edit className="w-3 h-3" />}
                disabled={isDeleting}
                onClick={() => navigate(`/admin/brands/edit/${brand.id}`)}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
              />
              <Button
                type="button"
                variant="danger"
                icon={<Trash2 className="w-3 h-3" />}
                disabled={isDeleting}
                isLoading={isDeleting}
                onClick={() => onDelete(brand.id, brand.name)}
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
      searchPlaceholder="Cari nama brand (misal: ASUS, Lenovo)..."
      emptyMessage={isLoading ? "Sedang memuat data dari server..." : "Tidak ada data brand yang ditemukan"}
    />
  );
}
