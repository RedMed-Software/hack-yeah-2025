import styles from './MapPage.module.scss'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
})

export default function MapPage() {
  return (
    <section className={styles.page}>
      <h1>Event map</h1>
      <div className={styles['map-wrapper']}>
        <MapContainer center={[49.9737, 20.0470]} zoom={8} scrollWheelZoom className={styles.map}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[49.9737, 20.0470]} icon={markerIcon}>
            <Popup>Małopolskie region</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  )
}