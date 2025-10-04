import { Link, useParams } from 'react-router-dom'
import styles from './EventDetailsPage.module.scss'
import { findEventById, formatDateRange } from '../../data/events.js'

const buildMapSrc = (query) =>
    `https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(query)}&zoom=15`

const buildMapLink = (query) =>
    `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`

const buildTaskSummary = (task) => {
    const primarySkills = task.volunteerNeeds.skills.slice(0, 2).join(', ')
    return `Min. ${task.volunteerNeeds.minAge}+ • ${primarySkills || 'wolontariusze'}`
}

export default function EventDetailsPage() {
    const { eventId } = useParams()
    const event = findEventById(eventId)

    if (!event) {
        return (
            <section className={styles.page}>
                <nav className={styles.breadcrumbs}>
                    <Link to="/organizer">Panel organizatora</Link>
                </nav>
                <div className={styles.notFound}>
                    <h1>Nie znaleziono wydarzenia</h1>
                    <p>Sprawdź, czy adres jest poprawny, lub wróć do panelu organizatora.</p>
                    <Link className={styles.primaryLink} to="/organizer">
                        Wróć do listy wydarzeń
                    </Link>
                </div>
            </section>
        )
    }

    const mapSrc = buildMapSrc(event.mapQuery)
    const mapLink = buildMapLink(event.mapQuery)

    return (
        <section className={styles.page}>
            <nav className={styles.breadcrumbs}>
                <Link to="/organizer">Panel organizatora</Link>
                <span aria-hidden="true">/</span>
                <span>{event.name}</span>
            </nav>

            <header className={styles.hero}>
                <div className={styles.heroIntro}>
                    <span className={styles.heroBadge}>{formatDateRange(event.dates)}</span>
                    <h1>{event.name}</h1>
                    <p>{event.summary}</p>
                </div>
                <dl className={styles.heroFacts}>
                    <div>
                        <dt>Godziny</dt>
                        <dd>{event.time}</dd>
                    </div>
                    <div>
                        <dt>Miasto</dt>
                        <dd>{event.mainLocation.city}</dd>
                    </div>
                    <div>
                        <dt>Zgłoszenia</dt>
                        <dd>
                            {event.registrations}/{event.capacity.participants}
                        </dd>
                    </div>
                    <div>
                        <dt>Wolontariusze</dt>
                        <dd>Potrzeba {event.capacity.volunteers} osób</dd>
                    </div>
                </dl>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Informacje</h2>
                </div>
                <dl className={styles.infoGrid}>
                    <div>
                        <dt>Termin</dt>
                        <dd>{formatDateRange(event.dates)}</dd>
                    </div>
                    <div>
                        <dt>Zakres tematyczny</dt>
                        <dd>{event.focusAreas.join(', ')}</dd>
                    </div>
                    <div>
                        <dt>Limit uczestników</dt>
                        <dd>{event.capacity.participants}</dd>
                    </div>
                    <div>
                        <dt>Potrzebni wolontariusze</dt>
                        <dd>{event.capacity.volunteers}</dd>
                    </div>
                </dl>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Opis</h2>
                </div>
                <p className={styles.description}>{event.description}</p>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Lokalizacja</h2>
                </div>
                <dl className={styles.locationList}>
                    <div>
                        <dt>Miejsce</dt>
                        <dd>{event.mainLocation.venue}</dd>
                    </div>
                    <div>
                        <dt>Adres</dt>
                        <dd>{event.mainLocation.address}</dd>
                    </div>
                    <div>
                        <dt>Miasto</dt>
                        <dd>{event.mainLocation.city}</dd>
                    </div>
                </dl>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Mapka</h2>
                    <a className={styles.mapLink} href={mapLink} target="_blank" rel="noreferrer">
                        Otwórz w nowej karcie
                    </a>
                </div>
                <div className={styles.mapWrapper}>
                    <iframe title={`Mapa wydarzenia ${event.name}`} src={mapSrc} loading="lazy" />
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Zadania do zrealizowania</h2>
                </div>
                <div className={styles.tasksGrid}>
                    {event.tasks.map((task) => (
                        <article key={task.id} className={styles.taskCard}>
                            <header>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                            </header>
                            <dl className={styles.taskMeta}>
                                <div>
                                    <dt>Miejsce</dt>
                                    <dd>{task.location}</dd>
                                </div>
                                <div>
                                    <dt>Data</dt>
                                    <dd>{task.date}</dd>
                                </div>
                                <div>
                                    <dt>Godziny</dt>
                                    <dd>
                                        {task.timeFrom}–{task.timeTo}
                                    </dd>
                                </div>
                            </dl>
                            <details className={styles.taskDetails}>
                                <summary>{buildTaskSummary(task)}</summary>
                                <dl>
                                    <div>
                                        <dt>Minimalny wiek</dt>
                                        <dd>{task.volunteerNeeds.minAge} lat</dd>
                                    </div>
                                    <div>
                                        <dt>Umiejętności</dt>
                                        <dd>{task.volunteerNeeds.skills.join(', ')}</dd>
                                    </div>
                                    <div>
                                        <dt>Doświadczenie</dt>
                                        <dd>{task.volunteerNeeds.experience}</dd>
                                    </div>
                                    <div>
                                        <dt>Dodatkowe informacje</dt>
                                        <dd>{task.volunteerNeeds.additional}</dd>
                                    </div>
                                </dl>
                            </details>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    )
}
