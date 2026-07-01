import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

// import AdminHeader from "../components/admin/AdminHeader"; (nanti kalau buat Header)

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
         {/* <AdminHeader /> */}
         
         {/* Konten Halaman akan muncul di sini (menyesuaikan URL) */}
         <main className="p-6 flex-1">
            <Outlet />
         </main>
      </div>
    </div>
  );
}
