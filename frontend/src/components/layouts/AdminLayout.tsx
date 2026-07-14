import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <AdminSidebar />
      <div className="flex-1 min-w-0 w-full flex flex-col sm:ml-64 transition-all duration-300">
         <AdminHeader />
         <main className="p-4 sm:p-6 flex-1 min-w-0 w-full">
            <Outlet />
         </main>
      </div>
    </div>
  );
}
