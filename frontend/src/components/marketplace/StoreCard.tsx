import {MapPin,Star,Clock3,Navigation,} from "lucide-react";
import type { Store } from "../../data/store";
import type { Laptop } from "../../data/laptops";

type StoreCardProps = {
  store: Store & {
    distance: number | null;
  };
  laptop?: Laptop;
};

export default function StoreCard({
  store,
  laptop,
}: StoreCardProps) {
const saving = laptop
  ? laptop.priceValue - store.specialPrice
  : 0;
  return (
<div
  className="
    relative
    overflow-hidden
    rounded-3xl
    border
    border-black/10
    bg-white/70
    backdrop-blur-xl
    p-6
  "
>

  {/* Background Image */}
  <div
    className="
    absolute
    inset-0
    bg-linear-to-l
    from-transparent
    via-white/40
    to-white
    "
  >
    <img
      src={store.storeImage}
      alt={store.name}
      className="
        h-full
        w-full
        object-cover
      "
    />

    {/* Fade */}
    <div
      className="
        absolute
        inset-0
        bg-linear-to-l
        from-transparent
        via-white/80
        to-white
      "
    />
  </div>

  {/* Content */}
  <div className=" relative
    z-10
    max-w-[58%]
    h-full
    flex
    flex-col">
      {/* Header */}

      <div className="flex justify-between items-start min-h-19.5">

        <div className="flex-1 pr-3">

          <h3 className="text-xl font-semibold leading-tight line-clamp-2 min-h-14">
            {store.name}
          </h3>

          <div className="flex items-center gap-2 mt-2 min-h-5.5">

            <MapPin size={15} />

            <span className="text-sm text-zinc-600 line-clamp-1">
              {store.address}
            </span>

          </div>

        </div>

        <div className="flex items-center gap-1 shrink-0 ml-3">

          <Star
            size={16}
            fill="currentColor"
          />

          <span className="font-semibold">
            {store.rating}
          </span>

          <span className="text-zinc-500 text-sm">
            ({store.reviews})
          </span>

        </div>

      </div>
    <div className="flex-1">
      {/* Price */}

      <div className="mt-6">

        {laptop && (
            <p className="text-zinc-400 line-through text-sm">
            Rp {laptop.priceValue.toLocaleString("id-ID")}
            </p>
        )}

        <h2 className="text-3xl font-bold">
            Rp {store.specialPrice.toLocaleString("id-ID")}
        </h2>

        {saving > 0 && (
            <p className="mt-2 text-green-600 font-semibold">
            Hemat Rp {saving.toLocaleString("id-ID")}
            </p>
        )}

        </div>

        <div className="mt-4">

        {store.available ? (

            <span
            className="
                inline-flex
                items-center
                rounded-full
                bg-green-100
                text-green-700
                px-3
                py-1
                text-sm
                font-medium
            "
            >
            ● Tersedia
            </span>

        ) : (

            <span
            className="
                inline-flex
                items-center
                rounded-full
                bg-red-100
                text-red-700
                px-3
                py-1
                text-sm
                font-medium
            "
            >
            ● Habis
            </span>

        )}

        </div>

      {/* Info */}

      <div className="flex flex-wrap gap-6 mt-5 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <Clock3 size={16} />
          {store.open}
        </div>

        <div className="flex items-start gap-3">
            <Navigation size={18} className="mt-2 shrink-0" />

            <div>
                <p className="text-xs text-zinc-500">
                Jarak toko dari lokasi Anda
                </p>

                {store.distance !== null ? (
                <p className="font-semibold text-black">
                    {store.distance.toFixed(1)} km
                </p>
                ) : (
                <p className="text-amber-600 font-medium">
                    Aktifkan lokasi
                </p>
                )}
            </div>
        </div>
      </div>
    </div>
      {/* Button */}
    <div className="mt-auto pt-5">
        <a
        href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
        target="_blank"
        rel="noreferrer"
        className="
        mt-auto
        inline-flex
        items-center
        justify-center
        rounded-full
        bg-black
        text-white
        px-6
        py-3
        hover:bg-zinc-800
        transition
        "
      >
        Buka Google Maps →
        </a>
      </div>
    </div>
</div>
  );
}