import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem('authToken');
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (!roles || roles.length === 0) {
    return children
  }

  const userRoles = [localStorage.getItem('authAccountType')]
  console.log(userRoles)
  const required = roles.map(r => String(r).toLowerCase())
  const ok = required.some(rr => userRoles.includes(rr))

  if (!ok) {
    return <Navigate to="/dashboard" replace state={{ denied: true }} />
  }

  return children
}
