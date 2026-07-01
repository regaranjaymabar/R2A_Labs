import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Logo atau Nama Team di Bagian Atas Form */}
                <div className="flex flex-col items-center justify-center mb-4 text-center">
                    {/* Jika punya gambar logo, aktifkan tag img di bawah ini: */}
                    {/* <img src="" alt="logo/nama team" className="h-12 object-contain mb-2" /> */}
                    
                    <div className="font-bold text-2xl tracking-wider text-gray-900">
                        R2A LABS
                    </div>
                </div>

                {/* Form Login / Register */}
                <Outlet />
            </div>
        </div>
    );
}