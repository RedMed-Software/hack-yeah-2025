import styles from './MapPage.module.scss'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { search, EventStatus } from '../../api/event'

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
})

// Komponent do automatycznego dostosowywania widoku mapy
function MapController({ events }) {
    const map = useMap()

    useEffect(() => {
        if (events.length > 0) {
            // Tworzymy bounds (granice) zawierające wszystkie markery
            const group = new L.FeatureGroup()
            events.forEach(event => {
                if (event.latitude && event.longitude) {
                    group.addLayer(L.marker([event.latitude, event.longitude]))
                }
            })

            // Jeśli mamy przynajmniej jeden marker, dostosowujemy widok
            if (group.getLayers().length > 0) {
                map.fitBounds(group.getBounds(), {
                    padding: [20, 20], // padding w pikselach
                    maxZoom: 15, // maksymalny zoom (aby nie przybliżać za bardzo)
                    animate: true // płynna animacja
                })
            }
        }
    }, [events, map])

    return null
}

export default function MapPage() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Domyślne centrum - można ustawić na Polskę lub inne
    const defaultCenter = [52.069, 19.480] // Środek Polski

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true)
            try {
                const data = await search(EventStatus.Registered);
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setIsLoading(false)
            }
        };

        fetchEvents();
    }, []);

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
        return events.filter((ev) => matchesSearch(ev, q))
    }, [events, searchQuery])

    // Filtrujemy eventy, które mają poprawne współrzędne
    const validEvents = useMemo(() => {
        return filteredPointers.filter(event =>
            event.latitude && event.longitude &&
            !isNaN(event.latitude) && !isNaN(event.longitude) &&
            Math.abs(event.latitude) <= 90 && Math.abs(event.longitude) <= 180
        )
    }, [filteredPointers])

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <h1>Mapa wydarzeń</h1>
                <p>
                    Odkryj aktualne potrzeby wolontariuszy i wybierz zadania, które najlepiej pasują do Twoich
                    kompetencji, dostępności i obszarów zaangażowania.
                </p>
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
            </header>
            <div className={styles['map-wrapper']}>
                {isLoading ? (
                    <p>Ładowanie mapy...</p>
                ) : (
                    <MapContainer
                        center={defaultCenter}
                        zoom={5}
                        scrollWheelZoom
                        className={styles.map}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Kontroler automatycznie dostosowujący widok */}
                        <MapController events={validEvents} />

                        {validEvents.map((event) => (
                            <Marker
                                key={event.id}
                                position={[event.latitude, event.longitude]}
                                icon={markerIcon}
                            >
                                <Popup>
                                    <div className={styles.popup}>
                                        <h3 className={styles.popupTitle}>{event.name}</h3>
                                        <p className={styles.popupDate}>
                                            {new Date(event.dateFrom).toLocaleDateString()} – {new Date(event.dateTo).toLocaleDateString()}
                                        </p>
                                        <p className={styles.popupPlace}>
                                            {event.place}, {event.city}
                                        </p>
                                        <Link className={styles.detailsLink} to={`/organizer/events/${event.id}`}>
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
    )
}