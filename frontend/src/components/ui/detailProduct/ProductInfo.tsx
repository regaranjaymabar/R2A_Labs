import { Star, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import type { ProductDetail } from "../../../types/catalog";

type ProductInfoProps = {
  laptop: ProductDetail;
};

export default function ProductInfo({ laptop }: ProductInfoProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const formatPrice = (value?: number) => {
    if (!value) return "N/A";
    return "Rp " + value.toLocaleString("id-ID");
  };

  const cheapestStore = laptop.productStores
    ?.filter((ps) => ps.isAvailable === 1)
    ?.sort((a, b) => a.price - b.price)[0];

  const getPrice = () => cheapestStore?.price;

  const scrollToMarketplace = () => {
    document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll ke toko termurah
  const scrollToCheapestStore = () => {
    const el = document.getElementById(`store-${cheapestStore?.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-black", "ring-offset-2");
      setTimeout(() => el.classList.remove("ring-4", "ring-black", "ring-offset-2"), 2000);
    } else {
      scrollToMarketplace();
    }
  };

  // Tombol "Kembali ke Atas"
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <div className="max-w-lg pt-5">
        {/* Brand */}
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-black text-white text-[11px] font-medium">
          {laptop.brand?.name || "Unknown"}
        </span>

        {/* Nama */}
        <h1 className="mt-4 text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
          {laptop.modelName}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3 text-sm">
          <Star size={15} fill="currentColor" />
          <span className="font-semibold">4.8</span>
          <span className="text-zinc-500">(128 Review)</span>
        </div>

        {/* Harga Termurah */}
        <h2 className="text-2xl lg:text-3xl font-bold mt-5">{formatPrice(getPrice())}</h2>
        {cheapestStore && (
          <p className="text-sm text-zinc-500 mt-1">
            Termurah di <span className="font-semibold text-black">{cheapestStore.store?.name || "toko terdekat"}</span>
          </p>
        )}

        {/* Specs */}
        <div className="mt-6 divide-y divide-black/10">
          <div className="flex justify-between items-center py-3"><span className="text-zinc-500 text-sm">Processor</span><span className="font-semibold text-sm text-right max-w-62.5">{laptop.processor}</span></div>
          <div className="flex justify-between items-center py-3"><span className="text-zinc-500 text-sm">RAM</span><span className="font-semibold text-sm">{laptop.ram}</span></div>
          <div className="flex justify-between items-center py-3"><span className="text-zinc-500 text-sm">Storage</span><span className="font-semibold text-sm">{laptop.storage}</span></div>
          <div className="flex justify-between items-center py-3"><span className="text-zinc-500 text-sm">Display</span><span className="font-semibold text-sm text-right max-w-62.5">{laptop.screenSize || "N/A"}</span></div>
          <div className="flex justify-between items-center py-3"><span className="text-zinc-500 text-sm">Battery</span><span className="font-semibold text-sm">{laptop.battery || "N/A"}</span></div>
          <div className="flex justify-between items-center py-3"><span className="text-zinc-500 text-sm">Weight</span><span className="font-semibold text-sm">{laptop.weight || "N/A"}</span></div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button onClick={scrollToCheapestStore}
            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-black text-white text-sm font-medium hover:bg-black transition">
            Lihat Harga Termurah ({formatPrice(getPrice())})
          </button>

          <div className="flex gap-3">
            <button onClick={scrollToMarketplace}
              className="flex-1 h-11 rounded-xl bg-black text-white flex items-center justify-center text-sm font-medium hover:opacity-90 transition">
              Semua Marketplace
            </button>
            <button className="px-5 h-11 rounded-xl border border-black/20 text-sm font-medium hover:bg-black hover:text-white transition">
              Bandingkan
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Kembali ke Atas */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black text-white shadow-lg hover:scale-110 transition flex items-center justify-center"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}