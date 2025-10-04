import { Navigate, useLocation } from 'react-router-dom'

export default function PublicRoute({ children }) {
    const token = localStorage.getItem('authToken')
    const location = useLocation()
    if (token) return <Navigate to="/dashboard" replace state={{ from: location }} />
    return children
}
