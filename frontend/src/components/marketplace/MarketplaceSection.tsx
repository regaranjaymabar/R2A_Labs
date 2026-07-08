import { useState, useEffect } from "react";
import { stores, type Store } from "../../data/store";
import { laptops } from "../../data/laptops";
import StoreCard from "./StoreCard";
import { calculateDistance } from "../../utils/haversine";

type Props = {
  laptopId: number;
};

export default function MarketplaceSection({
  laptopId,
}: Props) {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(false);

  const [permission, setPermission] = useState<
    PermissionState | "prompt"
  >("prompt");

  // ============================
  // Ambil lokasi user
  // ============================
  const getUserLocation = (showLoading = true) => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung Geolocation.");
      return;
    }

    if (showLoading) {
      setLoadingLocation(true);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  // ============================
  // Cek permission saat halaman dibuka
  // ============================
  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions || !navigator.geolocation) return;

      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });

        setPermission(result.state);

        if (result.state === "granted") {
          getUserLocation(false);
        }

        result.onchange = () => {
          setPermission(result.state);

          if (result.state === "granted") {
            getUserLocation(false);
          }
        };
      } catch {
        console.log("Permissions API tidak didukung.");
      }
    };

    checkPermission();
  }, []);

  // ============================
  // Filter toko
  // ============================
  const filteredStores = stores
    .filter((item: Store) => item.laptopId === laptopId)
    .map((store: Store) => ({
      ...store,
      distance: userLocation
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            store.latitude,
            store.longitude
          )
        : null,
    }))
    .sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;

      return a.distance - b.distance;
    });

  const laptop = laptops.find(
    (item) => item.id === laptopId
  );

  return (
    <section id="marketplace" className="mt-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold">
            Marketplace Terdekat
          </h2>

          <p className="mt-3 text-zinc-600">
            Temukan toko resmi yang menjual laptop ini.
          </p>
        </div>

        <button
          onClick={() => getUserLocation()}
          className="
            rounded-full
            bg-black
            text-white
            px-6
            py-3
            hover:bg-zinc-800
            transition
          "
        >
          {loadingLocation
            ? "Mengambil Lokasi..."
            : permission === "granted"
            ? "Perbarui Lokasi"
            : "Aktifkan Lokasi"}
        </button>
      </div>

      {permission === "granted" && userLocation && (
        <p className="mt-4 text-sm text-green-600">
          ✓ Lokasi aktif. Jarak toko dihitung secara otomatis.
        </p>
      )}

      {permission === "denied" && (
        <p className="mt-4 text-sm text-red-500">
          Izin lokasi ditolak. Aktifkan melalui pengaturan browser agar jarak toko dapat dihitung.
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            laptop={laptop}
          />
        ))}
      </div>
    </section>
  );
}