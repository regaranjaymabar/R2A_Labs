import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import RecommendationCard from "../components/ui/RecommendationCard";
import ScrollVideo from "../components/ui/background/ScrollVideo";
import Footer from "../components/Footer";
import { useCatalog } from "../hooks/useCatalog";
import type { Product } from "../types/catalog";

const ITEMS_PER_PAGE = 30;

const categories = [
  { id: "Semua", title: "Semua", subtitle: "Semua Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500" },
  { id: "Pelajar", title: "Pelajar", subtitle: "Belajar & Tugas", image: "https://media.istockphoto.com/id/1425235236/id/foto/tampak-samping-anak-sekolah-muda-afrika-amerika-yang-bekerja-di-depan-laptop.jpg?s=612x612&w=0&k=20&c=tE--tDCu5dB8IH7J9zcgPQ3w_rHWkgF30dd4aNyrhp4=" },
  { id: "Programmer", title: "Programmer", subtitle: "Coding & Development", image: "https://media.istockphoto.com/id/2156385097/id/foto/pasangan-hispanik-amerika-latin-pengembang-perangkat-lunak-menggunakan-komputer-mengerjakan.jpg?s=612x612&w=0&k=20&c=Aj29_r9V3EMQKt4-6icunbWJ4wUQgM6f1hKT_mGzzWk=" },
  { id: "Gaming", title: "Gaming", subtitle: "AAA & Esports", image: "https://media.istockphoto.com/id/909705214/id/foto/anak-laki-laki-saling-membantu-saat-bermain-game-esports-di-laptop-di-malam-hari.jpg?s=612x612&w=0&k=20&c=68aNuZHNwZu4JHfcXZTGpYIu3AZM15W1FP9dK2umyE4=" },
  { id: "Multimedia", title: "Multimedia", subtitle: "Editing & Design", image: "https://media.istockphoto.com/id/614225004/id/foto/tata-letak-desain-komputer-wanita.jpg?s=612x612&w=0&k=20&c=Sdqkqrh-5mC8Hf8EtclqdUthYT43HizouiZMa7r5zKI=" },
  { id: "Content Creator", title: "Content Creator", subtitle: "Video & Streaming", image: "https://media.istockphoto.com/id/1180897643/id/foto/konsep-pengoperasian-sederhana-blogger-dan-vlogger-tangan-menggunakan-laptop-pada-editor-video.jpg?s=612x612&w=0&k=20&c=Fu5OVSNR07gevDb8PLIjMGQNECnJ7ZioDCA8SX5GAZ4=" },
];

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
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeBudget, setActiveBudget] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { data: laptops = [], isLoading } = useCatalog();

  const getPrice = (product: Product) => {
    const availableStore = product.productStores?.find(
      (ps) => ps.isAvailable === 1
    );
    return availableStore?.price;
  };

  const filteredLaptops = useMemo(() => {
    return laptops.filter((laptop: Product) => {
      const price = getPrice(laptop) || 0;

      let budgetMatch = true;
      if (activeBudget) {
        switch (activeBudget) {
          case "<5":
            budgetMatch = price < 5000000;
            break;
          case "5-10":
            budgetMatch = price >= 5000000 && price <= 10000000;
            break;
          case "10-15":
            budgetMatch = price > 10000000 && price <= 15000000;
            break;
          case "15-20":
            budgetMatch = price > 15000000 && price <= 20000000;
            break;
          case ">20":
            budgetMatch = price > 20000000;
            break;
        }
      }

      const searchMatch =
        !search ||
        laptop.modelName?.toLowerCase().includes(search.toLowerCase()) ||
        laptop.processor?.toLowerCase().includes(search.toLowerCase()) ||
        laptop.ram?.toLowerCase().includes(search.toLowerCase()) ||
        laptop.storage?.toLowerCase().includes(search.toLowerCase());

      return budgetMatch && searchMatch;
    });
  }, [activeCategory, activeBudget, search, laptops]);

  // Reset visible count saat filter berubah
  const handleFilterChange = (setter: Function) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const displayedLaptops = filteredLaptops.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLaptops.length;
  const remaining = filteredLaptops.length - visibleCount;

  const handleReset = () => {
    setActiveCategory("Semua");
    setActiveBudget("");
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading laptop...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ScrollVideo />

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="sticky top-24 z-30 bg-white/20 backdrop-blur-xl rounded-[40px] p-8 mb-12 border border-white/10 shadow-lg">
          <div>
            <h3 className="text-xl font-semibold mb-4">Kategori</h3>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(setActiveCategory)(cat.id)}
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
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                  <div className="absolute bottom-3 left-3 text-left text-white">
                    <h4 className="text-sm font-semibold">{cat.title}</h4>
                    <p className="text-xs text-white/70">{cat.subtitle}</p>
                  </div>
                  {activeCategory === cat.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Budget</h3>
            <div className="flex flex-wrap gap-3">
              {budgets.map((budget) => (
                <button
                  key={budget.value}
                  onClick={() => handleFilterChange(setActiveBudget)(budget.value)}
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

        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold">Our Laptops</h2>
              <p className="text-zinc-500 mt-2">
                Menampilkan {displayedLaptops.length} dari {filteredLaptops.length} laptop
              </p>
            </div>
          </div>

          {filteredLaptops.length === 0 ? (
            <div className="text-center py-20">
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
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedLaptops.map((laptop) => (
                  <RecommendationCard
                    key={laptop.id}
                    id={laptop.id}
                    name={laptop.modelName}
                    cpu={laptop.processor}
                    ram={laptop.ram}
                    storage={laptop.storage}
                    price={getPrice(laptop)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-4 bg-black text-white rounded-full hover:opacity-90 transition font-medium text-lg"
                  >
                    Lihat {remaining > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : remaining} data lainnya
                  </button>
                  <p className="text-zinc-500 text-sm mt-3">
                    Total {filteredLaptops.length} laptop tersedia
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}