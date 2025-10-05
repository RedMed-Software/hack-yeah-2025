import { apiRequest } from './client'
import toast from 'react-hot-toast';

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
    toast.success('Zarejestrowano pomyślnie');
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
    toast.success('Zalogowano pomyślnie');
    return responseBody
}

export const fetchUserByAccountId = async (userId) => {
    const res = await apiRequest(`/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error('Błąd podczas pobierania użytkownika');
        throw new Error('Błąd podczas pobierania użytkownika');
    }
    return res.json();
};
