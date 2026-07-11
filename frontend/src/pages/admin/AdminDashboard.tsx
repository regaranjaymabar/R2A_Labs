import { GlowingCards, GlowingCard } from "../../components/ui/glowing-cards";
import { Package, Tag, TrendingUp, Store, DollarSign, Award, Boxes, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { storeAdminService } from "../../services/storeAdminService";
import { productService } from "../../services/productService";
import { brandService } from "../../services/brandService";
import { storeService } from "../../services/storeService";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const user = useAuthStore((state) => state.user);
    const isSuperAdmin = user?.role === "superadmin" || user?.role === "super_admin";
    const isStoreAdmin = !isSuperAdmin;

    // Fetch summary jika yang login adalah store admin
    const { data: storeSummary } = useQuery({
        queryKey: ["admin-summary"],
        queryFn: () => storeAdminService.getSummary(),
        enabled: isStoreAdmin,
    });

    // Fetch data untuk Superadmin (Produk, Merek, Toko)
    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getAll(),
        enabled: !isStoreAdmin,
    });

    const { data: brands = [] } = useQuery({
        queryKey: ["brands"],
        queryFn: () => brandService.getAll(),
        enabled: !isStoreAdmin,
    });

    const { data: stores = [] } = useQuery({
        queryKey: ["stores"],
        queryFn: () => storeService.getAll(),
        enabled: !isStoreAdmin,
    });

    // Statistik untuk Store Admin (Dinamis dari API /api/admin/reports/summary)
    const storeAdminStats = [
        {
            title: "Total Laptop di Tokoku",
            value: storeSummary ? `${storeSummary.totalProducts} Model` : "Memuat...",
            change: "Terdaftar di katalog toko",
            icon: <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
            iconBg: "bg-purple-50 dark:bg-purple-900/30",
            glowColor: "#9333ea",
        },
        {
            title: "Total Unit Stok",
            value: storeSummary ? `${storeSummary.totalStock} Unit` : "Memuat...",
            change: `${storeSummary?.availableCount || 0} model tersedia`,
            icon: <Boxes className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
            glowColor: "#10b981",
        },
        {
            title: "Rata-rata Harga",
            value: storeSummary
                ? `Rp ${(storeSummary.avgPrice || 0).toLocaleString("id-ID")}`
                : "Memuat...",
            change: "Harga rata-rata toko",
            icon: <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
            iconBg: "bg-blue-50 dark:bg-blue-900/30",
            glowColor: "#3b82f6",
        },
        {
            title: "Muncul di Rekomendasi",
            value: storeSummary ? `${storeSummary.recommendationAppearances} Kali` : "Memuat...",
            change: "Direkomendasikan SPK SAW",
            icon: <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
            iconBg: "bg-amber-50 dark:bg-amber-900/30",
            glowColor: "#f59e0b",
        },
    ];

    // Statistik Dinamis / Superadmin (Mengikuti database)
    const superAdminStats = [
        {
            title: "Total Produk",
            value: `${products.length} Item`,
            change: "Master Laptop Terdaftar",
            icon: <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
            iconBg: "bg-blue-50 dark:bg-blue-900/30",
            glowColor: "#3b82f6",
        },
        {
            title: "Total Merek",
            value: `${brands.length} Merek`,
            change: "Brand Partner",
            icon: <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
            glowColor: "#10b981",
        },
        {
            title: "Total Toko",
            value: `${stores.length} Toko`,
            change: "Mitra Cabang Terdaftar",
            icon: <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
            iconBg: "bg-amber-50 dark:bg-amber-900/30",
            glowColor: "#f59e0b",
        },
    ];

    const displayStats = isStoreAdmin ? storeAdminStats : superAdminStats;

    return (
        <div className="space-y-8 pb-10">
            {/* Header Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Selamat Datang, {user?.name || "Admin"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {isStoreAdmin
                            ? "Pantau statistik inventaris, harga, dan performa rekomendasi toko kamu."
                            : "Panel kendali utama Sistem Pendukung Keputusan & Aggregator Laptop."}
                    </p>
                </div>
            </div>

            {/* Glowing Cards Stat Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Ringkasan Statistik {isStoreAdmin ? "Toko Saya" : "Global"}
                    </h2>
                </div>

                <GlowingCards gap="1.5rem" maxWidth="100%" padding="0">
                    {displayStats.map((stat, idx) => (
                        <GlowingCard
                            key={idx}
                            glowColor={stat.glowColor}
                            className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </span>
                                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                                    {stat.icon}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    {stat.value}
                                </h3>
                                <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                        </GlowingCard>
                    ))}
                </GlowingCards>
            </div>

            {/* Quick Actions untuk Store Admin */}
            {isStoreAdmin && (
                <div className="space-y-4 pt-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Aksi Cepat Toko
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/admin/productstores"
                            className="p-6 rounded-3xl bg-white dark:bg-[#151216] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <Boxes className="w-6 h-6" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Kelola Stok & Harga
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Tambahkan laptop ke tokomu atau perbarui harga jual dan ketersediaan stok.
                            </p>
                        </Link>

                        <Link
                            to="/admin/my-store-profile"
                            className="p-6 rounded-3xl bg-white dark:bg-[#151216] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                    <Store className="w-6 h-6" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Profil Tokoku
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Ubah nama cabang, alamat lengkap, kontak WhatsApp, dan koordinat GPS peta toko.
                            </p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}