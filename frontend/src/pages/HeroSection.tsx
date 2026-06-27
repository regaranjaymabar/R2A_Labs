import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-23">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <h1
              className="
              text-5xl
              md:text-6xl
              lg:text-7xl
              font-bold
              leading-tight
              tracking-tight
            "
            >
              Temukan Laptop
              <br />
              Terbaik untuk
              <br />
              Kebutuhanmu
            </h1>

            <p className="mt-6 text-zinc-800 text-lg max-w-xl">
              Cari laptop berdasarkan kebutuhan, budget,
              performa, desain, dan spesifikasi terbaik
              yang cocok untuk aktivitasmu.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/rekomendasi"
                className="
                px-8 py-4
                rounded-full
                bg-black
                text-white
                font-medium
                cursor-pointer">Jelajahi Laptop →</Link>

              <button
                className="
                px-8 py-4
                rounded-full
                bg-white/60
                backdrop-blur-xl
                border border-white/30
              "
              >
                Cara Memilih
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">

            <div
              className="
              absolute
              inset-0
              bg-white/30
              rounded-full
              blur-3xl
            "
            />

            <img
              src="https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mbp16-2024.png"
              alt="Laptop"
              className="
              relative
              z-10
              w-full
              drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]
            "
            />
          </div>

        </div>

        {/* STATS */}
        <div className=" mt-10 grid md:grid-cols-4 gap-6 p-8 rounded-[40px] bg-white/40 backdrop-blur-2xl border border-white/20"
        >
          <div>
            <h2 className="text-4xl font-bold">250+</h2>
            <p className="text-zinc-500">
              Laptop Direkomendasikan
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">50+</h2>
            <p className="text-zinc-500">
              Brand Terpercaya
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">10K+</h2>
            <p className="text-zinc-500">
              Pengguna Terbantu
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">100%</h2>
            <p className="text-zinc-500">
              Rekomendasi Akurat
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}