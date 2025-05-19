import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const isAuthenticated = accessToken !== null;

  // Check if token is expired
  const isTokenExpired = () => {
    if (!accessToken) return true;
    
    try {
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      const currentTime = Date.now() / 1000; // Convert to seconds
      
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If there's an error decoding, consider token invalid
    }
  };

  if (!isAuthenticated || isTokenExpired()) {
    // Clear the expired token
    localStorage.removeItem('accessToken');
    return <Navigate to="/log-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 