import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tambah Kriteria Baru
                        </h1>
                    </div>
                </div>

                <Link
                    to="/admin/criterias"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </Link>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="h-2 bg-black"></div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-semibold text-gray-500">
                                Preview:
                            </span>
                            <span className="text-sm font-bold font-mono text-gray-900 px-2.5 py-1 bg-white rounded-lg border border-gray-200 shadow-2xs">
                                [{codeVal}] {nameVal}
                            </span>
                        </div>
                        <div>
                            {selectedType === "benefit" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    benefit
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                                    cost
                                </span>
                            )}
                        </div>
                    </div>

                    <InputText
                        label="Kode Kriteria"
                        nama="code"
                        register={register}
                        error={errors.code?.message}
                        helperText="* Digunakan sebagai identitas kolom unik pada tabel perhitungan dan matriks keputusan."
                    />

                    <InputText
                        label="Nama Kriteria"
                        nama="name"
                        register={register}
                        error={errors.name?.message}
                        helperText="* Label spesifikasi laptop yang mudah dibaca oleh pengguna di antarmuka sistem."
                    />

                    <div className="pt-2 border-t border-gray-100">
                        <InputSelect
                            label="Tipe Atribut *"
                            nama="type"
                            options={[
                                { value: "benefit", label: "Benefit" },
                                { value: "cost", label: "Cost" },
                            ]}
                            register={register}
                            error={errors.type?.message}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
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
