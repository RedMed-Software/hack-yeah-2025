import { Navigate } from 'react-router-dom'

export default function DashboardPage() {
    const userType = localStorage.getItem('authAccountType');
    switch (userType) {
        case 'organizer':
            return <Navigate to="/organizer" replace />
        case 'volunteer':
            return <Navigate to="/volunteer" replace />
        case 'coordinator':
            return <Navigate to="/coordinator" replace />
        default:
            return <Navigate to="/" replace />
    }
}