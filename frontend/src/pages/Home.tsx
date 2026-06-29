import { useOutletContext } from "react-router-dom";
import HeroSection from "./HeroSection";
import ProductSection from "../components/ui/ProductSection";
import Footer from "../components/Footer";

type OutletContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Home() {
  const { search } = useOutletContext<OutletContextType>();

  return (
    <main className="overflow-hidden">
      <HeroSection />
      <ProductSection search={search} />
      <Footer />
    </main>
  );
}