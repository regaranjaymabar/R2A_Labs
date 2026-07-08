import { api } from "../lib/axios";
import type { SubCriteriaFormData } from "../pages/admin/subcriterias/hooks/useAddSubCriteria";
import type { SubCriteria } from "../types/subCriteria";


export const subCriteriaService = {

    getAll: async (): Promise<SubCriteria[]> => {
        const response = await api.get<SubCriteria[]>("/subcriterias");
        return response.data;
    },

    getById: async (id: number | string): Promise<SubCriteria> => {
        const response = await api.get<SubCriteria>(`/subcriterias/${id}`);
        return response.data;

    },

    create: async (payload: SubCriteriaFormData): Promise<any> => {
        const response = await api.post("/subcriterias", payload);
        return response.data
    },

    update: async (id: number | string, payload: SubCriteriaFormData): Promise<any> => {
        const response = await api.put(`/subcriterias/${id}`, payload);
        return response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/subcriterias/${id}`);
        return response.data;
    },

} 