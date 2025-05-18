import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAdmin } from './AdminContexts';

const AdminProtectedRoute = () => {
  const { isAuthenticated, loading, checkAdminAuth } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAdminAuth();
      if (!isAuth && !loading) {
        navigate('/adlog');
      }
    };
    verifyAuth();
  }, [isAuthenticated, loading, navigate, checkAdminAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AdminProtectedRoute;
