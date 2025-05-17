export interface User {
    id: string
    name: string
    email: string
    role: string
}

export interface LoginData {
    email: string
    password: string
}

export interface RegistrationData {
    name: string
    email: string
    password: string
    confirm_password: string
}