export default function FeaturedLaptop() {
  return (
    <div
      className="
      rounded-[40px]
      bg-white/25
      backdrop-blur-3xl
      border border-white/20
      p-10
      overflow-hidden"
    >

      <div className="grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <img
            src="https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mbp16-2024.png"
            alt="Featured Laptop"
            className="
            w-full
            drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)]
          "
          />
        </div>

        <div>
          <span
            className="
            px-4 py-2
            rounded-full
            bg-white/40
            text-sm
          "
          >
            APPLE
          </span>

          <h2 className="text-5xl font-bold mt-4">
            MacBook Pro 16"
          </h2>

          <p className="text-zinc-600 mt-4">
            Powerful. Beautiful. Built for professionals.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="glass-info">
              <p>Chip</p>
              <h4>M3 Pro</h4>
            </div>

            <div className="glass-info">
              <p>RAM</p>
              <h4>18GB</h4>
            </div>

            <div className="glass-info">
              <p>Storage</p>
              <h4>512GB SSD</h4>
            </div>

            <div className="glass-info">
              <p>Display</p>
              <h4>Liquid Retina</h4>
            </div>

          </div>

          <h3 className="text-4xl font-bold mt-10">
            Rp 36.999.000
          </h3>

          <button
            className="
            mt-6
            px-8 py-4
            rounded-full
            bg-black
            text-white
          "
          >
            Lihat Detail →
          </button>
        </div>

      </div>
    </div>
  );
}