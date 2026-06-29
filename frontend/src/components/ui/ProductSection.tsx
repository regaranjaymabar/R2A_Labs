import { useState } from "react";
import FeaturedLaptop from "./FeaturedLaptop";
import ProductCard from "./ProductCard";
import { laptops, categories } from "../../data/laptops";
import type { Laptop } from "../../data/laptops";

type ProductSectionProps = {
  search: string;
};

export default function ProductSection({ search }: ProductSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Filter logic
  const filteredLaptops = laptops.filter((laptop: Laptop) => {
    const matchesCategory =
      activeCategory === "Semua" || laptop.category === activeCategory;

    const matchesSearch =
      laptop.name.toLowerCase().includes(search.toLowerCase()) ||
      laptop.cpu.toLowerCase().includes(search.toLowerCase()) ||
      laptop.ram.toLowerCase().includes(search.toLowerCase()) ||
      laptop.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Ambil maksimal 4 data untuk ditampilkan (atau semua kalau ada search/filter aktif)
  const displayedLaptops =
    activeCategory === "Semua" && !search
      ? filteredLaptops.slice(0, 4) // Default: 4 laptop pertama
      : filteredLaptops; // Kalau ada filter/search: tampilkan semua hasil

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-5">
          <h2 className="text-6xl font-bold">Produk Terbaik</h2>
          <p className="text-zinc-600 mt-4">
            Pilihan laptop terbaik sesuai kebutuhanmu.
          </p>
        </div>

        <FeaturedLaptop />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-6 py-3 rounded-full
                backdrop-blur-2xl
                border border-white/20
                transition-all duration-300
                ${
                  activeCategory === category.id
                    ? "bg-black text-white shadow-xl"
                    : "bg-white/20 hover:bg-white/40"
                }
              `}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredLaptops.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold">
              Laptop tidak ditemukan
            </h3>
            <p className="text-zinc-500 mt-2">
              Coba gunakan kata kunci lain.
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
          {displayedLaptops.map((laptop) => (
            <ProductCard key={laptop.id} {...laptop} />
          ))}
        </div>

        {/* Show count info */}
        {filteredLaptops.length > 0 && (
          <div className="text-center mt-6 text-sm text-zinc-500">
            {activeCategory === "Semua" && !search
              ? `Menampilkan ${displayedLaptops.length} dari ${laptops.length} laptop terbaik`
              : `Menampilkan ${filteredLaptops.length} laptop`}
            {activeCategory === "Semua" && !search && (
              <span className="block mt-1">
                Gunakan filter atau search untuk melihat lebih banyak
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}