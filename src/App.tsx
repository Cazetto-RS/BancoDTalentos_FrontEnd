import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ExternalLayout from './layouts/Navbar/ExternalLayout'
import AdminLayout from './layouts/Admin/AdminLayout'

const HomePage = lazy(() => import('./pages/external/HomePage'))
const AboutPage = lazy(() => import('./pages/external/AboutPage'))
const JobsPage = lazy(() => import('./pages/external/JobsPage'))
const ProfilePage = lazy(() => import('./pages/external/ProfilePage'))
const RegistrationPage = lazy(() => import('./pages/external/RegistrationPage'))
const LoginPage = lazy(() => import('./pages/external/LoginPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage'))
const AdminCandidatesPage = lazy(() => import('./pages/admin/AdminCandidatesPage'))

function App() {
  return (
    <Suspense
      fallback={
        <div className="route-loading" role="status" aria-live="polite">
          <span className="route-loading__spinner" aria-hidden="true" />
          <span className="sr-only">Carregando página...</span>
        </div>
      }
    >
      <Routes>
        <Route element={<ExternalLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/vagas-abertas" element={<JobsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/cadastro" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="vagas" element={<AdminJobsPage />} />
          <Route path="candidatos" element={<AdminCandidatesPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
