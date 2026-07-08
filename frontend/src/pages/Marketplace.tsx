import { useParams } from "react-router-dom";
import MarketplaceSection from "../components/marketplace/MarketplaceSection";

export default function Marketplace() {
  const { id } = useParams();

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <MarketplaceSection laptopId={Number(id)} />
      </div>
    </main>
  );
}