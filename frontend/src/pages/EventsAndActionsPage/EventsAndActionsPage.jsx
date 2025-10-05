// src/pages/EventsAndActionsPage/EventsAndActionsPage.jsx
import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import styles from './EventsAndActionsPage.module.scss'
import { search, EventStatus } from '../../api/event'
import { Link, useNavigate } from 'react-router-dom'

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
})

const initialFilters = {
    city: '',
    focusArea: '',
    skill: '',
    availability: '',
    age: '',
}

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

const calculateMatchScore = (demand, filters) => {
    let score = 40
    if (filters.city && demand.city === filters.city) {
        score += 15
    }
    if (filters.focusArea && demand.focusAreas.includes(filters.focusArea)) {
        score += 20
    }
    if (filters.skill && demand.volunteerNeeds.skills.includes(filters.skill)) {
        score += 20
    }
    if (filters.availability) {
        const isWeekend = demand.availability === 'weekend'
        const isEvening = demand.availability === 'evening'
        if (
            (filters.availability === 'weekend' && isWeekend) ||
            (filters.availability === 'weekday' && !isWeekend) ||
            (filters.availability === 'evening' && isEvening)
        ) {
            score += 15
        }
    }
    if (filters.age) {
        const volunteerAge = Number(filters.age)
        if (Number.isFinite(volunteerAge) && volunteerAge >= demand.volunteerNeeds.minAge) {
            score += 10
        }
    }
    return Math.min(score, 100)
}

