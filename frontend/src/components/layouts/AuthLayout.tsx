import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <img
        src="https://www.asus.com/ca-en/site/gaming/assets/images/rog/Zephyrus-G14/kv-hero_1.webp"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0" />

      {/* Glow */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-white/10 blur-[140px]" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-[160px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        <div
          className="
            w-full
            max-w-md
            rounded-4xl
            border
            border-white/40
            bg-white
            backdrop-blur-xl
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            p-10
          "
        >
          <Outlet />
        </div>

      </div>

    </div>
  );
}