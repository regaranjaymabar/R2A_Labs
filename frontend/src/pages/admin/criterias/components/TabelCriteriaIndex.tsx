import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import { Button } from "../../../../components/ui/common/Button";
import type { Criteria } from "../../../../types/criteria";
import { Edit, Trash2 } from "lucide-react";

export interface TabelCriteriaIndexProps {
  data: Criteria[];
  isLoading?: boolean;
  onEdit: (item: Criteria) => void;
  onDelete: (id: number, code: string, name: string) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<Criteria>();

export function TabelCriteriaIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TabelCriteriaIndexProps) {


  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">No</span>,
        cell: (info) => (
          <span className="text-gray-500 font-mono font-medium">
            #{info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.accessor("code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode" />,
        cell: (info) => (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-mono font-bold text-black">
            {info.getValue()}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Dimensi Penilaian" />,
        cell: (info) => (
          <span className="font-bold text-gray-900 text-base">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("type", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe Atribut" />,
        cell: (info) => {
          const val = info.getValue();
          const typeStr = String(val || "").toLowerCase().trim();

          if (typeStr === "benefit") {
            return (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                benefit
              </span>
            );
          } else if (typeStr === "cost") {
            return (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
                cost
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
              {String(val || "-")}
            </span>
          );
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
              <Button
                type="button"
                icon={<Edit className="w-3 h-3" />}
                disabled={isDeleting}
                onClick={() => onEdit(item)}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
              />
              <Button
                type="button"
                variant="danger"
                icon={<Trash2 className="w-3 h-3" />}
                disabled={isDeleting}
                isLoading={isDeleting}
                onClick={() => onDelete(item.id, item.code, item.name)}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
              />
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
      searchPlaceholder="Cari kode kriteria (misal: C1, C2) atau nama (misal: Harga, RAM)..."
      emptyMessage={isLoading ? "Sedang memuat dimensi penilaian..." : "Tidak ada dimensi penilaian yang ditemukan"}
    />
  );
}

export { TabelCriteriaIndex as TableCriteriaIndex };
export default TabelCriteriaIndex;