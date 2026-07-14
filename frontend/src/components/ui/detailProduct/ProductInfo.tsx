import { Star } from "lucide-react";
import type { ProductDetail } from "../../../types/catalog";

type ProductInfoProps = {
  laptop: ProductDetail;
};

export default function ProductInfo({ laptop }: ProductInfoProps) {
  const formatPrice = (value?: number) => {
    if (!value) return "N/A";
    return "Rp " + value.toLocaleString("id-ID");
  };

  const getPrice = () => {
    const availableStore = laptop.productStores?.find(
      (ps) => ps.isAvailable === 1
    );
    return availableStore?.price;
  };

  return (
    <div className="max-w-lg pt-5">
      {/* Brand */}
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-black text-white text-[11px] font-medium">
        {laptop.brand?.name || "Unknown"}
      </span>

      {/* Nama */}
      <h1 className="mt-4 text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
        {laptop.modelName}
      </h1>

      {/* Rating (static placeholder) */}
      <div className="flex items-center gap-2 mt-3 text-sm">
        <Star size={15} fill="currentColor" />
        <span className="font-semibold">4.8</span>
        <span className="text-zinc-500">(128 Review)</span>
      </div>

      {/* Harga */}
      <h2 className="text-2xl lg:text-3xl font-bold mt-5">
        {formatPrice(getPrice())}
      </h2>

      {/* Specs */}
      <div className="mt-6 divide-y divide-black/10">
        <div className="flex justify-between items-center py-3">
          <span className="text-zinc-500 text-sm">Processor</span>
          <span className="font-semibold text-sm text-right max-w-62.5">
            {laptop.processor}
          </span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-zinc-500 text-sm">RAM</span>
          <span className="font-semibold text-sm">{laptop.ram}</span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-zinc-500 text-sm">Storage</span>
          <span className="font-semibold text-sm">{laptop.storage}</span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-zinc-500 text-sm">Display</span>
          <span className="font-semibold text-sm text-right max-w-62.5">
            {laptop.screenSize || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-zinc-500 text-sm">Battery</span>
          <span className="font-semibold text-sm">{laptop.battery || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-zinc-500 text-sm">Weight</span>
          <span className="font-semibold text-sm">{laptop.weight || "N/A"}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            document
              .getElementById("marketplace")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex-1 h-11 rounded-xl bg-black text-white flex items-center justify-center text-sm font-medium hover:opacity-90 transition"
        >
          Lihat Marketplace
        </button>

        <button className="px-5 h-11 rounded-xl border border-black/20 text-sm font-medium hover:bg-black hover:text-white transition">
          Bandingkan
        </button>
      </div>
    </div>
  );
}