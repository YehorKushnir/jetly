import {create} from 'zustand/react'
import {AuthService} from './services/AuthService.ts'
import type {LoginData, RegistrationData, User} from './types/User.ts'

type State = {
    user: User | null
    loading: boolean
    login: (data: LoginData) => Promise<void>
    register: (data: RegistrationData) => Promise<void>
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

export const useStore = create<State>((set, _get) => ({
    user: null,
    loading: true,
    login: async (loginData) => {
        const {user, accessToken} = (await AuthService.login(loginData)).data
        localStorage.setItem('token', accessToken)
        set({user: user})
    },
    register: async (registrationData) => {
        const {user, accessToken} = (await AuthService.register(registrationData)).data
        localStorage.setItem('token', accessToken)
        set({user: user})
    },
    logout: async () => {
        await AuthService.logout()
        localStorage.removeItem('token')
        set({user: null})
    },
    refresh: async () => {
        if(localStorage.getItem('token')) {
            const {user, accessToken} = (await AuthService.refresh()).data
            localStorage.setItem('token', accessToken)
            set({user: user})
        }
        set({loading: false})
    }
}))