import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../services/productService";
import { TabelProductIndex } from "./components/TabelProductIndex";
import { useDeleteProduct } from "./hooks/useDeleteProduct";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";

import type { Product } from "../../../types/product";
export type { Product };

// 2. Data Dummy Awal (Sesuai skema tabel products MySQL)
const initialProducts: Product[] = [
  {
    id: 1,
    brand_id: 1,
    brand_name: "ASUS",
    model_name: "Zenbook 14 OLED UX3405MA",
    screen_size: 14.0,
    processor: "Intel Core Ultra 7 155H",
    ram: "16GB LPDDR5X",
    storage: "1TB M.2 NVMe SSD",
    battery: 75,
    weight: 1.2,
    release_year: 2024,
    is_active: 1,
  },
  {
    id: 2,
    brand_id: 1,
    brand_name: "ASUS",
    model_name: "ROG Zephyrus G14 GA402",
    screen_size: 14.0,
    processor: "AMD Ryzen 9 7940HS",
    ram: "16GB DDR5",
    storage: "1TB M.2 NVMe SSD",
    battery: 76,
    weight: 1.65,
    release_year: 2023,
    is_active: 1,
  },
  {
    id: 3,
    brand_id: 2,
    brand_name: "Lenovo",
    model_name: "ThinkPad X1 Carbon Gen 11",
    screen_size: 14.0,
    processor: "Intel Core i7-1355U",
    ram: "16GB LPDDR5",
    storage: "512GB M.2 NVMe SSD",
    battery: 57,
    weight: 1.12,
    release_year: 2023,
    is_active: 1,
  },
  {
    id: 4,
    brand_id: 5,
    brand_name: "Apple",
    model_name: "MacBook Air 13 M3",
    screen_size: 13.6,
    processor: "Apple M3 8-Core CPU",
    ram: "16GB Unified",
    storage: "512GB SSD",
    battery: 52,
    weight: 1.24,
    release_year: 2024,
    is_active: 1,
  },
  {
    id: 5,
    brand_id: 3,
    brand_name: "HP",
    model_name: "Victus Gaming 15-fb1013AX",
    screen_size: 15.6,
    processor: "AMD Ryzen 5 7535HS",
    ram: "8GB DDR5",
    storage: "512GB M.2 NVMe SSD",
    battery: 52,
    weight: 2.29,
    release_year: 2023,
    is_active: 1,
  },
  {
    id: 6,
    brand_id: 4,
    brand_name: "Acer",
    model_name: "Swift Go 14 SFG14-71",
    screen_size: 14.0,
    processor: "Intel Core i5-13500H",
    ram: "16GB LPDDR5",
    storage: "512GB M.2 NVMe SSD",
    battery: 65,
    weight: 1.25,
    release_year: 2023,
    is_active: 1,
  },
  {
    id: 7,
    brand_id: 6,
    brand_name: "MSI",
    model_name: "Cyborg 15 A12VE",
    screen_size: 15.6,
    processor: "Intel Core i7-12650H",
    ram: "16GB DDR5",
    storage: "512GB M.2 NVMe SSD",
    battery: 53,
    weight: 1.98,
    release_year: 2023,
    is_active: 0,
  },
];


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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Produk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola katalog spesifikasi laptop (`model_name`, `processor`, `ram`, `storage`, `is_active`) di sistem R2A LABS.
          </p>
        </div>
        <div>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 bg-[#151216] dark:bg-white text-white dark:text-gray-900 hover:bg-[#262128] dark:hover:bg-gray-200 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
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
            <strong className="text-gray-900 dark:text-white font-semibold">
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

