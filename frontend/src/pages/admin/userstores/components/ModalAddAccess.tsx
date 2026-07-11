import React from "react";
import { Link } from "react-router-dom";
import { Modal } from "../../../../components/ui/common/Modal";
import { InputSelect } from "../../../../components/ui/common/InputSelect";
import { Button } from "../../../../components/ui/common/Button";

interface ModalAddAccessProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedUserId: number;
  setSelectedUserId: (val: number) => void;
  selectedStoreId: number;
  setSelectedStoreId: (val: number) => void;
  availableStoreAdmins: Array<{ id: number; name: string; email: string }>;
  availableStores: Array<{ id: number; name: string; city: string }>;
  isSubmitting: boolean;
}

export function ModalAddAccess({
  isOpen,
  onClose,
  onSubmit,
  selectedUserId,
  setSelectedUserId,
  selectedStoreId,
  setSelectedStoreId,
  availableStoreAdmins,
  availableStores,
  isSubmitting,
}: ModalAddAccessProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Beri Akses Operasional Toko"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <InputSelect
          label="Pilih Pegawai Admin Toko"
          nama="selectedUserId"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          options={availableStoreAdmins.map((adm) => ({
            value: adm.id,
            label: `${adm.name} — (${adm.email})`,
          }))}
          placeholder=""
          helperText={
            <span>
              *Ingin menugaskan pegawai baru? Daftarkan akunnya terlebih dahulu di menu{" "}
              <Link to="/admin/users/add" className="underline font-bold text-blue-600 dark:text-blue-400">
                Daftar Pengguna (users)
              </Link>.
            </span>
          }
        />

        <InputSelect
          label="Pilih Cabang Toko"
          nama="selectedStoreId"
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(Number(e.target.value))}
          options={availableStores.map((st) => ({
            value: st.id,
            label: `${st.name} — Kota: ${st.city}`,
          }))}
          placeholder=""
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            label="Batal"
            className="!text-xs! py-2! px-5! rounded-xl cursor-pointer"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            label={isSubmitting ? "Menyimpan..." : "Simpan Akses Toko"}
            className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
          />
        </div>
      </form>
    </Modal>
  );
}
