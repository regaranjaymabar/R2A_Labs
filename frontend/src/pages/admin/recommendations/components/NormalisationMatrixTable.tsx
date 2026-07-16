import { HelpCircle } from "lucide-react";

interface NormalisationMatrixTableProps {
  activeMethod: "SAW" | "WP" | "TOPSIS";
  topsisSubTab: "R" | "Y" | "D";
  setTopsisSubTab: (tab: "R" | "Y" | "D") => void;
  activeFormulaDetails: { cellKey: string; description: string } | null;
  onCellClick: (cellKey: string, description: string) => void;
  criterias: Array<{ code: string; name: string; type: string; desc: string }>;

  // SAW props
  sawNormalizedMatrix: Array<{
    alternativeName: string;
    brand: string;
    is_chosen_by_user: boolean;
    storeName: string;
    norms: Record<string, number>;
    rawValues: Record<string, number>;
  }>;
  columnExtremes: Record<string, { min: number; max: number }>;

  // WP props
  wpCalculations: Array<{
    alternativeName: string;
    brand: string;
    is_chosen_by_user: boolean;
    storeName: string;
    norms: Record<string, number>;
    s: number;
    v: number;
  }>;

  // TOPSIS props
  topsisCalculations: Array<{
    alternativeName: string;
    brand: string;
    is_chosen_by_user: boolean;
    storeName: string;
    values: Record<string, number>;
    rValues: Record<string, number>;
    vValues: Record<string, number>;
    idealPositive: Record<string, number>;
    idealNegative: Record<string, number>;
    dPlus: number;
    dMinus: number;
    c: number;
  }>;
  columnSquareSums: Record<string, number>;
  weightsMap: Record<string, number>;
}

