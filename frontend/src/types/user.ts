export type UserData = {
    id: number;
    name: string;
    email: string;
    role: string;
    // Standar Backend API (camelCase sesuai dokumen_api.md)
    storeId?: number | null;
    isActive?: boolean | number;
    createdAt?: string;
    store?: {
        id: number;
        name: string;
    } | null;

    // Alias kompatibilitas
    is_active?: boolean | number;
    created_at?: string;
};


export type UserFormData = {
    name: string;
    email: string;
    password?: string;
    role: string;
    storeId?: number | null;
    isActive?: boolean | number;
    is_active?: boolean | number;
    [key: string]: any;
};