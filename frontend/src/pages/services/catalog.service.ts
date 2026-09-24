import { api } from "../../lib/axios";
import type { Product } from "../../types/catalog";

export const catalogService = {
  async getCatalog(search?: string): Promise<Product[]> {
    const response = await api.get<{ data: Product[] }>("/api/customer/catalog", {
      params: {
        search,
      },
    });

    return response.data.data;
  },

  async getDetail(id: number): Promise<Product> {
    const response = await api.get<{ data: Product }>(`/api/customer/catalog/${id}`);

    return response.data.data;
  },
};