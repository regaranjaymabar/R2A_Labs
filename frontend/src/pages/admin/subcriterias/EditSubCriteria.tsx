import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { subCriteriaService } from "../../../services/subCriteriaService";
import { useUpdate } from "../../../hooks/useUpdate";
import type { SubCriteriaFormData } from "./hooks/useAddSubCriteria";
import type { SubCriteria } from "./SubCriteriaIndex";

interface EditSubCriteriaProps {
  isOpen: boolean;
  onClose: () => void;
  item: SubCriteria | null;
}

export default function EditSubCriteria({
  isOpen,
  onClose,
  item,
}: EditSubCriteriaProps) {
  const queryClient = useQueryClient();
  const [editDescription, setEditDescription] = useState<string>("");
  const [editValueNumeric, setEditValueNumeric] = useState<number>(1);

  useEffect(() => {
    if (item) {
      setEditDescription(item.description || "");
      setEditValueNumeric(Number(item.value_numeric) || 0);
    }
  }, [item]);

  const updateMutation = useUpdate<SubCriteriaFormData>({
    mutationFn: (payload) => subCriteriaService.update(item!.id, payload),
    queryKey: ["subcriterias"],
    successMessage: (variables) =>
      `Konversi "${variables.description}" berhasil diperbarui!`,
    errorMessage: (variables, err) =>
      `Gagal memperbarui konversi "${variables.description}": ${
        err?.response?.data?.message || err?.message || "Error"
      }`,
    onOfflineFallback: () => {
      queryClient.setQueryData<SubCriteria[]>(["subcriterias"], (old) =>
        old
          ? old.map((sub) =>
              sub.id === item?.id
                ? {
                    ...sub,
                    description: editDescription,
                    value_numeric: Number(editValueNumeric),
                  }
                : sub
            )
          : []
      );
    },
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    updateMutation.mutate(
      {
        criteria_id: Number(item.criteria_id),
        description: editDescription,
        value_numeric: Number(editValueNumeric),
      },
      {
        onSuccess: () => onClose(),
        onSettled: () => onClose(),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      badge={
        <span className="text-blue-600 dark:text-blue-400">
          Update Konversi (sub_criteria)
        </span>
      }
      title={
        item
          ? `[${item.criteria_code || `ID:${item.criteria_id}`}] ${
              item.criteria_name || `Criteria #${item.criteria_id}`
            }`
          : ""
      }
      subtitle={
        item
          ? `id: ${item.id} | criteria_id: ${item.criteria_id}`
          : undefined
      }
    >
      {item && (
        <form onSubmit={handleSaveEdit} className="space-y-5">
          {/* 1. Deskripsi Spesifikasi / Rentang */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Deskripsi Spesifikasi (<code className="font-mono">description</code>)
            </label>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Tulisan rentang spesifikasi fisik atau harga yang dibaca oleh admin/konsumen.
            </p>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Misal: <= Rp 6.000.000, 8 GB, 512 GB SSD"
              className="w-full px-4 py-2.5 text-sm font-semibold bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs font-mono"
              required
            />
          </div>

          {/* 2. Nilai Numerik Skala Matriks */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center gap-1.5">
              <span>
                Nilai Numerik (<code className="font-mono">value_numeric</code>)
              </span>
            </label>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Angka skala konversi yang akan dimasukkan ke dalam matriks keputusan SAW (Misal: 1.00 - 5.00).
            </p>
            <div className="relative mt-1">
              <input
                type="number"
                step="0.01"
                min="0"
                value={editValueNumeric}
                onChange={(e) => setEditValueNumeric(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-base font-mono font-bold bg-blue-50/50 dark:bg-[#181519] border border-blue-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-2xs text-blue-700"
                required
              />
            </div>
          </div>

          {/* Action Buttons Menggunakan Komponen Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              label="Batal"
              className="!text-xs! py-2! px-5! rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            />
            <Button
              type="submit"
              variant="info"
              icon={<Save className="w-4 h-4" />}
              label={
                updateMutation.isPending ? "Menyimpan..." : "Simpan Konversi"
              }
              disabled={updateMutation.isPending}
              className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
