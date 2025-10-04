import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PublicInfoPage from './pages/PublicInfoPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import OrganizerPanelPage from './pages/OrganizerPanelPage.jsx'
import VolunteerPanelPage from './pages/VolunteerPanelPage.jsx'
import MapPage from './pages/MapPage.jsx'

const navigation = [
  { to: '/', label: 'Start' },
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/organizer', label: 'Organizer' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/map', label: 'Map' },
]

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

function AppLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsNavOpen(false)
  }, [location.pathname])

  return (
    <div className="app">
      <header className="header">
        <div className="header-bar">
          <span className="brand">HackYeah 2025</span>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={isNavOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsNavOpen((current) => !current)}
          >
            Menu
          </button>
        </div>
        <nav id="primary-navigation" className={`nav${isNavOpen ? ' nav-open' : ''}`}>
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
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
          <Route path="/volunteer" element={<VolunteerPanelPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </div>
  )
}
