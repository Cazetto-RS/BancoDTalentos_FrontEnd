import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ExternalLayout from './layouts/Navbar/ExternalLayout'
import AdminLayout from './layouts/Admin/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import PageTitle from './components/common/PageTitle'

const Home = lazy(() => import('./pages/external/HomePage'))
const About = lazy(() => import('./pages/external/AboutPage'))
const Jobs = lazy(() => import('./pages/external/JobsPage'))
const Profile = lazy(() => import('./pages/external/ProfilePage'))
const Register = lazy(() => import('./pages/external/RegistrationPage'))
const Login = lazy(() => import('./pages/external/LoginPage'))
const Dashboard = lazy(() => import('./pages/admin/DashboardPage'))
const AdminJobs = lazy(() => import('./pages/admin/AdminJobsPage'))
const Candidates = lazy(() => import('./pages/admin/AdminCandidatesPage'))
const NotFound = lazy(() => import('./pages/NotFoundPage'))
const page = (title: string, component: React.ReactNode) => <PageTitle title={title}>{component}</PageTitle>

export default function App() {
  return <Suspense fallback={<div className="route-loading" role="status"><span className="route-loading__spinner"/><span className="sr-only">Carregando...</span></div>}>
    <Routes>
      <Route element={<ExternalLayout />}>
        <Route path="/" element={page('Início', <Home />)} />
        <Route path="/sobre" element={page('Sobre', <About />)} />
        <Route path="/vagas-abertas" element={page('Vagas abertas', <Jobs />)} />
        <Route path="/cadastro" element={page('Criar conta', <Register />)} />
        <Route path="/login" element={page('Entrar', <Login />)} />
        <Route element={<ProtectedRoute roles={['candidato']} />}><Route path="/perfil" element={page('Meu perfil', <Profile />)} /></Route>
      </Route>
      <Route element={<ProtectedRoute roles={['rh', 'admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={page('Dashboard', <Dashboard />)} />
          <Route path="vagas" element={page('Gerenciar vagas', <AdminJobs />)} />
          <Route path="candidatos" element={page('Candidatos', <Candidates />)} />
        </Route>
      </Route>
      <Route path="*" element={page('Página não encontrada', <NotFound />)} />
    </Routes>
  </Suspense>
}
