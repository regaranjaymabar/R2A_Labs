import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Filter,
  Laptop,
} from "lucide-react";
import { TableProductStoreIndex } from "./components/TableProductStoreIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useDeleteProductStore } from "./hooks/useDeleteProductStore";
import type { ProductStore } from "../../../types/productStore";
import { useGet } from "../../../hooks/useGet";
import { productStoreService } from "../../../services/productStoreService";
import { useAuthStore } from "../../../store/useAuthStore";

const initialProductStores: ProductStore[] = [
  
];

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ProductStoreIndex() {
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === "super_admin" || user?.role === "superadmin";

  const { data: fetchedData } = useGet({
    queryKey: ["productstores"],
    queryFn: productStoreService.getAll,
    offlineFallbackData: initialProductStores,
  });
  const [localData, setLocalData] = useState<ProductStore[] | null>(null);
  const data: ProductStore[] = localData || (fetchedData && fetchedData.length > 0 ? fetchedData : initialProductStores);
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>("ALL");

  const [editingItem, setEditingItem] = useState<ProductStore | null>(null);
  const [editPrice, setEditPrice] = useState<number | string>(0);
  const [editStock, setEditStock] = useState<number | string>(0);
  const [editIsAvailable, setEditIsAvailable] = useState<boolean>(true);

  const getStoreId = (item: any) => Number(item?.storeId ?? item?.store_id ?? 1);
  const getStoreName = (item: any) => item?.store?.name || item?.store_name || item?.storeName || `Store #${getStoreId(item)}`;
  const getProductId = (item: any) => Number(item?.productId ?? item?.product_id ?? 1);
  const getProductName = (item: any) =>
    item?.product?.modelName ||
    item?.product?.name ||
    item?.model_name ||
    item?.product_name ||
    `Product ID #${getProductId(item)}`;

  const filteredData = useMemo(() => {
    if (!isSuperAdmin) {
      const userStoreId = Number((user as any)?.store_id ?? (user as any)?.storeId ?? 1);
      return data.filter((item) => getStoreId(item) === userStoreId);
    }
    if (selectedStoreFilter === "ALL") {
      return data;
    }
    return data.filter((item) => getStoreName(item) === selectedStoreFilter);
  }, [data, isSuperAdmin, user, selectedStoreFilter]);

  const uniqueStores = useMemo(() => {
    const names = data.map((item) => getStoreName(item));
    return Array.from(new Set(names));
  }, [data]);

  const outOfStockCount = useMemo(() => {
    return filteredData.filter((item) => Number(item.stock) === 0).length;
  }, [filteredData]);

  const lowStockCount = useMemo(() => {
    return filteredData.filter((item) => {
      const s = Number(item.stock);
      return s > 0 && s <= 5;
    }).length;
  }, [filteredData]);

  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  const handleOpenEdit = (item: ProductStore) => {
    setEditingItem(item);
    setEditPrice(item.price);
    setEditStock(item.stock);
    setEditIsAvailable(
      (item as any).isAvailable === 1 ||
      (item as any).isAvailable === true ||
      item.is_available === 1 ||
      item.is_available === true
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSavingEdit(true);
    try {
      await productStoreService.update(editingItem.id, {
        price: Number(editPrice || 0),
        stock: Number(editStock || 0),
        is_available: editIsAvailable,
        isAvailable: editIsAvailable ? 1 : 0,
      });

      setLocalData(
        data.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                price: Number(editPrice || 0),
                stock: Number(editStock || 0),
                is_available: editIsAvailable ? 1 : 0,
                isAvailable: editIsAvailable ? 1 : 0,
                updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
              }
            : item
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      alert("Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const { handleDelete, confirmDelete, cancelDelete, deleteTarget, isDeleting, deletingId } = useDeleteProductStore();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Stok & Harga 
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/productstores/add"
            className="inline-flex items-center gap-2 bg-[#151216] text-white hover:bg-[#262128] font-semibold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Stok Cabang</span>
          </Link>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">
            Filter Cabang Toko:
          </span>
          <select
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="ALL">Semua Cabang Toko ({data.length} barang)</option>
            {uniqueStores.map((storeName) => (
              <option key={storeName} value={storeName}>
                {storeName}
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

      {!isSuperAdmin && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between text-xs text-blue-800">
          <div className="flex items-center gap-2.5 font-medium">
            <span>
              Mode <strong>Store Admin</strong> aktif: Membatasi tampilan inventaris hanya untuk cabang{" "}
              <strong className="underline font-mono">store_id: {(user as any)?.store_id || 1}</strong>.
            </span>
          </div>
          <span className="font-mono bg-blue-100 px-2 py-0.5 rounded font-bold">
            {filteredData.length} Barang
          </span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Produk Toko */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Produk di Toko Anda
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-3xl font-extrabold text-gray-900">
                {filteredData.length}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Stok Hampir Habis */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Stok Hampir Habis
            </span>
            <span className="text-3xl font-extrabold text-black">
              {lowStockCount}
            </span>
          </div>
        </div>

        {/* Card 3: Stok Habis */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Stok Habis
            </span>
            <span className="text-3xl font-extrabold text-black">
              {outOfStockCount}
            </span>
          </div>

        </div>
      </div>

      <TableProductStoreIndex
        data={filteredData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        showStoreColumn={isSuperAdmin}
      />

      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        maxWidth="lg"
        title={editingItem ? getProductName(editingItem) : ""}
        subtitle={
          editingItem ? `${getStoreName(editingItem)} (store_id: ${getStoreId(editingItem)})` : undefined
        }
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-20 h-20 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {(editingItem as any).product?.imageUrl ? (
                    <img
                      src={(editingItem as any).product.imageUrl}
                      alt={getProductName(editingItem)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Laptop className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 font-medium block">Processor</span>
                    <span className="font-bold text-gray-800">{(editingItem as any).product?.processor || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">RAM / Storage</span>
                    <span className="font-bold text-gray-800">{(editingItem as any).product?.ram || "-"} / {(editingItem as any).product?.storage || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Layar / Baterai</span>
                    <span className="font-bold text-gray-800">
                      {((editingItem as any).product?.screenSize || (editingItem as any).product?.screen_size) ? `${(editingItem as any).product.screenSize || (editingItem as any).product.screen_size}"` : "-"} / {(editingItem as any).product?.battery || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Berat / Rilis</span>
                    <span className="font-bold text-gray-800">
                      {(editingItem as any).product?.weight ? (String((editingItem as any).product.weight).toLowerCase().endsWith("kg") ? (editingItem as any).product.weight : `${(editingItem as any).product.weight}kg`) : "-"} / {((editingItem as any).product?.releaseYear || (editingItem as any).product?.release_year) ? String((editingItem as any).product.releaseYear || (editingItem as any).product.release_year).slice(0, 4) : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 items-center gap-1.5">
                <span>Penyesuaian Harga Jual (IDR)</span>
              </label>
              <p className="text-[11px] text-gray-500">
                Perbarui kolom <code className="font-mono bg-gray-100 px-1 rounded">price</code> jika ada promo lokal atau perubahan harga distributor.
              </p>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 text-sm font-mono font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  required
                />
              </div>
              <div className="text-right text-xs font-semibold text-emerald-600">
                {formatIDR(Number(editPrice || 0))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 items-center gap-1.5">
                <span>Mutasi Stok Unit</span>
              </label>
              <p className="text-[11px] text-gray-500">
                Perbarui kolom <code className="font-mono bg-gray-100 px-1 rounded">stock</code> saat ada barang masuk (restok) atau terjual offline.
              </p>
              <input
                type="number"
                min="0"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                required
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <span>Ubah Ketersediaan</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => setEditIsAvailable(!editIsAvailable)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  editIsAvailable ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    editIsAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingItem(null)}
                label="Batal"
                className="!text-xs! py-2! px-5! rounded-xl cursor-pointer"
              />
              <Button
                type="submit"
                label="Simpan Perubahan"
                isLoading={isSavingEdit}
                disabled={isSavingEdit}
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
              />
            </div>
          </form>
        )}
      </Modal>

      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Stok Produk dari Toko?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus data stok & harga untuk{" "}
            <strong className="text-gray-900 font-semibold">
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
