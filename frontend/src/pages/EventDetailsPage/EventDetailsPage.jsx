// src/pages/EventDetailsPage/EventDetailsPage.jsx
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './EventDetailsPage.module.scss'
import { fetchEventDetails } from '../../api/event.js'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const defaultCenter = [50.06465, 19.94498] // Kraków fallback
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
        let mounted = true
        setLoading(true)
        fetchEventDetails(eventId)
            .then((data) => {
                if (mounted) setEvent(data)
            })
            .catch(() => {
                if (mounted) setEvent(null)
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })
        return () => {
            mounted = false
        }
    }, [eventId])

    if (loading) {
        return (
            <section className={styles.page}>
                <p>Ładowanie…</p>
            </section>
        )
    }

    if (!event) {
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
    }

    const {
        name,
        shortDescription,
        longDescription,
        dateFrom,
        dateTo,
        place,
        city,
        address,
        taskItems,
        latitude,
        longitude,
    } = event || {}

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
                        {dateFrom ? new Date(dateFrom).toLocaleDateString() : ''} —
                        {dateTo ? ` ${new Date(dateTo).toLocaleDateString()}` : ''}
                    </span>
                    <h1>{name ?? 'Bez nazwy'}</h1>
                    <p>{shortDescription ?? 'Brak opisu'}</p>
                </div>
                <dl className={styles.heroFacts}>
                    <div>
                        <dt>Miejsce</dt>
                        <dd>{place ?? '-'}</dd>
                    </div>
                    <div>
                        <dt>Miasto</dt>
                        <dd>{city ?? '-'}</dd>
                    </div>
                    <div>
                        <dt>Adres</dt>
                        <dd>{address ?? '-'}</dd>
                    </div>
                </dl>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Opis</h2>
                </div>
                <p className={styles.description}>{longDescription ?? 'Brak szczegółowego opisu.'}</p>
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
                                    `${place ?? ''} ${city ?? ''} ${address ?? ''}`.trim()
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
                                    <div>{place ?? ''}</div>
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

            {Array.isArray(taskItems) && taskItems.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Zadania do zrealizowania</h2>
                    </div>
                    <div className={styles.tasksGrid}>
                        {taskItems.map((task) => (
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
