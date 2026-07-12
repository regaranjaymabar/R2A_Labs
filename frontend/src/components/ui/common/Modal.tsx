import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  /** Apakah modal sedang terbuka */
  isOpen: boolean;
  /** Fungsi yang dipanggil saat modal ditutup (klik X, ESC, atau klik overlay) */
  onClose: () => void;
  /** Judul modal */
  title?: React.ReactNode;
  /** Keterangan / subjudul kecil di bawah judul */
  subtitle?: React.ReactNode;
  /** Badge kecil di atas judul (opsional) */
  badge?: React.ReactNode;
  /** Konten utama di dalam modal */
  children: React.ReactNode;
  /** Bagian footer modal (biasanya untuk tombol aksi Batal / Simpan) */
  footer?: React.ReactNode;
  /** Lebar maksimal modal */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  /** Tambahan class untuk container modal */
  className?: string;
  /** Apakah menutup modal saat overlay gelap diklik (default: true) */
  closeOnOverlayClick?: boolean;
  /** Apakah menutup modal saat tombol ESC ditekan (default: true) */
  closeOnEsc?: boolean;
}

const maxWidthClasses: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-full mx-4",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  maxWidth = "xl",
  className = "",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) {
  // Handle ESC key press & disable background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    };

    // Mencegah scroll pada body saat modal aktif
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={`bg-white border border-gray-200 rounded-3xl w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col ${maxWidthClasses[maxWidth]} ${className}`}
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal ikut menutup overlay
      >
        {/* Header Modal */}
        {(title || subtitle || badge) && (
          <div className="flex items-start justify-between border-b border-gray-200 pb-4 shrink-0 gap-4">
            <div className="space-y-1 min-w-0">
              {badge && (
                <div className="text-xs font-bold tracking-wider uppercase font-mono block">
                  {badge}
                </div>
              )}
              {title && (
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <div className="text-xs text-gray-500 font-mono">
                  {subtitle}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              title="Tutup Modal (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Konten Utama */}
        <div className="space-y-5 flex-1 min-h-0 text-sm">{children}</div>

        {/* Footer Modal (Tombol Aksi) */}
        {footer && (
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
