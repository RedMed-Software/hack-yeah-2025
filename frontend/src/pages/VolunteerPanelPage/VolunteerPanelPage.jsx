import { useEffect, useState } from 'react';
import { fetchUserByAccountId } from '../../api/auth';
import styles from './VolunteerPanelPage.module.scss'
import { generateGuardianConsent } from '../../utils/utils';
import { getVolonteerById } from '../../api/volunteer'
import VolunteerHero from '../../components/Header/VolunteerHero';


// Ulepszona wersja z formatowaniem
const calculateTotalVolunteerTime = (events) => {
    if (!events || !Array.isArray(events)) return 0;

    let totalMs = 0;

    events.forEach(event => {
        if (event.dateFrom && event.dateTo) {
            try {
                const start = new Date(event.dateFrom);
                const end = new Date(event.dateTo);

                // Sprawdź czy daty są poprawne
                if (start instanceof Date && end instanceof Date && !isNaN(start) && !isNaN(end)) {
                    const diffMs = end.getTime() - start.getTime();
                    if (diffMs > 0) {
                        totalMs += diffMs;
                    }
                }
            } catch (error) {
                console.warn('Błąd podczas obliczania czasu dla eventu:', event.id, error);
            }
        }
    });

    // Konwertuj milisekundy na godziny i zaokrąglij
    const totalHours = totalMs / (1000 * 60 * 60);
    return Math.round(totalHours);
};

// Wersja zwracająca sformatowany string (np. "312h 30m")
const formatTotalVolunteerTime = (events) => {
    if (!events || !Array.isArray(events)) return '0h';

    let totalMs = 0;

    events.forEach(event => {
        if (event.dateFrom && event.dateTo) {
            try {
                const start = new Date(event.dateFrom);
                const end = new Date(event.dateTo);

                if (start instanceof Date && end instanceof Date && !isNaN(start) && !isNaN(end)) {
                    const diffMs = end.getTime() - start.getTime();
                    if (diffMs > 0) {
                        totalMs += diffMs;
                    }
                }
            } catch (error) {
                console.warn('Błąd podczas obliczania czasu dla eventu:', event.id, error);
            }
        }
    });

    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

    if (remainingMinutes > 0) {
        return `${totalHours}h ${remainingMinutes}m`;
    }

    return `${totalHours}h`;
};

const mapEventToUpcomingShifts = (events) => {
    if (!events || !Array.isArray(events)) return [];

    return events
        .filter(event => {
            return event.eventStatus === 1;// 1 = Registered
        })
        .map(event => {
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            };
            const formatTime = (timeFrom, timeTo) => {
                if (!timeFrom && !timeTo) return 'Godziny do ustalenia';
                return `${timeFrom || '?'} – ${timeTo || '?'}`;
            };

            const getStatus = (eventStatus) => {
                switch (eventStatus) {
                    case 1: return 'Potwierdzony'; // Registered
                    case 2: return 'Zakończony'; // Completed
                    case 3: return 'Anulowany'; // Cancelled
                    default: return 'Oczekuje na potwierdzenie';
                }
            };

            return {
                id: event.id,
                title: event.name || 'Wydarzenie',
                location: `${event.place}, ${event.city}`,
                date: formatDate(event.dateFrom),
                time: formatTime(event.timeFrom, event.timeTo),
                status: getStatus(event.eventStatus),
                // Dodatkowe pola, które mogą się przydać
                description: event.shortDescription,
                fullDescription: event.longDescription,
                address: event.address,
                maxParticipants: event.maxParticipants,
                maxVolunteers: event.maxVolunteers,
                focusAreas: event.focusAreas,
                dateFrom: event.dateFrom,
                dateTo: event.dateTo
            };
        });
};


