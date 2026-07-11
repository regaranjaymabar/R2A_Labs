
import { api } from "../lib/axios";
import type { Product, ProductFormData } from "../types/product";
import type { ApiResponse } from "../types/api";


export const productService = {

    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get<ApiResponse<Product[]>>("/api/superadmin/products");
            return response.data.data || [];
        } catch (error) {
            const response = await api.get<ApiResponse<Product[]>>("/api/customer/catalog");
            return response.data.data || [];
        }
    },

    getById: async (id: number | string): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/api/superadmin/products/${id}`);
        return response.data.data;
    },

    create: async (payload: ProductFormData): Promise<any> => {
        const cleanPayload = {
            ...payload,
            releaseYear: String(payload.releaseYear || "").slice(0, 4),
        };
        const response = await api.post("/api/superadmin/products", cleanPayload);
        return response.data.data || response.data;
    },

    update: async (id: number | string, payload: any): Promise<any> => {
        const cleanPayload = { ...payload };
        if (cleanPayload.releaseYear) {
            cleanPayload.releaseYear = String(cleanPayload.releaseYear).slice(0, 4);
        } else {
            delete cleanPayload.releaseYear;
        }
        const response = await api.put(`/api/superadmin/products/${id}`, cleanPayload);
        return response.data.data || response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/api/superadmin/products/${id}`);
        return response.data.data || response.data
    },

} 