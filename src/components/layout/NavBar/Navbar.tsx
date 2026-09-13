import '../../../styles/Navbar.css'
import logoImg from '../../../assets/logo.png'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [])

    return (
        <header className="navbar">
            <nav className="navbar__content" aria-label="Navegação principal">
                <Link className="navbar__brand" to="/">
                    <img src={logoImg} alt="" />
                </Link>

                <ul className="navbar__links">
                    <li><NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/" end>Home</NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/sobre">Sobre</NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/vagas-abertas">Vagas</NavLink></li>
                </ul>

                <div className="navbar__actions">
                    <Link className="navbar__profile__vazado" to="/cadastro">
                        <span className="navbar__profile-text">Registrar-se</span>


                        <svg viewBox="0 0 445 442" className="navbar__profile-arrow" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.09721e-05 305.566L1.09721e-05 136.434L224.747 136.434L224.747 1.33701e-05L445 221L224.747 442L224.747 305.566L1.09721e-05 305.566Z" fill='#ffffff' />
                        </svg>

                    </Link>

                    <Link className="navbar__profile" to="/login">
                        <span className="navbar__profile-text">Login</span>


                        <svg viewBox="0 0 445 442" className="navbar__profile-arrow" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.09721e-05 305.566L1.09721e-05 136.434L224.747 136.434L224.747 1.33701e-05L445 221L224.747 442L224.747 305.566L1.09721e-05 305.566Z" fill='#ffffff' />
                        </svg>

                    </Link>

                    {/* <svg viewBox="0 0 435 435" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M217.5 217C277.423 217 326 168.423 326 108.5C326 48.5771 277.423 0 217.5 0C157.577 0 109 48.5771 109 108.5C109 168.423 157.577 217 217.5 217Z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M217.5 245C144.909 245 0 281.371 0 353.571V435H435V353.571C435 281.371 290.091 245 217.5 245Z" />
                    </svg> */}


                    <button
                        className="navbar__menu-button"
                        type="button"
                        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                        aria-expanded={menuOpen}
                        aria-controls="navbar-mobile-menu"
                        onClick={() => setMenuOpen((current) => !current)}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>
                </div>
            </nav>

            <nav
                className={`navbar__mobile-menu${menuOpen ? ' is-open' : ''}`}
                id="navbar-mobile-menu"
                aria-label="Navegação mobile"
                aria-hidden={!menuOpen}
            >
                <NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</NavLink>
                <NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/vagas-abertas" onClick={() => setMenuOpen(false)}>Vagas</NavLink>
                <Link className="navbar__mobile-register" to="/cadastro" onClick={() => setMenuOpen(false)}>Registrar-se</Link>
                <Link className="navbar__mobile-login" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </nav>

            {menuOpen && <button className="navbar__backdrop" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
        </header>
    )
}

export default Navbar
