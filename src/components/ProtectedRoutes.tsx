import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { renewAccessToken, signOut } from '../services/Auth/auth.service';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await signOut(refreshToken);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      setIsAuthenticated(false);
    }
  };

  const isTokenExpired = (token: string) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const attemptTokenRenewal = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      handleLogout();
      return;
    }

    try {
      const { accessToken } = await renewAccessToken(refreshToken);
      localStorage.removeItem('accessToken');
      localStorage.setItem('accessToken', accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token renewal failed:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      handleLogout();
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(accessToken)) {
      attemptTokenRenewal();
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/log-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 