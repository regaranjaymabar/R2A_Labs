import { useMemo } from "react";

interface FinalRankingListProps {
  activeMethod: "SAW" | "WP" | "TOPSIS";
  activeAlternatives: Array<{
    productId: number;
    rank: number;
    name: string;
    brand: string;
    price: number;
    ram: string;
    cpu: string;
    score: number;
    storeName: string;
    is_chosen_by_user: boolean;
  }>;
  wpCalculations: Array<{
    alternativeName: string;
    brand: string;
    storeName: string;
    price: number;
    s: number;
    v: number;
  }>;
  topsisCalculations: Array<{
    alternativeName: string;
    brand: string;
    storeName: string;
    price: number;
    dPlus: number;
    dMinus: number;
    c: number;
    idealPositive: Record<string, number>;
    idealNegative: Record<string, number>;
  }>;
}

export function FinalRankingList({
  activeMethod,
  activeAlternatives,
  wpCalculations,
  topsisCalculations,
}: FinalRankingListProps) {
  
  // Grouping SAW by laptop name
  const sawGroups = useMemo(() => {
    const sorted = [...activeAlternatives].sort((a, b) => b.score - a.score);
    const groups: Record<string, typeof activeAlternatives> = {};
    sorted.forEach((laptop) => {
      const name = laptop.name;
      if (!groups[name]) groups[name] = [];
      groups[name].push(laptop);
    });
    // Sort groups based on the best score in each group (first item in array)
    return Object.values(groups).sort((a, b) => b[0].score - a[0].score);
  }, [activeAlternatives]);

  // Grouping WP by laptop name
  const wpGroups = useMemo(() => {
    const sorted = [...wpCalculations].sort((a, b) => b.v - a.v);
    const groups: Record<string, typeof sorted> = {};
    sorted.forEach((item) => {
      const name = item.alternativeName;
      if (!groups[name]) groups[name] = [];
      groups[name].push(item);
    });
    return Object.values(groups).sort((a, b) => b[0].v - a[0].v);
  }, [wpCalculations]);

  // Grouping TOPSIS by laptop name
  const topsisGroups = useMemo(() => {
    const sorted = [...topsisCalculations].sort((a, b) => b.c - a.c);
    const groups: Record<string, typeof sorted> = {};
    sorted.forEach((item) => {
      const name = item.alternativeName;
      if (!groups[name]) groups[name] = [];
      groups[name].push(item);
    });
    return Object.values(groups).sort((a, b) => b[0].c - a[0].c);
  }, [topsisCalculations]);

  return (
    <div className="space-y-6">
      <div className="text-xs text-gray-500">
        Menampilkan peringkat alternatif dari skor tertinggi ke terendah menggunakan metode <strong className="font-bold text-black">{activeMethod}</strong>. Laptop yang sama dikelompokkan berdasarkan toko penyedia yang menjualnya.
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* SAW Perangkingan */}
        {activeMethod === "SAW" &&
          sawGroups.map((group, groupIdx) => {
            const bestLaptop = group[0];
            const isChosen = group.some((l) => l.is_chosen_by_user);
            const rankLabel = groupIdx + 1;

            return (
              <div
                key={groupIdx}
                className={`p-6 rounded-3xl border transition-all bg-white border-gray-200 hover:border-gray-300 ${
                  isChosen ? "ring-2 ring-purple-500/10 border-purple-300" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Rank badge */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${
                      rankLabel === 1
                        ? "bg-[#FBC02D] text-white"
                        : rankLabel === 2
                        ? "bg-[#676767] text-white"
                        : "bg-[#95271D] text-white"
                    }`}
                  >
                    #{rankLabel}
                  </div>

                  <div className="flex-1 space-y-3.5">
                    {/* Laptop Header */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {bestLaptop.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-600 font-bold border border-gray-200">
                          {bestLaptop.brand}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        RAM: {bestLaptop.ram} | CPU: {bestLaptop.cpu}
                      </p>
                    </div>

                    {/* Stores List */}
                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-3 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Toko Penyedia & Penawaran Harga:
                      </span>
                      <div className="divide-y divide-gray-100">
                        {group.map((laptop, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 font-mono">#{idx + 1}</span>
                              <span className="font-bold text-gray-900">{laptop.storeName}</span>
                              {laptop.is_chosen_by_user && (
                                <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-500 text-white font-bold uppercase tracking-wider">
                                  ⭐ Chosen
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-right">
                              <span className="font-mono text-emerald-600 font-bold">
                                Rp {laptop.price.toLocaleString("id-ID")}
                              </span>
                              <span className="font-mono text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                Skor: {laptop.score.toFixed(4)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* WP Perangkingan */}
        {activeMethod === "WP" &&
          wpGroups.map((group, groupIdx) => {
            const bestItem = group[0];
            const originalLaptop = activeAlternatives.find((a) => a.name === bestItem.alternativeName);
            const isChosen = group.some((item) => {
              const original = activeAlternatives.find((a) => a.name === item.alternativeName && a.storeName === item.storeName);
              return original?.is_chosen_by_user;
            });
            const rankLabel = groupIdx + 1;

            return (
              <div
                key={groupIdx}
                className={`p-6 rounded-3xl border transition-all bg-white border-gray-200 hover:border-gray-300 ${
                  isChosen ? "ring-2 ring-purple-500/10 border-purple-300" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Rank badge */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${
                      rankLabel === 1
                        ? "bg-[#FBC02D] text-white"
                        : rankLabel === 2
                        ? "bg-[#676767] text-white"
                        : "bg-[#95271D] text-white"
                    }`}
                  >
                    #{rankLabel}
                  </div>

                  <div className="flex-1 space-y-3.5">
                    {/* Laptop Header */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {bestItem.alternativeName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-600 font-bold border border-gray-200">
                          {bestItem.brand}
                        </span>
                      </div>
                      {originalLaptop && (
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          RAM: {originalLaptop.ram} | CPU: {originalLaptop.cpu}
                        </p>
                      )}
                    </div>

                    {/* Stores List */}
                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-3 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Toko Penyedia & Penawaran Harga:
                      </span>
                      <div className="divide-y divide-gray-100">
                        {group.map((item, idx) => {
                          const original = activeAlternatives.find((a) => a.name === item.alternativeName && a.storeName === item.storeName);
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-2 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono">#{idx + 1}</span>
                                <span className="font-bold text-gray-900">
                                  {item.storeName}
                                </span>
                                {original?.is_chosen_by_user && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-500 text-white font-bold uppercase tracking-wider">
                                    ⭐ Chosen
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-right">
                                <span className="font-mono text-emerald-600 font-bold">
                                  Rp {item.price.toLocaleString("id-ID")}
                                </span>
                                <span className="font-mono text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                  Vektor V: {item.v.toFixed(4)} (S: {item.s.toFixed(2)})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* TOPSIS Perangkingan */}
        {activeMethod === "TOPSIS" &&
          topsisGroups.map((group, groupIdx) => {
            const bestItem = group[0];
            const originalLaptop = activeAlternatives.find((a) => a.name === bestItem.alternativeName);
            const isChosen = group.some((item) => {
              const original = activeAlternatives.find((a) => a.name === item.alternativeName && a.storeName === item.storeName);
              return original?.is_chosen_by_user;
            });
            const rankLabel = groupIdx + 1;

            return (
              <div
                key={groupIdx}
                className={`p-6 rounded-3xl border transition-all bg-white border-gray-200 hover:border-gray-300 ${
                  isChosen ? "ring-2 ring-purple-500/10 border-purple-300" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Rank badge */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${
                      rankLabel === 1
                        ? "bg-[#FBC02D] text-white"
                        : rankLabel === 2
                        ? "bg-[#676767] text-white"
                        : "bg-[#95271D] text-white"
                    }`}
                  >
                    #{rankLabel}
                  </div>

                  <div className="flex-1 space-y-3.5">
                    {/* Laptop Header */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {bestItem.alternativeName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-600 font-bold border border-gray-200">
                          {bestItem.brand}
                        </span>
                      </div>
                      {originalLaptop && (
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          RAM: {originalLaptop.ram} | CPU: {originalLaptop.cpu}
                        </p>
                      )}
                    </div>

                    {/* Stores List */}
                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-3 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Toko Penyedia & Penawaran Harga:
                      </span>
                      <div className="divide-y divide-gray-100">
                        {group.map((item, idx) => {
                          const original = activeAlternatives.find((a) => a.name === item.alternativeName && a.storeName === item.storeName);
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-2 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono">#{idx + 1}</span>
                                <span className="font-bold text-gray-900">
                                  {item.storeName}
                                </span>
                                {original?.is_chosen_by_user && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-500 text-white font-bold uppercase tracking-wider">
                                    ⭐ Chosen
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-right">
                                <span className="font-mono text-emerald-600 font-bold">
                                  Rp {item.price.toLocaleString("id-ID")}
                                </span>
                                <span className="font-mono text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                  Closeness (C): {item.c.toFixed(4)} (D+: {item.dPlus.toFixed(2)}, D-: {item.dMinus.toFixed(2)})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
