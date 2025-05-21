import axios from 'axios';
export const getRoles = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/roles', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  };  