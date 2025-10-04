import { Navigate, useLocation } from 'react-router-dom'

function safeParseRolesFromStorage() {
  try {
    const raw = localStorage.getItem('authRoles')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map(String)
    if (typeof parsed === 'string') return [parsed]
  } catch {
    return null
  }
  return null
}

function parseRolesFromJwt(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const obj = JSON.parse(json)
    if (!obj) return null
    if (Array.isArray(obj.roles)) return obj.roles.map(String)
    if (typeof obj.roles === 'string') return obj.roles.split(',').map(s => s.trim())
    if (typeof obj.role === 'string') return [obj.role]
    if (obj.role && Array.isArray(obj.role)) return obj.role.map(String)
  } catch {
    return null
  }
  return null
}

function getUserRoles() {
  const fromStorage = safeParseRolesFromStorage()
  if (fromStorage && fromStorage.length) return fromStorage
  const token = localStorage.getItem('authToken')
  if (!token) return []
  const fromToken = parseRolesFromJwt(token)
  if (fromToken && fromToken.length) return fromToken
  return []
}

export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem('authToken');
  console.log(roles)
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
