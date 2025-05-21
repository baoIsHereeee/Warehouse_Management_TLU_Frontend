import axios from "axios";

export const getImports = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/imports', {
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

  export const getImportById = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/imports/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  export const createImport = async (importData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    const response = await axios.post('http://localhost:3000/imports', importData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  
  export const updateImport = async (id: string, importData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    const response = await axios.put(`http://localhost:3000/imports/${id}`, importData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  
  export const deleteImport = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    const response = await axios.delete(`http://localhost:3000/imports/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };