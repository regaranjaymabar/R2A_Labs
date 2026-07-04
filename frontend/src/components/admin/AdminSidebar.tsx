import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/common/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import {
    LayoutDashboard,
    Tag,
    Package,
    Store,
    Boxes,
    Sliders,
    ListFilter,
    ListTree,
    Scale,
    History,
    Users,
    ShieldCheck,
    LogOut,
    ChevronDown,
    ChevronRight,
    Menu,
    X
} from "lucide-react";

export default function AdminSidebar() {
    const { user, logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout,
    }));
    // Hanya super_admin / admin yang bisa lihat master data & konfigurasi
    const isSuperAdmin = !user?.role || user?.role === "admin" || user?.role === "super_admin";
    const location = useLocation();
    const [isSpkOpen, setIsSpkOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const isActive = (path: string) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };
    const isSpkActive = isActive("/admin/criterias") ||
        isActive("/admin/subcriterias") ||
        isActive("/admin/productweights") ||
        isActive("/admin/recommendations");

    return (
        <>
            <div className="sm:hidden p-3 pb-0">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="inline-flex items-center justify-center text-gray-900 dark:text-white p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-controls="default-sidebar"
                    title="Open sidebar"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="w-7 h-7" />
                </button>
            </div>
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs sm:hidden transition-opacity"
                />
            )}

      
            <aside
                id="default-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out sm:translate-x-0 ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                } bg-white/95 dark:bg-[#151216]/95 backdrop-blur-xl text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-2xl`}
                aria-label="Sidenav"
            >
                <div className="overflow-y-auto py-5 px-3 h-full flex flex-col justify-between no-scrollbar [scrollbar-none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div>
                        <div className="flex flex-col px-2 mb-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="font-extrabold text-xl tracking-wider bg-linear-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                                    R2A LABS
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="sm:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            {user && (
                                <div className="mt-1.5 flex items-center justify-between">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px] font-medium">
                                        {user.name || user.email}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        user.role === "store_admin" 
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                                            : "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-300 dark:border-purple-800"
                                    }`}>
                                        {user.role === "store_admin" ? "Store Admin" : "Super Admin"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <ul className="space-y-1.5 font-medium">
                            <li>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                        isActive("/admin")
                                            ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                    }`}
                                >
                                    <LayoutDashboard className={`w-5 h-5 transition duration-150 ${isActive("/admin") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                    <span className="ml-3">Dashboard</span>
                                </Link>
                            </li>

                            {isSuperAdmin && (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/brands"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/brands")
                                                    ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                            }`}
                                        >
                                            <Tag className={`w-5 h-5 transition duration-150 ${isActive("/admin/brands") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                            <span className="ml-3">Brands</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/products"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/products")
                                                    ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                            }`}
                                        >
                                            <Package className={`w-5 h-5 transition duration-150 ${isActive("/admin/products") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                            <span className="ml-3">Daftar Produk</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/stores"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/stores")
                                                    ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                            }`}
                                        >
                                            <Store className={`w-5 h-5 transition duration-150 ${isActive("/admin/stores") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                            <span className="ml-3">Daftar Toko</span>
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li>
                                <Link
                                    to="/admin/productstores"
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                        isActive("/admin/productstores")
                                            ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                    }`}
                                >
                                    <Boxes className={`w-5 h-5 transition duration-150 ${isActive("/admin/productstores") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                    <span className="ml-3">Stok & Harga</span>
                                </Link>
                            </li>

                         
                            {isSuperAdmin && (
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setIsSpkOpen(!isSpkOpen)}
                                        className={`flex items-center justify-between p-2.5 w-full text-sm font-medium rounded-xl transition-all duration-200 group ${
                                            isSpkActive || isSpkOpen
                                                ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <Sliders className={`w-5 h-5 transition duration-150 ${isSpkActive || isSpkOpen ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                            <span className="ml-3 text-left whitespace-nowrap">Konfigurasi SPK</span>
                                        </div>
                                        {isSpkOpen ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
                                        )}
                                    </button>

                                    {isSpkOpen && (
                                        <ul className="py-2 space-y-1 pl-3 border-l-2 border-gray-200 dark:border-gray-800 ml-5 mt-1">
                                            <li>
                                                <Link
                                                    to="/admin/criterias"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/criterias")
                                                            ? "text-gray-950 dark:text-white font-semibold bg-gray-100 dark:bg-gray-800/60"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-950 dark:hover:text-white"
                                                    }`}
                                                >
                                                    <ListFilter className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                    Kriteria
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/admin/subcriterias"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/subcriterias")
                                                            ? "text-gray-950 dark:text-white font-semibold bg-gray-100 dark:bg-gray-800/60"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-950 dark:hover:text-white"
                                                    }`}
                                                >
                                                    <ListTree className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                    Sub-Kriteria
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/admin/productweights"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/productweights")
                                                            ? "text-gray-950 dark:text-white font-semibold bg-gray-100 dark:bg-gray-800/60"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-950 dark:hover:text-white"
                                                    }`}
                                                >
                                                    <Scale className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                    Pembobotan Produk
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/admin/recommendations"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/recommendations")
                                                            ? "text-gray-950 dark:text-white font-semibold bg-gray-100 dark:bg-gray-800/60"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-950 dark:hover:text-white"
                                                    }`}
                                                >
                                                    <History className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                    Riwayat Rekomendasi
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            {isSuperAdmin && (
                                <>
                                    <li className="pt-3">
                                        <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-1">
                                            Pengguna & Akses
                                        </div>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/users"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/users")
                                                    ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                            }`}
                                        >
                                            <Users className={`w-5 h-5 transition duration-150 ${isActive("/admin/users") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                            <span className="ml-3">Daftar Pengguna</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/user-stores"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/user-stores")
                                                    ? "bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white font-semibold shadow-xs border-l-4 border-gray-900 dark:border-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-950 dark:hover:text-white"
                                            }`}
                                        >
                                            <ShieldCheck className={`w-5 h-5 transition duration-150 ${isActive("/admin/user-stores") ? "text-gray-950 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white"}`} />
                                            <span className="ml-3">Hak Akses Toko</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                   
                    <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            label="Logout"
                            type="button"
                            variant="danger"
                            icon={<LogOut size={18} />}
                            onClick={() => handleLogout()}
                            className="w-full justify-center shadow-md hover:shadow-red-600/20"
                        />
                    </div>
                </div>
            </aside>
        </>
    );
}
