import FeaturedLaptop from "./FeaturedLaptop";
import ProductCard from "./ProductCard";
import type { Product } from "../../types/catalog";

type ProductSectionProps = {
  search: string;
  laptops: Product[];
};

export default function ProductSection({
  search,
  laptops,
}: ProductSectionProps) {
  const filteredLaptops = laptops.filter((laptop) => {
    const keyword = search.toLowerCase();
    return (
      laptop.modelName?.toLowerCase().includes(keyword) ||
      laptop.processor?.toLowerCase().includes(keyword) ||
      laptop.ram?.toLowerCase().includes(keyword) ||
      laptop.storage?.toLowerCase().includes(keyword) ||
      laptop.brand?.name?.toLowerCase().includes(keyword)
    );
  });

  const displayedLaptops = search
    ? filteredLaptops
    : filteredLaptops.slice(0, 4);

  // Ambil harga dari productStores pertama yang available
  const getPrice = (product: Product) => {
    const availableStore = product.productStores?.find(
      (ps) => ps.isAvailable === 1
    );
    return availableStore?.price;
  };

  return (
    <section className="py-15">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-5">
          <h2 className="text-6xl font-bold">Produk Terbaik</h2>
          <p className="text-zinc-600 mt-4">
            Pilihan laptop terbaik sesuai kebutuhanmu.
          </p>
        </div>

        <FeaturedLaptop />

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

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
          {displayedLaptops.map((laptop) => (
            <ProductCard
              key={laptop.id}
              id={laptop.id}
              name={laptop.modelName}
              cpu={laptop.processor}
              image={laptop.imageUrl || undefined} 
              ram={laptop.ram}
              storage={laptop.storage}
              price={getPrice(laptop)}
              brand={laptop.brand?.name}
              battery={laptop.battery}
              weight={laptop.weight}
              screenSize={laptop.screenSize}
              releaseYear={laptop.releaseYear}
            />
          ))}
        </div>

        {filteredLaptops.length > 0 && (
          <div className="text-center mt-6 text-sm text-zinc-500">
            {!search
              ? `Menampilkan ${displayedLaptops.length} dari ${laptops.length} laptop`
              : `Ditemukan ${filteredLaptops.length} laptop`}
          </div>
        )}
      </div>
    </section>
  );
}