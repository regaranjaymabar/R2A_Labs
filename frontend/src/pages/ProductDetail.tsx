import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { catalogService } from "./services/catalog.service";
import ProductGallery from "../components/ui/detailProduct/ProductGallery";
import ProductInfo from "../components/ui/detailProduct/ProductInfo";
import QuickSpecs from "../components/ui/detailProduct/QuickSpecs";
import MarketplaceSection from "../components/marketplace/MarketplaceSection";

export default function ProductDetail() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => catalogService.getDetail(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <main className="pt-40 text-center min-h-screen">
        <p className="text-lg text-zinc-500">Loading product...</p>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="pt-40 text-center min-h-screen">
        <h1 className="text-4xl font-bold">Laptop tidak ditemukan</h1>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-full hover:opacity-90 transition"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-26 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ProductGallery images={[]} />
          <ProductInfo laptop={product} />
        </div>
        <QuickSpecs laptop={product} />
        <MarketplaceSection laptopId={product.id} />
      </div>
    </main>
  );
}