
import { api } from "../lib/axios";
import type { StoreFormData } from "../pages/admin/stores/hooks/useAddStore";

import type { Store } from "../pages/admin/stores/StoreIndex";


export const storeService = {

    getAll: async (): Promise<Store[]> => {
        const response = await api.get<Store[]>("/stores");
        return response.data;
    },

    getById: async (id: number | string): Promise<Store> => {
        const response = await api.get<Store>(`/stores/${id}`);
        return response.data;

    },

    create: async (payload: StoreFormData): Promise<any> => {
        const response = await api.post("/stores", payload);
        return response.data
    },

    update: async (id: number | string, payload: StoreFormData): Promise<any> => {
        const response = await api.put(`/stores/${id}`, payload);
        return response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/stores/${id}`);
        return response.data;
    },

} 