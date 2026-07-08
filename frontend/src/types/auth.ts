export type LoginResponse = {
    token: string
    user:User
}

export type LoginInput = {
    email: string;
    password: string;

}

export type User = {
    name: string
    email: string
    role?: "admin" | "super_admin" | "store_admin" | "user" | string
}