const getAvailabilityTag = (date, timeFrom, timeTo) => {
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
    const [filters, setFilters] = useState(initialFilters)
    const [eventsPointers, setEventsPointers] = useState([])
    const [center, setCenter] = useState(defaultCenter)
    const [loadingMap, setLoadingMap] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const roles = safeParseRoles()
    const canCreate = roles.includes('organizer') || roles.includes('organizator')

    useEffect(() => {
        let mounted = true
        const fetchEvents = async () => {
            setLoadingMap(true)
            try {
                const data = (await search(EventStatus.Registered)) || []
                if (!mounted) return
                setEventsPointers(data)
                if (Array.isArray(data) && data.length > 0) {
                    const valid = data.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
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
            } catch {
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

    const demands = useMemo(
        () =>
            filteredPointers.flatMap((event) =>
                (event.tasks || []).map((task) => {
                    const availability = getAvailabilityTag(task.date, task.timeFrom, task.timeTo)
                    return {
                        id: task.id,
                        eventId: event.id,
                        eventName: event.name,
                        eventStatus: event.status,
                        city: event.mainLocation?.city || '',
                        venue: event.mainLocation?.venue || '',
                        address: event.mainLocation?.address || '',
                        focusAreas: event.focusAreas || [],
                        summary: event.summary || '',
                        date: task.date,
                        timeFrom: task.timeFrom,
                        timeTo: task.timeTo,
                        taskTitle: task.title,
                        taskDescription: task.description,
                        volunteerNeeds: task.volunteerNeeds || { minAge: 0, skills: [], experience: '', additional: '' },
                        availability,
                    }
                })
            ),
        []
    )

    const filteredDemands = useMemo(() => {
        const q = (searchQuery || '').trim().toLowerCase()
        return demands
            .filter((demand) => {
                if (filters.city && demand.city !== filters.city) return false
                if (filters.focusArea && !demand.focusAreas.includes(filters.focusArea)) return false
                if (filters.skill && !demand.volunteerNeeds.skills.includes(filters.skill)) return false
                if (filters.availability) {
                    if (filters.availability === 'weekend' && demand.availability !== 'weekend') return false
                    if (filters.availability === 'weekday' && demand.availability === 'weekend') return false
                    if (filters.availability === 'evening' && demand.availability !== 'evening') return false
                }
                if (filters.age) {
                    const volunteerAge = Number(filters.age)
                    if (Number.isFinite(volunteerAge) && volunteerAge < demand.volunteerNeeds.minAge) return false
                }
                if (q) {
                    const hay = [
                        demand.eventName,
                        demand.taskTitle,
                        demand.taskDescription,
                        demand.summary,
                        demand.venue,
                        demand.city,
                        ...(demand.focusAreas || []),
                    ]
                        .join(' ')
                        .toLowerCase()
                    if (!hay.includes(q)) return false
                }
                return true
            })
            .map((demand) => ({ ...demand, matchScore: calculateMatchScore(demand, filters) }))
            .sort((a, b) => b.matchScore - a.matchScore)
    }, [demands, filters, searchQuery])

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
                    <p>Zobacz, gdzie aktualnie poszukiwane są osoby do wsparcia. Kliknij znacznik, aby poznać szczegóły.</p>
                </div>

                <div className={styles.mapWrapper}>
                    {loadingMap ? (
                        <p>Ładowanie mapy...</p>
                    ) : (
                        <MapContainer center={center} zoom={10} scrollWheelZoom className={styles.map}>
                            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {filteredPointers
                                .filter((ev) => Number.isFinite(ev.latitude) && Number.isFinite(ev.longitude))
                                .map((ev) => (
                                    <Marker key={ev.id} position={[ev.latitude, ev.longitude]} icon={markerIcon}>
                                        <Popup>
                                            <div className={styles.popup}>
                                                <h3 className={styles.popupTitle}>{ev.name}</h3>
                                                <p className={styles.popupDate}>
                                                    {ev.dateFrom ? new Date(ev.dateFrom).toLocaleDateString() : ''} –{' '}
                                                    {ev.dateTo ? new Date(ev.dateTo).toLocaleDateString() : ''}
                                                </p>
                                                <p className={styles.popupPlace}>
                                                    {ev.place ?? ''}, {ev.city ?? ''}
                                                </p>
                                                <Link className={styles.detailsLink} to={`/organizer/events/${ev.id}`}>
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
                    <h2>Najlepsze dopasowania dla Ciebie</h2>
                    <span className={styles.resultCount}>{filteredDemands.length} dostępnych zadań</span>
                </header>

                <ul className={styles.resultsList}>
                    {filteredDemands.map((demand) => (
                        <li key={demand.id} className={styles.resultCard}>
                            <div className={styles.resultHeader}>
                                <div>
                                    <span className={styles.resultEvent}>{demand.eventName}</span>
                                    <h3>{demand.taskTitle}</h3>
                                </div>
                                <div className={styles.scoreBadge}>
                                    <span>Dopasowanie</span>
                                    <strong>{demand.matchScore}%</strong>
                                </div>
                            </div>

                            <div className={styles.resultMeta}>
                                <span>{demand.city}</span>
                                <span>{formatDate(demand.date)}</span>
                                <span>{formatTimeRange(demand.timeFrom, demand.timeTo)}</span>
                            </div>

                            <p className={styles.resultDescription}>{demand.taskDescription}</p>

                            <div className={styles.resultDetails}>
                                <div>
                                    <h4>Wymagane umiejętności</h4>
                                    <ul>
                                        {(demand.volunteerNeeds.skills || []).map((skill) => (
                                            <li key={skill}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4>Warunki</h4>
                                    <ul>
                                        <li>Minimalny wiek: {demand.volunteerNeeds.minAge} lat</li>
                                        <li>Doświadczenie: {demand.volunteerNeeds.experience}</li>
                                        <li>{demand.volunteerNeeds.additional}</li>
                                    </ul>
                                </div>
                            </div>

                            <footer className={styles.resultFooter}>
                                <span>
                                    {demand.venue}, {demand.address}
                                </span>
                                <button type="button" className={styles.applyBtn}>
                                    Zgłoś chęć udziału
                                </button>
                            </footer>
                        </li>
                    ))}
                </ul>

                {filteredDemands.length === 0 && (
                    <div className={styles.emptyState}>
                        <h3>Brak wyników</h3>
                        <p>Spróbuj zmienić kryteria wyszukiwania, aby zobaczyć więcej propozycji.</p>
                    </div>
                )}
            </section>
        </section>
    )
}
