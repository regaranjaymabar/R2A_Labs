import { useParams } from "react-router-dom";

import { laptops } from "../data/laptops";

import ProductGallery from "../components/ui/detailProduct/ProductGallery";
import ProductInfo from "../components/ui/detailProduct/ProductInfo";
import QuickSpecs from "../components/ui/detailProduct/QuickSpecs";
import { useEffect } from "react";
import MarketplaceSection from "../components/marketplace/MarketplaceSection";

export default function ProductDetail() {
  const { id } = useParams();

    useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "auto",
    });
    }, [id]);

  const laptop = laptops.find(
    (item) => item.id === Number(id)
  );

  if (!laptop) {
    return (
      <main className="pt-40 text-center">
        <h1 className="text-4xl font-bold">
          Laptop tidak ditemukan
        </h1>
      </main>
    );
  }

  return (
    <main className="pt-26 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <ProductGallery
            images={laptop.images}
          />

          <ProductInfo
            laptop={laptop}
          />

        </div>

        <QuickSpecs laptop={laptop} />
        <MarketplaceSection laptopId={laptop.id} />
      </div>
    </main>
  );
}