import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Sliders,
  Save,
  Filter,
  Hash,
} from "lucide-react";
import { TabelProductWeightIndex } from "./components/TabelProductWeightIndex";
import { Button } from "../../../components/ui/common/Button";
import { Modal } from "../../../components/ui/common/Modal";

// 1. Definisi Interface Pembobotan Produk (product_criteria)
export interface ProductCriteria {
  id: number;
  product_id: number;
  criteria_id: number;
  sub_criteria_id: number; // FK ke tabel sub_criteria (hasil pilihan dari dropdown)
  value_numeric: number; // Skala numerik matematis hasil konversi (misal: 2.00, 4.00)
  created_at?: string;

  // Properti Opsional Hasil JOIN (agar admin mudah membaca):
  product_name?: string; // Misal: "ASUS Vivobook 14"
  criteria_code?: string; // Misal: "C2", "C1"
  criteria_name?: string; // Misal: "RAM", "Harga"
  sub_criteria_description?: string; // Teks spesifikasi misal: "8 GB", "512 GB SSD"
}

// Data Pilihan Sub-Kriteria yang Mapan dari Langkah 2 (Untuk pengisian dropdown)
const subCriteriaOptions = [
  // C1: Harga (criteria_id: 1)
  { id: 1, criteria_id: 1, description: "<= Rp 6.000.000", value_numeric: 5.0 },
  { id: 2, criteria_id: 1, description: "Rp 6.000.001 - Rp 8.000.000", value_numeric: 4.0 },
  { id: 3, criteria_id: 1, description: "Rp 8.000.001 - Rp 10.000.000", value_numeric: 3.0 },
  { id: 4, criteria_id: 1, description: "Rp 10.000.001 - Rp 12.000.000", value_numeric: 2.0 },
  { id: 5, criteria_id: 1, description: "> Rp 12.000.000", value_numeric: 1.0 },
  // C2: RAM (criteria_id: 2)
  { id: 6, criteria_id: 2, description: "4 GB", value_numeric: 1.0 },
  { id: 7, criteria_id: 2, description: "8 GB", value_numeric: 2.0 },
  { id: 8, criteria_id: 2, description: "12 GB", value_numeric: 3.0 },
  { id: 9, criteria_id: 2, description: "16 GB", value_numeric: 4.0 },
  { id: 10, criteria_id: 2, description: "24 GB atau lebih", value_numeric: 5.0 },
  // C3: Storage (criteria_id: 3)
  { id: 11, criteria_id: 3, description: "128 GB SSD", value_numeric: 1.0 },
  { id: 12, criteria_id: 3, description: "256 GB SSD", value_numeric: 2.0 },
  { id: 13, criteria_id: 3, description: "512 GB SSD", value_numeric: 3.0 },
  { id: 14, criteria_id: 3, description: "1 TB SSD", value_numeric: 4.0 },
  { id: 15, criteria_id: 3, description: "2 TB SSD atau lebih", value_numeric: 5.0 },
  // C4: Battery (criteria_id: 4)
  { id: 16, criteria_id: 4, description: "<= 3500 mAh", value_numeric: 1.0 },
  { id: 17, criteria_id: 4, description: "3501 - 4500 mAh", value_numeric: 2.0 },
  { id: 18, criteria_id: 4, description: "4501 - 5500 mAh", value_numeric: 3.0 },
  { id: 19, criteria_id: 4, description: "5501 - 6500 mAh", value_numeric: 4.0 },
  { id: 20, criteria_id: 4, description: "> 6500 mAh", value_numeric: 5.0 },
  // C5: Berat (criteria_id: 5)
  { id: 21, criteria_id: 5, description: "<= 1.20 Kg", value_numeric: 5.0 },
  { id: 22, criteria_id: 5, description: "1.21 - 1.50 Kg", value_numeric: 4.0 },
  { id: 23, criteria_id: 5, description: "1.51 - 1.80 Kg", value_numeric: 3.0 },
];

