export type LoginRespone = {
    token: string
    user:User
}

export type LoginInput = {
    email: string;
    password: string;

}

export type User = {
    nme: string
    email:string
}