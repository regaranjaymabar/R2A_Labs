import { api } from "../lib/axios";
import { type Brand } from "../pages/admin/brands/BrandIndex";
import { type BrandFormData } from "../pages/admin/brands/hooks/useAddBrand";

export const brandService = {
  // Read All Brands: GET /brands
  getAll: async (): Promise<Brand[]> => {
    const response = await api.get<Brand[]>("/brands");
    return response.data;
  },

  // Read Single Brand: GET /brands/:id
  getById: async (id: number | string): Promise<Brand> => {
    const response = await api.get<Brand>(`/brands/${id}`);
    return response.data;
  },

  // Create New Brand: POST /brands
  create: async (payload: BrandFormData): Promise<any> => {
    const response = await api.post("/brands", payload);
    return response.data;
  },

  // Update Brand: PUT /brands/:id
  update: async (id: number | string, payload: BrandFormData): Promise<any> => {
    const response = await api.put(`/brands/${id}`, payload);
    return response.data;
  },

  // Delete Brand: DELETE /brands/:id
  delete: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};
