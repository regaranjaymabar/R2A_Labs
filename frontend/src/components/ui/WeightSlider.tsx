import { useState, useEffect } from "react";

type Criteria = {
  id: number;
  code: string;
  name: string;
  type: string;
};

type Props = {
  criteria: Criteria[];
  onChange: (weights: { criteriaId: number; weight: number }[]) => void;
};

const STORAGE_KEY = "spk_slider_values";

export default function WeightSlider({ criteria, onChange }: Props) {
  const [weights, setWeights] = useState<Record<number, number>>(() => {
    // Load dari localStorage dulu
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const init: Record<number, number> = {};
    criteria.forEach((c) => (init[c.id] = 5));
    return init;
  });

  // Kirim ke parent + simpan ke localStorage
  const updateWeights = (newWeights: Record<number, number>) => {
    setWeights(newWeights);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWeights));
    const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
    const normalized = Object.entries(newWeights).map(([k, v]) => ({
      criteriaId: Number(k),
      weight: total > 0 ? v / total : 0,
    }));
    onChange(normalized);
  };

  const handleChange = (id: number, val: number) => {
    updateWeights({ ...weights, [id]: val });
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">Prioritas (1-10)</h4>
      <div className="grid grid-cols-2 gap-3">
        {criteria.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700 min-w-20">{c.name}</span>
            <input type="range" min="1" max="10" value={weights[c.id] || 5}
              onChange={(e) => handleChange(c.id, Number(e.target.value))}
              className="w-full h-1.5 accent-black cursor-pointer" />
            <span className="text-xs font-bold w-6">{weights[c.id] || 5}</span>
          </div>
        ))}
      </div>
    </div>
  );
}