import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
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
      <div className="app">
        <header className="header">
          <span className="brand">HackYeah 2025</span>
          <nav className="nav">
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
    </BrowserRouter>
  )
}
