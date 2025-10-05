import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRoute from './routes/PublicRoute.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicLayout from './layouts/PublicLayout/PublicLayout.jsx'
import MainLayout from './layouts/MainLayout/MainLayout.jsx'
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
import CalendarPage from "./pages/CalendarPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <PublicRoute>
              <PublicLayout />
            </PublicRoute>
          }
        >
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            path="/organizer"
            element={
              <ProtectedRoute roles={['organizer']}>
                <OrganizerPanelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId"
            element={
              <ProtectedRoute roles={['organizer']}>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/volunteer"
            element={
              <ProtectedRoute roles={['volunteer']}>
                <VolunteerPanelPage />
              </ProtectedRoute>
            }
          />
          <Route path="/events-actions" element={<EventsAndActionsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute roles={['coordinator']}>
                <CoordinatorProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
