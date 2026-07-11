import { api } from "../lib/axios";
import type { ProductStore } from "../types/productStore";

export const productStoreService = {
    
    // 1. Ambil inventaris toko milik admin yang login (GET /api/admin/inventory/my-store)
    getAll: async (): Promise<ProductStore[]> => {
        const response = await api.get("/api/admin/inventory/my-store");
        return response.data.data || response.data || [];
    },

    // 2. Ambil detail inventaris berdasarkan ID
    getById: async (id: number | string): Promise<ProductStore> => {
        const response = await api.get("/api/admin/inventory/my-store");
        const list = response.data.data || response.data || [];
        return list.find((item: any) => String(item.id) === String(id));
    },

    // 3. Ambil master produk global untuk pilihan dropdown tambah stok (GET /api/admin/inventory/global-products)
    getGlobalProducts: async (): Promise<any[]> => {
        const response = await api.get("/api/admin/inventory/global-products");
        return response.data.data || response.data || [];
    },

    // 4. Tambah produk ke inventaris toko (POST /api/admin/inventory/add)
    create: async (payload: any): Promise<any> => {
        const formattedPayload = {
            productId: payload.product_id || (payload as any).productId,
            price: Number(payload.price),
            stock: Number(payload.stock),
            isAvailable: payload.is_available ? 1 : 0,
        };
        const response = await api.post("/api/admin/inventory/add", formattedPayload);
        return response.data.data || response.data;
    },

    // 5. Update harga, stok, atau ketersediaan (PUT /api/admin/inventory/:id)
    update: async (id: number | string, payload: any): Promise<any> => {
        const formattedPayload = {
            price: Number(payload.price),
            stock: Number(payload.stock),
            isAvailable: payload.isAvailable !== undefined ? Number(payload.isAvailable) : (payload.is_available ? 1 : 0),
        };
        const response = await api.put(`/api/admin/inventory/${id}`, formattedPayload);
        return response.data.data || response.data;
    },

    // 6. Hapus item dari inventaris toko (DELETE /api/admin/inventory/:id)
    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/api/admin/inventory/${id}`);
        return response.data;
    },
};
