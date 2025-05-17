import {Navigate} from 'react-router'
import React, {type FC} from 'react'

interface Props {
    isAuthenticated: boolean
    admin: boolean
    children: React.ReactNode
}

const ProtectedRoute: FC<Props> = ({isAuthenticated, children, admin}) => {
    if (!isAuthenticated || !admin) {
        return <Navigate to="/login"/>
    }
    return children
}

export default ProtectedRoute