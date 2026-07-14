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

    const { data: storeSummary } = useQuery({
        queryKey: ["admin-summary"],
        queryFn: () => storeAdminService.getSummary(),
        enabled: isStoreAdmin,
    });

    // ambil data untuk Superadmin
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

    const storeAdminStats = [
        {
            title: "Total Laptop di Tokoku",
            value: storeSummary ? `${storeSummary.totalProducts} Model` : "Memuat...",
            change: "Terdaftar di katalog toko",
            icon: <Package className="w-5 h-5 text-purple-600" />,
            iconBg: "bg-purple-50",
            glowColor: "#9333ea",
        },
        {
            title: "Total Unit Stok",
            value: storeSummary ? `${storeSummary.totalStock} Unit` : "Memuat...",
            change: `${storeSummary?.availableCount || 0} model tersedia`,
            icon: <Boxes className="w-5 h-5 text-emerald-600" />,
            iconBg: "bg-emerald-50",
            glowColor: "#10b981",
        },
        {
            title: "Rata-rata Harga",
            value: storeSummary
                ? `Rp ${(storeSummary.avgPrice || 0).toLocaleString("id-ID")}`
                : "Memuat...",
            change: "Harga rata-rata toko",
            icon: <DollarSign className="w-5 h-5 text-blue-600" />,
            iconBg: "bg-blue-50",
            glowColor: "#3b82f6",
        },
        {
            title: "Muncul di Rekomendasi",
            value: storeSummary ? `${storeSummary.recommendationAppearances} Kali` : "Memuat...",
            change: "Direkomendasikan SPK SAW",
            icon: <Award className="w-5 h-5 text-amber-600" />,
            iconBg: "bg-amber-50",
            glowColor: "#f59e0b",
        },
    ];

    const superAdminStats = [
        {
            title: "Total Produk",
            value: `${products.length} Item`,
            change: "Master Laptop Terdaftar",
            icon: <Package className="w-5 h-5 text-blue-600" />,
            iconBg: "bg-blue-50",
            glowColor: "#3b82f6",
        },
        {
            title: "Total Merek",
            value: `${brands.length} Merek`,
            change: "Brand Partner",
            icon: <Tag className="w-5 h-5 text-emerald-600" />,
            iconBg: "bg-emerald-50",
            glowColor: "#10b981",
        },
        {
            title: "Total Toko",
            value: `${stores.length} Toko`,
            change: "Mitra Cabang Terdaftar",
            icon: <Store className="w-5 h-5 text-amber-600" />,
            iconBg: "bg-amber-50",
            glowColor: "#f59e0b",
        },
    ];

    const displayStats = isStoreAdmin ? storeAdminStats : superAdminStats;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Selamat Datang, {user?.name || "Admin"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isStoreAdmin
                            ? "Pantau statistik inventaris, harga, dan performa rekomendasi toko kamu."
                            : "Panel kendali utama Sistem Pendukung Keputusan & Aggregator Laptop."}
                    </p>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
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
                                <span className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </span>
                                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                                    {stat.icon}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {stat.value}
                                </h3>
                                <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                        </GlowingCard>
                    ))}
                </GlowingCards>
            </div>

            {isStoreAdmin && (
                <div className="space-y-4 pt-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Aksi Cepat Toko
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/admin/productstores"
                            className="p-6 rounded-3xl bg-white border border-gray-200 hover:border-purple-500/50 transition-all group shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                                    <Boxes className="w-6 h-6" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Kelola Stok & Harga
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Tambahkan laptop ke tokomu atau perbarui harga jual dan ketersediaan stok.
                            </p>
                        </Link>

                        <Link
                            to="/admin/my-store-profile"
                            className="p-6 rounded-3xl bg-white border border-gray-200 hover:border-purple-500/50 transition-all group shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Store className="w-6 h-6" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Profil Tokoku
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ubah nama cabang, alamat lengkap, kontak WhatsApp, dan koordinat GPS peta toko.
                            </p>
                        </Link>
                    </div>
                </div>
            )}

            {!isStoreAdmin && products.length > 0 && (
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Distribusi Laptop per Brand
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Jumlah total laptop yang terdaftar per brand partner di katalog sistem.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Peringkat Brand 
                            </h3>
                            <div className="space-y-4">
                                {(() => {
                                    const brandCounts: Record<string, number> = {};
                                    products.forEach((p: any) => {
                                        const bName = p.brand_name || p.brand?.name || "Lainnya";
                                        brandCounts[bName] = (brandCounts[bName] || 0) + 1;
                                    });

                                    const sortedBrands = Object.entries(brandCounts)
                                        .map(([name, count]) => ({ name, count }))
                                        .sort((a, b) => b.count - a.count);

                                    const maxCount = Math.max(...sortedBrands.map(b => b.count), 1);
                                    
                                    return sortedBrands.slice(0, 5).map((b, idx) => {
                                        return (
                                            <div key={idx} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                                            {idx + 1}
                                                        </span>
                                                        {b.name}
                                                    </span>
                                                    <span>
                                                        {b.count} Item
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-black rounded-full transition-all duration-500"
                                                        style={{ width: `${(b.count / maxCount) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Informasi Katalog SPK
                                </h3>
                                <div className="space-y-3.5">
                                    {(() => {
                                        const activeCount = products.filter((p: any) => {
                                            const val = p.is_active !== undefined ? p.is_active : p.isActive;
                                            return val === undefined || val === 1 || val === true || Number(val) === 1;
                                        }).length;
                                        const nonActiveCount = products.length - activeCount;
                                        const uniqueBrands = new Set(products.map((p: any) => p.brand_name || p.brand?.name)).size;
                                        
                                        return (
                                            <>
                                                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                                                    <span className="text-gray-500 font-medium">Laptop Aktif di Rekomendasi</span>
                                                    <span className="font-bold text-emerald-600">{activeCount} Laptop</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                                                    <span className="text-gray-500 font-medium">Laptop Nonaktif</span>
                                                    <span className="font-bold text-gray-500">{nonActiveCount} Laptop</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                                                    <span className="text-gray-500 font-medium">Rata-rata Model per Brand</span>
                                                    <span className="font-bold text-gray-900">{(products.length / (uniqueBrands || 1)).toFixed(1)} Model</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">Total Kombinasi Model & Spek</span>
                                                    <span className="font-bold text-purple-600">{products.length} Variasi</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <Link 
                                    to="/admin/products"
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                                >
                                    <span>Buka Katalog Laptop</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}