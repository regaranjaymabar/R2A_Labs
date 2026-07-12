import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { TabelStoreIndex } from "./components/TabelStoreIndex";
import { storeService } from "../../../services/storeService";
import { useDeleteStore } from "./hooks/useDeleteStore";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useQuery } from "@tanstack/react-query";
import type { Store } from "../../../types/store";

export type { Store };

export const initialStores: Store[] = [
  { id: 1, name: "Toko Asus Official Jakarta", address: "Mangga Dua Mall Lt. 2 No. 45", city: "Jakarta Pusat", phone: "081234567801", is_active: 1 },
  { id: 2, name: "Lenovo Exclusive Store", address: "Harco Mangga Dua Lt. 1 No. 12", city: "Jakarta Pusat", phone: "081234567802", is_active: 1 },
  { id: 3, name: "HP Store Bandung", address: "Bandung Electronic Center Lt. 3", city: "Bandung", phone: "081234567803", is_active: 1 },
  { id: 4, name: "Acer Point Surabaya", address: "Hi-Tech Mall Surabaya Lt. Dasar", city: "Surabaya", phone: "081234567804", is_active: 1 },
  { id: 5, name: "iBox Apple Authorized", address: "Grand Indonesia West Mall Lt. 3", city: "Jakarta Pusat", phone: "081234567805", is_active: 1 },
  { id: 6, name: "MSI Gaming Store Jogja", address: "Jogjatronik Mall Lt. 2 No. 88", city: "Yogyakarta", phone: "081234567806", is_active: 1 },
  { id: 7, name: "Dell Concept Store", address: "Plaza Simpang Lima Lt. 1", city: "Semarang", phone: "081234567807", is_active: 1 },
  { id: 8, name: "Axioo Class Program", address: "Jl. Boulevard Raya Blok LA4 No. 15", city: "Jakarta Utara", phone: "081234567808", is_active: 1 },
  { id: 9, name: "Razer Store Bali", address: "Mall Bali Galeria Lt. 2", city: "Denpasar", phone: "081234567809", is_active: 0 },
  { id: 10, name: "Samsung Experience Store", address: "Pondok Indah Mall 2 Lt. 1", city: "Jakarta Selatan", phone: "081234567810", is_active: 1 },
];

export default function StoreIndex() {
  // Fetch Data Toko menggunakan Generic Hook useGet + storeService
  const {
    data: storesData,
    isLoading,
  } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      try {
        return await storeService.getAll();
      } catch (err: any) {
        if (!err.response) {
          console.warn("Server backend offline, menggunakan data dummy cadangan untuk UI.");
          return initialStores;
        }
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const data = storesData || initialStores;

  // Custom Hook Hapus Data (Delete dengan Modal Confirm)
  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    isDeleting,
    deletingId,
  } = useDeleteStore();

  return (
    <div className="space-y-6 pb-10">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Toko / Stores</h1>
        </div>
        <div>
          <Link
            to="/admin/stores/add"
            className="inline-flex items-center gap-2 bg-[#151216] text-white hover:bg-[#262128] font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Toko</span>
          </Link>
        </div>
      </div>

      {/* Memanggil Komponen Tabel Reusable (Modular) */}
      <TabelStoreIndex
        data={data}
        isLoading={isLoading}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* MODAL CONFIRM DELETE */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Toko dari Sistem?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus data toko{" "}
            <strong className="text-gray-900 font-semibold">
              {deleteTarget?.name}
            </strong>{" "}
            (ID: #{deleteTarget?.id})? Data yang dihapus tidak dapat dikembalikan.
          </span>
        }
        confirmLabel="Ya, Hapus Toko"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
