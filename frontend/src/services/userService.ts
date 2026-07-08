import { api } from "../lib/axios";
import type { UserFormData } from "../pages/admin/users/hooks/useAddUser";
import type { User } from "../types/user";




export const userService = {

    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>("/users");
        return response.data;
    },

    getById: async (id: number | string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
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