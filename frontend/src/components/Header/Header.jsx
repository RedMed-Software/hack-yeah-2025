import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'

const navigationItems = [
    { to: '/dashboard', label: 'Panel główny' },
    { to: '/organizer', label: 'Panel organizatora', roles: ['organizer'] },
    { to: '/volunteer', label: 'Panel wolontariusza', roles: ['volunteer'] },
    { to: '/events-actions', label: 'Wydarzenia i działania' },
    { to: '/coordinator', label: 'Koordynator', roles: ['coordinator'] },
    { to: '/map', label: 'Mapa' },
]

export default function Header() {

    const navigate = useNavigate()
    const token = localStorage.getItem('authToken')
    const roles = [localStorage.getItem('authAccountType')]

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''
        const onKey = (e) => {
            if (e.key === 'Escape') setIsMenuOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [isMenuOpen])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authRoles')
        localStorage.removeItem('authAccountType')
        navigate('/', { replace: true })
        window.location.reload()
    }

    const isAllowed = (item) => {
        if (!token) return false
        if (!item.roles || item.roles.length === 0) return true
        const required = item.roles.map(r => String(r).toLowerCase())
        return required.some(rr => roles.includes(rr))
    }

    const handleNavClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <header className={styles.header}>
            <div className={styles.brandWrap}> <img src="/assets/mlodzi_dzialaja_logo_small2.png" alt="Młodzi działają" className={styles.brand} height={40} /> </div>

            <button
                type="button"
                className={styles['menu-toggle']}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
                onClick={() => setIsMenuOpen((s) => !s)}
            >
                <span className={styles['menu-icon']}>☰</span>
            </button>

            <nav
                className={`${styles.nav} ${isMenuOpen ? styles.isOpen : ''}`}
                aria-hidden={!isMenuOpen && window.innerWidth < 768}
                onClick={handleNavClick}
            >
                {isMenuOpen ? (
                    <button
                        type="button"
                        className={styles['closeMenu']}
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
                        onClick={() => setIsMenuOpen((s) => !s)}
                    >
                        <span className={styles['menu-icon']}>✕</span>
                    </button>
                ) : null}
                {navigationItems.map((item) =>
                    isAllowed(item) ? (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                            onClick={handleNavClick}
                        >
                            {item.label}
                        </NavLink>
                    ) : null
                )}
                <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                    Wyloguj
                </button>
            </nav>
        </header>
    )
}
