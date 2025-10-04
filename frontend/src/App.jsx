import { useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import PublicInfoPage from './pages/PublicInfoPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import OrganizerPanelPage from './pages/OrganizerPanelPage.jsx'
import VolunteerPanelPage from './pages/VolunteerPanelPage.jsx'
import MapPage from './pages/MapPage.jsx'
import { useAuth } from './providers/useAuth.js'

const navigationItems = [
  { to: '/', label: 'Start' },
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/organizer', label: 'Organizer' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/map', label: 'Map' },
]

export default function App() {
  const { session, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current)
  }

  const handleNavigation = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    setIsMenuOpen(false)
    await logout()
  }

  const accountLabel = useMemo(() => {
    const traits = session?.identity?.traits
    if (!traits) {
      return null
    }
    if (typeof traits.email === 'string' && traits.email.length > 0) {
      return traits.email
    }
    if (typeof traits.username === 'string' && traits.username.length > 0) {
      return traits.username
    }
    return session?.identity?.id ?? null
  }, [session])

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <span className="brand">HackYeah 2025</span>
          {accountLabel ? <span className="account-chip">{accountLabel}</span> : null}
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
            {session ? (
              <button type="button" className="nav-link nav-link--button" onClick={handleLogout}>
                Log out
              </button>
            ) : null}
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<PublicInfoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/organizer" element={<OrganizerPanelPage />} />
            <Route path="/volunteer" element={<VolunteerPanelPage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
