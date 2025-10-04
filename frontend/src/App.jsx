// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx'
import OrganizerPanelPage from './pages/OrganizerPanelPage/OrganizerPanelPage.jsx'
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage.jsx'
import VolunteerPanelPage from './pages/VolunteerPanelPage/VolunteerPanelPage.jsx'
import MapPage from './pages/MapPage/MapPage.jsx'
import EventsAndActionsPage from './pages/EventsAndActionsPage/EventsAndActionsPage.jsx'
import CoordinatorProfilePage from './pages/CoordinatorProfilePage/CoordinatorProfilePage.jsx'
import PublicLayout from './layouts/PublicLayout/PublicLayout.jsx'
import MainLayout from './layouts/MainLayout/MainLayout.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organizer" element={<OrganizerPanelPage />} />
          <Route path="/organizer/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/volunteer" element={<VolunteerPanelPage />} />
          <Route path="/events-actions" element={<EventsAndActionsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/coordinator" element={<CoordinatorProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
