import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Trash2,
  Edit,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { ProductStore } from "../../../../types/productStore";
import Button from "../../../../components/ui/common/Button";


export interface TableProductStoreIndexProps {
  data: ProductStore[];
  isLoading?: boolean;
  onEdit: (item: ProductStore) => void;
  onDelete: (id: number, productName: string, storeName?: string) => void;
  deletingId?: number | null;
}

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const columnHelper = createColumnHelper<ProductStore>();

export function TableProductStoreIndex({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  deletingId = null,
}: TableProductStoreIndexProps) {
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
      columnHelper.accessor(
        (row: any) => {
          const storeId = row.storeId ?? row.store_id ?? 1;
          const storeName = row.store?.name || row.store_name || row.storeName || `Store ID #${storeId}`;
          return `${storeName} ${storeId}`;
        },
        {
          id: "store_info",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Cabang Toko" />,
          cell: (info) => {
            const item: any = info.row.original;
            const storeId = item.storeId ?? item.store_id ?? 1;
            const storeName = item.store?.name || item.store_name || item.storeName || `Store ID #${storeId}`;
            return (
              <div className="flex items-center gap-2.5">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm block">
                    {storeName}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">store_id: {storeId}</span>
                </div>
              </div>
            );
          },
        }
      ),
      columnHelper.accessor(
        (row: any) => {
          const productId = row.productId ?? row.product_id;
          const productName =
            row.product?.modelName ||
            row.product?.name ||
            row.model_name ||
            row.product_name ||
            `Product ID #${productId}`;
          const brandName = row.product?.brand?.name || row.brand_name || "";
          return `${productName} ${brandName} ${productId}`;
        },
        {
          id: "product_info",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Model Laptop" />,
          cell: (info) => {
            const item: any = info.row.original;
            const productId = item.productId ?? item.product_id;
            const productName =
              item.product?.modelName ||
              item.product?.name ||
              item.model_name ||
              item.product_name ||
              `Product ID #${productId}`;
            const brandName = item.product?.brand?.name || item.brand_name;
            return (
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-base">
                  {productName}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {brandName && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {brandName}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-500 font-mono">product_id: {productId}</span>
                </div>
              </div>
            );
          },
        }
      ),
      columnHelper.accessor("price", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Jual" />,
        cell: (info) => (
          <span className="font-mono font-bold text-gray-900 dark:text-emerald-400 text-base">
            {formatIDR(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("stock", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stok Fisik" />,
        cell: (info) => (
          <span className="font-mono font-bold text-base px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {info.getValue()} <span className="text-xs font-normal text-gray-500">unit</span>
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: () => <span className="font-semibold">Status Operasional</span>,
        cell: (info) => {
          const item: any = info.row.original;
          const isAvail = item.isAvailable === 1 || item.isAvailable === true || item.is_available === 1 || item.is_available === true;
          const stockCount = item.stock;
          if (isAvail === false) {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-700 shadow-2xs">
                Non-Aktif
              </span>
            );
          } else if (stockCount <= 0) {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800/80 shadow-2xs animate-pulse">
                Stok Kosong
              </span>
            );
          } else if (stockCount > 0) {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                Stok Tersedia
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
          const item: any = info.row.original;
          const isDeleting = deletingId === item.id;
          const productName = item.product?.modelName || item.product?.name || item.product_name || `Product #${item.productId || item.product_id}`;
          const storeName = item.store?.name || item.store_name || `Store #${item.storeId || item.store_id}`;
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
                onClick={() => onDelete(item.id, productName, storeName)}
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
      searchPlaceholder="Cari model laptop, ID, atau cabang toko..."
      emptyMessage={isLoading ? "Sedang memuat data stok & harga..." : "Tidak ada data stok & harga yang ditemukan"}
    />
  );
}
