import { useState } from "react";
import RecommendationResult from "./RecommendationResult";

const purposes = [
  {
    id: "Pelajar",
    title: "Pelajar",
    subtitle: "Belajar & Tugas",
    image: "https://media.istockphoto.com/id/1425235236/id/foto/tampak-samping-anak-sekolah-muda-afrika-amerika-yang-bekerja-di-depan-laptop.jpg?s=612x612&w=0&k=20&c=tE--tDCu5dB8IH7J9zcgPQ3w_rHWkgF30dd4aNyrhp4=",
  },
  {
    id: "Programmer",
    title: "Programmer",
    subtitle: "Coding & Development",
    image: "https://media.istockphoto.com/id/2156385097/id/foto/pasangan-hispanik-amerika-latin-pengembang-perangkat-lunak-menggunakan-komputer-mengerjakan.jpg?s=612x612&w=0&k=20&c=Aj29_r9V3EMQKt4-6icunbWJ4wUQgM6f1hKT_mGzzWk=",
  },
  {
    id: "Gaming",
    title: "Gaming",
    subtitle: "AAA & Esports",
    image: "https://media.istockphoto.com/id/909705214/id/foto/anak-laki-laki-saling-membantu-saat-bermain-game-esports-di-laptop-di-malam-hari.jpg?s=612x612&w=0&k=20&c=68aNuZHNwZu4JHfcXZTGpYIu3AZM15W1FP9dK2umyE4=",
  },
  {
    id: "Multimedia",
    title: "Multimedia",
    subtitle: "Editing & Design",
    image: "https://media.istockphoto.com/id/614225004/id/foto/tata-letak-desain-komputer-wanita.jpg?s=612x612&w=0&k=20&c=Sdqkqrh-5mC8Hf8EtclqdUthYT43HizouiZMa7r5zKI=",
  },
  {
    id: "Content Creator",
    title: "Content Creator",
    subtitle: "Video & Streaming",
    image: "https://media.istockphoto.com/id/1180897643/id/foto/konsep-pengoperasian-sederhana-blogger-dan-vlogger-tangan-menggunakan-laptop-pada-editor-video.jpg?s=612x612&w=0&k=20&c=Fu5OVSNR07gevDb8PLIjMGQNECnJ7ZioDCA8SX5GAZ4=",
  },
];

const budgets = [
  "< 5 Juta",
  "5 - 10 Juta",
  "10 - 15 Juta",
  "15 - 20 Juta",
  "> 20 Juta",
];

export default function RecommendationForm() {
  const [purpose, setPurpose] = useState("");
  const [budget, setBudget] = useState("");
  const [showResult, setShowResult] = useState(false);
  

  return (
    <div
      className="
      mt-20
      bg-white/10
      backdrop-blur-xl
      border border-white/20
      rounded-[40px]
      p-10
    "
    >
      <h2 className="text-3xl font-bold">
        Apa kebutuhan utama Anda?
        </h2>

      <p className="text-zinc-600 mt-3">
        Pilih aktivitas yang paling sering dilakukan.
      </p>


        <div className="mt-14">
        <h2 className="text-3xl font-bold">
            Budget Anda
        </h2>
        
        <div className="flex flex-wrap gap-4 mt-8">
            {budgets.map((item) => (
            <button
                key={item}
                onClick={() => setBudget(item)}
                className={`
                px-6 py-4
                rounded-full
                transition-all
                duration-300
                border

                ${
                    budget === item
                    ? "bg-black text-white border-black"
                    : "bg-white/20 border-white/20 hover:bg-white/40"
                }
                `}
            >
                {item}
            </button>
            ))}
        </div>
        </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10">
  {purposes.map((item) => (
    <button
      key={item.id}
      onClick={() => setPurpose(item.id)}
      className={`
        group
        relative
        overflow-hidden
        h-44
        rounded-3xl
        transition-all
        duration-300
        border border-white/20
        hover:-translate-y-1
        ${
          purpose === item.id
            ? "ring-4 ring-black scale-[1.03]"
            : ""
        }
      `}
    >
      {/* Background Image */}
      <img
        src={item.image}
        alt={item.title}
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          group-hover:scale-110
          transition-transform
          duration-500
        "
      />

      {/* Dark Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-t
          from-black/90
          via-black/35
          to-black/20
        "
      />

      {/* Active Glow */}
      {purpose === item.id && (
        <div
          className="
            absolute
            inset-0
            bg-black/30
          "
        />
      )}

      {/* Check */}
      {purpose === item.id && (
        <div
          className="
            absolute
            top-3
            right-3
            w-10
            h-10
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-black
            text-lg
            font-bold
          "
        >
          ✓
        </div>
      )}

      {/* Content */}
      <div
        className="
          absolute
          bottom-5
          left-5
          text-left
          text-white
        "
      >

        <h3 className="mt-3 text-xl font-semibold">
          {item.title}
        </h3>

        <p className="text-sm text-white/70">
          {item.subtitle}
        </p>
      </div>
    </button>
  ))}
</div>
      <button
        onClick={() => {
        setShowResult(true);

        setTimeout(() => {
            document
            .getElementById("recommendation-result")
            ?.scrollIntoView({
                behavior: "smooth",
            });
        }, 100);
        }}
        className="
            mt-14
            w-full
            py-5
            rounded-3xl
            bg-black
            text-white
            font-semibold
            text-lg
            hover:opacity-90
            transition
            cursor-pointer">Cari Laptop Terbaik →</button>
            {showResult && (
            <RecommendationResult
                purpose={purpose}
                budget={budget}
            />
            )}
    </div>
  );
}