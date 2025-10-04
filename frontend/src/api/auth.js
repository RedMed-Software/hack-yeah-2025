const API_URL = '/api/login'

function decodeSegment(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const decodeBinary = typeof globalThis.atob === 'function'
    ? (value) => globalThis.atob(value)
    : typeof globalThis.Buffer === 'function'
      ? (value) => globalThis.Buffer.from(value, 'base64').toString('binary')
      : null
  if (!decodeBinary) {
    return null
  }
  const binary = decodeBinary(padded)
  const percentEncoded = Array.from(binary)
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
    .join('')
  try {
    const json = decodeURIComponent(percentEncoded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

function decodeJwtPayload(token) {
  if (typeof token !== 'string') {
    return null
  }
  const parts = token.split('.')
  if (parts.length < 2) {
    return null
  }
  return decodeSegment(parts[1])
}

function extractRoles(source) {
  if (!source || typeof source !== 'object') {
    return []
  }
  const candidates = [
    source.roles,
    source.Roles,
    source.role,
    source.Role,
  ]
  const result = []
  for (const value of candidates) {
    if (!value) {
      continue
    }
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (typeof entry === 'string') {
          result.push(entry.trim())
        }
      }
      continue
    }
    if (typeof value === 'string') {
      result.push(value.trim())
    }
  }
  return Array.from(new Set(result.filter((value) => value.length > 0)))
}

function selectUserType(payloadRoles, responseRoles, payload, response) {
  const roleList = payloadRoles.length > 0 ? payloadRoles : responseRoles
  if (roleList.length > 0) {
    const order = ['Administrator', 'Organizator', 'Koordynator', 'Wolontariusz']
    for (const name of order) {
      if (roleList.includes(name)) {
        return name
      }
    }
    return roleList[0]
  }
  const typeCandidates = [
    response?.type,
    response?.Type,
    payload?.type,
    payload?.Type,
  ]
  for (const candidate of typeCandidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim()
    }
  }
  return null
}

function resolveLogin(payload, response, requestedLogin) {
  const candidates = [
    response?.login,
    response?.Login,
    response?.user?.login,
    response?.user?.Login,
    payload?.login,
    payload?.Login,
    payload?.sub,
    payload?.name,
    requestedLogin,
  ]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim()
    }
  }
  return ''
}

function resolveExpiration(payload, response) {
  const fromResponse = response?.expiresAt ?? response?.ExpiresAt
  if (typeof fromResponse === 'string') {
    const date = new Date(fromResponse)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }
  const exp = payload?.exp ?? payload?.Exp
  if (typeof exp === 'number' && Number.isFinite(exp)) {
    return new Date(exp * 1000).toISOString()
  }
  if (typeof exp === 'string' && exp.trim().length > 0) {
    const value = Number(exp)
    if (Number.isFinite(value)) {
      return new Date(value * 1000).toISOString()
    }
  }
  return null
}

export async function login({ login, password }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  })
  if (response.status === 401 || response.status === 403) {
    throw new Error('Niepoprawny login lub hasło.')
  }
  if (!response.ok) {
    throw new Error('Nie udało się zalogować.')
  }
  const data = await response.json().catch(() => ({}))
  const token = typeof data === 'object' && data !== null
    ? data.token ?? data.accessToken ?? data.bearerToken ?? data.jwt
    : null
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Brak tokenu w odpowiedzi serwera.')
  }
  const payload = decodeJwtPayload(token) ?? {}
  const payloadRoles = extractRoles(payload)
  const responseRoles = extractRoles(data)
  const roles = payloadRoles.length > 0 ? payloadRoles : responseRoles
  const userType = selectUserType(payloadRoles, responseRoles, payload, data)
  const loginValue = resolveLogin(payload, data, login)
  const expiresAt = resolveExpiration(payload, data)
  return {
    token,
    user: {
      login: loginValue,
      type: userType,
      roles,
      expiresAt,
    },
  }
}
