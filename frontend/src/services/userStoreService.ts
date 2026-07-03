import { api } from "../lib/axios";
import type { UserStoreFormData } from "../pages/admin/userstores/hooks/useAddUserStore";
import type { UserStoreAccess } from "../pages/admin/userstores/ManageAccess";

export const userStoreService = {

    getAll: async (): Promise<UserStoreAccess[]> => {
        const response = await api.get<UserStoreAccess[]>("/userstores");
        return response.data;
    },

    getById: async (id: number | string): Promise<UserStoreAccess> => {
        const response = await api.get<UserStoreAccess>(`/userstores/${id}`);
        return response.data;
    },

    create: async (payload: UserStoreFormData): Promise<any> => {
        const response = await api.post("/userstores", payload);
        return response.data
    },

    update: async (id: number | string, payload: UserStoreFormData): Promise<any> => {
        const response = await api.put(`/userstores/${id}`, payload);
        return response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/userstores/${id}`);
        return response.data;
    },

} 