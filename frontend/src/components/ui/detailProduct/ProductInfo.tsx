import { Star } from "lucide-react";
import type { Laptop } from "../../../data/laptops";

type ProductInfoProps = {
  laptop: Laptop;
};

export default function ProductInfo({
  laptop,
}: ProductInfoProps) {
  return (
    <div className="max-w-lg pt-5">

  {/* Brand */}
  <span
    className="
      inline-flex
      items-center
      px-3
      py-1
      rounded-full
      bg-black
      text-white
      text-[11px]
      font-medium
    "
  >
    {laptop.brand}
  </span>

  {/* Nama */}
  <h1 className="mt-4 text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
    {laptop.name}
  </h1>

  {/* Rating */}
  <div className="flex items-center gap-2 mt-3 text-sm">
    <Star size={15} fill="currentColor" />

    <span className="font-semibold">
      {laptop.rating}
    </span>

    <span className="text-zinc-500">
      ({laptop.reviews} Review)
    </span>
  </div>

  {/* Harga */}
  <h2 className="text-2xl lg:text-3xl font-bold mt-5">
    {laptop.price}
  </h2>

  {/* Specs */}
  <div className="mt-6 divide-y divide-black/10">

    <div className="flex justify-between items-center py-3">
      <span className="text-zinc-500 text-sm">
        Processor
      </span>

      <span className="font-semibold text-sm text-right max-w-62.5">
        {laptop.cpu}
      </span>
    </div>

    <div className="flex justify-between items-center py-3">
      <span className="text-zinc-500 text-sm">
        Graphics
      </span>

      <span className="font-semibold text-sm text-right max-w-62.5">
        {laptop.gpu}
      </span>
    </div>

    <div className="flex justify-between items-center py-3">
      <span className="text-zinc-500 text-sm">
        RAM
      </span>

      <span className="font-semibold text-sm">
        {laptop.ram}
      </span>
    </div>

    <div className="flex justify-between items-center py-3">
      <span className="text-zinc-500 text-sm">
        Storage
      </span>

      <span className="font-semibold text-sm">
        {laptop.storage}
      </span>
    </div>

    <div className="flex justify-between items-center py-3">
      <span className="text-zinc-500 text-sm">
        Display
      </span>

      <span className="font-semibold text-sm text-right max-w-62.5">
        {laptop.display}
      </span>
    </div>

  </div>

  {/* Buttons */}
  <div className="flex gap-3 mt-6">

    <button
        onClick={() => {
      document
        .getElementById("marketplace")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }}
      className="
        flex-1
        h-11
        rounded-xl
        bg-black
        text-white
        flex
        items-center
        justify-center
        text-sm
        font-medium
        hover:opacity-90
        transition
      "
    >
      Lihat Marketplace
    </button>

    <button
      className="
        px-5
        h-11
        rounded-xl
        border
        border-black/20
        text-sm
        font-medium
        hover:bg-black
        hover:text-white
        transition
      "
    >
      Bandingkan
    </button>

  </div>

</div>
  );
}