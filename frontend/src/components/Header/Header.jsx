import { NavLink } from 'react-router-dom'
import styles from './Header.module.scss'

const navigationItems = [
    { to: '/dashboard', label: 'Panel główny' },
    { to: '/organizer', label: 'Panel organizatora' },
    { to: '/volunteer', label: 'Panel wolontariusza' },
    { to: '/events-actions', label: 'Wydarzenia i działania' },
    { to: '/coordinator', label: 'Koordynator' },
    { to: '/map', label: 'Mapa' },
]

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.brandWrap}>
                <img
                    src="/assets/mlodzi_dzialaja_logo_small.png"
                    alt="Młodzi działają"
                    className={styles.brand}
                    height={40}
                />
            </div>

            <nav className={styles.nav}>
                {navigationItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}
