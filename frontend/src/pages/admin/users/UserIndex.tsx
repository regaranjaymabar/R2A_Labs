import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Store,
  User as UserIcon,
  Filter,
  Save,
  Info,
  Edit,
} from "lucide-react";
import { TabelUserIndex } from "./components/TabelUserIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { GlowingCards, GlowingCard } from "../../../components/ui/glowing-cards";

// 1. Definisi Interface Pengguna (User) sesuai skema tabel users di database MySQL
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "store_admin" | "user";
  is_active: boolean; // Soft Delete: FALSE = nonaktif (tidak bisa login, tapi data riwayat SPK tetap aman)
  created_at: string;
}

// 2. Data Dummy Awal (Merepresentasikan Kondisi Nyata di Sistem SPK Laptop)
const initialUsers: UserData[] = [
  {
    id: 1,
    name: "Adies (Super Admin)",
    email: "superadmin@r2a-labs.com",
    role: "admin",
    is_active: true,
    created_at: "2026-01-10 08:00:00",
  },
  {
    id: 2,
    name: "Budi Santoso (Manajer Toko Jakarta)",
    email: "budi.store@r2a-labs.com",
    role: "store_admin",
    is_active: true,
    created_at: "2026-02-15 10:30:00",
  },
  {
    id: 3,
    name: "Siti Rahmawati (Manajer Toko Surabaya)",
    email: "siti.store@r2a-labs.com",
    role: "store_admin",
    is_active: true,
    created_at: "2026-03-01 09:15:00",
  },
  {
    id: 4,
    name: "Andi Pratama",
    email: "andi.pratama@gmail.com",
    role: "user",
    is_active: true,
    created_at: "2026-07-01 14:20:00",
  },
  {
    id: 5,
    name: "Doni Saputra",
    email: "doni.s@yahoo.com",
    role: "user",
    is_active: false,
    created_at: "2026-05-12 11:45:00",
  },
  {
    id: 6,
    name: "Rina Wati (Resigned Employee)",
    email: "rina.old@r2a-labs.com",
    role: "store_admin",
    is_active: false,
    created_at: "2026-01-20 16:00:00",
  },
];


