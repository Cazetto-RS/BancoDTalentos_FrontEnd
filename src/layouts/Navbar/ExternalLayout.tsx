import {Outlet} from 'react-router-dom'
import NavBar from '../../components/layout/NavBar/Navbar'

function ExternalLayout() {
    return (
        <>
            <NavBar/>

            <main>
                <Outlet/>
            </main>
        </>
    )
}

export default ExternalLayout;