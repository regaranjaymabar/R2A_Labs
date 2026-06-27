type RecommendationCardProps = {
  name: string;
  image: string;
  price: string;
  cpu: string;
  ram: string;
  storage: string;
};

export default function RecommendationCard({
  name,
  image,
  price,
  cpu,
  ram,
  storage,
}: RecommendationCardProps) {
  return (
    <div
      className="
      group
      rounded-3xl
      bg-white/10
      backdrop-blur-3xl
      border border-white/20
      p-5
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
    "
    >
      {/* Image */}

      <div className="h-40 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="
            max-h-36
            object-contain
            group-hover:scale-105
            transition
          "
        />
      </div>

      {/* Name */}

      <h3 className="font-semibold mt-3 line-clamp-2">
        {name}
      </h3>

      {/* Specs */}

      <div className="mt-3 space-y-1 text-xs text-zinc-500">
        <p>{cpu}</p>
        <p>{ram}</p>
        <p>{storage}</p>
      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between">
        <span className="font-bold text-lg">
          {price}
        </span>

        <button
          className="
          w-10
          h-10
          rounded-full
          bg-black
          text-white
          hover:scale-110
          transition
        "
        >
          →
        </button>
      </div>
    </div>
  );
}