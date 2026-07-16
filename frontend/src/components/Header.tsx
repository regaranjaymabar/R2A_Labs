import { Search, CircleUserRound, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  visible?: boolean;
};

export default function Header({ search, setSearch, visible = true }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 px-6 lg:px-12 pt-6
        transition-all duration-500 ease-in-out
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
          
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Ambalabs Logo" className="h-8 w-auto" />
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium">
            <Link to="/" className="transition-transform duration-300 hover:scale-105">Home</Link>
            <Link to="/rekomendasi" className="transition-transform duration-300 hover:scale-105">Rekomendasi</Link>
            <Link to="/" className="transition-transform duration-300 hover:scale-105">Tentang</Link>
          </nav>

          {/* Search + User */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
              <Search size={18} className="text-zinc-500 shrink-0" />
              <input type="text" placeholder="Cari laptop..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none placeholder:text-zinc-500 w-40 text-sm" />
            </div>

            {/* User Section */}
            {isAuthenticated && user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-black/90 hover:bg-black transition shadow-lg"
                >
                  <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                    {getInitial(user.name)}
                  </div>
                  <ChevronDown size={16} className={`text-white transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <>
                    {/* Overlay backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-5 py-4 border-b border-gray-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {getInitial(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu */}
                      <div className="py-2 px-2">
                        <button
                          onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100/80 transition font-medium"
                        >
                          <User size={18} className="text-gray-500" />
                          Profil Saya
                        </button>
                        
                        <div className="my-1 border-t border-gray-100/50" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition font-medium"
                        >
                          <LogOut size={18} />
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:scale-105 transition shadow-md">
                <CircleUserRound size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}