const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

function buildUrl(path) {
    const sanitizedPath = path.startsWith('/') ? path : `/${path}`
    return `${API_BASE_URL}${sanitizedPath}`
}

export async function apiRequest(path, options = {}) {
    const response = await fetch(buildUrl(path), options)
    return response
}