// 2. Data Dummy Awal (Simulasi pemetaan 3 laptop ke dalam matriks product_criteria)
const initialProductCriterias: ProductCriteria[] = [
  // ASUS Vivobook 14 (product_id: 1)
  { id: 1, product_id: 1, product_name: "ASUS Vivobook 14 X1404", criteria_id: 1, criteria_code: "C1", criteria_name: "Harga", sub_criteria_id: 3, sub_criteria_description: "Rp 8.000.001 - Rp 10.000.000", value_numeric: 3.0 },
  { id: 2, product_id: 1, product_name: "ASUS Vivobook 14 X1404", criteria_id: 2, criteria_code: "C2", criteria_name: "RAM", sub_criteria_id: 7, sub_criteria_description: "8 GB", value_numeric: 2.0 },
  { id: 3, product_id: 1, product_name: "ASUS Vivobook 14 X1404", criteria_id: 3, criteria_code: "C3", criteria_name: "Storage", sub_criteria_id: 13, sub_criteria_description: "512 GB SSD", value_numeric: 3.0 },
  { id: 4, product_id: 1, product_name: "ASUS Vivobook 14 X1404", criteria_id: 4, criteria_code: "C4", criteria_name: "Battery", sub_criteria_id: 17, sub_criteria_description: "3501 - 4500 mAh", value_numeric: 2.0 },
  { id: 5, product_id: 1, product_name: "ASUS Vivobook 14 X1404", criteria_id: 5, criteria_code: "C5", criteria_name: "Berat", sub_criteria_id: 22, sub_criteria_description: "1.21 - 1.50 Kg", value_numeric: 4.0 },

  // Lenovo Legion 5 Pro (product_id: 2)
  { id: 6, product_id: 2, product_name: "Lenovo Legion 5 Pro", criteria_id: 1, criteria_code: "C1", criteria_name: "Harga", sub_criteria_id: 5, sub_criteria_description: "> Rp 12.000.000", value_numeric: 1.0 },
  { id: 7, product_id: 2, product_name: "Lenovo Legion 5 Pro", criteria_id: 2, criteria_code: "C2", criteria_name: "RAM", sub_criteria_id: 9, sub_criteria_description: "16 GB", value_numeric: 4.0 },
  { id: 8, product_id: 2, product_name: "Lenovo Legion 5 Pro", criteria_id: 3, criteria_code: "C3", criteria_name: "Storage", sub_criteria_id: 14, sub_criteria_description: "1 TB SSD", value_numeric: 4.0 },
  { id: 9, product_id: 2, product_name: "Lenovo Legion 5 Pro", criteria_id: 4, criteria_code: "C4", criteria_name: "Battery", sub_criteria_id: 20, sub_criteria_description: "> 6500 mAh", value_numeric: 5.0 },
  { id: 10, product_id: 2, product_name: "Lenovo Legion 5 Pro", criteria_id: 5, criteria_code: "C5", criteria_name: "Berat", sub_criteria_id: 23, sub_criteria_description: "1.51 - 1.80 Kg", value_numeric: 3.0 },

  // MacBook Air M2 (product_id: 3)
  { id: 11, product_id: 3, product_name: "MacBook Air M2", criteria_id: 1, criteria_code: "C1", criteria_name: "Harga", sub_criteria_id: 4, sub_criteria_description: "Rp 10.000.001 - Rp 12.000.000", value_numeric: 2.0 },
  { id: 12, product_id: 3, product_name: "MacBook Air M2", criteria_id: 2, criteria_code: "C2", criteria_name: "RAM", sub_criteria_id: 7, sub_criteria_description: "8 GB", value_numeric: 2.0 },
  { id: 13, product_id: 3, product_name: "MacBook Air M2", criteria_id: 3, criteria_code: "C3", criteria_name: "Storage", sub_criteria_id: 12, sub_criteria_description: "256 GB SSD", value_numeric: 2.0 },
  { id: 14, product_id: 3, product_name: "MacBook Air M2", criteria_id: 4, criteria_code: "C4", criteria_name: "Battery", sub_criteria_id: 19, sub_criteria_description: "5501 - 6500 mAh", value_numeric: 4.0 },
  { id: 15, product_id: 3, product_name: "MacBook Air M2", criteria_id: 5, criteria_code: "C5", criteria_name: "Berat", sub_criteria_id: 21, sub_criteria_description: "<= 1.20 Kg", value_numeric: 5.0 },
];

