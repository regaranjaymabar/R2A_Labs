import { GlowingCards, GlowingCard } from "../../components/ui/glowing-cards";
import { Package, Tag, TrendingUp, Store } from "lucide-react";

export default function AdminDashboard() {
    const statsData = [
        {
            title: "Total Produk",
            value: "124 Item",
            change: "+12% bulan ini",
            isPositive: true,
            icon: <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
            iconBg: "bg-blue-50 dark:bg-blue-900/30",
            glowColor: "#3b82f6", // Blue
        },
        {
            title: "Total Merek",
            value: "18 Merek",
            change: "+3 merek baru",
            isPositive: true,
            icon: <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
            glowColor: "#10b981", // Emerald
        },
        {
            title: "Total Toko",
            value: "18 Toko",
            change: "+3 toko baru",
            isPositive: true,
            icon: <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
            iconBg: "bg-amber-50 dark:bg-amber-900/30",
            glowColor: "#f59e0b", // Amber
        },
        
    ];

    return (
        <div className="space-y-8 pb-10">

            {/* Glowing Cards Stat Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Ringkasan Statistik
                    </h2>
                </div>

                <GlowingCards gap="1.5rem" maxWidth="100%" padding="0">
                    {statsData.map((stat, idx) => (
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

            {/* Quick Actions / Aktivitas Terbaru Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            </div>
        </div>
    );
}