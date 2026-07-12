import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Filter,
} from "lucide-react";
import { TabelProductWeightIndex } from "./components/TabelProductWeightIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";
import { ModalConfirm } from "../../../components/ui/common/ModalConfirm";
import { useGet } from "../../../hooks/useGet";
import { productWeightService } from "../../../services/productWeightService";
import { productService } from "../../../services/productService";
import { subCriteriaService } from "../../../services/subCriteriaService";
import { criteriaService } from "../../../services/criteriaService";
import { initialCriterias } from "../criterias/CriteriaIndex";
import { initialProducts } from "../products/ProductIndex";
import { useDeleteProductWeight } from "./hooks/useDeleteProductWeight";
import { useQueryClient } from "@tanstack/react-query";
import type { ProductWeight } from "../../../types/productWeight";



export const initialProductCriterias: ProductWeight[] = [];

export default function ProductWeightIndex() {
  const queryClient = useQueryClient();
  const { data: fetchedData, isLoading } = useGet<ProductWeight[]>({
    queryKey: ["productweights"],
    queryFn: productWeightService.getAll,
    offlineFallbackData: initialProductCriterias,
  });
  const data = fetchedData || initialProductCriterias;

  const { data: fetchedProducts } = useGet<any[]>({
    queryKey: ["products"],
    queryFn: productService.getAll,
    offlineFallbackData: initialProducts,
  });
  const products = fetchedProducts || initialProducts;

  // Fetch seluruh kriteria dari database untuk header kolom dinamis
  const { data: fetchedCriterias } = useGet<any[]>({
    queryKey: ["criterias"],
    queryFn: criteriaService.getAll,
    offlineFallbackData: initialCriterias,
  });
  const criterias = fetchedCriterias || initialCriterias;

  // Fetch seluruh sub-kriteria dari database agar modal pilihan tidak kosong
  const { data: fetchedSubCriterias } = useGet<any[]>({
    queryKey: ["subcriterias"],
    queryFn: subCriteriaService.getAll,
  });
  const subCriteriaList = fetchedSubCriterias || [];

  const {
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    deletingId,
  } = useDeleteProductWeight();

  // Filter berdasarkan Produk
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>("ALL");

  // State Modal Edit Spek Pembobotan
  const [editingItem, setEditingItem] = useState<ProductWeight | null>(null);
  const [selectedSubCriteriaId, setSelectedSubCriteriaId] = useState<number>(0);

  // Filter Data
  const filteredData = useMemo(() => {
    if (selectedProductFilter === "ALL") {
      return data;
    }
    return data.filter((item) => String(item.product_id) === selectedProductFilter);
  }, [data, selectedProductFilter]);

  // Daftar produk unik untuk dropdown filter
  const uniqueProducts = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((prod: any) => ({
        id: prod.id,
        name:
          prod.product_name ||
          prod.name ||
          ((prod.brand?.name || prod.brand_name) && (prod.modelName || prod.model_name)
            ? `${prod.brand?.name || prod.brand_name} ${prod.modelName || prod.model_name}`
            : prod.modelName || prod.model_name || `Laptop #${prod.id}`),
      }));
    }
    const list: { id: number; name: string }[] = [];
    const seen = new Set<number>();
    data.forEach((item) => {
      if (!seen.has(item.product_id)) {
        seen.add(item.product_id);
        list.push({ id: item.product_id, name: item.product_name || `Product #${item.product_id}` });
      }
    });
    return list;
  }, [data, products]);

  // Buka Modal Update
  const handleOpenEdit = (item: ProductWeight) => {
    setEditingItem(item);
    setSelectedSubCriteriaId(item.sub_criteria_id);
  };

  // Simpan Perubahan (Sesuai pilihan dropdown Sub-Kriteria)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Cari data sub_criteria yang dipilih dari daftar asli database
    const selectedSub = subCriteriaList.find((opt) => Number(opt.id) === Number(selectedSubCriteriaId));
    if (!selectedSub) return;

    const valNumeric = Number(selectedSub.value_numeric ?? selectedSub.valueNumeric ?? 0);

    // 1. Update cache lokal seketika agar UI langsung berubah tanpa jeda
    queryClient.setQueryData<ProductWeight[]>(["productweights"], (prev: ProductWeight[] | undefined) => {
      const list = prev || [];
      if (editingItem.id === 0) {
        const newId = Math.max(0, ...list.map((i) => i.id)) + 1;
        return [
          ...list,
          {
            ...editingItem,
            id: newId,
            sub_criteria_id: selectedSub.id,
            sub_criteria_description: selectedSub.description,
            value_numeric: valNumeric,
          },
        ];
      }
      return list.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              sub_criteria_id: selectedSub.id,
              sub_criteria_description: selectedSub.description,
              value_numeric: valNumeric,
            }
          : item
      );
    });

    setEditingItem(null);

    // 2. Kirim ke backend secara sinkron/berkelanjutan agar tersimpan di database
    try {
      const currentList = queryClient.getQueryData<ProductWeight[]>(["productweights"]) || [];
      const prodId = editingItem.product_id;
      const subIds = currentList
        .filter((i) => Number(i.product_id) === Number(prodId) && Number(i.sub_criteria_id) > 0)
        .map((i) => Number(i.sub_criteria_id));

      const prod: any = products.find((p: any) => Number(p.id) === Number(prodId)) || {};
      await productService.update(prodId, {
        modelName: prod.modelName || prod.product_name || editingItem.product_name || "Laptop",
        brandId: prod.brandId || prod.brand_id || 1,
        subCriteriaIds: subIds,
      });
    } catch (err) {
      // Abaikan jika offline / 404 agar tidak mengganggu UI pengguna
    }
  };

  // Opsi Dropdown khusus kriteria yang sedang diedit
  const availableSubCriteriaOptions = useMemo(() => {
    if (!editingItem) return [];
    return subCriteriaList.filter(
      (opt) =>
        Number(opt.criteria_id ?? opt.criteriaId) === Number(editingItem.criteria_id) ||
        (opt.criteria_code && opt.criteria_code === editingItem.criteria_code)
    );
  }, [editingItem, subCriteriaList]);



  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pembobotan Produk
            </h1>
          </div>
        </div>
        <div>
          <Link
            to="/admin/productweights/add"
            className="inline-flex items-center gap-2 bg-[#151216] dark:bg-white text-white dark:text-gray-900 hover:bg-[#262128] dark:hover:bg-gray-200 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bobot Produk</span>
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-[#181519] border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-gray-800 dark:text-gray-300">

        {/* Dropdown Filter Produk */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#151216] px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xs shrink-0">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Filter Laptop:</span>
          <select
            value={selectedProductFilter}
            onChange={(e) => setSelectedProductFilter(e.target.value)}
            className="bg-transparent font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Laptop ({uniqueProducts.length})</option>
            {uniqueProducts.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Pembobotan (Modular) */}
      <TabelProductWeightIndex
        data={filteredData}
        products={products}
        criterias={criterias}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* MODAL UPDATE PEMBOBOTAN PRODUK */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        maxWidth="lg"
        badge={
          <span className="text-gray-900 dark:text-gray-100 font-bold">
            Pilih Spesifikasi dari Sub-Kriteria
          </span>
        }
        title={editingItem?.product_name || ""}
        subtitle={
          editingItem ? `Dimensi: [${editingItem.criteria_code}] ${editingItem.criteria_name}` : undefined
        }
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            <div className="space-y-2">
              <div className="space-y-2.5 mt-2">
                {availableSubCriteriaOptions.map((opt) => {
                  const isSelected = opt.id === Number(selectedSubCriteriaId);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSubCriteriaId(opt.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                          ? "bg-gray-100 dark:bg-gray-800 border-gray-900 dark:border-white text-gray-900 dark:text-white ring-2 ring-gray-900/10 dark:ring-white/20 shadow-xs"
                          : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-gray-900 bg-gray-900 dark:border-white dark:bg-white text-white dark:text-gray-900" : "border-gray-300 bg-white dark:bg-gray-800"}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white dark:bg-gray-900 block" />}
                        </div>
                        <span className="font-bold text-sm">{opt.description}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
                        {Number(opt.value_numeric ?? opt.valueNumeric ?? 0).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons Menggunakan Komponen Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingItem(null)}
                label="Batal"
                className="!text-xs! py-2! px-5! rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
              />
              <Button
                type="submit"
                variant="info"
                label="Simpan Bobot Spek"
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
              />
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL KONFIRMASI HAPUS BOBOT */}
      <ModalConfirm
        isOpen={Boolean(deleteTarget)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Bobot Spesifikasi?"
        message={
          <span>
            Apakah kamu yakin ingin menghapus bobot spesifikasi <strong className="font-bold text-gray-900 dark:text-white">{deleteTarget?.name}</strong>? Data perhitungan SPK yang terkait dengan spesifikasi ini akan berubah.
          </span>
        }
        confirmLabel="Ya, Hapus Bobot"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}