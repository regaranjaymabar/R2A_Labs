import { api } from "../lib/axios";
import type { ProductCriteria, ProductWeightFormData } from "../types/productWeight";
import type { ApiResponse } from "../types/api";

export const productWeightService = {
  getAll: async (): Promise<ProductCriteria[]> => {
    // Mengambil data dari /api/superadmin/products yang memuat array productCriteria
    const response = await api.get<ApiResponse<any[]>>("/api/superadmin/products");
    const products = response.data.data || [];
    const allWeights: ProductCriteria[] = [];

    for (const prod of products) {
      const criteriaList = prod.productCriteria || [];
      for (const pc of criteriaList) {
        allWeights.push({
          id: pc.id,
          product_id: prod.id,
          product_name: prod.modelName || prod.name || `Laptop #${prod.id}`,
          criteria_id: pc.subCriteria?.criteria?.id || pc.subCriteria?.criteriaId || 0,
          sub_criteria_id: pc.subCriteriaId || pc.subCriteria?.id || 0,
          sub_criteria_description: pc.subCriteria?.description || "-",
          value_numeric: Number(pc.subCriteria?.valueNumeric ?? 0),
          created_at: prod.createdAt,
          criteria_code: pc.subCriteria?.criteria?.code || `C${pc.subCriteria?.criteriaId || ""}`,
          criteria_name: pc.subCriteria?.criteria?.name || "Kriteria",
        });
      }
    }

    return allWeights;
  },

  getById: async (id: number | string): Promise<ProductCriteria> => {
    const all = await productWeightService.getAll();
    return all.find((item) => String(item.id) === String(id)) as ProductCriteria;
  },

  create: async (payload: ProductWeightFormData): Promise<any> => {
    // Bisa disesuaikan saat menambahkan mapping bobot
    const response = await api.post("/api/superadmin/products", payload);
    return response.data;
  },

  update: async (id: number | string, payload: ProductWeightFormData): Promise<any> => {
    const response = await api.put(`/api/superadmin/products/${id}`, payload);
    return response.data;
  },

  delete: async (id: number | string): Promise<any> => {
    // 1. Cari apakah ID merupakan id dari ProductCriteria untuk menemukan product_id yang relevan
    const all = await productWeightService.getAll();
    const found = all.find((item) => String(item.id) === String(id));
    const targetProductId = found ? found.product_id : id;

    // 2. Kosongkan seluruh mapping bobot kriteria (subCriteriaIds: []) untuk produk tersebut di database
    const response = await api.put(`/api/superadmin/products/${targetProductId}`, {
      subCriteriaIds: [],
    });
    return response.data;
  },
};
