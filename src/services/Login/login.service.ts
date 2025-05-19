import axios from 'axios';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginService = {
  signIn: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`http://localhost:3000/sign-in`, {
        email,
        password,
      });
      
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },
};
  