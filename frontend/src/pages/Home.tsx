import { useOutletContext } from "react-router-dom";
import HeroSection from "./HeroSection";
import ProductSection from "../components/ui/ProductSection";
import Footer from "../components/Footer";
import { useCatalog } from "../hooks/useCatalog";

type OutletContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Home() {
  const { search } = useOutletContext<OutletContextType>();

  const {
    data: laptops = [],
    isLoading,
    isError,
  } = useCatalog(search);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading laptop...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Gagal mengambil data laptop.</p>
      </main>
    );
  }

  return (
    <main className="overflow-hidden">
      <HeroSection />

      <ProductSection
        search={search}
        laptops={laptops}
      />

      <Footer />
    </main>
  );
}