import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Ban
} from "lucide-react";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSearchSelect } from "../../../components/ui/common/InputSearchSelect";
import { TextArea } from "../../../components/ui/common/TextArea";
import { useAddStore } from "./hooks/useAddStore";
import { useIndonesianCities } from "../../../hooks/useIndonesianCities";

export default function AddStore() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, setValue, errors, isSubmitting, isActive } =
    useAddStore();
  const { data: cities = [], isLoading: isCitiesLoading } = useIndonesianCities();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Tambah Cabang Toko Baru</span>
            </h1>
          </div>
        </div>

        <Link
          to="/admin/stores"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Toko</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      
        <div className="h-2 bg-black"></div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Identitas & Kontak Operasional Toko</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-1">
                <InputText
                  label="Nama Toko / Cabang *"
                  nama="name"
                  register={register}
                  error={errors.name?.message}
                  helperText="* Identitas resmi cabang toko fisik yang mudah dikenali."
                />
              </div>

              <div className="md:col-span-1">
                <InputText
                  label="Nomor Telepon / WhatsApp *"
                  nama="phone"
                  register={register}
                  error={errors.phone?.message}
                  helperText="* Kontak resmi operasional cabang untuk pembeli dan admin pusat."
                />
              </div>

              <div className="md:col-span-2">
                <InputSearchSelect
                  label="Kota / Wilayah Toko *"
                  name="city"
                  control={control}
                  options={cities}
                  isLoading={isCitiesLoading}
                  error={errors.city?.message}
                  helperText="* Pilihan Wilayah Indonesia (Ketik nama kota/kabupaten)."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Alamat Lengkap Lokasi Fisik</span>
            </div>

            <TextArea
              label="Alamat Lengkap"
              nama="address"
              rows={4}
              register={register}
              error={errors.address?.message}
              helperText="* Petunjuk lokasi fisik toko (jalan, nomor gedung/lantai, RT/RW, dan patokan lingkungan) agar pembeli mudah berkunjung."
            />
          </div>

         
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-900 items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Status Operasional Cabang</span>
              </span>
              <span className="text-xs font-mono text-emerald-600 font-bold mt-1 block">
                Default: Aktif (true)
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           
              <button
                type="button"
                onClick={() =>
                  setValue("is_active", true, { shouldValidate: true })
                }
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  isActive
                    ? "bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-gray-50 border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {isActive && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <span
                    className={`block font-bold text-sm ${
                      isActive
                        ? "text-emerald-900"
                        : "text-gray-700"
                    }`}
                  >
                    Beroperasi
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("is_active", false, { shouldValidate: true })
                }
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  !isActive
                    ? "bg-red-50/80 border-red-500 shadow-md ring-2 ring-red-500/20"
                    : "bg-gray-50 border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                    !isActive
                      ? "bg-red-500 text-white shadow-xs"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {!isActive && <Ban className="w-4 h-4" />}
                </div>
                <div>
                  <span
                    className={`block font-bold text-sm ${
                      !isActive
                        ? "text-red-900"
                        : "text-gray-700"
                    }`}
                  >
                    Tidak Beroperasi
                  </span>
                </div>
              </button>
            </div>
          </div>

     
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/stores")}
              label="Batal"
              className="px-5! py-2.5! rounded-xl! text-xs! font-bold! cursor-pointer!"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              label={isSubmitting ? "Menyimpan Toko..." : "Simpan Toko Baru"}
              className="text-sm! py-2.5! px-6! rounded-xl font-bold shadow-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
