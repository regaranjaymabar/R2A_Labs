
interface ResultInfoCardProps {
  session: {
    id: number | string;
    user_name: string;
    user_email: string;
    usage_purpose: string;
    budget_range: string;
    created_at: string;
    user_choice: string;
  };
  weightsMap: Record<string, number>;
}

export function ResultInfoCard({ session, weightsMap }: ResultInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3.5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Matriks Analisis SPK : {session.user_name}
            </h1>
            <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5 mt-0.5">
              <span>Tanggal: {session.created_at}</span>
            </p>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-gray-50 text-gray-500   border border-gray-200/60 flex items-center gap-1.5">
            Pilihan User: {session.user_choice || "-"}
          </span>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl space-y-3 text-xs">
          <span className="font-bold text-black uppercase tracking-wider block">Kebutuhan & Budget:</span>
          <div className="flex items-center justify-between font-bold text-sm">
            <span className="text-gray-900 flex items-center gap-1.5">
              {session.usage_purpose}
            </span>
            <span className="text-emerald-600 font-mono">
              {session.budget_range}
            </span>
          </div>
        </div>

        <div className="rounded-2xl space-y-2 text-xs">
          <span className="font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
            Bobot Input Kriteria (C1 - C8)
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[10px] font-bold">
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Harga: {((weightsMap.C1 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">RAM: {((weightsMap.C2 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Storage: {((weightsMap.C3 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Baterai: {((weightsMap.C4 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Berat: {((weightsMap.C5 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Prosesor: {((weightsMap.C6 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Layar: {((weightsMap.C7 ?? 0) * 100).toFixed(0)}%</div>
            <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-300 text-gray-800 shadow-3xs">Rilis: {((weightsMap.C8 ?? 0) * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
