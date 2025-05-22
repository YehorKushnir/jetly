import {Route, Routes, useLocation} from 'react-router'
import {useStore} from '@/store.ts'
import {useEffect} from 'react'
import ProtectedRoute from '@/components/protected-route.tsx'
import {protectedRoutes, publicRoutes} from '@/utils/routes.tsx'
import PublicRoute from '@/components/public-route.tsx'
import {Navbar1} from '@/components/navbar1.tsx'

const hideNavbarPaths = ['/login', '/register']
const onlyAdminPages = ['/admin-panel']
const menu = [
    {
        title: "Admin Panel",
        url: "/admin-panel"
    }
]

function App() {
    const location = useLocation()
    const isNavbarVisible = !hideNavbarPaths.includes(location.pathname)

    const user = useStore(state => state.user)
    const refresh = useStore(state => state.refresh)

    useEffect(() => {
        void refresh()
    }, [])

    return (
        <div className={'flex flex-col h-dvh'}>
            {isNavbarVisible && (
                <Navbar1 menu={user?.role === "admin" ? menu : menu.filter(item => !onlyAdminPages.includes(item.url))} />
            )}
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    {publicRoutes.map(({path, element, redirectIfAuth}) => (
                        <Route key={path} path={path} element={
                            <PublicRoute isAuthenticated={!!user} redirectIfAuth={redirectIfAuth}>
                                {element}
                            </PublicRoute>
                        }/>
                    ))}

                    {user && protectedRoutes.map(({path, element, admin}) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <ProtectedRoute isAuthenticated={!!user} admin={!!admin}>
                                    {element}
                                </ProtectedRoute>
                            }
                        />
                    ))}
                </Routes>
            </div>
        </div>
    )
}

export default App
