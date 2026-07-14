
import { api } from "../lib/axios";
import type { Product, ProductFormData } from "../types/product";
import type { ApiResponse } from "../types/api";


export const productService = {

    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get<ApiResponse<Product[]>>("/api/superadmin/products");
            return response.data.data || [];
        } catch (error) {
            const response = await api.get<ApiResponse<Product[]>>("/api/customer/catalog");
            return response.data.data || [];
        }
    },

    getById: async (id: number | string): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/api/superadmin/products/${id}`);
        return response.data.data;
    },

    create: async (payload: ProductFormData): Promise<any> => {
        const batteryVal = payload.battery ? String(payload.battery).match(/[\d.]+/)?.[0] : "";
        const weightVal = payload.weight ? String(payload.weight).match(/[\d.]+/)?.[0] : "";

        const apiPayload = {
            // Snake Case (for store & relationships mapping)
            brands_id_brand: Number(payload.brandId ?? (payload as any).brands_id_brand ?? 1),
            stores_id_store: Number((payload as any).stores_id_store ?? 2),
            model_name: payload.modelName ?? (payload as any).model_name ?? "",
            screen_size: Number(payload.screenSize ?? (payload as any).screen_size ?? 0),
            processor: payload.processor,
            ram: payload.ram,
            storage: payload.storage,
            battery: batteryVal ? `${batteryVal}wh` : (payload.battery ? `${payload.battery}wh` : null),
            weight: weightVal ? `${weightVal}kg` : (payload.weight ? `${payload.weight}kg` : null),
            release_year: String(payload.releaseYear ?? (payload as any).release_year ?? "").slice(0, 4),
            price: Number((payload as any).price ?? 15000000),
            stock: Number((payload as any).stock ?? 10),
            is_available: Number((payload as any).is_available ?? (payload.is_active ? 1 : 0)),

            // Camel Case (for validation & specifications database)
            brandId: Number(payload.brandId ?? (payload as any).brands_id_brand ?? 1),
            storeId: Number((payload as any).storeId ?? (payload as any).stores_id_store ?? 2),
            modelName: payload.modelName ?? (payload as any).model_name ?? "",
            screenSize: Number(payload.screenSize ?? (payload as any).screen_size ?? 0),
            releaseYear: String(payload.releaseYear ?? (payload as any).release_year ?? "").slice(0, 4),
            subCriteriaIds: payload.subCriteriaIds ?? [],
        };

        const response = await api.post("/api/superadmin/products", apiPayload);
        return response.data.data || response.data;
    },

    update: async (id: number | string, payload: any): Promise<any> => {
        const cleanPayload = { ...payload };
        if (cleanPayload.releaseYear) {
            cleanPayload.releaseYear = String(cleanPayload.releaseYear).slice(0, 4);
        } else {
            delete cleanPayload.releaseYear;
        }

        const batteryVal = cleanPayload.battery ? String(cleanPayload.battery).match(/[\d.]+/)?.[0] : "";
        const weightVal = cleanPayload.weight ? String(cleanPayload.weight).match(/[\d.]+/)?.[0] : "";

        if (cleanPayload.battery !== undefined) {
            cleanPayload.battery = batteryVal ? `${batteryVal}wh` : null;
        }
        if (cleanPayload.weight !== undefined) {
            cleanPayload.weight = weightVal ? `${weightVal}kg` : null;
        }

        const response = await api.put(`/api/superadmin/products/${id}`, cleanPayload);
        return response.data.data || response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/api/superadmin/products/${id}`);
        return response.data.data || response.data
    },

} 