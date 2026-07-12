import { Filter, Plus } from "lucide-react";
import { TabelManageAccess } from "./components/TabelManageAccess";
import { ModalAddAccess } from "./components/ModalAddAccess";
import { Button } from "../../../components/ui/common/Button";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { GlowingCards, GlowingCard } from "../../../components/ui/glowing-cards";
import { useManageAccess } from "./hooks/useManageAccess";

export default function ManageAccess() {
  const {
    filteredData,
    stats,
    availableStoreAdmins,
    availableStores,
    filterStore,
    setFilterStore,
    filterStatus,
    setFilterStatus,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUserId,
    setSelectedUserId,
    selectedStoreId,
    setSelectedStoreId,
    isSubmitting,
    revokeTarget,
    setRevokeTarget,
    handleToggleRevoke,
    confirmToggleRevoke,
    handleCreateAccess,
  } = useManageAccess();

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Hak Akses Toko</span>
            </h1>
          </div>
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

      {/* 2. KARTU STATISTIK RINGKAS (GLOWING CARDS) */}
      <GlowingCards gap="1rem" maxWidth="100%" padding="0">
        <GlowingCard glowColor="#6366f1" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-gray-500 block uppercase font-mono">Total Delegasi</span>
          <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{stats.total}</span>
        </GlowingCard>
        <GlowingCard glowColor="#10b981" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-emerald-700 block uppercase font-mono">Akses Aktif</span>
          <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{stats.active}</span>
        </GlowingCard>
        <GlowingCard glowColor="#ef4444" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-red-700 block uppercase font-mono">Dicabut</span>
          <span className="text-2xl font-extrabold text-red-900 mt-1 block">{stats.revoked}</span>
        </GlowingCard>
        <GlowingCard glowColor="#3b82f6" className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <span className="text-xs font-bold text-blue-700 block uppercase font-mono">Admin Toko Aktif</span>
          <span className="text-2xl font-extrabold text-blue-900 mt-1 block">{stats.uniqueAdmins} <span className="text-xs font-normal text-blue-600">Orang</span></span>
        </GlowingCard>
      </GlowingCards>

      {/* 3. FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mr-1 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Toko:</span>
          </span>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
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
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
            {(
              [
                { id: "all", label: "Semua" },
                { id: "active", label: "Aktif" },
                { id: "revoked", label: "Tidak Aktif" },
              ] as const
            ).map((stOpt) => (
              <button
                key={stOpt.id}
                type="button"
                onClick={() => setFilterStatus(stOpt.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === stOpt.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {stOpt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TABEL DATA */}
      <TabelManageAccess
        data={filteredData}
        onToggleRevoke={handleToggleRevoke}
      />

      {/* 5. MODAL TAMBAH AKSES */}
      <ModalAddAccess
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAccess}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        selectedStoreId={selectedStoreId}
        setSelectedStoreId={setSelectedStoreId}
        availableStoreAdmins={availableStoreAdmins}
        availableStores={availableStores}
        isSubmitting={isSubmitting}
      />

      {/* 6. MODAL KONFIRMASI CABUT/PULIHKAN AKSES */}
      <ModalConfirm
        isOpen={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        onConfirm={confirmToggleRevoke}
        isLoading={isSubmitting}
        title={revokeTarget?.is_active ? "Cabut Hak Akses Toko?" : "Pulihkan Hak Akses Toko?"}
        message={
          revokeTarget?.is_active ? (
            <span>
              Apakah kamu yakin ingin mencabut akses <strong className="font-bold text-gray-900">{revokeTarget.user_name}</strong> untuk mengelola toko <strong className="font-bold text-gray-900">{revokeTarget.store_name}</strong>? Pegawai ini tidak akan bisa lagi mengedit stok dan harga di toko ini.
            </span>
          ) : (
            <span>
              Apakah kamu yakin ingin memulihkan kembali akses <strong className="font-bold text-gray-900">{revokeTarget?.user_name}</strong> untuk mengelola toko <strong className="font-bold text-gray-900">{revokeTarget?.store_name}</strong>?
            </span>
          )
        }
        confirmLabel={revokeTarget?.is_active ? "Ya, Cabut Akses" : "Ya, Pulihkan Akses"}
        cancelLabel="Batal"
        variant={revokeTarget?.is_active ? "danger" : "info"}
      />
    </div>
  );
}