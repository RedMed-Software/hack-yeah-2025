import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { startChatWithEvent, startChatWithAccount, getChatMessages, postChatMessage } from '../../api/chat';

export default function ChatPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const eventId = searchParams.get('eventId');
    const accountId = searchParams.get('accountId');

    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [userNames, setUserNames] = useState({});
    const myAccountId = localStorage.getItem('authAccountId');

    useEffect(() => {
        async function initChat() {
            setLoading(true);
            setError(null);
            try {
                let chatIdResp;
                if (eventId) {
                    chatIdResp = await startChatWithEvent(eventId);
                } else if (accountId) {
                    chatIdResp = await startChatWithAccount(accountId);
                } else {
                    setError('Brak eventId lub accountId');
                    setLoading(false);
                    return;
                }
                const chatIdValue = chatIdResp;
                setChatId(chatIdValue);
                const msgs = await getChatMessages(chatIdValue);
                setMessages(msgs);
                // Pobierz unikalne accountId z wiadomości
                const uniqueAccountIds = [...new Set(msgs.map(m => m.accountId))];
                const namesMap = {};
                for (const accId of uniqueAccountIds) {
                    try {
                        const user = await import('../../api/auth').then(mod => mod.fetchUserByAccountId(accId));
                        if (user?.volunteer) {
                            namesMap[accId] = `${user.volunteer.firstName} ${user.volunteer.lastName}`;
                        } else if (user?.organizer) {
                            namesMap[accId] = user.organizer.fullName;
                        } else if (user?.coordinator) {
                            namesMap[accId] = `${user.coordinator.firstName} ${user.coordinator.lastName}`;
                        } else if (user?.firstName || user?.lastName) {
                            namesMap[accId] = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
                        } else {
                            namesMap[accId] = accId;
                        }
                    } catch {
                        namesMap[accId] = accId;
                    }
                }
                setUserNames(namesMap);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        initChat();
    }, [eventId, accountId]);

    async function handleSendMessage(e) {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;
        setSending(true);
        setError(null);
        try {
            await postChatMessage(chatId, newMessage);
            setNewMessage('');
            // Odśwież wiadomości
            const msgs = await getChatMessages(chatId);
            setMessages(msgs);
        } catch (err) {
            setError(err.message);
        }
        setSending(false);
    }

    return (
        <section style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h2>Czat</h2>
            {loading && <p>Ładowanie...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <>
                    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minHeight: 200, marginBottom: 16 }}>
                        {messages.length === 0 ? (
                            <p>Brak wiadomości.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {messages.map(msg => (
                                    <li key={msg.ChatMessageId} style={{ marginBottom: 12 }}>
                                        <div style={{ fontWeight: 'bold' }}>
                                            Od: {msg.accountId === myAccountId ? 'Ja' : (userNames[msg.accountId] || msg.accountId?.slice(0, 8) || 'Inny')}
                                        </div>
                                        <div>{msg.message}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{msg.timestamp ? new Date(msg.timestamp).toLocaleString('pl-PL') : ''}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Wpisz wiadomość..."
                            style={{ flex: 1, padding: 8 }}
                            disabled={sending}
                        />
                        <button type="submit" disabled={sending || !newMessage.trim()}>
                            Wyślij
                        </button>
                    </form>
                </>
            )}
        </section>
    );
}
