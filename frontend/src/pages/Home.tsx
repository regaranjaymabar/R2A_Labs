import HeroSection from "./HeroSection";
import ProductSection from "../components/ui/ProductSection";
import Footer from "../components/Footer";
import { useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const [search, setSearch] = useState("");
  return (
    <>
      <main className="overflow-hidden">
        <Header
          search={search}
          setSearch={setSearch}/>
        <HeroSection />
        <ProductSection 
        search={search}/>
        <Footer />
      </main>
    </>
  );
}