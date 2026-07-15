import { useState, useEffect } from "react";
import { GlowingCards, GlowingCard } from "../../components/ui/glowing-cards";
import { Package, Tag, TrendingUp, Store, DollarSign, Award, Boxes, ArrowRight, Clock, PlusCircle, Trash2, Edit3, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { storeAdminService } from "../../services/storeAdminService";
import { productService } from "../../services/productService";
import { brandService } from "../../services/brandService";
import { storeService } from "../../services/storeService";
import { productStoreService } from "../../services/productStoreService";
import { storeLogger, type StoreActivityLog } from "../../utils/storeLogger";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const user = useAuthStore((state) => state.user);
    const isSuperAdmin = user?.role === "superadmin" || user?.role === "super_admin";
    const isStoreAdmin = !isSuperAdmin;
    const storeId = (user as any)?.store?.id || (user as any)?.id || "default";

    const [activityLogs, setActivityLogs] = useState<StoreActivityLog[]>([]);

    const { data: storeSummary } = useQuery({
        queryKey: ["admin-summary"],
        queryFn: () => storeAdminService.getSummary(),
        enabled: isStoreAdmin,
    });

    const { data: storeInventory = [] } = useQuery({
        queryKey: ["store-inventory"],
        queryFn: () => productStoreService.getAll(),
        enabled: isStoreAdmin,
    });

    useEffect(() => {
        if (isStoreAdmin) {
            setActivityLogs(storeLogger.getLogs(storeId));
        }
    }, [isStoreAdmin, storeId, storeInventory]);


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
                ? `Rp ${Math.round(storeSummary.avgPrice || 0).toLocaleString("id-ID")}`
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
            title: "Total Brand",
            value: `${brands.length} Brand`,
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
                            ? `Pantau inventaris, harga, dan performa rekomendasi dari ${(user as any)?.store?.name || "toko kamu"}.`
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
                <div className="space-y-6 pt-4">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Aktivitas Terakhir Anda
                                        </h3>
                                    </div>
                                </div>
                                {activityLogs.length > 0 && (
                                    <button
                                        onClick={() => {
                                            storeLogger.clearLogs(storeId);
                                            setActivityLogs([]);
                                        }}
                                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        title="Bersihkan riwayat log"
                                    >
                                        Bersihkan Log
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3.5">
                                {(() => {
                                    let displayLogs: any[] = activityLogs;
                                    if (displayLogs.length === 0 && storeInventory.length > 0) {
                                        displayLogs = storeInventory
                                            .slice()
                                            .sort((a: any, b: any) => {
                                                const timeA = new Date(a.updated_at || a.updatedAt || 0).getTime();
                                                const timeB = new Date(b.updated_at || b.updatedAt || 0).getTime();
                                                return timeB - timeA;
                                            })
                                            .slice(0, 6)
                                            .map((item: any, idx: number) => {
                                                const brandName = item.product?.brand?.name || item.brand_name || "";
                                                const modelName = item.product?.modelName || item.product?.name || item.model_name || item.product_name || `Produk #${item.productId ?? item.product_id ?? item.id}`;
                                                const fullLaptopName = [brandName, modelName].filter(Boolean).join(" ");
                                                
                                                const processor = item.product?.processor || item.processor;
                                                const ram = item.product?.ram || item.ram;
                                                const storage = item.product?.storage || item.storage;
                                                const specs = [processor, ram, storage].filter(Boolean).join(" • ");
                                                
                                                const isReady = (item.is_available ?? item.isAvailable) ? "Tersedia" : "Nonaktif";

                                                return {
                                                    id: `fb-${item.id || idx}`,
                                                    title: `Inventaris: ${fullLaptopName}`,
                                                    description: `${specs ? specs + " — " : ""}Rp ${Number(item.price || 0).toLocaleString("id-ID")} (Stok: ${item.stock} Unit • ${isReady})`,
                                                    timestamp: item.updated_at || item.updatedAt || new Date().toISOString(),
                                                    type: "update",
                                                };
                                            });
                                    }

                                    if (displayLogs.length === 0) {
                                        return (
                                            <div className="py-12 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
                                                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                <p className="text-base font-medium text-gray-600">
                                                    Belum ada catatan aktivitas
                                                </p>
                                                <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                                                    Setiap kali Anda menambah produk atau mengubah harga/stok, jejak perubahannya akan otomatis muncul di sini.
                                                </p>
                                            </div>
                                        );
                                    }

                                    const formatTime = (isoString?: string) => {
                                        if (!isoString) return "-";
                                        const date = new Date(isoString);
                                        if (isNaN(date.getTime())) return isoString;
                                        const now = new Date();
                                        const diffMs = now.getTime() - date.getTime();
                                        const diffMins = Math.floor(diffMs / 60000);
                                        const diffHours = Math.floor(diffMins / 60);
                                        const diffDays = Math.floor(diffHours / 24);

                                        if (diffMins < 1) return "Baru saja";
                                        if (diffMins < 60) return `${diffMins} mnt lalu`;
                                        if (diffHours < 24) return `${diffHours} jam lalu`;
                                        if (diffDays < 7) return `${diffDays} hari lalu`;
                                        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                                    };

                                    return displayLogs.slice(0, 8).map((log, idx) => {
                                        let icon = <CheckCircle2 className="w-5 h-5 text-amber-600" />;
                                        let bg = "bg-amber-50 border-amber-100";
                                        if (log.type === "add") {
                                            icon = <PlusCircle className="w-5 h-5 text-emerald-600" />;
                                            bg = "bg-emerald-50 border-emerald-100";
                                        } else if (log.type === "update") {
                                            icon = <Edit3 className="w-5 h-5 text-blue-600" />;
                                            bg = "bg-blue-50 border-blue-100";
                                        } else if (log.type === "delete") {
                                            icon = <Trash2 className="w-5 h-5 text-rose-600" />;
                                            bg = "bg-rose-50 border-rose-100";
                                        } else if (log.type === "profile") {
                                            icon = <Store className="w-5 h-5 text-purple-600" />;
                                            bg = "bg-purple-50 border-purple-100";
                                        }

                                        return (
                                            <div key={log.id || idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition-all">
                                                <div className={`p-2.5 rounded-xl border ${bg} mt-0.5 shrink-0`}>
                                                    {icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-sm md:text-base font-bold text-gray-900 truncate">
                                                            {log.title}
                                                        </h4>
                                                        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap shrink-0">
                                                            {formatTime(log.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {log.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs md:text-sm text-gray-500">
                            <span>Pencatatan sesi real-time otomatis</span>
                            <Link
                                to="/admin/productstores"
                                className="font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1.5"
                            >
                                <span>Kelola Semua Inventaris</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
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