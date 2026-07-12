import { Link, useLocation, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    // Hanya superadmin yang bisa lihat master data & konfigurasi global
    const isSuperAdmin = user?.role === "superadmin" || user?.role === "super_admin";
    const location = useLocation();
    const [isSpkOpen, setIsSpkOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/admin/login", { replace: true });
    };

    const isActive = (path: string) => {
        if (path === "/admin/dashboard" || path === "/admin") {
            return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
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
                    className="inline-flex items-center justify-center text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
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
                } bg-white/95 backdrop-blur-xl text-gray-900 border-r border-gray-200 flex flex-col justify-between shadow-2xl`}
                aria-label="Sidenav"
            >
                <div className="overflow-y-auto py-5 px-3 h-full flex flex-col justify-between no-scrollbar [scrollbar-none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div>
                        <div className="flex flex-col px-2 mb-3 pb-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="font-extrabold text-xl tracking-wider bg-linear-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
                                    R2A LABS
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="sm:hidden text-gray-500 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <ul className="space-y-1.5 font-medium">
                            <li>
                                <Link
                                    to="/admin/dashboard"
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                        isActive("/admin/dashboard")
                                            ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                    }`}
                                >
                                    <LayoutDashboard className={`w-5 h-5 transition duration-150 ${isActive("/admin/dashboard") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
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
                                                    ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                            }`}
                                        >
                                            <Tag className={`w-5 h-5 transition duration-150 ${isActive("/admin/brands") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                            <span className="ml-3">Brands</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/products"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/products")
                                                    ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                            }`}
                                        >
                                            <Package className={`w-5 h-5 transition duration-150 ${isActive("/admin/products") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                            <span className="ml-3">Daftar Produk</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/stores"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/stores")
                                                    ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                            }`}
                                        >
                                            <Store className={`w-5 h-5 transition duration-150 ${isActive("/admin/stores") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
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
                                            ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                    }`}
                                >
                                    <Boxes className={`w-5 h-5 transition duration-150 ${isActive("/admin/productstores") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                    <span className="ml-3">Stok & Harga</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/admin/my-store-profile"
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                        isActive("/admin/my-store-profile")
                                            ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                    }`}
                                >
                                    <Store className={`w-5 h-5 transition duration-150 ${isActive("/admin/my-store-profile") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                    <span className="ml-3">Profil Tokoku</span>
                                </Link>
                            </li>

                            {isSuperAdmin && (
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setIsSpkOpen(!isSpkOpen)}
                                        className={`flex items-center justify-between p-2.5 w-full text-sm font-medium rounded-xl transition-all duration-200 group ${
                                            isSpkActive || isSpkOpen
                                                ? "bg-gray-100 text-gray-950 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <Sliders className={`w-5 h-5 transition duration-150 ${isSpkActive || isSpkOpen ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                            <span className="ml-3 text-left whitespace-nowrap">Konfigurasi SPK</span>
                                        </div>
                                        {isSpkOpen ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                                        )}
                                    </button>

                                    {isSpkOpen && (
                                        <ul className="py-2 space-y-1 pl-3 border-l-2 border-gray-200 ml-5 mt-1">
                                            <li>
                                                <Link
                                                    to="/admin/criterias"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/criterias")
                                                            ? "text-gray-950 font-semibold bg-gray-100"
                                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                                    }`}
                                                >
                                                    <ListFilter className="w-4 h-4 mr-2 text-gray-500" />
                                                    Kriteria
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/admin/subcriterias"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/subcriterias")
                                                            ? "text-gray-950 font-semibold bg-gray-100"
                                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                                    }`}
                                                >
                                                    <ListTree className="w-4 h-4 mr-2 text-gray-500" />
                                                    Sub-Kriteria
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/admin/productweights"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/productweights")
                                                            ? "text-gray-950 font-semibold bg-gray-100"
                                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                                    }`}
                                                >
                                                    <Scale className="w-4 h-4 mr-2 text-gray-500" />
                                                    Pembobotan Produk
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/admin/recommendations"
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center p-2 pl-2 text-sm rounded-lg transition duration-150 ${
                                                        isActive("/admin/recommendations")
                                                            ? "text-gray-950 font-semibold bg-gray-100"
                                                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                                    }`}
                                                >
                                                    <History className="w-4 h-4 mr-2 text-gray-500" />
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
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                                            Pengguna & Akses
                                        </div>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/users"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/users")
                                                    ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                            }`}
                                        >
                                            <Users className={`w-5 h-5 transition duration-150 ${isActive("/admin/users") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                            <span className="ml-3">Daftar Pengguna</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/admin/user-stores"
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                                isActive("/admin/user-stores")
                                                    ? "bg-gray-100 text-gray-950 font-semibold shadow-xs border-l-4 border-gray-900"
                                                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950"
                                            }`}
                                        >
                                            <ShieldCheck className={`w-5 h-5 transition duration-150 ${isActive("/admin/user-stores") ? "text-gray-950" : "text-gray-500 group-hover:text-gray-950"}`} />
                                            <span className="ml-3">Hak Akses Toko</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="pt-4 mt-6 border-t border-gray-200">
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
