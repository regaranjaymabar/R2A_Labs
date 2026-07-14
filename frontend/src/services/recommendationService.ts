import { api } from "../lib/axios";
import type { RecommendationRequest } from "../types/recomendation";
import type { ApiResponse } from "../types/api";

export const recommendationService = {
  getAll: async (): Promise<RecommendationRequest[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>("/api/superadmin/recommendations");
      return response.data.data || [];
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  getById: async (id: number | string): Promise<RecommendationRequest> => {
    const response = await api.get<ApiResponse<any>>(`/api/superadmin/recommendations/${id}`);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/api/superadmin/recommendations/${id}`);
    return response.data;
  },
};
