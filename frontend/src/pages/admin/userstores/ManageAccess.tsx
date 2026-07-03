import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  Plus,
  Save,
  Shield,
  Info,
} from "lucide-react";
import { TabelManageAccess } from "./components/TabelManageAccess";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { GlowingCards, GlowingCard } from "../../../components/ui/glowing-cards";

// 1. Definisi Interface Hak Akses Toko (user_stores)
export interface UserStoreAccess {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  store_id: number;
  store_name: string;
  store_city: string;
  is_active: boolean; // TRUE = Granted (bisa edit stok & harga), FALSE = Revoked (akses dicabut)
  assigned_at: string;
}

// 2. Daftar Dummy Pegawai Khusus Role "store_admin" (Eksklusif)
const availableStoreAdmins = [
  { id: 2, name: "Budi Santoso", email: "budi.store@r2a-labs.com", current_role: "store_admin" },
  { id: 3, name: "Siti Rahmawati", email: "siti.store@r2a-labs.com", current_role: "store_admin" },
  { id: 7, name: "Hendra Kurniawan", email: "hendra.store@r2a-labs.com", current_role: "store_admin" },
  { id: 8, name: "Linda Permata", email: "linda.store@r2a-labs.com", current_role: "store_admin" },
];

// 3. Daftar Dummy Cabang Toko Fisik (stores)
const availableStores = [
  { id: 101, name: "Toko Jakarta Pusat (R2A Flagship)", city: "Jakarta Pusat" },
  { id: 102, name: "Toko Surabaya Barat (IT Center)", city: "Surabaya" },
  { id: 103, name: "Toko Bandung Dago (Tech Space)", city: "Bandung" },
  { id: 104, name: "Toko Medan Denai (Computer Mall)", city: "Medan" },
];

// 4. Data Dummy Penugasan Awal (user_stores)
const initialAccessList: UserStoreAccess[] = [
  {
    id: 1,
    user_id: 2,
    user_name: "Budi Santoso",
    user_email: "budi.store@r2a-labs.com",
    store_id: 101,
    store_name: "Toko Jakarta Pusat (R2A Flagship)",
    store_city: "Jakarta Pusat",
    is_active: true, // Aktif memegang Jakarta
    assigned_at: "2026-02-15 10:30:00",
  },
  {
    id: 2,
    user_id: 3,
    user_name: "Siti Rahmawati",
    user_email: "siti.store@r2a-labs.com",
    store_id: 102,
    store_name: "Toko Surabaya Barat (IT Center)",
    store_city: "Surabaya",
    is_active: true, // Aktif memegang Surabaya
    assigned_at: "2026-03-01 09:15:00",
  },
  {
    id: 3,
    user_id: 2,
    user_name: "Budi Santoso",
    user_email: "budi.store@r2a-labs.com",
    store_id: 103,
    store_name: "Toko Bandung Dago (Tech Space)",
    store_city: "Bandung",
    is_active: false, // Revoked! Sebelumnya sempat di Bandung lalu dicabut
    assigned_at: "2026-01-10 14:00:00",
  },
  {
    id: 4,
    user_id: 7,
    user_name: "Hendra Kurniawan",
    user_email: "hendra.store@r2a-labs.com",
    store_id: 104,
    store_name: "Toko Medan Denai (Computer Mall)",
    store_city: "Medan",
    is_active: true,
    assigned_at: "2026-05-20 11:00:00",
  },
];


