
import { api } from "../lib/axios";
import { type ProductStoreFormData } from "../pages/admin/productstores/hooks/useAddProductStore";
import type { ProductStore } from "../types/productStore";



export const productStoreService = {
    
    getAll: async (): Promise<ProductStore[]> => {
        const response = await api.get<ProductStore[]>("/productstores");
        return response.data;
    },

    getById: async (id: number | string): Promise<ProductStore> => {
        const response = await api.get<ProductStore>(`/productstores/${id}`);
        return response.data;

    },

    create: async (payload: ProductStoreFormData): Promise<any> => {
        const response = await api.post("/productstores", payload);
        return response.data
    },

    update: async (id: number | string, payload: ProductStoreFormData): Promise<any> => {
        const response = await api.put(`/productstores/${id}`, payload);
        return response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/productstores/${id}`);
        return response.data;
    },

} 