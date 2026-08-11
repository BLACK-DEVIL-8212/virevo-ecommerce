import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user) {
    if (requiredRole === USER_ROLES.ADMIN && user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.SUPERADMIN) {
      return <Navigate to="/" replace />;
    }
    if (requiredRole === USER_ROLES.SUPERADMIN && user.role !== USER_ROLES.SUPERADMIN) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
