import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Sliders,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  Cpu,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";

// Simulasi Data Detail Hasil Perhitungan SAW untuk Session ID #1 (Andi Pratama)
const dummyResultSession = {
  id: 1,
  user_name: "Andi Pratama",
  user_email: "andi.pratama@gmail.com",
  usage_purpose: "Coding & Web Development",
  budget_range: "Rp 6.000.000 - Rp 10.000.000",
  created_at: "2026-07-02 14:30:25",
  user_choice: "Lenovo IdeaPad Slim 3",
  weights_applied: {
    price: 40,
    ram: 30,
    processor: 20,
    storage: 10,
  },
  ranked_laptops: [
    {
      rank: 1,
      name: "Lenovo IdeaPad Slim 3",
      brand: "Lenovo",
      price_display: "Rp 8.499.000",
      ram_display: "16 GB",
      cpu_display: "Core i5 Gen 12",
      storage_display: "512 GB SSD",
      saw_score: 0.895,
      is_chosen_by_user: true,
      criteria_breakdown: {
        price_norm: 0.85,
        ram_norm: 1.0,
        cpu_norm: 0.9,
        storage_norm: 0.8,
      },
    },
    {
      rank: 2,
      name: "ASUS Vivobook 14 X1404",
      brand: "ASUS",
      price_display: "Rp 8.299.000",
      ram_display: "8 GB",
      cpu_display: "Ryzen 5 7530U",
      storage_display: "512 GB SSD",
      saw_score: 0.85,
      is_chosen_by_user: false,
      criteria_breakdown: {
        price_norm: 0.9,
        ram_norm: 0.75,
        cpu_norm: 0.85,
        storage_norm: 0.8,
      },
    },
    {
      rank: 3,
      name: "Acer Aspire 5 Lite",
      brand: "Acer",
      price_display: "Rp 7.499.000",
      ram_display: "8 GB",
      cpu_display: "Core i3 Gen 12",
      storage_display: "512 GB SSD",
      saw_score: 0.795,
      is_chosen_by_user: false,
      criteria_breakdown: {
        price_norm: 1.0,
        ram_norm: 0.75,
        cpu_norm: 0.7,
        storage_norm: 0.8,
      },
    },
  ],
};

export default function ResultDetail() {
  const { id } = useParams();
  const [session] = useState(dummyResultSession);

  return (
    <div className="space-y-8 pb-12">
      {/* Tombol Kembali */}
      <div className="flex items-center justify-between">
        <Link to="/admin/recommendations">
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            label="Kembali ke Riwayat"
            className="text-xs! py-2! px-4! rounded-xl!"
          />
        </Link>
        <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
          Session ID: #{id || session.id}
        </span>
      </div>

      {/* Header Info User & Kebutuhan */}
      <div className="bg-white dark:bg-[#151216] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-black dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Analisis Matriks SAW: {session.user_name}
              </h1>
              <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Dilihat pada: {session.created_at}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Memilih: {session.user_choice}
            </span>
          </div>
        </div>

        {/* Ringkasan Preferensi User */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider block">Kriteria Pencarian:</span>
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="text-gray-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-500" />
                {session.usage_purpose}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {session.budget_range}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2 text-xs">
            <span className="font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Bobot Preferensi Slider (%):
            </span>
            <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold">
              <div className="bg-white dark:bg-[#151216] p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-black">RAM: {session.weights_applied.ram}%</div>
              <div className="bg-white dark:bg-[#151216] p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-amber-600">Harga: {session.weights_applied.price}%</div>
              <div className="bg-white dark:bg-[#151216] p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-blue-600">CPU: {session.weights_applied.processor}%</div>
              <div className="bg-white dark:bg-[#151216] p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-emerald-600">SSD: {session.weights_applied.storage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Peringkat Hasil SAW */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-black" />
          <span>Rincian Peringkat (Top 3 Hasil Perhitungan Matriks SAW)</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {session.ranked_laptops.map((laptop) => (
            <div
              key={laptop.rank}
              className={`p-6 rounded-3xl border transition-all ${laptop.is_chosen_by_user
                  ? "bg-linear-to-r from-purple-950/40 via-[#181519] to-[#151216] border-purple-500 shadow-xl ring-2 ring-purple-500/20"
                  : "bg-white dark:bg-[#151216] border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md shrink-0 ${laptop.rank === 1 ? "bg-amber-500 text-white" : laptop.rank === 2 ? "bg-gray-400 text-white" : "bg-amber-700 text-white"
                    }`}>
                    #{laptop.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {laptop.name}
                      </h3>
                      {laptop.is_chosen_by_user && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white uppercase tracking-wider shadow-2xs">
                          ⭐ Dipilih User
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                      {laptop.brand} | {laptop.price_display} | {laptop.ram_display} | {laptop.cpu_display}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right bg-gray-50 dark:bg-[#181519] px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Skor Preferensi (Vi)</span>
                  <span className="text-2xl font-extrabold text-black dark:text-purple-400 font-mono">
                    {laptop.saw_score.toFixed(3)}
                  </span>
                </div>
              </div>

              {/* Breakdown Normalisasi R */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Norm. Harga (Cost)</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">R = {laptop.criteria_breakdown.price_norm}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Norm. RAM (Benefit)</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">R = {laptop.criteria_breakdown.ram_norm}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Norm. CPU (Benefit)</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">R = {laptop.criteria_breakdown.cpu_norm}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Norm. SSD (Benefit)</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">R = {laptop.criteria_breakdown.storage_norm}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
