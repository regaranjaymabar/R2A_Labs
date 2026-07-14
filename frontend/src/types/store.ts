export type Store = {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    // Standar Backend API (camelCase)
    isActive?: boolean | number;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: string;

    // Alias kompatibilitas
    is_active?: boolean | number;
};

export type StoreFormData = {
    name: string;
    address: string;
    city: string;
    phone: string;
    latitude?: number | null;
    longitude?: number | null;
    isActive?: boolean | number;
    is_active?: boolean | number;
    [key: string]: any;
};