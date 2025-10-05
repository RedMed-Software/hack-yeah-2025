import { apiRequest } from './client'

export async function startChatWithAccount(accountId) {
    const response = await apiRequest(`/Chat/start/account/${accountId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
        const message = responseBody?.error ?? 'Błąd podczas rozpoczynania czatu z użytkownikiem.';
        throw new Error(message);
    }
    return responseBody;
}

export async function startChatWithEvent(eventId) {
    const response = await apiRequest(`/Chat/start/event/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
        const message = responseBody?.error ?? 'Błąd podczas rozpoczynania czatu z wydarzeniem.';
        throw new Error(message);
    }
    return responseBody;
}

export async function getChatMessages(chatId) {
    const response = await apiRequest(`/Chat/${chatId}/messages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
        const message = responseBody?.error ?? 'Błąd podczas pobierania wiadomości czatu.';
        throw new Error(message);
    }
    return responseBody;
}

export async function postChatMessage(chatId, message) {
    const response = await apiRequest(`/Chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
        const message = responseBody?.error ?? 'Błąd podczas wysyłania wiadomości.';
        throw new Error(message);
    }
    return responseBody;
}

