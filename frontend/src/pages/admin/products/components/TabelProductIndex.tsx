import { useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
    CheckCircle2,
    Cpu,
    Edit,
    Trash2,
    XCircle,
    Loader2,
} from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { Product } from "../ProductIndex";

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
            columnHelper.accessor("model_name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Model Laptop" />,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <div className="flex items-center gap-3.5">
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white text-base">
                                    {info.getValue()}
                                </div>
                                {product.brand_name && (
                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        {product.brand_name}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("processor", {
                header: () => <span className="font-semibold">Spesifikasi Utama</span>,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <div className="space-y-1 max-w-xs">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                                <Cpu className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="truncate" title={product.processor}>{product.processor || "-"}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-wrap">
                                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
                                    {product.ram || "-"}
                                </span>
                                <span>•</span>
                                <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
                                    {product.storage || "-"}
                                </span>
                                {product.screen_size && (
                                    <>
                                        <span>•</span>
                                        <span>{product.screen_size}"</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("release_year", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Rilis" />,
                cell: (info) => (
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                        <span>{info.getValue() || "-"}</span>
                    </div>
                ),
            }),
            columnHelper.accessor("is_active", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
                cell: (info) => {
                    const val = info.getValue();
                    const isActive = val === 1 || val === true || Number(val) === 1;
                    return isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Aktif
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/60 shadow-2xs">
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            Non-Aktif
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: "actions",
                header: () => <span className="font-semibold text-right block">Aksi</span>,
                cell: (info) => {
                    const product = info.row.original;
                    const isDeleting = deletingId === product.id;
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                                title="Edit Produk"
                            >
                                <Edit className="w-4 h-4" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => onDelete(product.id, product.model_name)}
                                disabled={isDeleting}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Hapus Produk"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    );
                },
            }),
        ],
        [deletingId, onDelete]
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