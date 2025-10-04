import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/useAuth.js'

export default function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <section className="page">
        <p>Loading...</p>
      </section>
    )
  }

  if (!session) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    const params = new URLSearchParams()
    if (returnTo) {
      params.set('return_to', returnTo)
    }
    return <Navigate to={`/login?${params.toString()}`} replace />
  }

  return children
}