export default function ManageAccess() {
  const [data, setData] = useState<UserStoreAccess[]>(initialAccessList);

  // State Filter
  const [filterStore, setFilterStore] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "revoked">("all");

  // State Modal Tambah Akses Toko
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(availableStoreAdmins[0].id);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(availableStores[0].id);

  // Aksi Cabut Akses (Revoke) / Pulihkan Akses (Grant)
  const handleToggleRevoke = (item: UserStoreAccess) => {
    const isRevoking = item.is_active;
    const confirmMsg = isRevoking
      ? ` Cabut Akses (Revoke) dari "${item.user_name}" untuk "${item.store_name}"?\n\nAlur Logika: Status akan berubah menjadi tidak aktif (is_active = FALSE). Pegawai ini otomatis TIDAK BISA LAGI mengedit stok dan harga di toko ini, meskipun akun loginnya masih aktif.`
      : ` Pulihkan kembali akses (Grant) "${item.user_name}" untuk mengelola cabang "${item.store_name}"?`;

    if (window.confirm(confirmMsg)) {
      setData((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, is_active: !isRevoking } : d))
      );
    }
  };

  // Simpan Penugasan Baru
  const handleCreateAccess = (e: React.FormEvent) => {
    e.preventDefault();

    const adminObj = availableStoreAdmins.find((a) => a.id === Number(selectedUserId));
    const storeObj = availableStores.find((s) => s.id === Number(selectedStoreId));

    if (!adminObj || !storeObj) {
      alert("Pilih Pegawai dan Cabang Toko dengan benar!");
      return;
    }

    // Cek apakah penugasan yang sama sudah ada
    const existing = data.find(
      (d) => d.user_id === adminObj.id && d.store_id === storeObj.id
    );

    if (existing) {
      if (existing.is_active) {
        alert(`⚠️ Pegawai "${adminObj.name}" SUDAH memiliki akses aktif ke toko ini!`);
        return;
      } else {
        // Jika sebelumnya dicabut, pulihkan saja
        if (
          window.confirm(
            `Pegawai "${adminObj.name}" sebelumnya pernah ditugaskan di toko ini namun aksesnya dicabut. Pulihkan kembali aksesnya sekarang?`
          )
        ) {
          setData((prev) =>
            prev.map((d) => (d.id === existing.id ? { ...d, is_active: true } : d))
          );
          setIsAddModalOpen(false);
        }
        return;
      }
    }

    const nextId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const newAccess: UserStoreAccess = {
      id: nextId,
      user_id: adminObj.id,
      user_name: adminObj.name,
      user_email: adminObj.email,
      store_id: storeObj.id,
      store_name: storeObj.name,
      store_city: storeObj.city,
      is_active: true, // Penugasan baru selalu aktif
      assigned_at: now,
    };

    setData((prev) => [newAccess, ...prev]);
    setIsAddModalOpen(false);
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchStore = filterStore === "all" || item.store_id.toString() === filterStore;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && item.is_active) ||
        (filterStatus === "revoked" && !item.is_active);
      return matchStore && matchStatus;
    });
  }, [data, filterStore, filterStatus]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    return {
      total: data.length,
      active: data.filter((d) => d.is_active).length,
      revoked: data.filter((d) => !d.is_active).length,
      uniqueAdmins: new Set(data.filter((d) => d.is_active).map((d) => d.user_id)).size,
    };
  }, [data]);



  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <span>Hak Akses & Penugasan Toko</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
              tabel: user_stores
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Jembatan penghubung antara identitas pegawai (<code className="font-mono text-xs">users</code>) dengan data fisik cabang (<code className="font-mono text-xs">stores</code>). Fokus murni pada delegasi role <code className="font-mono text-xs font-bold text-blue-600">store_admin</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            label="Tambah Akses Toko Baru"
            className="text-xs! py-2.5! px-4! rounded-xl font-bold shadow-md cursor-pointer"
          />
        </div>
      </div>

      {/* 3. KARTU STATISTIK RINGKAS (GLOWING CARDS) */}
      <GlowingCards gap="1rem" maxWidth="100%" padding="0">
        <GlowingCard glowColor="#6366f1" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase font-mono">Total Delegasi</span>
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{stats.total}</span>
        </GlowingCard>
        <GlowingCard glowColor="#10b981" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block uppercase font-mono">Akses Aktif (Granted)</span>
          <span className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1 block">{stats.active}</span>
        </GlowingCard>
        <GlowingCard glowColor="#ef4444" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-red-700 dark:text-red-300 block uppercase font-mono">Dicabut (Revoked)</span>
          <span className="text-2xl font-extrabold text-red-900 dark:text-red-100 mt-1 block">{stats.revoked}</span>
        </GlowingCard>
        <GlowingCard glowColor="#3b82f6" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block uppercase font-mono">Admin Toko Aktif</span>
          <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-1 block">{stats.uniqueAdmins} <span className="text-xs font-normal text-blue-600">Orang</span></span>
        </GlowingCard>
      </GlowingCards>

      {/* 4. BAR FILTER & PENCARIAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-[#181519] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-1 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Toko:</span>
          </span>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="px-3.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Cabang Toko</option>
            {availableStores.map((st) => (
              <option key={st.id} value={st.id.toString()}>
                {st.name} ({st.city})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase font-mono">Status Akses:</span>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            {(
              [
                { id: "all", label: "Semua" },
                { id: "active", label: "🟢 Aktif (Granted)" },
                { id: "revoked", label: "🔴 Dicabut (Revoked)" },
              ] as const
            ).map((stOpt) => (
              <button
                key={stOpt.id}
                type="button"
                onClick={() => setFilterStatus(stOpt.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === stOpt.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {stOpt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. TABEL DATA HAK AKSES TOKO (Modular) */}
      <TabelManageAccess
        data={filteredData}
        onToggleRevoke={handleToggleRevoke}
      />

      {/* MODAL: TAMBAH AKSES TOKO BARU */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="lg"
        badge={
          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            <span>Delegasi Penugasan Baru</span>
          </span>
        }
        title="Beri Akses Operasional Toko"
        subtitle="Hanya menampilkan pegawai dengan role 'store_admin'. Pasangkan dengan cabang toko yang sesuai."
      >
        <form onSubmit={handleCreateAccess} className="space-y-5">
          {/* 1. Pilih Pegawai Admin Toko (Hanya role store_admin) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center justify-between">
              <span>Pilih Pegawai Admin Toko (<code className="font-mono text-blue-600">user_id</code>)</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Filtered: role = store_admin
              </span>
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full px-4 py-3 text-sm font-bold bg-blue-50/40 dark:bg-[#181519] border border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer shadow-2xs text-blue-900"
            >
              {availableStoreAdmins.map((adm) => (
                <option key={adm.id} value={adm.id}>
                  {adm.name} — ({adm.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              *Ingin menugaskan pegawai baru? Daftarkan akunnya terlebih dahulu di menu{" "}
              <Link to="/admin/users" className="underline font-bold text-blue-600 dark:text-blue-400">
                Daftar Pengguna (users)
              </Link>.
            </p>
          </div>

          {/* 2. Pilih Cabang Toko Fisik */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Pilih Cabang Toko (<code className="font-mono text-purple-600">store_id</code>)
            </label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(Number(e.target.value))}
              className="w-full px-4 py-3 text-sm font-bold bg-purple-50/40 dark:bg-[#181519] border border-purple-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white cursor-pointer shadow-2xs text-purple-900"
            >
              {availableStores.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} — Kota: {st.city}
                </option>
              ))}
            </select>
          </div>

          {/* Catatan Info Pindahtugas */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Simulasi Rotasi / Transfer Pegawai:</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
              Ketika akses baru ditambahkan, statusnya otomatis <strong className="text-emerald-600 dark:text-emerald-400 font-mono">Granted (is_active = TRUE)</strong>. Pegawai tersebut dapat segera memperbarui harga & stok produk pada cabang toko ini di dashboard mereka.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              label="Batal"
              className="!text-xs! py-2! px-5! rounded-xl cursor-pointer"
            />
            <Button
              type="submit"
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              label="Simpan Akses Toko"
              className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}