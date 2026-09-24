/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, TrendingUp, Eye, EyeOff } from "lucide-react";
import { useGet } from "../../hooks/useGet";
import { api } from "../../lib/axios";

export default function SpkHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: history = [], isLoading } = useGet({
    queryKey: ["spk-history"],
    queryFn: () => api.get("/api/customer/spk/requests").then(r => r.data.data || []),
  });

  return (
    <div id="spk-history" className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-lg">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Riwayat Rekomendasi</h3>
            <p className="text-sm text-zinc-500">{history.length} rekomendasi tersimpan</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* List */}
      {isOpen && (
        <div className="mt-6 space-y-3 max-h-150 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="text-center text-zinc-500 py-6">Memuat riwayat...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-zinc-500 py-6">Belum ada riwayat rekomendasi.</p>
          ) : (
            history.map((req: any) => {
              const isExpanded = expandedId === req.id;

              return (
                <div
                  key={req.id}
                  className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all border border-white/5"
                >
                  {/* Tanggal & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-zinc-500">
                      {new Date(req.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "SUCCESS"
                          ? "bg-zinc-200 text-zinc-700"
                          : req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Kebutuhan */}
                  <p className="text-sm font-medium line-clamp-1">{req.kebutuhan}</p>

                  {/* Budget */}
                  <p className="text-xs text-zinc-500 mt-1">
                    Budget: Rp {req.budgetMin?.toLocaleString("id-ID")} – Rp {req.budgetMax?.toLocaleString("id-ID")}
                  </p>

                  {/* Metode */}
                  {req.recommendationResults && req.recommendationResults.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {req.recommendationResults.slice(0, 3).map((rr: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-black/5 rounded-lg text-xs">
                          <TrendingUp size={12} />
                          <span className="font-medium">{rr.method_used || rr.method}</span>
                        </div>
                      ))}

                      {/* Tombol View */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : req.id)}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-zinc-800 transition"
                      >
                        {isExpanded ? (
                          <>
                            <EyeOff size={14} /> Sembunyikan
                          </>
                        ) : (
                          <>
                            <Eye size={14} /> Lihat Detail
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                      {req.recommendationResults?.map((method: any) => (
                        <div key={method.method || method.method_used}>
                          <h4 className="text-sm font-bold text-black mb-2">
                            Metode: {method.method || method.method_used}
                          </h4>

                          {method.recommendations?.map((rec: any) => (
                            <div
                              key={rec.rank}
                              className="flex items-center gap-3 py-2 px-3 bg-white/5 rounded-xl mb-1.5"
                            >
                              <span className="text-lg font-bold w-8">#{rec.rank}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{rec.product_name}</p>
                                <p className="text-xs text-zinc-500">
                                  Skor: {rec.best_score?.toFixed(3)}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-zinc-700">
                                {rec.available_stores?.[0]?.price
                                  ? `Rp ${rec.available_stores[0].price.toLocaleString("id-ID")}`
                                  : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}