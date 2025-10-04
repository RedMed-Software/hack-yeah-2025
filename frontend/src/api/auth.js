import { apiRequest } from './client'

export async function registerUser(payload) {
    const response = await apiRequest('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    const responseBody = await response.json().catch(() => null)

    if (!response.ok) {
        const message = responseBody?.error ?? 'Wystąpił błąd podczas rejestracji.'
        throw new Error(message)
    }

    return responseBody
}

export async function loginUser(credentials) {
    const response = await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    })

    const responseBody = await response.json().catch(() => null)

    if (!response.ok) {
        const message = responseBody?.error ?? 'Nie udało się zalogować.'
        throw new Error(message)
    }

    return responseBody
}
