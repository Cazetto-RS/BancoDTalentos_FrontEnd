import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/layout/AdminSidebar/AdminSidebar'
import '../../styles/AdminLayout.css'

export type AdminTheme = 'light' | 'dark'

function getInitialTheme(): AdminTheme {
    const savedTheme = localStorage.getItem('admin-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function AdminLayout() {
    const [theme, setTheme] = useState<AdminTheme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem('admin-theme', theme)
    }, [theme])

    useEffect(() => () => {
        delete document.documentElement.dataset.theme
    }, [])

    return (
        <div className="admin-layout">
            <AdminSidebar theme={theme} onThemeChange={setTheme} />
            <main className="admin-layout__content">
                <Outlet context={{ theme }} />
            </main>
        </div>
    )
}

export default AdminLayout
