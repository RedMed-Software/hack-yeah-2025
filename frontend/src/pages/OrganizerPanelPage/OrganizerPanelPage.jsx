import { useMemo,  useState, useEffect  } from 'react'
import { Link } from 'react-router-dom'
import styles from './OrganizerPanelPage.module.scss'
import clsx from 'clsx'
import {
    events,
    formatDateRange,
    organizerProfile,
    organizationProfile,
} from '../../data/events.js'
import { search } from '../../api/event'


const matchesSearch = (event, query) => {
    if (!query) {
        return true
    }
    const haystack = [
        event.name,
        event.mainLocation.city,
        event.mainLocation.venue,
        event.summary,
        ...event.focusAreas,
    ]
        .join(' ')
        .toLowerCase()
    return haystack.includes(query)
}

export default function OrganizerPanelPage() {
    const [searchValue, setSearchValue] = useState('')
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setRegisterEvents] = useState([]);
    const [completedEvents, setCompletedEvents] = useState([]);

    useEffect(() => {
      const fetchEvents = async () => {
        const data = await search(null, organizerProfile.id,null); 
        setEvents(data);
        setRegisterEvents(data.filter((event) => event.eventStatus === 1 ));
        setCompletedEvents(data.filter((event) => event.eventStatus === 2));
      };
  
      fetchEvents();

      console.log(events)



    }, []);

    const query = searchValue.trim().toLowerCase()

    // const upcomingEvents = useMemo(
    //     () => events.filter((event) => event.status === 'register' && matchesSearch(event, query)),
    //     [query],
    // )

    // const completedEvents = useMemo(
    //     () => events.filter((event) => event.status === 'completed' && matchesSearch(event, query)),
    //     [query],
    // )

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
                            <dd>{organizerProfile.name}</dd>
                        </div>
                        <div>
                            <dt>Rola</dt>
                            <dd>{organizerProfile.role}</dd>
                        </div>
                        <div>
                            <dt>Telefon</dt>
                            <dd>{organizerProfile.phone}</dd>
                        </div>
                        <div>
                            <dt>E-mail</dt>
                            <dd>{organizerProfile.email}</dd>
                        </div>
                        <div>
                            <dt>Języki</dt>
                            <dd>{organizerProfile.languages.join(', ')}</dd>
                        </div>
                        <div>
                            <dt>Specjalizacje</dt>
                            <dd>{organizerProfile.focusAreas.join(', ')}</dd>
                        </div>
                    </dl>
                </section>
                <section className={styles.card}>
                    <h2>Organizacja</h2>
                    <dl className={styles.dataList}>
                        <div>
                            <dt>Nazwa</dt>
                            <dd>{organizationProfile.name}</dd>
                        </div>
                        <div>
                            <dt>Rok założenia</dt>
                            <dd>{organizationProfile.founded}</dd>
                        </div>
                        <div>
                            <dt>Lokalizacja</dt>
                            <dd>
                                {organizationProfile.location.venue}
                                <br />
                                {organizationProfile.location.address}
                                <br />
                                {organizationProfile.location.city}
                            </dd>
                        </div>
                        <div>
                            <dt>Programy</dt>
                            <dd>{organizationProfile.programs.join(', ')}</dd>
                        </div>
                        <div>
                            <dt>Misja</dt>
                            <dd>{organizationProfile.mission}</dd>
                        </div>
                        <div>
                            <dt>Strona</dt>
                            <dd>
                                <a href={organizationProfile.website} target="_blank" rel="noreferrer">
                                    {organizationProfile.website}
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
                                                <span className={styles.eventDate}>{event.dateFrom} - {event.dateTo}</span>
                                                <h3>{event.name}</h3>
                                            </header>
                                            <p className={styles.eventSummary}>{event.summary}</p>
                                            <dl className={styles.eventMeta}>
                                                <div>
                                                    <dt>Miejsce</dt>
                                                    <dd>{event.place}</dd>
                                                </div>
                                                <div>
                                                    <dt>Zgłoszenia</dt>
                                                    <dd>
                                                        {/* {event.registrations}/{event.capacity.participants} */}
                                                    </dd>
                                                </div>
                                            </dl>
                                            <div className={styles.eventFooter}>
                                                <div className={styles.tagsContainer}>
                                                    {/* {event.focusAreas.map((area) => <span className={styles.eventTags}>{area}</span>)} */}
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
                                                    {event.focusAreas.map((area) => <span className={styles.eventTags}>{area}</span>)}
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
                </div>
            </div>

        </section>
    )
}
