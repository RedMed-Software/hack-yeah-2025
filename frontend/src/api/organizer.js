import { apiRequest } from './client';

// Pobierz accountId na podstawie organizerId
export async function getAccountIdByOrganizerId(organizerId) {
    const response = await apiRequest(`/Organizer/${organizerId}/get-account-id`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
        const message = responseBody?.error ?? 'Błąd podczas pobierania accountId organizatora.';
        throw new Error(message);
    }
    return responseBody;
}

