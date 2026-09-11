import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children, requiredPermission }) {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredPermission) {
    try {
      const stored = localStorage.getItem('adminUser');
      const adminUser = stored ? JSON.parse(stored) : {};
      const isSuperAdmin = !adminUser.role || adminUser.role === 'superadmin' || adminUser.permissions?.includes('*');
      
      if (!isSuperAdmin && !adminUser.permissions?.includes(requiredPermission)) {
        // Find user's first permitted module or fallback to login
        const fallback = adminUser.permissions?.[0];
        if (fallback) {
          return <Navigate to={`/admin/${fallback}`} replace />;
        }
        return <Navigate to="/admin/login" replace />;
      }
    } catch {
      // if error parsing, proceed normally
    }
  }

  return children;
}
