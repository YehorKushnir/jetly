import type {LoginData, RegistrationData} from '../types/User.ts'
import $api from '../http'
import type {AxiosResponse} from 'axios'
import type {AuthResponse} from '../types/AuthResponse.ts'

export class AuthService {
    static async login(data: LoginData): Promise<AxiosResponse<AuthResponse>> {
        return await $api.post('/login', data)
    }
    static async register(data: RegistrationData): Promise<AxiosResponse<AuthResponse>> {
        return await $api.post('/registration', data)
    }
    static async logout() {
        await $api.post('/logout')
    }
    static async refresh(): Promise<AxiosResponse<AuthResponse>> {
        return await $api.get('/refresh', {withCredentials: true})
    }
}