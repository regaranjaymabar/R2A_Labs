import { api } from "../lib/axios";
import type { ApiResponse } from "../types/api";
import { storeLogger } from "../utils/storeLogger";
import { useAuthStore } from "../store/useAuthStore";

export interface StoreReportSummary {
    totalProducts: number;
    totalStock: number;
    avgPrice: number;
    availableCount: number;
    recommendationAppearances: number;
}

export interface StoreProfileData {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    isActive?: number;
    latitude?: number | string | null;
    longitude?: number | string | null;
}

export const storeAdminService = {
    // 1. Ambil summary laporan statistik toko (GET /api/admin/reports/summary)
    getSummary: async (): Promise<StoreReportSummary> => {
        const response = await api.get<ApiResponse<StoreReportSummary>>("/api/admin/reports/summary");
        return response.data.data || (response.data as any);
    },

    // 2. Ambil profil toko admin (GET /api/admin/store-profile)
    getProfile: async (): Promise<StoreProfileData> => {
        const response = await api.get<ApiResponse<StoreProfileData>>("/api/admin/store-profile");
        return response.data.data || (response.data as any);
    },

    // 3. Update profil toko admin (PUT /api/admin/store-profile)
    updateProfile: async (payload: Partial<StoreProfileData>): Promise<StoreProfileData> => {
        const response = await api.put<ApiResponse<StoreProfileData>>("/api/admin/store-profile", payload);
        const data = response.data.data || (response.data as any);
        try {
            const storeId = (useAuthStore.getState().user as any)?.store?.id || "default";
            storeLogger.addLog(
                "Memperbarui Profil Toko",
                `Data toko "${payload.name || data?.name || 'Toko'}" berhasil disimpan`,
                "profile",
                storeId
            );
        } catch (e) {
            console.error("Log error:", e);
        }
        return data;
    },
};

