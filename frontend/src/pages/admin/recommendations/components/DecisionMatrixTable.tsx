import { HelpCircle } from "lucide-react";

interface DecisionMatrixTableProps {
  decisionMatrix: Array<{
    alternativeName: string;
    brand: string;
    is_chosen_by_user: boolean;
    storeName: string;
    values: Record<string, number>;
  }>;
  activeAlternatives: any[];
  activeFormulaDetails: { cellKey: string; description: string } | null;
  onCellClick: (cellKey: string, description: string) => void;
  criterias: Array<{ code: string; name: string; type: string; desc: string }>;
}

export function DecisionMatrixTable({
  decisionMatrix,
  activeAlternatives,
  activeFormulaDetails,
  onCellClick,
  criterias,
}: DecisionMatrixTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>* Menunjukkan konversi nilai spesifikasi ke skala numerik [1 sampai 5]</span>
        <span className="font-mono text-purple-600 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg">
          <HelpCircle className="w-3.5 h-3.5" />
          Klik sel nilai untuk melihat spesifikasi mentahnya!
        </span>
      </div>

      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
            <th className="py-3 px-4 min-w-[200px]">Alternatif Laptop</th>
            {criterias.map((c) => (
              <th key={c.code} className="py-3 px-3 text-center" title={c.desc}>
                <span className="block font-mono text-[10px] text-gray-900 bg-gray-200/80 px-1 rounded-sm w-fit mx-auto mb-0.5">{c.code}</span>
                <span>{c.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {decisionMatrix.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                row.is_chosen_by_user ? "bg-purple-50/30" : ""
              }`}
            >
              <td className="py-3.5 px-4 font-bold text-gray-900">
                <div>
                  {row.alternativeName}
                  {row.is_chosen_by_user && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 text-[8px] bg-emerald-500 text-white rounded font-bold uppercase tracking-wide">
                      Chosen
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium block">
                  {row.brand} | Toko: <span className="text-purple-600 font-semibold">{row.storeName}</span>
                </span>
              </td>
              {criterias.map((crit) => {
                const val = row.values[crit.code];
                const rawAlt = activeAlternatives.find((a) => a.name === row.alternativeName && a.storeName === row.storeName);
                let rawSpec = "-";
                if (rawAlt) {
                  const dbVal = rawAlt.dbWeights?.find((w: any) => w.criteria_code === crit.code);
                  const isHarga = crit.code === "C1" || crit.name.toLowerCase().includes("harga");
                  if (dbVal && dbVal.sub_criteria_description && dbVal.sub_criteria_description !== "-" && !isHarga) {
                    rawSpec = dbVal.sub_criteria_description;
                  } else {
                    if (isHarga) rawSpec = `Rp ${rawAlt.price.toLocaleString("id-ID")}`;
                    else if (crit.code === "C2") rawSpec = rawAlt.ram;
                    else if (crit.code === "C3") rawSpec = rawAlt.storage;
                    else if (crit.code === "C4") rawSpec = rawAlt.battery;
                    else if (crit.code === "C5") rawSpec = `${rawAlt.weight} Kg`;
                    else if (crit.code === "C6") rawSpec = rawAlt.cpu;
                    else if (crit.code === "C7") rawSpec = `${rawAlt.screenSize || "14"}"`;
                    else if (crit.code === "C8") rawSpec = rawAlt.releaseYear;
                    else if (dbVal && dbVal.value_numeric !== undefined) rawSpec = String(dbVal.value_numeric);
                  }
                }

                const activeCellKey = `${idx}-${crit.code}`;
                const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                return (
                  <td
                    key={crit.code}
                    onClick={() =>
                      onCellClick(
                        activeCellKey,
                        `Laptop: ${row.alternativeName}\nSpesifikasi mentah: "${rawSpec}"\nTipe Kriteria: ${crit.type.toUpperCase()} (${crit.desc})\nSkala Mapped: ${val} (Skala 1-5)`
                      )
                    }
                    className={`py-3.5 px-3 text-center font-mono font-bold transition-all cursor-pointer ${
                      isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                    }`}
                  >
                    <span className="bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200/50 block hover:bg-purple-50">
                      {val}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
