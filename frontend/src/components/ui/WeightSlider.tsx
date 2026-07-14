import { useState } from "react";

type Criteria = {
  id: number;
  code: string;
  name: string;
  type: string;
};

type WeightSliderProps = {
  criteria: Criteria[];
  onChange: (weights: { criteriaId: number; weight: number }[]) => void;
};

export default function WeightSlider({ criteria, onChange }: WeightSliderProps) {
  const [weights, setWeights] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    criteria.forEach((c) => {
      initial[c.id] = 3; // Default: 3 (tengah)
    });
    return initial;
  });

  const handleChange = (criteriaId: number, value: number) => {
    const newWeights = { ...weights, [criteriaId]: value };
    setWeights(newWeights);

    const weightArray = Object.entries(newWeights).map(([id, weight]) => ({
      criteriaId: Number(id),
      weight,
    }));
    onChange(weightArray);
  };

  const getLabel = (value: number) => {
    const labels: Record<number, string> = {
      1: "Sangat Rendah",
      2: "Rendah",
      3: "Normal",
      4: "Tinggi",
      5: "Sangat Tinggi",
    };
    return labels[value] || "";
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold">Prioritas Kriteria</h3>
      <p className="text-sm text-zinc-500">Geser slider untuk atur bobot (1-5)</p>

      <div className="space-y-5">
        {criteria.map((crit) => (
          <div key={crit.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-black text-white">
                  {crit.code}
                </span>
                <span className="font-medium text-sm">{crit.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm">{weights[crit.id]}</span>
                <span className="text-[10px] text-zinc-400 ml-1">
                  {getLabel(weights[crit.id])}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={weights[crit.id]}
              onChange={(e) => handleChange(crit.id, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
            />

            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}