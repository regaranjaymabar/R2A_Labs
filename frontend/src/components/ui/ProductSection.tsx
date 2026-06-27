import { useState } from "react";
import FeaturedLaptop from "./FeaturedLaptop";
import ProductCard from "./ProductCard";

const laptops = [
  {
    id: 1,
    category: "Pelajar",
    name: "ASUS Zenbook 14 OLED",
    image: "https://id.store.asus.com/media/catalog/product/z/e/zenbook_14_oled_ux3405ma_product_photo_3b_ponder_blue_10_indo_no_numpad_2400_3.png?width=382&height=382&store=id_ID&image-type=image",
    price: "Rp 17.499.000",
    cpu: "Intel Core Ultra 7",
    ram: "16GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 2,
    category: "Gaming",
    name: "ROG Zephyrus G14",
    image: "https://dlcdnwebimgs.asus.com/gain/7583764C-92E3-413D-A5AD-4CB7D9713802/w1000/h732",
    price: "Rp 24.999.000",
    cpu: "Ryzen 9",
    ram: "16GB RAM",
    storage: "1TB SSD",
  },
  {
    id: 3,
    category: "Programmer",
    name: "Lenovo Yoga Slim 7i",
    image: "https://p4-ofp.static.pub/fes/cms/2023/02/08/xv4xloul3hr7nwvfsr994262rcduuo471350.png",
    price: "Rp 16.999.000",
    cpu: "Intel Ultra 7",
    ram: "16GB RAM",
    storage: "512GB SSD",
  },
  {
    id: 4,
    category: "Multimedia",
    name: "HP Victus 15",
    image: "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2022-victus-15-intel/Hero%20Image%201.png",
    price: "Rp 11.999.000",
    cpu: "Intel i5",
    ram: "8GB RAM",
    storage: "512GB SSD",
  },
];

const categories = [
  "Semua",
  "Pelajar",
  "Programmer",
  "Multimedia",
  "Gaming",
  "Content Creator",
];

type ProductSectionProps = {
  search: string;
};

export default function ProductSection({
  search,
}: ProductSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  
 const filteredLaptops = laptops.filter((laptop) => {
  const matchesCategory =
    activeCategory === "Semua" ||
    laptop.category === activeCategory;

  const matchesSearch =
    laptop.name.toLowerCase().includes(search.toLowerCase()) ||
    laptop.cpu.toLowerCase().includes(search.toLowerCase()) ||
    laptop.ram.toLowerCase().includes(search.toLowerCase()) ||
    laptop.category.toLowerCase().includes(search.toLowerCase());

  return matchesCategory && matchesSearch;
});

  return (

    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-5">
          <h2 className="text-6xl font-bold">
            Produk Terbaik
          </h2>

          <p className="text-zinc-600 mt-4">
            Pilihan laptop terbaik sesuai kebutuhanmu.
          </p>
        </div>

        <FeaturedLaptop />

        <div className="flex flex-wrap justify-center gap-4 mt-12 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-6 py-3 rounded-full
                backdrop-blur-2xl
                border border-white/20
                transition-all duration-300
                ${
                  activeCategory === category
                    ? "bg-black text-white shadow-xl"
                    : "bg-white/20 hover:bg-white/40"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
        
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
            {filteredLaptops.map((laptop) => (
            <ProductCard
              key={laptop.id}
              {...laptop}
            />
          ))}
        </div>

      </div>
    </section>
  );
}