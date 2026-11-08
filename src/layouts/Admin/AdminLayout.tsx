import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/layout/AdminSidebar/AdminSidebar'
import NotificationCenter from '../../components/common/NotificationCenter'
import { useTheme, type Theme } from '../../contexts/ThemeContext'
import '../../styles/AdminLayout.css'

export type AdminTheme = Theme

function AdminLayout() {
    const { theme, setTheme } = useTheme()
    return (
        <div className="admin-layout">
            <AdminSidebar theme={theme} onThemeChange={setTheme} />
            <div className="admin-layout__notifications"><NotificationCenter /></div>
            <main className="admin-layout__content"><Outlet context={{ theme }} /></main>
        </div>
    )
}

export default AdminLayout
