import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
// import BackgroundEffect from "../ui/background/BackgroundEffect";
import bg from "../../assets/dave-hoefler-vHgAy9pOs9I-unsplash.jpg";

export default function MainLayout() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">

      
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${bg}")`,
        }}
      />
      {/* <BackgroundEffect/> */}

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-white/35" />

      {/* Header */}
      <Header
        search={search}
        setSearch={setSearch}
      />

      {/* Content */}
      <Outlet context={{ search, setSearch }} />

    </div>
  );
}