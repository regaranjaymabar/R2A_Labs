import { api } from "../lib/axios";
import type { Store, StoreFormData } from "../types/store";
import type { ApiResponse } from "../types/api";

export const storeService = {
    getAll: async (): Promise<Store[]> => {
        const response = await api.get<ApiResponse<Store[]>>("/api/superadmin/stores");
        return response.data.data || [];
    },

    getById: async (id: number | string): Promise<Store> => {
        const response = await api.get<ApiResponse<Store>>(`/api/superadmin/stores/${id}`);
        return response.data.data;
    },

    create: async (payload: StoreFormData): Promise<Store> => {
        const formattedPayload = {
            ...payload,
            isActive: payload.is_active ? 1 : 0,
        };
        const response = await api.post<ApiResponse<Store>>("/api/superadmin/stores", formattedPayload);
        return response.data.data;
    },

    update: async (id: number | string, payload: StoreFormData): Promise<Store> => {
        const formattedPayload = {
            ...payload,
            isActive: payload.is_active ? 1 : 0,
        };
        const response = await api.put<ApiResponse<Store>>(`/api/superadmin/stores/${id}`, formattedPayload);
        return response.data.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/api/superadmin/stores/${id}`);
    },
};