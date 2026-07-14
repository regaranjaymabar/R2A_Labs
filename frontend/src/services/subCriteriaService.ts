import { api } from "../lib/axios";
import type { SubCriteria } from "../types/subCriteria";
import type { ApiResponse } from "../types/api";

function extractNumericValue(sub: any): number {
  if (!sub || typeof sub !== "object") return 0;
  const directCandidate =
    sub.valueNumeric ??
    sub.value_numeric ??
    sub.numericValue ??
    sub.numeric_value ??
    sub.value ??
    sub.bobot ??
    sub.weight ??
    sub.nilai ??
    sub.score;

  if (directCandidate !== undefined && directCandidate !== null) {
    const num = Number(directCandidate);
    if (!isNaN(num)) return num;
  }

  for (const key of Object.keys(sub)) {
    if (/val|num|bobot|weight|score|nilai/i.test(key) && key !== "criteriaId" && key !== "criteria_id") {
      const num = Number(sub[key]);
      if (!isNaN(num)) return num;
    }
  }
  return 0;
}

export const subCriteriaService = {
  getAll: async (): Promise<SubCriteria[]> => {
    
    // Mengambil dari /api/superadmin/criteria yang memuat seluruh kriteria beserta array subCriteria di dalamnya
    const response = await api.get<ApiResponse<any[]>>("/api/superadmin/criteria");
    const criteriaList = response.data.data || [];
    const allSubCriterias: SubCriteria[] = [];

    for (const crit of criteriaList) {
      const subs = crit.subCriteria || [];
      for (const sub of subs) {
        const numVal = extractNumericValue(sub);
        allSubCriterias.push({
          ...sub,
          value_numeric: numVal,
          valueNumeric: numVal,
          created_at: sub.createdAt || sub.created_at || "-",
          createdAt: sub.createdAt || sub.created_at || "-",
          criteria_id: crit.id,
          criteriaId: crit.id,
          criteria_code: crit.code,
          criteria_name: crit.name,
          criteria_type: crit.type,
        });
      }
    }

    return allSubCriterias;
  },

  getByCriteriaId: async (criteriaId: number | string): Promise<SubCriteria[]> => {
    const response = await api.get<ApiResponse<SubCriteria[]>>(
      `/api/superadmin/sub-criteria/criteria/${criteriaId}`
    );
    const list = response.data.data || [];
    return list.map((sub: any) => {
      const numVal = extractNumericValue(sub);
      return {
        ...sub,
        value_numeric: numVal,
        valueNumeric: numVal,
        created_at: sub.createdAt || sub.created_at || "-",
        createdAt: sub.createdAt || sub.created_at || "-",
      };
    });
  },

  getById: async (id: number | string): Promise<SubCriteria> => {
    const response = await api.get<ApiResponse<SubCriteria>>(`/api/superadmin/sub-criteria/${id}`);
    return response.data.data;
  },

  create: async (payload: any): Promise<SubCriteria> => {
    const apiPayload = {
      criteriaId: Number(payload.criteriaId ?? payload.criteria_id),
      description: payload.description,
      valueNumeric: Number(payload.valueNumeric ?? payload.value_numeric),
    };
    const response = await api.post<ApiResponse<SubCriteria>>("/api/superadmin/sub-criteria", apiPayload);
    return response.data.data;
  },

  update: async (id: number | string, payload: any): Promise<SubCriteria> => {
    const apiPayload = {
      description: payload.description,
      valueNumeric: Number(payload.valueNumeric ?? payload.value_numeric),
    };
    const response = await api.put<ApiResponse<SubCriteria>>(`/api/superadmin/sub-criteria/${id}`, apiPayload);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/api/superadmin/sub-criteria/${id}`);
  },
};