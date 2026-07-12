import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ModalConfirmProps {
  /** Apakah modal konfirmasi sedang terbuka */
  isOpen: boolean;
  /** Fungsi untuk menutup modal (klik Batal atau tombol X) */
  onClose: () => void;
  /** Fungsi yang akan dijalankan saat tombol konfirmasi diklik */
  onConfirm: () => void;
  /** Judul modal konfirmasi */
  title?: string;
  /** Pesan detail atau pertanyaan konfirmasi (bisa string atau elemen React) */
  message?: React.ReactNode;
  /** Teks pada tombol konfirmasi utama (default: "Ya, Hapus") */
  confirmLabel?: string;
  /** Teks pada tombol batal (default: "Batal") */
  cancelLabel?: string;
  /** Varian tombol konfirmasi (default: "danger" untuk penghapusan data) */
  variant?: "danger" | "primary" | "warning" | "info";
  /** Apakah proses sedang berjalan (muncul loading spinner di tombol) */
  isLoading?: boolean;
}

export function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah kamu yakin ingin melanjutkan tindakan ini? Data yang dihapus tidak dapat dikembalikan.",
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  variant = "danger",
  isLoading = false,
}: ModalConfirmProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={!isLoading ? onClose : () => {}}
      maxWidth="md"
      closeOnOverlayClick={!isLoading}
      closeOnEsc={!isLoading}
    >
      <div className="text-center py-2 px-1 sm:px-4">
        {/* Ikon Peringatan Bersinar */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-5 shadow-inner ring-8 ring-red-50">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>

        {/* Judul & Pesan */}
        <h3 className="text-xl font-bold text-gray-900 mb-2.5">
          {title}
        </h3>
        <div className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
          {message}
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-center gap-3 mt-8 pt-5 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            label={cancelLabel}
            onClick={onClose}
            disabled={isLoading}
            className="w-1/2 justify-center py-2.5! font-semibold cursor-pointer"
          />
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            label={isLoading ? "Memproses..." : confirmLabel}
            onClick={onConfirm}
            disabled={isLoading}
            icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            className="w-1/2 justify-center py-2.5! font-bold shadow-md cursor-pointer"
          />
        </div>
      </div>
    </Modal>
  );
}
