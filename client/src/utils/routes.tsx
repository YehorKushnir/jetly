import React from 'react'
import HomePage from '@/pages/home-page.tsx'
import LoginPage from '@/pages/login-page.tsx'
import RegistrationPage from '@/pages/registration-page.tsx'
import ProductPage from '@/pages/product-page.tsx'
import AdminPage from '@/pages/admin-page.tsx'

interface Route {
    path: string
    redirectIfAuth?: boolean,
    admin?: boolean,
    element: React.ReactNode
}

export const protectedRoutes: Route[] = [
    {path: '/admin-panel', element: <AdminPage/>, admin: true},
]

export const publicRoutes: Route[] = [
    {path: '/', element: <HomePage/>},
    {path: '/login', element: <LoginPage/>, redirectIfAuth: true},
    {path: '/register', element: <RegistrationPage/>, redirectIfAuth: true},
    {path: '/product/:id', element: <ProductPage/>},
]