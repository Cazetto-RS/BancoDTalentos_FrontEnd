import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/layout/AdminSidebar/AdminSidebar'
import '../../styles/AdminLayout.css'

function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-layout__content">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
