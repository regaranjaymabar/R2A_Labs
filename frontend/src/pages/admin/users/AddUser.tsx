import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../../components/ui/common/Button";
import { InputText } from "../../../components/ui/common/InputText";
import { InputSearchSelect } from "../../../components/ui/common/InputSearchSelect";
import { storeService } from "../../../services/storeService";
import { useAddUser } from "./hooks/useAddUser";
import { InputPassword } from "../../../components/ui/common/InputPassword";

export default function AddUser() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    isActive,
    selectedRole,
  } = useAddUser();

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: () => storeService.getAll(),
  });

  const storeOptions = stores.map((s) => ({
    value: s.id,
    label: `${s.name} - ${s.city || s.address || "Cabang"}`,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER HALAMAN */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>Registrasi Akun Pengguna</span>
            </h1>
          </div>
        </div>

        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pengguna</span>
        </Link>
      </div>

      {/* 2. KARTU FORM UTAMA */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="h-2 bg-linear-to-r from-purple-600 to-blue-600"></div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* SECTION 1: IDENTITAS & KREDENSIAL AKUN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Identitas & Penempatan Toko</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <InputText
                  label="Nama Lengkap *"
                  nama="name"
                  register={register}
                  error={errors.name?.message}
                />
              </div>

              <div className="md:col-span-1">
                <InputText
                  label="Alamat Email *"
                  nama="email"
                  type="email"
                  register={register}
                  error={errors.email?.message}
                />
              </div>

              <div className="md:col-span-1">
                <InputPassword
                  label="Password *"
                  nama="password"
                  register={register}
                  error={errors.password?.message}
                />
              </div>

              <div className="md:col-span-1">
                <InputSearchSelect
                  label="Penempatan Cabang Toko *"
                  name="storeId"
                  control={control}
                  options={storeOptions}
                  error={errors.storeId?.message}
                  placeholder="Cari atau pilih cabang toko..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PEMBAGIAN PERAN (ROLE MANAGEMENT) */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Pembagian Peran (Role)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                [
                  { id: "admin", label: "Admin Toko / Staff", desc: "Mengelola stok & harga cabang", color: "blue" },
                  { id: "superadmin", label: "Super Admin", desc: "Kontrol penuh sistem SPK", color: "purple" },
                  { id: "user", label: "User Biasa", desc: "Konsumen pencari laptop", color: "gray" },
                ] as const
              ).map((roleOpt) => {
                const isSelected = selectedRole === roleOpt.id;
                return (
                  <button
                    key={roleOpt.id}
                    type="button"
                    onClick={() => setValue("role", roleOpt.id, { shouldValidate: true })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? roleOpt.color === "purple"
                          ? "bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20 shadow-md"
                          : roleOpt.color === "blue"
                          ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-md"
                          : "bg-gray-100 border-gray-400 text-gray-900 ring-2 ring-gray-400/20 shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:opacity-100 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 font-bold text-sm">
                      <span>{roleOpt.label}</span>
                    </div>
                    <span className="text-xs opacity-80 mt-2 block leading-relaxed">
                      {roleOpt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: STATUS AKSES AKUN */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold text-black">
              <span>Status Akses Akun</span>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-4">
              <div>
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <span>Status Akun</span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => setValue("is_active", !isActive, { shouldValidate: true })}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <Link
              to="/admin/users"
              className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 transition-all text-center cursor-pointer"
            >
              Batal
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              label={isSubmitting ? "Menyimpan..." : "Daftarkan Pengguna"}
              className="py-3! px-6! rounded-xl! font-bold! shadow-lg cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
