import '../../../styles/Navbar.css'
import logoImg from '../../../assets/logo.png'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import NotificationCenter from '../../common/NotificationCenter'
import { useTheme } from '../../../contexts/ThemeContext'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
    const themeIcon = theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.9 13A9 9 0 0 1 11 3.1a9 9 0 1 0 9.9 9.9Z"/>
        </svg>
    )
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
                    <button className="navbar__theme-toggle" type="button" onClick={toggleTheme}
                        aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'} aria-pressed={theme === 'dark'}>
                        {themeIcon}
                    </button>
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
                <button className="navbar__mobile-theme" type="button" onClick={toggleTheme}> {themeIcon}<span>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span> </button>
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
