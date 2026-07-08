import { useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Trash2, Loader2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { RecommendationRequest } from "../../../../types/recomendation";


export interface TabelReqHistoryProps {
    data: RecommendationRequest[];
    isLoading?: boolean;
    onSelectDetail: (item: RecommendationRequest) => void;
    onDelete: (id: number, userName: string) => void;
    deletingId?: number | null;
}

const columnHelper = createColumnHelper<RecommendationRequest>();

export function TabelReqHistory({
    data,
    isLoading = false,
    onSelectDetail,
    onDelete,
    deletingId = null,
}: TabelReqHistoryProps) {
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
            columnHelper.accessor("user_name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Pencari (User)" />,
                cell: (info) => {
                    const item = info.row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white text-base block">
                                    {info.getValue()}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    {item.user_email || "General User"}
                                </span>
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("usage_purpose", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Kebutuhan & Budget" />,
                cell: (info) => {
                    const item = info.row.original;
                    return (
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                                <span>{info.getValue()}</span>
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono mt-0.5 flex items-center gap-1">
                                <span>Budget: {item.budget_range}</span>
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("weights", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Preferensi Bobot" />,
                cell: (info) => {
                    const w = info.getValue();
                    return (
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                RAM: {w.ram}%
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Harga: {w.price}%
                            </span>
                            {w.processor && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    CPU: {w.processor}%
                                </span>
                            )}
                        </div>
                    );
                },
            }),
            columnHelper.accessor("top_recommendation", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Rekomendasi" />,
                cell: (info) => {
                    const rec = info.getValue();
                    const item = info.row.original;
                    const isChosen = item.user_choice === rec.product_name;
                    return (
                        <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800 w-fit">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                    {rec.product_name}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mt-1 text-xs">
                                <span className="font-mono text-gray-500 font-semibold">
                                    Skor: <strong className="text-black dark:text-purple-400">{rec.saw_score}</strong>
                                </span>
                                {isChosen ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                                        Dipilih User!
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-gray-400 italic">Hanya dilihat</span>
                                )}
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.display({
                id: "actions",
                header: () => <span className="font-semibold">Aksi</span>,
                cell: (info) => {
                    const item = info.row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onSelectDetail(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-800/60 transition-all active:scale-95 shadow-2xs cursor-pointer"
                                title="Lihat Detail Analisis & Rincian Bobot"
                            >
                                <span>Analisis</span>
                            </button>
                            <Link
                                to={`/admin/recommendations/${item.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-black dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-semibold text-xs rounded-xl border border-purple-200 dark:border-purple-800/60 transition-all active:scale-95 shadow-2xs"
                                title="Lihat Bedah Matriks Normalisasi SAW (ResultDetail)"
                            >
                                <span>Detail SAW</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => onDelete(item.id, item.user_name)}
                                disabled={deletingId === item.id}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Hapus Riwayat"
                            >
                                {deletingId === item.id ? (
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
        [onSelectDetail, onDelete, deletingId]
    );

    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Cari nama user (misal: Andi), kebutuhan (coding, gaming), atau laptop..."
            emptyMessage={
                isLoading
                    ? "Sedang memuat data riwayat SPK dari server..."
                    : "Tidak ada riwayat pencarian SPK yang ditemukan"
            }
        />
    );
}