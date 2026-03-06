import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import PortalLayout from '../layout/PortalLayout';

export default function ProtectedRoute({ role }) {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== role) return <Navigate to="/login" replace />;
    return <PortalLayout role={role}><Outlet /></PortalLayout>;
}
