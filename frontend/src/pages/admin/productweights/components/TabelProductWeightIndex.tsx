import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { ProductWeight } from "../../../../types/productWeight";
import Button from "../../../../components/ui/common/Button";

export interface TabelProductWeightIndexProps {
  data: ProductWeight[];
  products?: { id: number; name: string }[]; // <-- Properti ini 
  isLoading?: boolean;
  onEdit: (item: ProductWeight) => void;
  onDelete: (id: number, prodName: string, critName: string) => void;
  deletingId?: number | null;
}

// Struktur data yang dikelompokkan per Laptop (Matriks Keputusan SPK)
export interface GroupedLaptopWeight {
  product_id: number;
  product_name: string;
  items: {
    [criteria_code: string]: ProductWeight; // "C1", "C2", "C3", "C4", "C5"
  };
  allItems: ProductWeight[];
  search_string: string;
}

const columnHelper = createColumnHelper<GroupedLaptopWeight>();

export function TabelProductWeightIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TabelProductWeightIndexProps) {
  // 1. Mengelompokkan baris data relasi menjadi 1 Baris per Laptop
  const groupedData: GroupedLaptopWeight[] = useMemo(() => {
    const map = new Map<number, GroupedLaptopWeight>();
    data.forEach((item) => {
      if (!map.has(item.product_id)) {
        map.set(item.product_id, {
          product_id: item.product_id,
          product_name: item.product_name || `Laptop #${item.product_id}`,
          items: {},
          allItems: [],
          search_string: `${item.product_name || ""} id:${item.product_id}`,
        });
      }
      const group = map.get(item.product_id)!;
      if (item.criteria_code) {
        group.items[item.criteria_code] = item;
        group.search_string += ` ${item.criteria_code} ${item.criteria_name || ""} ${item.sub_criteria_description || ""} ${item.value_numeric}`;
      }
      group.allItems.push(item);
    });
    return Array.from(map.values());
  }, [data]);

  // Helper untuk merender sel kriteria yang interaktif & indah (Monochrome Style)
  const renderCriteriaCell = (
    group: GroupedLaptopWeight,
    code: string,
    defaultName: string,
    theme: { bg: string; border: string; text: string; badge: string; badgeText: string; hoverBg: string }
  ) => {
    const crit = group.items[code];
    const isDeleting = crit ? deletingId === crit.id : false;

    if (!crit) {
      return (
        <div className="flex items-center justify-center p-1 min-w-[140px]">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-[#181519] px-3 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 block text-center w-full">
            Belum diatur
          </span>
        </div>
      );
    }

    return (
      <div className="min-w-[145px] p-1">
        <div
          className={`group relative flex flex-col justify-between p-2.5 rounded-2xl border ${theme.bg} ${theme.hoverBg} ${theme.border} transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
          onClick={() => !isDeleting && onEdit(crit)}
          title={`Klik untuk mengubah spesifikasi [${defaultName}]`}
        >
          {/* Bagian Atas: Deskripsi Sub Kriteria */}
          <div className="flex items-start justify-between gap-1 mb-2">
            <span className={`text-xs font-bold leading-tight line-clamp-2 ${theme.text}`}>
              {crit.sub_criteria_description || "Spesifikasi"}
            </span>
          </div>

          {/* Bagian Bawah: Skor Numerik & Indikator Ubah */}
          <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-black/5 dark:border-white/5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-extrabold ${theme.badge} ${theme.badgeText} shadow-2xs`}>
              {Number(crit.value_numeric).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("product_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Laptop" />,
        meta: {
          headerClassName: "sticky left-0 z-20 bg-gray-50 dark:bg-[#181519] border-r border-gray-200 dark:border-gray-800 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.1)]",
          cellClassName: "sticky left-0 z-10 bg-white dark:bg-[#151216] border-r border-gray-200 dark:border-gray-800 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.1)] group-hover:bg-gray-50/95 dark:group-hover:bg-gray-800/80",
        },
        cell: (info) => {
          return (
            <div className="flex items-center gap-3 min-w-[210px] max-w-[280px] py-1">
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-gray-900 dark:text-white text-base block tracking-tight leading-snug truncate hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title={info.getValue()}>
                  {info.getValue()}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "c1_harga",
        header: () => (
          <div className="text-center">
            <span className="text-[10px] font-mono font-extrabold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded block w-fit mx-auto mb-0.5">C1</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Harga</span>
          </div>
        ),
        cell: ({ row }) =>
          renderCriteriaCell(row.original, "C1", "Harga", {
            bg: "bg-gray-50/80 dark:bg-[#181519]",
            hoverBg: "hover:bg-gray-100 dark:hover:bg-[#221f24]",
            border: "border-gray-200/80 dark:border-gray-800",
            text: "text-gray-900 dark:text-gray-100",
            badge: "bg-gray-900 dark:bg-white",
            badgeText: "text-white dark:text-gray-900",
          }),
      }),
      columnHelper.display({
        id: "c2_ram",
        header: () => (
          <div className="text-center">
            <span className="text-[10px] font-mono font-extrabold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded block w-fit mx-auto mb-0.5">C2</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">RAM</span>
          </div>
        ),
        cell: ({ row }) =>
          renderCriteriaCell(row.original, "C2", "RAM", {
            bg: "bg-gray-50/80 dark:bg-[#181519]",
            hoverBg: "hover:bg-gray-100 dark:hover:bg-[#221f24]",
            border: "border-gray-200/80 dark:border-gray-800",
            text: "text-gray-900 dark:text-gray-100",
            badge: "bg-gray-900 dark:bg-white",
            badgeText: "text-white dark:text-gray-900",
          }),
      }),
      columnHelper.display({
        id: "c3_storage",
        header: () => (
          <div className="text-center">
            <span className="text-[10px] font-mono font-extrabold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded block w-fit mx-auto mb-0.5">C3</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Storage</span>
          </div>
        ),
        cell: ({ row }) =>
          renderCriteriaCell(row.original, "C3", "Storage", {
            bg: "bg-gray-50/80 dark:bg-[#181519]",
            hoverBg: "hover:bg-gray-100 dark:hover:bg-[#221f24]",
            border: "border-gray-200/80 dark:border-gray-800",
            text: "text-gray-900 dark:text-gray-100",
            badge: "bg-gray-900 dark:bg-white",
            badgeText: "text-white dark:text-gray-900",
          }),
      }),
      columnHelper.display({
        id: "c4_battery",
        header: () => (
          <div className="text-center">
            <span className="text-[10px] font-mono font-extrabold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded block w-fit mx-auto mb-0.5">C4</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Battery</span>
          </div>
        ),
        cell: ({ row }) =>
          renderCriteriaCell(row.original, "C4", "Battery", {
            bg: "bg-gray-50/80 dark:bg-[#181519]",
            hoverBg: "hover:bg-gray-100 dark:hover:bg-[#221f24]",
            border: "border-gray-200/80 dark:border-gray-800",
            text: "text-gray-900 dark:text-gray-100",
            badge: "bg-gray-900 dark:bg-white",
            badgeText: "text-white dark:text-gray-900",
          }),
      }),
      columnHelper.display({
        id: "c5_berat",
        header: () => (
          <div className="text-center">
            <span className="text-[10px] font-mono font-extrabold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded block w-fit mx-auto mb-0.5">C5</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Berat</span>
          </div>
        ),
        cell: ({ row }) =>
          renderCriteriaCell(row.original, "C5", "Berat", {
            bg: "bg-gray-50/80 dark:bg-[#181519]",
            hoverBg: "hover:bg-gray-100 dark:hover:bg-[#221f24]",
            border: "border-gray-200/80 dark:border-gray-800",
            text: "text-gray-900 dark:text-gray-100",
            badge: "bg-gray-900 dark:bg-white",
            badgeText: "text-white dark:text-gray-900",
          }),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold text-center block">Aksi</span>,
        cell: (info) => {
          const group = info.row.original;
          const firstCrit = group.allItems[0];
          const isDeleting = deletingId === firstCrit?.id;
          return (
            <div className="flex items-center justify-center min-w-[100px]">
              <Button
                type="button"
                variant="danger"
                label="Hapus"
                disabled={!firstCrit || isDeleting}
                isLoading={isDeleting}
                onClick={() => {
                  if (firstCrit) {
                    onDelete(firstCrit.id, group.product_name, firstCrit.criteria_name || "Bobot");
                  }
                }}
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
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={groupedData}
        searchPlaceholder="Cari nama laptop (misal: ASUS, Legion, MacBook) atau spesifikasi..."
        emptyMessage={isLoading ? "Sedang memuat data pembobotan produk..." : "Tidak ada data pembobotan produk yang ditemukan"}
        maxHeightClass="max-h-[620px]"
        stickyHeader={true}
      />
    </div>
  );
}

export { TabelProductWeightIndex as TableProductWeightIndex };
