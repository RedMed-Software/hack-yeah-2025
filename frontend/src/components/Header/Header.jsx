import { NavLink } from 'react-router-dom'
import styles from './Header.module.scss'

const navigationItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/organizer', label: 'Organizer' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/events-actions', label: 'Wydarzenia i działania' },
    { to: '/map', label: 'Map' },
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
