import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import { Button } from "../../../../components/ui/common/Button";
import type { Criteria } from "../../../../types/criteria";

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
  // Definisi Kolom Tabel
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <span className="font-semibold">No</span>,
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
            #{info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.accessor("code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode" />,
        cell: (info) => (
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-mono font-bold text-black dark:text-white">
            {info.getValue()}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Dimensi Penilaian" />,
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-white text-base">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("type", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe Atribut (SAW)" />,
        cell: (info) => {
          const val = info.getValue();
          const typeStr = String(val).toLowerCase();

          // STRUKTUR ELSE IF MURNI SESUAI INSTRUKSI UNTUK BADGE WARNA:
          if (typeStr === "benefit") {
            // Badge Hijau: Semakin besar nilainya semakin bagus (contoh: RAM, Storage)
            return (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                benefit
              </span>
            );
          } else if (typeStr === "cost") {
            // Badge Merah: Semakin kecil nilainya semakin bagus (contoh: Harga, Berat)
            return (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800/60 shadow-2xs">
                cost
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
              <Button
                type="button"
                variant="info"
                label="Update"
                disabled={isDeleting}
                onClick={() => onEdit(item)}
                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
              />
              <Button
                type="button"
                variant="danger"
                label="Hapus"
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