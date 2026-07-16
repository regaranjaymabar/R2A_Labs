import { api } from "../lib/axios";
import type { Criteria } from "../types/criteria";

export const criteriaCustomerService = {
  getAll: async (): Promise<Criteria[]> => {
    const response = await api.get("/api/customer/criteria");
    return response.data.data || [];
  },
};