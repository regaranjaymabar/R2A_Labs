export type UserData = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "store_admin" | "user";
    is_active: boolean;
    created_at: string;
}