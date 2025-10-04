import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import PublicInfoPage from './pages/PublicInfoPage/PublicInfoPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx'
import OrganizerPanelPage from './pages/OrganizerPanelPage/OrganizerPanelPage.jsx'
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage.jsx'
import VolunteerPanelPage from './pages/VolunteerPanelPage/VolunteerPanelPage.jsx'
import MapPage from './pages/MapPage/MapPage.jsx'
import EventsAndActionsPage from './pages/EventsAndActionsPage/EventsAndActionsPage.jsx'
const navigationItems = [
  { to: '/', label: 'Start' },
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/organizer', label: 'Organizer' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/events-actions', label: 'Wydarzenia i działania' },
  { to: '/map', label: 'Map' },
]

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current)
  }

  const handleNavigation = () => {
    setIsMenuOpen(false)
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <img
            className="brand"
            src="/assets/mlodzi_dzialaja_logo_small2.png"
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
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<PublicInfoPage />} />
            <Route path="/login" element={<LoginPage />} />
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
    </BrowserRouter>
  )
}
