import { api } from "../lib/axios";
import type { ApiResponse } from "../types/api";

export interface CustomerProfileData {
    id?: number;
    name: string;
    email: string;
    password?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    createdAt?: string;
}

export const customerProfileService = {
    // 1. Ambil profil pelanggan (GET /api/customer/profile)
    getProfile: async (): Promise<CustomerProfileData> => {
        const response = await api.get<ApiResponse<CustomerProfileData>>("/api/customer/profile");
        return response.data.data;
    },

    // 2. Update profil pelanggan (PUT /api/customer/profile)
    updateProfile: async (payload: Partial<CustomerProfileData>): Promise<CustomerProfileData> => {
        const response = await api.put<ApiResponse<CustomerProfileData>>("/api/customer/profile", payload);
        return response.data.data;
    },
};
