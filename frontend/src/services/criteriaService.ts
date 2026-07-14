import { api } from "../lib/axios";
import type { CriteriaFormData } from "../pages/admin/criterias/hooks/useAddCriteria";
import type { Criteria } from "../types/criteria";
import type { ApiResponse } from "../types/api";

export const criteriaService = {
  getAll: async (): Promise<Criteria[]> => {
    const response = await api.get<ApiResponse<Criteria[]>>("/api/superadmin/criteria");
    return response.data.data || [];
  },

  getById: async (id: number | string): Promise<Criteria> => {
    const response = await api.get<ApiResponse<Criteria>>(`/api/superadmin/criteria/${id}`);
    return response.data.data;
  },

  create: async (payload: CriteriaFormData): Promise<Criteria> => {
    const response = await api.post<ApiResponse<Criteria>>("/api/superadmin/criteria", payload);
    return response.data.data;
  },

  update: async (id: number | string, payload: Partial<CriteriaFormData & { weight?: number }>): Promise<Criteria> => {
    const response = await api.put<ApiResponse<Criteria>>(`/api/superadmin/criteria/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/api/superadmin/criteria/${id}`);
  },
};
