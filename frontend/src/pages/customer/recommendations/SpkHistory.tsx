import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Award,
  History,
  Sliders,
  ArrowRight,
  Eye,
  Calendar,
  Loader2,
} from "lucide-react";
import { useGet } from "../../../hooks/useGet";
import { customerSpkService, type CustomerSpkRequest } from "../../../services/customerSpkService";
import { DataTable, DataTableColumnHeader } from "../../../components/ui/common/DataTable";

const columnHelper = createColumnHelper<CustomerSpkRequest>();

export default function SpkHistory() {
  const { data: fetchedData, isLoading } = useGet<CustomerSpkRequest[]>({
    queryKey: ["customer-spk-requests"],
    queryFn: customerSpkService.getMyRequests,
    offlineFallbackData: [],
  });

  const data = fetchedData || [];
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

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
      columnHelper.accessor("createdAt", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Pembuatan" />,
        cell: (info) => {
          const dateVal = info.getValue();
          if (!dateVal) return <span className="text-gray-400 font-mono text-xs">-</span>;
          return (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {new Date(dateVal).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.kebutuhan, {
        id: "kebutuhan",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kebutuhan & Budget" />,
        cell: (info) => {
          const item = info.row.original;
          const budgetText = `Rp ${Number(item.budgetMin).toLocaleString("id-ID")} - Rp ${Number(item.budgetMax).toLocaleString("id-ID")}`;
          return (
            <div className="max-w-xs md:max-w-md">
              <div className="font-bold text-gray-900 text-sm truncate" title={item.kebutuhan}>
                {item.kebutuhan}
              </div>
              <div className="text-xs text-emerald-600 font-semibold font-mono mt-0.5">
                Budget: {budgetText}
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
              return "bg-red-50 text-red-700 border-red-200";
            }
            if (term.includes("ram") || term.includes("c2")) {
              return "bg-slate-50 text-slate-700 border-slate-200";
            }
            if (term.includes("processor") || term.includes("cpu") || term.includes("c6")) {
              return "bg-blue-50 text-blue-700 border-blue-200";
            }
            if (term.includes("storage") || term.includes("c3")) {
              return "bg-zinc-50 text-zinc-700 border-zinc-200";
            }
            return "bg-purple-50 text-purple-700 border-purple-200";
          };

          return (
            <div className="flex flex-wrap gap-1 max-w-[240px]">
              {rw.map((w: any, index: number) => {
                const label = w.criteria?.name || w.criteria?.code || `C${w.criteriaId}`;
                const percentage = w.weightPercentage ?? (w.weight ? w.weight * 100 : 0);
                return (
                  <span
                    key={index}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getCriteriaColorClass(label)}`}
                  >
                    {label}: {percentage.toFixed(0)}%
                  </span>
                );
              })}
            </div>
          );
        },
      }),
      columnHelper.accessor("recommendationResults", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rekomendasi Utama" />,
        cell: (info) => {
          const results = info.getValue();
          if (!results || !Array.isArray(results) || results.length === 0) return <span className="text-gray-400 font-mono text-xs">-</span>;

          // Find top ranking item (rank = 1) from the results
          const topResult = results.find(
            (r: any) =>
              (r.methodUsed === "TOPSIS" || r.method === "TOPSIS" || r.method_used === "TOPSIS") &&
              (r.ranking === 1 || r.rank === 1)
          ) || results.find(
            (r: any) =>
              (r.methodUsed === "SAW" || r.method === "SAW" || r.method_used === "SAW") &&
              (r.ranking === 1 || r.rank === 1)
          ) || results[0];

          const name = topResult.product_name || topResult.productStore?.product?.modelName || "Laptop";
          const score = topResult.best_score ?? topResult.score ?? topResult.saw_score ?? 0;
          const percentage = (Number(score) * 100).toFixed(1);

          return (
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 max-w-[200px]">
              <div className="font-bold text-gray-900 text-xs truncate" title={name}>
                {name}
              </div>
              <div className="text-[10px] text-purple-700 font-black font-mono mt-0.5">
                Score: {percentage}%
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: (info) => {
          const status = info.getValue() || "PENDING";
          let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
          let label = "Tertunda";

          if (status === "CALCULATED" || status === "COMPLETED") {
            badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
            label = "Dihitung";
          }

          return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
              {label}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-semibold">Aksi</span>,
        cell: (info) => {
          const item = info.row.original;
          return (
            <Link
              to={`/spk/result/${item.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white hover:bg-zinc-800 font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Hasil</span>
            </Link>
          );
        },
      }),
    ],
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-zinc-150 pb-5 text-center sm:text-left">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <History className="w-8 h-8 text-black" />
            <span>Riwayat Request SPK</span>
          </h1>
          <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed mt-2">
            Lihat daftar riwayat perhitungan sistem pendukung keputusan (SPK) yang pernah Anda lakukan untuk menemukan laptop terbaik.
          </p>
        </div>
        <Link
          to="/spk/request"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap self-center sm:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>Buat Request Baru</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl p-4 rounded-3xl border border-zinc-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5 mr-2 font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
          </span>
          {(["ALL", "CALCULATED", "PENDING"] as const).map((status) => {
            const labels = {
              ALL: "Semua",
              CALCULATED: "Dihitung",
              PENDING: "Tertunda",
            };
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-zinc-500 font-medium">
          Total Request: <strong className="text-gray-900 font-bold">{data.length}</strong>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[30px] border border-gray-200/80 shadow-xl overflow-hidden p-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <span className="text-sm font-semibold text-zinc-500">Memuat riwayat request Anda...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            searchPlaceholder="Cari kebutuhan, budget, laptop..."
            emptyMessage="Belum ada riwayat pencarian SPK yang dibuat."
            defaultPageSize={10}
          />
        )}
      </div>
    </div>
  );
}
