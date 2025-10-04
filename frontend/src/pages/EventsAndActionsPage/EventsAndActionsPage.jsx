import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import styles from './EventsAndActionsPage.module.scss'
import { searchForMap } from '../../api/event'
import { events } from '../../data/events.js'

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
})

const cityCoordinates = {
    Warszawa: [52.2297, 21.0122],
    'Łódź': [51.7592, 19.455],
    'Gdańsk': [54.352, 18.6466],
}

const availabilityOptions = [
    { value: 'weekday', label: 'Dni robocze' },
    { value: 'weekend', label: 'Weekend' },
    { value: 'evening', label: 'Popołudnia i wieczory' },
]

const initialFilters = {
    city: '',
    focusArea: '',
    skill: '',
    availability: '',
    age: '',
}

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
    const fromHour = Number(timeFrom.split(':')[0])
    const toHour = Number(timeTo.split(':')[0])
    if (isWeekend) {
        return 'weekend'
    }
    if (fromHour >= 16 || toHour >= 18) {
        return 'evening'
    }
    return 'weekday'
}

export default function EventsAndActionsPage() {
    const [filters, setFilters] = useState(initialFilters)
    const [eventsPointers, setEventsPointers] = useState([]);
    const [center, setCenter] = useState([0, 0]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await searchForMap();
            setEventsPointers(data);
            const lat = data.reduce((sum, p) => sum + p.latitude, 0) / data.length;
            const lng = data.reduce((sum, p) => sum + p.longitude, 0) / data.length;
            setCenter([lat, lng]);
        };

        fetchEvents();
    }, []);


    const demands = useMemo(
        () =>
            events.flatMap((event) =>
                event.tasks.map((task) => {
                    const availability = getAvailabilityTag(task.date, task.timeFrom, task.timeTo)
                    return {
                        id: task.id,
                        eventId: event.id,
                        eventName: event.name,
                        eventStatus: event.status,
                        city: event.mainLocation.city,
                        venue: event.mainLocation.venue,
                        address: event.mainLocation.address,
                        focusAreas: event.focusAreas,
                        summary: event.summary,
                        date: task.date,
                        timeFrom: task.timeFrom,
                        timeTo: task.timeTo,
                        taskTitle: task.title,
                        taskDescription: task.description,
                        volunteerNeeds: task.volunteerNeeds,
                        availability,
                    }
                })
            ),
        []
    )

    const cities = useMemo(() => Array.from(new Set(events.map((event) => event.mainLocation.city))), [])
    const focusAreas = useMemo(
        () => Array.from(new Set(events.flatMap((event) => event.focusAreas))),
        []
    )
    const skills = useMemo(
        () =>
            Array.from(
                new Set(
                    events.flatMap((event) =>
                        event.tasks.flatMap((task) => task.volunteerNeeds.skills)
                    )
                )
            ),
        []
    )

    const filteredDemands = useMemo(() => {
        return demands
            .filter((demand) => {
                if (filters.city && demand.city !== filters.city) {
                    return false
                }
                if (filters.focusArea && !demand.focusAreas.includes(filters.focusArea)) {
                    return false
                }
                if (filters.skill && !demand.volunteerNeeds.skills.includes(filters.skill)) {
                    return false
                }
                if (filters.availability) {
                    if (filters.availability === 'weekend' && demand.availability !== 'weekend') {
                        return false
                    }
                    if (filters.availability === 'weekday' && demand.availability === 'weekend') {
                        return false
                    }
                    if (filters.availability === 'evening' && demand.availability !== 'evening') {
                        return false
                    }
                }
                if (filters.age) {
                    const volunteerAge = Number(filters.age)
                    if (Number.isFinite(volunteerAge) && volunteerAge < demand.volunteerNeeds.minAge) {
                        return false
                    }
                }
                return true
            })
            .map((demand) => ({
                ...demand,
                matchScore: calculateMatchScore(demand, filters),
            }))
            .sort((a, b) => b.matchScore - a.matchScore)
    }, [demands, filters])

    const activeEvents = useMemo(() => {
        const grouped = new Map()
        filteredDemands.forEach((demand) => {
            if (!grouped.has(demand.eventId)) {
                grouped.set(demand.eventId, {
                    eventId: demand.eventId,
                    eventName: demand.eventName,
                    city: demand.city,
                    focusAreas: demand.focusAreas,
                    summary: demand.summary,
                    tasksCount: 0,
                })
            }
            const current = grouped.get(demand.eventId)
            current.tasksCount += 1
        })
        return Array.from(grouped.values())
    }, [filteredDemands])

    const handleFilterChange = (event) => {
        const { name, value } = event.target
        setFilters((current) => ({
            ...current,
            [name]: value,
        }))
    }

    const resetFilters = () => {
        setFilters(initialFilters)
    }

    const mapCenter = [52.0693, 19.4803]

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <span className={styles.eyebrow}>Wyszukiwarka akcji</span>
                <h1>Wydarzenia i działania</h1>
                <p>
                    Odkryj aktualne potrzeby wolontariuszy i wybierz zadania, które najlepiej pasują do Twoich
                    kompetencji, dostępności i obszarów zaangażowania.
                </p>
            </header>

            <section className={styles.filters} aria-label="Filtry dopasowania">
                <div className={styles.filterHeader}>
                    <h2>Doprecyzuj, czego szukasz</h2>
                    <button type="button" onClick={resetFilters} className={styles.resetButton}>
                        Wyczyść filtry
                    </button>
                </div>
                <div className={styles.filterGrid}>
                    <label className={styles.filterField}>
                        <span>Miasto</span>
                        <select name="city" value={filters.city} onChange={handleFilterChange}>
                            <option value="">Dowolne</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span>Obszar tematyczny</span>
                        <select name="focusArea" value={filters.focusArea} onChange={handleFilterChange}>
                            <option value="">Dowolny</option>
                            {focusAreas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span>Kluczowa umiejętność</span>
                        <select name="skill" value={filters.skill} onChange={handleFilterChange}>
                            <option value="">Dowolna</option>
                            {skills.map((skill) => (
                                <option key={skill} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span>Dostępność</span>
                        <select name="availability" value={filters.availability} onChange={handleFilterChange}>
                            <option value="">Dowolna</option>
                            {availabilityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span>Twój wiek</span>
                        <input
                            type="number"
                            name="age"
                            min="15"
                            max="80"
                            value={filters.age}
                            onChange={handleFilterChange}
                            placeholder="np. 19"
                        />
                    </label>
                </div>
            </section>

            <section className={styles.mapSection} aria-label="Mapa wydarzeń">
                <div className={styles.mapHeader}>
                    <h2>Mapa aktywnych wydarzeń</h2>
                    <p>
                        Zobacz, gdzie aktualnie poszukiwane są osoby do wsparcia. Kliknij znacznik, aby poznać
                        liczbę dostępnych zadań.
                    </p>
                </div>
                <div className={styles.mapWrapper}>
                    {eventsPointers.length > 0 ? (
                        <MapContainer center={center} zoom={5} scrollWheelZoom className={styles.map}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {eventsPointers.map((event) => (
                                <Marker key={event.id} position={[event.latitude, event.longitude]} icon={markerIcon}>
                                    <Popup>
                                        {event.title} <br /> {event.latitude}, {event.longitude}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <p>Ładowanie mapy...</p>
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
                                        {demand.volunteerNeeds.skills.map((skill) => (
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
                                <button type="button">Zgłoś chęć udziału</button>
                            </footer>
                        </li>
                    ))}
                </ul>
                {filteredDemands.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>Brak wyników</h3>
                        <p>Spróbuj poluzować kryteria wyszukiwania, aby zobaczyć więcej propozycji.</p>
                    </div>
                ) : null}
            </section>
        </section>
    )
}