export default function UserIndex() {
  const [data, setData] = useState<UserData[]>(initialUsers);
  
  // State Filter
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "store_admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // State Modal Tambah Pengguna
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "store_admin" | "user">("store_admin");
  const [newIsActive, setNewIsActive] = useState(true);

  // State Modal Edit Pengguna
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "store_admin" | "user">("user");
  const [editIsActive, setEditIsActive] = useState(true);

  // Buka Modal Edit
  const handleOpenEdit = (user: UserData) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword(""); // Password dikosongkan secara default saat edit
    setEditRole(user.role);
    setEditIsActive(user.is_active);
  };

  // Simpan Tambah Pengguna Baru
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      alert("Harap lengkapi Nama, Email, dan Password!");
      return;
    }

    const nextId = data.length > 0 ? Math.max(...data.map((u) => u.id)) + 1 : 1;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const newUser: UserData = {
      id: nextId,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      is_active: newIsActive,
      created_at: now,
    };

    setData((prev) => [newUser, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("store_admin");
    setNewIsActive(true);
  };

  // Simpan Perubahan Edit Pengguna
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim() || !editEmail.trim()) {
      alert("Nama dan Email tidak boleh kosong!");
      return;
    }

    setData((prev) =>
      prev.map((item) =>
        item.id === editingUser.id
          ? {
              ...item,
              name: editName.trim(),
              email: editEmail.trim().toLowerCase(),
              role: editRole,
              is_active: editIsActive,
            }
          : item
      )
    );
    setEditingUser(null);
  };

  // Aksi Soft Delete / Restore Akses (Toggle is_active)
  const handleToggleSoftDelete = (user: UserData) => {
    if (user.role === "admin" && user.id === 1) {
      alert("⚠️ Akun Super Admin Utama (#1) tidak boleh dinonaktifkan!");
      return;
    }

    const confirmMsg = user.is_active
      ? `⚠️ Nonaktifkan akun "${user.name}"?\n\nAlur Soft Delete: Akun ini tidak akan bisa login lagi ke dalam sistem, namun ID mereka tetap terikat aman dengan tabel riwayat recommendation_requests (SPK).`
      : `✅ Aktifkan kembali akun "${user.name}" agar bisa login kembali?`;

    if (window.confirm(confirmMsg)) {
      setData((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, is_active: !user.is_active } : item
        )
      );
    }
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchRole = filterRole === "all" || item.role === filterRole;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && item.is_active) ||
        (filterStatus === "inactive" && !item.is_active);
      return matchRole && matchStatus;
    });
  }, [data, filterRole, filterStatus]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    return {
      total: data.length,
      admins: data.filter((u) => u.role === "admin").length,
      storeAdmins: data.filter((u) => u.role === "store_admin").length,
      users: data.filter((u) => u.role === "user").length,
      inactive: data.filter((u) => !u.is_active).length,
    };
  }, [data]);


  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER & KARTU INFORMASI SUPER ADMIN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              <span>Daftar Pengguna & Hak Akses</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono">
              tabel: users
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pusat kendali keamanan sistem eksklusif Super Admin. Atur pembagian peran (<code className="font-mono text-xs">role</code>) dan manajemen status akses (<code className="font-mono text-xs">is_active</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<UserPlus className="w-4 h-4" />}
            label="Tambah Pengguna / Pegawai"
            className="text-xs! py-2.5! px-4! rounded-xl font-bold shadow-md cursor-pointer"
          />
        </div>
     </div>
      {/* 3. KARTU STATISTIK RINGKAS (GLOWING CARDS) */}
      <GlowingCards gap="1rem" maxWidth="100%" padding="0">
        <GlowingCard glowColor="#6366f1" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase font-mono">Total Akun</span>
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 block">{stats.total}</span>
        </GlowingCard>
        <GlowingCard glowColor="#a855f7" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block uppercase font-mono">Super Admin</span>
          <span className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mt-1 block">{stats.admins}</span>
        </GlowingCard>
        <GlowingCard glowColor="#3b82f6" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block uppercase font-mono">Admin Toko</span>
          <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-1 block">{stats.storeAdmins}</span>
        </GlowingCard>
        <GlowingCard glowColor="#10b981" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase font-mono">User Biasa</span>
          <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1 block">{stats.users}</span>
        </GlowingCard>
        <GlowingCard glowColor="#ef4444" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-red-700 dark:text-red-300 block uppercase font-mono">Nonaktif (Soft Del)</span>
          <span className="text-2xl font-extrabold text-red-900 dark:text-red-100 mt-1 block">{stats.inactive}</span>
        </GlowingCard>
      </GlowingCards>

      {/* 4. BAR FILTER & PENCARIAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-[#181519] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-1 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Role:</span>
          </span>
          {(["all", "admin", "store_admin", "user"] as const).map((role) => {
            const labels = {
              all: "Semua Role",
              admin: "Super Admin",
              store_admin: "Admin Toko",
              user: "User Biasa",
            };
            const isActive = filterRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                {labels[role]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase font-mono">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Status</option>
            <option value="active">🟢 Aktif (Live)</option>
            <option value="inactive">🔴 Nonaktif (Soft Deleted)</option>
          </select>
        </div>
      </div>

      {/* 5. TABEL DATA PENGGUNA */}
      {/* 5. TABEL DATA PENGGUNA (Modular) */}
      <TabelUserIndex
        data={filteredData}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleSoftDelete}
      />

      {/* MODAL 1: TAMBAH PENGGUNA BARU */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="lg"
        badge={
          <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1.5 font-mono">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registrasi Akun Baru</span>
          </span>
        }
        title="Buat Akun Pegawai / Pengguna"
        subtitle="Sesuai tabel users di database. Tentukan hak akses role secara presisi."
      >
        <form onSubmit={handleCreateUser} className="space-y-5">
          {/* 1. Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Nama Lengkap (<code className="font-mono">name</code>)
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Misal: Budi Santoso"
              className="w-full px-4 py-2.5 text-sm font-semibold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all shadow-2xs"
              required
            />
          </div>

          {/* 2. Alamat Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Alamat Email (<code className="font-mono">email</code>)
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Misal: budi.store@r2a-labs.com"
              className="w-full px-4 py-2.5 text-sm font-mono bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all shadow-2xs"
              required
            />
          </div>

          {/* 3. Password Sementara */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center justify-between">
              <span>Password Awal (<code className="font-mono">password</code>)</span>
              <span className="text-[10px] text-gray-400 font-normal">Minimal 6 karakter</span>
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Misal: Store#2026"
              className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-purple-50/50 dark:bg-[#181519] border border-purple-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all shadow-2xs text-purple-700"
              required
            />
          </div>

          {/* 4. Pemilihan Peran (Role Management) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Pembagian Peran (<code className="font-mono text-purple-600">role</code>)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { id: "store_admin", label: "Admin Toko", desc: "Mengelola stok & harga cabang", icon: Store, color: "blue" },
                  { id: "admin", label: "Super Admin", desc: "Kontrol penuh sistem SPK", icon: ShieldCheck, color: "purple" },
                  { id: "user", label: "User Biasa", desc: "Konsumen pencari laptop", icon: UserIcon, color: "gray" },
                ] as const
              ).map((roleOpt) => {
                const IconComponent = roleOpt.icon;
                const isSelected = newRole === roleOpt.id;
                return (
                  <button
                    key={roleOpt.id}
                    type="button"
                    onClick={() => setNewRole(roleOpt.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? roleOpt.color === "purple"
                          ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20"
                          : roleOpt.color === "blue"
                          ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-900 dark:text-white ring-2 ring-gray-400/20"
                        : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{roleOpt.label}</span>
                    </div>
                    <span className="text-[10px] opacity-75 mt-1.5 block leading-tight">
                      {roleOpt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Status Akun (is_active) */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>Status Akun (<code className="font-mono text-[11px]">is_active</code>)</span>
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Aktifkan saklar agar pegawai/user bisa login ke sistem.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewIsActive(!newIsActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                newIsActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  newIsActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Catatan Hak Akses Toko */}
          {newRole === "store_admin" && (
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Langkah Selanjutnya (Hak Akses Toko):</strong> Setelah akun ini disimpan, buka menu <Link to="/admin/user-stores" className="underline font-bold">Hak Akses Toko (user_stores)</Link> untuk menunjuk toko mana yang akan diatur oleh Admin Toko baru ini.
              </div>
            </div>
          )}

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
              label="Daftarkan Pengguna"
              className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT PENGGUNA & PERAN */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        maxWidth="lg"
        badge={
          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-mono">
            <Edit className="w-3.5 h-3.5" />
            <span>Update Identitas & Role</span>
          </span>
        }
        title={editingUser ? `Edit: ${editingUser.name}` : ""}
        subtitle={editingUser ? `ID: #${editingUser.id} | Terdaftar: ${editingUser.created_at}` : undefined}
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="space-y-5">
            {/* 1. Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Nama Lengkap (<code className="font-mono">name</code>)
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-semibold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs"
                required
              />
            </div>

            {/* 2. Alamat Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Alamat Email (<code className="font-mono">email</code>)
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-mono bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs"
                required
              />
            </div>

            {/* 3. Password Baru (Opsional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center justify-between">
                <span>Reset Password (<code className="font-mono">password</code>)</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Kosongkan jika tidak ingin mengubah password</span>
              </label>
              <input
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Ketikan password baru (opsional)..."
                className="w-full px-4 py-2.5 text-sm font-mono bg-amber-50/40 dark:bg-[#181519] border border-amber-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all shadow-2xs text-amber-800 placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {/* 4. Pemilihan Peran (Role Management) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Pembagian Peran (<code className="font-mono text-purple-600">role</code>)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    { id: "store_admin", label: "Admin Toko", desc: "Mengelola stok & harga cabang", icon: Store, color: "blue" },
                    { id: "admin", label: "Super Admin", desc: "Kontrol penuh sistem SPK", icon: ShieldCheck, color: "purple" },
                    { id: "user", label: "User Biasa", desc: "Konsumen pencari laptop", icon: UserIcon, color: "gray" },
                  ] as const
                ).map((roleOpt) => {
                  const IconComponent = roleOpt.icon;
                  const isSelected = editRole === roleOpt.id;
                  const isSuperAdminMain = editingUser.id === 1;
                  return (
                    <button
                      key={roleOpt.id}
                      type="button"
                      disabled={isSuperAdminMain && roleOpt.id !== "admin"}
                      onClick={() => setEditRole(roleOpt.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? roleOpt.color === "purple"
                            ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20"
                            : roleOpt.color === "blue"
                            ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20"
                            : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-900 dark:text-white ring-2 ring-gray-400/20"
                          : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      } ${isSuperAdminMain && roleOpt.id !== "admin" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span>{roleOpt.label}</span>
                      </div>
                      <span className="text-[10px] opacity-75 mt-1.5 block leading-tight">
                        {roleOpt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Status Akun (is_active - Soft Delete) */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>Status Akun (<code className="font-mono text-[11px]">is_active</code>)</span>
                </label>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Matikan saklar ini untuk melakukan Soft Delete (nonaktifkan login tanpa menghapus riwayat).
                </p>
              </div>
              <button
                type="button"
                disabled={editingUser.id === 1}
                onClick={() => setEditIsActive(!editIsActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  editIsActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                } ${editingUser.id === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    editIsActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Catatan Hak Akses Toko */}
            {editRole === "store_admin" && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                <Store className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Kelola Hak Akses Toko:</strong> Untuk mengubah atau melihat Toko mana yang dikelola oleh <em>{editingUser.name}</em>, silakan tuju menu <Link to="/admin/user-stores" className="underline font-bold">Hak Akses Toko (user_stores)</Link>.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingUser(null)}
                label="Batal"
                className="!text-xs! py-2! px-5! rounded-xl cursor-pointer"
              />
              <Button
                type="submit"
                variant="info"
                icon={<Save className="w-4 h-4" />}
                label="Simpan Perubahan Role"
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
