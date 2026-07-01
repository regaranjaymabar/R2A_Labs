import { Link } from "react-router-dom";
import { Button } from "../ui/common/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function AdminSidebar() {

    const logout = useAuthStore((state) => state.logout)
    const [isSpkOpen, SetIsSpkOpen] = useState(false)

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="w-64 bg-[#151216] text-white min-h-screen p-4 flex flex-col justify-between">
            <div>
                <div className="font-bold text-xl mb-6 text-center border-b border-gray-700 pb-4">
                    R2A LABS
                </div>
                <ul className="flex flex-col gap-2">
                    <li>
                        <Link to="/admin" className="block p-2 hover:bg-gray-800 rounded">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/brands" className="block p-2 hover:bg-gray-800 rounded">
                            Brands
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/products" className="block p-2 hover:bg-gray-800 rounded">
                            Daftar Produk
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/stores" className="block p-2 hover:bg-gray-800 rounded">
                            Daftar Toko
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/productstores" className="block p-2 hover:bg-gray-800 rounded">
                            Stok & Harga
                        </Link>
                    </li>
                    
                    <li>
                       <button
                        type="button"
                        onClick={() => SetIsSpkOpen(!isSpkOpen)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-800 rounded transition-colors text-left">
                            <span className="flex items-center gap-2 font-medium">
                                Konfigurasi SPK
                            </span>

                            {isSpkOpen ? (
                                <ChevronDown size={18} className="text-gray-600"/>
                            ): (
                                <ChevronRight size={18} className="text-gray-600"/>
                            )}
                       </button>

                       {isSpkOpen && (
                        <ul className="mt-1 ml-6 flex flex-col gap-1">
                            <li>
                                 <Link to="/admin/criterias" className="block p-2 hover:bg-gray-800 rounded">
                                    Kriteria
                                 </Link>
                            </li>
                            <li>
                                 <Link to="/admin/subcriterias" className="block p-2 hover:bg-gray-800 rounded">
                                    Sub-Kriteria
                                 </Link>
                            </li>
                            <li>
                                 <Link to="/admin/productweights" className="block p-2 hover:bg-gray-800 rounded">
                                    Pembobotan Produk
                                 </Link>
                            </li>
                            <li>
                                 <Link to="/admin/recommendations" className="block p-2 hover:bg-gray-800 rounded">
                                    Riwayat Rekomendasi
                                 </Link>
                            </li>
                        </ul>
                       )}
                    </li>
                    <li>
                        <Link to="/admin/users" className="block p-2 hover:bg-gray-800 rounded">
                            Daftar Pengguna
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/user-stores" className="block p-2 hover:bg-gray-800 rounded transition-colors">
                            Hak Akses Toko
                        </Link>
                    </li>
                    {/* Tambahkan menu lain di sini */}
                </ul>
            </div>
            <div>
                <Button
                    label="Logout"
                    type="button"
                    variant="danger"
                    onClick={() => handleLogout()}
                    className= "w-full"
                />
            </div>
        </aside>
    );
}
