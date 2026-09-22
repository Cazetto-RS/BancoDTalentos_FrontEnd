import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, type UserRole } from '../../contexts/AuthContext'

export default function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
    const { isAuthenticated, user } = useAuth(); const location = useLocation()
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
    if (roles && (!user || !roles.includes(user.cargo))) return <Navigate to={user?.cargo === 'candidato' ? '/perfil' : '/admin/dashboard'} replace />
    return <Outlet />
}
