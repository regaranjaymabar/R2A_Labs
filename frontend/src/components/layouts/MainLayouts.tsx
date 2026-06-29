import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import BackgroundEffect from "../ui/background/BackgroundEffect";

export default function MainLayout() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundEffect />

      {/* Overlay putih transparan */}
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] -z-10" />

      {/* Header dengan search state */}
      <Header search={search} setSearch={setSearch} />

      {/* Passing search ke child pages via context */}
      <Outlet context={{ search, setSearch }} />
    </div>
  );
}