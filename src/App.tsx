import {Navigate, Route, Routes} from 'react-router-dom'
import ExternalLayout from './layouts/Navbar/ExternalLayout'
import AdminLayout from './layouts/Admin/AdminLayout'

import HomePage from './pages/external/HomePage'
import AboutPage from './pages/external/AboutPage'
import JobsPage from './pages/external/JobsPage'
import ProfilePage from './pages/external/ProfilePage'
import RegistrationPage from './pages/external/RegistrationPage'
import LoginPage from './pages/external/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import AdminJobsPage from './pages/admin/AdminJobsPage'
import AdminCandidatesPage from './pages/admin/AdminCandidatesPage'

function App() {
  return (
    <Routes>
      <Route element={<ExternalLayout/>}>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/sobre' element={<AboutPage/>}/>
        <Route path='/vagas-abertas' element={<JobsPage/>}/>
        <Route path='/perfil' element={<ProfilePage/>}/>
        <Route path='/cadastro' element={<RegistrationPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Route>

      <Route path='/admin' element={<AdminLayout/>}>
        <Route index element={<Navigate to='/admin/dashboard' replace/>}/>
        <Route path='dashboard' element={<DashboardPage/>}/>
        <Route path='vagas' element={<AdminJobsPage/>}/>
        <Route path='candidatos' element={<AdminCandidatesPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
