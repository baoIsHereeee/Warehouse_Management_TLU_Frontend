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

  export const createRole = async (role: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.post('http://localhost:3000/roles', role, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }   

  export const updateRole = async (id: string, role: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.put(`http://localhost:3000/roles/${id}`, role, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }   

  export const deleteRole = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.delete(`http://localhost:3000/roles/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }   

  export const addRolePermission = async (id: string, permissionId: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.post(`http://localhost:3000/roles/${id}/permissions/${permissionId}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  export const removeRolePermission = async (id: string, permissionId: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.delete(`http://localhost:3000/roles/${id}/permissions/${permissionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }   
  