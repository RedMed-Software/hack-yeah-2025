
import { apiRequest } from './client'


export const getVolonteerById = async (id) => {

    const res = await apiRequest(`/Volunteer/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) throw new Error('Błąd podczas pobierania wydarzenia');
    return res.json();
}