export default function ProductWeightIndex() {
  const [data, setData] = useState<ProductCriteria[]>(initialProductCriterias);
  
  // Filter berdasarkan Produk
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>("ALL");

  // State Modal Edit Spek Pembobotan
  const [editingItem, setEditingItem] = useState<ProductCriteria | null>(null);
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
    const list: { id: number; name: string }[] = [];
    const seen = new Set<number>();
    data.forEach((item) => {
      if (!seen.has(item.product_id)) {
        seen.add(item.product_id);
        list.push({ id: item.product_id, name: item.product_name || `Product #${item.product_id}` });
      }
    });
    return list;
  }, [data]);

  // Buka Modal Update
  const handleOpenEdit = (item: ProductCriteria) => {
    setEditingItem(item);
    setSelectedSubCriteriaId(item.sub_criteria_id);
  };

  // Simpan Perubahan (Sesuai pilihan dropdown Sub-Kriteria)
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Cari data sub_criteria yang dipilih
    const selectedSub = subCriteriaOptions.find((opt) => opt.id === Number(selectedSubCriteriaId));
    if (!selectedSub) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              sub_criteria_id: selectedSub.id,
              sub_criteria_description: selectedSub.description,
              value_numeric: selectedSub.value_numeric,
            }
          : item
      )
    );
    setEditingItem(null);
  };

  // Hapus Bobot Spek
  const handleDelete = (id: number, prodName: string, critName: string) => {
    if (window.confirm(`Hapus bobot spesifikasi [${critName}] untuk laptop "${prodName}"?`)) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Opsi Dropdown khusus kriteria yang sedang diedit
  const availableSubCriteriaOptions = useMemo(() => {
    if (!editingItem) return [];
    return subCriteriaOptions.filter((opt) => opt.criteria_id === editingItem.criteria_id);
  }, [editingItem]);



  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pembobotan Produk (Matriks Keputusan)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono">
              product_criteria
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Eksekusi pembobotan spesifikasi laptop. Admin diwajibkan memilih spesifikasi berdasarkan dropdown <code className="font-mono text-purple-600 font-bold">sub_criteria</code> yang sudah mapan, bukan mengetik angka manual.
          </p>
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

      {/* Banner Penjelasan Alur Pembobotan SPK */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-purple-900 dark:text-purple-300">
        <div className="flex items-start gap-3">
          <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Alur Kerja Pembobotan Produk (Langkah 3):</p>
            <p className="text-purple-800 dark:text-purple-300/90 leading-relaxed">
              Saat admin mendaftarkan laptop seperti <strong className="underline">"ASUS Vivobook 14"</strong>, sistem memaksa admin memilih spesifikasinya dari dropdown Sub-Kriteria (misal: memilih <code className="bg-purple-100 dark:bg-purple-900/60 px-1 rounded font-mono font-bold">"8 GB"</code>).<br />
              Sistem akan otomatis mengambil angka konversinya (<code className="font-mono font-bold">value_numeric = 2.00</code>) untuk diolah di matriks SAW.
            </p>
          </div>
        </div>
        
        {/* Dropdown Filter Produk */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#181519] px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 shadow-2xs shrink-0">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Filter Laptop:</span>
          <select
            value={selectedProductFilter}
            onChange={(e) => setSelectedProductFilter(e.target.value)}
            className="bg-transparent font-bold text-purple-600 dark:text-purple-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">🌐 Semua Laptop ({uniqueProducts.length})</option>
            {uniqueProducts.map((prod) => (
              <option key={prod.id} value={prod.id}>
                💻 {prod.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Pembobotan (Modular) */}
      <TabelProductWeightIndex
        data={filteredData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* MODAL UPDATE PEMBOBOTAN PRODUK */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        maxWidth="lg"
        badge={
          <span className="text-purple-600 dark:text-purple-400">
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
            {/* Dropdown Pilihan Sub-Kriteria */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Pilih Spesifikasi (<code className="font-mono text-purple-600">sub_criteria_id</code>)
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Admin dilarang mengetik manual! Pilih spesifikasi dari aturan konversi yang sudah mapan:
              </p>

              <div className="space-y-2.5 mt-2">
                {availableSubCriteriaOptions.map((opt) => {
                  const isSelected = opt.id === Number(selectedSubCriteriaId);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSubCriteriaId(opt.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20 shadow-xs"
                          : "bg-gray-50 dark:bg-[#181519] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-gray-300 bg-white"}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white block" />}
                        </div>
                        <span className="font-bold text-sm">{opt.description}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-white dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <Hash className="w-3 h-3 text-purple-500" />
                        Skala: {opt.value_numeric.toFixed(2)}
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
                icon={<Save className="w-4 h-4" />}
                label="Simpan Bobot Spek"
                className="text-xs! py-2! px-5! rounded-xl font-bold shadow-md cursor-pointer"
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
