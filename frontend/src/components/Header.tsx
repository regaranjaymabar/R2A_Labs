import { Search } from "lucide-react";
// import ambalabsLogo from '../assets/ambalabs.png';
import { Link } from "react-router-dom";

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header({
  search,
  setSearch,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 lg:px-12 pt-6">
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
         <div className="text-3xl font-bold tracking-tight">
          <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Ambalabs Logo" className="h-8 w-auto" />
        </div>

          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium ">
            <Link to="/" className="transition-transform duration-300 hover:scale-105">Home</Link>
            <Link to="/rekomendasi" className="transition-transform duration-300 hover:scale-105">Rekomendasi</Link>
            <Link to="/" className="transition-transform duration-300 hover:scale-105">Tentang</Link>
          </nav>

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
        </div>
      </div>
    </header>
  );
}