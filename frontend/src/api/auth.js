import { apiRequest } from './client'

export async function registerUser(payload) {
    const response = await apiRequest('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        const message = errorBody?.error ?? 'Wystąpił błąd podczas rejestracji.'
        throw new Error(message)
    }
}
