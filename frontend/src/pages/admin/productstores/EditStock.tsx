import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Ban, Boxes, Package } from "lucide-react";
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

  // Ambil data detail inventaris toko
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

  // Format Rupiah Live Preview
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID tidak valid");
      return await productStoreService.update(id, {
        price: Number(price),
        stock: Number(stock),
        is_available: isAvailable,
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
      {/* 1. TOMBOL KEMBALI */}
      <div>
        <Link
          to="/admin/productstores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Stok & Harga</span>
        </Link>
      </div>

      {/* 2. JUDUL HALAMAN */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <span>Edit Stok & Harga Laptop</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Perbarui harga jual resmi cabang, kuantitas stok fisik, dan status ketersediaan laptop di toko Anda.
        </p>
      </div>

      {/* 3. FORM KARTU UTAMA */}
      <div className="bg-white dark:bg-[#151216] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {item && (
          <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Model Laptop Terpilih
              </span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {(item as any).product?.modelName || (item as any).product_name || `Laptop ID #${(item as any).productId || item.product_id}`}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Harga Jual */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20500000"
                />
              </div>
              <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 pt-0.5">
                Preview: {formattedPrice}
              </p>
            </div>

            {/* Input Kuantitas Stok */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Jumlah unit siap kirim atau tersedia di toko.
              </p>
            </div>
          </div>

          {/* Toggle Ketersediaan */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Status Ketersediaan Katalog
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsAvailable(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isAvailable
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
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
                    ? "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 shadow-sm"
                    : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>Stok Habis / Tidak Dipajang</span>
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Link
              to="/admin/productstores"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
