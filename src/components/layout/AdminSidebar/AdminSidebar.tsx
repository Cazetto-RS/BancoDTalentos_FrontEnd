import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoImg from '../../../assets/logo.png'
import AdminSettingsModal from '../../admin/AdminSettingsModal'
import type { AdminTheme } from '../../../layouts/Admin/AdminLayout'
import type { AdminUser } from '../../../types/AdminUser'
import '../../../styles/AdminSidebar.css'

interface AdminSidebarProps {
    theme: AdminTheme
    onThemeChange: (theme: AdminTheme) => void
}

const currentUser: AdminUser = {
    id: 1,
    fullName: 'Nome Sobrenome',
    email: 'nome.sobrenome@gmail.com',
    role: 'admin',
    createdAt: '2026-01-15',
}

const navigationItems = [
    {
        label: 'Dashboard', path: '/admin/dashboard', icon: <svg width="1548" height="1548" viewBox="0 0 1548 1548" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1462 0H946C898.504 0 860 38.5035 860 86V774C860 821.497 898.504 860 946 860H1462C1509.5 860 1548 821.497 1548 774V86C1548 38.5035 1509.5 0 1462 0Z" />
            <path d="M602 0H86C38.5035 0 0 38.5035 0 86V430C0 477.496 38.5035 516 86 516H602C649.497 516 688 477.496 688 430V86C688 38.5035 649.497 0 602 0Z" />
            <path d="M1462 1032H946C898.504 1032 860 1070.5 860 1118V1462C860 1509.5 898.504 1548 946 1548H1462C1509.5 1548 1548 1509.5 1548 1462V1118C1548 1070.5 1509.5 1032 1462 1032Z" />
            <path d="M602 688H86C38.5035 688 0 726.504 0 774V1462C0 1509.5 38.5035 1548 86 1548H602C649.497 1548 688 1509.5 688 1462V774C688 726.504 649.497 688 602 688Z" />
        </svg>
    },
    {
        label: 'Vagas', path: '/admin/vagas', icon: <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 36V7.57895H11.4V0H26.6V7.57895H38V36H0ZM15.2 7.57895H22.8V3.78947H15.2V7.57895Z" />
        </svg>
    },
    {
        label: 'Candidatos', path: '/admin/candidatos', icon: <svg viewBox="0 0 435 435" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M217.5 217C277.423 217 326 168.423 326 108.5C326 48.5771 277.423 0 217.5 0C157.577 0 109 48.5771 109 108.5C109 168.423 157.577 217 217.5 217Z" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M217.5 245C144.909 245 0 281.371 0 353.571V435H435V353.571C435 281.371 290.091 245 217.5 245Z" />
        </svg>
    },
    {
        label: 'Configurações', path: '/admin/configuracoes', icon: <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.801 38L13.0448 31.92C12.6352 31.7617 12.2495 31.5717 11.8878 31.35C11.526 31.1283 11.1712 30.8908 10.8234 30.6375L5.199 33.0125L0 23.9875L4.86816 20.2825C4.83665 20.0608 4.8209 19.8474 4.8209 19.6422V18.3597C4.8209 18.1532 4.83665 17.9392 4.86816 17.7175L0 14.0125L5.199 4.9875L10.8234 7.3625C11.17 7.10917 11.5323 6.87167 11.9104 6.65C12.2886 6.42833 12.6667 6.23833 13.0448 6.08L13.801 0H24.199L24.9552 6.08C25.3648 6.23833 25.7511 6.42833 26.1141 6.65C26.4771 6.87167 26.8313 7.10917 27.1766 7.3625L32.801 4.9875L38 14.0125L33.1318 17.7175C33.1634 17.9392 33.1791 18.1532 33.1791 18.3597V19.6403C33.1791 19.8468 33.1476 20.0608 33.0846 20.2825L37.9527 23.9875L32.7537 33.0125L27.1766 30.6375C26.83 30.8908 26.4677 31.1283 26.0896 31.35C25.7114 31.5717 25.3333 31.7617 24.9552 31.92L24.199 38H13.801ZM19.0945 25.65C20.9221 25.65 22.4818 25.0008 23.7736 23.7025C25.0655 22.4042 25.7114 20.8367 25.7114 19C25.7114 17.1633 25.0655 15.5958 23.7736 14.2975C22.4818 12.9992 20.9221 12.35 19.0945 12.35C17.2355 12.35 15.6676 12.9992 14.3908 14.2975C13.1141 15.5958 12.4764 17.1633 12.4776 19C12.4789 20.8367 13.1172 22.4042 14.3927 23.7025C15.6682 25.0008 17.2355 25.65 19.0945 25.65Z" />
        </svg>

    },
]

function AdminSidebar({ theme, onThemeChange }: AdminSidebarProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)

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
                            <span className="admin-sidebar__icon" aria-hidden="true">{item.icon}</span>
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
                                {item.icon}
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

                    <Link className="admin-sidebar__logout" to="/login" onClick={() => setMenuOpen(false)}>
                        <span className="admin-sidebar__icon" data-icon="logout" aria-hidden="true">
                            <svg width="1519" height="1545" viewBox="0 0 1519 1545" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M321.842 1544.94C305.106 1544.94 289.658 1538.51 276.784 1526.92L19.3105 1278.46C7.42874 1265.89 0.55971 1249.4 0 1232.11L0 312.93C0 296.194 7.72421 279.459 19.3105 266.585L276.784 18.1227C296.095 0.0995709 323.13 -5.04991 347.59 5.24905C370.762 15.548 386.211 38.7206 386.211 64.468V1480.57C386.211 1506.32 370.762 1529.49 347.59 1539.79C338.578 1543.66 330.854 1544.94 321.842 1544.94ZM1223 1094.36C1215.28 1094.36 1206.26 1093.08 1198.54 1089.21C1186.79 1084.38 1176.72 1076.18 1169.62 1065.65C1162.52 1055.11 1158.7 1042.7 1158.63 1029.99L1157.34 507.323C1157.34 481.576 1172.79 457.116 1197.25 448.104C1221.71 437.805 1248.75 444.242 1266.77 462.265L1481.76 681.118C1530.68 731.325 1530.68 812.429 1480.47 862.637L1268.06 1075.05C1262.31 1081.24 1255.33 1086.15 1247.57 1089.48C1239.81 1092.8 1231.44 1094.47 1223 1094.36Z" />
                                <path d="M1306.83 772.421H534.408" stroke-width="93" stroke-linecap="square" />
                                <rect x="341.292" y="271.942" width="428" height="100" />
                                <rect x="341.292" y="1174.94" width="428" height="100" />
                                <rect x="669.292" y="552.942" width="191" height="100" transform="rotate(-90 669.292 552.942)" />
                                <rect x="669.292" y="1217.94" width="234" height="100" transform="rotate(-90 669.292 1217.94)" />
                            </svg>

                        </span>
                        <span>Logout</span>
                    </Link>
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
