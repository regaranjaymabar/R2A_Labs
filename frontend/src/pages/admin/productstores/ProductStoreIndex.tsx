import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ShieldCheck,
  Filter,
  Save,
} from "lucide-react";
import { TableProductStoreIndex } from "./components/TableProductStoreIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useDeleteProductStore } from "./hooks/useDeleteProductStore";


// 1. Definisi Interface product_stores (Sesuai 7 kolom asli di database MySQL)
export interface ProductStore {
  id: number;
  product_id: number;
  store_id: number;
  price: number;
  stock: number;
  is_available: boolean | number; // tinyint(1): 1 = aktif, 0 = non-aktif / discontinued
  updated_at?: string;

  // Properti Opsional (Biasanya ditambahkan oleh backend via SQL JOIN dengan tabel products & stores 
  // agar admin dashboard tidak hanya menampilkan angka ID, tapi juga nama produk & toko)
  product_name?: string;
  brand_name?: string;
  store_name?: string;
}

// 2. Data Dummy Awal (Disesuaikan dengan angka persis di screenshot database kamu)
const initialProductStores: ProductStore[] = [
  {
    id: 1,
    product_id: 1,
    store_id: 1,
    price: 6999000,
    stock: 15,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "ASUS Vivobook 14 A1404ZA",
    brand_name: "ASUS",
    store_name: "Toko Asus Official Jakarta",
  },
  {
    id: 2,
    product_id: 2,
    store_id: 1,
    price: 12999000,
    stock: 8,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "ROG Zephyrus G14 GA402",
    brand_name: "ASUS",
    store_name: "Toko Asus Official Jakarta",
  },
  {
    id: 3,
    product_id: 3,
    store_id: 1,
    price: 7499000,
    stock: 0,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "Lenovo IdeaPad Slim 3",
    brand_name: "Lenovo",
    store_name: "Toko Asus Official Jakarta",
  },
  {
    id: 4,
    product_id: 4,
    store_id: 1,
    price: 11999000,
    stock: 6,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "HP Victus Gaming 15",
    brand_name: "HP",
    store_name: "Toko Asus Official Jakarta",
  },
  {
    id: 5,
    product_id: 5,
    store_id: 1,
    price: 8999000,
    stock: 0,
    is_available: 0,
    updated_at: "2026-06-30 07:03:58",
    product_name: "Acer Aspire 5 A514-55G",
    brand_name: "Acer",
    store_name: "Toko Asus Official Jakarta",
  },
  {
    id: 6,
    product_id: 6,
    store_id: 1,
    price: 13999000,
    stock: 5,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "MSI Cyborg 15 A12VE",
    brand_name: "MSI",
    store_name: "Toko Asus Official Jakarta",
  },
  {
    id: 7,
    product_id: 1,
    store_id: 2,
    price: 6899000,
    stock: 10,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "ASUS Vivobook 14 A1404ZA",
    brand_name: "ASUS",
    store_name: "Lenovo Exclusive Store",
  },
  {
    id: 8,
    product_id: 3,
    store_id: 2,
    price: 7399000,
    stock: 9,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "Lenovo IdeaPad Slim 3",
    brand_name: "Lenovo",
    store_name: "Lenovo Exclusive Store",
  },
  {
    id: 9,
    product_id: 5,
    store_id: 2,
    price: 8899000,
    stock: 8,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "Acer Aspire 5 A514-55G",
    brand_name: "Acer",
    store_name: "Lenovo Exclusive Store",
  },
  {
    id: 10,
    product_id: 7,
    store_id: 2,
    price: 6799000,
    stock: 11,
    is_available: 1,
    updated_at: "2026-06-30 07:03:58",
    product_name: "Zyrex Sky 232 Prime",
    brand_name: "Zyrex",
    store_name: "Lenovo Exclusive Store",
  },
];

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};



