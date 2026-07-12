import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import {
    Plus,
    Loader2,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../../services/brandService";
import { Button } from "../../../components/ui/common/Button";
import { TableBrandIndex } from "./components/TableBrandIndex";
import { useDeleteBrand } from "./hooks/useDeleteBrand";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import type { Brand } from "../../../types/brand";



// Data Dummy Cadangan (Fallback jika server backend belum menyala saat development)
const initialBrands: Brand[] = [
   
];

export default function BrandIndex() {
    // 2. FUNGSI FETCH DATA (READ) MENGGUNAKAN useQuery + BRAND SERVICE: GET /brands
    const {
        data: brandsData,
        isLoading,
        isFetching,
        isError,
        error: queryError,
        refetch,
    } = useQuery<Brand[], AxiosError<{ message?: string }>>({
        queryKey: ["brands"], // Key cache unik untuk data merek
        queryFn: async () => {
            try {
                return await brandService.getAll();
            } catch (err: any) {
                if (!err.response) {
                    console.warn("Server backend offline, menggunakan data dummy cadangan untuk UI.");
                    return initialBrands;
                }
                throw err;
            }
        },
        retry: 1, // Coba ulang otomatis 1 kali jika gagal koneksi
        staleTime: 5 * 60 * 1000, // Cache data dianggap fresh selama 5 menit
    });

    // Gunakan data dari React Query, atau fallback ke initialBrands jika kosong
    const data = brandsData || initialBrands;

    // 3. FUNGSI HAPUS DATA (DELETE) DIPISAH KE CUSTOM HOOK: useDeleteBrand()

    const errorMessage = queryError?.response?.data?.message || queryError?.message || "Gagal mengambil data dari server.";

    const { handleDelete, confirmDelete, cancelDelete, deleteTarget, isDeleting, deletingId } = useDeleteBrand();
    

    return (
        <div className="space-y-6 pb-10">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Merek / Brands</h1>
                        {(isLoading || isFetching) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {isLoading ? "Mengambil Data..." : "Menyegarkan..."}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola katalog merek laptop (`id`, `name`,ang terdaftar di sistem R2A LABS.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    {/* Tombol Refresh Data dari Server (Refetch React Query via Button Component) */}
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => refetch()}
                        disabled={isLoading || isFetching}
                        icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading || isFetching ? "animate-spin" : ""}`} />}
                        label="Refresh"
                        className="px-3.5! py-2.5! rounded-xl! text-xs! font-semibold! bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer shadow-xs!"
                    />

                    <Link
                        to="/admin/brands/add"
                        className="inline-flex items-center gap-2 bg-[#151216] text-white hover:bg-[#262128] font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Brand</span>
                    </Link>
                </div>
            </div>

            {/* Banner Error (muncul jika gagal koneksi ke backend) */}
            {isError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs shadow-xs">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                        <span className="font-bold block text-sm">Informasi Koneksi Server Backend:</span>
                        <p className="leading-relaxed">{errorMessage}</p>
                        <p className="text-[11px] text-amber-700 italic">
                            *Catatan Dev: Saat ini tabel menampilkan data dummy cadangan agar kamu tetap bisa menguji antarmuka.
                        </p>
                    </div>
                </div>
            )}

            {/* Memanggil Komponen Tabel Merek yang Sudah Dipisah (Modular) */}
            <TableBrandIndex
                data={data}
                isLoading={isLoading}
                onDelete={handleDelete}
                deletingId={deletingId}
            />

            <ModalConfirm
                    isOpen={Boolean(deleteTarget)}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Hapus Brand dari Sistem?"
                    message={
                      <span>
                        Apakah kamu yakin ingin menghapus data brand{" "}
                        <strong className="text-gray-900 font-semibold">
                          {deleteTarget?.name}
                        </strong>{" "}
                        (ID: #{deleteTarget?.id})? Data yang dihapus tidak dapat dikembalikan.
                      </span>
                    }
                    confirmLabel="Ya, Hapus Brand"
                    cancelLabel="Batal"
                    variant="danger"
                    isLoading={isDeleting}
                  />
        </div>
        
    );
    
}
