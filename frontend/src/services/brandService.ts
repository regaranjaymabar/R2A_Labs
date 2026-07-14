import { api } from "../lib/axios";
import type { Brand, BrandFormData } from "../types/brand";

export const brandService = {

  // Read All Brands: GET /api/superadmin/brands
  getAll: async (): Promise<Brand[]> => {
    const response = await api.get("/api/superadmin/brands");
    return response.data.data || response.data;
  },

  
  getById: async (id: number | string): Promise<Brand> => {
    const response = await api.get(`/api/superadmin/brands/${id}`);
    return response.data.data || response.data;
  },

  
  create: async (payload: BrandFormData): Promise<any> => {
    const response = await api.post("/api/superadmin/brands", payload);
    return response.data.data || response.data;
  },

 
  update: async (id: number | string, payload: BrandFormData): Promise<any> => {
    const response = await api.put(`/api/superadmin/brands/${id}`, payload);
    return response.data.data || response.data;
  },


  delete: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/api/superadmin/brands/${id}`);
    return response.data;
  },
};
