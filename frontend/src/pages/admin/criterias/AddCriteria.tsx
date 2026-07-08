import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSelect } from "../../../components/ui/common/InputSelect";
import { useAddCriteria } from "./hooks/useAddCriteria";

export default function AddCriteria() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        errors,
        isSubmitting,
        selectedType,
    } = useAddCriteria();

    const codeVal = watch("code") || "C1";
    const nameVal = watch("name") || "Nama Kriteria";

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* Header Halaman */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Tambah Kriteria Baru
                        </h1>
                    </div>
                </div>

                <Link
                    to="/admin/criterias"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </Link>
            </div>
            {/* Form Tambah Kriteria */}
            <div className="bg-white dark:bg-[#151216] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="h-2 bg-black"></div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-[#151216] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                    {/* Live Preview Badge */}
                    <div className="bg-gray-50 dark:bg-[#1a171c] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                Preview Matriks SAW:
                            </span>
                            <span className="text-sm font-bold font-mono text-gray-900 dark:text-white px-2.5 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xs">
                                [{codeVal}] {nameVal}
                            </span>
                        </div>
                        <div>
                            {selectedType === "benefit" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                                    benefit
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                                    cost
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 1. Kode Kriteria (code) */}
                    <InputText
                        label="Kode Kriteria (Identitas Unik)"
                        nama="code"
                        placeholder="Contoh: C1, C2, C3"
                        register={register}
                        error={errors.code?.message}
                        helperText="* Digunakan sebagai identitas kolom unik pada tabel perhitungan dan matriks keputusan."
                    />

                    {/* 2. Nama Kriteria (name) */}
                    <InputText
                        label="Nama Kriteria (Label Spesifikasi)"
                        nama="name"
                        placeholder="Contoh: Harga, RAM, Kapasitas Storage, Berat"
                        register={register}
                        error={errors.name?.message}
                        helperText="* Label spesifikasi laptop yang mudah dibaca oleh pengguna di antarmuka sistem."
                    />

                    {/* 3. Tipe Atribut (type) */}
                    {/* 3. Tipe Atribut (type) */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <InputSelect
                            label="Tipe Atribut *"
                            nama="type"
                            options={[
                                { value: "benefit", label: "Benefit" },
                                { value: "cost", label: "Cost" },
                            ]}
                            placeholder=""
                            register={register}
                            error={errors.type?.message}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/admin/criterias")}
                            label="Batal"
                            className="text-xs! py-2.5 px-6 rounded-xl cursor-pointer"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            icon={<Save className="w-4 h-4" />}
                            label={isSubmitting ? "Menyimpan..." : "Simpan Kriteria"}
                            disabled={isSubmitting}
                            className="text-xs py-2.5 px-6 rounded-xl font-bold shadow-md cursor-pointer"
                        />
                    </div>
                </form>

            </div>

        </div>
    );
}
