export type LoginResponse = {
    token: string
    user:User
}

export type LoginInput = {
    email: string;
    password: string;

}

export type UserRole = "superadmin" | "super_admin" | "admin" | "store_admin" | "user";

export type User = {
    id?: number
    storeId: number | null
    name: string
    email: string
    role?: UserRole
    createdAt?: string
}

export type AuthWrapperResponse = {
    success: boolean;
    message: string;
    data: LoginResponse;
};

export type CustomerLoginResponse = {
    token: string;
    customer: User;
};

export type CustomerAuthWrapperResponse = {
    success: boolean;
    message: string;
    data: CustomerLoginResponse;
};