import { api } from "../lib/axios";
import type { RecommendationRequest } from "../types/recomendation";

export const recommendationService = {
  getAll: async (): Promise<RecommendationRequest[]> => {
    const response = await api.get<RecommendationRequest[]>("/recommendations");
    return response.data;
  },

  getById: async (id: number | string): Promise<RecommendationRequest> => {
    const response = await api.get<RecommendationRequest>(`/recommendations/${id}`);
    return response.data;
  },

  delete: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/recommendations/${id}`);
    return response.data;
  },
};