export function NormalisationMatrixTable({
  activeMethod,
  topsisSubTab,
  setTopsisSubTab,
  activeFormulaDetails,
  onCellClick,
  criterias,
  sawNormalizedMatrix,
  columnExtremes,
  wpCalculations,
  topsisCalculations,
  columnSquareSums,
  weightsMap,
}: NormalisationMatrixTableProps) {
  return (
    <div className="space-y-4">
      {activeMethod === "TOPSIS" && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-200 w-fit">
          <button
            type="button"
            onClick={() => setTopsisSubTab("R")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              topsisSubTab === "R"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Langkah 2.1: Matriks Ternormalisasi (R)
          </button>
          <button
            type="button"
            onClick={() => setTopsisSubTab("Y")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              topsisSubTab === "Y"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Langkah 2.2: Matriks Ternormalisasi Terbobot (Y)
          </button>
          <button
            type="button"
            onClick={() => setTopsisSubTab("D")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              topsisSubTab === "D"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Langkah 2.3: Jarak Ideal & Preferensi (D & V)
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>* Menampilkan hasil normalisasi berdasarkan sifat kriteria (Benefit / Cost)</span>
        <span className="font-mono text-purple-600 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg">
          <HelpCircle className="w-3.5 h-3.5" />
          Klik sel nilai untuk melihat rumus matematika rincinya!
        </span>
      </div>

      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
            <th className="py-3 px-4 min-w-[200px]">Alternatif Laptop</th>
            {(activeMethod !== "TOPSIS" || topsisSubTab === "R" || topsisSubTab === "Y") &&
              criterias.map((c) => (
                <th key={c.code} className="py-3 px-3 text-center" title={c.desc}>
                  <span className="block font-mono text-[10px] text-gray-900 bg-gray-200/80 px-1 rounded-sm w-fit mx-auto mb-0.5">{c.code}</span>
                  <span>{c.name}</span>
                </th>
              ))
            }
            {activeMethod === "WP" && (
              <>
                <th className="py-3 px-3 text-center text-purple-700 bg-purple-50/50 dark:bg-purple-950/20 font-bold">Vektor S</th>
                <th className="py-3 px-3 text-center text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold">Vektor V</th>
              </>
            )}
            {activeMethod === "TOPSIS" && topsisSubTab === "D" && (
              <>
                <th className="py-3 px-3 text-center text-amber-700 bg-amber-50/50 dark:bg-amber-950/20 font-bold">D+ (Ideal+)</th>
                <th className="py-3 px-3 text-center text-blue-700 bg-blue-50/50 dark:bg-blue-950/20 font-bold">D- (Ideal-)</th>
                <th className="py-3 px-3 text-center text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold">Kedekatan (V)</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Normalisasi SAW */}
          {activeMethod === "SAW" &&
            sawNormalizedMatrix.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                  row.is_chosen_by_user ? "bg-purple-50/30" : ""
                }`}
              >
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {row.alternativeName}
                  <span className="text-[10px] text-gray-400 font-medium block">
                    {row.brand} | Toko: <span className="text-purple-600 font-semibold">{row.storeName}</span>
                  </span>
                </td>
                {criterias.map((crit) => {
                  const val = row.norms[crit.code];
                  const x = row.rawValues[crit.code];
                  const ext = columnExtremes[crit.code];

                  const formatVal = (v: number) => {
                    if (crit.code === "C1") return `Rp ${v.toLocaleString("id-ID")}`;
                    return String(v);
                  };

                  const isCost = crit.type === "cost";
                  const formulaDesc = isCost
                    ? `Rumus Cost: R_ij = min(X_kj) / X_ij\n` +
                      `Perhitungan: ${formatVal(ext.min)} / ${formatVal(x)} = ${val.toFixed(4)}`
                    : `Rumus Benefit: R_ij = X_ij / max(X_kj)\n` +
                      `Perhitungan: ${formatVal(x)} / ${formatVal(ext.max)} = ${val.toFixed(4)}`;

                  const activeCellKey = `${idx}-${crit.code}`;
                  const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                  return (
                    <td
                      key={crit.code}
                      onClick={() => onCellClick(activeCellKey, formulaDesc)}
                      className={`py-3.5 px-3 text-center font-mono font-bold cursor-pointer ${
                        isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                      }`}
                    >
                      <span className="bg-indigo-50 text-gray-900 px-2.5 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-100 block">
                        {val.toFixed(4)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

          {/* Normalisasi WP */}
          {activeMethod === "WP" &&
            wpCalculations.map((row, idx) => {
              return (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                    row.is_chosen_by_user ? "bg-purple-50/30" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {row.alternativeName}
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {row.brand} | Toko: <span className="text-purple-600 font-semibold">{row.storeName}</span>
                    </span>
                  </td>
                  {criterias.map((crit) => {
                    const normVal = row.norms[crit.code];
                    const w = weightsMap[crit.code] ?? 0;
                    const isCost = crit.type === "cost";
                    const exponent = isCost ? -w : w;

                    const formatRawX = (v: number) => {
                      if (crit.code === "C1") return `Rp ${v.toLocaleString("id-ID")}`;
                      return String(v);
                    };

                    const formulaDesc =
                      `Pangkat Bobot w_j = W_j\n` +
                      `w_${crit.code} = ${w} ${isCost ? "(Cost -> negatif)" : "(Benefit -> positif)"}\n\n` +
                      `Perhitungan Nilai Pangkat X_ij^w_j:\n` +
                      `Nilai Skala X = ${formatRawX(Number(row.norms[crit.code + "_raw"] ?? 1))} pangkat ${exponent} = ${normVal.toFixed(6)}`;

                    const activeCellKey = `${idx}-${crit.code}`;
                    const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                    return (
                      <td
                        key={crit.code}
                        onClick={() => onCellClick(activeCellKey, formulaDesc)}
                        className={`py-3.5 px-3 text-center font-mono font-bold cursor-pointer ${
                          isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                        }`}
                      >
                        <span className="bg-purple-50 text-gray-900 px-2.5 py-1 rounded-lg border border-purple-100 hover:bg-purple-100 block">
                          {normVal.toFixed(4)}
                        </span>
                      </td>
                    );
                  })}
                  {/* Vektor S */}
                  <td
                    onClick={() =>
                      onCellClick(
                        `${idx}-vektorS`,
                        `Vektor S_i = product(X_ij^w_j)\n` +
                          `Hasil Kali Seluruh Kriteria Pangkat: ${row.s.toFixed(6)}`
                      )
                    }
                    className="py-3.5 px-3 text-center font-mono font-bold cursor-pointer bg-purple-50/30 text-purple-700"
                  >
                    <span className="bg-purple-100/50 px-2.5 py-1 rounded-lg border border-purple-200 block hover:bg-purple-200/50">
                      {row.s.toFixed(4)}
                    </span>
                  </td>
                  {/* Vektor V */}
                  <td
                    onClick={() =>
                      onCellClick(
                        `${idx}-vektorV`,
                        `Vektor V_i = S_i / sum(S_k)\n` +
                          `Pembagian Vektor S alternatif ini dengan Total Seluruh S:\n` +
                          `Hasil Vektor V: ${row.v.toFixed(6)}`
                      )
                    }
                    className="py-3.5 px-3 text-center font-mono font-bold cursor-pointer bg-emerald-50/30 text-emerald-700"
                  >
                    <span className="bg-emerald-100/50 px-2.5 py-1 rounded-lg border border-emerald-200 block hover:bg-emerald-200/50">
                      {row.v.toFixed(4)}
                    </span>
                  </td>
                </tr>
              );
            })}

          {/* TOPSIS - Langkah 2.1: Matriks Ternormalisasi (R) */}
          {activeMethod === "TOPSIS" && topsisSubTab === "R" && (
            <>
              {topsisCalculations.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                    row.is_chosen_by_user ? "bg-purple-50/30" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {row.alternativeName}
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {row.brand} | Toko: <span className="text-purple-600 font-semibold">{row.storeName}</span>
                    </span>
                  </td>
                  {criterias.map((crit) => {
                    const rVal = row.rValues[crit.code];
                    const squareSum = columnSquareSums[crit.code];
                    const x = row.values[crit.code];

                    const activeCellKey = `R-${idx}-${crit.code}`;
                    const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                    const formatRawX = (v: number) => {
                      if (crit.code === "C1") return `Rp ${v.toLocaleString("id-ID")}`;
                      return String(v);
                    };

                    const formulaDesc =
                      `Normalisasi Vektor R_ij = X_ij / sqrt(sum(X_kj^2))\n` +
                      `Perhitungan R: ${formatRawX(x)} / ${crit.code === "C1" ? `Rp ${squareSum.toLocaleString("id-ID")}` : squareSum.toFixed(4)} = ${rVal.toFixed(4)}`;

                    return (
                      <td
                        key={crit.code}
                        onClick={() => onCellClick(activeCellKey, formulaDesc)}
                        className={`py-3.5 px-3 text-center font-mono font-bold cursor-pointer ${
                          isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                        }`}
                      >
                        <span className="bg-indigo-50 text-gray-900 px-2 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-100 block">
                          {rVal.toFixed(4)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Row Pembagi */}
              <tr className="bg-gray-100/60 border-t-2 border-gray-200 font-bold text-gray-900">
                <td className="py-3 px-4 font-bold">Pembagi (Xⱼ)</td>
                {criterias.map((crit) => {
                  const val = columnSquareSums[crit.code] ?? 0;
                  return (
                    <td key={crit.code} className="py-3 px-3 text-center font-mono">
                      {crit.code === "C1" ? `Rp ${val.toLocaleString("id-ID")}` : val.toFixed(4)}
                    </td>
                  );
                })}
              </tr>
            </>
          )}

          {/* TOPSIS - Langkah 2.2: Matriks Ternormalisasi Terbobot (Y) */}
          {activeMethod === "TOPSIS" && topsisSubTab === "Y" && (
            <>
              {topsisCalculations.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                    row.is_chosen_by_user ? "bg-purple-50/30" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {row.alternativeName}
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {row.brand} | Toko: <span className="text-purple-600 font-semibold">{row.storeName}</span>
                    </span>
                  </td>
                  {criterias.map((crit) => {
                    const rVal = row.rValues[crit.code];
                    const vVal = row.vValues[crit.code];
                    const w = weightsMap[crit.code] ?? 0;

                    const activeCellKey = `Y-${idx}-${crit.code}`;
                    const isCellSelected = activeFormulaDetails?.cellKey === activeCellKey;

                    const formulaDesc =
                      `Bobot Ternormalisasi Terbobot Y_ij = R_ij * W_j\n` +
                      `Perhitungan Y: ${rVal.toFixed(4)} * ${w} = ${vVal.toFixed(4)}`;

                    return (
                      <td
                        key={crit.code}
                        onClick={() => onCellClick(activeCellKey, formulaDesc)}
                        className={`py-3.5 px-3 text-center font-mono font-bold cursor-pointer ${
                          isCellSelected ? "bg-purple-100 text-purple-900 ring-2 ring-purple-500/20 rounded-lg scale-95" : "text-gray-900"
                        }`}
                      >
                        <span className="bg-purple-50 text-gray-900 px-2 py-1 rounded-lg border border-purple-100 hover:bg-purple-100 block">
                          {vVal.toFixed(4)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Row A+ */}
              <tr className="bg-purple-50/40 border-t border-gray-200 font-bold text-purple-900">
                <td className="py-3 px-4 font-bold">Ideal Positif (A⁺)</td>
                {criterias.map((crit) => {
                  const val = topsisCalculations[0]?.idealPositive?.[crit.code] ?? 0;
                  return (
                    <td key={crit.code} className="py-3 px-3 text-center font-mono text-purple-700">
                      {val.toFixed(4)}
                    </td>
                  );
                })}
              </tr>

              {/* Row A- */}
              <tr className="bg-amber-50/40 border-t border-gray-200 font-bold text-amber-900">
                <td className="py-3 px-4 font-bold">Ideal Negatif (A⁻)</td>
                {criterias.map((crit) => {
                  const val = topsisCalculations[0]?.idealNegative?.[crit.code] ?? 0;
                  return (
                    <td key={crit.code} className="py-3 px-3 text-center font-mono text-amber-700">
                      {val.toFixed(4)}
                    </td>
                  );
                })}
              </tr>
            </>
          )}

          {/* TOPSIS - Langkah 2.3: Jarak Ideal & Preferensi (D & V) */}
          {activeMethod === "TOPSIS" && topsisSubTab === "D" &&
            topsisCalculations.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                  row.is_chosen_by_user ? "bg-purple-50/30" : ""
                }`}
              >
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {row.alternativeName}
                  <span className="text-[10px] text-gray-400 font-medium block">
                    {row.brand} | Toko: <span className="text-purple-600 font-semibold">{row.storeName}</span>
                  </span>
                </td>
                {/* D+ */}
                <td
                  onClick={() =>
                    onCellClick(
                      `${idx}-dPlus`,
                      `Jarak ke Solusi Ideal Positif D_i^+ = sqrt(sum((V_ij - A_j^+)^2))\n` +
                        `Hasil Jarak (D+): ${row.dPlus.toFixed(6)}`
                    )
                  }
                  className="py-3.5 px-3 text-center font-mono font-bold cursor-pointer bg-amber-50/30 text-amber-700"
                >
                  <span className="bg-amber-100/50 px-2.5 py-1 rounded-lg border border-amber-200 block hover:bg-amber-200/50">
                    {row.dPlus.toFixed(4)}
                  </span>
                </td>

                {/* D- */}
                <td
                  onClick={() =>
                    onCellClick(
                      `${idx}-dMinus`,
                      `Jarak ke Solusi Ideal Negatif D_i^- = sqrt(sum((V_ij - A_j^-)^2))\n` +
                        `Hasil Jarak (D-): ${row.dMinus.toFixed(6)}`
                    )
                  }
                  className="py-3.5 px-3 text-center font-mono font-bold cursor-pointer bg-blue-50/30 text-blue-700"
                >
                  <span className="bg-blue-100/50 px-2.5 py-1 rounded-lg border border-blue-200 block hover:bg-blue-200/50">
                    {row.dMinus.toFixed(4)}
                  </span>
                </td>

                {/* V */}
                <td
                  onClick={() =>
                    onCellClick(
                      `${idx}-closeness`,
                      `Nilai Preferensi V_i = D_i^- / (D_i^+ + D_i^-)\n` +
                        `Perhitungan: ${row.dMinus.toFixed(6)} / (${row.dPlus.toFixed(6)} + ${row.dMinus.toFixed(6)}) = ${row.c.toFixed(6)}`
                    )
                  }
                  className="py-3.5 px-3 text-center font-mono font-bold cursor-pointer bg-emerald-50/30 text-emerald-700"
                >
                  <span className="bg-emerald-100/50 px-2.5 py-1 rounded-lg border border-emerald-200 block hover:bg-emerald-200/50 font-extrabold text-gray-900">
                    {row.c.toFixed(4)}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
