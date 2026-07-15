import { api } from "../lib/axios";
import type { ProductStore } from "../types/productStore";
import { storeLogger } from "../utils/storeLogger";
import { useAuthStore } from "../store/useAuthStore";

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
        
        try {
            const storeId = (useAuthStore.getState().user as any)?.store?.id || "default";
            let title = payload.productName ? `Tambah Inventaris: ${payload.productName}` : "Menambahkan Laptop Baru";
            let desc = `${payload.specs ? payload.specs + " — " : ""}Harga: Rp ${formattedPayload.price.toLocaleString("id-ID")} (Stok: ${formattedPayload.stock} Unit)`;
            
            if (!payload.productName) {
                try {
                    const globalProducts = await productStoreService.getGlobalProducts();
                    const found = globalProducts.find((p: any) => Number(p.id) === Number(formattedPayload.productId));
                    if (found) {
                        const brandName = found.brand?.name || found.brand_name || "";
                        const modelName = found.modelName || found.name || found.model_name || `Produk #${found.id}`;
                        title = `Tambah Inventaris: ${[brandName, modelName].filter(Boolean).join(" ")}`;
                        const specs = [found.processor, found.ram, found.storage].filter(Boolean).join(" • ");
                        if (specs) desc = `${specs} — Harga: Rp ${formattedPayload.price.toLocaleString("id-ID")} (Stok: ${formattedPayload.stock} Unit)`;
                    }
                } catch (_) {}
            }

            storeLogger.addLog(title, desc, "add", storeId);
        } catch (e) {
            console.error("Log error:", e);
        }

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
        
        try {
            const storeId = (useAuthStore.getState().user as any)?.store?.id || "default";
            let title = payload.productName ? `Update Inventaris: ${payload.productName}` : "Memperbarui Stok & Harga";
            let desc = `${payload.specs ? payload.specs + " — " : ""}Harga: Rp ${formattedPayload.price.toLocaleString("id-ID")} (Stok: ${formattedPayload.stock} Unit • ${formattedPayload.isAvailable ? "Tersedia" : "Nonaktif"})`;

            if (!payload.productName) {
                try {
                    const item = await productStoreService.getById(id);
                    if (item) {
                        const brandName = item.product?.brand?.name || item.brand_name || "";
                        const modelName = item.product?.modelName || item.product?.name || item.model_name || `Produk #${item.productId || id}`;
                        title = `Update Inventaris: ${[brandName, modelName].filter(Boolean).join(" ")}`;
                        const specs = [item.product?.processor || item.processor, item.product?.ram || item.ram, item.product?.storage || item.storage].filter(Boolean).join(" • ");
                        if (specs) desc = `${specs} — Harga: Rp ${formattedPayload.price.toLocaleString("id-ID")} (Stok: ${formattedPayload.stock} Unit • ${formattedPayload.isAvailable ? "Tersedia" : "Nonaktif"})`;
                    }
                } catch (_) {}
            }

            storeLogger.addLog(title, desc, "update", storeId);
        } catch (e) {
            console.error("Log error:", e);
        }

        return response.data.data || response.data;
    },

    // 6. Hapus item dari inventaris toko (DELETE /api/admin/inventory/:id)
    delete: async (id: number | string, itemTitle?: string): Promise<any> => {
        const response = await api.delete(`/api/admin/inventory/${id}`);
        
        try {
            const storeId = (useAuthStore.getState().user as any)?.store?.id || "default";
            const title = itemTitle ? `Hapus Inventaris: ${itemTitle.replace(/"/g, "")}` : "Menghapus Item Inventaris";
            storeLogger.addLog(
                title,
                `Menghapus item laptop dari daftar katalog toko cabang`,
                "delete",
                storeId
            );
        } catch (e) {
            console.error("Log error:", e);
        }

        return response.data;
    },
};

