import { Search, CircleUserRound, LogOut, LayoutDashboard, ChevronDown, User as UserIcon, Award, History } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  visible?: boolean; // ← Prop kontrol visibilitas
};

export default function Header({
  search,
  setSearch,
  visible = true, // Default: muncul
}: HeaderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar dari akun");
    navigate("/");
  };

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 px-6 lg:px-12 pt-6
        transition-all duration-500 ease-in-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="
            flex items-center justify-between
            px-6 py-4
            rounded-full
            bg-white/10
            backdrop-blur-xl
            border border-white/20
            shadow-lg
          "
        >
          {/* Logo */}
          <div className="text-3xl font-bold tracking-tight">
            <img
              src="https://cdn-icons-png.flaticon.com/512/0/747.png"
              alt="Ambalabs Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link
              to="/"
              className="transition-transform duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/rekomendasi"
              className="transition-transform duration-300 hover:scale-105"
            >
              Rekomendasi
            </Link>
            {isAuthenticated && (user?.role === "customer" || user?.role === "user") && (
              <Link
                to="/spk/request"
                className="transition-all duration-350 hover:scale-105 font-extrabold text-purple-700 bg-purple-100/80 border border-purple-200/50 px-3.5 py-1.5 rounded-full shadow-xs"
              >
                Rekomendasi SPK
              </Link>
            )}
            <Link
              to="/"
              className="transition-transform duration-300 hover:scale-105"
            >
              Tentang
            </Link>
          </nav>

          {/* Search + Login */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div
              className="
                hidden md:flex
                items-center gap-2
                px-4 py-2
                rounded-full
                bg-white/10
                backdrop-blur-md
              "
            >
              <Search size={18} />
              <input
                type="text"
                placeholder="Cari laptop..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  bg-transparent
                  outline-none
                  placeholder:text-zinc-500
                  w-40
                "
              />
            </div>

            {/* Login / Profile Menu */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button
                  className="
                    flex items-center gap-2
                    p-1.5 pr-3
                    rounded-full
                    bg-black text-white
                    hover:scale-105 transition
                    shadow-md cursor-pointer
                    text-xs font-bold
                  "
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-[11px] font-extrabold uppercase border border-white/20">
                    {user.name ? user.name.slice(0, 2) : "US"}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name || "User"}</span>
                  <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div
                  className="
                    absolute right-0 mt-2 w-48
                    bg-white text-zinc-800
                    rounded-2xl border border-zinc-100 shadow-xl
                    py-2 px-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                    transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100
                    z-50
                  "
                >
                  <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                    <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 uppercase">
                      {user.role}
                    </span>
                  </div>

                  {(user.role === "superadmin" || user.role === "super_admin" || user.role === "admin" || user.role === "store_admin") && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>Portal Admin</span>
                    </Link>
                  )}

                  {(user.role === "customer" || user.role === "user") && (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                      >
                        <UserIcon size={14} />
                        <span>Profil Saya</span>
                      </Link>
                      <Link
                        to="/spk/history"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                      >
                        <History size={14} />
                        <span>Riwayat Request</span>
                      </Link>
                      <Link
                        to="/spk/request"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-purple-700 rounded-xl hover:bg-purple-50 transition-colors"
                      >
                        <Award size={14} />
                        <span>Rekomendasi SPK</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={14} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  flex items-center justify-center
                  w-11 h-11
                  rounded-full
                  bg-black text-white
                  hover:scale-105 transition
                  shadow-md
                "
              >
                <CircleUserRound size={22} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}