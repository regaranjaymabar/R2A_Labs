import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../services/productService";
import { TabelProductIndex } from "./components/TabelProductIndex";
import { useDeleteProduct } from "./hooks/useDeleteProduct";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";

import { laptops } from "../../../data/laptops";
import type { Product } from "../../../types/product";
export type { Product };

// 2. Data Dummy Awal dari katalog laptops (Sesuai skema tabel products MySQL)
export const initialProducts: Product[] = laptops.map((l) => ({
  id: l.id,
  brand_name: l.brand,
  model_name: l.name,
  modelName: l.name,
  processor: l.cpu,
  ram: l.ram,
  storage: l.storage,
  battery: l.battery,
  weight: l.weight,
  release_year: 2024,
  is_active: true,
}));


export default function ProductIndex() {
  // 1. Ambil data produk menggunakan useQuery + productService
  const {
    data: productsData,
    isLoading,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        return await productService.getAll();
      } catch (err: any) {
        if (!err.response) {
          console.warn("Server offline, menggunakan data dummy cadangan untuk produk.");
          return initialProducts;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const data = productsData || initialProducts;

  // 2. Gunakan custom hook untuk hapus produk
  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting,
    deletingId,
  } = useDeleteProduct();

  return (
    <div className="space-y-6 pb-10">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Produk</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola katalog spesifikasi laptop (`model_name`, `processor`, `ram`, `storage`, `is_active`) di sistem R2A LABS.
          </p>
        </div>
        <div>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 bg-[#151216] text-white hover:bg-[#262128] font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Memanggil Komponen Tabel Produk Reusable */}
      <TabelProductIndex
        data={data}
        isLoading={isLoading}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* Modal Konfirmasi Hapus Produk */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Produk dari Katalog?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus produk{" "}
            <strong className="text-gray-900 font-semibold">
              {deleteTarget?.name}
            </strong>{" "}
            (ID: #{deleteTarget?.id})? Data yang dihapus tidak dapat dikembalikan.
          </span>
        }
        confirmLabel="Ya, Hapus Produk"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

