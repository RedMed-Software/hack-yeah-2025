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
import ProtectedRoute from './routes/ProtectedRoute.jsx'

const publicNavigation = [
  { to: '/', label: 'Start' },
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
  { to: '/map', label: 'Map' },
]

const privateNavigation = [
  { to: '/', label: 'Start' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/organizer', label: 'Organizer' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/map', label: 'Map' },
]

export default function App() {
  const { session, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = useMemo(() => (session ? privateNavigation : publicNavigation), [session])

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
            aria-controls="primary-navigation"
            onClick={toggleMenu}
          >
            Menu
            <span aria-hidden="true" className="menu-icon">☰</span>
          </button>
          <nav id="primary-navigation" className={isMenuOpen ? 'nav is-open' : 'nav'}>
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={handleNavigation}
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
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/organizer"
              element={(
                <ProtectedRoute>
                  <OrganizerPanelPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/volunteer"
              element={(
                <ProtectedRoute>
                  <VolunteerPanelPage />
                </ProtectedRoute>
              )}
            />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
