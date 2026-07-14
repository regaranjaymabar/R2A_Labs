import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSearchSelect } from "../../../components/ui/common/InputSearchSelect";
import { useAddProductStore } from "./hooks/useAddProductStore";
import { useGet } from "../../../hooks/useGet";
import { storeService } from "../../../services/storeService";
import { productService } from "../../../services/productService";
import { initialStores } from "../../admin/stores/StoreIndex";
import { initialProducts } from "../../admin/products/ProductIndex";
import { useAuthStore } from "../../../store/useAuthStore";

export default function AddStock() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === "super_admin" || user?.role === "superadmin";
  const isStoreAdmin = !isSuperAdmin;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    isAvailable,
  } = useAddProductStore();

  const { data: fetchedStores, isLoading: isStoresLoading } = useGet({
    queryKey: ["stores"],
    queryFn: storeService.getAll,
    offlineFallbackData: initialStores,
  });
  const stores = fetchedStores && fetchedStores.length > 0 ? fetchedStores : initialStores;

  const { data: fetchedProducts, isLoading: isProductsLoading } = useGet({
    queryKey: ["products"],
    queryFn: productService.getAll,
    offlineFallbackData: initialProducts,
  });
  const products = fetchedProducts && fetchedProducts.length > 0 ? fetchedProducts : initialProducts;

  const watchPrice = watch("price");
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(watchPrice || 0));

  // Jika masuk sebagai Store Admin, maka kunci store_id
  useEffect(() => {
    if (isStoreAdmin) {
      const userStoreId = (user as any)?.store_id || (stores.length > 0 ? stores[0].id : 1);
      setValue("store_id", userStoreId, { shouldValidate: true });
    }
  }, [isStoreAdmin, user, stores, setValue]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Tambah Stok & Harga Cabang</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-gray-200">
            {isSuperAdmin ? (
              <span className="text-blue-600">Super Admin (Full Akses)</span>
            ) : (
              <span className="text-blue-600 flex items-center gap-1">
                Store Admin
              </span>
            )}
          </div>

          <Link
            to="/admin/productstores"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="h-2 bg-black"></div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={isStoreAdmin ? "pointer-events-none opacity-80" : ""}>
                <InputSearchSelect
                  label={
                    <span className="flex items-center justify-between">
                      <span>Pilih Toko Cabang</span>
                      {isStoreAdmin && (
                        <span className="text-[10px] font-mono font-bold text-black flex items-center gap-1 bg-purple-100 px-2 py-0.5 rounded-full">
                          {user?.name}
                        </span>
                      )}
                    </span>
                  }
                  name="store_id"
                  control={control}
                  options={stores.map((s) => ({
                    value: s.id,
                    label: `${s.name} (#${s.id})`,
                  }))}
                  placeholder={
                    isStoresLoading && stores.length === 0
                      ? "Memuat Toko..."
                      : "Cari & Pilih Cabang Toko"
                  }
                  isLoading={isStoresLoading && stores.length === 0}
                  disabled={isStoresLoading && stores.length === 0}
                  error={errors.store_id?.message}
                  helperText="* Ketik nama atau ID toko untuk mencari cepat."
                />
              </div>

              <div>
                <InputSearchSelect
                  label="Pilih Produk Laptop"
                  name="product_id"
                  control={control}
                  options={products.map((p: any) => ({
                    value: p.id,
                    label: `#${p.id} - ${
                      p.brand?.name || p.brand_name || p.brand
                        ? `[${p.brand?.name || p.brand_name || p.brand}] `
                        : ""
                    }${p.modelName || p.model_name || p.name || "Model Laptop"}`,
                  }))}
                  placeholder={
                    isProductsLoading && products.length === 0
                      ? "Memuat Produk..."
                      : "Cari Model atau Brand Laptop"
                  }
                  isLoading={isProductsLoading && products.length === 0}
                  disabled={isProductsLoading && products.length === 0}
                  error={errors.product_id?.message}
                  helperText="* Ketik model/brand laptop dari katalog master."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Penetapan Harga Lokal & Stok Fisik</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputText
                  label="Harga Jual"
                  nama="price"
                  type="number"
                  register={register}
                  error={errors.price?.message}
                  helperText={
                    <span className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>* Harga bisa berbeda tiap cabang.</span>
                      {Number(watchPrice) > 0 && (
                        <span className="font-bold font-mono text-black">
                          {formattedPrice}
                        </span>
                      )}
                    </span>
                  }
                />
              </div>

              <div>
                <InputText
                  label="Stok Unit"
                  nama="stock"
                  type="number"
                  register={register}
                  error={errors.stock?.message}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-900 items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Status Ketersediaan di Cabang Ini</span>
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setValue("is_available", true, { shouldValidate: true })
                }
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${isAvailable
                    ? "bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-gray-50 border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${isAvailable
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "border-2 border-gray-300"
                    }`}
                >
                  {isAvailable && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <span
                    className={`block font-bold text-sm ${isAvailable
                        ? "text-emerald-900"
                        : "text-gray-700"
                      }`}
                  >
                    Tersedia
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setValue("is_available", false, { shouldValidate: true })
                }
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${!isAvailable
                    ? "bg-red-50/80 border-red-500 shadow-md ring-2 ring-red-500/20"
                    : "bg-gray-50 border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${!isAvailable
                      ? "bg-red-500 text-white shadow-xs"
                      : "border-2 border-gray-300"
                    }`}
                >
                  {!isAvailable && <Ban className="w-4 h-4" />}
                </div>
                <div>
                  <span
                    className={`block font-bold text-sm ${!isAvailable
                        ? "text-red-900"
                        : "text-gray-700"
                      }`}
                  >
                    Habis
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
