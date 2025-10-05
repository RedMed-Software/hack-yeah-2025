// src/pages/EventDetailsPage/EventDetailsPage.jsx
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './EventDetailsPage.module.scss'
import { fetchEventDetails, EventStatus, EventStatusTranslate } from '../../api/event.js'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const defaultCenter = [50.06465, 19.94498]
const defaultZoom = 13

const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

export default function EventDetailsPage() {
    const { eventId } = useParams()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userId = localStorage.getItem('authAccountId');
        console.log('asdgasdg')
        let mounted = true
        setLoading(true)
        fetchEventDetails(eventId, userId)
            .then((data) => mounted && setEvent(data))
            .catch(() => mounted && setEvent(null))
            .finally(() => mounted && setLoading(false))
        return () => {
            mounted = false
        }
    }, [eventId])

    if (loading)
        return (
            <section className={styles.page}>
                <p>Ładowanie…</p>
            </section>
        )

    if (!event)
        return (
            <section className={styles.page}>
                <nav className={styles.breadcrumbs}>
                    <Link to="/organizer">Panel organizatora</Link>
                </nav>
                <div className={styles.notFound}>
                    <h1>Nie znaleziono wydarzenia</h1>
                    <p>Sprawdź adres lub wróć do panelu organizatora.</p>
                    <Link className={styles.primaryLink} to="/organizer">
                        Wróć do listy wydarzeń
                    </Link>
                </div>
            </section>
        )

    const {
        name,
        summary,
        description,
        status,
        dates,
        mainLocation,
        focusAreas,
        capacity,
        latitude,
        longitude,
        organizer,
        tasks,
    } = event

    const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude)
    const center = hasCoords ? [latitude, longitude] : defaultCenter

    return (
        <section className={styles.page}>
            <nav className={styles.breadcrumbs}>
                <Link to="/organizer">Panel organizatora</Link>
                <span aria-hidden="true">/</span>
                <span>{name ?? 'Brak nazwy'}</span>
            </nav>

            <header className={styles.hero}>
                <div className={styles.heroIntro}>
                    <span className={styles.heroBadge}>
                        {dates?.start ? new Date(dates.start).toLocaleDateString() : ''} —
                        {dates?.end ? ` ${new Date(dates.end).toLocaleDateString()}` : ''}
                    </span>
                    <h1>{name ?? 'Bez nazwy'}</h1>
                    <p>{summary ?? 'Brak opisu skróconego'}</p>
                </div>
                <dl className={styles.heroFacts}>
                    <div>
                        <dt>Miejsce</dt>
                        <dd>{mainLocation?.venue ?? '-'}</dd>
                    </div>
                    <div>
                        <dt>Miasto</dt>
                        <dd>{mainLocation?.city ?? '-'}</dd>
                    </div>
                    <div>
                        <dt>Adres</dt>
                        <dd>{mainLocation?.address ?? '-'}</dd>
                    </div>
                    <div>
                        <dt>Obszary tematyczne</dt>
                        <dd>
                            {focusAreas
                                ? focusAreas.split(',').map((a) => (
                                    <span key={a.trim()} className={styles.eventTag}>
                                        {a.trim()}
                                    </span>
                                ))
                                : '-'}
                        </dd>
                    </div>
                    <div>
                        <dt>Limit uczestników</dt>
                        <dd>{capacity?.participants ?? '-'}</dd>
                    </div>
                    <div>
                        <dt>Limit wolontariuszy</dt>
                        <dd>{capacity?.volunteers ?? '-'}</dd>
                    </div>
                </dl>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Opis</h2>
                </div>
                <p className={styles.description}>{description ?? 'Brak szczegółowego opisu.'}</p>
            </section>

            <section className={styles.hero}>
                <div className={styles.heroIntro}>
                <div className={styles.sectionHeader}>
                    <h1>Status wydarzenia</h1>
                </div>
                <p className={styles.description}>{EventStatusTranslate.find(s => s.enumValue == status).valueTranslate}</p>
                </div>
                <dl className={styles.heroFacts}>
                    {status == EventStatus.Registered ?  
                        <div className={styles.tagsContainer}>
                            <div className={styles.actions}>
                                {/* jeszcze zabezpieczyc na rto jakby wolontariusz czy koordybnator by wbil */}
                            {/* /event/complete-event/${event.id} */}
                                <button type="submit" className={styles.submitButton}>
                                    Zakończ
                                </button>
                            </div>
                        </div> 
                        :
                        <div>
                        </div>    
                }
                </dl>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Lokalizacja</h2>
                    <a
                        className={styles.mapLink}
                        href={
                            hasCoords
                                ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${defaultZoom}/${latitude}/${longitude}`
                                : `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                                    `${mainLocation?.venue ?? ''} ${mainLocation?.city ?? ''} ${mainLocation?.address ?? ''}`.trim()
                                )}`
                        }
                        target="_blank"
                        rel="noreferrer"
                    >
                        Otwórz w nowej karcie
                    </a>
                </div>

                <div className={styles.mapWrapper}>
                    {hasCoords ? (
                        <MapContainer center={center} zoom={defaultZoom} scrollWheelZoom className={styles.map}>
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={center} icon={markerIcon}>
                                <Popup>
                                    <strong>{name ?? 'Wydarzenie'}</strong>
                                    <div>{mainLocation?.venue ?? ''}</div>
                                    <div>
                                        {latitude}, {longitude}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <p>Brak współrzędnych dla tego wydarzenia — spróbuj wyszukać lokalizację.</p>
                    )}
                </div>
            </section>

            {organizer && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Organizator</h2>
                    </div>
                    <div className={styles.organizerCard}>
                        <h3>{organizer.fullName}</h3>
                        <p>{organizer.role}</p>
                        <p>{organizer.email}</p>
                        <p>{organizer.phone}</p>
                        <p>
                            <strong>Języki:</strong> {organizer.languages}
                        </p>
                        <p>
                            <strong>Specjalizacje:</strong> {organizer.specializations}
                        </p>
                        {organizer.organization && (
                            <div className={styles.organizationInfo}>
                                <h4>{organizer.organization.name}</h4>
                                <p>{organizer.organization.location}</p>
                                <p>{organizer.organization.programs}</p>
                                <p>{organizer.organization.mission}</p>
                                <a href={organizer.organization.website} target="_blank" rel="noreferrer">
                                    Strona organizacji
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {Array.isArray(tasks) && tasks.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Zadania</h2>
                    </div>
                    <div className={styles.tasksGrid}>
                        {tasks.map((task) => (
                            <article key={task.id} className={styles.taskCard}>
                                <header>
                                    <h3>{task.title ?? 'Brak tytułu'}</h3>
                                    <p>{task.description ?? 'Brak opisu'}</p>
                                </header>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </section>
    )
}
