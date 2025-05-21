import axios from 'axios';

export const getUsers = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/users', {
      params: {
        page,
        limit,
        search,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    return response.data;
  };

  export const getUserById = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  };

  export const createUser = async (userData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }   

    const response = await axios.post('http://localhost:3000/users', userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });     

    return response.data;
  };

  export const updateUser = async (id: string, userData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.put(`http://localhost:3000/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;   
  };

  export const deleteUser = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.delete(`http://localhost:3000/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  };

  export const addUserRole = async (id: string, roleId: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.post(`http://localhost:3000/users-roles/${roleId}/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  };  

  export const removeUserRole = async (id: string, roleId: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.delete(`http://localhost:3000/users-roles/${roleId}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  };  
