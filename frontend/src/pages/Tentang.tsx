import { 
  Sparkles, 
  Target, 
  Zap, 
  MapPin, 
  History, 
  Shield,
  Cpu,
  ChevronDown 
} from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">
      {/* HERO — Fullscreen */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            Temukan Laptop
            <br />
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 bg-clip-text text-transparent">
              Tanpa Ragu.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
            AMBALABS menggunakan kecerdasan SPK untuk merekomendasikan laptop terbaik
            sesuai kebutuhan, budget, dan preferensi kamu.
          </p>

          <div className="pt-8">
            <ChevronDown size={32} className="mx-auto animate-bounce text-zinc-400" />
          </div>
        </div>
      </section>

      {/* STATS — Full-width dark */}
      <section className="bg-zinc-950 text-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { value: "3", label: "Metode SPK" },
              { value: "8", label: "Kriteria" },
              { value: "200+", label: "Laptop" },
              { value: "50+", label: "Toko Resmi" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-6xl md:text-7xl font-bold mb-2">{stat.value}</div>
                <div className="text-zinc-400 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — Alternating */}
      {[
        {
          icon: <Sparkles size={48} className="text-zinc-900" />,
          title: "Katalog Lengkap",
          desc: "Jelajahi ratusan laptop dari berbagai brand terpercaya. Setiap produk dilengkapi spesifikasi detail dan harga real-time dari toko resmi di seluruh Indonesia.",
          bg: "bg-zinc-50",
        },
        {
          icon: <Target size={48} className="text-zinc-900" />,
          title: "SPK Multi-Metode",
          desc: "Kami menggabungkan tiga metode Sistem Pendukung Keputusan — SAW, WP, dan TOPSIS — untuk memberikan rekomendasi paling akurat berdasarkan 8 kriteria berbeda.",
          bg: "bg-white",
        },
        {
          icon: <Zap size={48} className="text-zinc-900" />,
          title: "Sesuaikan Prioritas",
          desc: "Atur sendiri bobot setiap kriteria sesuai keinginanmu. Lebih mementingkan performa? Atau harga? Kamu yang tentukan.",
          bg: "bg-zinc-50",
        },
        {
          icon: <MapPin size={48} className="text-zinc-900" />,
          title: "Lokasi Terdekat",
          desc: "Aktifkan lokasi dan temukan toko penjual terdekat. Bandingkan harga antar toko dan pilih yang paling menguntungkan.",
          bg: "bg-white",
        },
        {
          icon: <History size={48} className="text-zinc-900" />,
          title: "Riwayat Cerdas",
          desc: "Setiap rekomendasi yang kamu buat tersimpan rapi. Lihat kembali, bandingkan, dan temukan laptop impianmu kapan saja.",
          bg: "bg-zinc-50",
        },
        {
          icon: <Shield size={48} className="text-zinc-900" />,
          title: "Gratis Selamanya",
          desc: "Semua fitur — tanpa batasan, tanpa biaya tersembunyi. Kami percaya teknologi harus bisa diakses semua orang.",
          bg: "bg-white",
        },
      ].map((feature, i) => (
        <section key={i} className={`${feature.bg} py-32 px-6`}>
          <div className="max-w-6xl mx-auto">
            <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
              <div className="flex-1 flex justify-center">
                <div className="w-32 h-32 rounded-3xl bg-white shadow-2xl shadow-zinc-200 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{feature.title}</h2>
                <p className="text-lg text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* METHODE — Dark */}
      <section className="bg-zinc-950 text-white py-32 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <h2 className="text-5xl md:text-6xl font-bold">Tiga Metode. Satu Keputusan.</h2>
          
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Cpu size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">SAW</h3>
              <p className="text-zinc-400 leading-relaxed">Simple Additive Weighting — menghitung skor berdasarkan penjumlahan terbobot dari nilai normalisasi.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Cpu size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">WP</h3>
              <p className="text-zinc-400 leading-relaxed">Weighted Product — menggunakan perkalian untuk menghubungkan rating atribut dengan bobot.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Cpu size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">TOPSIS</h3>
              <p className="text-zinc-400 leading-relaxed">Technique for Order Preference — memilih berdasarkan jarak ke solusi ideal positif dan negatif.</p>
            </div>
          </div>
        </div>
      </section>

      <footer/>
    </div>
  );
}