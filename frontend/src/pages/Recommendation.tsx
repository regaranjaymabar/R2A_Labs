/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import RecommendationCard from "../components/ui/RecommendationCard";
import ScrollVideo from "../components/ui/background/ScrollVideo";
import Footer from "../components/Footer";
import { useCatalog } from "../hooks/useCatalog";
import { useGet } from "../hooks/useGet";
import { criteriaCustomerService } from "../services/criteriaCustomerService";
import { api } from "../lib/axios";
import WeightSlider from "../components/ui/WeightSlider";
import type { Product } from "../types/catalog";
import InputRupiah from "../components/ui/InputRupiah";
import SpkHistory from "../components/ui/SpkHistory";

const ITEMS_PER_PAGE = 20;

const budgets = [
  { label: "Semua Budget", value: "" },
  { label: "< 5 Juta", value: "<5" },
  { label: "5 - 10 Juta", value: "5-10" },
  { label: "10 - 15 Juta", value: "10-15" },
  { label: "15 - 20 Juta", value: "15-20" },
  { label: "> 20 Juta", value: ">20" },
];

type OutletContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Recommendation() {
  const { search } = useOutletContext<OutletContextType>();
  const [activeBudget, setActiveBudget] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [kebutuhan, setKebutuhan] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [weights, setWeights] = useState<{ criteriaId: number; weight: number }[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [spkResults, setSpkResults] = useState<any>(null);
  const [showSpkResults, setShowSpkResults] = useState(false);

  const { data: laptops = [], isLoading } = useCatalog();
  const { data: criterias = [] } = useGet({
    queryKey: ["criterias"],
    queryFn: criteriaCustomerService.getAll,
  });

  useEffect(() => {
    setKebutuhan(localStorage.getItem("spk_kebutuhan") || "");
    setBudgetMin(localStorage.getItem("spk_budgetMin") || "");
    setBudgetMax(localStorage.getItem("spk_budgetMax") || "");
    const savedWeights = localStorage.getItem("spk_weights");
    if (savedWeights) { try { setWeights(JSON.parse(savedWeights)); } catch {} }
  }, []);

  useEffect(() => {
    if (kebutuhan) localStorage.setItem("spk_kebutuhan", kebutuhan);
    if (budgetMin) localStorage.setItem("spk_budgetMin", budgetMin);
    if (budgetMax) localStorage.setItem("spk_budgetMax", budgetMax);
    if (weights.length > 0) localStorage.setItem("spk_weights", JSON.stringify(weights));
  }, [kebutuhan, budgetMin, budgetMax, weights]);

  const productStoreMap = useMemo(() => {
    const map: Record<number, number> = {};
    laptops.forEach((laptop) => {
      laptop.productStores?.forEach((ps) => { map[ps.id] = laptop.id; });
    });
    return map;
  }, [laptops]);

  const getProductId = useCallback((storeId: number): number => productStoreMap[storeId] || 0, [productStoreMap]);

  const getPrice = (product: Product) => {
    const availableStore = product.productStores?.find((ps) => ps.isAvailable === 1);
    return availableStore?.price;
  };

  const filteredLaptops = useMemo(() => {
    return laptops.filter((laptop: Product) => {
      const price = getPrice(laptop) || 0;
      let budgetMatch = true;
      if (activeBudget) {
        switch (activeBudget) {
          case "<5": budgetMatch = price < 5000000; break;
          case "5-10": budgetMatch = price >= 5000000 && price <= 10000000; break;
          case "10-15": budgetMatch = price > 10000000 && price <= 15000000; break;
          case "15-20": budgetMatch = price > 15000000 && price <= 20000000; break;
          case ">20": budgetMatch = price > 20000000; break;
        }
      }
      const searchMatch = !search || laptop.modelName?.toLowerCase().includes(search.toLowerCase()) || laptop.processor?.toLowerCase().includes(search.toLowerCase()) || laptop.ram?.toLowerCase().includes(search.toLowerCase()) || laptop.storage?.toLowerCase().includes(search.toLowerCase());
      return budgetMatch && searchMatch;
    });
  }, [activeBudget, search, laptops]);

  const handleFilterChange = (setter: Function) => (value: string) => { setter(value); setVisibleCount(ITEMS_PER_PAGE); };

  const displayedLaptops = filteredLaptops.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLaptops.length;
  const remaining = filteredLaptops.length - visibleCount;

  const handleReset = () => {
    setActiveBudget(""); setVisibleCount(ITEMS_PER_PAGE);
    setSpkResults(null); setShowSpkResults(false);
    setKebutuhan(""); setBudgetMin(""); setBudgetMax(""); setWeights([]);
    localStorage.removeItem("spk_kebutuhan");
    localStorage.removeItem("spk_budgetMin"); localStorage.removeItem("spk_budgetMax");
    localStorage.removeItem("spk_weights");
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_PAGE);

  const handleSpkSubmit = async () => {
    if (!kebutuhan.trim() || !budgetMin || !budgetMax || weights.length === 0) return;
    setIsCalculating(true);
    try {
      const response = await api.post("/api/customer/spk/requests", {
        kebutuhan: kebutuhan.trim(),
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        weights, userLat: null, userLng: null,
      });
      setSpkResults(response.data.data);
      setShowSpkResults(true);
      
      setTimeout(() => {
        document.getElementById("spk-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) { console.error("SPK Error:", err); }
    finally { setIsCalculating(false); }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p className="text-lg">Loading laptop...</p></div>;

  return (
    <div className="min-h-screen">
      <ScrollVideo />
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="sticky top-24 z-30 bg-white/20 backdrop-blur-xl rounded-[40px] p-8 mb-12 border border-white/10 shadow-lg">
          <div>
            <h1 className="text-2xl font-semibold mb-4">Masukan Spek Laptop Keinginan Anda</h1>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Budget</h3>
            <div className="flex flex-wrap gap-3">
              {budgets.map((budget) => (
                <button key={budget.value} onClick={() => handleFilterChange(setActiveBudget)(budget.value)} className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${activeBudget === budget.value ? "bg-black text-white border-black shadow-lg" : "bg-white/10 border-white/20 hover:bg-white/30"}`}>{budget.label}</button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-semibold">SPK Rekomendasi</h3>

            <div>
              <label className="text-sm font-medium">Kebutuhan Anda</label>
              <textarea
                value={kebutuhan}
                onChange={(e) => setKebutuhan(e.target.value)}
                placeholder="Contoh: Laptop untuk coding, gaming, desain grafis..."
                rows={2}
                className="w-full mt-1 px-4 py-3 rounded-2xl border border-white/20 bg-white/10 outline-none text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputRupiah label="Budget Min" value={budgetMin} onChange={setBudgetMin} placeholder="Rp 5.000.000" />
              <InputRupiah label="Budget Max" value={budgetMax} onChange={setBudgetMax} placeholder="Rp 15.000.000" />
            </div>
            {criterias.length > 0 && <WeightSlider criteria={criterias} onChange={setWeights} />}
            
            <button onClick={handleSpkSubmit} disabled={isCalculating || !kebutuhan.trim() || !budgetMin || !budgetMax || weights.length === 0} className="w-full py-4 rounded-full bg-black text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isCalculating ? "Menghitung..." : "Cari Rekomendasi"}
            </button>
          </div>

          {(activeBudget || search) && (
            <div className="mt-6 flex items-center gap-3 text-sm text-zinc-600 flex-wrap">
              <span>Filter aktif:</span>
              {search && <span className="px-3 py-1 bg-black/5 rounded-full text-black font-medium">"{search}"</span>}
              {activeBudget && <span className="px-3 py-1 bg-black/5 rounded-full text-black font-medium">{budgets.find((b) => b.value === activeBudget)?.label}</span>}
              <button onClick={handleReset} className="ml-auto px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition">Reset Filter</button>
            </div>
          )}
        </div>

        {showSpkResults && spkResults?.recommendationResults ? (
          <div id="spk-results" className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div><h2 className="text-4xl font-bold">Hasil Rekomendasi</h2><p className="text-zinc-500 mt-2">SAW + WP + TOPSIS</p></div>
              <button onClick={handleReset} className="px-6 py-3 bg-zinc-200 rounded-full text-sm hover:bg-zinc-300 transition">Kembali ke Katalog</button>
            </div>
            {spkResults.recommendationResults.map((method: any) => (
              <div key={method.method} className="mb-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="px-3 py-1 bg-black text-white text-sm rounded-full">{method.method}</span></h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {method.recommendations.map((rec: any) => {
                    const bestStore = rec.available_stores?.[0];
                    const productId = getProductId(bestStore?.productStoreId || 0);
                    return (
                      <div key={rec.rank} className="relative bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-lg">#{rec.rank}</div>
                        <h4 className="font-semibold text-lg mt-2">{rec.product_name}</h4>
                        <div className="mt-1 text-sm text-zinc-500">Skor: <span className="font-bold text-black">{rec.best_score?.toFixed(3)}</span></div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-zinc-500 font-medium">Tersedia di:</p>
                          {rec.available_stores?.slice(0, 3).map((store: any) => (
                            <div key={store.productStoreId} className="flex justify-between items-center text-sm"><span className="text-zinc-600 truncate max-w-[60%]">{store.store_name}</span><span className="font-bold">Rp {store.price?.toLocaleString('id-ID')}</span></div>
                          ))}
                        </div>
                        <Link to={`/product/${productId}`} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition">Lihat Detail</Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8"><div><h2 className="text-4xl font-bold">Our Laptops</h2><p className="text-zinc-500 mt-2">Menampilkan {displayedLaptops.length} dari {filteredLaptops.length} laptop</p></div></div>
            {filteredLaptops.length === 0 ? (
              <div className="text-center py-20"><h3 className="text-2xl font-semibold">Laptop tidak ditemukan</h3><p className="text-zinc-500 mt-2">Coba ubah filter atau reset pencarian.</p><button onClick={handleReset} className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition">Reset Filter</button></div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedLaptops.map((laptop) => (<RecommendationCard key={laptop.id} id={laptop.id} name={laptop.modelName} image={laptop.imageUrl || undefined} cpu={laptop.processor} ram={laptop.ram} storage={laptop.storage} price={getPrice(laptop)} />))}
                </div>
                {hasMore && (<div className="mt-10 text-center"><button onClick={handleLoadMore} className="px-8 py-4 bg-black text-white rounded-full hover:opacity-90 transition font-medium text-lg">Lihat data lainnya</button><p className="text-zinc-500 text-sm mt-3">Total {filteredLaptops.length} laptop tersedia</p></div>)}
              </>
            )}
          </div>
        )}
        <SpkHistory />
        <Footer />
      </div>
    </div>
  );
}