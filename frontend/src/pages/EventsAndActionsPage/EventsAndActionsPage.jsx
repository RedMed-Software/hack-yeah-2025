import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import styles from './EventsAndActionsPage.module.scss'
import { search, EventStatus } from '../../api/event'
import { Link, useNavigate } from 'react-router-dom'
import { getAccountIdByOrganizerId } from '../../api/organizer';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
})

const defaultCenter = [50.06465, 19.94498]

const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

const formatTimeRange = (from, to) => `${from} – ${to}`

const getAvailabilityTag = (date, timeFrom, timeTo) => {
    if (!date) return '-'
    const parsedDate = new Date(date)
    const day = parsedDate.getDay()
    const isWeekend = day === 0 || day === 6
    const fromHour = Number((timeFrom || '').split(':')[0] || 0)
    const toHour = Number((timeTo || '').split(':')[0] || 0)
    if (isWeekend) return 'weekend'
    if (fromHour >= 16 || toHour >= 18) return 'evening'
    return 'weekday'
}

function safeParseRoles() {
    try {
        const raw = localStorage.getItem('authRoles')
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.map((r) => String(r).toLowerCase())
        if (typeof parsed === 'string') return parsed.split(',').map((s) => s.trim().toLowerCase())
    } catch {
        return []
    }
    const acc = localStorage.getItem('authAccountType')
    return acc ? [String(acc).toLowerCase()] : []
}

