
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

// Pemetaan judul halaman berdasarkan rute (pathname)
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  brands: "Brands",
  products: "Daftar Produk",
  stores: "Daftar Toko",
  productstores: "Stok & Harga",
  "my-store-profile": "Profil Tokoku",
  criterias: "Kriteria",
  subcriterias: "Sub-Kriteria",
  productweights: "Pembobotan Produk",
  recommendations: "Riwayat Rekomendasi",
  users: "Daftar Pengguna",
  "user-stores": "Hak Akses Toko",
  add: "Tambah Baru",
  edit: "Edit Data",
};

export default function AdminHeader() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Pecah rute menjadi segmen path (misal: ['admin', 'products', 'add'])
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment && segment !== "admin");

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Kiri: Mini Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm font-medium text-gray-500 min-w-0">
          <ol className="flex items-center gap-1.5 flex-wrap">
            {/* Beranda Admin */}
            <li className="inline-flex items-center">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                title="Dasbor Admin"
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </li>

            {/* Iterasi Segmen Rute */}
            {pathSegments.map((segment, index) => {
              // Abaikan jika segmen berupa angka ID (misal: /edit/12)
              if (!isNaN(Number(segment))) return null;

              const isLast = index === pathSegments.length - 1;
              const to = `/admin/${pathSegments.slice(0, index + 1).join("/")}`;
              const label = routeLabels[segment] || segment.replace(/-/g, " ");

              return (
                <li key={to} className="inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {isLast ? (
                    <span className="font-bold text-gray-900 capitalize truncate max-w-[160px] sm:max-w-xs">
                      {label}
                    </span>
                  ) : (
                    <Link
                      to={to}
                      className="hover:text-gray-900 transition-colors capitalize truncate max-w-[120px]"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Kanan: Mini Info Staf / Peran Aktif */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-bold border border-gray-200">
            {user?.role === "superadmin" || user?.role === "super_admin"
              ? "SUPER ADMIN"
              : "STORE ADMIN"}
          </span>
        </div>
      </div>
    </header>
  );
}
