import { api } from "../lib/axios";
import type { UserStoreAccess, UserStoreFormData } from "../types/userStore";
import type { ApiResponse } from "../types/api";

export const userStoreService = {
  getAll: async (): Promise<UserStoreAccess[]> => {
    const response = await api.get<ApiResponse<any[]>>("/api/superadmin/users");
    const users = response.data.data || [];
    return users
      .filter((u: any) => u.role === "admin" || u.role === "store_admin" || u.storeId || u.store)
      .map((u: any) => {
        const storeId = u.storeId || u.store?.id || 0;
        return {
          id: u.id,
          user_id: u.id,
          user_name: u.name,
          user_email: u.email,
          store_id: storeId,
          store_name: u.store?.name || (storeId ? `Toko #${storeId}` : "Belum Ditugaskan"),
          store_city: u.store?.city || "-",
          is_active: Boolean(u.isActive ?? u.is_active ?? true),
          assigned_at: u.createdAt || u.created_at || "",
        };
      });
  },

  getById: async (id: number | string): Promise<UserStoreAccess> => {
    const response = await api.get<ApiResponse<any>>(`/api/superadmin/users/${id}`);
    const u = response.data.data || {};
    const storeId = u.storeId || u.store?.id || 0;
    return {
      id: u.id,
      user_id: u.id,
      user_name: u.name,
      user_email: u.email,
      store_id: storeId,
      store_name: u.store?.name || (storeId ? `Toko #${storeId}` : "Belum Ditugaskan"),
      store_city: u.store?.city || "-",
      is_active: Boolean(u.isActive ?? u.is_active ?? true),
      assigned_at: u.createdAt || u.created_at || "",
    };
  },

  create: async (payload: UserStoreFormData | any): Promise<any> => {
    const targetUserId = payload.userId || payload.user_id;
    const targetStoreId = payload.storeId || payload.store_id;
    const response = await api.put(`/api/superadmin/users/${targetUserId}`, {
      storeId: targetStoreId,
    });
    return response.data;
  },

  update: async (id: number | string, payload: UserStoreFormData | any): Promise<any> => {
    const targetStoreId = payload.storeId || payload.store_id;
    const response = await api.put(`/api/superadmin/users/${id}`, {
      storeId: targetStoreId,
    });
    return response.data;
  },

  delete: async (id: number | string): Promise<any> => {
    const response = await api.put(`/api/superadmin/users/${id}`, {
      storeId: null,
    });
    return response.data;
  },
}; 