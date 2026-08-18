import {Route, Routes} from 'react-router-dom'
import ExternalLayout from './layouts/Navbar/ExternalLayout'

import HomePage from './pages/external/HomePage'

function App() {
  return (
    <Routes>
      <Route element={<ExternalLayout/>}>
        <Route path='/' element={<HomePage/>}/>
      </Route>
    </Routes>
  )
}

export default App
