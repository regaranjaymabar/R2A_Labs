import { api } from "../lib/axios";
import type { ProductWeightFormData } from "../pages/admin/productweights/hooks/useAddProductWeight";
import type { ProductWeight } from "../types/productWeight";



export const productWeightService = {
  getAll: async (): Promise<ProductWeight[]> => {
    const response = await api.get<ProductWeight[]>("/productweights");
    return response.data;
  },

  getById: async (id: number | string): Promise<ProductWeight> => {
    const response = await api.get<ProductWeight>(`/productweights/${id}`);
    return response.data;
  },

  create: async (payload: ProductWeightFormData): Promise<any> => {
    const response = await api.post("/productweights", payload);
    return response.data;
  },

  update: async (id: number | string, payload: ProductWeightFormData): Promise<any> => {
    const response = await api.put(`/productweights/${id}`, payload);
    return response.data;
  },

  delete: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/productweights/${id}`);
    return response.data;
  },
};
