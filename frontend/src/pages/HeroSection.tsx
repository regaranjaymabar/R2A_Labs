import { Link } from "react-router-dom";
import TiltedCard from "../components/ui/TiltedCard"; // Sesuaikan path

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-23">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT - Content */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Temukan Laptop
              <br />
              Terbaik untuk
              <br />
              Kebutuhanmu
            </h1>

            <p className="mt-6 text-zinc-800 text-lg max-w-xl">
              Cari laptop berdasarkan kebutuhan, budget, performa, desain, dan
              spesifikasi terbaik yang cocok untuk aktivitasmu.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/rekomendasi"
                className="px-8 py-4 rounded-full bg-black text-white font-medium cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                Jelajahi Laptop →
              </Link>

              <button className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-xl border border-white/30 hover:bg-white/80 transition-colors">
                Cara Memilih
              </button>
            </div>
          </div>

          {/* RIGHT - TiltedCard */}
          <div className="relative flex justify-center items-center">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-200/50 via-purple-200/30 to-pink-200/40 rounded-full blur-3xl scale-75" />

            <TiltedCard
              imageSrc="https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mbp16-2024.png"
              altText="Laptop Rekomendasi Terbaik"
              captionText='MacBook Pro 16" - M4 Max'
              containerHeight="500px"
              containerWidth="100%"
              imageHeight="400px"
              imageWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.03}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div>
                  <span >
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}