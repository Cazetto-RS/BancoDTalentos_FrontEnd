import {Route, Routes} from 'react-router-dom'
import ExternalLayout from './layouts/Navbar/ExternalLayout'

import HomePage from './pages/external/HomePage'
import AboutPage from './pages/external/AboutPage'
import JobsPage from './pages/external/JobsPage'
import ProfilePage from './pages/external/ProfilePage'
import RegistrationPage from './pages/external/RegistrationPage'

function App() {
  return (
    <Routes>
      <Route element={<ExternalLayout/>}>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/sobre' element={<AboutPage/>}/>
        <Route path='/vagas-abertas' element={<JobsPage/>}/>
        <Route path='/perfil' element={<ProfilePage/>}/>
        <Route path='/cadastro' element={<RegistrationPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
