import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Ban, Boxes, Package, Laptop } from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productStoreService } from "../../../services/productStoreService";

export default function EditStock() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: item, isLoading } = useQuery({
    queryKey: ["product-store", id],
    queryFn: async () => {
      if (!id) throw new Error("ID tidak valid");
      return await productStoreService.getById(id);
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (item) {
      setPrice(String(item.price || 0));
      setStock(String(item.stock || 0));
      setIsAvailable(Boolean((item as any).isAvailable ?? item.is_available ?? true));
    }
  }, [item]);

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID tidak valid");
      const prod: any = (item as any)?.product || {};
      const brandName = prod.brand?.name || (item as any)?.brand_name || "";
      const modelName = prod.modelName || prod.name || (item as any)?.model_name || (item as any)?.product_name || `Produk #${id}`;
      const fullLaptopName = [brandName, modelName].filter(Boolean).join(" ");
      const specs = [prod.processor || (item as any)?.processor, prod.ram || (item as any)?.ram, prod.storage || (item as any)?.storage].filter(Boolean).join(" • ");

      return await productStoreService.update(id, {
        price: Number(price),
        stock: Number(stock),
        is_available: isAvailable,
        productName: fullLaptopName,
        specs: specs,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-stores"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
      navigate("/admin/productstores");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Gagal memperbarui stok dan harga.";
      setErrorMsg(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        Memuat data inventaris toko...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/admin/productstores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Stok & Harga</span>
        </Link>
      </div>

      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <span>Edit Stok & Harga Laptop</span>
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {item && (
          <div className="p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-white">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Detail Spesifikasi Laptop</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {(item as any).product?.imageUrl ? (
                  <img
                    src={(item as any).product.imageUrl}
                    alt={(item as any).product.modelName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Laptop className="w-12 h-12 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Nama & Model</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.brand?.name || (item as any).brand_name || "-"} {(item as any).product?.modelName || (item as any).product_name || "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Processor</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.processor || "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">RAM</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.ram || "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Penyimpanan (Storage)</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.storage || "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Ukuran Layar</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.screenSize || (item as any).product?.screen_size ? `${(item as any).product.screenSize || (item as any).product.screen_size}"` : "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Kapasitas Baterai</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.battery || "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Berat</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.weight ? (String((item as any).product.weight).toLowerCase().endsWith("kg") ? (item as any).product.weight : `${(item as any).product.weight}kg`) : "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium block">Tahun Rilis</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {(item as any).product?.releaseYear || (item as any).product?.release_year ? String((item as any).product.releaseYear || (item as any).product.release_year).slice(0, 4) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Harga Jual Toko (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                  Rp
                </div>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20500000"
                />
              </div>
              <p className="text-xs font-mono font-bold text-blue-600 pt-0.5">
                Preview: {formattedPrice}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Stok Fisik Tersedia (Unit) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Boxes className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15"
                />
              </div>
              <p className="text-xs text-gray-500">
                Jumlah unit siap kirim atau tersedia di toko.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700  uppercase tracking-wider mb-2">
              Status Ketersediaan Katalog
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsAvailable(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isAvailable
                    ? "bg-emerald-50 0/40 border-emerald-500 text-emerald-700 300 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 -900"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersedia (Aktif Dijual)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAvailable(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  !isAvailable
                    ? "bg-red-50  border-red-500 text-red-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 -900"
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>Stok Habis / Tidak Dipajang</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              to="/admin/productstores"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600  hover:bg-gray-100 -800 transition-colors"
            >
              Batal
            </Link>
            <Button
              label={updateMutation.isPending ? "Menyimpan Perubahan..." : "Simpan Perubahan Stok"}
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}