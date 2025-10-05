import { apiRequest } from './client'

export async function search(eventStatus, organizerId, query) {
    var searchEvents = {
        EventStatus: eventStatus == null ? null : EventStatus[eventStatus],
        OrganizerId: organizerId,
        Query: query,
    }

    const response = await apiRequest('/Event/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchEvents),
    })


    const responseBody = await response.json().catch(() => null)

    if (!response.ok) {
        const message = responseBody?.error ?? 'Wystąpił błąd podczas rejestracji.'
        throw new Error(message)
    }

    return responseBody
}


export const fetchEventDetails = async (eventId, userId) => {
    const res = await apiRequest(`/Event/${eventId}/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) throw new Error('Błąd podczas pobierania wydarzenia');
    return res.json();
}

export async function searchByDateRange(DateFrom, DateTo) {
    const response = await apiRequest('/Event/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DateFrom, DateTo }),
    });
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
        const message = responseBody?.error ?? 'Wystąpił błąd podczas wyszukiwania wydarzeń.';
        throw new Error(message);
    }
    return responseBody;
}

export const EventStatus = Object.freeze({
    Registered: 1,
    Completed: 2,
})