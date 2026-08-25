import {Outlet} from 'react-router-dom'
import NavBar from '../../components/layout/NavBar/Navbar'

function ExternalLayout() {
    return (
        <>
            <NavBar/>

            <main className="external-layout__content">
                <Outlet/>
            </main>
        </>
    )
}

export default ExternalLayout;