export default function ProductStoreIndex() {
  const [data, setData] = useState<ProductStore[]>(initialProductStores);
  
  // State Simulasi Role & Filter (Read)
  const [currentUserRole, setCurrentUserRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN">("SUPER_ADMIN");
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>("ALL");

  // State Modal Edit Operasional (3 Alur Aksi: Harga, Stok, Ketersediaan)
  const [editingItem, setEditingItem] = useState<ProductStore | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editIsAvailable, setEditIsAvailable] = useState<boolean>(true);

  // 1. Filter Data Berdasarkan Role & Toko
  const filteredData = useMemo(() => {
    if (currentUserRole === "STORE_ADMIN") {
      // Store Admin hanya melihat tokonya sendiri (Simulasi: store_id = 1)
      return data.filter((item) => item.store_id === 1);
    }
    // Super Admin: Bisa melihat semua atau filter per cabang
    if (selectedStoreFilter === "ALL") {
      return data;
    }
    return data.filter((item) => (item.store_name || `Store #${item.store_id}`) === selectedStoreFilter);
  }, [data, currentUserRole, selectedStoreFilter]);

  // Daftar nama toko unik untuk dropdown filter
  const uniqueStores = useMemo(() => {
    const names = data.map((item) => item.store_name || `Store #${item.store_id}`);
    return Array.from(new Set(names));
  }, [data]);

  // Buka Modal Edit
  const handleOpenEdit = (item: ProductStore) => {
    setEditingItem(item);
    setEditPrice(item.price);
    setEditStock(item.stock);
    setEditIsAvailable(item.is_available === 1 || item.is_available === true);
  };

  // Simpan Perubahan Operasional (Update ke state / backend)
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              price: Number(editPrice),
              stock: Number(editStock),
              is_available: editIsAvailable ? 1 : 0,
              updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
            }
          : item
      )
    );
    setEditingItem(null);
  };

  // Gunakan hook hapus yang sudah otomatis mengelola ModalConfirm
  const { handleDelete, confirmDelete, cancelDelete, deleteTarget, isDeleting, deletingId } = useDeleteProductStore();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman & Kontrol Role */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Stok & Harga 
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Panel Simulasi Role Akses (Read) */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
            <span className="px-2.5 py-1 text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Simulasi Role:
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentUserRole("SUPER_ADMIN");
                setSelectedStoreFilter("ALL");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                currentUserRole === "SUPER_ADMIN"
                  ? "bg-white dark:bg-[#181519] text-gray-900 dark:text-white shadow-2xs border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentUserRole("STORE_ADMIN");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                currentUserRole === "STORE_ADMIN"
                  ? "bg-white dark:bg-[#181519] text-gray-900 dark:text-white shadow-2xs border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Store Admin (store_id: 1)
            </button>
          </div>

          <Link
            to="/admin/productstores/add"
            className="inline-flex items-center gap-2 bg-[#151216] dark:bg-white text-white dark:text-gray-900 hover:bg-[#262128] dark:hover:bg-gray-200 font-semibold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Stok Cabang</span>
          </Link>
        </div>
      </div>

      {/* Filter Cabang (Khusus Super Admin) */}
      {currentUserRole === "SUPER_ADMIN" && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Filter Cabang Toko:
          </span>
          <select
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
            className="bg-white dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="ALL">🌐 Semua Cabang Toko ({data.length} barang)</option>
            {uniqueStores.map((storeName) => (
              <option key={storeName} value={storeName}>
                🏪 {storeName}
              </option>
            ))}
          </select>
          {selectedStoreFilter !== "ALL" && (
            <button
              type="button"
              onClick={() => setSelectedStoreFilter("ALL")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* Indikator Status Banner jika Store Admin */}
      {currentUserRole === "STORE_ADMIN" && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 p-4 rounded-2xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
          <div className="flex items-center gap-2.5 font-medium">
            <span>
              Mode <strong>Store Admin</strong> aktif: Membatasi tampilan hanya untuk cabang{" "}
              <strong className="underline font-mono">store_id: 1</strong> (Toko Asus Official Jakarta).
            </span>
          </div>
          <span className="font-mono bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded font-bold">
            {filteredData.length} Barang
          </span>
        </div>
      )}

      {/* Tabel Reusable (Modular) */}
      <TableProductStoreIndex
        data={filteredData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* MODAL UPDATE OPERASIONAL (3 ALUR AKSI UTAMA) */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        maxWidth="lg"
        badge={
          <span className="text-blue-600 dark:text-blue-400">
            Eksekusi Perubahan (Update)
          </span>
        }
        title={editingItem?.product_name || (editingItem ? `Product ID #${editingItem.product_id}` : "")}
        subtitle={
          editingItem ? `${editingItem.store_name || `Store #${editingItem.store_id}`} (store_id: ${editingItem.store_id})` : undefined
        }
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            {/* 1. Penyesuaian Harga */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center gap-1.5">
                <span>1. Penyesuaian Harga Jual (IDR)</span>
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Perbarui kolom <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">price</code> jika ada promo lokal atau perubahan harga distributor.
              </p>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 text-sm font-mono font-bold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs"
                  required
                />
              </div>
              <div className="text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {formatIDR(editPrice)}
              </div>
            </div>

            {/* 2. Mutasi Stok */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center gap-1.5">
                <span>2. Mutasi Stok Fisik (Unit)</span>
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Perbarui kolom <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">stock</code> saat ada barang masuk (restok) atau terjual offline.
              </p>
              <input
                type="number"
                min="0"
                value={editStock}
                onChange={(e) => setEditStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs"
                required
              />
            </div>

            {/* 3. Ubah Ketersediaan (Saklar / Switch) */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>3. Ubah Ketersediaan (<code className="font-mono text-[11px]">is_available</code>)</span>
                </label>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Matikan saklar jika laptop discontinued atau ditarik dari cabang.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditIsAvailable(!editIsAvailable)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  editIsAvailable ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    editIsAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingItem(null)}
                label="Batal"
                className="!text-xs! py-2! px-5! rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
              />
              <Button
                type="submit"
                icon={<Save className="w-4 h-4" />}
                label="Simpan Perubahan"
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Confirm Reusable Pengganti window.confirm */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Stok Produk dari Toko?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus data stok & harga untuk{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              {deleteTarget?.name}
            </strong>{" "}
            (ID: #{deleteTarget?.id})? Data yang dihapus tidak dapat dikembalikan.
          </span>
        }
        confirmLabel="Ya, Hapus Stok"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
