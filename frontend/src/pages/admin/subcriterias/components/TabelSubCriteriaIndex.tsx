import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import { Button } from "../../../../components/ui/common/Button";
import type { SubCriteria } from "../SubCriteriaIndex";
import { Edit, Trash2 } from "lucide-react";

export interface TabelSubCriteriaIndexProps {
  data: SubCriteria[];
  isLoading?: boolean;
  onEdit: (item: SubCriteria) => void;
  onDelete: (id: number, desc: string, criteriaCode?: string) => void;
  deletingId?: number | null;
}

const columnHelper = createColumnHelper<SubCriteria>();

export function TabelSubCriteriaIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TabelSubCriteriaIndexProps) {
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
      columnHelper.accessor("criteria_id", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kriteria" />,
        cell: (info) => {
          const item = info.row.original;
          const code = item.criteria_code || `C${item.criteria_id}`;
          const isBenefit = String(item.criteria_type).toLowerCase() === "benefit";
          return (
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold dark:bg-purple-950/60 text-black dark:text-purple-200">
                {code}
              </span>
              <div>
                <span className="font-bold text-gray-900 dark:text-white text-sm block">
                  {item.criteria_name || `Criteria ID #${item.criteria_id}`}
                </span>
                <span className={`text-[11px] font-mono font-bold ${isBenefit ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  criteria_id: {item.criteria_id} ({item.criteria_type || "attr"})
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi Spesifikasi" />,
        cell: (info) => (
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 text-base">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.valueNumeric ?? row.value_numeric ?? (row as any).value ?? 0, {
        id: "value_numeric",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nilai Numerik" />,
        cell: (info) => {
          const num = Number(info.getValue() ?? 0);
          return (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-base bg-gray-200 dark:bg-black text-black dark:text-white shadow-2xs">
                {isNaN(num) ? "0.00" : num.toFixed(2)}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.created_at ?? row.createdAt ?? "-", {
        id: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dibuat Pada" />,
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span>{info.getValue() || "-"}</span>
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
                onClick={() => onDelete(item.id, item.description, item.criteria_code)}
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
      searchPlaceholder="Cari deskripsi (misal: 8 GB, Rp 6.000.000) atau kode kriteria (misal: C1, C2)..."
      emptyMessage={isLoading ? "Sedang memuat data sub-kriteria..." : "Tidak ada aturan konversi sub-kriteria yang ditemukan"}
    />
  );
}

export { TabelSubCriteriaIndex as TableSubCriteriaIndex };
