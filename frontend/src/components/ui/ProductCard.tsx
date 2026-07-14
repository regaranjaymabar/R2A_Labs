import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  price?: number;
  image?: string;
  brand?: string;
  battery?: string;
  weight?: string;
  screenSize?: string;
  releaseYear?: string;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  cpu,
  ram,
  storage,
}: ProductCardProps) {
  const formatPrice = (value?: number) => {
    if (!value) return "N/A";
    return "Rp " + value.toLocaleString("id-ID");
  };

  return (
    <div
      className="
      bg-white/10
      backdrop-blur-3xl
      border border-white/20
      rounded-3xl
      p-5
      hover:-translate-y-2
      hover:shadow-2xl
      transition-all
      duration-300
    "
    >
      <div className="h-60 flex items-center justify-center mb-6">
        <img
          src={image || "https://placehold.co/400x300?text=Laptop"}
          alt={name}
          className="
            max-h-full
            w-auto
            object-contain
            transition-transform
            duration-300
            hover:scale-105
          "
        />
      </div>

      <h3 className="font-semibold text-lg">{name}</h3>

      <div className="space-y-3 mt-4 text-sm text-zinc-600">
        <p className="flex items-center gap-2">
          <span className="opacity-70">CPU:</span>
          <span>{cpu}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="opacity-70">RAM:</span>
          <span>{ram}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="opacity-70">Storage:</span>
          <span>{storage}</span>
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="font-bold text-xl">
          {formatPrice(price)}
        </span>

        <Link
          to={`/product/${id}`}
          className="
            flex items-center justify-center
            w-11 h-11
            rounded-full
            bg-black text-white
            hover:scale-110
            transition-all duration-300
          "
        >
          →
        </Link>
      </div>
    </div>
  );
}