export default function EventsAndActionsPage() {
    const [eventsPointers, setEventsPointers] = useState([])
    const [center, setCenter] = useState(defaultCenter)
    const [loadingMap, setLoadingMap] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const roles = safeParseRoles()
    const canCreate = roles.includes('organizer') || roles.includes('organizator')
    const userType = localStorage.getItem('authAccountType');

    useEffect(() => {
        console.log(roles)
        let mounted = true
        const fetchEvents = async () => {
            setLoadingMap(true)
            try {
                const data = (await search(EventStatus.Registered)) || []
                if (!mounted) return
                setEventsPointers(data)
                if (Array.isArray(data) && data.length > 0) {
                    const valid = data.filter((p) =>
                        p.latitude && p.longitude &&
                        Number.isFinite(p.latitude) && Number.isFinite(p.longitude)
                    )
                    if (valid.length > 0) {
                        const lat = valid.reduce((s, p) => s + p.latitude, 0) / valid.length
                        const lng = valid.reduce((s, p) => s + p.longitude, 0) / valid.length
                        setCenter([lat, lng])
                    } else {
                        setCenter(defaultCenter)
                    }
                } else {
                    setCenter(defaultCenter)
                }
            } catch (error) {
                console.error('Error fetching events:', error)
                setEventsPointers([])
                setCenter(defaultCenter)
            } finally {
                if (mounted) setLoadingMap(false)
            }
        }
        fetchEvents()
        return () => {
            mounted = false
        }
    }, [])

    const matchesSearch = (ev, q) => {
        if (!q) return true
        const hay = [
            ev.name,
            ev.place,
            ev.city,
            ev.address,
            ev.summary,
            ...(ev.focusAreas || []),
        ]
            .join(' ')
            .toLowerCase()
        return hay.includes(q)
    }

    const filteredPointers = useMemo(() => {
        const q = (searchQuery || '').trim().toLowerCase()
        return eventsPointers.filter((ev) => matchesSearch(ev, q))
    }, [eventsPointers, searchQuery])

    const demands = useMemo(() => {
        return filteredPointers.flatMap((event) =>
            (event.tasks || []).map((task) => {
                console.log(task, 'aaaaaa')
                const city = event.city || event.mainLocation?.city || ''
                const venue = event.place || event.mainLocation?.venue || ''
                const address = event.address || event.mainLocation?.address || ''

                const availability = getAvailabilityTag(task.date, task.timeFrom, task.timeTo)
                return {
                    id: task.id || `${event.id}-${task.title}`,
                    eventId: event.id,
                    eventName: event.name,
                    eventStatus: event.status,
                    organizerId: event.organizerId,
                    city: city,
                    venue: venue,
                    address: address,
                    focusAreas: event.focusAreas || [],
                    summary: event.summary || '',
                    date: task.date,
                    timeFrom: task.timeFrom,
                    timeTo: task.timeTo,
                    taskTitle: task.title,
                    taskDescription: task.description,
                    volunteerNeeds: task.volunteerNeeds || {
                        minAge: 0,
                        skills: [],
                        experience: '',
                        additional: ''
                    },
                    availability,
                }
            })
        )
    }, [filteredPointers])

    const filteredDemands = useMemo(() => {
        console.log('Filtering demands:', demands) // Debug log
        const q = (searchQuery || '').trim().toLowerCase();

        const filtered = demands.filter((demand) => {
            if (!q) return true
            const hay = [
                demand.eventName,
                demand.organizerId,
                demand.taskTitle,
                demand.taskDescription,
                demand.summary,
                demand.venue,
                demand.city,
                ...(demand.focusAreas || []),
            ]
                .join(' ')
                .toLowerCase()
            return hay.includes(q)
        })
        return filtered
    }, [demands, searchQuery])

    const getEventLink = (eventId) => {
        if (roles.includes('organizer') || roles.includes('organizator')) {
            return `/organizer/events/${eventId}`
        }

        return `/${userType}/events/${eventId}`
    }

    const handleChatWithOrganizer = async (organizerId) => {
        try {
            const accountId = await getAccountIdByOrganizerId(organizerId);
            if (accountId) {
                navigate(`/chat?accountId=${accountId}`);
            }
        } catch (err) {
            alert('Nie udało się pobrać konta organizatora.');
        }
    };

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>Wydarzenia i działania</h1>
                    <p>Odkryj aktualne potrzeby wolontariuszy i wybierz zadania, które najlepiej pasują do Twoich kompetencji.</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchRow}>
                        <input
                            aria-label="Wyszukaj wydarzenia"
                            placeholder="Szukaj nazw, miejsc, tematów..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery ? (
                            <button type="button" className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                                ✕
                            </button>
                        ) : null}
                    </div>

                    {canCreate ? (
                        <button type="button" className={styles.applyBtn} onClick={() => navigate('/organizer/events/create')}>
                            Dodaj nowe wydarzenie
                        </button>
                    ) : null}
                </div>
            </header>

            <section className={styles.mapSection} aria-label="Mapa wydarzeń">
                <div className={styles.mapHeader}>
                    <h2>Mapa aktywnych wydarzeń</h2>
                    <p>Zobacz, gdzie aktualnie poszukiwane są osoby do wsparcia. Kliknij znacznik, aby poznać szczegółów.</p>
                </div>

                <div className={styles.mapWrapper}>
                    {loadingMap ? (
                        <p>Ładowanie mapy...</p>
                    ) : (
                        <MapContainer center={center} zoom={10} scrollWheelZoom className={styles.map}>
                            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {filteredPointers
                                .filter((ev) => ev.latitude && ev.longitude && Number.isFinite(ev.latitude) && Number.isFinite(ev.longitude))
                                .map((ev) => (
                                    <Marker key={ev.id} position={[ev.latitude, ev.longitude]} icon={markerIcon}>
                                        <Popup>
                                            <div className={styles.popup}>
                                                <h3 className={styles.popupTitle}>{ev.name}</h3>
                                                <p className={styles.popupDate}>
                                                    {ev.dates?.start ? new Date(ev.dates.start).toLocaleDateString() : 'Brak daty'} – {ev.dates?.end ? new Date(ev.dates.end).toLocaleDateString() : 'Brak daty'}
                                                </p>
                                                <p className={styles.popupPlace}>
                                                    {ev.place || ev.mainLocation?.venue}, {ev.city || ev.mainLocation?.city}
                                                </p>
                                                <Link className={styles.detailsLink} to={getEventLink(ev.id)}>
                                                    Przejdź do szczegółów
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                        </MapContainer>
                    )}
                </div>
            </section>

            <section className={styles.results} aria-label="Lista dopasowanych zapotrzebowań">
                <header className={styles.resultsHeader}>
                    <h2>Dostępne zadania wolontariackie</h2>
                    <span className={styles.resultCount}>{filteredDemands.length} dostępnych zadań</span>
                </header>

                <ul className={styles.resultsList}>
                    {filteredDemands.map((demand) => (
                        <li key={demand.id} className={styles.resultCard}>
                            <article className={styles.cardInner} aria-labelledby={`task-${demand.id}`}>
                                <header className={styles.cardHeader}>
                                    <div className={styles.headerLeft}>
                                        <div className={styles.eventMetaLine}>
                                            <span className={styles.eventLabel}>Wydarzenie</span>
                                            <span className={styles.eventName}>{demand.eventName || '—'}</span>
                                        </div>

                                        <h3 id={`task-${demand.id}`} className={styles.taskTitle}>
                                            {demand.taskTitle || 'Zadanie'}
                                        </h3>

                                        <div className={styles.headSub}>
                                            <time className={styles.taskDate} dateTime={demand.date || ''}>
                                                {demand.date ? formatDate(demand.date) : 'Brak daty'}
                                            </time>
                                            <span className={styles.taskTime}> · {formatTimeRange(demand.timeFrom, demand.timeTo)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.headerRight}>
                                        <div className={styles.badges}>
                                            {(Array.isArray(demand.focusAreas) ? demand.focusAreas : (demand.focusAreas ? String(demand.focusAreas).split(',') : []))
                                                .slice(0, 3)
                                                .map((fa) => (
                                                    <span key={fa} className={styles.tag}>
                                                        {fa}
                                                    </span>
                                                ))}
                                        </div>
                                        <div className={styles.locationShort}>
                                            <span className={styles.city}>{demand.city || '—'}</span>
                                        </div>
                                    </div>
                                </header>

                                <div className={styles.metaGrid} role="group" aria-label="Szczegóły zadania">
                                    <div className={styles.metaItem}>
                                        <dt className={styles.metaLabel}>Miejsce</dt>
                                        <dd className={styles.metaValue}>{demand.venue || '—'}</dd>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <dt className={styles.metaLabel}>Adres</dt>
                                        <dd className={styles.metaValue}>{demand.address || '—'}</dd>
                                    </div>
                                </div>

                                <p className={styles.resultDescription}>{demand.taskDescription || demand.summary || 'Brak opisu'}</p>

                                <div className={styles.infoGrid}>
                                    <div className={styles.infoBlock}>
                                        <h4 className={styles.infoTitle}>Wymagane umiejętności</h4>
                                        <ul className={styles.skillList}>
                                            {Array.isArray(demand.volunteerNeeds?.skills) && demand.volunteerNeeds.skills.length > 0 ? (
                                                demand.volunteerNeeds.skills.map((skill) => <li key={skill} className={styles.skillItem}>{skill}</li>)
                                            ) : (
                                                <li className={styles.skillItem}>Brak szczególnych wymagań</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className={styles.infoBlock}>
                                        <h4 className={styles.infoTitle}>Warunki</h4>
                                        <ul className={styles.conditionsList}>
                                            <li>Minimalny wiek: <strong>{demand.volunteerNeeds?.minAge ?? '—'}</strong></li>
                                            {demand.volunteerNeeds?.experience && <li>Doświadczenie: {demand.volunteerNeeds.experience}</li>}
                                            {demand.volunteerNeeds?.additional && <li>{demand.volunteerNeeds.additional}</li>}
                                        </ul>
                                    </div>
                                </div>

                                <footer className={styles.cardFooter}>
                                    <div className={styles.venueLine}>
                                        <span className={styles.venueName}>{demand.venue || '—'}</span>
                                        {demand.address ? <span className={styles.venueAddr}>, {demand.address}</span> : null}
                                    </div>

                                    <div className={styles.actions}>
                                        <Link to={getEventLink(demand.eventId)} className={styles.detailsLink}>
                                            Szczegóły
                                        </Link>
                                        <Link to={`/chat?eventId=${demand.eventId}`} className={styles.detailsLink} style={{marginLeft: '0.5rem'}}>
                                            Chat eventu
                                        </Link>
                                        <button
                                            type="button"
                                            className={styles.detailsLink}
                                            style={{marginLeft: '0.5rem'}}
                                            onClick={() => handleChatWithOrganizer(demand.organizerId)}
                                        >
                                            Chat z organizatorem
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.applyBtn}
                                            onClick={() => {
                                                console.log('Zgłoś chęć udziału', demand.id)
                                            }}
                                        >
                                            Zgłoś chęć udziału
                                        </button>
                                    </div>
                                </footer>
                            </article>
                        </li>
                    ))}
                </ul>


                {filteredDemands.length === 0 && !loadingMap && (
                    <div className={styles.emptyState}>
                        <h3>Brak wyników</h3>
                        <p>Spróbuj zmienić kryteria wyszukiwania, aby zobaczyć więcej propozycji.</p>
                    </div>
                )}
            </section>
        </section>
    )
}