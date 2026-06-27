import RecommendationCard from "./RecommendationCard";

type RecommendationResultProps = {
  purpose: string;
  budget: string;
};

export default function RecommendationResult({
  purpose,
  budget,
}: RecommendationResultProps) {

  const recommendations = [
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

  const isPriceInBudget = (price: string, selectedBudget: string) => {
  // Ubah "Rp 24.999.000" menjadi 24999000
  const value = Number(price.replace(/[^\d]/g, ""));

  switch (selectedBudget) {
    case "< 5 Juta":
      return value < 5_000_000;

    case "5 - 10 Juta":
      return value >= 5_000_000 && value <= 10_000_000;

    case "10 - 15 Juta":
      return value > 10_000_000 && value <= 15_000_000;

    case "15 - 20 Juta":
      return value > 15_000_000 && value <= 20_000_000;

    case "> 20 Juta":
      return value > 20_000_000;

    default:
      return true;
  }
};
  const filtered = recommendations.filter((item) => {
  const categoryMatch =
    !purpose ||
    item.category.toLowerCase() === purpose.toLowerCase();

  const budgetMatch =
    !budget || isPriceInBudget(item.price, budget);

  return categoryMatch && budgetMatch;
});

  return (
    <section id="recommendation-result"className="mt-20">

      <div className="flex justify-center items-center mb-8">
          <div>
              <h2 className="text-4xl font-bold">
                  Hasil Rekomendasi
              </h2>
              <p className="text-zinc-500 mt-2">
                  Ditemukan {filtered.length} laptop sesuai kebutuhan Anda.
              </p>
          </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((laptop) => (
          <RecommendationCard
            key={laptop.id}
            {...laptop}
          />
        ))}
      </div>

    </section>
  );
}