import '../../../styles/Navbar.css'
import logoImg from '../../../assets/logo.png'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import NotificationCenter from '../../common/NotificationCenter'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const accountPath = user?.cargo === 'candidato' ? '/perfil' : '/admin/dashboard'

    const handleLogout = async () => {
        await logout()
        setMenuOpen(false)
        navigate('/')
    }

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus() }
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [menuOpen])

    return (
        <header className="navbar">
            <nav className="navbar__content" aria-label="Navegação principal">
                <Link className="navbar__brand" to="/" aria-label="Banco de Talentos — início">
                    <img src={logoImg} alt="" />
                </Link>

                <ul className="navbar__links">
                    <li><NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/" end>Home</NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/sobre">Sobre</NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/vagas-abertas">Vagas</NavLink></li>
                </ul>

                <div className="navbar__actions">
                    <NotificationCenter />
                    <Link className="navbar__profile__vazado" to={isAuthenticated ? accountPath : '/cadastro'}>
                        <span className="navbar__profile-text">{isAuthenticated ? 'Minha conta' : 'Registrar-se'}</span>

                    </Link>

                    {isAuthenticated ? <button className="navbar__profile" type="button" onClick={handleLogout}>
                        <span className="navbar__profile-text">Sair</span>

                    </button> : <Link className="navbar__profile" to="/login">
                        <span className="navbar__profile-text">Login</span>

                    </Link>}




                    <button
                        className="navbar__menu-button"
                        ref={menuButtonRef}
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
                inert={!menuOpen}
            >
                <NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</NavLink>
                <NavLink className={({ isActive }) => isActive ? 'is-active' : ''} to="/vagas-abertas" onClick={() => setMenuOpen(false)}>Vagas</NavLink>
                <Link className="navbar__mobile-register" to={isAuthenticated ? accountPath : '/cadastro'} onClick={() => setMenuOpen(false)}>{isAuthenticated ? 'Minha conta' : 'Registrar-se'}</Link>
                {isAuthenticated
                    ? <button className="navbar__mobile-login" type="button" onClick={handleLogout}>Sair</button>
                    : <Link className="navbar__mobile-login" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
            </nav>

            {menuOpen && <button className="navbar__backdrop" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
        </header>
    )
}

export default Navbar
