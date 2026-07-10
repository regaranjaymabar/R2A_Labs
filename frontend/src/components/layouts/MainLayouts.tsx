/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import bg from "../../assets/dave-hoefler-vHgAy9pOs9I-unsplash.jpg";

export default function MainLayout() {
  const [search, setSearch] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const location = useLocation();

  // Deteksi apakah sedang di halaman rekomendasi
  const isRecommendationPage = location.pathname === "/rekomendasi";

  useEffect(() => {
    // Kalau bukan halaman rekomendasi, header selalu muncul
    if (!isRecommendationPage) {
      setHeaderVisible(true);
      return;
    }

    // Kalau halaman rekomendasi, deteksi scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY > windowHeight * 0.8) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Cek posisi awal

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRecommendationPage]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${bg}")`,
        }}
      />

      <div className="fixed inset-0 -z-10 bg-white/35" />

      {/* Header dengan kontrol visibilitas */}
      <Header
        search={search}
        setSearch={setSearch}
        visible={headerVisible}
      />

      <Outlet context={{ search, setSearch }} />
    </div>
  );
}