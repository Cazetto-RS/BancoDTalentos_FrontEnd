import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar/Navbar'

function ExternalLayout() {
    const contentRef = useRef<HTMLDivElement>(null)
    const { pathname } = useLocation()
    useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
    return (
        <>
            <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
            <NavBar/>

            <div className="external-layout__content" id="conteudo-principal" tabIndex={-1} ref={contentRef}>
                <Outlet/>
            </div>
        </>
    )
}

export default ExternalLayout;
