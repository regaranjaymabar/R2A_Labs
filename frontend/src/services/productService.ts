
import { api } from "../lib/axios";
import { type Product } from "../pages/admin/products/ProductIndex";
import { type ProductFormData } from "../pages/admin/products/hooks/useAddProduct";


export const productService = {
    
    getAll: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>("/products");
        return response.data;
    },

    getById: async (id: number | string): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;

    },

    create: async (payload: ProductFormData): Promise<any> => {
        const response = await api.post("/products", payload);
        return response.data
    },

    update: async (id: number | string, payload: ProductFormData): Promise<any> => {
        const response = await api.put(`/products/${id}`, payload);
        return response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

} 