import { api } from "../lib/axios";
import type { UserFormData } from "../pages/admin/users/hooks/useAddUser";
import type { UserData } from "../pages/admin/users/UserIndex";



export const userService = {

    getAll: async (): Promise<UserData[]> => {
        const response = await api.get<UserData[]>("/users");
        return response.data;
    },

    getById: async (id: number | string): Promise<UserData> => {
        const response = await api.get<UserData>(`/users/${id}`);
        return response.data;

    },

    create: async (payload: UserFormData): Promise<any> => {
        const response = await api.post("/users", payload);
        return response.data
    },

    update: async (id: number | string, payload: UserFormData): Promise<any> => {
        const response = await api.put(`/users/${id}`, payload);
        return response.data;
    },

    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

} 