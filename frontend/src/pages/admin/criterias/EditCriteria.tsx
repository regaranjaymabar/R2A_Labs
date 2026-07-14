import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Modal } from "../../../components/ui/common/Modal";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { criteriaService } from "../../../services/criteriaService";
import { useQueryClient } from "@tanstack/react-query";
import type { Criteria } from "../../../types/criteria";

interface EditCriteriaProps {
  editingItem: Criteria | null;
  onClose: () => void;
  onSuccess: () => Promise<any> | void;
}

export default function EditCriteria({
  editingItem,
  onClose,
  onSuccess,
}: EditCriteriaProps) {
  const queryClient = useQueryClient();
  const [editCode, setEditCode] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editType, setEditType] = useState<"benefit" | "cost">("benefit");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setEditCode(editingItem.code);
      setEditName(editingItem.name);
      setEditType(
        (editingItem.type.toLowerCase() === "cost" ? "cost" : "benefit") as
          | "benefit"
          | "cost"
      );
    }
  }, [editingItem]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSavingEdit(true);
      await criteriaService.update(editingItem.id, {
        code: editCode.toUpperCase(),
        name: editName.trim(),
        type: editType,
      });

      queryClient.setQueryData<Criteria[]>(["criterias"], (old = []) =>
        old.map((item) =>
          Number(item.id) === Number(editingItem.id)
            ? {
                ...item,
                code: editCode.toUpperCase(),
                name: editName.trim(),
                type: editType,
              }
            : item
        )
      );

      onClose();
      if (onSuccess) {
        await onSuccess();
      }
      await queryClient.invalidateQueries({ queryKey: ["criterias"] });
    } catch (err: any) {
      alert(
        `Gagal memperbarui kriteria: ${
          err?.response?.data?.message || err?.message || "Error"
        }`
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(editingItem)}
      onClose={onClose}
      maxWidth="lg"
      badge={
        <span className="text-black dark:text-gray-400">
          Update Dimensi Penilaian
        </span>
      }
      title={editingItem ? `[${editingItem.code}] ${editingItem.name}` : ""}
    >
      {editingItem && (
        <form onSubmit={handleSaveEdit} className="space-y-5">
          <InputText
            label="Kode Dimensi (Label Perhitungan SAW)"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            placeholder="Misal: C1, C2"
            required
            className="font-mono font-bold uppercase"
          />

          <InputText
            label="Nama Dimensi Penilaian"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Misal: Harga, RAM, Storage"
            required
          />

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 items-center gap-1.5">
              <span>
                Tipe Atribut Algoritma SAW (
                <code className="font-mono text-[11px]">type</code>)
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEditType("benefit")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  editType === "benefit"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      editType === "benefit" ? "text-emerald-600" : "text-gray-400"
                    }`}
                  />
                  <span>benefit</span>
                </div>
                <span className="text-[10px] opacity-80">
                  Semakin besar nilainya semakin bagus
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEditType("cost")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  editType === "cost"
                    ? "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-300 ring-2 ring-red-500/20"
                    : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <TrendingDown
                    className={`w-4 h-4 ${
                      editType === "cost" ? "text-red-600" : "text-gray-400"
                    }`}
                  />
                  <span>cost</span>
                </div>
                <span className="text-[10px] opacity-80">
                  Semakin kecil nilainya semakin bagus
                </span>
              </button>
            </div>
          </div>

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
              disabled={isSavingEdit}
              label={isSavingEdit ? "Menyimpan..." : "Simpan Kriteria"}
              className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
