import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  ShieldCheck,
  Store,
  Filter,
  UserIcon,
} from "lucide-react";
import { TabelUserIndex } from "./components/TabelUserIndex";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { GlowingCards, GlowingCard } from "../../../components/ui/glowing-cards";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/userService";
import type { UserData } from "../../../types/user";
export type { UserData };

const initialUsers: UserData[] = [

];

export default function UserIndex() {
  const queryClient = useQueryClient();
  const { data: usersData } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        return await userService.getAll();
      } catch {
        return initialUsers;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const data = usersData || initialUsers;

  const [filterRole, setFilterRole] = useState<"all" | "superadmin" | "admin" | "store_admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<"superadmin" | "admin" | "user">("user");
  const [editIsActive, setEditIsActive] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEdit = (user: UserData) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword("");
    setEditRole((user.role as any) || "user");
    setEditIsActive(Boolean(user.isActive ?? user.is_active ?? true));
  };
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim() || !editEmail.trim()) {
      alert("Nama dan Email tidak boleh kosong!");
      return;
    }

    try {
      setIsSavingEdit(true);
      const payload: any = {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        role: editRole,
        storeId: editingUser.storeId || editingUser.store?.id || 1,
        is_active: editIsActive,
      };
      if (editPassword && editPassword.trim() !== "") {
        payload.password = editPassword.trim();
      }

      await userService.update(editingUser.id, payload);

      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    } catch (err: any) {
      alert(`Gagal memperbarui pengguna: ${err?.response?.data?.message || err?.message || "Error"}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteUser = (user: UserData) => {
    if (user.id === 1) {
      alert("⚠️ Akun Super Admin Utama (#1) tidak boleh dihapus!");
      return;
    }
    setDeleteTarget(user);
  };
  
  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await userService.delete(deleteTarget.id);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteTarget(null);
    } catch (err: any) {
      alert(`Gagal menghapus pengguna: ${err?.response?.data?.message || err?.message || "Error"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchRole =
        filterRole === "all" ||
        (filterRole === "superadmin" && item.role === "superadmin") ||
        (filterRole === "admin" && (item.role === "admin" || item.role === "store_admin")) ||
        (filterRole === "user" && (item.role === "user" || !item.role));

      const active = Boolean(item.isActive ?? item.is_active ?? true);
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && active) ||
        (filterStatus === "inactive" && !active);
      return matchRole && matchStatus;
    });
  }, [data, filterRole, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: data.length,
      admins: data.filter((u) => u.role === "superadmin").length,
      storeAdmins: data.filter((u) => u.role === "admin" || u.role === "store_admin").length,
      users: data.filter((u) => u.role === "user" || !u.role).length,
      inactive: data.filter((u) => {
        const active = u.isActive ?? u.is_active;
        return active === false || active === 0;
      }).length,
    };
  }, [data]);


  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Daftar Pengguna & Hak Akses</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151216] text-white hover:bg-[#262128] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna / Pegawai</span>
          </Link>
        </div>
      </div>
      <GlowingCards gap="1rem" maxWidth="100%" padding="0">
        <GlowingCard glowColor="#6366f1" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-gray-500 block uppercase font-mono">Total Akun</span>
          <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{stats.total}</span>
        </GlowingCard>
        <GlowingCard glowColor="#a855f7" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-purple-700 block uppercase font-mono">Super Admin</span>
          <span className="text-2xl font-extrabold text-purple-900 mt-1 block">{stats.admins}</span>
        </GlowingCard>
        <GlowingCard glowColor="#3b82f6" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-blue-700 block uppercase font-mono">Admin Toko</span>
          <span className="text-2xl font-extrabold text-blue-900 mt-1 block">{stats.storeAdmins}</span>
        </GlowingCard>
        <GlowingCard glowColor="#10b981" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-gray-700 block uppercase font-mono">UserData Biasa</span>
          <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{stats.users}</span>
        </GlowingCard>
        <GlowingCard glowColor="#ef4444" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-red-700 block uppercase font-mono">Nonaktif (Soft Del)</span>
          <span className="text-2xl font-extrabold text-red-900 mt-1 block">{stats.inactive}</span>
        </GlowingCard>
      </GlowingCards>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-1 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Role:</span>
          </span>
          {(["all", "superadmin", "admin"] as const).map((role) => {
            const labels = {
              all: "Semua Role",
              superadmin: "Super Admin",
              admin: "Admin Toko",
            };
            const isActive = filterRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
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
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>
      <TabelUserIndex
        data={filteredData}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteUser}
        deletingId={isDeleting ? deleteTarget?.id : null}
      />



      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        maxWidth="lg"
        title={editingUser ? `Edit: ${editingUser.name}` : ""}
        subtitle={editingUser ? `ID: #${editingUser.id} | Terdaftar: ${editingUser.created_at}` : undefined}
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="space-y-5">
            <InputText
              label="Nama Lengkap"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <InputText
              label="Alamat Email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />

            <InputText
              label="Reset Password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              placeholder="Ketikan password baru (opsional)..."
            />

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Pembagian Peran
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    { id: "admin", label: "Admin Toko", desc: "Mengelola stok & harga cabang", icon: Store, color: "blue" },
                    { id: "superadmin", label: "Super Admin", desc: "Kontrol penuh sistem SPK", icon: ShieldCheck, color: "purple" },
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
                      disabled={isSuperAdminMain && roleOpt.id !== "superadmin"}
                      onClick={() => setEditRole(roleOpt.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${isSelected
                        ? roleOpt.color === "purple"
                          ? "bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20"
                          : roleOpt.color === "blue"
                            ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                            : "bg-gray-100 border-gray-400 text-gray-900 ring-2 ring-gray-400/20"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                        } ${isSuperAdminMain && roleOpt.id !== "superadmin" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
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

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <span>Status Akun</span>
                </label>
              </div>
              <button
                type="button"
                disabled={editingUser.id === 1}
                onClick={() => setEditIsActive(!editIsActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editIsActive ? "bg-emerald-500" : "bg-gray-300"
                  } ${editingUser.id === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${editIsActive ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingUser(null)}
                label="Batal"
                className="!text-xs! py-2! px-5! rounded-xl cursor-pointer"
              />
              <Button
                type="submit"
                disabled={isSavingEdit}
                label={isSavingEdit ? "Menyimpan..." : "Simpan Perubahan Role"}
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
              />

            </div>
          </form>
        )}
      </Modal>

      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteUser}
        title="Hapus Permanen Akun Pengguna?"
        message={
          <span>
            Apakah Anda yakin ingin menghapus permanen akun <strong className="font-bold text-gray-900">{deleteTarget?.name}</strong> ({deleteTarget?.email}) dari database? Seluruh data akun ini akan dihapus permanen dan tidak dapat dikembalikan.
          </span>
        }
        confirmLabel={isDeleting ? "Menghapus..." : "Ya, Hapus Permanen"}
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}
