import { api } from "../../lib/axios";

export const catalogService = {
  async getCatalog(search?: string) {
    const response = await api.get("/api/customer/catalog", {
      params: {
        search,
      },
    });

    return response.data.data;
  },

  async getDetail(id: number) {
    const response = await api.get(`/api/customer/catalog/${id}`);

    return response.data.data;
  },
};