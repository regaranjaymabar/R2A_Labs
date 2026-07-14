import { useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { DataTable, DataTableColumnHeader } from "../../../../components/ui/common/DataTable";
import type { RecommendationRequest } from "../../../../types/recomendation";
import Button from "../../../../components/ui/common/Button";


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
                    <span className="text-gray-500 font-mono font-medium">
                        #{info.getValue()}
                    </span>
                ),
                size: 60,
            }),
            columnHelper.accessor((row: any) => row.customer?.name || row.user_name || row.customerName || "Customer", {
                id: "user_name",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Customers" />,
                cell: (info) => {
                    const item: any = info.row.original;
                    const userName = item.customer?.name || item.user_name || item.customerName || "Customer";
                    const userEmail = item.customer?.email || item.user_email || item.customerEmail || "-";
                    return (
                        <div className="flex items-center gap-3">
                            <div>
                                <span className="font-bold text-gray-900 text-base block">
                                    {userName}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {userEmail}
                                </span>
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor((row: any) => row.kebutuhan || row.usage_purpose || "-", {
                id: "usage_purpose",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Kebutuhan & Budget" />,
                cell: (info) => {
                    const item: any = info.row.original;
                    const purpose = item.kebutuhan || item.usage_purpose || "-";
                    const budgetText =
                        item.budget_range ||
                        (item.budgetMin !== undefined && item.budgetMax !== undefined
                            ? `Rp ${Number(item.budgetMin).toLocaleString("id-ID")} - Rp ${Number(item.budgetMax).toLocaleString("id-ID")}`
                            : "-");
                    return (
                        <div>
                            <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                <span>{purpose}</span>
                            </div>
                            <div className="text-xs text-emerald-600 font-semibold font-mono mt-0.5 flex items-center gap-1">
                                <span>Budget: {budgetText}</span>
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("recommendationWeights", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Preferensi Bobot" />,
                cell: (info) => {
                    const rw = info.getValue();
                    if (!rw || !Array.isArray(rw) || rw.length === 0) return <span className="text-gray-400 font-mono text-xs">-</span>;

                    const getCriteriaColorClass = (codeOrName: string) => {
                        const term = codeOrName.toLowerCase();
                        if (term.includes("harga") || term.includes("c1")) {
                            return "bg-red-100 text-red-700 border-red";
                        }
                        if (term.includes("ram") || term.includes("c2")) {
                            return "bg-gray-100 text-gray-700 border-gray-200";
                        }
                        if (term.includes("processor") || term.includes("cpu") || term.includes("c6")) {
                            return "bg-blue-100 text-blue-700 border-blue-200";
                        }
                        if (term.includes("storage") || term.includes("c3")) {
                            return "bg-gray-100 text-gray-700 border-gray-200";
                        }
                        return "bg-gray-100 text-gray-700 border-gray-200";
                    };

                    return (
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {rw.map((w: any, index: number) => {
                                const label = w.criteria?.name || w.criteria?.code || `C${w.criteriaId}`;
                                const percentage = w.weightPercentage ?? (w.weight ? w.weight * 100 : 0);
                                return (
                                    <span
                                        key={index}
                                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${getCriteriaColorClass(label)}`}
                                    >
                                        {label}: {percentage}%
                                    </span>
                                );
                            })}
                        </div>
                    );
                },
            }),
            columnHelper.accessor("recommendationResults", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Rekomendasi" />,
                cell: (info) => {
                    const results = info.getValue();
                    if (!results || !Array.isArray(results) || results.length === 0) return <span className="text-gray-400 font-mono text-xs">-</span>;
                    
                    const topSaw = results.find(
                        (r: any) =>
                            (r.methodUsed === "SAW" || r.method_used === "SAW") &&
                            (r.ranking === 1 || r.rank === 1)
                    ) || results[0];

                    const productName = topSaw.productStore?.product?.modelName || topSaw.product_name || "Laptop";
                    const score = topSaw.score ?? topSaw.saw_score ?? 0;

                    return (
                        <div className="p-2.5 rounded-2xl bg-gray-50 w-fit">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900 text-sm">
                                    {productName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mt-1 text-xs">
                                <span className="font-mono text-gray-500 font-semibold">
                                    Skor: <strong className="text-black">{Number(score).toFixed(4)}</strong>
                                </span>
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
                            <Link
                                to={`/admin/recommendations/${item.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-gray-500 font-semibold text-xs rounded-xl transition-all active:scale-95 shadow-2xs"
                                title="Lihat Bedah Matriks Normalisasi(ResultDetail)" 
                            >
                                <span>Detail Metode</span>
                            </Link>
                            <Button
                                type="button"
                                variant="danger"
                                icon={<Trash2 className="w-3 h-3" />}
                                isLoading={deletingId === item.id}
                                onClick={() => onDelete(item.id, item.user_name || item.customer?.name || "Customer")}
                                className="text-xs! py-1.5! px-3! rounded-xl font-bold shadow-xs cursor-pointer"
                            />
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