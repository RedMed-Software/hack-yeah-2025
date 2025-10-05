import styles from './MapPage.module.scss'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { searchForMap } from '../../api/event'


const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
})


export default function MapPage() {
    const [events, setEvents] = useState([]);
    const [center, setCenter] = useState([0, 0]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await searchForMap();
            console.log(data)
            setEvents(data);
            const lat = data.reduce((sum, p) => sum + p.latitude, 0) / data.length;
            const lng = data.reduce((sum, p) => sum + p.longitude, 0) / data.length;
            setCenter([lat, lng]);
        };

        fetchEvents();
    }, []);

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <h1>Mapa wydarzeń</h1>
                <p>
                    Odkryj aktualne potrzeby wolontariuszy i wybierz zadania, które najlepiej pasują do Twoich
                    kompetencji, dostępności i obszarów zaangażowania.
                </p>
            </header>
            <div className={styles['map-wrapper']}>
                {events.length > 0 ? (
                    <MapContainer center={center} zoom={5} scrollWheelZoom className={styles.map}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {events.map((event) => (
                            <Marker key={event.id} position={[event.latitude, event.longitude]} icon={markerIcon}>
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
                ) : (
                    <p>Ładowanie mapy...</p>
                )}
            </div>
        </section>
    )
}