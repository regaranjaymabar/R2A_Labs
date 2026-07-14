import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";

import Button from "../../../../components/ui/common/Button";
import type { ProductCriteria } from "../../../../types/productWeight";
import { Trash2 } from "lucide-react";
import { laptops } from "../../../../data/laptops";

export interface TabelProductWeightIndexProps {
  data: ProductCriteria[];
  products?: any[]; 
  criterias?: any[]; 
  isLoading?: boolean;
  onEdit: (item: ProductCriteria) => void;
  onDelete: (id: number, prodName: string, critName: string) => void;
  deletingId?: number | null;
}

export interface GroupedLaptopWeight {
  product_id: number;
  product_name: string;
  product?: any;
  items: {
    [criteria_code: string]: ProductCriteria; 
  };
  allItems: ProductCriteria[];
  search_string: string;
}

const getRawSpecValue = (code: string, prod: any, productId: number): string => {
  const localLaptop = laptops.find((l) => l.id === productId);

  switch (code) {
    case "C1": // Harga
      return prod?.price || prod?.harga || localLaptop?.price || "-";
    case "C2": // RAM
      return prod?.ram || localLaptop?.ram || "-";
    case "C3": // Storage
      return prod?.storage || localLaptop?.storage || "-";
    case "C4": // Battery
      return prod?.battery || (localLaptop?.battery ? `${localLaptop.battery}` : "-");
    case "C5": // Berat
      return prod?.weight || (localLaptop?.weight ? `${localLaptop.weight}` : "-");
    case "C6": // Processor
      return prod?.processor || localLaptop?.cpu || "-";
    case "C7": // Ukuran Layar
      return prod?.screenSize || prod?.screen_size || localLaptop?.display || "-";
    case "C8": // Tahun Rilis
      return prod?.releaseYear || prod?.release_year || (localLaptop ? "2023" : "-");
    default:
      return "-";
  }
};

const columnHelper = createColumnHelper<GroupedLaptopWeight>();

export function TabelProductWeightIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
  products = [], 
  criterias = [], 
}: TabelProductWeightIndexProps) {
  const groupedData: GroupedLaptopWeight[] = useMemo(() => {
    const map = new Map<number, GroupedLaptopWeight>();
    data.forEach((item) => {
      if (!map.has(item.product_id)) {
        const prod = products?.find((p: any) => Number(p.id) === Number(item.product_id));
        map.set(item.product_id, {
          product_id: item.product_id,
          product_name: item.product_name || `Laptop #${item.product_id}`,
          product: prod,
          items: {},
          allItems: [],
          search_string: `${item.product_name || ""} id:${item.product_id}`,
        });
      }
      const group = map.get(item.product_id)!;
      if (item.criteria_code) {
        group.items[item.criteria_code] = item;
        group.search_string += ` ${item.criteria_code} ${item.criteria_name || ""} ${item.sub_criteria_description || ""} ${item.value_numeric ?? item.value_numeric}`;
      }
      group.allItems.push(item);
    });
    return Array.from(map.values());
  }, [data, products]);

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
          <span className="text-[11px] text-gray-400 italic bg-gray-50 px-3 py-2.5 rounded-xl border border-dashed border-gray-200 block text-center w-full">
            Belum diatur
          </span>
        </div>
      );
    }

    const rawVal = getRawSpecValue(code, group.product, group.product_id);

    return (
      <div className="min-w-[145px] p-1">
        <div
          className={`group relative flex flex-col justify-between p-2.5 rounded-2xl border ${theme.bg} ${theme.hoverBg} ${theme.border} transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
          onClick={() => !isDeleting && onEdit(crit)}
          title={`Klik untuk mengubah spesifikasi [${defaultName}]`}
        >
          <div className="flex flex-col gap-1 mb-2">
            <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
              Spek Asli:
            </span>
            <span className="text-[11px] font-extrabold text-gray-900 line-clamp-1 mb-1">
              {rawVal}
            </span>
            <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
              Bobot SPK:
            </span>
            <span className={`text-xs font-bold leading-tight line-clamp-2 ${theme.text}`}>
              {crit.sub_criteria_description || "Spesifikasi"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-black/5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-extrabold ${theme.badge} ${theme.badgeText} shadow-2xs`}>
              {Number(crit.value_numeric ?? crit.value_numeric ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const activeCriterias = useMemo(() => {
    let list: any[] = [];
    if (criterias && criterias.length > 0) {
      list = [...criterias];
    } else {
      const map = new Map<string, { code: string; name: string }>();
      data.forEach((item) => {
        if (item.criteria_code) {
          map.set(item.criteria_code, {
            code: item.criteria_code,
            name: item.criteria_name || "Kriteria",
          });
        }
      });
      list = Array.from(map.values());
    }

    return list
      .filter((c) => c.code !== "C1" && c.name.toLowerCase() !== "harga")
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [data, criterias]);

  const columns = useMemo(() => {
    const list: any[] = [
      columnHelper.accessor("product_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Laptop" />,
        meta: {
          headerClassName: "sticky left-0 z-20 bg-gray-50 border-r border-gray-200 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.1)]",
          cellClassName: "sticky left-0 z-10 bg-white border-r border-gray-200 shadow-[3px_0_10px_-2px_rgba(0,0,0,0.1)] group-hover:bg-gray-50/95",
        },
        cell: (info) => {
          const group = info.row.original;
          const prod = group.product;
          
          return (
            <div className="flex flex-col py-1.5 min-w-[210px] max-w-[280px] leading-snug">
              <span className="font-extrabold text-gray-900 text-base block tracking-tight truncate hover:text-gray-600 transition-colors" title={info.getValue()}>
                {info.getValue()}
              </span>
              {prod && (
                <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] font-medium text-gray-500">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded-md truncate max-w-[120px]" title={prod.processor}>
                    {prod.processor || "-"}
                  </span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded-md">
                    {prod.ram || "-"}
                  </span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded-md">
                    {prod.storage || "-"}
                  </span>
                </div>
              )}
            </div>
          );
        },
      }),
    ];

    activeCriterias.forEach((crit) => {
      list.push(
        columnHelper.display({
          id: `crit_${crit.code.toLowerCase()}`,
          header: () => (
            <div className="text-center">
              <span className="text-[10px] font-mono font-extrabold text-gray-900 bg-gray-200 px-1.5 py-0.5 rounded block w-fit mx-auto mb-0.5">
                {crit.code}
              </span>
              <span className="font-bold text-gray-800 text-xs">
                {crit.name}
              </span>
            </div>
          ),
          cell: ({ row }) =>
            renderCriteriaCell(row.original, crit.code, crit.name, {
              bg: "bg-gray-50/80",
              hoverBg: "hover:bg-gray-100",
              border: "border-gray-200/80",
              text: "text-gray-900",
              badge: "bg-gray-900",
              badgeText: "text-white",
            }),
        })
      );
    });

    list.push(
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
                icon={<Trash2 className="w-3 h-3" />}
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
      })
    );

    return list;
  }, [activeCriterias, deletingId, onDelete, onEdit]);

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