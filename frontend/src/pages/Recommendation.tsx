import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import RecommendationCard from "../components/ui/RecommendationCard";
import { laptops, categories, budgets } from "../data/laptops";
import type { Laptop } from "../data/laptops";
import ScrollVideo from "../components/ui/background/ScrollVideo"; // ← Import ScrollVideo
import Footer from "../components/Footer";

// Type untuk outlet context
type OutletContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Recommendation() {
  const { search } = useOutletContext<OutletContextType>();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeBudget, setActiveBudget] = useState("");

  // Filter logic real-time dengan search
  const filteredLaptops = useMemo(() => {
    return laptops.filter((laptop: Laptop) => {
      // Filter kategori
      const categoryMatch =
        activeCategory === "Semua" || laptop.category === activeCategory;

      // Filter budget
      let budgetMatch = true;
      if (activeBudget) {
        switch (activeBudget) {
          case "<5":
            budgetMatch = laptop.priceValue < 5000000;
            break;
          case "5-10":
            budgetMatch =
              laptop.priceValue >= 5000000 && laptop.priceValue <= 10000000;
            break;
          case "10-15":
            budgetMatch =
              laptop.priceValue > 10000000 && laptop.priceValue <= 15000000;
            break;
          case "15-20":
            budgetMatch =
              laptop.priceValue > 15000000 && laptop.priceValue <= 20000000;
            break;
          case ">20":
            budgetMatch = laptop.priceValue > 20000000;
            break;
        }
      }

      // Filter search (dari navbar)
      const searchMatch =
        !search ||
        laptop.name.toLowerCase().includes(search.toLowerCase()) ||
        laptop.cpu.toLowerCase().includes(search.toLowerCase()) ||
        laptop.ram.toLowerCase().includes(search.toLowerCase()) ||
        laptop.storage.toLowerCase().includes(search.toLowerCase()) ||
        laptop.category.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && budgetMatch && searchMatch;
    });
  }, [activeCategory, activeBudget, search]);

  const handleReset = () => {
    setActiveCategory("Semua");
    setActiveBudget("");
  };

  return (
    <div className="min-h-screen">
      <ScrollVideo />

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Filter Section - Sticky */}
        <div className="sticky top-24 z-30 bg-white/20 backdrop-blur-xl rounded-[40px] p-8 mb-12 border border-white/10 shadow-lg">
          {/* Kategori Cards */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Kategori</h3>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    group relative overflow-hidden h-28 rounded-2xl
                    transition-all duration-300 border
                    ${
                      activeCategory === cat.id
                        ? "ring-3 ring-black scale-[1.02] border-black"
                        : "border-white/20 hover:scale-[1.02]"
                    }
                  `}
                >
                  {/* Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10" />
                  {/* Content */}
                  <div className="absolute bottom-3 left-3 text-left text-white">
                    <h4 className="text-sm font-semibold">{cat.title}</h4>
                    <p className="text-xs text-white/70">{cat.subtitle}</p>
                  </div>
                  {/* Active Check */}
                  {activeCategory === cat.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Chips */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Budget</h3>
            <div className="flex flex-wrap gap-3">
              {budgets.map((budget) => (
                <button
                  key={budget.value}
                  onClick={() => setActiveBudget(budget.value)}
                  className={`
                    px-5 py-3 rounded-full text-sm font-medium
                    transition-all duration-300 border
                    ${
                      activeBudget === budget.value
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white/10 border-white/20 hover:bg-white/30"
                    }
                  `}
                >
                  {budget.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Info */}
          {(activeCategory !== "Semua" || activeBudget || search) && (
            <div className="mt-6 flex items-center gap-3 text-sm text-zinc-600 flex-wrap">
              <span>Filter aktif:</span>
              {search && (
                <span className="px-3 py-1 bg-black/5 rounded-full text-black font-medium">
                  "{search}"
                </span>
              )}
              {activeCategory !== "Semua" && (
                <span className="px-3 py-1 bg-black/5 rounded-full text-black font-medium">
                  {activeCategory}
                </span>
              )}
              {activeBudget && (
                <span className="px-3 py-1 bg-black/5 rounded-full text-black font-medium">
                  {budgets.find((b) => b.value === activeBudget)?.label}
                </span>
              )}
              <button
                onClick={handleReset}
                className="ml-auto px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Katalog Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold">Katalog Laptop</h2>
              <p className="text-zinc-500 mt-2">
                Menampilkan {filteredLaptops.length} dari {laptops.length} laptop
              </p>
            </div>
          </div>

          {filteredLaptops.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-semibold">Laptop tidak ditemukan</h3>
              <p className="text-zinc-500 mt-2">
                Coba ubah filter atau reset pencarian.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLaptops.map((laptop) => (
                <RecommendationCard key={laptop.id} {...laptop} />
              ))}
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </div>
  );
}