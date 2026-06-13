import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const token = localStorage.getItem('token');

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
