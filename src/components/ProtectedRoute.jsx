import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps a route so only signed-in users can access it.
 * Unauthenticated visitors are redirected to /cart with
 * { requireLogin: true } in location state so the Cart page
 * can surface a "please sign in" message.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // AuthProvider blocks rendering until Firebase resolves the
  // auth state, but guard defensively just in case.
  if (loading) return null;

  if (!currentUser) {
    return (
      <Navigate
        to="/cart"
        state={{ requireLogin: true, from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
