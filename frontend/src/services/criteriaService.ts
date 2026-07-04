import { api } from "../lib/axios";
import type { CriteriaFormData } from "../pages/admin/criterias/hooks/useAddCriteria";
import type { Criteria } from "../pages/admin/criterias/CriteriaIndex";

export const criteriaService = {
  getAll: async (): Promise<Criteria[]> => {
    const response = await api.get<Criteria[]>("/criterias");
    return response.data;
  },

  getById: async (id: number | string): Promise<Criteria> => {
    const response = await api.get<Criteria>(`/criterias/${id}`);
    return response.data;
  },

  create: async (payload: CriteriaFormData): Promise<any> => {
    const response = await api.post("/criterias", payload);
    return response.data;
  },

  update: async (id: number | string, payload: CriteriaFormData): Promise<any> => {
    const response = await api.put(`/criterias/${id}`, payload);
    return response.data;
  },

  delete: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/criterias/${id}`);
    return response.data;
  },
};
