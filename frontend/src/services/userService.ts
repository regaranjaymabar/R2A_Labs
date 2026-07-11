import { api } from "../lib/axios";
import type { UserData, UserFormData } from "../types/user";
import type { ApiResponse } from "../types/api";

export const userService = {
    getAll: async (): Promise<UserData[]> => {
        const response = await api.get<ApiResponse<UserData[]>>("/api/superadmin/users");
        return response.data.data || [];
    },

    getById: async (id: number | string): Promise<UserData> => {
        const response = await api.get<ApiResponse<UserData>>(`/api/superadmin/users/${id}`);
        return response.data.data;
    },

    create: async (payload: UserFormData): Promise<UserData> => {
        const response = await api.post<ApiResponse<UserData>>("/api/superadmin/users", payload);
        return response.data.data;
    },

    update: async (id: number | string, payload: Partial<UserFormData>): Promise<UserData> => {
        const response = await api.put<ApiResponse<UserData>>(`/api/superadmin/users/${id}`, payload);
        return response.data.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/api/superadmin/users/${id}`);
    },
};