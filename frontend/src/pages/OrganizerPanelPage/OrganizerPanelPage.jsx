import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './OrganizerPanelPage.module.scss'
import { fetchUserByAccountId } from '../../api/auth';
import clsx from 'clsx'
import {
    formatDateRange,
} from '../../data/events.js'
import { search } from '../../api/event'
import { formatDate } from '../../utils/utils.js';


export default function OrganizerPanelPage() {
    const [searchValue, setSearchValue] = useState('')
    const [upcomingEvents, setRegisterEvents] = useState([]);
    const [completedEvents, setCompletedEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('authAccountId');
        fetchUserByAccountId(userId)
            .then((user) => {
                setCurrentUser(user)
            })
    }, [])

    useEffect(() => {
        const fetchEvents = async () => {
            if (currentUser?.organizer == null) {
                return;
            }

            const data = await search(null, currentUser.organizer.id, null);
            console.log(data);
            setRegisterEvents(data.filter((event) => event.eventStatus === 1));
            setCompletedEvents(data.filter((event) => event.eventStatus === 2));
        };

        fetchEvents();
    }, [searchValue, currentUser]);

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>Panel organizatora</h1>
                    <p>Wszystkie kluczowe informacje o zespole organizującym i planowanych inicjatywach.</p>
                </div>
            </header>
            <div className={styles.infoGrid}>
                <section className={styles.card}>
                    <h2>Informacje o organizatorze</h2>
                    <dl className={styles.dataList}>
                        <div>
                            <dt>Imię i nazwisko</dt>
                            <dd>{currentUser?.organizer?.fullName}</dd>
                        </div>
                        <div>
                            <dt>Rola</dt>
                            <dd>{currentUser?.organizer?.role}</dd>
                        </div>
                        <div>
                            <dt>Telefon</dt>
                            <dd>{currentUser?.organizer?.phone}</dd>
                        </div>
                        <div>
                            <dt>E-mail</dt>
                            <dd>{currentUser?.email}</dd>
                        </div>
                        <div>
                            <dt>Języki</dt>
                            <dd>{currentUser?.organizer?.languages}</dd>
                        </div>
                        <div>
                            <dt>Specjalizacje</dt>
                            <dd>{currentUser?.organizer?.specializations}</dd>
                        </div>
                    </dl>
                </section>
                <section className={styles.card}>
                    <h2>Organizacja</h2>
                    <dl className={styles.dataList}>
                        <div>
                            <dt>Nazwa</dt>
                            <dd>{currentUser?.organizer?.organization?.name}</dd>
                        </div>
                        <div>
                            <dt>Rok założenia</dt>
                            <dd>{currentUser?.organizer?.organization?.foundedYear}</dd>
                        </div>
                        <div>
                            <dt>Lokalizacja</dt>
                            <dd>
                                {currentUser?.organizer?.organization?.location}
                            </dd>
                        </div>
                        <div>
                            <dt>Programy</dt>
                            <dd>{currentUser?.organizer?.organization?.programs}</dd>
                        </div>
                        <div>
                            <dt>Misja</dt>
                            <dd>{currentUser?.organizer?.organization?.mission}</dd>
                        </div>
                        <div>
                            <dt>Strona</dt>
                            <dd>
                                <a href={currentUser?.organizer?.organization?.website} target="_blank" rel="noreferrer">
                                    {currentUser?.organizer?.organization?.website}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>
            <div className={clsx(styles.infoFlex, styles.header)}>
                <div className={styles.searchBox}>
                    <label htmlFor="event-search">Wyszukaj wydarzenie</label>
                    <input
                        id="event-search"
                        type="search"
                        placeholder="np. Green Weekend, Łódź, ekologia"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>
                <div className={styles.eventsLayout}>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Zarejestrowane wydarzenia</h2>
                            <span className={styles.counter}>{upcomingEvents.length}</span>
                        </div>
                        {upcomingEvents.length === 0 ? (
                            <p className={styles.emptyState}>Brak wydarzeń spełniających kryteria wyszukiwania.</p>
                        ) : (
                            <ul className={styles.eventGrid}>
                                {upcomingEvents.map((event) => (
                                    <li key={event.id}>
                                        <article className={styles.eventCard}>
                                            <header>
                                                <span className={styles.eventDate}>{formatDate(event.dates.start)} - {formatDate(event.dates.end)}</span>
                                                <h3>{event.name}</h3>
                                            </header>
                                            <p className={styles.eventSummary}>{event.summary}</p>
                                            <dl className={styles.eventMeta}>
                                                <div>
                                                    <dt>Miejsce</dt>
                                                    <dd>{event.mainLocation.venue}, {event.mainLocation.city}</dd>
                                                </div>
                                            </dl>
                                            <div className={styles.eventFooter}>
                                                <div className={styles.tagsContainer}>
                                                    {event.focusAreas
                                                        ?.split(',')
                                                        .map((area) => (
                                                            <span key={area.trim()} className={styles.eventTags}>
                                                                {area.trim()}
                                                            </span>
                                                        ))}
                                                </div>
                                                <Link className={styles.detailsLink} to={`/organizer/events/${event.id}`}>
                                                    Szczegóły
                                                </Link>
                                            </div>
                                        </article>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Zrealizowane wydarzenia</h2>
                            <span className={styles.counter}>{completedEvents.length}</span>
                        </div>
                        {completedEvents.length === 0 ? (
                            <p className={styles.emptyState}>Brak wydarzeń spełniających kryteria wyszukiwania.</p>
                        ) : (
                            <ul className={styles.eventGrid}>
                                {completedEvents.map((event) => (
                                    <li key={event.id}>
                                        <article className={styles.eventCard}>
                                            <header>
                                                <span className={styles.eventDate}>{formatDateRange(event.dates)}</span>
                                                <h3>{event.name}</h3>
                                            </header>
                                            <p className={styles.eventSummary}>{event.summary}</p>
                                            <dl className={styles.eventMeta}>
                                                <div>
                                                    <dt>Miasto</dt>
                                                    <dd>{event.mainLocation.city}</dd>
                                                </div>
                                                <div>
                                                    <dt>Uczestnicy</dt>
                                                    <dd>
                                                        {event.registrations}/{event.capacity.participants}
                                                    </dd>
                                                </div>
                                            </dl>
                                            <div className={styles.eventFooter}>
                                                <div className={styles.tagsContainer}>
                                                    {event.focusAreas
                                                        ? event.focusAreas.split(',').map((a) => (
                                                            <span key={a.trim()} className={styles.eventTag}>
                                                                {a.trim()}
                                                            </span>
                                                        ))
                                                        : '-'}                                                </div>
                                                <Link className={styles.detailsLink} to={`/organizer/events/${event.id}`}>
                                                    Szczegóły
                                                </Link>
                                            </div>
                                        </article>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>

        </section>
    )
}
