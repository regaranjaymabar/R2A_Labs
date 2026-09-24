import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../../pages/services/catalog.service";
import StoreCard from "./StoreCard";
import { calculateDistance } from "../../utils/haversine";
import type { ProductStore } from "../../types/catalog";

type Props = {
  laptopId: number;
};

export default function MarketplaceSection({ laptopId }: Props) {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [permission, setPermission] = useState<PermissionState | "prompt">("prompt");
  const [sortByCheapest, setSortByCheapest] = useState(false);

  const { data: product } = useQuery({
    queryKey: ["product", laptopId],
    queryFn: () => catalogService.getDetail(laptopId),
    enabled: !!laptopId,
  });

  const getUserLocation = (showLoading = true) => {
    if (!navigator.geolocation) { alert("Browser tidak mendukung Geolocation."); return; }
    if (showLoading) setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions || !navigator.geolocation) return;
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        setPermission(result.state);
        if (result.state === "granted") getUserLocation(false);
        result.onchange = () => {
          setPermission(result.state);
          if (result.state === "granted") getUserLocation(false);
        };
      } catch { console.log("Permissions API tidak didukung."); }
    };
    checkPermission();
  }, []);

  const stores: ProductStore[] = product?.productStores || [];

  const filteredStores = stores
    .map((store) => ({
      ...store,
      distance: userLocation && store.store?.latitude && store.store?.longitude
        ? calculateDistance(userLocation.latitude, userLocation.longitude, Number(store.store.latitude), Number(store.store.longitude))
        : null,
    }))
    .sort((a, b) => {
      if (sortByCheapest) return a.price - b.price;
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

  const cheapestPrice = filteredStores.length > 0 ? Math.min(...filteredStores.map(s => s.price)) : null;

  return (
    <section id="marketplace" className="mt-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold">Marketplace Terdekat</h2>
          <p className="mt-3 text-zinc-600">Temukan toko resmi yang menjual laptop ini.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Switch Harga Termurah */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium transition-colors ${sortByCheapest ? "text-black" : "text-zinc-400"}`}>
              Harga Termurah
            </span>
            <button
              onClick={() => setSortByCheapest(!sortByCheapest)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ${
                sortByCheapest ? "bg-black" : "bg-zinc-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 ${
                  sortByCheapest ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Tombol Lokasi */}
          <button
            onClick={() => getUserLocation()}
            className="rounded-full bg-black text-white px-5 py-2.5 hover:bg-zinc-800 transition text-sm font-medium"
          >
            {loadingLocation ? "Mengambil..." : permission === "granted" ? "Perbarui Lokasi" : "Aktifkan Lokasi"}
          </button>
        </div>
      </div>

      {permission === "granted" && userLocation && (
        <p className="mt-4 text-sm text-green-600">✓ Lokasi aktif. Jarak toko dihitung secara otomatis.</p>
      )}
      {permission === "denied" && (
        <p className="mt-4 text-sm text-red-500">Izin lokasi ditolak.</p>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={{
              id: store.id,
              name: store.store.name,
              address: store.store.address,
              city: store.store.city,
              phone: store.store.phone,
              latitude: Number(store.store.latitude),
              longitude: Number(store.store.longitude),
              price: store.price,
              stock: store.stock,
              distance: store.distance,
            }}
            laptop={{
              id: product?.id || laptopId,
              name: product?.modelName || "",
              image: "",
              price: store.price,
              cpu: product?.processor || "",
              ram: product?.ram || "",
              storage: product?.storage || "",
            }}
            isCheapest={sortByCheapest && store.price === cheapestPrice}
          />
        ))}
      </div>

      {filteredStores.length === 0 && (
        <p className="text-center text-zinc-500 mt-10">Belum ada toko yang menjual laptop ini.</p>
      )}
    </section>
  );
}