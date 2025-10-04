import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import PublicInfoPage from './pages/PublicInfoPage/PublicInfoPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx'
import OrganizerPanelPage from './pages/OrganizerPanelPage/OrganizerPanelPage.jsx'
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage.jsx'
import VolunteerPanelPage from './pages/VolunteerPanelPage/VolunteerPanelPage.jsx'
import MapPage from './pages/MapPage/MapPage.jsx'
import EventsAndActionsPage from './pages/EventsAndActionsPage/EventsAndActionsPage.jsx'

const STORAGE_TOKEN_KEY = 'hackyeah2025.auth.token'
const STORAGE_USER_KEY = 'hackyeah2025.auth.user'

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null, user: null }
  }
  try {
    const token = window.localStorage.getItem(STORAGE_TOKEN_KEY)
    const userRaw = window.localStorage.getItem(STORAGE_USER_KEY)
    const user = userRaw ? JSON.parse(userRaw) : null
    if (typeof token === 'string' && token.length > 0 && user) {
      return { token, user }
    }
  } catch {
    return { token: null, user: null }
  }
  return { token: null, user: null }
}

function persistAuth(token, user) {
  if (typeof window === 'undefined') {
    return
  }
  if (token && user) {
    window.localStorage.setItem(STORAGE_TOKEN_KEY, token)
    window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(STORAGE_TOKEN_KEY)
    window.localStorage.removeItem(STORAGE_USER_KEY)
  }
}

export default function App() {
  const [authState, setAuthState] = useState(() => readStoredAuth())

  useEffect(() => {
    persistAuth(authState.token, authState.user)
  }, [authState])

  const handleLogin = (session) => {
    setAuthState({ token: session.token, user: session.user })
  }

  const handleLogout = () => {
    setAuthState({ token: null, user: null })
  }

  return (
    <BrowserRouter>
      <AppLayout authState={authState} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  )
}

function AppLayout({ authState, onLogin, onLogout }) {
  const user = authState.user
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navigationItems = useMemo(() => {
    const items = [{ to: '/', label: 'Start' }]
    const roles = Array.isArray(user?.roles) ? user.roles : []

    if (!user) {
      items.push({ to: '/login', label: 'Log in' })
      items.push({ to: '/register', label: 'Register' })
    }

    if (roles.includes('Administrator') || roles.includes('Koordynator')) {
      items.push({ to: '/dashboard', label: 'Dashboard' })
    }

    if (roles.includes('Organizator')) {
      items.push({ to: '/organizer', label: 'Organizer' })
    }

    if (roles.includes('Wolontariusz') || roles.includes('Koordynator')) {
      items.push({ to: '/volunteer', label: 'Volunteer' })
    }

    items.push(
      { to: '/events-actions', label: 'Wydarzenia i działania' },
      { to: '/map', label: 'Map' },
    )

    return items
  }, [user])

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current)
  }

  const handleNavigation = () => {
    setIsMenuOpen(false)
  }

  const handleLogoutClick = () => {
    onLogout()
    setIsMenuOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="app">
      <header className="header">
        <img
          className="brand"
          src="/assets/mlodzi_dzialaja_logo_small.png"
          alt="Młodzi działają logo"
          height={48}
        />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          ☰
        </button>

        <nav className={`nav ${isMenuOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            ✕
          </button>
          {user ? (
            <div className="account-chip" aria-live="polite">
              <span>{user.login}</span>
              {user.type ? <span>{user.type}</span> : null}
            </div>
          ) : null}
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavigation}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <button
              type="button"
              className="nav-link nav-link--button"
              onClick={handleLogoutClick}
            >
              Wyloguj
            </button>
          ) : null}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<PublicInfoPage />} />
          <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organizer" element={<OrganizerPanelPage />} />
          <Route path="/organizer/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/volunteer" element={<VolunteerPanelPage />} />
          <Route path="/events-actions" element={<EventsAndActionsPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </div>
  )
}
