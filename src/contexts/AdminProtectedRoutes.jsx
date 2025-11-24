import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAdmin } from './AdminContexts';

const AdminProtectedRoute = () => {
  const { isAuthenticated, loading, checkAdminAuth } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check admin auth if not already authenticated and not loading
    if (!isAuthenticated && !loading) {
      const verifyAuth = async () => {
        const isAuth = await checkAdminAuth();
        if (!isAuth) {
          navigate('/adlog');
        }
      };
      verifyAuth();
    }
  }, [isAuthenticated, loading, navigate, checkAdminAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AdminProtectedRoute;
