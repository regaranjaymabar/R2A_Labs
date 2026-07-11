import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
    Edit,
    Trash2,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { Product } from "../../../../types/product";
import Button from "../../../../components/ui/common/Button";

interface TabelProductIndexProps {
    data: Product[];
    isLoading?: boolean;
    onDelete: (id: number, name: string) => void;
    deletingId?: number | null;
}

const columnHelper = createColumnHelper<Product>();

export function TabelProductIndex({
    data,
    isLoading = false,
    onDelete,
    deletingId = null,
}: TabelProductIndexProps) {
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            columnHelper.accessor("id", {
                header: () => <span className="font-semibold">ID / No</span>,
                cell: (info) => (
                    <span className="text-gray-500 dark:text-gray-400 font-mono font-medium">
                        #{info.getValue()}
                    </span>
                ),
                size: 70,
            }),
            columnHelper.accessor(
                (row) => {
                    const brand = row.brand?.name || row.brand_name || "";
                    const model = row.modelName || row.model_name || "";
                    return `${brand} ${model}`.trim();
                },
                {
                    id: "modelName",
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Nama & Model Produk" />,
                    cell: (info) => {
                        const product = info.row.original;
                        const modelName = product.modelName || product.model_name || "-";
                        const brandName = product.brand?.name || product.brand_name;
                        return (
                            <div className="flex items-center gap-3.5">
                                <div>
                                    <div className="font-bold text-gray-900 text-base">
                                        {modelName}
                                    </div>
                                    {brandName && (
                                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            Brand : <strong className="font-bold text-gray-900 ">{brandName}</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    },
                }
            ),
            columnHelper.accessor(
                (row) => `${row.processor || ""} ${row.ram || ""} ${row.storage || ""}`.trim(),
                {
                    id: "processor",
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Spesifikasi Utama" />,
                    cell: (info) => {
                        const product = info.row.original;
                        const screenSize = product.screenSize || product.screen_size;
                        return (
                            <div className="space-y-1.5 max-w-md py-0.5">
                                <div className="text-sm font-bold text-gray-900 dark:text-white truncate" title={product.processor}>
                                    {product.processor || "-"}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">

                                    {product.ram && (
                                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-md font-semibold">
                                            RAM: {product.ram}
                                        </span>
                                    )}

                                    {product.storage && (
                                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-md font-semibold">
                                            SSD: {product.storage}
                                        </span>
                                    )}
                               
                                    {screenSize && (
                                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-md font-semibold">
                                            {screenSize}"
                                        </span>
                                    )}

                                    {product.battery && (
                                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-md font-semibold">
                                            {product.battery}
                                        </span>
                                    )}
                                    {product.weight && (
                                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-md font-semibold">
                                            {product.weight} kg
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    },
                }
            ),
            columnHelper.accessor(
                (row) => String(row.releaseYear || row.release_year || "").slice(0, 4),
                {
                    id: "releaseYear",
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Rilis" />,
                    cell: (info) => {
                        const displayYear = info.getValue() || "-";
                        return (
                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                                <span>{displayYear}</span>
                            </div>
                        );
                    },
                }
            ),
            columnHelper.accessor(
                (row) => {
                    const val = row.is_active;
                    return val === undefined || val === 1 || val === true || Number(val) === 1 ? "Aktif" : "Non-Aktif";
                },
                {
                    id: "is_active",
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
                    cell: (info) => {
                        const isActive = info.getValue() === "Aktif";
                        return isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                                Aktif
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/60 shadow-2xs">
                                Non-Aktif
                            </span>
                        );
                    },
                }
            ),
            columnHelper.display({
                id: "actions",
                header: () => <span className="font-semibold text-right block">Aksi</span>,
                cell: (info) => {
                    const product = info.row.original;
                    const isDeleting = deletingId === product.id;
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                icon={<Edit className="w-3 h-3" />}
                                disabled={isDeleting}
                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
                            />
                            <Button
                                type="button"
                                variant="danger"
                                icon={<Trash2 className="w-3 h-3" />}
                                disabled={isDeleting}
                                isLoading={isDeleting}
                                onClick={() => onDelete(product.id, product.modelName || product.model_name || "-")}
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
            searchPlaceholder="Cari model laptop (misal: ROG, Vivobook, ThinkPad)..."
            emptyMessage={isLoading ? "Sedang memuat data produk dari server..." : "Tidak ada data produk yang ditemukan"}
        />
    );
}