import { apiRequest } from './client'

export async function searchForMap() {

    var searchEvents = {
        EventStatus: 1
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

export async function search(eventStatus, organizerId, query) {

    console.log(eventStatus, organizerId, query)

    var searchEvents = {
        EventStatus: eventStatus,
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


export const fetchEventDetails = async (eventId) => {
    const res = await apiRequest(`/Event/${eventId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) throw new Error('Błąd podczas pobierania wydarzenia');
    return res.json();
}