export default function VolunteerPanelPage() {
    const [upcomingShifts, setUpcomingShifts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [distinctions, setDistinctions] = useState([]);
    const [tags, setTags] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [events, setEvents] = useState([]);
    const [formattedTime, setFormattedTime] = useState('0h');
    const [timeline, setTimeline] = useState([]);
    useEffect(() => {
        const userId = localStorage.getItem('authAccountId');
        fetchUserByAccountId(userId)
            .then((user) => {
                setCurrentUser(user);
                if (user?.volunteer?.availability && typeof user.volunteer.availability === 'object') {
                    setAvailability(Object.values(user.volunteer.availability));
                } else {
                    setAvailability([]);
                }
                if (user?.volunteer?.languages && typeof user.volunteer.languages === 'object') {
                    setLanguages(Object.values(user.volunteer.languages));
                } else {
                    setLanguages([]);
                }
                if (user?.volunteer?.skills && typeof user.volunteer.skills === 'object') {
                    setSkills(Object.values(user.volunteer.skills));
                } else {
                    setSkills([]);
                }
                if (user?.volunteer?.distinctions && Array.isArray(user.volunteer.distinctions)) {
                    setDistinctions(user.volunteer.distinctions);
                } else {
                    setDistinctions([]);
                }
                if (user?.volunteer?.tags && Array.isArray(user.volunteer.tags)) {
                    setTags(user.volunteer.tags);
                } else {
                    setTags([]);
                }
            });
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            if (currentUser?.volunteer == null) {
                return;
            }

            const data = await getVolonteerById(currentUser?.volunteer?.id);
            if (data.events.length > 0) {
                const tempEvents = [...data.events]
                setEvents(tempEvents.filter(e => e.eventStatus === 2))
                const temptimeline = tempEvents
                    .map(e => ({
                        id: e.id,
                        date: new Date(e.dateFrom).toLocaleDateString('pl-PL', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        }),
                        title: e.name,
                        description: e.shortDescription || e.longDescription || 'Brak opisu',
                    }));

                const shifts = mapEventToUpcomingShifts(tempEvents);
                const formatted = formatTotalVolunteerTime(tempEvents.filter(e => e.eventStatus === 2));
                setFormattedTime(formatted);
                setUpcomingShifts(shifts, tempEvents);
                setTimeline(temptimeline);
            }
        };

        fetchEvents();
    }, [currentUser]);

    const handleDownloadConsent = async () => {
        if (!currentUser) return;

        setIsGenerating(true);
        try {
            await generateGuardianConsent(currentUser);
        } catch (error) {
            console.error('Błąd podczas generowania dokumentu:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section className={styles.page}>
            <VolunteerHero currentUser={currentUser} />

            <section className={styles.metrics} aria-label="Podsumowanie aktywności">
                <article className={styles.metric}>
                    <span className={styles.metricValue}>{formattedTime}</span>
                    <span className={styles.metricLabel}>Łączny czas wolontariatu</span>
                </article>
                <article className={styles.metric}>
                    <span className={styles.metricValue}>{timeline.length}</span>
                    <span className={styles.metricLabel}>Zrealizowanych inicjatyw</span>
                </article>
            </section>

            <div className={styles.sections}>
                <div className={styles.mainColumn}>
                    <section className={styles.card}>
                        <h2>Obszary zaangażowania</h2>
                        <ul className={styles.tags}>
                            {tags.length > 0 ? (
                                tags.map((tag, idx) => (
                                    <li key={idx}>{tag}</li>
                                ))
                            ) : (
                                <li>Brak danych o obszarach zaangażowania</li>
                            )}
                        </ul>
                        <div className={styles.detailGrid}>
                            <div>
                                <h3>Dostępność</h3>
                                <ul>
                                    {availability && availability.length > 0 ? (
                                        availability.map((slot, idx) => (
                                            <li key={idx}>{slot}</li>
                                        ))
                                    ) : (
                                        <li>Brak danych o dostępności</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3>Preferowane role</h3>
                                <p>{currentUser?.volunteer?.preferredRoles || 'Brak danych o preferowanych rolach'}</p>
                            </div>
                            <div>
                                <h3>Języki</h3>
                                <p>{languages.length > 0 ? languages.join(', ') : 'Brak danych o językach'}</p>
                            </div>
                            <div>
                                <h3>Transport</h3>
                                <p>{currentUser?.volunteer?.transport || 'Brak danych o transporcie'}</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <h2>Nadchodzące dyżury</h2>
                        <ul className={styles.shiftList}>
                            {upcomingShifts.length > 0 ? upcomingShifts.map((shift) => (
                                <li key={shift.id} className={styles.shiftItem}>
                                    <div className={styles.shiftHeader}>
                                        <h3>{shift.title}</h3>
                                        <span className={styles.shiftStatus}>{shift.status}</span>
                                    </div>
                                    <p>{shift.location}</p>
                                    <p className={styles.shiftMeta}>
                                        <span>{shift.date}</span>
                                        <span>{shift.time}</span>
                                    </p>
                                </li>
                            )) : <li>Brak nadchodzących dyżurów</li>}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Historia działań</h2>
                        <ol className={styles.timeline}>
                            {timeline.length > 0 ? timeline.map(entry => (
                                <li key={entry.id} className={styles.timelineItem}>
                                    <span className={styles.timelineDate}>{entry.date}</span>
                                    <div>
                                        <h3>{entry.title}</h3>
                                        <p>{entry.description}</p>
                                    </div>
                                </li>
                            )) : <li>Brak historii działań</li>}
                        </ol>
                    </section>
                </div>

                <div className={styles.sideColumn}>
                    <section className={styles.card}>
                        <h2>Umiejętności</h2>
                        <ul className={styles.skillsList}>
                            {skills.length > 0 ? (
                                skills.map((skill, idx) => (
                                    <li key={idx} className={styles.skillItem}>{skill}</li>
                                ))
                            ) : (
                                <li>Brak danych o umiejętnościach</li>
                            )}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Wyróżnienia</h2>
                        <ul className={styles.achievementsList}>
                            {distinctions.length > 0 ? (
                                distinctions.map((distinction) => (
                                    <li key={distinction.id} className={styles.achievementItem}>
                                        <h3>{distinction.title}</h3>
                                        <p>{distinction.description}</p>
                                    </li>
                                ))
                            ) : (
                                <li>Brak wyróżnień</li>
                            )}
                        </ul>
                    </section>

                    <section className={styles.card}>
                        <h2>Kontakt i dokumenty</h2>
                        <dl className={styles.definitionList}>
                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={`mailto:${currentUser?.volunteer?.email || currentUser?.email || ''}`}>
                                        {currentUser?.volunteer?.email || currentUser?.email || 'Brak danych o adresie email'}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Telefon</dt>
                                <dd>
                                    <a href={`tel:${currentUser?.volunteer?.phone || ''}`}>
                                        {currentUser?.volunteer?.phone || 'Brak danych o numerze telefonu'}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Opiekun</dt>
                                <dd>Anna Kowalska, Centrum Wolontariatu Kraków</dd>
                            </div>
                            <div>
                                <dt>Dokumenty</dt>
                                <dd>
                                    <button
                                        type="button"
                                        className={styles.linkButton}
                                        onClick={handleDownloadConsent}
                                        disabled={!currentUser || isGenerating}
                                    >
                                        {isGenerating ? 'Generowanie...' : 'Pobierz zgodę opiekuna'}
                                    </button>
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>
        </section>
    );
}