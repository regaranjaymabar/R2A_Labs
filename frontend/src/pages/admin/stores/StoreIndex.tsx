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
  
];

export default function StoreIndex() {
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

      <TabelStoreIndex
        data={data}
        isLoading={isLoading}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
      
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
