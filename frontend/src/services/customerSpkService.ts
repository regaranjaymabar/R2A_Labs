import { api } from "../lib/axios";
import type { ApiResponse } from "../types/api";

export interface SpkWeightInput {
  criteriaId: number;
  weight: number;
}

export interface SpkRequestPayload {
  kebutuhan: string;
  budgetMin: number;
  budgetMax: number;
  userLat?: number | null;
  userLng?: number | null;
  weights: SpkWeightInput[];
}

export interface CustomerSpkRequest {
  id: number;
  customerId: number;
  kebutuhan: string;
  budgetMin: number;
  budgetMax: number;
  status: string;
  userLat: string | null;
  userLng: string | null;
  createdAt: string;
  recommendationWeights?: any[];
  recommendationResults?: any[];
  calculationDetails?: any;
}

export const customerSpkService = {
  createRequest: async (payload: SpkRequestPayload): Promise<CustomerSpkRequest> => {
    const response = await api.post<ApiResponse<CustomerSpkRequest>>("/api/customer/spk/requests", payload);
    return response.data.data;
  },

  getMyRequests: async (): Promise<CustomerSpkRequest[]> => {
    const response = await api.get<ApiResponse<CustomerSpkRequest[]>>("/api/customer/spk/requests");
    return response.data.data || [];
  },

  getRequestDetails: async (id: number | string): Promise<CustomerSpkRequest> => {
    const response = await api.get<ApiResponse<CustomerSpkRequest>>(`/api/customer/spk/requests/${id}`);
    return response.data.data;
  },
};
