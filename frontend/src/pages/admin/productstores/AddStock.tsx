import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Ban,
  Store as StoreIcon,
  Package,
  Layers,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSelect } from "../../../components/ui/common/InputSelect";
import { useAddProductStore } from "./hooks/useAddProductStore";
import { useGet } from "../../../hooks/useGet";
import { storeService } from "../../../services/storeService";
import { productService } from "../../../services/productService";
import { initialStores } from "../../admin/stores/StoreIndex";
import { initialProducts } from "../../admin/products/ProductIndex";

export default function AddStock() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    isAvailable,
  } = useAddProductStore();

  // Simulasi Toggle Peran Pengguna (Super Admin vs Store Admin) untuk pengujian Logika Bisnis
  const [simulatedRole, setSimulatedRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN">("SUPER_ADMIN");

  // Fetch daftar Toko dari backend (Tabel stores) dengan offlineFallbackData
  const { data: fetchedStores, isLoading: isStoresLoading } = useGet({
    queryKey: ["stores"],
    queryFn: storeService.getAll,
    offlineFallbackData: initialStores,
  });
  const stores = fetchedStores || initialStores;

  // Fetch daftar Produk dari backend (Tabel products) dengan offlineFallbackData
  const { data: fetchedProducts, isLoading: isProductsLoading } = useGet({
    queryKey: ["products"],
    queryFn: productService.getAll,
    offlineFallbackData: initialProducts,
  });
  const products = fetchedProducts || initialProducts;

  // Pantau input harga untuk menampilkan format Rupiah live preview
  const watchPrice = watch("price");
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(watchPrice || 0));

  // Logika Bisnis: Jika masuk sebagai Store Admin, otomatis kunci store_id ke toko sendiri (misal ID 1)
  useEffect(() => {
    if (simulatedRole === "STORE_ADMIN") {
      const defaultStoreId = stores.length > 0 ? stores[0].id : 1;
      setValue("store_id", defaultStoreId, { shouldValidate: true });
    }
  }, [simulatedRole, stores, setValue]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER HALAMAN & ROLE SIMULATOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span>Tambah Stok & Harga Cabang</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Jodohkan data master produk laptop dengan toko fisik untuk menentukan harga lokal dan stok awal.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Toggle Simulator Role */}
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center text-xs">
            <button
              type="button"
              onClick={() => setSimulatedRole("SUPER_ADMIN")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${simulatedRole === "SUPER_ADMIN"
                  ? "bg-white dark:bg-[#181519] text-gray-900 dark:text-white shadow-xs border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => setSimulatedRole("STORE_ADMIN")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${simulatedRole === "STORE_ADMIN"
                  ? "bg-white dark:bg-[#181519] text-black dark:text-purple-400 shadow-xs border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
            >
              <Lock className="w-3 h-3" />
              <span>Store Admin</span>
            </button>
          </div>

          <Link
            to="/admin/productstores"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>
      </div>

      {/* BANNER INFORMASI LOGIKA BISNIS STORE ADMIN */}
      {simulatedRole === "STORE_ADMIN" && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3.5 animate-fadeIn">
          <div className="p-2 rounded-xl bg-purple-500 text-white shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-200">
              Mode Akses Store Admin Aktif
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 leading-relaxed">
              Sesuai aturan logika bisnis, Store Admin hanya berhak mengelola inventaris untuk tokonya sendiri. Dropdown pemilihan cabang di bawah ini <strong>otomatis dikunci (Read-Only)</strong> pada toko yang ditugaskan kepada Anda.
            </p>
          </div>
        </div>
      )}

      {/* 2. KARTU FORM UTAMA */}
      <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="h-2 bg-black"></div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* SECTION 1: PENJODOHAN TOKO & PRODUK */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black dark:text-white">
              <StoreIcon className="w-4 h-4 text-purple-500" />
              <span>Penjodohan Cabang Toko & Master Produk</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Pilih Toko (Dropdown dari tabel stores) */}
              <div className={simulatedRole === "STORE_ADMIN" ? "pointer-events-none opacity-80" : ""}>
                <InputSelect
                  label={
                    <span className="flex items-center justify-between">
                      <span>Pilih Toko Cabang *</span>
                      {simulatedRole === "STORE_ADMIN" && (
                        <span className="text-[10px] font-mono font-bold text-black dark:text-purple-400 flex items-center gap-1 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> Terkunci
                        </span>
                      )}
                    </span>
                  }
                  nama="store_id"
                  options={stores.map((s) => ({
                    value: s.id,
                    label: `${s.name} (#${s.id})`,
                  }))}
                  placeholder={
                    isStoresLoading ? "Memuat Toko..." : "-- Pilih Cabang Toko --"
                  }
                  disabled={isStoresLoading}
                  register={register}
                  error={errors.store_id?.message}
                  helperText="* Cabang toko fisik penempatan laptop."
                />
              </div>

              {/* 2. Pilih Produk Laptop (Dropdown dari tabel products) */}
              <div>
                <InputSelect
                  label="Pilih Produk Laptop (Master Data) *"
                  nama="product_id"
                  options={products.map((p) => ({
                    value: p.id,
                    label: `#${p.id} - ${p.brand_name ? `[${p.brand_name}] ` : ""}${p.model_name}`,
                  }))}
                  placeholder={
                    isProductsLoading
                      ? "Memuat Produk..."
                      : "-- Pilih Master Laptop --"
                  }
                  disabled={isProductsLoading}
                  register={register}
                  error={errors.product_id?.message}
                  helperText="* Model laptop dari katalog master."
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: HARGA JUAL & STOK AWAL */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-black dark:text-white">
              <Package className="w-4 h-4 text-purple-500" />
              <span>Penetapan Harga Lokal & Stok Fisik</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3. Harga Jual Cabang */}
              <div>
                <InputText
                  label="Harga Jual di Cabang Ini (Rp)"
                  nama="price"
                  type="number"
                  placeholder="Contoh: 12999000"
                  register={register}
                  error={errors.price?.message}
                  helperText={
                    <span className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>* Harga bisa berbeda tiap cabang.</span>
                      {Number(watchPrice) > 0 && (
                        <span className="font-bold font-mono text-black dark:text-purple-400">
                          {formattedPrice}
                        </span>
                      )}
                    </span>
                  }
                />
              </div>

              {/* 4. Stok Awal */}
              <div>
                <InputText
                  label="Stok Awal (Unit / Kardus)"
                  nama="stock"
                  type="number"
                  placeholder="Contoh: 10, 15, 50"
                  register={register}
                  error={errors.stock?.message}
                  helperText="* Jumlah fisik barang yang tersedia langsung."
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: STATUS KETERSEDIAAN CABANG */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <label className="block text-sm font-bold text-gray-900 dark:text-white items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Status Ketersediaan di Cabang Ini</span>
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                Default: Aktif (true)
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opsi 1: Aktif (Tersedia) */}
              <button
                type="button"
                onClick={() =>
                  setValue("is_available", true, { shouldValidate: true })
                }
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${isAvailable
                    ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${isAvailable
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "border-2 border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {isAvailable && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <span
                    className={`block font-bold text-sm ${isAvailable
                        ? "text-emerald-900 dark:text-emerald-200"
                        : "text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    Aktif & Tersedia (Live)
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                    Laptop muncul di katalog publik dan siap dipesan atau dibeli oleh kustomer di toko ini.
                  </span>
                </div>
              </button>

              {/* Opsi 2: Nonaktif (Discontinued / Habis) */}
              <button
                type="button"
                onClick={() =>
                  setValue("is_available", false, { shouldValidate: true })
                }
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${!isAvailable
                    ? "bg-red-50/80 dark:bg-red-950/40 border-red-500 shadow-md ring-2 ring-red-500/20"
                    : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${!isAvailable
                      ? "bg-red-500 text-white shadow-xs"
                      : "border-2 border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {!isAvailable && <Ban className="w-4 h-4" />}
                </div>
                <div>
                  <span
                    className={`block font-bold text-sm ${!isAvailable
                        ? "text-red-900 dark:text-red-200"
                        : "text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    Nonaktif (Discontinued / Habis)
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                    Sembunyikan sementara dari katalog toko tanpa menghapus histori penjualan cabang.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* TOMBOL AKSI FORM */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/productstores")}
              label="Batal"
              className="px-5! py-2.5! rounded-xl! text-xs! font-bold! cursor-pointer!"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              icon={<Save className="w-4 h-4" />}
              label={
                isSubmitting ? "Menyimpan..." : "Simpan Penempatan Stok"
              }
              className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
