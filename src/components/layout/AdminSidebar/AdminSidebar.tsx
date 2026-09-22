import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoImg from '../../../assets/logo.png'
import AdminIcon, { type AdminIconName } from '../../admin/AdminIcon'
import AdminSettingsModal from '../../admin/AdminSettingsModal'
import type { AdminTheme } from '../../../layouts/Admin/AdminLayout'
import type { AdminUser } from '../../../types/AdminUser'
import '../../../styles/AdminSidebar.css'
import { useAuth } from '../../../contexts/AuthContext'

interface AdminSidebarProps {
    theme: AdminTheme
    onThemeChange: (theme: AdminTheme) => void
}

const navigationItems: Array<{ label: string; path: string; icon: AdminIconName }> = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Vagas', path: '/admin/vagas', icon: 'briefcase' },
    { label: 'Candidatos', path: '/admin/candidatos', icon: 'users' },
    { label: 'Configurações', path: '/admin/configuracoes', icon: 'settings' },
]

function AdminSidebar({ theme, onThemeChange }: AdminSidebarProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const { user, logout } = useAuth(); const navigate = useNavigate()
    const currentUser: AdminUser = { id: user!.id, fullName: user!.nome_completo, email: user!.email, role: user!.cargo as 'admin' | 'rh', createdAt: '' }
    const doLogout = async () => { await logout(); navigate('/', { replace: true }) }

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [])

    return (
        <>
            <header className="admin-mobile-header">
                <button
                    className="admin-mobile-header__button"
                    type="button"
                    aria-label={menuOpen ? 'Fechar menu administrativo' : 'Abrir menu administrativo'}
                    aria-expanded={menuOpen}
                    aria-controls="admin-sidebar-menu"
                    onClick={() => setMenuOpen((current) => !current)}
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>
                <Link to="/admin/dashboard" aria-label="Ir para o dashboard">
                    <img src={logoImg} alt="" />
                </Link>
                <strong>Painel administrativo</strong>
            </header>

            {menuOpen && <button className="admin-sidebar__backdrop" type="button" aria-label="Fechar menu administrativo" onClick={() => setMenuOpen(false)} />}

            <aside className={`admin-sidebar${menuOpen ? ' is-open' : ''}`} id="admin-sidebar-menu">
                <Link className="admin-sidebar__brand" to="/admin/dashboard" aria-label="Ir para o dashboard" onClick={() => setMenuOpen(false)}>
                    <img src={logoImg} alt="" />
                </Link>

                <nav className="admin-sidebar__navigation" aria-label="Navegação administrativa">
                    {navigationItems.map((item) => item.path === '/admin/configuracoes' ? (
                        <button
                            className={`admin-sidebar__link admin-sidebar__settings${settingsOpen ? ' is-active' : ''}`}
                            type="button"
                            key={item.path}
                            onClick={() => {
                                setMenuOpen(false)
                                setSettingsOpen(true)
                            }}
                            aria-haspopup="dialog"
                            aria-expanded={settingsOpen}
                        >
                            <span className="admin-sidebar__icon" aria-hidden="true"><AdminIcon name={item.icon} /></span>
                            <span>{item.label}</span>
                        </button>
                    ) : (
                        <NavLink
                            className={({ isActive }) => `admin-sidebar__link${isActive ? ' is-active' : ''}`}
                            to={item.path}
                            end
                            key={item.path}
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="admin-sidebar__icon" aria-hidden="true">
                                <AdminIcon name={item.icon} />
                            </span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <footer className="admin-sidebar__footer">
                    <div className="admin-sidebar__user">
                        <strong>{currentUser.fullName}</strong>
                        <span>{currentUser.email}</span>
                    </div>

                    <button className="admin-sidebar__logout" type="button" onClick={doLogout}>
                        <span className="admin-sidebar__icon" data-icon="logout" aria-hidden="true">
                            <AdminIcon name="logout" />
                        </span>
                        <span>Logout</span>
                    </button>
                </footer>
            </aside>

            {settingsOpen && (
                <AdminSettingsModal
                    user={currentUser}
                    theme={theme}
                    onThemeChange={onThemeChange}
                    onClose={() => setSettingsOpen(false)}
                />
            )}
        </>
    )
}

export default AdminSidebar
