import {Navigate} from 'react-router'
import React, {type FC} from 'react'

interface Props {
    isAuthenticated: boolean
    redirectIfAuth?: boolean
    children: React.ReactNode
}

const PublicRoute: FC<Props> = ({isAuthenticated, redirectIfAuth, children}) => {
    if (isAuthenticated && redirectIfAuth) {
        return <Navigate to="/dashboard"/>
    }
    return children
}

export default PublicRoute