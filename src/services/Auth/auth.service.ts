import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface DecodedToken {
  id: string;
  email: string;
  roles: any[];
  tenant: string;
}

export const loginService = {
  signIn: async (email: string, password: string, tenantName: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`http://localhost:3000/sign-in/${tenantName}`, {
        email,
        password,
      });
      
      const { accessToken, refreshToken } = response.data;
      
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tenantId', decodedToken.tenant);
      
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },
};

export const renewAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  try {
    const response = await axios.post('http://localhost:3000/renew-access-token', {
      refreshToken
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
  