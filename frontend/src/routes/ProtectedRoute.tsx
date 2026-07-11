import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/admin/login",
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // 1. Jika belum login atau sesi tidak valid
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // 2. Jika ada batasan peran tertentu
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || "";
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <Outlet />;
}